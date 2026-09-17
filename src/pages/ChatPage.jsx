import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { t } from "../lib/i18n";
import { Send, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const { userId } = useParams();
  const nav = useNavigate();
  const { user, lang } = useApp();
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    api.get("/chat/threads").then(({ data }) => setThreads(data));
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    api.get(`/chat/thread/${userId}`).then(({ data }) => setMessages(data));
    const iv = setInterval(() => {
      api.get(`/chat/thread/${userId}`).then(({ data }) => setMessages(data));
    }, 5000);
    return () => clearInterval(iv);
  }, [userId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!text.trim() || !userId) return;
    const { data } = await api.post("/chat/send", { to_user_id: userId, text });
    setMessages([...messages, data]);
    setText("");
  };

  if (!user) return <div className="min-h-screen bg-slate-50"><Navbar /><div className="p-20 text-center">Please login to chat.</div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <Navbar />
      <div className="max-w-6xl mx-auto px-2 sm:px-6 py-4 grid md:grid-cols-[280px_1fr] gap-4 h-[calc(100vh-6rem)]">
        <aside className="bg-white rounded-2xl border border-slate-200 overflow-hidden hidden md:flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h2 className="heading font-bold text-slate-900">{t("chat", lang)}</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.length === 0 && (
              <div className="p-6 text-center text-slate-400 text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" /> No chats yet
              </div>
            )}
            {threads.map(th => (
              <button key={th.thread_id} onClick={() => nav(`/chat/${th.other_user_id}`)}
                className={`w-full text-start px-4 py-3 border-b border-slate-100 hover:bg-slate-50 ${userId === th.other_user_id ? "bg-emerald-50" : ""}`}
                data-testid={`thread-${th.other_user_id}`}>
                <div className="font-semibold text-slate-900 text-sm">{th.other_name}</div>
                <div className="text-xs text-slate-500 truncate">{th.last_text}</div>
              </button>
            ))}
          </div>
        </aside>

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
          {userId ? (
            <>
              <div className="p-4 border-b border-slate-100">
                <div className="font-semibold text-slate-900">Conversation</div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/60">
                {messages.map(m => {
                  const mine = m.from_user_id === user.user_id;
                  return (
                    <div key={m.message_id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${mine
                        ? "bg-[#1B4332] text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"}`}>
                        {m.text}
                        <div className={`text-[9px] mt-1 ${mine ? "text-emerald-200" : "text-slate-400"}`}>
                          {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-slate-100 flex gap-2">
                <Input value={text} onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={t("type_message", lang)} data-testid="chat-input" />
                <Button onClick={send} className="bg-[#1B4332] hover:bg-[#143225]" data-testid="chat-send">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a conversation from the sidebar
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
