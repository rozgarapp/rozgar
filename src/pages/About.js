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

const timeline = [
  { year: "2025", text: "Idea born — a simple platform to connect skilled workers in Telangana with local employers" },
  { year: "Early 2026", text: "Development begins — built with React, FastAPI, and MongoDB" },
  { year: "Mid 2026", text: "Beta launch with 117+ trades across 33 districts of Telangana" },
  { year: "Sep 2026", text: "Official launch — available in 4 languages: English, Telugu, Hindi, Urdu" },
];

export default function About() {
  useEffect(() => {
    document.title = "About Us — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-16 px-4 text-center">
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
            Rozgar exists to solve a simple but powerful problem — skilled workers 
            struggle to find work, and employers struggle to find trusted workers. We built Rozgar
            to bridge that gap with technology that is simple, fast, and available in the languages
            people actually speak.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            Our mission is to create dignified employment opportunities for every skilled worker —
            by making them visible and reachable to employers who need them.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>📖 Our Story</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Rozgar was founded to solve a problem faced across industries: talented tradespeople struggling to get discovered by the right employers. Rozgar connects skilled workers with employers, making it easier for great talent to be found.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            The vision was straightforward: build a platform that works for the worker — not just
            in English, but in Telugu, Hindi, and Urdu too. A platform where a skilled worker 
            can be found by an employer in minutes, not days.
          </p>
          <div className="mt-6 border-l-2 pl-4" style={{ borderColor: "#1B4332" }}>
            {timeline.map((t, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <p className="text-xs font-semibold" style={{ color: "#1B4332" }}>{t.year}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">{t.text}</p>
              </div>
            ))}
          </div>
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
              <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "#D1FAE5", color: "#065F46" }}>
                {t}
              </span>
            ))}
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "#1B4332", color: "#fff" }}>
              + 100 more
            </span>
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

        <div className="rounded-xl p-6 mb-6" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>👤 About the Operator</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Rozgar</strong> is built and operated by a professional with real,
            hands-on experience in the skilled labour industry — someone who has
            seen firsthand the gap between talented workers and the employers
            who need them.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            That experience shaped Rozgar's mission: to make finding work, and
            finding workers, simple, fast, and fair.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            📧&nbsp;
            <a href="mailto:rozgarapp2026@gmail.com" style={{ color: "#1B4332" }} className="underline">
              rozgarapp2026@gmail.com
            </a>
            </a>
          </p>
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
              <Link key={l.to} to={l.to} className="text-xs underline" style={{ color: "#1B4332" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
