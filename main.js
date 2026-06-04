const { app, BrowserWindow, shell, ipcMain, Tray, Menu, session, Notification, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let tray;
let isAlwaysOnTop = false;
let focusMode = false;

const isWindowsStore = process.windowsStore || false;
const appDisplayName = "TubeDesk";
const iconPath = path.join(__dirname, "assets", "icon.ico");
const windowIcon = fs.existsSync(iconPath) ? iconPath : undefined;
const appPartition = "persist:tubedesk";

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol);
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
      showNotification(`${appDisplayName} is running in the system tray`, "Double-click the icon to reopen the workspace.");
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
      label: "Show TubeDesk",
      click: () => {
        if (mainWindow) mainWindow.show();
      }
    },
    {
      label: "Show start workspace",
      click: () => sendToRenderer("app-command", "start")
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
      label: "Focus mode",
      type: "checkbox",
      click: (menuItem) => {
        focusMode = menuItem.checked;
        sendToRenderer("focus-mode-changed", focusMode);
      }
    },
    {
      label: "Clear local workspace session",
      click: async () => {
        await clearWorkspaceSession();
      }
    },
    { type: "separator" },
    {
      label: "Quit",
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
    // Global shortcuts may fail in sandboxed Store environments.
  }
}

function showNotification(title, body) {
  if (Notification.isSupported()) {
    new Notification({ title, body, icon: windowIcon }).show();
  }
}

async function clearWorkspaceSession() {
  const workspaceSession = session.fromPartition(appPartition);
  await workspaceSession.clearStorageData();
  if (mainWindow) mainWindow.reload();
  showNotification("Local session cleared", "TubeDesk local workspace browsing data has been removed from this device.");
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
  const safeUrl = isAllowedUrl(url) ? url : "about:blank";

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

ipcMain.handle("clear-workspace-session", clearWorkspaceSession);

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
  partition: appPartition,
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
