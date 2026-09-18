import { useEffect } from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. About Rozgar Platform",
    content: `Rozgar is an online platform connecting workers and employers across Telangana and India. The platform is operated by Mohammed Shamsh Tabrez, Hyderabad, Telangana, India. Email: mdstabrez1@gmail.com. By accessing or using Rozgar, you agree to be bound by these Terms & Conditions.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to register on Rozgar. By registering, you confirm that the information you provide is accurate, complete, and up to date. Rozgar reserves the right to suspend or terminate accounts found to contain false information.`,
  },
  {
    title: "3. Worker Obligations",
    content: `Workers registering on Rozgar must provide genuine trade skills, contact information, and location details. Workers are responsible for maintaining the accuracy of their profiles. Workers must not misrepresent their qualifications, experience, or availability. Rozgar is not responsible for any work agreements entered into between workers and employers.`,
  },
  {
    title: "4. Employer Obligations",
    content: `Employers must post genuine job opportunities only. Employers agree not to collect personal data of workers beyond what is necessary for hiring purposes. Employers must not discriminate against workers on the basis of religion, caste, gender, or any other protected characteristic. Job posts that are found to be fraudulent or misleading will be removed without notice.`,
  },
  {
    title: "5. Contact Unlock Feature",
    content: `Employers may unlock a worker's contact details by paying a fee of ₹30 per contact. Once the contact details are revealed, the transaction is considered complete and non-refundable. Rozgar does not guarantee that the worker will be available or will respond after their contact is unlocked.`,
  },
  {
    title: "6. Payments & Refunds",
    content: `All payments on Rozgar are processed securely. Contact unlock fees of ₹30 are non-refundable once the contact is revealed. Job boost and premium listing fees are non-refundable after activation. In the event of a failed payment where the amount is debited but the service is not activated, a full refund will be processed within 7 working days. For refund requests, email mdstabrez1@gmail.com with your transaction details.`,
  },
  {
    title: "7. Prohibited Activities",
    content: `Users must not: post false, misleading, or fraudulent content; harass, threaten, or abuse other users; attempt to bypass the contact unlock system; scrape, copy, or redistribute platform data without permission; use the platform for any illegal purpose under Indian law; create multiple accounts to manipulate the platform.`,
  },
  {
    title: "8. Advertising",
    content: `Rozgar may display third-party advertisements including Google AdMob ads. Rozgar is not responsible for the content of third-party advertisements. Clicking on advertisements may take you to external websites governed by their own terms and privacy policies.`,
  },
  {
    title: "9. Intellectual Property",
    content: `All content on Rozgar including text, logos, design, and code is the intellectual property of Mohammed Shamsh Tabrez unless otherwise stated. Users may not reproduce, distribute, or create derivative works from Rozgar content without written permission. The name "Rozgar" and its multilingual variants — ఉపాధి, रोजगार, روزگار — are trademarks of the platform.`,
  },
  {
    title: "10. Limitation of Liability",
    content: `Rozgar is a platform that facilitates connections between workers and employers. Rozgar is not a party to any employment agreement and bears no liability for disputes, non-payment, injury, or any loss arising from such agreements. To the maximum extent permitted by Indian law, Rozgar's total liability shall not exceed the amount paid by the user for the specific service in dispute.`,
  },
  {
    title: "11. Dispute Resolution",
    content: `Any disputes arising out of or related to these Terms shall first be attempted to be resolved through mutual negotiation. If unresolved within 30 days, disputes shall be subject to arbitration under the Arbitration and Conciliation Act, 1996 (India). The seat of arbitration shall be Hyderabad, Telangana. All disputes are subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.`,
  },
  {
    title: "12. Privacy",
    content: `Your privacy is important to us. Please review our Privacy Policy which explains how we collect, use, and protect your personal data. By using Rozgar, you consent to the data practices described in our Privacy Policy.`,
  },
  {
    title: "13. Termination",
    content: `Rozgar reserves the right to suspend or terminate any user account at any time for violation of these Terms, fraudulent activity, or any other reason deemed appropriate by the platform. Users may also delete their accounts at any time by contacting mdstabrez1@gmail.com.`,
  },
  {
    title: "14. Platform Data Accuracy",
    content: `Platform statistics including number of workers, trades, and districts are updated periodically. Data shown as of September 15, 2026 includes 117+ trades across 33 districts of Telangana in 4 languages. Rozgar does not guarantee real-time accuracy of these figures.`,
  },
  {
    title: "15. Governing Law",
    content: `These Terms & Conditions are governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000 and its amendments. Any legal proceedings shall be brought in the courts of Hyderabad, Telangana, India.`,
  },
  {
    title: "16. Changes to Terms",
    content: `Rozgar reserves the right to update these Terms & Conditions at any time. Users will be notified of significant changes via the platform or email. Continued use of the platform after changes constitutes acceptance of the new Terms.`,
  },
  {
    title: "17. Severability",
    content: `If any provision of these Terms is found to be invalid or unenforceable under applicable law, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.`,
  },
  {
    title: "18. Contact Information",
    content: `For any questions, concerns, or legal notices regarding these Terms & Conditions, please contact:\n\nMohammed Shamsh Tabrez\nOperator, Rozgar Platform\nHyderabad, Telangana, India\nEmail: mdstabrez1@gmail.com`,
  },
];

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-green-200 text-sm">Effective Date: September 15, 2026</p>
        <p className="text-green-300 text-xs mt-1">
          Operated by Mohammed Shamsh Tabrez · mdstabrez1@gmail.com
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Welcome to <strong>Rozgar</strong> — India's trusted platform connecting skilled workers
            with employers across Telangana. Please read these Terms & Conditions carefully before
            using our platform. By registering or using Rozgar, you agree to these terms in full.
          </p>
        </div>

        {sections.map((sec, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4"
          >
            <h2
              className="text-base font-semibold mb-3"
              style={{ color: "#1B4332" }}
            >
              {sec.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {sec.content}
            </p>
          </div>
        ))}

        {/* Footer note */}
        <div className="text-center mt-10 pb-6">
          <p className="text-xs text-gray-400">
            © Copyright 2026 Rozgar Platform · All rights reserved
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rozgar ఉపాధి रोजगार روزگار
          </p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/refund", label: "Refund Policy" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/faq", label: "FAQ" },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs underline"
                style={{ color: "#1B4332" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
