import { useEffect, useRef, useState } from "react";
import { Headphones, X, Send, Bot, Bug, IndianRupee, User, HelpCircle, Mic, Square, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";
import { t } from "../lib/i18n";
import api from "../lib/api";
import { toast } from "sonner";

const CATEGORIES = [
  { key: "bug", labelKey: "cat_bug", icon: Bug },
  { key: "payment", labelKey: "cat_payment", icon: IndianRupee },
  { key: "complaint", labelKey: "cat_complaint", icon: User },
  { key: "other", labelKey: "cat_other", icon: HelpCircle },
];

// simple FAQ matcher on the message text
function matchFaq(text, lang) {
  const s = (text || "").toLowerCase();
  if (/(unlock|contact|phone|number|अनलॉक|رابطہ|సంప్రదింపు|संपर्क)/.test(s))
    return t("faq_unlock", lang);
  if (/(payment|paid|refund|razorpay|upi|charge|भुगतान|ادائیگی|చెల్లింపు|पैसे|paisa)/.test(s))
    return t("faq_payment", lang);
  if (/(no show|didn.?t show|absent|no-show|not come|नहीं आया|غیر حاضر|రాలేదు)/.test(s))
    return t("faq_noshow", lang);
  return null;
}

export default function SupportWidget() {
  const { user, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState(null);
  const [typing, setTyping] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const recRef = useRef({ mediaRecorder: null, chunks: [], stream: null, timer: null });
  const bottomRef = useRef(null);

  const displayName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { from: "bot", text: t("support_greet", lang).replace("{name}", displayName) },
        { from: "bot", text: t("support_ask_lang", lang) },
        { from: "bot", text: t("support_pick", lang), showChips: true },
      ]);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const raiseTicket = async (issue_category, message) => {
    if (!user) return null;
    try {
      const { data } = await api.post("/support/tickets", { issue_category, message, language: lang });
      return data;
    } catch { return null; }
  };

  const respond = async (userText, cat) => {
    setTyping(true);
    await new Promise(r => setTimeout(r, 700));
    const faq = matchFaq(userText, lang);
    const useCat = cat || category || "other";
    let botReply;
    if (faq) botReply = faq;
    else {
      botReply = t("ticket_raised", lang);
      if (user) await raiseTicket(useCat, userText);
      else botReply = "Please login first so we can track your ticket. " + botReply;
    }
    setTyping(false);
    setMessages(m => [...m, { from: "bot", text: botReply }]);
  };

  const send = async () => {
    if (!text.trim()) return;
    const userText = text.trim();
    setMessages(m => [...m, { from: "user", text: userText }]);
    setText("");
    await respond(userText, category);
  };

  const pickCategory = async (cat) => {
    setCategory(cat.key);
    const label = t(cat.labelKey, lang);
    setMessages(m => [...m, { from: "user", text: label },
      { from: "bot", text: t("support_ask_lang", lang) }]);
    if (cat.key === "complaint") {
      setTyping(true);
      await new Promise(r => setTimeout(r, 500));
      setTyping(false);
      setMessages(m => [...m, { from: "bot", text: t("faq_noshow", lang) }]);
      if (user) await raiseTicket("complaint", `Selected category: ${label}`);
    }
  };

  const startRecording = async () => {
    if (!user) { toast.error("Please login first"); return; }
    if (!navigator.mediaDevices?.getUserMedia) { toast.error("Microphone not supported"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recRef.current.chunks = [];
      recRef.current.stream = stream;
      recRef.current.mediaRecorder = mr;
      mr.ondataavailable = (e) => e.data.size > 0 && recRef.current.chunks.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(recRef.current.chunks, { type: "audio/webm" });
        stream.getTracks().forEach(t => t.stop());
        clearInterval(recRef.current.timer);
        const dur = recSecs;
        setRecSecs(0);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataUrl = reader.result;
          setMessages(m => [...m, { from: "user", text: `🎤 Voice note (${dur}s)`, audio: dataUrl }]);
          try {
            await api.post("/support/tickets/voice", {
              issue_category: category || "other",
              audio_data_url: dataUrl, language: lang, duration_secs: dur,
            });
            setMessages(m => [...m, { from: "bot", text: t("ticket_raised", lang) }]);
          } catch { toast.error("Could not save voice note"); }
        };
        reader.readAsDataURL(blob);
      };
      mr.start();
      setRecording(true); setRecSecs(0);
      recRef.current.timer = setInterval(() => setRecSecs(s => s + 1), 1000);
    } catch { toast.error("Microphone permission denied"); }
  };

  const stopRecording = () => {
    if (!recording) return;
    recRef.current.mediaRecorder?.stop();
    setRecording(false);
  };

  return (
    <>
      {!open && (
        <button data-testid="support-fab" onClick={() => setOpen(true)}
          className="fixed bottom-24 md:bottom-20 end-4 z-40 w-14 h-14 rounded-full bg-[#1B4332] text-white shadow-2xl flex items-center justify-center hover:bg-[#143225] hover:scale-105 transition-all group min-h-[44px] min-w-[44px]">
          <Headphones className="w-6 h-6" />
          <span className="absolute -top-1 -end-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -end-1 w-3 h-3 bg-amber-400 rounded-full" />
        </button>
      )}

      {open && (
        <div data-testid="support-modal"
          className="fixed inset-x-0 bottom-0 md:bottom-6 md:end-6 md:start-auto z-50 mx-auto md:mx-0 max-w-md md:w-96 rounded-t-2xl md:rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "min(600px, 85vh)" }}>
          <div className="bg-[#1B4332] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="heading font-bold">Rozgar {t("support", lang)}</div>
              <div className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
              </div>
            </div>
            <button onClick={() => setOpen(false)} data-testid="support-close"
              className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${
                  m.from === "user"
                    ? "bg-[#1B4332] text-white rounded-tr-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"}`}>
                  {m.text}
                  {m.audio && <audio controls src={m.audio} className="mt-2 w-full" />}
                  {m.showChips && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {CATEGORIES.map(c => (
                        <button key={c.key} onClick={() => pickCategory(c)} data-testid={`support-cat-${c.key}`}
                          className="border border-slate-200 hover:border-[#1B4332] rounded-lg p-2 text-start flex items-center gap-2 text-xs text-slate-700 bg-white hover:bg-emerald-50">
                          <c.icon className="w-3.5 h-3.5 text-[#1B4332]" />
                          {t(c.labelKey, lang)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-500">
                  {t("bot_typing", lang)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-2 border-t border-slate-100 flex gap-2 items-center">
            {recording ? (
              <div className="flex-1 flex items-center gap-2 px-3 h-10 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Recording… {recSecs}s
              </div>
            ) : (
              <Input value={text} onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={t("type_message", lang)} data-testid="support-input" />
            )}
            {recording ? (
              <Button onClick={stopRecording} className="bg-rose-600 hover:bg-rose-700" data-testid="support-stop-rec">
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <>
                <Button onClick={startRecording} variant="outline" data-testid="support-start-rec" title="Voice complaint">
                  <Mic className="w-4 h-4" />
                </Button>
                <Button onClick={send} className="bg-[#1B4332] hover:bg-[#143225]" data-testid="support-send">
                  <Send className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
