"""Backend tests for Rozgar monetisation, contact unlock, boosts, premium, admin settings."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://trade-jobs-app.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "mdstabrez1@gmail.com"
ADMIN_PASSWORD = "Rozgar@2025"


def _register_login(role):
    email = f"test_{role}_{uuid.uuid4().hex[:8]}@ex.com"
    r = requests.post(f"{API}/auth/register", json={
        "email": email, "password": "Pass@123", "name": f"T {role}",
        "role": role, "phone": "+91 9876543210"
    })
    assert r.status_code == 200, r.text
    return r.json()["token"], r.json()["user_id"], email


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def worker_token():
    tok, uid, _ = _register_login("worker")
    return tok, uid


@pytest.fixture(scope="module")
def employer_token():
    tok, uid, _ = _register_login("employer")
    return tok, uid


def _h(tok):
    return {"Authorization": f"Bearer {tok}"}


# ---------------- Settings ----------------
class TestSettings:
    def test_get_settings_defaults(self):
        r = requests.get(f"{API}/settings")
        assert r.status_code == 200
        d = r.json()
        assert d["admob_app_id"].startswith("ca-app-pub-")
        assert d["banner_ad_unit_id"]
        assert d["interstitial_ad_unit_id"]
        assert d["rewarded_ad_unit_id"]
        assert d["ad_test_mode"] is True
        assert d["razorpay_key_id"].startswith("rzp_test_")
        assert "razorpay_key_secret" not in d

    def test_put_settings_non_admin_forbidden(self, worker_token):
        tok, _ = worker_token
        r = requests.put(f"{API}/settings", headers=_h(tok), json={"ad_test_mode": True})
        assert r.status_code == 403

    def test_put_settings_admin_ok(self, admin_token):
        r = requests.put(f"{API}/settings", headers=_h(admin_token), json={
            "admob_app_id": "ca-app-pub-3940256099942544~3347511713",
            "banner_ad_unit_id": "ca-app-pub-3940256099942544/6300978111",
            "interstitial_ad_unit_id": "ca-app-pub-3940256099942544/1033173712",
            "rewarded_ad_unit_id": "ca-app-pub-3940256099942544/5224354917",
            "ad_test_mode": True,
            "razorpay_key_id": "rzp_test_1DP5mmOlF5G5ag",
            "razorpay_key_secret": ""
        })
        assert r.status_code == 200
        assert r.json()["ok"] is True


# ---------------- Payments ----------------
class TestPayments:
    def test_order_unlock(self, worker_token):
        tok, _ = worker_token
        r = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "unlock", "reference_id": "w_seed_000"
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["amount"] == 3000
        assert d["order_id"].startswith("order_")
        assert d["key_id"]

    def test_order_boost_district(self, employer_token):
        tok, _ = employer_token
        r = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "boost_district", "reference_id": "job_seed_000"
        })
        assert r.status_code == 200
        assert r.json()["amount"] == 9900

    def test_order_boost_statewide(self, employer_token):
        tok, _ = employer_token
        r = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "boost_statewide", "reference_id": "job_seed_001"
        })
        assert r.status_code == 200
        assert r.json()["amount"] == 29900

    def test_order_premium(self, worker_token):
        tok, _ = worker_token
        r = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "premium"
        })
        assert r.status_code == 200
        assert r.json()["amount"] == 9900

    def test_verify_unlock(self, worker_token):
        tok, _ = worker_token
        # order first
        o = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "unlock", "reference_id": "w_seed_001"
        }).json()
        r = requests.post(f"{API}/payments/verify", headers=_h(tok), json={
            "purpose": "unlock", "reference_id": "w_seed_001",
            "razorpay_order_id": o["order_id"], "razorpay_payment_id": "pay_fake_123"
        })
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["ok"] is True
        assert d["phone"]
        assert "wa.me/" in d["whatsapp"]

        # unlock status now true
        s = requests.get(f"{API}/workers/w_seed_001/unlock/status", headers=_h(tok))
        assert s.status_code == 200
        assert s.json()["unlocked"] is True

    def test_verify_boost_district_and_job_flag(self, employer_token):
        tok, _ = employer_token
        # create employer's own job
        job = requests.post(f"{API}/jobs", headers=_h(tok), json={
            "title": "TEST Boost Job", "trade": "Carpenter", "category": "construction",
            "daily_rate": 1000, "district": "Hyderabad", "workers_needed": 2,
            "start_date": "2026-02-01", "description": "test"
        }).json()
        job_id = job["job_id"]
        o = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "boost_district", "reference_id": job_id
        }).json()
        r = requests.post(f"{API}/payments/verify", headers=_h(tok), json={
            "purpose": "boost_district", "reference_id": job_id,
            "razorpay_order_id": o["order_id"], "razorpay_payment_id": "pay_x"
        })
        assert r.status_code == 200
        assert r.json()["boost_type"] == "district"

        # verify job flag
        jj = requests.get(f"{API}/jobs/{job_id}").json()
        assert jj.get("boosted") is True
        assert jj.get("boost_type") == "district"
        assert jj.get("boost_expires_at")

    def test_verify_boost_statewide_and_shows_in_other_district(self, employer_token):
        tok, _ = employer_token
        job = requests.post(f"{API}/jobs", headers=_h(tok), json={
            "title": "TEST Statewide Boost", "trade": "Plumber", "category": "construction",
            "daily_rate": 1200, "district": "Adilabad", "workers_needed": 1,
            "start_date": "2026-02-01", "description": "test"
        }).json()
        job_id = job["job_id"]
        o = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "boost_statewide", "reference_id": job_id
        }).json()
        r = requests.post(f"{API}/payments/verify", headers=_h(tok), json={
            "purpose": "boost_statewide", "reference_id": job_id,
            "razorpay_order_id": o["order_id"], "razorpay_payment_id": "pay_x"
        })
        assert r.status_code == 200
        assert r.json()["boost_type"] == "statewide"

        # Query jobs in Hyderabad district - statewide should show
        lst = requests.get(f"{API}/jobs", params={"district": "Hyderabad"}).json()
        ids = [j["job_id"] for j in lst]
        assert job_id in ids, "Statewide-boosted job should appear in other district feed"
        # boosted first
        assert lst[0].get("boosted") is True

    def test_verify_premium(self, worker_token):
        tok, _ = worker_token
        o = requests.post(f"{API}/payments/order", headers=_h(tok), json={
            "purpose": "premium"
        }).json()
        r = requests.post(f"{API}/payments/verify", headers=_h(tok), json={
            "purpose": "premium",
            "razorpay_order_id": o["order_id"], "razorpay_payment_id": "pay_x"
        })
        assert r.status_code == 200
        assert r.json()["ok"] is True

        # analytics reflect premium
        a = requests.get(f"{API}/analytics/me", headers=_h(tok)).json()
        assert a["premium"] is True
        assert a["verified_pro"] is True
        assert a["premium_expires_at"]
        assert "profile_unlocks" in a
        assert "total_applications" in a


# ---------------- Workers ----------------
class TestWorkers:
    def test_unlock_via_ad(self):
        tok, _, _ = _register_login("employer")
        r = requests.post(f"{API}/workers/w_seed_002/unlock?method=ad", headers=_h(tok))
        assert r.status_code == 200
        d = r.json()
        assert d["phone"]
        assert "wa.me/" in d["whatsapp"]
        s = requests.get(f"{API}/workers/w_seed_002/unlock/status", headers=_h(tok)).json()
        assert s["unlocked"] is True

    def test_workers_sort_premium_first(self, worker_token):
        # worker_token already made premium in TestPayments
        lst = requests.get(f"{API}/workers").json()
        # first should be premium if any exists
        premiums = [w for w in lst if w.get("premium")]
        if premiums:
            assert lst[0].get("premium") is True
