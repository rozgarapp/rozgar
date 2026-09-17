import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t, LANGS } from "../lib/i18n";
import { Home, Briefcase, Users, MessageSquare, User, LogOut, Settings, ShieldCheck, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import OtpModal from "./OtpModal";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

// Wordmark helper — bold word swaps by locale; small tagline shows the other three
const WORDS = {
  EN: { bold: "Rozgar", tagline: [["te", "ఉపాధి"], ["hi", "रोजगार"], ["ur", "روزگار"]] },
  TE: { bold: "ఉపాధి", lang: "te", tagline: [["en", "Rozgar"], ["hi", "रोजगार"], ["ur", "روزگار"]] },
  HI: { bold: "रोजगार", lang: "hi", tagline: [["en", "Rozgar"], ["te", "ఉపాధి"], ["ur", "روزگار"]] },
  UR: { bold: "روزگار", lang: "ur", tagline: [["en", "Rozgar"], ["te", "ఉపాధి"], ["hi", "रोजगार"]], rtl: true },
};

function BrandLockup({ lang, animate }) {
  const cfg = WORDS[lang] || WORDS.EN;
  const isMulti = lang !== "EN";
  const boldClass = "text-xl font-extrabold text-[#1B4332] heading rz-brand-swap";
  const boldLangAttr = cfg.lang ? { lang: cfg.lang } : {};
  return (
    <span key={lang} className="flex items-baseline gap-2 min-w-0" data-testid="brand-lockup">
      <span
        className={`${boldClass} ${lang === "UR" ? "rz-wordmark-urdu" : ""} ${animate && lang === "EN" ? "rz-anim-word d1" : ""} ${isMulti ? "rz-wordmark-multi" : ""}`}
        style={isMulti ? { color: "#1B4332" } : undefined}
        {...boldLangAttr}
        data-testid="brand-bold"
      >
        {cfg.bold}
      </span>
      <span className="hidden sm:inline-flex items-baseline gap-1.5 text-sm rz-wordmark-multi truncate" data-testid="nav-multi-script" dir="ltr">
        {cfg.tagline.map(([code, word], i) => (
          <span
            key={code}
            lang={code}
            className={`${code === "ur" ? "rz-wordmark-urdu" : ""} ${animate ? `rz-anim-word d${i + 2}` : ""}`}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { user, logout, lang, setLang } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [showOtp, setShowOtp] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstLoadRef = useRef(!sessionStorage.getItem("rz_brand_animated"));
  useEffect(() => { sessionStorage.setItem("rz_brand_animated", "1"); }, []);

  const linkCls = (path) =>
    `text-sm font-medium transition-colors ${loc.pathname === path ? "text-[#1B4332]" : "text-slate-600 hover:text-[#1B4332]"}`;

  const closeDrawerAnd = (fn) => () => { setDrawerOpen(false); fn?.(); };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Hamburger on mobile */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center" data-testid="nav-hamburger" aria-label="Menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="start" className="w-72 p-0">
                <SheetHeader className="px-5 py-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-extrabold">R</div>
                    <span className="text-[#1B4332]">{t("brand", lang)}</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-1">
                  <DrawerLink to="/" onClick={closeDrawerAnd(() => nav("/"))} icon={Home} label={t("home", lang)} data-testid="drawer-home" />
                  <DrawerLink to="/workers" onClick={closeDrawerAnd(() => nav("/workers"))} icon={Users} label={t("find_workers", lang)} data-testid="drawer-workers" />
                  <DrawerLink to="/jobs" onClick={closeDrawerAnd(() => nav("/jobs"))} icon={Briefcase} label={t("browse_jobs", lang)} data-testid="drawer-jobs" />
                  {user && <DrawerLink to="/chat" onClick={closeDrawerAnd(() => nav("/chat"))} icon={MessageSquare} label={t("chat", lang)} data-testid="drawer-chat" />}
                  {user && <DrawerLink to="/dashboard" onClick={closeDrawerAnd(() => nav("/dashboard"))} icon={User} label={t("my_dashboard", lang)} data-testid="drawer-dashboard" />}
                  {user?.email?.toLowerCase() === "mdstabrez1@gmail.com" && (
                    <DrawerLink to="/admin" onClick={closeDrawerAnd(() => nav("/admin"))} icon={Settings} label="Admin" data-testid="drawer-admin" />
                  )}
                  <div className="mt-4 border-t pt-3">
                    <div className="text-xs text-slate-500 mb-2 px-2">Language</div>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGS.map(l => (
                        <button key={l.code} onClick={() => setLang(l.code)}
                          className={`min-h-[44px] rounded-lg text-sm ${lang === l.code ? "bg-[#1B4332] text-white" : "border border-slate-200"}`}
                          data-testid={`drawer-lang-${l.code}`}>
                          {l.code} · {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {!user ? (
                    <div className="mt-4 grid gap-2">
                      <Button onClick={closeDrawerAnd(() => nav("/login"))} variant="outline" className="min-h-[44px]">{t("login", lang)}</Button>
                      <Button onClick={closeDrawerAnd(() => nav("/signup"))} className="min-h-[44px] bg-[#1B4332] hover:bg-[#143225]">{t("signup", lang)}</Button>
                    </div>
                  ) : (
                    <>
                      {user.role === "employer" && !user.otp_verified && (
                        <Button onClick={closeDrawerAnd(() => setShowOtp(true))} variant="outline" className="mt-3 min-h-[44px]" data-testid="drawer-verify">
                          <ShieldCheck className="w-4 h-4 me-2" /> {t("verify_mobile", lang)}
                        </Button>
                      )}
                      <Button onClick={closeDrawerAnd(async () => { await logout(); nav("/"); })} variant="ghost" className="mt-2 min-h-[44px] text-rose-600" data-testid="drawer-logout">
                        <LogOut className="w-4 h-4 me-2" /> {t("logout", lang)}
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" data-testid="nav-logo" className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 shrink-0 rounded-lg bg-[#1B4332] text-white flex items-center justify-center font-extrabold shadow">R</div>
              <BrandLockup lang={lang} animate={firstLoadRef.current} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/workers" data-testid="nav-workers" className={linkCls("/workers")}>{t("find_workers", lang)}</Link>
            <Link to="/jobs" data-testid="nav-jobs" className={linkCls("/jobs")}>{t("browse_jobs", lang)}</Link>
            {user && <Link to="/chat" data-testid="nav-chat" className={linkCls("/chat")}>{t("chat", lang)}</Link>}
            {user && <Link to="/dashboard" data-testid="nav-dashboard" className={linkCls("/dashboard")}>{t("my_dashboard", lang)}</Link>}
          </nav>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" data-testid="lang-toggle" className="rounded-full hidden sm:inline-flex min-h-[36px]">{lang}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)} data-testid={`lang-${l.code}`}>
                    {l.code} — {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {!user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => nav("/login")} data-testid="btn-login" className="hidden sm:inline-flex">{t("login", lang)}</Button>
                <Button size="sm" onClick={() => nav("/signup")}
                  className="bg-[#1B4332] hover:bg-[#143225] text-white hidden sm:inline-flex" data-testid="btn-signup">
                  {t("signup", lang)}
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="user-menu" className="rounded-full gap-2 border-slate-200 min-h-[36px]">
                    {user.otp_verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5" data-testid="verified-employer-badge">
                        <ShieldCheck className="w-3 h-3" /> ✓
                      </span>
                    )}
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => nav("/dashboard")} data-testid="menu-dashboard">{t("my_dashboard", lang)}</DropdownMenuItem>
                  {user.role === "employer" && !user.otp_verified && (
                    <DropdownMenuItem onClick={() => setShowOtp(true)} data-testid="menu-verify">
                      <ShieldCheck className="w-4 h-4 me-2" /> {t("verify_mobile", lang)}
                    </DropdownMenuItem>
                  )}
                  {user.email?.toLowerCase() === "mdstabrez1@gmail.com" && (
                    <DropdownMenuItem onClick={() => nav("/admin")} data-testid="menu-admin">
                      <Settings className="w-4 h-4 me-2" /> Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={async () => { await logout(); nav("/"); }} data-testid="menu-logout">
                    <LogOut className="w-4 h-4 me-2" /> {t("logout", lang)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200">
        <div className="grid grid-cols-5 h-16">
          <Link to="/" className="flex flex-col items-center justify-center gap-1 text-slate-600 min-h-[44px]" data-testid="bnav-home"><Home className="w-5 h-5" /><span className="text-[10px]">{t("home", lang)}</span></Link>
          <Link to="/workers" className="flex flex-col items-center justify-center gap-1 text-slate-600 min-h-[44px]" data-testid="bnav-workers"><Users className="w-5 h-5" /><span className="text-[10px]">{t("workers", lang)}</span></Link>
          <Link to="/jobs" className="flex flex-col items-center justify-center gap-1 text-slate-600 min-h-[44px]" data-testid="bnav-jobs"><Briefcase className="w-5 h-5" /><span className="text-[10px]">{t("jobs", lang)}</span></Link>
          <Link to="/chat" className="flex flex-col items-center justify-center gap-1 text-slate-600 min-h-[44px]" data-testid="bnav-chat"><MessageSquare className="w-5 h-5" /><span className="text-[10px]">{t("chat", lang)}</span></Link>
          <Link to={user ? "/dashboard" : "/login"} className="flex flex-col items-center justify-center gap-1 text-slate-600 min-h-[44px]" data-testid="bnav-profile"><User className="w-5 h-5" /><span className="text-[10px]">{t("profile", lang)}</span></Link>
        </div>
      </nav>
      <OtpModal open={showOtp} onClose={() => setShowOtp(false)} />
    </>
  );
}

function DrawerLink({ onClick, icon: I, label, ...rest }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 min-h-[44px]" {...rest}>
      <I className="w-4 h-4 text-[#1B4332]" /> <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
