"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = (localStorage.getItem("poket-theme") as "light" | "dark" | null) ?? null;
    // 시그니처는 다크. 명시적 선택만 라이트.
    const initial = stored ?? "dark";
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
      className="p-2 rounded-lg hover:bg-[var(--bg-mute)] transition-colors text-[var(--fg-muted)] hover:text-[var(--fg)]"
      aria-label={theme === "dark" ? "라이트 모드" : "다크 모드"}
    >
      {theme === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
    </button>
  );
}
