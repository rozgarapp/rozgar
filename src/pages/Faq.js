import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

const workerFaqs = Array.from({ length: 9 }, (_, i) => ({
  qKey: `faq_w${i + 1}_q`,
  aKey: `faq_w${i + 1}_a`,
}));

const employerFaqs = Array.from({ length: 9 }, (_, i) => ({
  qKey: `faq_e${i + 1}_q`,
  aKey: `faq_e${i + 1}_a`,
}));

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full text-start px-5 py-4 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-800">{q}</span>
        <span className="text-lg flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", color: "#1B4332" }}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Faq() {
  const { lang } = useApp();
  const [tab, setTab] = useState("worker");

  useEffect(() => {
    document.title = "FAQ — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  const list = tab === "worker" ? workerFaqs : employerFaqs;

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-green-300 text-xs hover:text-white mb-4 block">
          ← Back to Rozgar Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">{t("faq_title", lang)}</h1>
        <p className="text-green-200 text-sm">{t("faq_subtitle", lang)}</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-8">
          {[
            { key: "worker", labelKey: "faq_tab_worker", count: workerFaqs.length },
            { key: "employer", labelKey: "faq_tab_employer", count: employerFaqs.length },
          ].map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
              style={tab === tb.key ? { background: "#1B4332", color: "#fff" } : { color: "#6B7280" }}>
              {t(tb.labelKey, lang)}
              <span className="ms-2 text-xs px-1.5 py-0.5 rounded-full"
                style={tab === tb.key ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : { background: "#F3F4F6", color: "#6B7280" }}>
                {tb.count}
              </span>
            </button>
          ))}
        </div>

        <div>
          {list.map((item, i) => (
            <FaqItem key={i} q={t(item.qKey, lang)} a={t(item.aKey, lang)} />
          ))}
        </div>

        <div className="rounded-xl p-6 mt-8 mb-6 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1B4332" }}>{t("faq_still_title", lang)}</p>
          <p className="text-xs text-gray-500 mb-4">{t("faq_still_body", lang)}</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "#1B4332" }}>
            {t("faq_contact_btn", lang)}
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
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-xs underline" style={{ color: "#1B4332" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
