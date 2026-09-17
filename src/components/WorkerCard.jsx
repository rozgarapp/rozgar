import { useNavigate } from "react-router-dom";
import { Star, MapPin, Lock, User, ShieldCheck, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";
import UnlockContactModal from "./UnlockContactModal";
import { useState } from "react";
import { CATEGORY_MAP } from "../lib/i18n";

export default function WorkerCard({ worker }) {
  const { lang } = useApp();
  const nav = useNavigate();
  const [openUnlock, setOpenUnlock] = useState(false);
  const [contact, setContact] = useState(null);
  const cat = CATEGORY_MAP[worker.category];
  const protectedFemale = worker.is_female_protected;

  return (
    <div data-testid={`worker-card-${worker.worker_id}`}
      className={`rz-card-shadow bg-white rounded-2xl border p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all fade-in-up ${
        worker.verified_pro ? "border-amber-300 ring-2 ring-amber-200/60" : "border-slate-200"}`}>
      <div className="flex gap-2 flex-wrap">
        {cat && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: cat.bg, borderColor: cat.border, color: cat.color }}
                data-testid="category-tag">
            {cat.label.EN}
          </span>
        )}
        {worker.verified_pro && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300" data-testid="verified-pro">
            <ShieldCheck className="w-3 h-3" /> VERIFIED PRO
          </span>
        )}
        {protectedFemale && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300" data-testid="protected-badge">
            <Shield className="w-3 h-3" /> {t("protected_number", lang)}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 shadow-inner"
               style={{ backgroundColor: cat?.bg || "#F1F5F9", borderColor: cat?.border || "#E2E8F0", color: cat?.color || "#1B4332" }}>
            {worker.emoji}
          </div>
          <div>
            <div className="font-bold text-slate-900 heading">{worker.trade}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1"><User className="w-3 h-3" />{worker.name}</div>
          </div>
        </div>
        <span data-testid="avail-badge"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
            worker.availability === "available"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${worker.availability === "available" ? "bg-emerald-500" : "bg-rose-500"}`} />
          {worker.availability === "available" ? t("available", lang) : t("busy", lang)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1 text-slate-600">
          <span className="text-lg">💰</span>
          <span className="font-bold text-[#1B4332]">₹{worker.daily_rate}</span>
          <span className="text-xs text-slate-500">/day</span>
        </div>
        <div className="flex items-center gap-1 text-slate-600 justify-end">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{worker.rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-slate-600">
        <MapPin className="w-3.5 h-3.5" /> {worker.district}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
        <div className="text-sm">
          {contact ? (
            <span className="font-mono text-emerald-700 font-semibold" data-testid="unlocked-phone">{contact.masked_phone || contact.phone}</span>
          ) : (
            <span className="font-mono text-slate-500 text-xs">{worker.masked_phone || "+91-XXXXX-XXXXX"}</span>
          )}
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={() => nav(`/workers/${worker.worker_id}`)}
            className="text-xs h-8" data-testid={`view-profile-${worker.worker_id}`}>
            {t("view_profile", lang)}
          </Button>
          {!contact && (
            <Button size="sm" onClick={() => setOpenUnlock(true)}
              className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
              data-testid={`unlock-btn-${worker.worker_id}`}>
              <Lock className="w-3 h-3" /> {t("unlock_contact", lang)}
            </Button>
          )}
        </div>
      </div>

      <UnlockContactModal
        open={openUnlock} onClose={() => setOpenUnlock(false)} worker={worker}
        onUnlocked={(c) => { setContact(c); setOpenUnlock(false); }}
      />
    </div>
  );
}
