import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../lib/i18n";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

export default function CategorySection() {
  const nav = useNavigate();
  const { lang } = useApp();

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{t("categories", lang)}</h2>
        <p className="text-slate-600 mb-8 text-sm sm:text-base">9 categories · 105+ skilled and general trades</p>

        <div className="space-y-8">
          {CATEGORIES.map((cat) => (
            <div key={cat.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                     style={{ backgroundColor: cat.bg, borderColor: cat.border }}>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
                <h3 className="heading font-bold text-slate-900 text-lg">{cat.label[lang] || cat.label.EN}</h3>
                <span className="text-xs text-slate-500">· {cat.trades.length} trades</span>
                {!cat.skilled && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">UNSKILLED</span>}
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-5 md:overflow-visible snap-x snap-mandatory">
                {cat.trades.map(([trade, emoji]) => (
                  <button
                    key={trade}
                    data-testid={`tile-${trade.toLowerCase().replace(/[\s/&]+/g, "-")}`}
                    onClick={() => nav(`/workers?trade=${encodeURIComponent(trade)}`)}
                    className="group shrink-0 md:shrink w-32 md:w-auto flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200 bg-white transition-all rz-card-shadow hover:-translate-y-0.5 snap-start min-h-[44px]"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 shadow-inner mb-2 group-hover:scale-110 transition-transform"
                         style={{ backgroundColor: cat.bg, borderColor: cat.border }}>
                      <span>{emoji}</span>
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate-800 text-center leading-tight">{trade}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
