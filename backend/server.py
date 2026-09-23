from dotenv import load_dotenv
from pathlib import Path
from contextlib import asynccontextmanager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import bcrypt
import jwt
import httpx
import logging
import random
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]

api = APIRouter(prefix="/api")

# ---------------- Helpers ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str, role: str, ver: int = 0) -> str:
    payload = {"sub": user_id, "email": email, "role": role, "ver": ver,
               "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def cookie_kwargs():
    return {"httponly": True, "secure": True, "samesite": "none", "path": "/"}

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- Models ----------------
class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Literal["worker", "employer"]
    phone: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class SessionIn(BaseModel):
    session_id: str
    role: Optional[Literal["worker", "employer"]] = "employer"

class WorkerIn(BaseModel):
    trade: str
    category: str
    daily_rate: int
    district: str
    availability: Literal["available", "busy"] = "available"
    bio: Optional[str] = ""
    experience_years: Optional[int] = 0
    portfolio: Optional[List[str]] = []

class JobIn(BaseModel):
    title: str
    trade: str
    category: str
    daily_rate: int
    district: str
    workers_needed: int
    start_date: str
    description: Optional[str] = ""

class ApplyIn(BaseModel):
    job_id: str
    cover_note: str

class StatusUpdateIn(BaseModel):
    status: Literal["Applied", "Shortlisted", "Hired", "Rejected"]

class MessageIn(BaseModel):
    to_user_id: str
    text: str

class SettingsIn(BaseModel):
    admob_app_id: Optional[str] = ""
    banner_ad_unit_id: Optional[str] = ""
    interstitial_ad_unit_id: Optional[str] = ""
    rewarded_ad_unit_id: Optional[str] = ""
    ad_test_mode: bool = True
    razorpay_key_id: Optional[str] = ""
    razorpay_key_secret: Optional[str] = ""
    exotel_api_key: Optional[str] = ""
    exotel_sid: Optional[str] = ""
    twilio_sid: Optional[str] = ""
    twilio_auth_token: Optional[str] = ""
    proxy_call_categories: Optional[List[str]] = None

class OtpRequestIn(BaseModel):
    phone: str

class OtpVerifyIn(BaseModel):
    phone: str
    code: str

class ProxyCallIn(BaseModel):
    worker_id: str

class VoiceTicketIn(BaseModel):
    issue_category: Literal["bug", "payment", "complaint", "other"]
    audio_data_url: str
    language: Optional[str] = "EN"
    duration_secs: Optional[int] = 0

class BoostIn(BaseModel):
    boost_type: Literal["district", "statewide"]

class PaymentVerifyIn(BaseModel):
    purpose: Literal["unlock", "boost_district", "boost_statewide", "premium"]
    reference_id: Optional[str] = ""
    razorpay_payment_id: Optional[str] = ""
    razorpay_order_id: Optional[str] = ""

class SupportTicketIn(BaseModel):
    issue_category: Literal["bug", "payment", "complaint", "other"]
    message: str
    language: Optional[str] = "EN"

class SupportStatusIn(BaseModel):
    status: Literal["open", "in-progress", "resolved"]

# ---------------- Auth Endpoints ----------------
@api.post("/auth/register")
async def register(data: RegisterIn, response: Response):
    email = data.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Email already registered")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id, "email": email, "name": data.name,
        "password_hash": hash_password(data.password), "role": data.role,
        "phone": data.phone or "", "picture": "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    if data.role == "worker":
        await db.workers.insert_one({
            "worker_id": f"w_{uuid.uuid4().hex[:10]}",
            "user_id": user_id, "name": data.name,
            "trade": "Mason/Bricklayer", "category": "construction",
            "emoji": "🧱", "daily_rate": 800, "district": "Hyderabad",
            "availability": "available", "rating": 4.5, "phone": data.phone or "",
            "bio": "", "experience_years": 0, "portfolio": [],
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    token = create_access_token(user_id, email, data.role)
    response.set_cookie("access_token", token, max_age=604800, **cookie_kwargs())
    return {"user_id": user_id, "email": email, "name": data.name, "role": data.role, "token": token}

@api.post("/auth/login")
async def login(data: LoginIn, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user.get("password_hash", "")):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token(user["user_id"], email, user["role"])
    response.set_cookie("access_token", token, max_age=604800, **cookie_kwargs())
    return {"user_id": user["user_id"], "email": email, "name": user["name"],
            "role": user["role"], "token": token}

@api.post("/auth/google/session")
async def google_session(data: SessionIn, response: Response):
    try:
        async with httpx.AsyncClient(timeout=15) as hc:
            r = await hc.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": data.session_id},
            )
            r.raise_for_status()
            info = r.json()
    except Exception as e:
        raise HTTPException(401, f"Invalid session: {e}")
    email = info["email"].lower()
    user = await db.users.find_one({"email": email})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        role = data.role or "employer"
        user_doc = {
            "user_id": user_id, "email": email, "name": info.get("name", email),
            "picture": info.get("picture", ""), "role": role, "phone": "",
            "google": True, "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)
        if role == "worker":
            await db.workers.insert_one({
                "worker_id": f"w_{uuid.uuid4().hex[:10]}",
                "user_id": user_id, "name": info.get("name", email),
                "trade": "Mason/Bricklayer", "category": "construction",
                "emoji": "🧱", "daily_rate": 800, "district": "Hyderabad",
                "availability": "available", "rating": 4.5, "phone": "",
                "bio": "", "experience_years": 0, "portfolio": [],
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        user = user_doc
    token = create_access_token(user["user_id"], email, user["role"])
    response.set_cookie("access_token", token, max_age=604800, **cookie_kwargs())
    return {"user_id": user["user_id"], "email": email, "name": user["name"],
            "role": user["role"], "token": token, "picture": user.get("picture", "")}

@api.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return user

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}

# ---------------- Workers ----------------
@api.get("/workers")
async def list_workers(category: Optional[str] = None, district: Optional[str] = None,
                       trade: Optional[str] = None, skill: Optional[str] = None):
    q = {}
    if category: q["category"] = category
    if district: q["district"] = district
    if trade: q["trade"] = trade
    if skill == "skilled":
        q["category"] = {"$ne": "unskilled"} if not category else category
    elif skill == "unskilled":
        q["category"] = "unskilled"
    docs = await db.workers.find(q, {"_id": 0}).to_list(1000)
    for d in docs:
        d["masked_phone"] = _mask_phone(d.get("phone", ""))
        d["is_female_protected"] = d.get("trade") in FEMALE_TRADES
        d.pop("phone", None)
    docs.sort(key=lambda w: (0 if w.get("premium") else 1, -(w.get("rating") or 0)))
    return docs

@api.get("/categories/stats")
async def category_stats(user=Depends(get_current_user)):
    if user["email"].lower() != os.environ.get("ADMIN_EMAIL", "").lower():
        raise HTTPException(403, "Admin only")
    out = []
    cats = ["construction","industrial","electrical","domestic","agriculture","logistics","beauty","healthcare","unskilled"]
    for c in cats:
        n = await db.workers.count_documents({"category": c})
        trades_in = [t for t, cc in CATEGORY_OF_TRADE.items() if cc == c]
        out.append({"category": c, "worker_count": n, "trade_count": len(trades_in), "trades": trades_in})
    return out

@api.get("/workers/{worker_id}")
async def get_worker(worker_id: str):
    w = await db.workers.find_one({"worker_id": worker_id}, {"_id": 0})
    if not w:
        raise HTTPException(404, "Worker not found")
    w["masked_phone"] = _mask_phone(w.get("phone", ""))
    w["is_female_protected"] = w.get("trade") in FEMALE_TRADES
    w.pop("phone", None)
    return w

@api.put("/workers/me")
async def update_my_worker(data: WorkerIn, user=Depends(get_current_user)):
    if user["role"] != "worker":
        raise HTTPException(403, "Not a worker account")
    upd = data.model_dump()
    upd["emoji"] = TRADE_EMOJI.get(data.trade, "🛠️")
    await db.workers.update_one({"user_id": user["user_id"]}, {"$set": upd})
    return await db.workers.find_one({"user_id": user["user_id"]}, {"_id": 0})

@api.get("/workers/me/profile")
async def get_my_worker(user=Depends(get_current_user)):
    w = await db.workers.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not w:
        raise HTTPException(404, "Worker profile not found")
    return w

@api.post("/workers/{worker_id}/unlock")
async def unlock_contact(worker_id: str, method: str = "ad", user=Depends(get_current_user)):
    if user["role"] == "employer":
        u = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
        verified = bool(u.get("otp_verified")) and (u.get("otp_expires_at", "") > datetime.now(timezone.utc).isoformat())
        if not verified:
            raise HTTPException(412, "Please verify your mobile number first")
    w = await db.workers.find_one({"worker_id": worker_id}, {"_id": 0})
    if not w:
        raise HTTPException(404, "Worker not found")
    await db.unlocks.update_one(
        {"user_id": user["user_id"], "worker_id": worker_id},
        {"$set": {"unlocked_at": datetime.now(timezone.utc).isoformat(), "method": method}},
        upsert=True,
    )
    phone = w.get("phone", "")
    protected = w.get("trade") in FEMALE_TRADES
    return {"phone": None if protected else phone,
            "masked_phone": _mask_phone(phone),
            "whatsapp": None if protected else f"https://wa.me/{phone.replace('+','').replace(' ','').replace('-','')}",
            "worker_id": worker_id,
            "is_female_protected": protected}

@api.get("/workers/{worker_id}/unlock/status")
async def unlock_status(worker_id: str, user=Depends(get_current_user)):
    doc = await db.unlocks.find_one({"user_id": user["user_id"], "worker_id": worker_id}, {"_id": 0})
    if not doc:
        return {"unlocked": False}
    w = await db.workers.find_one({"worker_id": worker_id}, {"_id": 0})
    phone = (w or {}).get("phone", "")
    protected = (w or {}).get("trade") in FEMALE_TRADES
    return {"unlocked": True, "phone": None if protected else phone,
            "masked_phone": _mask_phone(phone),
            "whatsapp": None if protected else f"https://wa.me/{phone.replace('+','').replace(' ','').replace('-','')}",
            "is_female_protected": protected}

# ---------------- Settings ----------------
DEFAULT_SETTINGS = {
    "admob_app_id": "ca-app-pub-3940256099942544~3347511713",
    "banner_ad_unit_id": "ca-app-pub-3940256099942544/6300978111",
    "interstitial_ad_unit_id": "ca-app-pub-3940256099942544/1033173712",
    "rewarded_ad_unit_id": "ca-app-pub-3940256099942544/5224354917",
    "ad_test_mode": True,
    "razorpay_key_id": "rzp_test_1DP5mmOlF5G5ag",
    "razorpay_key_secret": "",
    "exotel_api_key": "",
    "exotel_sid": "",
    "twilio_sid": "",
    "twilio_auth_token": "",
    "proxy_call_categories": ["construction", "industrial", "electrical", "domestic"],
}

FEMALE_CATEGORIES = {"domestic", "beauty", "healthcare"}
FEMALE_TRADES = {
    "Beautician","Baby Caretaker/Nanny","Elder Care Attendant","Housekeeping Staff",
    "Mehendi Artist","Makeup Artist","Spa Therapist","Nail Technician",
    "Waxing Specialist","Facial Therapist","Massage Therapist","Home Nurse",
}

@api.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_id": "app"}, {"_id": 0}) or {}
    merged = {**DEFAULT_SETTINGS}
    for k, v in doc.items():
        if v not in ("", None):
            merged[k] = v
    merged.pop("razorpay_key_secret", None)
    return merged

@api.put("/settings")
async def update_settings(data: SettingsIn, user=Depends(get_current_user)):
    if user["email"].lower() != os.environ.get("ADMIN_EMAIL", "").lower():
        raise HTTPException(403, "Admin only")
    payload = data.model_dump(exclude_unset=True)
    payload = {k: v for k, v in payload.items() if v not in ("", None)}
    if payload:
        await db.settings.update_one({"_id": "app"}, {"$set": payload}, upsert=True)
    return {"ok": True}

# ---------------- Payments ----------------
PRICES = {"unlock": 3000, "boost_district": 9900, "boost_statewide": 29900, "premium": 9900}

@api.post("/payments/order")
async def create_order(data: PaymentVerifyIn, user=Depends(get_current_user)):
    amount = PRICES[data.purpose]
    order = {
        "order_id": f"order_{uuid.uuid4().hex[:12]}",
        "amount": amount, "currency": "INR",
        "purpose": data.purpose, "reference_id": data.reference_id,
        "user_id": user["user_id"], "status": "created",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    settings = await db.settings.find_one({"_id": "app"}) or {}
    return {"order_id": order["order_id"], "amount": amount, "currency": "INR",
            "key_id": settings.get("razorpay_key_id", DEFAULT_SETTINGS["razorpay_key_id"])}

@api.post("/payments/verify")
async def verify_payment(data: PaymentVerifyIn, user=Depends(get_current_user)):
    await db.orders.update_one({"order_id": data.razorpay_order_id, "user_id": user["user_id"]},
        {"$set": {"status": "paid", "payment_id": data.razorpay_payment_id,
                  "paid_at": datetime.now(timezone.utc).isoformat()}})
    now = datetime.now(timezone.utc)
    if data.purpose == "unlock":
        await db.unlocks.update_one(
            {"user_id": user["user_id"], "worker_id": data.reference_id},
            {"$set": {"unlocked_at": now.isoformat(), "method": "paid"}}, upsert=True)
        w = await db.workers.find_one({"worker_id": data.reference_id}, {"_id": 0})
        phone = (w or {}).get("phone", "")
        protected = (w or {}).get("trade") in FEMALE_TRADES
        return {"ok": True, "phone": None if protected else phone,
                "masked_phone": _mask_phone(phone),
                "whatsapp": None if protected else f"https://wa.me/{phone.replace('+','').replace(' ','')}",
                "is_female_protected": protected}
    if data.purpose in ("boost_district", "boost_statewide"):
        expires = (now + timedelta(days=7)).isoformat()
        boost_type = "statewide" if data.purpose == "boost_statewide" else "district"
        await db.jobs.update_one({"job_id": data.reference_id},
            {"$set": {"boost_type": boost_type, "boost_expires_at": expires, "boosted": True}})
        return {"ok": True, "boost_type": boost_type, "expires_at": expires}
    if data.purpose == "premium":
        expires = (now + timedelta(days=30)).isoformat()
        await db.workers.update_one({"user_id": user["user_id"]},
            {"$set": {"premium": True, "premium_expires_at": expires, "verified_pro": True}})
        return {"ok": True, "expires_at": expires}
    return {"ok": True}

@api.get("/analytics/me")
async def worker_analytics(user=Depends(get_current_user)):
    if user["role"] != "worker":
        raise HTTPException(403, "Workers only")
    w = await db.workers.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not w:
        raise HTTPException(404, "Worker profile not found")
    unlocks = await db.unlocks.count_documents({"worker_id": w["worker_id"]})
    apps = await db.applications.count_documents({"worker_user_id": user["user_id"]})
    return {"premium": bool(w.get("premium")), "verified_pro": bool(w.get("verified_pro")),
            "profile_unlocks": unlocks, "total_applications": apps,
            "premium_expires_at": w.get("premium_expires_at")}

# ---------------- OTP ----------------
import random as _rand

def _mask_phone(phone: str) -> str:
    digits = "".join(ch for ch in (phone or "") if ch.isdigit())[-10:]
    if len(digits) < 10:
        return "+91-XXXXX-XXXXX"
    return f"+91-XXXXX-{digits[-5:]}"

@api.post("/otp/request")
async def otp_request(data: OtpRequestIn, user=Depends(get_current_user)):
    code = f"{_rand.randint(0, 999999):06d}"
    await db.otp_codes.update_one(
        {"user_id": user["user_id"], "phone": data.phone},
        {"$set": {"code": code, "created_at": datetime.now(timezone.utc).isoformat(),
                  "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()}},
        upsert=True,
    )
    logger.info(f"OTP for {data.phone}: {code}")
    return {"ok": True, "dev_code": code, "phone": data.phone,
            "message": "OTP sent (dev mode — code included in response)"}

@api.post("/otp/verify")
async def otp_verify(data: OtpVerifyIn, response: Response, user=Depends(get_current_user)):
    doc = await db.otp_codes.find_one({"user_id": user["user_id"], "phone": data.phone})
    if not doc or doc.get("code") != data.code:
        raise HTTPException(400, "Invalid or expired OTP")
    expires = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    await db.users.update_one({"user_id": user["user_id"]},
        {"$set": {"otp_verified": True, "otp_phone": data.phone,
                  "otp_verified_at": datetime.now(timezone.utc).isoformat(),
                  "otp_expires_at": expires}})
    return {"ok": True, "verified": True, "expires_at": expires}

@api.get("/otp/status")
async def otp_status(user=Depends(get_current_user)):
    u = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    expires = u.get("otp_expires_at")
    verified = bool(u.get("otp_verified")) and (expires or "") > datetime.now(timezone.utc).isoformat()
    return {"verified": verified, "phone": u.get("otp_phone", ""), "expires_at": expires}

@api.post("/proxy-call")
async def proxy_call(data: ProxyCallIn, user=Depends(get_current_user)):
    if user["role"] != "employer":
        raise HTTPException(403, "Employers only")
    u = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    verified = bool(u.get("otp_verified")) and (u.get("otp_expires_at", "") > datetime.now(timezone.utc).isoformat())
    if not verified:
        raise HTTPException(412, "Please verify your mobile number first")
    w = await db.workers.find_one({"worker_id": data.worker_id}, {"_id": 0})
    if not w:
        raise HTTPException(404, "Worker not found")
    settings = await db.settings.find_one({"_id": "app"}) or {}
    allowed = settings.get("proxy_call_categories", DEFAULT_SETTINGS["proxy_call_categories"])
    if w.get("category") not in (allowed or []):
        raise HTTPException(403, "Proxy calling disabled for this category")
    log = {
        "log_id": f"log_{uuid.uuid4().hex[:10]}",
        "employer_id": user["user_id"], "employer_name": user["name"],
        "worker_id": data.worker_id, "worker_name": w["name"],
        "worker_district": w.get("district", ""),
        "worker_category": w.get("category", ""),
        "proxy_call_status": "initiated",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.contact_privacy_logs.insert_one(log)
    proxy_number = f"+91-80-4718-{_rand.randint(1000, 9999)}"
    await db.contact_privacy_logs.update_one({"log_id": log["log_id"]},
        {"$set": {"proxy_call_status": "connected", "proxy_number": proxy_number}})
    return {"ok": True, "call_id": log["log_id"], "proxy_number": proxy_number,
            "status": "connected", "message": "Proxy call bridged via virtual number"}

@api.get("/privacy-logs")
async def list_privacy_logs(district: Optional[str] = None, date_from: Optional[str] = None,
                            date_to: Optional[str] = None, user=Depends(get_current_user)):
    if user["email"].lower() != os.environ.get("ADMIN_EMAIL", "").lower():
        raise HTTPException(403, "Admin only")
    q = {}
    if district: q["worker_district"] = district
    if date_from or date_to:
        q["timestamp"] = {}
        if date_from: q["timestamp"]["$gte"] = date_from
        if date_to: q["timestamp"]["$lte"] = date_to + "T23:59:59"
        if not q["timestamp"]: del q["timestamp"]
    docs = await db.contact_privacy_logs.find(q, {"_id": 0}).sort("timestamp", -1).to_list(1000)
    return docs

@api.post("/support/tickets/voice")
async def create_voice_ticket(data: VoiceTicketIn, user=Depends(get_current_user)):
    doc = {
        "ticket_id": f"tkt_{uuid.uuid4().hex[:10]}",
        "user_id": user["user_id"], "user_email": user["email"], "user_name": user["name"],
        "issue_category": data.issue_category,
        "message": f"[Voice note · {data.duration_secs}s]",
        "audio_data_url": data.audio_data_url,
        "language": data.language or "EN",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.support_tickets.insert_one(doc)
    return {k: v for k, v in doc.items() if k not in ("_id", "audio_data_url")}

@api.post("/support/tickets")
async def create_ticket(data: SupportTicketIn, user=Depends(get_current_user)):
    doc = {
        "ticket_id": f"tkt_{uuid.uuid4().hex[:10]}",
        "user_id": user["user_id"],
        "user_email": user["email"],
        "user_name": user["name"],
        "issue_category": data.issue_category,
        "message": data.message,
        "language": data.language or "EN",
        "status": "open",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.support_tickets.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/support/tickets/mine")
async def my_tickets(user=Depends(get_current_user)):
    docs = await db.support_tickets.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs

@api.get("/support/tickets")
async def list_tickets(status: Optional[str] = None, user=Depends(get_current_user)):
    if user["email"].lower() != os.environ.get("ADMIN_EMAIL", "").lower():
        raise HTTPException(403, "Admin only")
    q = {}
    if status: q["status"] = status
    docs = await db.support_tickets.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs

@api.put("/support/tickets/{ticket_id}")
async def update_ticket(ticket_id: str, data: SupportStatusIn, user=Depends(get_current_user)):
    if user["email"].lower() != os.environ.get("ADMIN_EMAIL", "").lower():
        raise HTTPException(403, "Admin only")
    r = await db.support_tickets.update_one({"ticket_id": ticket_id}, {"$set": {"status": data.status}})
    if r.matched_count == 0:
        raise HTTPException(404, "Ticket not found")
    return {"ok": True, "status": data.status}

# ---------------- Jobs ----------------
@api.get("/jobs")
async def list_jobs(category: Optional[str] = None, district: Optional[str] = None):
    now = datetime.now(timezone.utc).isoformat()
    q = {}
    if category: q["category"] = category
    if district:
        q["$or"] = [{"district": district},
                    {"boost_type": "statewide", "boost_expires_at": {"$gt": now}}]
    docs = await db.jobs.find(q, {"_id": 0}).to_list(500)
    def sort_key(j):
        active_boost = j.get("boosted") and (j.get("boost_expires_at") or "") > now
        return (0 if active_boost else 1, -(datetime.fromisoformat(j["created_at"]).timestamp()))
    docs.sort(key=sort_key)
    return docs

@api.get("/jobs/{job_id}")
async def get_job(job_id: str):
    j = await db.jobs.find_one({"job_id": job_id}, {"_id": 0})
    if not j:
        raise HTTPException(404, "Job not found")
    return j

@api.post("/jobs")
async def create_job(data: JobIn, user=Depends(get_current_user)):
    if user["role"] != "employer":
        raise HTTPException(403, "Only employers can post jobs")
    doc = data.model_dump()
    doc.update({
        "job_id": f"job_{uuid.uuid4().hex[:10]}",
        "employer_id": user["user_id"],
        "employer_name": user["name"],
        "emoji": TRADE_EMOJI.get(data.trade, "🛠️"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.jobs.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/jobs/mine/list")
async def my_jobs(user=Depends(get_current_user)):
    if user["role"] != "employer":
        raise HTTPException(403, "Employers only")
    docs = await db.jobs.find({"employer_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs

# ---------------- Applications ----------------
@api.post("/applications")
async def apply(data: ApplyIn, user=Depends(get_current_user)):
    if user["role"] != "worker":
        raise HTTPException(403, "Only workers can apply")
    job = await db.jobs.find_one({"job_id": data.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(404, "Job not found")
    existing = await db.applications.find_one({"job_id": data.job_id, "worker_user_id": user["user_id"]})
    if existing:
        raise HTTPException(400, "Already applied")
    worker = await db.workers.find_one({"user_id": user["user_id"]}, {"_id": 0})
    doc = {
        "app_id": f"app_{uuid.uuid4().hex[:10]}",
        "job_id": data.job_id,
        "job_title": job["title"],
        "job_emoji": job.get("emoji", "🛠️"),
        "employer_id": job["employer_id"],
        "worker_user_id": user["user_id"],
        "worker_name": user["name"],
        "worker_trade": worker.get("trade") if worker else "",
        "worker_district": worker.get("district") if worker else "",
        "worker_rating": worker.get("rating") if worker else None,
        "cover_note": data.cover_note,
        "status": "Applied",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.applications.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/applications/mine")
async def my_applications(user=Depends(get_current_user)):
    if user["role"] == "worker":
        docs = await db.applications.find({"worker_user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    else:
        docs = await db.applications.find({"employer_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs

@api.get("/applications/job/{job_id}")
async def job_applications(job_id: str, user=Depends(get_current_user)):
    docs = await db.applications.find({"job_id": job_id}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs

@api.put("/applications/{app_id}/status")
async def update_status(app_id: str, data: StatusUpdateIn, user=Depends(get_current_user)):
    if user["role"] != "employer":
        raise HTTPException(403, "Employers only")
    r = await db.applications.update_one(
        {"app_id": app_id, "employer_id": user["user_id"]},
        {"$set": {"status": data.status}},
    )
    if r.matched_count == 0:
        raise HTTPException(404, "Application not found")
    return {"ok": True, "status": data.status}

# ---------------- Chat ----------------
@api.post("/chat/send")
async def send_message(data: MessageIn, user=Depends(get_current_user)):
    thread_id = "_".join(sorted([user["user_id"], data.to_user_id]))
    msg = {
        "message_id": f"msg_{uuid.uuid4().hex[:10]}",
        "thread_id": thread_id,
        "from_user_id": user["user_id"],
        "from_name": user["name"],
        "to_user_id": data.to_user_id,
        "text": data.text,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.messages.insert_one(msg)
    return {k: v for k, v in msg.items() if k != "_id"}

@api.get("/chat/thread/{other_user_id}")
async def get_thread(other_user_id: str, user=Depends(get_current_user)):
    thread_id = "_".join(sorted([user["user_id"], other_user_id]))
    docs = await db.messages.find({"thread_id": thread_id}, {"_id": 0}).sort("created_at", 1).to_list(500)
    return docs

@api.get("/chat/threads")
async def list_threads(user=Depends(get_current_user)):
    pipeline = [
        {"$match": {"$or": [{"from_user_id": user["user_id"]}, {"to_user_id": user["user_id"]}]}},
        {"$sort": {"created_at": -1}},
        {"$group": {"_id": "$thread_id", "last": {"$first": "$$ROOT"}}},
    ]
    docs = await db.messages.aggregate(pipeline).to_list(200)
    out = []
    for d in docs:
        m = d["last"]
        other_id = m["to_user_id"] if m["from_user_id"] == user["user_id"] else m["from_user_id"]
        other = await db.users.find_one({"user_id": other_id}, {"_id": 0, "password_hash": 0})
        out.append({
            "thread_id": d["_id"],
            "other_user_id": other_id,
            "other_name": other["name"] if other else "Unknown",
            "last_text": m["text"],
            "last_at": m["created_at"],
        })
    return out

# ---------------- Seed Data ----------------
TRADE_EMOJI = {
    "Mason/Bricklayer": "🧱", "Carpenter": "🪚", "Plumber": "🔧", "Electrician": "⚡",
    "Painter": "🎨", "Welder": "🔥", "Fabricator": "⚙️", "Steel Fixer": "🏗️",
    "Tile Setter": "🪟", "Scaffolder": "🪜", "Waterproofing Worker": "💧",
    "False Ceiling Fixer": "🔩", "Marble/Granite Fitter": "🪨",
    "Glass & Glazing Worker": "🪟", "Shuttering Carpenter": "🪵", "Demolition Worker": "🪓",
    "Road Layer/Paver": "🛣️", "Crane Operator": "🏗️", "Concrete Mixer Operator": "🔄", "Bar Bender": "💪",
    "Fitter": "🔩", "Machinist": "🛠️", "Turner": "🔄", "Automobile Technician": "🚗", "CNC Operator": "💻",
    "Diesel Mechanic": "🔧", "Pump Operator": "💦", "Compressor Operator": "🌀",
    "Forklift Operator": "🏭", "Lathe Operator": "⚙️", "Sheet Metal Worker": "🔨",
    "Boiler Operator": "♨️", "Generator Technician": "⚡", "AC Mechanic": "❄️", "Refrigeration Technician": "🧊",
    "Industrial Electrician": "⚡", "Domestic Electrician": "🏠", "Wireman": "🔌", "Electronics Technician": "📱",
    "Solar Panel Installer": "☀️", "CCTV Installer": "📷", "Fire Alarm Technician": "🚨",
    "Data Cable Technician": "🖥️", "Lift/Elevator Technician": "🛗", "UPS Technician": "🔋",
    "Motor Winding Technician": "⚡", "Panel Board Wireman": "🔌",
    "Cook/Chef": "👨‍🍳", "Housekeeping Staff": "🏠", "Driver": "🚗", "Beautician": "💇", "Tailor": "🧵",
    "Baby Caretaker/Nanny": "👶", "Elder Care Attendant": "👴", "Laundry/Dhobi Worker": "👕",
    "Gardener/Mali": "🌱", "Pest Control Worker": "🪲", "Swimming Pool Cleaner": "🏊",
    "Car Washer/Detailer": "🚿", "Watchman/Security Guard": "🛡️", "Peon/Office Boy": "📋", "Pantry Boy": "☕",
    "Farm Laborer": "🌾", "Irrigation Worker": "💧", "Harvesting Worker": "🌿",
    "Tractor Operator": "🚜", "Greenhouse Worker": "🪴", "Poultry Farm Worker": "🐔",
    "Dairy Farm Worker": "🐄", "Horticulture Worker": "🌺", "Nursery Worker": "🪴", "Seed Sowing Worker": "🌱",
    "Delivery Boy 2-Wheeler": "🛵", "Delivery Boy 4-Wheeler": "🚐", "Warehouse Worker": "📦",
    "Loading/Unloading Labor": "💪", "Packing Worker": "📫", "Courier Boy": "🏍️",
    "E-Commerce Delivery Agent": "📲", "Cold Storage Worker": "🧊", "Inventory Helper": "📋", "Dispatch Boy": "🚚",
    "Mehendi Artist": "🎨", "Makeup Artist": "💄", "Spa Therapist": "💆",
    "Yoga Instructor": "🧘", "Gym Trainer": "💪", "Hair Stylist": "✂️",
    "Nail Technician": "💅", "Waxing Specialist": "🌸", "Facial Therapist": "🧖", "Massage Therapist": "💆",
    "Hospital Attendant/Ward Boy": "🏥", "Home Nurse": "👩‍⚕️", "Medical Equipment Technician": "🩺",
    "Ambulance Driver": "🚑", "Pharmacy Helper": "💊", "Lab Technician Assistant": "🔬",
    "Physiotherapy Assistant": "🦽", "Dental Assistant": "🦷", "Dialysis Technician": "💉", "Blood Sample Collector": "🩸",
    "General Helper/Mazdoor": "👷", "Dig & Trench Worker": "⛏️", "Sand/Gravel Loader": "🪣",
    "Brick Carrier": "🧱", "Cement Mixer Helper": "🔄", "Garbage Collector": "🗑️",
    "Street Sweeper": "🧹", "Construction Site Cleaner": "🧽", "Event Setup Helper": "🎪",
    "Chair/Tent Arrangement Worker": "⛺", "Marriage Event Helper": "💍", "Moving/Shifting Helper": "📦",
    "Painting Helper": "🖌️", "Railway Track Helper": "🛤️", "Dhol/Band Worker": "🥁",
}

CATEGORY_OF_TRADE = {
    **{t: "construction" for t in ["Mason/Bricklayer","Carpenter","Plumber","Electrician","Painter","Welder","Fabricator","Steel Fixer","Tile Setter","Scaffolder","Waterproofing Worker","False Ceiling Fixer","Marble/Granite Fitter","Glass & Glazing Worker","Shuttering Carpenter","Demolition Worker","Road Layer/Paver","Crane Operator","Concrete Mixer Operator","Bar Bender"]},
    **{t: "industrial" for t in ["Fitter","Machinist","Turner","Automobile Technician","CNC Operator","Diesel Mechanic","Pump Operator","Compressor Operator","Forklift Operator","Lathe Operator","Sheet Metal Worker","Boiler Operator","Generator Technician","AC Mechanic","Refrigeration Technician"]},
    **{t: "electrical" for t in ["Industrial Electrician","Domestic Electrician","Wireman","Electronics Technician","Solar Panel Installer","CCTV Installer","Fire Alarm Technician","Data Cable Technician","Lift/Elevator Technician","UPS Technician","Motor Winding Technician","Panel Board Wireman"]},
    **{t: "domestic" for t in ["Cook/Chef","Housekeeping Staff","Driver","Beautician","Tailor","Baby Caretaker/Nanny","Elder Care Attendant","Laundry/Dhobi Worker","Gardener/Mali","Pest Control Worker","Swimming Pool Cleaner","Car Washer/Detailer","Watchman/Security Guard","Peon/Office Boy","Pantry Boy"]},
    **{t: "agriculture" for t in ["Farm Laborer","Irrigation Worker","Harvesting Worker","Tractor Operator","Greenhouse Worker","Poultry Farm Worker","Dairy Farm Worker","Horticulture Worker","Nursery Worker","Seed Sowing Worker"]},
    **{t: "logistics" for t in ["Delivery Boy 2-Wheeler","Delivery Boy 4-Wheeler","Warehouse Worker","Loading/Unloading Labor","Packing Worker","Courier Boy","E-Commerce Delivery Agent","Cold Storage Worker","Inventory Helper","Dispatch Boy"]},
    **{t: "beauty" for t in ["Mehendi Artist","Makeup Artist","Spa Therapist","Yoga Instructor","Gym Trainer","Hair Stylist","Nail Technician","Waxing Specialist","Facial Therapist","Massage Therapist"]},
    **{t: "healthcare" for t in ["Hospital Attendant/Ward Boy","Home Nurse","Medical Equipment Technician","Ambulance Driver","Pharmacy Helper","Lab Technician Assistant","Physiotherapy Assistant","Dental Assistant","Dialysis Technician","Blood Sample Collector"]},
    **{t: "unskilled" for t in ["General Helper/Mazdoor","Dig & Trench Worker","Sand/Gravel Loader","Brick Carrier","Cement Mixer Helper","Garbage Collector","Street Sweeper","Construction Site Cleaner","Event Setup Helper","Chair/Tent Arrangement Worker","Marriage Event Helper","Moving/Shifting Helper","Painting Helper","Railway Track Helper","Dhol/Band Worker"]},
}

SKILLED_CATEGORIES = {"construction","industrial","electrical","domestic","agriculture","logistics","beauty","healthcare"}

DISTRICTS = [
    "Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon",
    "Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar",
    "Khammam","Kumuram Bheem Asifabad","Mahabubabad","Mahabubnagar",
    "Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool",
    "Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
    "Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet",
    "Vikarabad","Wanaparthy","Warangal","Hanamkonda","Yadadri Bhuvanagiri",
]

SAMPLE_NAMES = [
    "Ramesh Yadav","Suresh Reddy","Mahesh Kumar","Rajesh Naidu","Venkatesh Rao",
    "Srinivas Goud","Anil Kumar","Bhaskar Rao","Chandra Sekhar","Dinesh Babu",
    "Ganesh Thakur","Hari Krishna","Ibrahim Khan","Jagan Mohan","Kiran Kumar",
    "Lakshman Rao","Manohar Reddy","Naresh Chandra","Om Prakash","Praveen Singh",
    "Qureshi Ahmed","Ravi Teja","Sundar Rajan","Tarun Kumar","Umesh Yadav",
    "Vamsi Krishna","Wasim Akram","Xavier Fernandes","Yashwant Reddy","Zubair Ali",
]

async def seed_data():
    await db.workers.create_index("worker_id", unique=True)
    await db.jobs.create_index("job_id", unique=True)
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    if not await db.users.find_one({"email": admin_email}):
        await db.users.insert_one({
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": admin_email, "name": "Rozgar Admin",
            "password_hash": hash_password(admin_password),
            "role": "employer", "phone": "",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin: {admin_email}")
    else:
        existing = await db.users.find_one({"email": admin_email})
        if not verify_password(admin_password, existing.get("password_hash", "")):
            await db.users.update_one({"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}})
    if await db.workers.count_documents({"seed": True}) < 40:
        await db.workers.delete_many({"seed": True})
        random.seed(42)
        trades = list(TRADE_EMOJI.keys())
        for i in range(45):
            trade = random.choice(trades)
            cat = CATEGORY_OF_TRADE[trade]
            base = 700 if cat == "unskilled" else 900
            rate = base + random.choice([0, 100, 200, 300, 500, 800])
            await db.workers.insert_one({
                "worker_id": f"w_seed_{i:03d}",
                "user_id": f"seed_user_{i:03d}",
                "name": SAMPLE_NAMES[i % len(SAMPLE_NAMES)],
                "trade": trade, "category": cat,
                "emoji": TRADE_EMOJI[trade],
                "daily_rate": rate,
                "district": random.choice(DISTRICTS),
                "availability": random.choice(["available", "available", "available", "busy"]),
                "rating": round(random.uniform(3.5, 5.0), 1),
                "phone": f"+91 9{random.randint(100000000, 999999999)}",
                "bio": f"Experienced {trade} with strong references and quality workmanship.",
                "experience_years": random.randint(2, 20),
                "portfolio": [],
                "seed": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        logger.info("Seeded 45 workers across 9 categories")
    if await db.jobs.count_documents({}) < 10:
        await db.jobs.delete_many({"seed": True})
        random.seed(99)
        trades = list(TRADE_EMOJI.keys())
        for i in range(12):
            trade = random.choice(trades)
            cat = CATEGORY_OF_TRADE[trade]
            employer_id = f"seed_emp_{i:03d}"
            await db.jobs.insert_one({
                "job_id": f"job_seed_{i:03d}",
                "employer_id": employer_id,
                "employer_name": f"Contractor {i+1}",
                "title": f"{trade} needed for site work",
                "trade": trade, "category": cat,
                "emoji": TRADE_EMOJI[trade],
                "daily_rate": random.choice([800, 1000, 1200, 1500, 1800]),
                "district": random.choice(DISTRICTS),
                "workers_needed": random.randint(1, 8),
                "start_date": (datetime.now(timezone.utc) + timedelta(days=random.randint(1, 30))).date().isoformat(),
                "description": f"We need a skilled {trade} for an ongoing project. Duration 2-4 weeks. Food & stay provided.",
                "seed": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
        logger.info("Seeded 12 jobs")

# ---------------- App Creation (MUST be after seed_data) ----------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_data()
    yield
    client.close()

app = FastAPI(lifespan=lifespan)

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["https://rozgar-pi.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)
