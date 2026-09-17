import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function AdBanner({ position = "bottom" }) {
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get("/settings").then(({data}) => setSettings(data)); }, []);
  if (!settings) return null;
  const testMode = settings.ad_test_mode;
  return (
    <div data-testid="ad-banner"
      className={`${position === "bottom" ? "fixed md:sticky bottom-16 md:bottom-0 inset-x-0 z-20 px-20 md:px-0" : ""} flex justify-center pointer-events-none`}>
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
