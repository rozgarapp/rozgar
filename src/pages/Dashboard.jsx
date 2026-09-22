import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MapPin, Users, Calendar, MessageSquare, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { payWithRazorpay } from "../lib/razorpay";

const STATUS_COLORS = {
  Applied: "bg-slate-100 text-slate-700",
  Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  Hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function Dashboard() {
  const { user, lang, loading } = useApp();
  const nav = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const refresh = () => {
    if (!user) return;
    if (user.role === "employer") api.get("/jobs/mine/list").then(({ data }) => setJobs(data));
    api.get("/applications/mine").then(({ data }) => setApps(data));
    if (user.role === "worker") api.get("/analytics/me").then(({data}) => setAnalytics(data)).catch(()=>{});
  };
  useEffect(refresh, [user]);

  // Real-time polling for status/application updates
  useEffect(() => {
    if (!user) return;
    const iv = setInterval(() => {
      if (selectedJob) return; // ATS view has its own refresh
      api.get("/applications/mine").then(({ data }) => setApps(data)).catch(() => {});
    }, 5000);
    return () => clearInterval(iv);
  }, [user, selectedJob]);

  useEffect(() => {
    if (selectedJob) api.get(`/applications/job/${selectedJob.job_id}`).then(({ data }) => setApps(data));
  }, [selectedJob]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" />;

  const updateStatus = async (app_id, status) => {
    try {
      await api.put(`/applications/${app_id}/status`, { status });
      toast.success(`Marked as ${status}`);
      setApps(apps.map(a => a.app_id === app_id ? { ...a, status } : a));
    } catch { toast.error("Failed to update"); }
  };

  const goPremium = () => {
    payWithRazorpay({
      purpose: "premium", reference_id: user.user_id, user,
      onSuccess: () => { toast.success("Premium activated for 30 days!"); refresh(); },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h1 className="heading text-2xl sm:text-3xl font-extrabold text-slate-900">{t("my_dashboard", lang)}</h1>
            <p className="text-slate-600 text-sm">Welcome, {user.name}</p>
          </div>
          {user.role === "employer" && (
            <Button onClick={() => nav("/post-job")} className="bg-[#1B4332] hover:bg-[#143225]" data-testid="dash-post-job">
              + {t("post_job", lang)}
            </Button>
          )}
        </div>

        {user.role === "worker" && (
          <div className="mb-6 grid sm:grid-cols-4 gap-3">
            <div className={`rounded-2xl p-5 ${analytics?.verified_pro ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" : "bg-white border border-slate-200"}`}>
              <div className="flex items-center gap-2 text-xs opacity-80"><ShieldCheck className="w-4 h-4" /> Status</div>
              <div className="mt-1 font-extrabold heading text-xl">
                {analytics?.verified_pro ? "Verified Pro ⭐" : "Free Plan"}
              </div>
              {!analytics?.verified_pro && (
                <Button size="sm" className="mt-2 bg-[#1B4332] hover:bg-[#143225] text-white w-full" onClick={goPremium} data-testid="btn-go-premium">
                  <Zap className="w-3 h-3 me-1" /> Upgrade ₹99/mo
                </Button>
              )}
              {analytics?.premium_expires_at && (
                <div className="text-[10px] mt-2 opacity-80">
                  Expires {new Date(analytics.premium_expires_at).toLocaleDateString()}
                </div>
              )}
            </div>
            <StatCard icon={TrendingUp} label="Profile Unlocks" value={analytics?.profile_unlocks ?? 0} />
            <StatCard icon={Users} label="Applications" value={analytics?.total_applications ?? 0} />
            <StatCard icon={ShieldCheck} label="Rank Boost" value={analytics?.verified_pro ? "Top 5%" : "Standard"} />
          </div>
        )}

        {user.role === "employer" ? (
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList data-testid="dash-tabs">
              <TabsTrigger value="jobs" data-testid="tab-jobs">{t("my_jobs", lang)} ({jobs.length})</TabsTrigger>
              <TabsTrigger value="ats" data-testid="tab-ats">ATS</TabsTrigger>
            </TabsList>
            <TabsContent value="jobs" className="mt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map(j => {
                  const boosted = j.boosted && (j.boost_expires_at || "") > new Date().toISOString();
                  return (
                  <div key={j.job_id} className={`bg-white rounded-2xl border rz-card-shadow p-5 ${boosted ? "border-amber-300" : "border-slate-200"}`} data-testid={`myjob-${j.job_id}`}>
                    {boosted && <span className="inline-block text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full mb-2">{j.boost_type === "statewide" ? "STATEWIDE" : "DISTRICT BOOST"}</span>}
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{j.emoji}</div>
                      <div className="flex-1"><h3 className="heading font-bold text-slate-900 text-sm line-clamp-1">{j.title}</h3><div className="text-xs text-slate-500">{j.trade}</div></div>
                      <div className="font-extrabold text-[#1B4332]">₹{j.daily_rate}</div>
                    </div>
                    <div className="mt-3 flex gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.district}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{j.workers_needed}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{j.start_date}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => setSelectedJob(j)} data-testid={`myjob-view-${j.job_id}`}>
                      View Applications
                    </Button>
                  </div>
                );})}
                {jobs.length === 0 && <div className="text-slate-500 col-span-full text-center py-10">No jobs posted yet.</div>}
              </div>
            </TabsContent>
            <TabsContent value="ats" className="mt-4">
              {selectedJob && (
                <div className="mb-4 bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center">
                  <div><span className="text-slate-500 text-sm">Filtering by job:</span> <span className="font-semibold">{selectedJob.title}</span></div>
                  <Button size="sm" variant="ghost" onClick={() => { setSelectedJob(null); refresh(); }}>Clear</Button>
                </div>
              )}
              <div className="grid md:grid-cols-4 gap-4">
                {["Applied", "Shortlisted", "Hired", "Rejected"].map(status => (
                  <div key={status} className="bg-white rounded-2xl border border-slate-200 p-3">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${STATUS_COLORS[status]}`}>{status}</div>
                    <div className="mt-3 space-y-2">
                      {apps.filter(a => a.status === status).map(a => (
                        <div key={a.app_id} className="border border-slate-200 rounded-xl p-3" data-testid={`app-${a.app_id}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-slate-900 truncate">{a.worker_name}</div>
                              <div className="text-xs text-slate-500 truncate">{a.worker_trade}</div>
                            </div>
                            <div className="text-lg">{a.job_emoji}</div>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{a.job_title}</div>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{a.cover_note}</p>
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2" onClick={() => nav(`/chat/${a.worker_user_id}`)}>
                              <MessageSquare className="w-3 h-3 me-1" />Chat
                            </Button>
                            <Select value={a.status} onValueChange={(v) => updateStatus(a.app_id, v)}>
                              <SelectTrigger className="h-7 text-[11px] w-24" data-testid={`status-select-${a.app_id}`}><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Shortlisted">Shortlist</SelectItem>
                                <SelectItem value="Hired">Hire</SelectItem>
                                <SelectItem value="Rejected">Reject</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            <h2 className="heading font-bold text-lg text-slate-900 mb-3">{t("my_applications", lang)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map(a => (
                <div key={a.app_id} className="bg-white rounded-2xl border border-slate-200 rz-card-shadow p-5" data-testid={`myapp-${a.app_id}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{a.job_emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{a.job_title}</div>
                      <div className="text-xs text-slate-500">{a.worker_trade}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3">{a.cover_note}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[a.status] || ""}`}>{a.status}</span>
                    <span className="text-[10px] text-slate-400">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {apps.length === 0 && <div className="text-slate-500 col-span-full text-center py-10">No applications yet.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: I, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-slate-500 text-xs"><I className="w-4 h-4" />{label}</div>
      <div className="mt-1 heading text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}
