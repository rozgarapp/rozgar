import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Add/remove promos here — each needs a unique id, image, and optional link
const PROMOS = [
  {
    id: "promo_launch_2026",
    image: "/ads/rozgar_promo.svg",
    alt: "Rozgar — Find Trusted Workers Near You",
    link: "/workers",
  },
  // Add more promos here later, e.g.:
  // { id: "promo_diwali_2026", image: "/ads/diwali_offer.svg", alt: "Diwali Offer", link: "/jobs" },
];

const ROTATE_INTERVAL_MS = 6000;
const DISMISS_KEY = "rozgar_dismissed_promos";

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(DISMISS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [index, setIndex] = useState(0);

  const visiblePromos = PROMOS.filter((p) => !dismissed.includes(p.id));

  useEffect(() => {
    if (visiblePromos.length <= 1) return;
    const iv = setInterval(() => {
      setIndex((i) => (i + 1) % visiblePromos.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(iv);
  }, [visiblePromos.length]);

  if (visiblePromos.length === 0) return null;

  const current = visiblePromos[index % visiblePromos.length];

  const handleDismiss = (e) => {
    e.stopPropagation();
    const updated = [...dismissed, current.id];
    setDismissed(updated);
    localStorage.setItem(DISMISS_KEY, JSON.stringify(updated));
    setIndex(0);
  };

  const BannerContent = (
    <div
      className="relative rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
      data-testid="promo-banner"
    >
      <img
        src={current.image}
        alt={current.alt}
        className="w-full h-auto object-cover transition-opacity duration-500"
      />
      <button
        onClick={handleDismiss}
        aria-label="Dismiss promotion"
        data-testid="promo-dismiss"
        className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      {visiblePromos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visiblePromos.map((p, i) => (
            <span
              key={p.id}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index % visiblePromos.length ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-6">
      {current.link ? (
        <a href={current.link}>{BannerContent}</a>
      ) : (
        BannerContent
      )}
    </div>
  );
}
