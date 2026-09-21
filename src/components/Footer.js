import { Link } from "react-router-dom";

function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 md:bottom-6 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white text-lg"
      style={{ background: "#1B4332" }}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

export default function Footer() {
  return (
    <>
      <ScrollToTop />
      <footer className="mt-auto w-full" style={{ background: "#1B4332", color: "#D1FAE5" }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Link
                to="/"
                className="text-base font-bold mb-1 block hover:opacity-90 transition-opacity w-fit"
                style={{ color: "#fff" }}
              >
                Rozgar · ఉపాధి · रोजगार · روزگار
              </Link>
              <p className="text-xs text-green-300 leading-relaxed mt-2">
                Connecting skilled workers with employers across Telangana in 4 languages.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-3">Legal & Support</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
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
          <p className="text-xs text-green-500 mt-1">
            Contact: <a href="mailto:rozgarapp2026@gmail.com" className="underline">rozgarapp2026@gmail.com</a>
          </p>
        </div>
      </footer>
    </>
  );
}
