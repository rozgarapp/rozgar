import { useEffect } from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Who We Are",
    content: `Rozgar Platform is operated by Mohammed Shamsh Tabrez, Hyderabad, Telangana, India. Email: mdstabrez1@gmail.com. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the Rozgar platform.`,
  },
  {
    title: "2. What Data We Collect",
    content: `We collect the following types of data:\n\n• Registration data: name, mobile number, email address, trade/skill, district, and location\n• Profile data: photo, experience, languages spoken, availability\n• Usage data: pages visited, features used, time spent on platform\n• Payment data: transaction ID, amount paid (we do not store card or bank details)\n• Device data: IP address, browser type, device type`,
  },
  {
    title: "3. How We Use Your Data",
    content: `We use your data to:\n\n• Create and manage your account\n• Show your profile to potential employers\n• Allow employers to unlock your contact details (with your consent at registration)\n• Send important platform notifications\n• Improve platform features and user experience\n• Display relevant advertisements via Google AdMob\n• Comply with legal obligations under Indian law`,
  },
  {
    title: "4. Contact Unlock & Data Sharing",
    content: `When an employer pays ₹30 to unlock your contact, your phone number or email is shared with that employer only. You consent to this possibility at the time of registration. We do not sell your personal data to any third party for marketing purposes.`,
  },
  {
    title: "5. Google AdMob & Third-Party Advertising",
    content: `Rozgar uses Google AdMob to display advertisements. Google may use cookies and device identifiers to show you personalised ads based on your interests. You can opt out of personalised ads by visiting Google's Ad Settings at adssettings.google.com. We are not responsible for data collected by Google AdMob under their own privacy policy.`,
  },
  {
    title: "6. Cookies & Local Storage",
    content: `Rozgar uses browser local storage to keep you logged in and remember your language preference. We do not use tracking cookies for marketing purposes. Third-party services such as Google AdMob may set their own cookies on your device.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your personal data for as long as your account is active. If you delete your account, your data will be removed from our active systems within 30 days. Some data may be retained longer where required by Indian law or for legitimate business purposes such as dispute resolution.`,
  },
  {
    title: "8. Your Rights",
    content: `You have the right to:\n\n• Access the personal data we hold about you\n• Correct inaccurate data\n• Request deletion of your account and data\n• Withdraw consent for contact sharing by deleting your profile\n• Complain to the relevant data protection authority\n\nTo exercise any of these rights, email mdstabrez1@gmail.com.`,
  },
  {
    title: "9. Data Security",
    content: `We implement industry-standard security measures to protect your data including HTTPS encryption, JWT-based authentication, and secure database storage. However, no system is completely secure and we cannot guarantee absolute security of your data transmitted over the internet.`,
  },
  {
    title: "10. Children's Privacy",
    content: `Rozgar is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a minor has registered, we will delete their account and data immediately.`,
  },
  {
    title: "11. Compliance with Indian Law",
    content: `This Privacy Policy is compliant with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. We are committed to complying with applicable Indian data protection laws including the Digital Personal Data Protection Act, 2023.`,
  },
  {
    title: "12. GDPR (For International Users)",
    content: `If you are accessing Rozgar from the European Union or United Kingdom, you have additional rights under GDPR including the right to data portability and the right to object to processing. The legal basis for processing your data is your consent given at registration and our legitimate interest in operating the platform.`,
  },
  {
    title: "13. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via the platform or email. Continued use of Rozgar after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: "14. Contact Us",
    content: `For any privacy-related questions or requests, please contact:\n\nMohammed Shamsh Tabrez\nOperator, Rozgar Platform\nHyderabad, Telangana, India\nEmail: mdstabrez1@gmail.com`,
  },
];

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — Rozgar";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: "#1B4332" }} className="py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-green-200 text-sm">Effective Date: September 15, 2026</p>
        <p className="text-green-300 text-xs mt-1">
          Operated by Mohammed Shamsh Tabrez · mdstabrez1@gmail.com
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            At <strong>Rozgar</strong>, your privacy is important to us. This policy explains
            clearly what data we collect, why we collect it, and how we protect it. We
