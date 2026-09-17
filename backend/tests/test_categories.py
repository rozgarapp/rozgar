"""Backend tests for 9-category expansion, female-protected trades, Skilled/Unskilled filter, /categories/stats."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "mdstabrez1@gmail.com"
ADMIN_PASSWORD = "Rozgar@2025"

EXPECTED_CATEGORIES = {
    "construction", "industrial", "electrical", "domestic",
    "agriculture", "logistics", "beauty", "healthcare", "unskilled"
}

FEMALE_TRADES = {
    "Beautician", "Baby Caretaker/Nanny", "Elder Care Attendant", "Housekeeping Staff",
    "Mehendi Artist", "Makeup Artist", "Spa Therapist", "Nail Technician",
    "Waxing Specialist", "Facial Therapist", "Massage Therapist", "Home Nurse",
}


def _h(tok):
    return {"Authorization": f"Bearer {tok}"}


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def any_employer_token():
    email = f"test_emp_{uuid.uuid4().hex[:8]}@ex.com"
    r = requests.post(f"{API}/auth/register", json={
        "email": email, "password": "Pass@123", "name": "TEST emp",
        "role": "employer", "phone": "+91 9876543210"
    })
    assert r.status_code == 200, r.text
    return r.json()["token"]


class TestWorkersList:
    def test_seeded_workers_across_9_categories(self):
        r = requests.get(f"{API}/workers")
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) >= 45, f"expected >=45 workers, got {len(docs)}"
        cats = {d.get("category") for d in docs}
        missing = EXPECTED_CATEGORIES - cats
        assert not missing, f"missing categories in seed: {missing}"

    def test_no_mongo_id_leaked(self):
        docs = requests.get(f"{API}/workers").json()
        for d in docs:
            assert "_id" not in d
            assert "phone" not in d
            assert "masked_phone" in d
            assert "is_female_protected" in d

    def test_skill_skilled_excludes_unskilled(self):
        r = requests.get(f"{API}/workers", params={"skill": "skilled"})
        assert r.status_code == 200
        for d in r.json():
            assert d["category"] != "unskilled"

    def test_skill_unskilled_only_unskilled(self):
        r = requests.get(f"{API}/workers", params={"skill": "unskilled"})
        assert r.status_code == 200
        docs = r.json()
        assert len(docs) >= 1, "expected at least 1 unskilled worker seeded"
        for d in docs:
            assert d["category"] == "unskilled"

    def test_category_agriculture(self):
        docs = requests.get(f"{API}/workers", params={"category": "agriculture"}).json()
        # may be 0 if seed random didn't pick, but keys should be agriculture if any
        for d in docs:
            assert d["category"] == "agriculture"
            assert d["emoji"], "emoji should be present"

    def test_female_protected_flag_on_female_trade(self):
        # scan all workers and confirm flag matches trade
        docs = requests.get(f"{API}/workers").json()
        checked = 0
        for d in docs:
            if d["trade"] in FEMALE_TRADES:
                assert d["is_female_protected"] is True, f"{d['trade']} should be protected"
                checked += 1
            else:
                assert d["is_female_protected"] is False
        # Not strictly required to have any female-trade seeds, but log it
        print(f"female-protected workers seeded: {checked}")

    def test_trade_filter_returns_matching(self):
        # try a bunch of trades; ensure the endpoint accepts them without 5xx
        for trade in ["Solar Panel Installer", "Home Nurse", "Tractor Operator", "Mehendi Artist"]:
            r = requests.get(f"{API}/workers", params={"trade": trade})
            assert r.status_code == 200
            for d in r.json():
                assert d["trade"] == trade


class TestCategoryStats:
    def test_requires_admin(self, any_employer_token):
        r = requests.get(f"{API}/categories/stats", headers=_h(any_employer_token))
        assert r.status_code == 403

    def test_returns_9_categories_with_counts(self, admin_token):
        r = requests.get(f"{API}/categories/stats", headers=_h(admin_token))
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 9
        keys = {c["category"] for c in data}
        assert keys == EXPECTED_CATEGORIES
        total_trades = 0
        for c in data:
            assert "worker_count" in c
            assert "trade_count" in c
            assert isinstance(c["trades"], list)
            assert c["trade_count"] == len(c["trades"])
            total_trades += c["trade_count"]
        # spec: >=100 trades
        assert total_trades >= 100, f"expected >=100 trades, got {total_trades}"
