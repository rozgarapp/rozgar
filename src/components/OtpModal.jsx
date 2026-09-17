import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Label } from "./ui/label";
import { Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api, { fmtDetail } from "../lib/api";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

export default function OtpModal({ open, onClose, onVerified }) {
  const { setUser, user, lang } = useApp();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (open) { setStep("phone"); setPhone(""); setCode(""); setDevCode(""); } }, [open]);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
      toast.error("Enter a valid 10-digit Indian mobile"); return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/otp/request", { phone });
      setDevCode(data.dev_code || "");
      setStep("code");
      toast.success("OTP sent");
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
    finally { setBusy(false); }
  };

  const verify = async () => {
    setBusy(true);
    try {
      await api.post("/otp/verify", { phone, code });
      // reflect verified state
      if (user) setUser({ ...user, otp_verified: true });
      toast.success("Mobile verified ✓");
      onVerified?.();
      onClose();
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-testid="otp-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1B4332]" /> {t("otp_title", lang)}
          </DialogTitle>
          <DialogDescription>{t("otp_desc", lang)}</DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <div className="space-y-3">
            <Label>{t("otp_mobile_label", lang)}</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 text-sm">+91</div>
              <Input inputMode="numeric" maxLength={10} placeholder="98••••••••"
                value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} data-testid="otp-phone" className="min-h-[44px]" />
            </div>
            <Button onClick={sendOtp} disabled={busy}
              className="w-full bg-[#1B4332] hover:bg-[#143225] h-11" data-testid="otp-send">
              <Phone className="w-4 h-4 me-2" /> {t("otp_send", lang)}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Label>Enter 6-digit code sent to +91 {phone}</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} data-testid={`otp-slot-${i}`} />)}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {devCode && (
              <div className="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                🧪 Dev mode — OTP: <span className="font-mono font-bold">{devCode}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep("phone")} className="min-h-[44px]">← Change</Button>
              <Button onClick={verify} disabled={busy || code.length !== 6}
                className="flex-1 bg-[#1B4332] hover:bg-[#143225] h-11" data-testid="otp-verify">
                {t("otp_verify", lang)}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
