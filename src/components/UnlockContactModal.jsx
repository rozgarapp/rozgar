import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Play, IndianRupee, Lock, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import api, { fmtDetail } from "../lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RewardedAd from "./RewardedAd";
import OtpModal from "./OtpModal";
import { payWithRazorpay } from "../lib/razorpay";

export default function UnlockContactModal({ open, onClose, worker, onUnlocked }) {
  const { user } = useApp();
  const nav = useNavigate();
  const [showAd, setShowAd] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [pending, setPending] = useState(null); // "ad" or "pay"

  const requireLogin = () => {
    if (!user) { toast.error("Please login first"); nav("/login"); return false; }
    return true;
  };

  const requireOtpThen = (nextAction) => {
    if (!requireLogin()) return;
    if (user.role === "employer" && !user.otp_verified) {
      setPending(nextAction); onClose(); setShowOtp(true); return;
    }
    if (nextAction === "ad") { onClose(); setShowAd(true); }
    else if (nextAction === "pay") { onClose(); doPay(); }
  };

  const finishAd = async () => {
    try {
      const { data } = await api.post(`/workers/${worker.worker_id}/unlock`, null, { params: { method: "ad" } });
      toast.success("Contact unlocked!");
      onUnlocked?.(data);
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
    finally { setShowAd(false); onClose(); }
  };

  const doPay = () => {
    payWithRazorpay({
      purpose: "unlock", reference_id: worker.worker_id, user,
      onSuccess: (data) => onUnlocked?.(data),
    });
  };

  const onOtpVerified = () => {
    setShowOtp(false);
    if (pending === "ad") setShowAd(true);
    else if (pending === "pay") doPay();
    setPending(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent data-testid="unlock-modal" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 heading">
              <Lock className="w-5 h-5 text-[#1B4332]" /> Unlock {worker.name}'s Contact
            </DialogTitle>
            <DialogDescription>Numbers stay masked in the app; the worker's real number is revealed only to you.</DialogDescription>
          </DialogHeader>

          {worker.is_female_protected && (
            <div className="flex items-start gap-2 bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-800">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
              <span>This worker has an extra <b>Protected Number</b> shield. All contact goes through a virtual bridge for safety.</span>
            </div>
          )}

          <div className="grid gap-3 py-2">
            <button data-testid="unlock-ad" onClick={() => requireOtpThen("ad")}
              className="border border-slate-200 hover:border-emerald-500 rounded-xl p-4 text-start flex items-center gap-3 transition-all hover:shadow-md">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Play className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Watch a 30-second Ad</div>
                <div className="text-xs text-slate-500">Free — Rewarded Ad</div>
              </div>
              <span className="text-xs font-bold text-emerald-700">FREE</span>
            </button>

            <button data-testid="unlock-pay" onClick={() => requireOtpThen("pay")}
              className="border border-slate-200 hover:border-[#1B4332] rounded-xl p-4 text-start flex items-center gap-3 transition-all hover:shadow-md">
              <div className="w-11 h-11 rounded-full bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">Pay ₹30 via UPI / Razorpay</div>
                <div className="text-xs text-slate-500">Instant unlock, no ads</div>
              </div>
              <span className="text-sm font-bold text-[#1B4332]">₹30</span>
            </button>
          </div>
          <Button variant="ghost" onClick={onClose} data-testid="unlock-cancel">Cancel</Button>
        </DialogContent>
      </Dialog>

      <RewardedAd open={showAd} onClose={() => setShowAd(false)} onReward={finishAd} title={`Unlock ${worker?.name}'s contact`} />
      <OtpModal open={showOtp} onClose={() => setShowOtp(false)} onVerified={onOtpVerified} />
    </>
  );
}
