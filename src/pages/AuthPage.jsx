import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";
import { fmtDetail } from "../lib/api";
import { t } from "../lib/i18n";

function googleLogin() {
  const redirectUrl = window.location.origin + "/dashboard";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function AuthPage({ mode = "login" }) {
  const { login, register, lang } = useApp();
  const nav = useNavigate();
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ email: "", password: "", name: "", phone: "", role: "worker" });
  const [busy, setBusy] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSignup && !agreed) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    setBusy(true);
    try {
      if (isSignup) { localStorage.setItem("rz_role", form.role); await register(form); }
      else { await login(form.email, form.password); }
      toast.success(isSignup ? "Welcome to Rozgar!" : "Welcome back!");
      nav("/dashboard");
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-4 py-10">
      <div className="max-w-md w-full mx-auto">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6" data-testid="auth-logo">
          <div className="w-10 h-10 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-extrabold text-lg">R</div>
          <span className="text-2xl font-extrabold text-[#1B4332] heading">{t("brand", lang)}</span>
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 rz-card-shadow p-6 sm:p-8">
          <h1 className="heading text-2xl font-extrabold text-slate-900 text-center">
            {isSignup ? t("signup", lang) : t("login", lang)}
          </h1>
          <p className="text-slate-600 text-sm text-center mt-1">
            {isSignup ? "Join thousands of workers & contractors" : "Welcome back to Rozgar"}
          </p>

          <Button type="button" variant="outline" onClick={googleLogin}
            className="w-full mt-6 h-11 gap-2 border-slate-300" data-testid="auth-google">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            {t("continue_google", lang)}
          </Button>

          <div className="my-4 flex items-center gap-3 text-slate-400">
            <div className="flex-1 h-px bg-slate-200" /><span className="text-xs">{t("or", lang)}</span><div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {isSignup && (
              <>
                <div>
                  <Label className="text-sm">{t("name", lang)}</Label>
                  <Input required data-testid="auth-name" value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">{t("i_am", lang)}</Label>
                  <RadioGroup value={form.role} onValueChange={(v) => set("role", v)} className="grid grid-cols-2 gap-2 mt-1">
                    <label className={`border-2 rounded-lg p-3 cursor-pointer text-sm ${form.role === "worker" ? "border-[#1B4332] bg-emerald-50" : "border-slate-200"}`}>
                      <RadioGroupItem value="worker" className="sr-only" data-testid="role-worker" />
                      🛠️ {t("worker", lang)}
                    </label>
                    <label className={`border-2 rounded-lg p-3 cursor-pointer text-sm ${form.role === "employer" ? "border-[#1B4332] bg-emerald-50" : "border-slate-200"}`}>
                      <RadioGroupItem value="employer" className="sr-only" data-testid="role-employer" />
                      🏗️ {t("employer", lang)}
                    </label>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-sm">{t("phone", lang)}</Label>
                  <Input data-testid="auth-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" placeholder="+91" />
                </div>
              </>
            )}
            <div>
              <Label className="text-sm">{t("email", lang)}</Label>
              <Input required type="email" data-testid="auth-email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-sm">{t("password", lang)}</Label>
              <Input required type="password" data-testid="auth-password" value={form.password} onChange={(e) => set("password", e.target.value)} className="mt-1" />
            </div>

            {isSignup && (
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#1B4332] cursor-pointer flex-shrink-0"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#1B4332] font-semibold underline" target="_blank">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#1B4332] font-semibold underline" target="_blank">
                    Privacy Policy
                  </Link>{" "}
                  of Rozgar Platform
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={busy || (isSignup && !agreed)}
              className="w-full h-11 bg-[#1B4332] hover:bg-[#143225] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="auth-submit"
            >
              {busy ? "Please wait…" : isSignup ? t("signup", lang) : t("login", lang)}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-600 mt-4">
            {isSignup ? (<>Already have an account? <Link to="/login" className="text-[#1B4332] font-semibold">{t("login", lang)}</Link></>)
              : (<>New here? <Link to="/signup" className="text-[#1B4332] font-semibold">{t("signup", lang)}</Link></>)}
          </div>
        </div>
      </div>
    </div>
  );
}
