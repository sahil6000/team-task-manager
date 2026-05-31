import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

const THEMES = ["light", "dark", "eyesave"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("ttm_theme") || "light");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "eyesave");
    if (theme === "dark") html.classList.add("dark");
    if (theme === "eyesave") html.classList.add("eyesave");
    localStorage.setItem("ttm_theme", theme);
  }, [theme]);

  const cycle = () => {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(next);
  };

  return <ThemeCtx.Provider value={{ theme, setTheme, cycle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
