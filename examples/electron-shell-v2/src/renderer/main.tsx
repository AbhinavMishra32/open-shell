import React from "react";
import { createRoot } from "react-dom/client";
import { OpalineThemeProvider, type OpalineTheme } from "@opaline/ui/v2";
import "./index.css";
import { App } from "./App";

const os =
  navigator.userAgent.includes("Windows") || navigator.platform.toLowerCase().startsWith("win")
    ? "win32"
    : navigator.userAgent.includes("Linux") || navigator.platform.toLowerCase().includes("linux")
      ? "linux"
      : "darwin";

document.documentElement.dataset.opalineWindowType = "electron";
document.documentElement.dataset.windowType = "electron";
document.documentElement.dataset.opalineOs = os;

const storedTheme = window.localStorage.getItem("opaline-theme");
const initialTheme: OpalineTheme =
  storedTheme === "light" || storedTheme === "dark" || storedTheme === "system" ? storedTheme : "system";
const initialResolvedTheme =
  initialTheme === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : initialTheme;

document.documentElement.classList.toggle("dark", initialResolvedTheme === "dark");
document.documentElement.dataset.opalineTheme = initialTheme;
document.documentElement.dataset.opalineResolvedTheme = initialResolvedTheme;

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OpalineThemeProvider>
      <App />
    </OpalineThemeProvider>
  </React.StrictMode>
);
