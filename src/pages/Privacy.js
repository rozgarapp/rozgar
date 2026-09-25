import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

const summarySections = [
  { titleKey: "privacy_s1_title", bodyKey: "privacy_s1_body" },
  { titleKey: "privacy_s2_title", bodyKey: "privacy_s2_body" },
  { titleKey: "privacy_s3_title", bodyKey: "privacy_s3_body" },
  { titleKey: "privacy_s4_title", bodyKey: "privacy_s4_body" },
  { titleKey: "privacy_s5_title", bodyKey: "privacy_s5_body" },
  { titleKey: "privacy_s6_title", bodyKey: "privacy_s6_body" },
  { titleKey: "privacy_s7_title", bodyKey: "privacy_s7_body" },
  { titleKey: "privacy_s8_title", bodyKey: "privacy_s8_body" },
];

const fullSectionsEN = [
  { title: "1. Who We Are", content: `Rozgar Platform is operated from Hyderabad, Telangana, India. Email: rozgarapp2026@gmail.com. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the Rozgar platform.` },
  { title: "2. What Data We Collect", content: `We collect the following types of data:\n\n• Registration data: name, mobile number, email address, trade/skill, district, and location\n• Profile data: photo, experience, languages spoken, availability\n• Usage data: pages visited, features used, time spent on platform\n• Payment data: transaction ID, amount paid (we do not store card or bank details)\n• Device data: IP address, browser type, device type` },
  { title: "3. How We Use Your Data", content: `We use your data to:\n\n• Create and manage your account\n• Show your profile to potential employers\n• Allow employers to unlock your contact details (with your consent at registration)\n• Send important platform notifications\n• Improve platform features and user experience\n• Display relevant advertisements via Google AdMob\n• Comply with legal obligations under Indian law` },
  { title: "4. Contact Unlock & Data Sharing", content: `When an employer pays ₹30 to unlock your contact, your phone number or email is shared with that employer only. You consent to this possibility at the time of registration. We do not sell your personal data to any third party for marketing purposes.` },
  { title: "5. Google AdMob & Third-Party Advertising", content: `Rozgar uses Google AdMob to display advertisements. Google may use cookies and device identifiers to show you personalised ads based on your interests. You can opt out of personalised ads by visiting Google's Ad Settings at adssettings.google.com.` },
  { title: "6. Cookies & Local Storage", content: `Rozgar uses browser local storage to keep you logged in and remember your language preference. We do not use tracking cookies for marketing purposes.` },
  { title: "7. Data Retention", content: `We retain your personal data for as long as your account is active. If you delete your account, your data will be removed from our active systems within 30 days.` },
  { title: "8. Your Rights", content: `You have the right to:\n\n• Access the personal data we hold about you\n• Correct inaccurate data\n• Request deletion of your account and data\n• Withdraw consent for contact sharing by deleting your profile\n\nTo exercise any of these rights, email rozgarapp2026@gmail.com.` },
  { title: "9. Data Security", content: `We implement industry-standard security measures including HTTPS encryption, JWT-based authentication, and secure database storage.` },
  { title: "10. Children's Privacy", content: `Rozgar is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from minors.` },
  { title: "11. Compliance with Indian Law", content: `This Privacy Policy is compliant with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.` },
  { title: "12. GDPR (For International Users)", content: `If you are accessing Rozgar from the European Union or United Kingdom, you have additional rights under GDPR including the right to data portability and the right to object to processing.` },
  { title: "13. Changes to This Policy", content: `We may update this Privacy Policy from time to time. Continued use of Rozgar after changes constitutes your acceptance of the updated policy.` },
  { title: "14. Contact Us", content: `For any privacy-related questions:\n\nRozgar Platform\nHyderabad, Telangana, India\nEmail: rozgarapp2026@gmail.com` },
];

export default function Privacy() {
  const { lang } = useApp();
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    document.title = "Privacy Policy — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <Link to="/" className="inline-flex items-center gap-1 text-green-300 text-xs hover:text-white mb-4 block">
          ← Back to Rozgar Home
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">{t("privacy_title", lang)}</h1>
        <p className="text-green-200 text-sm">Effective Date: September 15, 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("privacy_intro", lang)}
          </p>
        </div>

        {summarySections.map((sec, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>{t(sec.titleKey, lang)}</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{t(sec.bodyKey, lang)}</p>
          </div>
        ))}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-amber-900 text-sm mb-3">{t("privacy_full_note", lang)}</p>
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-sm font-semibold underline"
            style={{ color: "#1B4332" }}
          >
            {showFull ? "▲ " : "▼ "}{t("full_privacy_english", lang)}
          </button>
        </div>

        {showFull && (
          <div className="mb-6">
            {fullSectionsEN.map((sec, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
                <h2 className="text-base font-semibold mb-3" style={{ color: "#1B4332" }}>{sec.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{sec.content}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 pb-6">
          <p className="text-xs text-gray-400">© Copyright 2026 Rozgar Platform · All rights reserved</p>
          <p className="text-xs text-gray-400 mt-1">Rozgar ఉపాధి रोजगार روزگار</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            {[
              { to: "/terms", label: "Terms & Conditions" },
              { to: "/refund", label: "Refund Policy" },
              { to: "/about", label: "About Us" },
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
