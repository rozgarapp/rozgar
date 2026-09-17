import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UnlockContactModal from "../components/UnlockContactModal";
import RewardedAd from "../components/RewardedAd";
import OtpModal from "../components/OtpModal";
import ProxyCallModal from "../components/ProxyCallModal";
import { Button } from "../components/ui/button";
import { Star, MapPin, MessageSquare, Lock, Briefcase, Calendar, Award, ShieldCheck, Phone, Shield } from "lucide-react";
import { CATEGORY_MAP, t } from "../lib/i18n";
import { useApp } from "../context/AppContext";
import api from "../lib/api";
import { toast } from "sonner";

export default function WorkerProfile() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, lang } = useApp();
  const [w, setW] = useState(null);
  const [openUnlock, setOpenUnlock] = useState(false);
  const [contact, setContact] = useState(null);
  const [showRewarded, setShowRewarded] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showProxy, setShowProxy] = useState(false);

  useEffect(() => {
    api.get(`/workers/${id}`).then(({ data }) => setW(data)).catch(() => {});
    if (user) api.get(`/workers/${id}/unlock/status`).then(({data}) => { if (data.unlocked) setContact(data); }).catch(()=>{});
  }, [id, user]);

  if (!w) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-20 text-center text-slate-500">Loading…</div></div>;
  const cat = CATEGORY_MAP[w.category];

  const rewardedUnlock = async () => {
    try {
      const { data } = await api.post(`/workers/${w.worker_id}/unlock`, null, { params: { method: "ad" } });
      setContact(data); toast.success("Contact unlocked!");
    } catch (e) {
      if (e.response?.status === 412) { setShowOtp(true); toast.info("Please verify your mobile first"); }
      else toast.error("Unlock failed");
    }
    setShowRewarded(false);
  };

  const requireOtpForCall = () => {
    if (!user) { nav("/login"); return; }
    if (user.role === "employer" && !user.otp_verified) { setShowOtp(true); return; }
    setShowProxy(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 rz-card-shadow p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-inner"
                 style={{ backgroundColor: cat?.bg, color: cat?.color }}>
              {w.emoji}
              {w.verified_pro && (
                <div className="absolute -bottom-1 -end-1 bg-amber-400 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white" data-testid="verified-pro-badge">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900">{w.name}</h1>
                {w.verified_pro && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">⭐ Verified Pro</span>
                )}
                {w.is_female_protected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-300" data-testid="profile-protected">
                    <Shield className="w-3 h-3" /> Protected Number
                  </span>
                )}
              </div>
              <div className="text-lg text-[#1B4332] font-semibold">{w.trade}</div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  w.availability === "available" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${w.availability === "available" ? "bg-emerald-500" : "bg-rose-500"}`} />
                  {w.availability === "available" ? t("available", lang) : t("busy", lang)}
                </span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{w.rating}</span>
                <span className="flex items-center gap-1 text-slate-600"><MapPin className="w-4 h-4" />{w.district}</span>
                <span className="flex items-center gap-1 text-slate-500 font-mono text-xs">📱 {w.masked_phone || "+91-XXXXX-XXXXX"}</span>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                {contact ? (
                  <>
                    <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200" data-testid="profile-phone">
                      📞 {contact.masked_phone || contact.phone}
                    </div>
                    <Button onClick={requireOtpForCall} className="bg-[#1B4332] hover:bg-[#143225] text-white gap-2" data-testid="profile-call">
                      <Phone className="w-4 h-4" /> Call Worker (Private)
                    </Button>
                    {contact.whatsapp && !w.is_female_protected && (
                      <a href={contact.whatsapp} target="_blank" rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 flex items-center" data-testid="profile-whatsapp">
                        WhatsApp
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <Button onClick={() => setShowRewarded(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" data-testid="profile-watch-ad">
                      🎬 Watch Ad to Unlock (Free)
                    </Button>
                    <Button onClick={() => setOpenUnlock(true)} variant="outline" className="gap-2" data-testid="profile-unlock">
                      <Lock className="w-4 h-4" /> Pay ₹30
                    </Button>
                  </>
                )}
                {user && (
                  <Button variant="outline" onClick={() => nav(`/chat/${w.user_id}`)} data-testid="profile-chat">
                    <MessageSquare className="w-4 h-4 me-2" /> {t("chat", lang)}
                  </Button>
                )}
              </div>
            </div>
            <div className="bg-[#1B4332] text-white rounded-2xl px-5 py-4 text-center min-w-[140px]">
              <div className="text-3xl font-extrabold">₹{w.daily_rate}</div>
              <div className="text-xs text-emerald-200">per day</div>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Stat icon={Award} label="Experience" value={`${w.experience_years || 0} yrs`} />
            <Stat icon={Briefcase} label="Category" value={cat?.label?.EN || w.category} />
            <Stat icon={Calendar} label="Joined" value={new Date(w.created_at).toLocaleDateString()} />
          </div>

          <div className="mt-8">
            <h2 className="heading font-bold text-slate-900 text-lg mb-2">About</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{w.bio || "No bio yet."}</p>
          </div>
        </div>
      </div>
      <UnlockContactModal open={openUnlock} onClose={() => setOpenUnlock(false)} worker={w}
        onUnlocked={(c) => { setContact(c); setOpenUnlock(false); }} />
      <RewardedAd open={showRewarded} onClose={() => setShowRewarded(false)} onReward={rewardedUnlock} title={`Unlock ${w.name}'s contact`} />
      <OtpModal open={showOtp} onClose={() => setShowOtp(false)} onVerified={() => {}} />
      <ProxyCallModal open={showProxy} onClose={() => setShowProxy(false)} worker={w} />
    </div>
  );
}

function Stat({ icon: I, label, value }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"><I className="w-5 h-5" /></div>
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
