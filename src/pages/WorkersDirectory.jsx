import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import WorkerCard from "../components/WorkerCard";
import { useApp } from "../context/AppContext";
import { CATEGORIES, DISTRICTS, CATEGORY_MAP, t } from "../lib/i18n";
import api from "../lib/api";
import { useSearchParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Loader2, Shield, SearchX } from "lucide-react";

const CAT_EMOJI = { construction: "🧱", industrial: "🔩", electrical: "⚡", domestic: "🏠",
  agriculture: "🌾", logistics: "📦", beauty: "💄", healthcare: "🏥", unskilled: "👷" };

const SORT_OPTIONS = [
  { key: "available", label: "Available Today First" },
  { key: "rating", label: "Highest Rated" },
  { key: "rate_asc", label: "Lowest Rate" },
  { key: "rate_desc", label: "Highest Rate" },
];

export default function WorkersDirectory() {
  const { lang } = useApp();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const district = params.get("district") || "";
  const trade = params.get("trade") || "";
  const skill = params.get("skill") || "";
  const femaleOnly = params.get("female") === "1";
  const sort = params.get("sort") || "available";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (category) q.category = category;
    if (district) q.district = district;
    if (trade) q.trade = trade;
    if (skill) q.skill = skill;
    api.get("/workers", { params: q }).then(({ data }) => setItems(data)).finally(() => setLoading(false));
  }, [category, district, trade, skill]);

  const setParam = (k, v) => {
    const p = new URLSearchParams(params);
    if (v && v !== "all") p.set(k, v); else p.delete(k);
    setParams(p);
  };

  const filtered = useMemo(() => {
    let out = items;
    if (femaleOnly) out = out.filter(w => w.is_female_protected);
    if (search.trim()) {
      const s = search.toLowerCase();
      out = out.filter(w => [w.name, w.trade, w.category, w.district, CATEGORY_MAP[w.category]?.label?.EN, w.bio]
        .some(v => (v || "").toLowerCase().includes(s)));
    }
    const sorted = [...out];
    if (sort === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "rate_asc") sorted.sort((a, b) => (a.daily_rate || 0) - (b.daily_rate || 0));
    else if (sort === "rate_desc") sorted.sort((a, b) => (b.daily_rate || 0) - (a.daily_rate || 0));
    else sorted.sort((a, b) => {
      const av = a.availability === "available" ? 0 : 1;
      const bv = b.availability === "available" ? 0 : 1;
      return av - bv || (b.rating || 0) - (a.rating || 0);
    });
    return sorted;
  }, [items, femaleOnly, search, sort]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{t("find_workers", lang)}</h1>
        <p className="text-slate-600 text-sm mb-6">{filtered.length} workers found</p>

        <div className="grid sm:grid-cols-4 gap-3 mb-4 sticky top-16 z-30 bg-slate-50 py-3 -mx-2 px-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_placeholder", lang)} data-testid="worker-search"
            className="sm:col-span-2 w-full h-11 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/40" />
          <Select value={category || "all"} onValueChange={(v) => setParam("category", v)}>
            <SelectTrigger data-testid="filter-category"
              className={`min-h-[44px] ${category ? "bg-[#1B4332] text-white border-[#1B4332]" : "bg-white"}`}>
              <SelectValue placeholder={t("all_categories", lang)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_categories", lang)}</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c.key} value={c.key}>
                  {CAT_EMOJI[c.key]} {c.label[lang] || c.label.EN} ({c.trades.length} trades)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={district || "all"} onValueChange={(v) => setParam("district", v)}>
            <SelectTrigger data-testid="filter-district" className="bg-white min-h-[44px]"><SelectValue placeholder={t("all_districts", lang)} /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">{t("all_districts", lang)}</SelectItem>
              {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Skilled / Unskilled toggle */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1" data-testid="skill-toggle">
            {[
              { key: "", label: t("all_workers", lang) },
              { key: "skilled", label: t("skilled", lang) },
              { key: "unskilled", label: t("unskilled", lang) },
            ].map(o => (
              <button key={o.key} onClick={() => setParam("skill", o.key || null)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold min-h-[36px] ${
                  (params.get("skill") || "") === o.key ? "bg-[#1B4332] text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
                data-testid={`skill-${o.key || "all"}`}>
                {o.label}
              </button>
            ))}
          </div>

          {/* Female-Safe toggle */}
          <label className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 min-h-[42px] cursor-pointer ${
            femaleOnly ? "bg-pink-50 border-pink-300" : "bg-white border-slate-200"
          }`}>
            <Switch checked={femaleOnly} onCheckedChange={(v) => setParam("female", v ? "1" : null)}
              data-testid="female-safe-toggle" />
            <Shield className="w-3.5 h-3.5 text-pink-600" />
            <span className="text-xs font-semibold text-slate-700">Female Safe Only</span>
          </label>

          {/* Sort */}
          <div className="ms-auto">
            <Select value={sort} onValueChange={(v) => setParam("sort", v === "available" ? null : v)}>
              <SelectTrigger data-testid="sort-select" className="bg-white min-h-[42px] w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => (
                  <SelectItem key={o.key} value={o.key} data-testid={`sort-${o.key}`}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {trade && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 mb-4 w-fit">
            <span className="text-xs text-slate-500">Trade:</span>
            <span className="text-sm font-semibold text-[#1B4332]">{trade}</span>
            <button onClick={() => setParam("trade", null)} className="ms-1 text-slate-400 hover:text-slate-700 text-lg leading-none">×</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#1B4332]" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" data-testid="empty-state">
            <SearchX className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <div className="text-slate-700 font-semibold">No workers found</div>
            <div className="text-slate-500 text-sm mt-1">Try a different district, clear filters, or search a broader trade.</div>
            <button onClick={() => { setSearch(""); setParams(new URLSearchParams()); }}
              className="mt-4 text-sm font-semibold text-[#1B4332] underline" data-testid="clear-filters">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(w => <WorkerCard key={w.worker_id} worker={w} />)}
          </div>
        )}
      </div>
    </div>
  );
}
