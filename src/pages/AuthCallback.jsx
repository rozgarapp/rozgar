import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const { googleSession } = useApp();
  const nav = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const session_id = params.get("session_id");
    if (!session_id) { nav("/login"); return; }

    const role = localStorage.getItem("rz_role") || "employer";
    localStorage.removeItem("rz_role");

    googleSession(session_id, role)
      .then(() => {
        window.history.replaceState({}, "", "/dashboard");
        nav("/dashboard", { replace: true });
      })
      .catch(() => nav("/login"));
  }, [googleSession, nav]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B4332] mx-auto mb-3" />
        <div className="text-slate-600">Signing you in…</div>
      </div>
    </div>
  );
}
