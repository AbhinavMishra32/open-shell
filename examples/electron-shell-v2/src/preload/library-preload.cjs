const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("opalineSameUi", {
  windowType: "electron",
  source: "reconstructed-component-library"
});
