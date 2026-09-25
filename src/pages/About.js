import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

const trades = [
  "Mason", "Carpenter", "Electrician", "Plumber", "Painter",
  "Welder", "Tiler", "Driver", "Cook", "Tailor",
  "AC Technician", "Security Guard", "Cleaner", "Helper", "Gardner",
];

const languages = [
  { name: "English", native: "English" },
  { name: "Telugu", native: "తెలుగు" },
  { name: "Hindi", native: "हिंदी" },
  { name: "Urdu", native: "اردو" },
];

export default function About() {
  const { lang } = useApp();

  useEffect(() => {
    document.title = "About Us — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { number: "117+", labelKey: "about_stat1_label" },
    { number: "33", labelKey: "about_stat2_label" },
    { number: "4", labelKey: "about_stat3_label" },
    { number: "2026", labelKey: "about_stat4_label" },
  ];

  const offers = [
    { icon: "👷", titleKey: "about_offer1_title", descKey: "about_offer1_desc" },
    { icon: "🏢", titleKey: "about_offer2_title", descKey: "about_offer2_desc" },
    { icon: "📞", titleKey: "about_offer3_title", descKey: "about_offer3_desc" },
    { icon: "🤖", titleKey: "about_offer4_title", descKey: "about_offer4_desc" },
    { icon: "💬", titleKey: "about_offer5_title", descKey: "about_offer5_desc" },
    { icon: "🌐", titleKey: "about_offer6_title", descKey: "about_offer6_desc" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-16 px-4 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-green-300 text-xs hover:text-white mb-4 block">
          ← Back to Rozgar Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">{t("about_title", lang)}</h1>
        <p className="text-green-200 text-sm max-w-xl mx-auto leading-relaxed">
          {t("about_subtitle", lang)}
        </p>
        <p className="text-green-300 text-lg mt-4 font-medium tracking-wide">
          Rozgar · ఉపాధి · रोजगार · روزگار
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: "#1B4332" }}>{s.number}</p>
              <p className="text-xs text-gray-500 mt-1">{t(s.labelKey, lang)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>{t("about_mission_title", lang)}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("about_mission_body", lang)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>{t("about_story_title", lang)}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("about_story_body", lang)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>{t("about_offer_title", lang)}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {offers.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: "#F0FDF4" }}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1B4332" }}>{t(item.titleKey, lang)}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t(item.descKey, lang)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>{t("about_trades_title", lang)}</h2>
          <div className="flex flex-wrap gap-2">
            {trades.map((tr, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>{tr}</span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#1B4332", color: "#fff" }}>{t("about_more_trades", lang)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>{t("about_languages_title", lang)}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {languages.map((l, i) => (
              <div key={i} className="text-center p-3 rounded-lg" style={{ background: "#F0FDF4" }}>
                <p className="text-lg font-bold" style={{ color: "#1B4332" }}>{l.native}</p>
                <p className="text-xs text-gray-500 mt-1">{l.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <Link to="/workers" className="inline-block px-6 py-3 rounded-xl text-white text-sm font-medium mr-3" style={{ background: "#1B4332" }}>
            {t("about_browse_workers", lang)}
          </Link>
          <Link to="/contact" className="inline-block px-6 py-3 rounded-xl text-sm font-medium border" style={{ color: "#1B4332", borderColor: "#1B4332" }}>
            {t("about_contact_us", lang)}
          </Link>
        </div>

        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">© Copyright 2026 Rozgar Platform · All rights reserved</p>
          <p className="text-xs text-gray-400 mt-1">Rozgar ఉపాధి रोजगार روزگار</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/refund", label: "Refund Policy" },
              { to: "/contact", label: "Contact" },
              { to: "/faq", label: "FAQ" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-xs underline" style={{ color: "#1B4332" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
