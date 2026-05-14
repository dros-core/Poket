"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("poket-theme") as "light" | "dark" | null) ?? null;
    const initial =
      stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("poket-theme", next);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-[var(--surface-muted)] transition"
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
