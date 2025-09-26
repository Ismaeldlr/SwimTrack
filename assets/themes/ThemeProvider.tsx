import React, { createContext, useContext, useMemo, useState } from "react";
import { getTheme } from "../../assets/themes";

type Scheme = "light" | "dark";
type Ctx = {
  scheme: Scheme;
  theme: ReturnType<typeof getTheme>;
  toggleTheme: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<Scheme>("light"); // default

  const value = useMemo<Ctx>(
    () => ({
      scheme,
      theme: getTheme(scheme),
      toggleTheme: () => setScheme((s) => (s === "light" ? "dark" : "light")),
    }),
    [scheme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
