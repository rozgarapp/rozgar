import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import AdBanner from "../components/AdBanner";
import InterstitialAd from "../components/InterstitialAd";
import { useApp } from "../context/AppContext";
import { CATEGORIES, DISTRICTS, t } from "../lib/i18n";
import api, { fmtDetail } from "../lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function JobsPage() {
  const { lang, user } = useApp();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");
  const [applying, setApplying] = useState(null);
  const [note, setNote] = useState("");
  const [interstitial, setInterstitial] = useState(false);

  const load = () => {
    const q = {};
    if (category !== "all") q.category = category;
    if (district !== "all") q.district = district;
    api.get("/jobs", { params: q }).then(({ data }) => setItems(data));
  };
  useEffect(load, [category, district]);

  const onApply = (job) => {
    if (!user) { toast.error("Please login as a worker to apply"); nav("/login"); return; }
    if (user.role !== "worker") { toast.error("Only workers can apply"); return; }
    setApplying(job); setNote("");
  };

  const submitApply = async () => {
    try {
      await api.post("/applications", { job_id: applying.job_id, cover_note: note });
      toast.success("Application submitted!");
      setApplying(null);
      setInterstitial(true);
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h1 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900">{t("browse_jobs", lang)}</h1>
            <p className="text-slate-600 text-sm">{items.length} jobs available</p>
          </div>
          {user?.role === "employer" && (
            <Button onClick={() => nav("/post-job")} className="bg-[#1B4332] hover:bg-[#143225]" data-testid="btn-post-job">
              + {t("post_job", lang)}
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="jobs-filter-category" className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_categories", lang)}</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{c.label[lang] || c.label.EN}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger data-testid="jobs-filter-district" className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">{t("all_districts", lang)}</SelectItem>
              {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(j => <JobCard key={j.job_id} job={j} onApply={onApply} />)}
        </div>
      </div>

      <AdBanner position="bottom" />

      <Dialog open={!!applying} onOpenChange={(v) => !v && setApplying(null)}>
        <DialogContent data-testid="apply-modal">
          <DialogHeader><DialogTitle className="heading">Apply for {applying?.title}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">{t("cover_note", lang)}</label>
            <Textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Tell the contractor about your experience..." data-testid="apply-cover-note" />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setApplying(null)}>{t("cancel", lang)}</Button>
              <Button onClick={submitApply} className="bg-[#1B4332] hover:bg-[#143225]" data-testid="apply-submit">
                {t("submit", lang)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <InterstitialAd open={interstitial} onClose={() => setInterstitial(false)} />
    </div>
  );
}
