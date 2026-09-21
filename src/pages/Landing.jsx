import { Link } from "react-router-dom";

import CategorySection from "../components/CategorySection";
import WorkerCard from "../components/WorkerCard";
import AdBanner from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { t, TOTAL_TRADES } from "../lib/i18n";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, Users } from "lucide-react";

const HERO_TILES = [
  { trade: "Mason",       emoji: "🧱", bg: "#FFF3EC", border: "#FFCBA4", rate: 900 },
  { trade: "Electrician", emoji: "⚡", bg: "#FFFBEA", border: "#FFE082", rate: 1000 },
  { trade: "Beautician",  emoji: "💇", bg: "#FFF0F5", border: "#F8BBD9", rate: 800 },
  { trade: "Cook",        emoji: "👨‍🍳", bg: "#F0FAF4", border: "#A8DABC", rate: 700 },
  { trade: "Driver",      emoji: "🚗", bg: "#EBF5FB", border: "#AED6F1", rate: 800 },
  { trade: "Plumber",     emoji: "🔧", bg: "#F5EEF8", border: "#D7BDE2", rate: 900 },
];

export default function Landing() {
  const { lang } = useApp();
  const nav = useNavigate();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/workers").then(({ data }) => setFeatured(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-16">
    

      {/* Hero — flat illustration, no photo */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#F0FAF4" }}>
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(#A8DABC 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
          {/* Illustration tiles */}
          <div className="fade-in-up order-2 md:order-1">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {HERO_TILES.map((tile, i) => (
                <div key={tile.trade} className="flex flex-col items-center bg-white/70 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/60 shadow-sm"
                     data-testid={`hero-tile-${tile.trade.toLowerCase()}`}
                     style={{ animation: `fadeInUp .4s ${i * 80}ms ease-out both` }}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 shadow-inner"
                       style={{ backgroundColor: tile.bg, borderColor: tile.border }}>
                    {tile.emoji}
                  </div>
                  <div className="mt-2 text-[10px] font-bold" style={{ color: "#1B4332" }}>{tile.trade}</div>
                  </div>
              ))}
            </div>
            <div className="mt-6 hidden sm:flex bg-white rounded-2xl p-4 rz-card-shadow items-center gap-3 max-w-fit">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Verified workers</div>
                <div className="font-bold text-slate-900">Trusted profiles</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Serving all 33 districts · {TOTAL_TRADES}+ trades · 4.7★
            </div>
            <div className="heading">
              <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: "#1B4332", fontSize: "clamp(28px,4vw,44px)" }}>Rozgar</div>
              <div className="mt-1 rz-wordmark-multi text-sm sm:text-base" style={{ color: "#2D6A4F", fontSize: "clamp(12px,1.4vw,16px)" }}>
                <span lang="te">ఉపాధి</span>&nbsp;&nbsp;<span lang="hi">रोजगार</span>&nbsp;&nbsp;<span lang="ur" className="rz-wordmark-urdu">روزگار</span>
              </div>
            </div>
            <p className="mt-4 text-slate-700 text-base sm:text-lg max-w-xl">
              {t("tagline", lang)}
            </p>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">{t("hero_cta", lang)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => nav("/workers")}
                className="bg-[#1B4332] hover:bg-[#143225] text-white h-12 px-6 min-h-[44px]" data-testid="cta-find-workers">
                {t("find_workers", lang)}
              </Button>
              <Button size="lg" variant="outline" onClick={() => nav("/jobs")}
                className="h-12 px-6 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332]/5 min-h-[44px]" data-testid="cta-browse-jobs">
                {t("browse_jobs", lang)}
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div><div className="text-2xl font-extrabold text-[#1B4332]">33</div><div className="text-xs text-slate-600">Districts</div></div>
              <div><div className="text-2xl font-extrabold text-[#1B4332]">{TOTAL_TRADES}+</div><div className="text-xs text-slate-600">Trade skills</div></div>
              <div><div className="text-2xl font-extrabold text-[#1B4332]">4.7★</div><div className="text-xs text-slate-600">Avg. rating</div></div>
            </div>
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900">{t("featured_workers", lang)}</h2>
              <p className="text-slate-600 text-sm">Top-rated workers ready for hire</p>
            </div>
            <Button variant="ghost" onClick={() => nav("/workers")} data-testid="see-all-workers">See all →</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((w) => <WorkerCard key={w.worker_id} worker={w} />)}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Verified profiles", body: "Every worker profile is district-verified." },
            { icon: Zap, title: "Instant contact", body: "Unlock phone numbers with an ad or a small fee." },
            { icon: Users, title: "Smart ATS", body: "Contractors track applications with a modern ATS." },
          ].map((f, i) => (
            <div key={i} className="rz-card-shadow bg-white rounded-2xl border border-slate-200 p-6">
              <div className="w-12 h-12 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mb-3">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="heading font-bold text-slate-900 text-lg">{f.title}</h3>
              <p className="text-slate-600 text-sm mt-1">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      
<AdBanner position="bottom" />
    </div>
  );
}
