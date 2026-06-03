const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("codexSameUi", {
  windowType: "electron",
  source: "reconstructed-component-library"
});
