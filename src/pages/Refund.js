import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

const sectionIcons = ["📞", "🚀", "⭐", "💳", "🔁", "🔄", "📧", "⚖️"];
const sectionKeys = [
  { titleKey: "refund_s1_title", bodyKey: "refund_s1_body" },
  { titleKey: "refund_s2_title", bodyKey: "refund_s2_body" },
  { titleKey: "refund_s3_title", bodyKey: "refund_s3_body" },
  { titleKey: "refund_s4_title", bodyKey: "refund_s4_body" },
  { titleKey: "refund_s5_title", bodyKey: "refund_s5_body" },
  { titleKey: "refund_s6_title", bodyKey: "refund_s6_body" },
  { titleKey: "refund_s7_title", bodyKey: "refund_s7_body" },
  { titleKey: "refund_s8_title", bodyKey: "refund_s8_body" },
];

export default function Refund() {
  const { lang } = useApp();

  useEffect(() => {
    document.title = "Refund Policy — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-green-300 text-xs hover:text-white mb-4 block">
          ← Back to Rozgar Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">{t("refund_title", lang)}</h1>
        <p className="text-green-200 text-sm">Effective Date: September 15, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          {[
            { labelKey: "refund_stat1_label", statusKey: "refund_stat1_status", color: "#DC2626" },
            { labelKey: "refund_stat2_label", statusKey: "refund_stat2_status", color: "#DC2626" },
            { labelKey: "refund_stat3_label", statusKey: "refund_stat3_status", color: "#1B4332" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{t(item.labelKey, lang)}</p>
              <p className="text-sm font-semibold" style={{ color: item.color }}>{t(item.statusKey, lang)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("refund_intro", lang)}
          </p>
        </div>

        {sectionKeys.map((sec, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#1B4332" }}>
              <span>{sectionIcons[i]}</span><span>{t(sec.titleKey, lang)}</span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{t(sec.bodyKey, lang)}</p>
          </div>
        ))}

        <div className="rounded-xl p-6 mb-6 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1B4332" }}>{t("refund_help_title", lang)}</p>
          <p className="text-xs text-gray-600">
            Email us at{" "}
            <a href="mailto:rozgarapp2026@gmail.com" className="underline font-medium" style={{ color: "#1B4332" }}>
              rozgarapp2026@gmail.com
            </a>{" "}— {t("refund_help_body", lang)}
          </p>
        </div>

        <div className="text-center mt-6 pb-6">
          <p className="text-xs text-gray-400">© Copyright 2026 Rozgar Platform · All rights reserved</p>
          <p className="text-xs text-gray-400 mt-1">Rozgar ఉపాధి रोजगार روزگار</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/about", label: "About Us" },
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
