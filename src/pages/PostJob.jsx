import { useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import { CATEGORIES, DISTRICTS, t } from "../lib/i18n";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";
import api, { fmtDetail } from "../lib/api";
import { useNavigate, Navigate } from "react-router-dom";
import InterstitialAd from "../components/InterstitialAd";
import { payWithRazorpay } from "../lib/razorpay";
import { Zap, Rocket } from "lucide-react";

export default function PostJob() {
  const { user, lang, loading } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "", trade: "", category: "construction", daily_rate: 800,
    district: "Hyderabad", workers_needed: 1, start_date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [boost, setBoost] = useState("none");
  const [showInterstitial, setShowInterstitial] = useState(false);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "employer") return <Navigate to="/" />;

  const cat = CATEGORIES.find(c => c.key === form.category);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/jobs", { ...form, daily_rate: +form.daily_rate, workers_needed: +form.workers_needed });
      toast.success("Job posted!");
      if (boost !== "none") {
        payWithRazorpay({
          purpose: boost === "district" ? "boost_district" : "boost_statewide",
          reference_id: data.job_id, user,
          onSuccess: () => { toast.success("Boost activated!"); setShowInterstitial(true); },
        });
      } else {
        setShowInterstitial(true);
      }
    } catch (e) { toast.error(fmtDetail(e.response?.data?.detail)); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="heading text-2xl font-extrabold text-slate-900 mb-6">{t("post_job", lang)}</h1>
        <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 p-6 rz-card-shadow space-y-4">
          <Field label="Job Title">
            <Input required data-testid="job-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g., Experienced Mason needed for villa project" />
          </Field>
          <Field label="Category">
            <Select value={form.category} onValueChange={(v) => { set("category", v); set("trade", ""); }}>
              <SelectTrigger data-testid="job-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.key} value={c.key}>{c.label.EN}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Trade">
            <Select value={form.trade} onValueChange={(v) => set("trade", v)}>
              <SelectTrigger data-testid="job-trade"><SelectValue placeholder="Select trade" /></SelectTrigger>
              <SelectContent>
                {(cat?.trades || []).map(([tr, e]) => <SelectItem key={tr} value={tr}>{e} {tr}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Daily Rate (₹)">
              <Input type="number" required data-testid="job-rate" value={form.daily_rate} onChange={(e) => set("daily_rate", e.target.value)} />
            </Field>
            <Field label="Workers Needed">
              <Input type="number" required min="1" data-testid="job-count" value={form.workers_needed} onChange={(e) => set("workers_needed", e.target.value)} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="District">
              <Select value={form.district} onValueChange={(v) => set("district", v)}>
                <SelectTrigger data-testid="job-district"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Start Date">
              <Input type="date" required data-testid="job-date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea rows={4} data-testid="job-desc" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Boost Listing (optional)</Label>
            <RadioGroup value={boost} onValueChange={setBoost} className="grid gap-2">
              <label className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${boost === "none" ? "border-slate-400 bg-slate-50" : "border-slate-200"}`}>
                <RadioGroupItem value="none" data-testid="boost-none" />
                <div className="flex-1"><div className="font-semibold text-sm">Standard listing</div><div className="text-xs text-slate-500">No boost, appears by newest</div></div>
                <span className="text-sm font-bold text-slate-500">Free</span>
              </label>
              <label className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${boost === "district" ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>
                <RadioGroupItem value="district" data-testid="boost-district" />
                <Zap className="w-4 h-4 text-emerald-600" />
                <div className="flex-1"><div className="font-semibold text-sm">District Boost — 7 days</div><div className="text-xs text-slate-500">Pinned to top of your district feed</div></div>
                <span className="text-sm font-bold text-emerald-700">₹99</span>
              </label>
              <label className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer ${boost === "statewide" ? "border-amber-500 bg-amber-50" : "border-slate-200"}`}>
                <RadioGroupItem value="statewide" data-testid="boost-statewide" />
                <Rocket className="w-4 h-4 text-amber-600" />
                <div className="flex-1"><div className="font-semibold text-sm">Statewide Blast — 7 days</div><div className="text-xs text-slate-500">All 33 districts + URGENT badge</div></div>
                <span className="text-sm font-bold text-amber-700">₹299</span>
              </label>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full bg-[#1B4332] hover:bg-[#143225] text-white h-11" data-testid="job-submit">
            {boost === "none" ? t("post_job", lang) : `${t("post_job", lang)} & Pay Boost`}
          </Button>
        </form>
      </div>
      <InterstitialAd open={showInterstitial} onClose={() => { setShowInterstitial(false); nav("/dashboard"); }} />
    </div>
  );
}

function Field({ label, children }) {
  return (<div><Label className="text-sm font-semibold text-slate-700 mb-1.5 block">{label}</Label>{children}</div>);
}
