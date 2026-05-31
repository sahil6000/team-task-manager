import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ttm_user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ttm_token");
    if (!token) { setLoading(false); return; }
    api.get("/api/auth/me")
      .then((r) => { setUser(r.data.user); localStorage.setItem("ttm_user", JSON.stringify(r.data.user)); })
      .catch(() => { localStorage.removeItem("ttm_token"); localStorage.removeItem("ttm_user"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("ttm_token", data.token);
    localStorage.setItem("ttm_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const signup = async (name, email, password, role = "MEMBER") => {
    const { data } = await api.post("/api/auth/signup", { name, email, password, role });
    localStorage.setItem("ttm_token", data.token);
    localStorage.setItem("ttm_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const logout = () => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setUser(null);
  };
  const refresh = async () => {
    const { data } = await api.get("/api/auth/me");
    setUser(data.user);
    localStorage.setItem("ttm_user", JSON.stringify(data.user));
  };

  return <AuthCtx.Provider value={{ user, loading, login, signup, logout, refresh }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
