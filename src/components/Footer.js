import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto w-full" style={{ background: "#1B4332", color: "#D1FAE5" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

          <div>
            <p className="text-lg font-bold mb-1" style={{ color: "#fff" }}>
              Rozgar
            </p>
            <p className="text-xs text-green-300 leading-relaxed mt-2">
              Connecting skilled workers with employers across Telangana.
              117+ trades · 33 districts · 4 languages.
            </p>
            <p className="text-xs text-green-400 mt-3">Platform data as on September 15, 2026</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3">Platform</p>
            <div className="flex flex-col gap-2">
              <Link to="/workers" className="text-xs text-green-300 hover:text-white">Browse Workers</Link>
              <Link to="/jobs" className="text-xs text-green-300 hover:text-white">Browse Jobs</Link>
              <Link to="/post-job" className="text-xs text-green-300 hover:text-white">Post a Job</Link>
              <Link to="/login" className="text-xs text-green-300 hover:text-white">Login</Link>
              <Link to="/signup" className="text-xs text-green-300 hover:text-white">Sign Up</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3">Legal & Support</p>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-xs text-green-300 hover:text-white">Terms & Conditions</Link>
              <Link to="/privacy" className="text-xs text-green-300 hover:text-white">Privacy Policy</Link>
              <Link to="/refund" className="text-xs text-green-300 hover:text-white">Refund Policy</Link>
              <Link to="/about" className="text-xs text-green-300 hover:text-white">About Us</Link>
              <Link to="/contact" className="text-xs text-green-300 hover:text-white">Contact Us</Link>
              <Link to="/faq" className="text-xs text-green-300 hover:text-white">FAQ</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <p className="text-xs text-green-400">© Copyright 2026 Rozgar Platform · All rights reserved</p>
        <p className="text-xs text-green-500 mt-1">Operated by Mohammed Shamsh Tabrez · Hyderabad, Telangana, India</p>
      </div>
    </footer>
  );
}
