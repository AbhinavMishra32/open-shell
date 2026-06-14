import * as React from "react";

export type OpalineTheme = "system" | "light" | "dark";
export type OpalineResolvedTheme = Exclude<OpalineTheme, "system">;

export type OpalineThemeState = {
  theme: OpalineTheme;
  resolvedTheme: OpalineResolvedTheme;
  setTheme: (theme: OpalineTheme) => void;
};

export type OpalineThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: OpalineTheme;
  storageKey?: string;
};

const OpalineThemeContext = React.createContext<OpalineThemeState | null>(null);

export function OpalineThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "opaline-theme",
}: OpalineThemeProviderProps) {
  const [theme, setTheme] = React.useState<OpalineTheme>(() => readStoredTheme(storageKey) ?? defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<OpalineResolvedTheme>(() => getSystemTheme());
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");
    updateSystemTheme();
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.dataset.opalineTheme = theme;
    root.dataset.opalineResolvedTheme = resolvedTheme;
    window.localStorage.setItem(storageKey, theme);
  }, [resolvedTheme, storageKey, theme]);

  const value = React.useMemo(
    () => ({ resolvedTheme, setTheme, theme }),
    [resolvedTheme, theme],
  );

  return <OpalineThemeContext.Provider value={value}>{children}</OpalineThemeContext.Provider>;
}

export function useOpalineTheme() {
  const context = React.useContext(OpalineThemeContext);
  if (context == null) {
    throw new Error("useOpalineTheme must be used inside OpalineThemeProvider.");
  }
  return context;
}

function readStoredTheme(storageKey: string): OpalineTheme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(storageKey);
  return storedTheme === "system" || storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
}

function getSystemTheme(): OpalineResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
