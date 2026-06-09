import React from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
