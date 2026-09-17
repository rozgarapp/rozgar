import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const already = sessionStorage.getItem("rz_splash_shown");
    if (already) { setGone(true); return; }
    sessionStorage.setItem("rz_splash_shown", "1");
    const timer = setTimeout(() => setGone(true), 1900);
    return () => clearTimeout(timer);
  }, []);
  if (gone) return null;

  return (
    <div className="rz-splash" data-testid="splash-screen">
      <div className="text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-white/10 mx-auto mb-5 flex items-center justify-center text-4xl font-extrabold">R</div>
        <div className="heading text-[28px] font-extrabold text-white leading-none">Rozgar</div>
        <div className="mt-3 flex items-baseline justify-center gap-2 rz-wordmark-multi text-[16px]" style={{ color: "#52B788" }}>
          <span lang="te" className="rz-anim-word d2">ఉపాధి</span>
          <span lang="hi" className="rz-anim-word d3">रोजगार</span>
          <span lang="ur" className="rz-anim-word d4 rz-wordmark-urdu">روزگار</span>
        </div>
        <div className="mt-6 text-xs text-emerald-200/80 tracking-wider uppercase">Telangana's Trade Worker Marketplace</div>
      </div>
    </div>
  );
}
