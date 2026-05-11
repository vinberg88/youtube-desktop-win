const { app, BrowserWindow, shell, ipcMain, Tray, Menu, session, Notification, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let tray;
let isAlwaysOnTop = false;
let focusMode = false;

const isWindowsStore = process.windowsStore || false;
const appDisplayName = "TubeDesk for Windows";
const iconPath = path.join(__dirname, "assets", "icon.ico");
const windowIcon = fs.existsSync(iconPath) ? iconPath : undefined;
const youtubePartition = "persist:youtube";

const allowedHosts = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "accounts.google.com",
  "accounts.youtube.com",
  "myaccount.google.com",
  "www.google.com",
  "policies.google.com",
  "support.google.com",
  "play.google.com"
]);

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) && allowedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 980,
    minHeight: 640,
    title: appDisplayName,
    backgroundColor: "#080808",
    autoHideMenuBar: true,
    icon: windowIcon,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isAllowedUrl(url)) {
      return { action: "allow" };
    }

    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      showNotification(`${appDisplayName} kör i system tray`, "Dubbelklicka på ikonen för att öppna igen.");
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createTray() {
  try {
    if (!windowIcon) return;
    tray = new Tray(windowIcon);
  } catch {
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Visa app",
      click: () => {
        if (mainWindow) mainWindow.show();
      }
    },
    {
      label: "Hem",
      click: () => sendToRenderer("app-command", "home")
    },
    {
      label: "Prenumerationer",
      click: () => sendToRenderer("app-command", "subscriptions")
    },
    {
      label: "YouTube Music",
      click: () => sendToRenderer("app-command", "music")
    },
    { type: "separator" },
    {
      label: "Always on top",
      type: "checkbox",
      click: (menuItem) => {
        isAlwaysOnTop = menuItem.checked;
        if (mainWindow) mainWindow.setAlwaysOnTop(isAlwaysOnTop);
        sendToRenderer("always-on-top-changed", isAlwaysOnTop);
      }
    },
    {
      label: "Fokusläge",
      type: "checkbox",
      click: (menuItem) => {
        focusMode = menuItem.checked;
        sendToRenderer("focus-mode-changed", focusMode);
      }
    },
    {
      label: "Rensa login/session",
      click: async () => {
        await clearYoutubeSession();
      }
    },
    { type: "separator" },
    {
      label: "Avsluta",
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip(appDisplayName);
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    if (mainWindow) mainWindow.show();
  });
}

function registerShortcuts() {
  if (isWindowsStore) return;
  try {
    globalShortcut.register("CommandOrControl+Shift+Y", () => {
      if (!mainWindow) return;
      if (mainWindow.isVisible()) mainWindow.hide();
      else mainWindow.show();
    });
  } catch {
    // Global shortcuts may fail in sandboxed Store environment
  }
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    new Notification({ title, body, icon: windowIcon }).show();
  }
}

async function clearYoutubeSession() {
  const youtubeSession = session.fromPartition(youtubePartition);
  await youtubeSession.clearStorageData();
  if (mainWindow) mainWindow.reload();
  showNotification("Session rensad", "YouTube/Google-login är borttaget från appen.");
  return true;
}

ipcMain.handle("toggle-always-on-top", () => {
  if (!mainWindow) return false;
  isAlwaysOnTop = !isAlwaysOnTop;
  mainWindow.setAlwaysOnTop(isAlwaysOnTop);
  return isAlwaysOnTop;
});

ipcMain.handle("set-focus-mode", (_event, enabled) => {
  focusMode = Boolean(enabled);
  return focusMode;
});

ipcMain.handle("open-mini-player", (_event, url) => {
  const safeUrl = isAllowedUrl(url) ? url : "https://www.youtube.com";

  const mini = new BrowserWindow({
    width: 480,
    height: 300,
    minWidth: 380,
    minHeight: 240,
    title: "TubeDesk Mini Player",
    backgroundColor: "#080808",
    alwaysOnTop: true,
    autoHideMenuBar: true,
    icon: windowIcon,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true
    }
  });

  mini.loadFile("mini.html", { query: { url: safeUrl } });
  return true;
});

ipcMain.handle("clear-youtube-session", clearYoutubeSession);

ipcMain.handle("open-external", (_event, url) => {
  if (isAllowedUrl(url)) {
    shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle("show-notification", (_event, title, body) => {
  showNotification(String(title || appDisplayName), String(body || ""));
  return true;
});

ipcMain.handle("get-app-info", () => ({
  name: appDisplayName,
  version: app.getVersion(),
  partition: youtubePartition,
  isWindowsStore
}));

app.whenReady().then(() => {
  if (!isWindowsStore) {
    app.setAppUserModelId("se.vinberg.tubedesk");
  }
  app.setName(appDisplayName);
  app.isQuitting = false;
  createWindow();
  createTray();
  registerShortcuts();
});

app.on("before-quit", () => {
  app.isQuitting = true;
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
