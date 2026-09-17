import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function InterstitialAd({ open, onClose }) {
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    if (!open) { setCountdown(5); return; }
    const iv = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(iv);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && countdown === 0 && onClose()}>
      <DialogContent data-testid="interstitial-ad" className="sm:max-w-2xl p-0 overflow-hidden border-0">
        <div className="relative bg-gradient-to-br from-slate-900 via-[#1B4332] to-slate-800 text-white aspect-video flex flex-col items-center justify-center">
          <div className="absolute top-2 start-2 text-[10px] font-bold bg-amber-500 text-black px-2 py-1 rounded">SPONSORED</div>
          <div className="absolute top-2 end-2">
            {countdown > 0 ? (
              <div className="text-xs bg-black/40 rounded-full px-3 py-1">Skip in {countdown}s</div>
            ) : (
              <button onClick={onClose} data-testid="close-interstitial"
                className="bg-white/20 hover:bg-white/30 rounded-full p-1.5"><X className="w-4 h-4" /></button>
            )}
          </div>
          <div className="text-5xl mb-4">🛠️</div>
          <div className="heading text-3xl font-extrabold">Rozgar Pro</div>
          <div className="text-emerald-200 mt-2 text-sm">Unlock premium tools for contractors</div>
          <Button className="mt-6 bg-white text-[#1B4332] hover:bg-slate-100">Learn More</Button>
          <div className="absolute bottom-2 text-[10px] text-slate-400">AdMob Interstitial — Test Placement</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
