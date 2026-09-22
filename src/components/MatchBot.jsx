import { useEffect, useRef, useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";
import { t, DISTRICTS, CATEGORIES } from "../lib/i18n";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

const TRADES = CATEGORIES.flatMap(c => c.trades.map(([tr]) => tr));

function parseQuery(text) {
  const s = (text || "").toLowerCase();
  const trade = TRADES.find(tr => s.includes(tr.toLowerCase().split("/")[0].split(" ")[0]));
  const district = DISTRICTS.find(d => s.includes(d.toLowerCase()));
  const category = CATEGORIES.find(c => s.includes(c.key) || s.includes(c.label.EN.toLowerCase()))?.key;
  return { trade, district, category };
}

export default function MatchBot() {
  const { user, lang } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const name = user?.name?.split(" ")[0] || "there";
  const isWorker = user?.role === "worker";
  const greetKey = isWorker ? "ai_greet_worker" : "ai_greet_employer";

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: t(greetKey, lang).replace("{name}", name) }]);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const send = async () => {
    if (!text.trim()) return;
    const q = text.trim();
    setMessages(m => [...m, { from: "user", text: q }]);
    setText("");
    const parsed = parseQuery(q);
    const params = {};
    if (parsed.trade) params.trade = parsed.trade;
    if (parsed.district) params.district = parsed.district;
    if (parsed.category) params.category = parsed.category;
    try {
      if (isWorker) {
        const { data } = await api.get("/jobs", { params });
        if (data.length === 0) {
          setMessages(m => [...m, { from: "bot", text: t("ai_no_match", lang) }]);
        } else {
          setMessages(m => [...m, { from: "bot", text: t("ai_found_jobs", lang).replace("{n}", data.length), results: data.slice(0, 4), type: "job" }]);
        }
      } else {
        const { data } = await api.get("/workers", { params });
        if (data.length === 0) {
          setMessages(m => [...m, { from: "bot", text: t("ai_no_match", lang) }]);
        } else {
          setMessages(m => [...m, { from: "bot", text: t("ai_found_workers", lang).replace("{n}", data.length), results: data.slice(0, 4), type: "worker" }]);
        }
      }
    } catch {
      setMessages(m => [...m, { from: "bot", text: "Search failed. Please retry." }]);
    }
  };

  return (
    <>
      {!open && (
        <button data-testid="match-fab" onClick={() => setOpen(true)}
          className="fixed bottom-24 md:bottom-20 start-4 z-40 w-14 h-14 rounded-full bg-[#1B4332] text-white shadow-2xl flex items-center justify-center hover:bg-[#143225] hover:scale-105 transition-all"
          aria-label="AI Job Matcher">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -end-1 text-[10px] font-bold bg-amber-400 text-black rounded-full px-1.5 py-0.5">AI</span>
        </button>
      )}
      {open && (
        <div data-testid="match-modal"
          className="fixed inset-x-0 bottom-0 md:bottom-6 md:start-6 md:end-auto z-50 mx-auto md:mx-0 max-w-md md:w-96 rounded-t-2xl md:rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "min(600px, 85vh)" }}>
          <div className="bg-[#1B4332] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><Bot className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="heading font-bold">{t("ai_match", lang)}</div>
              <div className="text-[11px] text-emerald-200">Instant matches from live data</div>
            </div>
            <button onClick={() => setOpen(false)} data-testid="match-close" className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${m.from === "user" ? "bg-[#1B4332] text-white rounded-tr-none" : "bg-white border border-slate-200 rounded-tl-none"}`}>
                  <div>{m.text}</div>
                  {m.results && (
                    <div className="mt-2 space-y-1.5">
                      {m.results.map(r => (
                        <button key={r.worker_id || r.job_id} data-testid={`match-result-${r.worker_id || r.job_id}`}
                          onClick={() => nav(m.type === "worker" ? `/workers/${r.worker_id}` : `/jobs`)}
                          className="w-full text-start bg-white border border-slate-200 hover:border-[#1B4332] rounded-lg p-2 flex items-center gap-2 text-slate-800">
                          <span className="text-lg">{r.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate">{m.type === "worker" ? `${r.trade} · ${r.name}` : r.title}</div>
                            <div className="text-[10px] text-slate-500">{r.district} · ₹{r.daily_rate}/day</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 border-t border-slate-100 flex gap-2">
            <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={isWorker ? "e.g. electrical jobs in Hyderabad" : "e.g. plumber in Mahbubnagar"} data-testid="match-input" />
            <Button onClick={send} className="bg-[#1B4332] hover:bg-[#143225] min-h-[44px]" data-testid="match-send">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
