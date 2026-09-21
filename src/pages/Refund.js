import { useEffect } from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Contact Unlock Fee — ₹30",
    icon: "📞",
    content: `Employers pay ₹30 to unlock a worker's contact details (phone number or email).\n\nThis fee is strictly non-refundable once the contact details have been revealed on screen.\n\nReason: The service is considered fully delivered at the moment the contact is displayed. Rozgar cannot "un-reveal" contact information once shown.`,
  },
  {
    title: "2. Job Boost — Non-Refundable After Activation",
    icon: "🚀",
    content: `Job boost fees paid to promote a job listing to the top of search results are non-refundable once the boost has been activated.\n\nIf a boost is purchased but not yet activated, please contact us within 24 hours at rozgarapp2026@gmail.com for a possible refund consideration.`,
  },
  {
    title: "3. Premium Listing — No Pro-Rata Refund",
    icon: "⭐",
    content: `Premium worker or employer listing fees are charged for a fixed duration (e.g. 30 days or 90 days).\n\nNo pro-rata refunds are issued if you choose to cancel your premium listing before the period ends.\n\nYour listing will remain active until the end of the paid period even after cancellation.`,
  },
  {
    title: "4. Failed Payment — Full Refund Within 7 Days",
    icon: "💳",
    content: `If a payment is debited from your account but the corresponding service is NOT activated on Rozgar (e.g. contact not unlocked, boost not applied), you are entitled to a full refund.\n\nRefund will be processed within 7 working days to the original payment method.\n\nTo claim a failed payment refund, email rozgarapp2026@gmail.com with:\n• Your registered email or mobile number\n• Transaction ID or UPI reference number\n• Date and amount of payment\n• Screenshot of payment confirmation (if available)`,
  },
  {
    title: "5. Duplicate Payment",
    icon: "🔁",
    content: `If you are charged twice for the same service due to a technical error, the duplicate charge will be refunded in full within 7 working days.\n\nPlease email rozgarapp2026@gmail.com with both transaction IDs to report a duplicate payment.`,
  },
  {
    title: "6. Refund Process",
    icon: "🔄",
    content: `All eligible refunds are processed to the original payment method:\n\n• UPI payments → refunded to the same UPI ID\n• Net banking → refunded to the same bank account\n• Debit/Credit card → refunded to the same card\n\nRefund processing time: 5–7 working days after approval.\n\nRozgar does not issue cash refunds.`,
  },
  {
    title: "7. How to Request a Refund",
    icon: "📧",
    content: `To request a refund, email us at rozgarapp2026@gmail.com with the subject line: "Refund Request — [Your Name]"\n\nInclude in your email:\n• Registered email or mobile number\n• Nature of the payment (contact unlock / job boost / premium)\n• Transaction ID\n• Reason for refund request\n\nWe will respond within 2 working days.`,
  },
  {
    title: "8. Disputes",
    icon: "⚖️",
    content: `If you believe a refund has been wrongly denied, you may escalate the matter by emailing rozgarapp2026@gmail.com with "Refund Dispute" in the subject line.\n\nAll disputes are subject to the Terms & Conditions and the jurisdiction of courts in Hyderabad, Telangana, India.`,
  },
];

export default function Refund() {
  useEffect(() => {
    document.title = "Refund Policy — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Refund Policy</h1>
        <p className="text-green-200 text-sm">Effective Date: September 15, 2026</p>
        <p className="text-green-300 text-xs mt-1">
          Operated by Mohammed Shamsh Tabrez · rozgarapp2026@gmail.com
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          {[
            { label: "Contact Unlock ₹30", status: "Non-Refundable", color: "#DC2626" },
            { label: "Job Boost", status: "Non-Refundable after activation", color: "#DC2626" },
            { label: "Failed Payment", status: "Full Refund in 7 days", color: "#1B4332" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-sm font-semibold" style={{ color: item.color }}>{item.status}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Rozgar aims to be transparent about all fees and refunds. Please read this policy
            carefully before making any payment on our platform. For any payment issues,
            contact us at <strong>rozgarapp2026@gmail.com</strong>.
          </p>
        </div>

        {sections.map((sec, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: "#1B4332" }}>
              <span>{sec.icon}</span>
              <span>{sec.title}</span>
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {sec.content}
            </p>
          </div>
        ))}

        <div className="rounded-xl p-6 mb-6 text-center" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#1B4332" }}>Need help with a payment?</p>
          <p className="text-xs text-gray-600">
            Email us at{" "}
            <a href="mailto:rozgarapp2026@gmail.com" className="underline font-medium" style={{ color: "#1B4332" }}>
              rozgarapp2026@gmail.com
            </a>{" "}
            — we respond within 2 working days.
          </p>
        </div>

        <div className="text-center mt-6 pb-6">
          <p className="text-xs text-gray-400">© Copyright 2026 Rozgar Platform · All rights reserved</p>
          <p className="text-xs text-gray-400 mt-1">Rozgar ఉపాధి रोजगार روزగار</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/about", label: "About Us" },
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
