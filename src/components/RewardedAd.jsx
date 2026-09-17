import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Play, Gift } from "lucide-react";

export default function RewardedAd({ open, onClose, onReward, title = "Watch to Unlock" }) {
  const [secs, setSecs] = useState(0);
  const [started, setStarted] = useState(false);
  const total = 30;

  useEffect(() => {
    if (!open) { setSecs(0); setStarted(false); return; }
  }, [open]);

  useEffect(() => {
    if (!started) return;
    const iv = setInterval(() => setSecs(s => {
      if (s + 1 >= total) { clearInterval(iv); return total; }
      return s + 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [started]);

  const complete = secs >= total;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && (complete || !started) && onClose()}>
      <DialogContent data-testid="rewarded-ad" className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="heading flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-500" /> {title}
        </DialogTitle></DialogHeader>
        <div className="relative bg-gradient-to-br from-slate-900 to-[#1B4332] text-white aspect-video rounded-xl flex flex-col items-center justify-center">
          <div className="absolute top-2 start-2 text-[10px] font-bold bg-amber-500 text-black px-2 py-1 rounded">REWARDED AD</div>
          {!started ? (
            <>
              <Play className="w-16 h-16 opacity-80 mb-3" />
              <div className="text-lg font-semibold">30-Second Video Ad</div>
              <div className="text-emerald-200 text-xs mt-1">Watch to unlock your reward</div>
            </>
          ) : (
            <>
              <div className="text-6xl font-extrabold">{total - secs}</div>
              <div className="text-xs text-emerald-200 mt-2">Simulated video playing…</div>
            </>
          )}
        </div>

        {started && (<Progress value={(secs / total) * 100} className="h-2" data-testid="ad-progress" />)}

        <div className="flex justify-end gap-2 mt-2">
          {!started && (
            <Button onClick={() => setStarted(true)} data-testid="ad-play"
              className="bg-emerald-600 hover:bg-emerald-700">
              <Play className="w-4 h-4 me-1" /> Play Ad
            </Button>
          )}
          {complete && (
            <Button onClick={() => { onReward(); }} data-testid="ad-claim"
              className="bg-[#1B4332] hover:bg-[#143225]">
              🎁 Claim Reward
            </Button>
          )}
          {!started && (
            <Button variant="ghost" onClick={onClose} data-testid="ad-cancel">Cancel</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
