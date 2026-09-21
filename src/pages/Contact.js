import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact Us — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const subject = encodeURIComponent(form.subject || "Contact from Rozgar Platform");
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
      );
      window.location.href = `mailto:rozgarapp2026@gmail.com?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-green-200 text-sm">We're here to help — reach out anytime</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
          {[
            { icon: "📧", title: "Email Us", value: "rozgarapp2026@gmail.com", sub: "We reply within 2 working days", href: "mailto:rozgarapp2026@gmail.com" },
            { icon: "🕐", title: "Response Time", value: "Within 2 days", sub: "Mon – Sat", href: null },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs text-gray-500 mb-1">{item.title}</p>
              {item.href ? (
                <a href={item.href} className="text-sm font-semibold underline block" style={{ color: "#1B4332" }}>{item.value}</a>
              ) : (
                <p className="text-sm font-semibold" style={{ color: "#1B4332" }}>{item.value}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>✉️ Send Us a Message</h2>
          {submitted ? (
            <div className="rounded-xl p-6 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
              <div className="text-3xl mb-3">✅</div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1B4332" }}>Your email app should have opened!</p>
              <p className="text-xs text-gray-500">
                If it didn't open, email us directly at{" "}
                <a href="mailto:rozgarapp2026@gmail.com" className="underline" style={{ color: "#1B4332" }}>rozgarapp2026@gmail.com</a>
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-4 text-xs underline" style={{ color: "#1B4332" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What is this about?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message <span className="text-red-500">*</span></label>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help you..."
                  rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none" />
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white text-sm font-medium transition-opacity"
                style={{ background: "#1B4332", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Opening email..." : "Send Message →"}
              </button>
              <p className="text-xs text-gray-400 text-center">This will open your email app with your message pre-filled.</p>
            </form>
          )}
        </div>

        <div className="rounded-xl p-5 mb-6 flex items-center justify-between" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#1B4332" }}>Have a common question?</p>
            <p className="text-xs text-gray-500 mt-0.5">Check our FAQ — you might find the answer instantly.</p>
          </div>
          <Link to="/faq" className="text-xs font-medium px-4 py-2 rounded-lg text-white flex-shrink-0" style={{ background: "#1B4332" }}>
            View FAQ →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: "#1B4332" }}>📋 Common Topics</h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["Worker registration help","Employer account issues","Payment / refund queries","Contact unlock problems",
              "Report a fake profile","Partnership enquiry","Technical bug report","General feedback"].map((topic, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600 py-1">
                <span style={{ color: "#1B4332" }}>→</span>{topic}
              </div>
            ))}
          </div>
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
