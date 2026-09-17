import { useNavigate } from "react-router-dom";
import { CATEGORY_MAP } from "../lib/i18n";
import { MapPin, Users, Calendar, Zap, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";

export default function JobCard({ job, onApply }) {
  const nav = useNavigate();
  const { lang } = useApp();
  const cat = CATEGORY_MAP[job.category];
  const boosted = job.boosted && (job.boost_expires_at || "") > new Date().toISOString();
  const statewide = boosted && job.boost_type === "statewide";

  return (
    <div data-testid={`job-card-${job.job_id}`}
      className={`rz-card-shadow bg-white rounded-2xl border p-5 hover:-translate-y-0.5 transition-all fade-in-up ${
        statewide ? "border-amber-400 ring-2 ring-amber-300/40" :
        boosted ? "border-emerald-400 ring-2 ring-emerald-300/30" : "border-slate-200"
      }`}>
      {boosted && (
        <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${
          statewide ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"}`} data-testid="boost-badge">
          {statewide ? <><Rocket className="w-3 h-3" /> URGENT · STATEWIDE</> : <><Zap className="w-3 h-3" /> BOOSTED</>}
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
             style={{ backgroundColor: cat?.bg, color: cat?.color }}>
          {job.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 heading text-base line-clamp-1">{job.title}</h3>
          <div className="text-xs text-slate-500">{job.trade}</div>
        </div>
        <div className="text-end">
          <div className="text-lg font-extrabold text-[#1B4332]">₹{job.daily_rate}</div>
          <div className="text-[10px] text-slate-500">per day</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.district}</div>
        <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.workers_needed} needed</div>
        <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{job.start_date}</div>
      </div>

      {job.description && <p className="mt-2 text-xs text-slate-600 line-clamp-2">{job.description}</p>}

      <div className="mt-3 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => nav(`/jobs/${job.job_id}`)}
          className="text-xs h-8" data-testid={`job-details-${job.job_id}`}>Details</Button>
        {onApply && (
          <Button size="sm" onClick={() => onApply(job)}
            className="text-xs h-8 bg-[#1B4332] hover:bg-[#143225] text-white"
            data-testid={`job-apply-${job.job_id}`}>{t("apply", lang)}</Button>
        )}
      </div>
    </div>
  );
}
