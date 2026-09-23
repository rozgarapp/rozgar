import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import api from "../lib/api";

const LOCAL_ADS = [
  { icon: "🔧", title: "Tool & Hardware — Hyderabad", desc: "Rent or buy tools for your project. Best prices in Telangana.", cta: "View Offer", color: "#FEF3C7", textColor: "#92400E" },
  { icon: "🏗️", title: "Sri Sai Construction Materials", desc: "Cement · Steel · Bricks — Delivered to your site in 24hrs.", cta: "Order Now", color: "#DBEAFE", textColor: "#1E40AF" },
  { icon: "🚌", title: "QuickRide — Worker Transport", desc: "Daily pickup & drop for construction workers. ₹50/day.", cta: "Book Now", color: "#F0FDF4", textColor: "#166534" },
  { icon: "🏥", title: "Arogya Health Insurance", desc: "Low-cost health cover for workers. From ₹99/month.", cta: "Learn More", color: "#FDF2F8", textColor: "#9D174D" },
];

export default function AdBanner({ position = "bottom" }) {
  const [settings, setSettings] = useState(null);
  const [localAd] = useState(() => LOCAL_ADS[Math.floor(Math.random() * LOCAL_ADS.length)]);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  if (!settings) return null;
  const testMode = settings.ad_test_mode;

  // TOP BANNER — below navbar
  if (position === "top") {
    return (
      <div data-testid="ad-banner-top" className="w-full flex justify-center bg-slate-50 border-b border-slate-200 py-1.5 px-4">
        <div className="flex items-center gap-3 max-w-3xl w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg px-4 py-2">
          <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase flex-shrink-0">Ad</span>
          <div className="text-xs flex-1 truncate">
            {testMode ? "Google AdMob — Test Placement · Top Banner" : "Sponsored: Find the best workers in Telangana · Rozgar Pro"}
          </div>
          <span className="text-[9px] text-slate-400 flex-shrink-0">{testMode ? "TEST" : "LIVE"}</span>
        </div>
      </div>
    );
  }

  // MID BANNER — between sections
  if (position === "mid") {
    return (
      <div data-testid="ad-banner-mid" className="w-full py-4 px-4 bg-white border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-[9px] text-slate-400 mb-1.5 text-center uppercase tracking-wider">Advertisement</p>
          {testMode ? (
            <div className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl px-5 py-3">
              <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase flex-shrink-0">Ad</span>
              <div className="text-sm flex-1">Google AdMob — Test Placement · Mid Banner</div>
              <span className="text-[9px] text-slate-400">TEST</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-4 rounded-xl px-5 py-4 border"
              style={{ background: localAd.color, borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className="text-3xl flex-shrink-0">{localAd.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: localAd.textColor }}>{localAd.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 truncate">{localAd.desc}</p>
              </div>
              <button
                className="text-xs font-semibold px-4 py-2 rounded-lg text-white flex-shrink-0"
                style={{ background: localAd.textColor }}
              >
                {localAd.cta}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOCAL AD — native style
  if (position === "local") {
    return (
      <div data-testid="ad-banner-local" className="w-full py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[9px] text-slate-400 mb-1.5 uppercase tracking-wider">Sponsored</p>
          <div
            className="flex items-center gap-4 rounded-xl px-5 py-4 border"
            style={{ background: localAd.color, borderColor: "rgba(0,0,0,0.08)" }}
          >
            <div className="text-3xl flex-shrink-0">{localAd.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: localAd.textColor }}>{localAd.title}</p>
              <p className="text-xs text-slate-600 mt-0.5">{localAd.desc}</p>
            </div>
            <button
              className="text-xs font-semibold px-4 py-2 rounded-lg text-white flex-shrink-0"
              style={{ background: localAd.textColor }}
            >
              {localAd.cta}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // BOTTOM BANNER — sticky on mobile
  return (
    <div data-testid="ad-banner"
      className="fixed md:sticky bottom-16 md:bottom-0 inset-x-0 z-20 px-20 md:px-0 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-2xl mx-auto my-2 border border-slate-700 overflow-hidden"
        style={{ maxWidth: "min(calc(100vw - 160px), 728px)" }}>
        <div className="flex items-center gap-3 px-4 py-2">
          <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase">Ad</span>
          <div className="text-xs sm:text-sm flex-1 truncate">
            {testMode ? "Google AdMob — Test Placement" : "Sponsored: Grow your trade business with Rozgar Pro"}
          </div>
          <span className="text-[9px] text-slate-400 hidden sm:inline">{testMode ? "TEST" : "LIVE"}</span>
        </div>
      </div>
    </div>
  );
}
