import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

const langTagline = {
  EN: { main: "Rozgar", rest: " · ఉపాధి · रोजगार · روزگار" },
  TE: { main: "ఉపాధి", rest: " · Rozgar · रोजगार · روزگار" },
  HI: { main: "रोजगार", rest: " · Rozgar · ఉపాధి · روزگار" },
  UR: { main: "روزگار", rest: " · Rozgar · ఉపాధి · रोजगार" },
};

export default function Footer() {
  const { lang } = useApp();
  const tagline = langTagline[lang] || langTagline["EN"];

  return (
    <footer
      className="mt-auto w-full"
      style={{ background: "#1B4332", color: "#D1FAE5" }}
    >
      {/* Top section */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

          {/* Brand */}
          <div>
            <p
              className="text-lg font-bold mb-1 transition-all duration-200"
              style={{ color: "#fff" }}
            >
              <span style={{ fontSize: "1.2em" }}>{tagline.main}</span>
              <span className="text-green-300 text-sm font-normal">{tagline.rest}</span>
            </p>
            <p className="text-xs text-green-300 leading-relaxed mt-2">
              Connecting skilled workers with employers across Telangana.
              117+ trades · 33 districts · 4 languages.
            </p>
            <p className="text-xs text-green-400 mt-3">
              Platform data as on September 15, 2026
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3">
              Platform
            </p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/workers", label: "Browse Workers" },
                { to: "/jobs", label: "Browse Jobs" },
                { to: "/post-job", label: "Post a Job" },
                { to: "/login", label: "Login" },
                { to: "/signup", label: "Sign Up" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-xs text-green-300 hover:text-white transition-colors duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3">
              Legal & Support
            </p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/refund", label: "Refund Policy" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/faq", label: "FAQ" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-xs text-green-300 hover:text-white transition-colors duration-150"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-4 py-4 text-center"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <p className="text-xs text-green-400">
          © Copyright 2026 Rozgar Platform · All rights reserved
        </p>
        <p className="text-xs text-green-500 mt-1">
          Operated by Mohammed Shamsh Tabrez · Hyderabad, Telangana, India
        </p>
      </div>
    </footer>
  );
}
