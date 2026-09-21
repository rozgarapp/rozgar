import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const workerFaqs = [
  { q: "How do I register as a worker on Rozgar?", a: "Click 'Sign Up' on the home page, select 'Worker', fill in your name, mobile number, email, trade/skill, district, and experience. Your profile goes live immediately after registration." },
  { q: "Is registration free for workers?", a: "Yes, worker registration is completely free. You can create your profile, list your skills, and be discovered by employers at no cost." },
  { q: "How will employers find me?", a: "Employers search by trade, district, and availability. Make sure your profile is complete with your trade, location, experience, and a clear photo to appear higher in search results." },
  { q: "Can I list more than one trade or skill?", a: "Yes. During registration or while editing your profile, you can add multiple skills. For example, you can list both 'Electrician' and 'AC Technician' if you have both skills." },
  { q: "Will my phone number be visible to everyone?", a: "No. Your contact details are hidden by default. An employer must pay ₹30 to unlock your contact. You agreed to this possibility when you registered. You can delete your profile at any time to remove yourself." },
  { q: "How do I get hired faster?", a: "Complete your profile fully — add a photo, list all your skills, write a short description of your experience, and keep your availability status updated. Active profiles appear higher in search." },
  { q: "Can I use Rozgar in Telugu, Hindi, or Urdu?", a: "Yes. Rozgar supports 4 languages — English, Telugu (తెలుగు), Hindi (हिंदी), and Urdu (اردو). Use the language selector in the top navigation bar to switch." },
  { q: "How do I delete my account?", a: "Email us at rozgarapp2026@gmail.com with your registered email or mobile number and request account deletion. We will delete your account and data within 7 working days." },
  { q: "What trades are available on Rozgar?", a: "Rozgar covers 117+ trades including Mason, Carpenter, Electrician, Plumber, Painter, Welder, Tiler, Driver, Cook, Tailor, AC Technician, Security Guard, Cleaner, Helper, Gardner, and many more." },
  { q: "Which districts does Rozgar cover?", a: "Rozgar covers all 33 districts of Telangana including Hyderabad, Warangal, Nizamabad, Karimnagar, Khammam, Adilabad, Nalgonda, Medak, and all others." },
];

const employerFaqs = [
  { q: "How do I post a job on Rozgar?", a: "Sign up as an Employer, then click 'Post a Job'. Fill in the job title, trade required, location, and job description. Your job listing goes live immediately." },
  { q: "How does Contact Unlock work?", a: "When you find a worker whose profile matches your requirement, click 'Unlock Contact'. Pay ₹30 securely. The worker's phone number or email is revealed instantly. No subscription needed." },
  { q: "Is the ₹30 contact unlock fee refundable?", a: "No. Once a contact is revealed, the fee is non-refundable as the service is fully delivered. However, if you paid but the contact was not shown due to a technical error, you will receive a full refund within 7 working days." },
  { q: "Can I unlock multiple workers?", a: "Yes. You can unlock as many worker contacts as you need. Each contact costs ₹30. There is no monthly subscription — pay only for what you use." },
  { q: "What is Job Boost?", a: "Job Boost promotes your job listing to the top of search results so more workers see it. Once activated, the boost fee is non-refundable. Boosted jobs get significantly more visibility." },
  { q: "What is a Premium Listing?", a: "A Premium Listing gives your employer profile a featured badge and higher placement in search results for a fixed period (30 or 90 days). This helps attract better workers faster." },
  { q: "How do I pay for contact unlock or job boost?", a: "Rozgar accepts UPI, net banking, and debit/credit cards. All payments are processed securely. You will receive a confirmation after each successful payment." },
  { q: "What if a worker does not respond after I unlock their contact?", a: "Rozgar connects you with workers but cannot guarantee their availability or response. If a worker is unavailable, you can unlock another worker's contact. We recommend unlocking 2–3 contacts for best results." },
  { q: "Can I report a fake or inactive worker profile?", a: "Yes. If you find a profile that appears fake, outdated, or misleading, email us at rozgarapp2026@gmail.com with the worker's name and profile link. We will investigate and remove it if found invalid." },
  { q: "Is there a free trial for employers?", a: "Employer registration and browsing worker profiles is free. You only pay ₹30 when you choose to unlock a specific worker's contact. There are no hidden charges." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl mb-3 overflow-hidden bg-white shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-3">
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
  const [tab, setTab] = useState("worker");

  useEffect(() => {
    document.title = "FAQ — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-green-200 text-sm">Find answers to the most common questions about Rozgar</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex bg-white rounded-xl border border-gray-100 shadow-sm p-1 mb-8">
          {[
            { key: "worker", label: "👷 For Workers", count: workerFaqs.length },
            { key: "employer", label: "🏢 For Employers", count: employerFaqs.length },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
              style={tab === t.key ? { background: "#1B4332", color: "#fff" } : { color: "#6B7280" }}>
              {t.label}
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={tab === t.key ? { background: "rgba(255,255,255,0.2)", color: "#fff" } : { background: "#F3F4F6", color: "#6B7280" }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div>
          {tab === "worker"
            ? workerFaqs.map((item, i) => <FaqItem key={i} {...item} />)
            : employerFaqs.map((item, i) => <FaqItem key={i} {...item} />)}
        </div>

        <div className="rounded-xl p-6 mt-8 mb-6 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1B4332" }}>Still have a question?</p>
          <p className="text-xs text-gray-500 mb-4">We're happy to help. Send us a message and we'll reply within 2 working days.</p>
          <Link to="/contact" className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-medium" style={{ background: "#1B4332" }}>
            Contact Us →
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
