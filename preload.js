const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("tubeDesk", {
  toggleAlwaysOnTop: () => ipcRenderer.invoke("toggle-always-on-top"),
  setFocusMode: (enabled) => ipcRenderer.invoke("set-focus-mode", enabled),
  openMiniPlayer: (url) => ipcRenderer.invoke("open-mini-player", url),
  clearSession: () => ipcRenderer.invoke("clear-workspace-session"),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  notify: (title, body) => ipcRenderer.invoke("show-notification", title, body),
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),
  onCommand: (callback) => ipcRenderer.on("app-command", (_event, command) => callback(command)),
  onAlwaysOnTopChanged: (callback) => ipcRenderer.on("always-on-top-changed", (_event, enabled) => callback(enabled)),
  onFocusModeChanged: (callback) => ipcRenderer.on("focus-mode-changed", (_event, enabled) => callback(enabled))
});
