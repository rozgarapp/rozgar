import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Phone, Shield, PhoneCall } from "lucide-react";
import api, { fmtDetail } from "../lib/api";
import { toast } from "sonner";

export default function ProxyCallModal({ open, onClose, worker }) {
  const [status, setStatus] = useState("initiating");
  const [proxy, setProxy] = useState("");

  useEffect(() => {
    if (!open) return;
    setStatus("initiating"); setProxy("");
    api.post("/proxy-call", { worker_id: worker.worker_id })
      .then(({ data }) => { setProxy(data.proxy_number); setStatus("connected"); })
      .catch((e) => { setStatus("failed"); toast.error(fmtDetail(e.response?.data?.detail)); });
  }, [open, worker]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-testid="proxy-call-modal" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="heading flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1B4332]" /> Private call to {worker.name}
          </DialogTitle>
          <DialogDescription>
            Your real number and the worker's real number stay private. Both sides see a virtual bridge number.
          </DialogDescription>
        </DialogHeader>

        <div className="relative rounded-2xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white p-6 text-center">
          {status === "initiating" && (
            <>
              <PhoneCall className="w-10 h-10 mx-auto mb-3 animate-pulse" />
              <div className="text-lg font-bold">Connecting your call…</div>
              <div className="text-xs text-emerald-200 mt-1">Bridging via Exotel virtual number</div>
            </>
          )}
          {status === "connected" && (
            <>
              <PhoneCall className="w-10 h-10 mx-auto mb-3" />
              <div className="text-xs uppercase text-emerald-200 mb-1">Proxy number</div>
              <div className="text-2xl font-extrabold font-mono" data-testid="proxy-number">{proxy}</div>
              <div className="text-xs text-emerald-200 mt-2">Tap dial to call · call expires in 5 min</div>
              <a href={`tel:${proxy.replace(/\D/g, "")}`}
                className="mt-4 inline-flex items-center gap-2 bg-white text-[#1B4332] font-bold rounded-lg px-4 py-2">
                <Phone className="w-4 h-4" /> Dial now
              </a>
            </>
          )}
          {status === "failed" && (
            <div className="text-rose-100">Call failed — please retry or verify your mobile.</div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1"><Shield className="w-3 h-3" /> Both numbers are masked. Call logged for safety.</div>
        <Button variant="ghost" onClick={onClose} data-testid="proxy-close">Close</Button>
      </DialogContent>
    </Dialog>
  );
}
