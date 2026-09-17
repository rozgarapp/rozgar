import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { RTL_LANGS } from "../lib/i18n";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null = unauthenticated, object = user
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem("rz_lang") || "EN");

  useEffect(() => {
    localStorage.setItem("rz_lang", lang);
    const rtl = RTL_LANGS.includes(lang);
    document.body.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = lang.toLowerCase();
  }, [lang]);

  const checkAuth = useCallback(async () => {
    // Skip if returning from OAuth callback
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.token) localStorage.setItem("rz_token", data.token);
    setUser(data);
    // refresh full user
    try { const me = await api.get("/auth/me"); setUser(me.data); } catch {}
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) localStorage.setItem("rz_token", data.token);
    setUser(data);
    return data;
  };

  const googleSession = async (session_id, role = "employer") => {
    const { data } = await api.post("/auth/google/session", { session_id, role });
    if (data.token) localStorage.setItem("rz_token", data.token);
    setUser(data);
    return data;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem("rz_token");
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, loading, lang, setLang, login, register, logout, googleSession, checkAuth }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
