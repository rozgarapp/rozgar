import { useEffect } from "react";
import { Link } from "react-router-dom";

const stats = [
  { number: "117+", label: "Trades & Skills" },
  { number: "33", label: "Districts Covered" },
  { number: "4", label: "Languages" },
  { number: "2026", label: "Founded" },
];

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
  useEffect(() => {
    document.title = "About Us — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-16 px-4 text-center">
  <Link to="/" className="inline-flex items-center gap-1 text-green-300 text-xs hover:text-white mb-4 block">
    ← Back to Rozgar Home
  </Link>
  <h1 className="text-3xl font-bold text-white mb-2">About Rozgar</h1>
  <p className="text-green-200 text-sm max-w-xl mx-auto leading-relaxed">
    Connecting skilled workers with employers across Telangana — in your language, in your district.
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
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>🎯 Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Rozgar exists to connect skilled workers across Telangana with employers who need them.
            We built Rozgar to bridge that gap with technology that is simple, fast, and available
            in the languages people actually speak.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>📖 Our Story</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Rozgar was founded in 2026 in Hyderabad, Telangana. The vision was straightforward:
            build a platform that works for the worker — not just in English, but in Telugu, Hindi,
            and Urdu too. A platform where a plumber in Warangal or a driver in Adilabad can be
            found by an employer in minutes, not days.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>💼 What We Offer</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { icon: "👷", title: "Worker Profiles", desc: "Workers create free profiles showcasing their trade, experience, location and availability" },
              { icon: "🏢", title: "Job Listings", desc: "Employers post jobs and find the right worker from 117+ trades across 33 districts" },
              { icon: "📞", title: "Contact Unlock", desc: "Employers pay just ₹30 to unlock a worker's contact — no subscriptions needed" },
              { icon: "🤖", title: "MatchBot", desc: "AI-powered matching to suggest the best workers for each job requirement" },
              { icon: "💬", title: "In-App Chat", desc: "Direct messaging between workers and employers within the platform" },
              { icon: "🌐", title: "4 Languages", desc: "Full platform support in English, Telugu, Hindi, and Urdu" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: "#F0FDF4" }}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1B4332" }}>{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>🔧 Some of Our 117+ Trades</h2>
          <div className="flex flex-wrap gap-2">
            {trades.map((t, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>{t}</span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#1B4332", color: "#fff" }}>+ 100 more</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>🌐 Available in 4 Languages</h2>
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
            Browse Workers
          </Link>
          <Link to="/contact" className="inline-block px-6 py-3 rounded-xl text-sm font-medium border" style={{ color: "#1B4332", borderColor: "#1B4332" }}>
            Contact Us
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
