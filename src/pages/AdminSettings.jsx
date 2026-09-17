import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Navigate } from "react-router-dom";
import api from "../lib/api";
import { toast } from "sonner";
import { Settings, ShieldCheck, LifeBuoy, Shield, Download, Layers } from "lucide-react";
import { CATEGORIES, DISTRICTS, CATEGORY_MAP } from "../lib/i18n";

const ADMIN_EMAIL = "mdstabrez1@gmail.com";
const CATEGORY_LABEL = { bug: "🐞 Bug", payment: "💳 Payment", complaint: "⚠️ Complaint", other: "❓ Other" };
const STATUS_STYLE = {
  open: "bg-amber-100 text-amber-800 border-amber-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export default function AdminSettings() {
  const { user, loading } = useApp();
  const [form, setForm] = useState({
    admob_app_id: "", banner_ad_unit_id: "", interstitial_ad_unit_id: "",
    rewarded_ad_unit_id: "", ad_test_mode: true, razorpay_key_id: "", razorpay_key_secret: "",
    exotel_api_key: "", exotel_sid: "", twilio_sid: "", twilio_auth_token: "",
    proxy_call_categories: [],
  });
  const [tickets, setTickets] = useState([]);
  const [tFilter, setTFilter] = useState("all");
  const [logs, setLogs] = useState([]);
  const [lDistrict, setLDistrict] = useState("all");
  const [lFrom, setLFrom] = useState("");
  const [lTo, setLTo] = useState("");
  const [catStats, setCatStats] = useState([]);

  useEffect(() => { api.get("/settings").then(({data}) => setForm(f => ({...f, ...data}))); }, []);
  useEffect(() => { api.get("/categories/stats").then(({data}) => setCatStats(data)).catch(() => {}); }, []);
  useEffect(() => {
    const q = tFilter !== "all" ? { params: { status: tFilter } } : {};
    api.get("/support/tickets", q).then(({data}) => setTickets(data)).catch(() => {});
  }, [tFilter]);
  useEffect(() => {
    const params = {};
    if (lDistrict !== "all") params.district = lDistrict;
    if (lFrom) params.date_from = lFrom;
    if (lTo) params.date_to = lTo;
    api.get("/privacy-logs", { params }).then(({data}) => setLogs(data)).catch(() => {});
  }, [lDistrict, lFrom, lTo]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if ((user.email || "").toLowerCase() !== ADMIN_EMAIL) return <Navigate to="/" />;

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const toggleCat = (k) => set("proxy_call_categories",
    (form.proxy_call_categories || []).includes(k)
      ? form.proxy_call_categories.filter(c => c !== k)
      : [...(form.proxy_call_categories || []), k]);

  const save = async () => {
    try { await api.put("/settings", form); toast.success("Settings saved"); }
    catch { toast.error("Failed to save"); }
  };

  const updateStatus = async (ticket_id, status) => {
    try { await api.put(`/support/tickets/${ticket_id}`, { status });
      setTickets(tickets.map(t => t.ticket_id === ticket_id ? { ...t, status } : t));
      toast.success(`Marked ${status}`);
    } catch { toast.error("Failed to update"); }
  };

  const exportCsv = () => {
    const rows = [
      ["log_id","employer_name","worker_name","worker_district","worker_category","proxy_call_status","proxy_number","timestamp"],
      ...logs.map(l => [l.log_id, l.employer_name, l.worker_name, l.worker_district,
        l.worker_category, l.proxy_call_status, l.proxy_number || "", l.timestamp]),
    ];
    const csv = rows.map(r => r.map(v => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `privacy_logs_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#1B4332] text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="heading text-2xl font-extrabold text-slate-900">Admin Panel</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {ADMIN_EMAIL}</p>
          </div>
        </div>

        <Tabs defaultValue="settings">
          <TabsList data-testid="admin-tabs">
            <TabsTrigger value="settings" data-testid="admin-tab-settings">Settings</TabsTrigger>
            <TabsTrigger value="tickets" data-testid="admin-tab-tickets">
              <LifeBuoy className="w-4 h-4 me-1" /> Tickets ({tickets.filter(t => t.status !== "resolved").length})
            </TabsTrigger>
            <TabsTrigger value="privacy" data-testid="admin-tab-privacy">
              <Shield className="w-4 h-4 me-1" /> Privacy Logs
            </TabsTrigger>
            <TabsTrigger value="categories" data-testid="admin-tab-categories">
              <Layers className="w-4 h-4 me-1" /> Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-4">
            <div className="bg-white rounded-2xl border border-slate-200 rz-card-shadow p-6 space-y-6">
              <section>
                <h2 className="heading font-bold text-slate-900 mb-3">Google AdMob</h2>
                <div className="space-y-3">
                  {["admob_app_id","banner_ad_unit_id","interstitial_ad_unit_id","rewarded_ad_unit_id"].map((k, i) => (
                    <div key={k}>
                      <Label className="text-sm">{["AdMob App ID","Banner","Interstitial","Rewarded"][i]}</Label>
                      <Input value={form[k]} onChange={e => set(k, e.target.value)}
                        data-testid={`admin-${k.replace(/_/g,"-")}`} className="font-mono text-xs" />
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div><div className="font-semibold text-sm">Ad Test Mode</div>
                      <div className="text-xs text-slate-500">Toggle between test placements and live IDs</div></div>
                    <Switch checked={form.ad_test_mode} onCheckedChange={(v) => set("ad_test_mode", v)} data-testid="admin-test-mode" />
                  </div>
                </div>
              </section>

              <section className="border-t border-slate-100 pt-6">
                <h2 className="heading font-bold text-slate-900 mb-3">Razorpay</h2>
                <div className="space-y-3">
                  <div><Label className="text-sm">Razorpay Key ID</Label>
                    <Input value={form.razorpay_key_id} onChange={e => set("razorpay_key_id", e.target.value)} data-testid="admin-rzp-key" className="font-mono text-xs" /></div>
                  <div><Label className="text-sm">Razorpay Key Secret</Label>
                    <Input type="password" value={form.razorpay_key_secret || ""} onChange={e => set("razorpay_key_secret", e.target.value)} data-testid="admin-rzp-secret" placeholder="Leave blank to keep unchanged" className="font-mono text-xs" /></div>
                </div>
              </section>

              <section className="border-t border-slate-100 pt-6">
                <h2 className="heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1B4332]" /> Proxy Calling — Exotel / Twilio
                </h2>
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label className="text-sm">Exotel API Key</Label>
                      <Input value={form.exotel_api_key} onChange={e => set("exotel_api_key", e.target.value)} data-testid="admin-exotel-key" className="font-mono text-xs" /></div>
                    <div><Label className="text-sm">Exotel SID</Label>
                      <Input value={form.exotel_sid} onChange={e => set("exotel_sid", e.target.value)} data-testid="admin-exotel-sid" className="font-mono text-xs" /></div>
                    <div><Label className="text-sm">Twilio Account SID</Label>
                      <Input value={form.twilio_sid} onChange={e => set("twilio_sid", e.target.value)} data-testid="admin-twilio-sid" className="font-mono text-xs" /></div>
                    <div><Label className="text-sm">Twilio Auth Token</Label>
                      <Input type="password" value={form.twilio_auth_token} onChange={e => set("twilio_auth_token", e.target.value)} data-testid="admin-twilio-token" className="font-mono text-xs" /></div>
                  </div>

                  <div>
                    <Label className="text-sm mb-2 block">Enable proxy calling for categories</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(c => (
                        <label key={c.key} className={`flex items-center gap-2 border rounded-lg p-2 cursor-pointer ${
                          (form.proxy_call_categories || []).includes(c.key) ? "border-[#1B4332] bg-emerald-50" : "border-slate-200"
                        }`}>
                          <Switch checked={(form.proxy_call_categories || []).includes(c.key)}
                            onCheckedChange={() => toggleCat(c.key)} data-testid={`proxy-cat-${c.key}`} />
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                          <span className="text-sm">{c.label.EN}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <Button onClick={save} className="w-full bg-[#1B4332] hover:bg-[#143225] h-11" data-testid="admin-save">Save Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="mt-4">
            <div className="bg-white rounded-2xl border border-slate-200 rz-card-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading font-bold text-slate-900">Support Tickets</h2>
                <Select value={tFilter} onValueChange={setTFilter}>
                  <SelectTrigger className="w-40" data-testid="tickets-filter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In-Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                {tickets.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">No tickets to show.</div>}
                {tickets.map(tk => (
                  <div key={tk.ticket_id} className="border border-slate-200 rounded-xl p-4" data-testid={`ticket-${tk.ticket_id}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full border font-bold ${STATUS_STYLE[tk.status]}`}>{tk.status}</span>
                          <span className="text-slate-500">{CATEGORY_LABEL[tk.issue_category]}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{tk.language}</span>
                        </div>
                        <div className="mt-2 font-semibold text-slate-900 text-sm">{tk.user_name} <span className="text-slate-500 font-normal">· {tk.user_email}</span></div>
                        <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{tk.message}</p>
                        {tk.audio_data_url && (
                          <audio controls src={tk.audio_data_url} className="mt-2 w-full max-w-sm" data-testid={`ticket-audio-${tk.ticket_id}`} />
                        )}
                        <div className="text-[10px] text-slate-400 mt-2">{new Date(tk.created_at).toLocaleString()}</div>
                      </div>
                      <Select value={tk.status} onValueChange={(v) => updateStatus(tk.ticket_id, v)}>
                        <SelectTrigger className="w-36" data-testid={`ticket-status-${tk.ticket_id}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In-Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-4">
            <div className="bg-white rounded-2xl border border-slate-200 rz-card-shadow p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="heading font-bold text-slate-900">Contact Privacy Logs ({logs.length})</h2>
                <Button size="sm" variant="outline" onClick={exportCsv} data-testid="export-csv">
                  <Download className="w-4 h-4 me-1" /> Export CSV
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-2 mb-3">
                <Select value={lDistrict} onValueChange={setLDistrict}>
                  <SelectTrigger data-testid="logs-district"><SelectValue placeholder="All districts" /></SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="all">All districts</SelectItem>
                    {DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={lFrom} onChange={e => setLFrom(e.target.value)} data-testid="logs-from" />
                <Input type="date" value={lTo} onChange={e => setLTo(e.target.value)} data-testid="logs-to" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-start text-xs text-slate-500 border-b border-slate-200">
                      <th className="py-2 px-2 text-start">Time</th>
                      <th className="py-2 px-2 text-start">Employer</th>
                      <th className="py-2 px-2 text-start">Worker</th>
                      <th className="py-2 px-2 text-start">District</th>
                      <th className="py-2 px-2 text-start">Status</th>
                      <th className="py-2 px-2 text-start">Proxy #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l.log_id} className="border-b border-slate-100" data-testid={`log-${l.log_id}`}>
                        <td className="py-2 px-2 text-xs text-slate-500">{new Date(l.timestamp).toLocaleString()}</td>
                        <td className="py-2 px-2">{l.employer_name}</td>
                        <td className="py-2 px-2">{l.worker_name}</td>
                        <td className="py-2 px-2 text-slate-600">{l.worker_district}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            l.proxy_call_status === "connected" ? "bg-emerald-100 text-emerald-800"
                            : l.proxy_call_status === "failed" ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"}`}>{l.proxy_call_status}</span>
                        </td>
                        <td className="py-2 px-2 font-mono text-xs">{l.proxy_number || "—"}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr><td colSpan={6} className="py-6 text-center text-slate-400">No calls logged yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <div className="bg-white rounded-2xl border border-slate-200 rz-card-shadow p-6">
              <h2 className="heading font-bold text-slate-900 mb-4">Category Management ({catStats.length})</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catStats.map(c => {
                  const meta = CATEGORY_MAP[c.category];
                  return (
                    <div key={c.category} className="border rounded-xl p-4"
                         style={{ backgroundColor: meta?.bg, borderColor: meta?.border }}
                         data-testid={`catstat-${c.category}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-slate-900">{meta?.label?.EN || c.category}</div>
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: meta?.color }} />
                      </div>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <div><b>{c.worker_count}</b> workers</div>
                        <div><b>{c.trade_count}</b> trades</div>
                      </div>
                      <details className="mt-2">
                        <summary className="text-[11px] text-slate-500 cursor-pointer">Show trades</summary>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {c.trades.slice(0, 30).map(tr => (
                            <span key={tr} className="text-[10px] bg-white/70 border border-white rounded-full px-2 py-0.5">{tr}</span>
                          ))}
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-4">Trades are seeded from the code manifest. Add/remove requires backend deploy.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}