let webview = document.getElementById("browser");
const urlInput = document.getElementById("url");
const start = document.getElementById("start");
const progress = document.getElementById("progress");
const statusEl = document.getElementById("status");
const toastEl = document.getElementById("toast");
const shortcutsEl = document.getElementById("shortcuts");

const shortcutStorageKey = "tubedesk.shortcuts";
const defaultSearchUrl = "https://www.bing.com/search?q=";

let zoom = 1;
let muted = false;
let focusMode = false;

function toast(message) {
  toastEl.textContent = message;
  toastEl.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => (toastEl.style.display = "none"), 2200);
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return ["https:", "http:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function normalizeUrl(value) {
  const input = value.trim();
  if (!input) return "about:blank";
  if (isHttpUrl(input)) return input;
  if (input.includes(".") && !input.includes(" ")) return `https://${input}`;
  return `${defaultSearchUrl}${encodeURIComponent(input)}`;
}

function getHost(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

function getCurrentUrl() {
  try {
    return webview.getURL ? webview.getURL() : webview.src;
  } catch {
    return webview.src || "about:blank";
  }
}

function attachWebviewEvents() {
  webview.addEventListener("did-start-loading", () => {
    progress.style.width = "45%";
    statusEl.textContent = "Loading...";
  });

  webview.addEventListener("did-stop-loading", () => {
    progress.style.width = "100%";
    setTimeout(() => (progress.style.width = "0"), 250);
    const title = webview.getTitle && webview.getTitle();
    statusEl.textContent = title || "Ready";
    webview.setZoomFactor(zoom);
    webview.setAudioMuted(muted);
  });

  webview.addEventListener("did-navigate", (e) => {
    if (e.url && e.url !== "about:blank") urlInput.value = e.url;
  });

  webview.addEventListener("did-navigate-in-page", (e) => {
    if (e.url && e.url !== "about:blank") urlInput.value = e.url;
  });
}

function showStart() {
  start.classList.remove("hidden");
  statusEl.textContent = "TubeDesk Start";
}

function go(url) {
  const nextUrl = normalizeUrl(url);
  if (nextUrl === "about:blank") {
    showStart();
    return;
  }

  start.classList.add("hidden");
  webview.src = nextUrl;
  urlInput.value = nextUrl;
  toast(`Opening ${getHost(nextUrl) || "workspace"}`);
}

function command(cmd) {
  if (cmd === "start") {
    showStart();
  }
}

function setFocusMode(enabled) {
  focusMode = Boolean(enabled);
  document.body.classList.toggle("focus", focusMode);
  document.getElementById("focus").classList.toggle("active", focusMode);
  window.tubeDesk.setFocusMode(focusMode);
}

function setMute(enabled) {
  muted = Boolean(enabled);
  webview.setAudioMuted(muted);
  document.getElementById("mute").textContent = muted ? "Muted" : "Mute";
  document.getElementById("mute").classList.toggle("active", muted);
}

function setZoom(next) {
  zoom = Math.min(2, Math.max(0.5, next));
  webview.setZoomFactor(zoom);
  toast(`Zoom ${Math.round(zoom * 100)}%`);
}

function loadShortcuts() {
  try {
    const value = JSON.parse(localStorage.getItem(shortcutStorageKey) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && isHttpUrl(item.url)) : [];
  } catch {
    return [];
  }
}

function saveShortcuts(shortcuts) {
  localStorage.setItem(shortcutStorageKey, JSON.stringify(shortcuts.slice(0, 20)));
  renderShortcuts();
}

function renderShortcuts() {
  const shortcuts = loadShortcuts();
  shortcutsEl.innerHTML = "";

  if (!shortcuts.length) {
    const empty = document.createElement("p");
    empty.className = "hint";
    empty.textContent = "No custom shortcuts yet.";
    shortcutsEl.appendChild(empty);
    return;
  }

  shortcuts.forEach((shortcut) => {
    const button = document.createElement("button");
    button.className = "link";
    button.title = shortcut.url;
    button.textContent = shortcut.title || getHost(shortcut.url) || shortcut.url;
    button.addEventListener("click", () => go(shortcut.url));
    shortcutsEl.appendChild(button);
  });
}

function addCurrentShortcut() {
  const currentUrl = getCurrentUrl();
  if (!isHttpUrl(currentUrl)) {
    toast("Open a web page before adding a shortcut.");
    return;
  }

  const shortcuts = loadShortcuts().filter((item) => item.url !== currentUrl);
  const title = (webview.getTitle && webview.getTitle()) || getHost(currentUrl) || currentUrl;
  shortcuts.unshift({ title, url: currentUrl });
  saveShortcuts(shortcuts);
  toast("Shortcut saved locally");
}

document.getElementById("go").addEventListener("click", () => go(urlInput.value));
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") go(urlInput.value);
});

document.getElementById("back").addEventListener("click", () => webview.canGoBack() && webview.goBack());
document.getElementById("forward").addEventListener("click", () => webview.canGoForward() && webview.goForward());
document.getElementById("reload").addEventListener("click", () => webview.reload());
document.getElementById("startBtn").addEventListener("click", () => command("start"));
document.getElementById("mini").addEventListener("click", () => window.tubeDesk.openMiniPlayer(getCurrentUrl()));
document.getElementById("top").addEventListener("click", async () => {
  const enabled = await window.tubeDesk.toggleAlwaysOnTop();
  document.getElementById("top").textContent = enabled ? "Top: on" : "Top";
  document.getElementById("top").classList.toggle("active", enabled);
});
document.getElementById("mute").addEventListener("click", () => setMute(!muted));
document.getElementById("focus").addEventListener("click", () => setFocusMode(!focusMode));
document.getElementById("external").addEventListener("click", () => window.tubeDesk.openExternal(getCurrentUrl()));
document.getElementById("clear").addEventListener("click", async () => { await window.tubeDesk.clearSession(); toast("Local session cleared"); });
document.getElementById("addShortcut").addEventListener("click", addCurrentShortcut);
document.getElementById("clearShortcuts").addEventListener("click", () => { saveShortcuts([]); toast("Shortcuts cleared"); });
document.getElementById("zoomIn").addEventListener("click", () => setZoom(zoom + 0.1));
document.getElementById("zoomOut").addEventListener("click", () => setZoom(zoom - 0.1));
document.getElementById("zoomReset").addEventListener("click", () => setZoom(1));

document.querySelectorAll("[data-cmd]").forEach((el) => el.addEventListener("click", () => command(el.dataset.cmd)));
document.querySelectorAll("[data-template]").forEach((el) => {
  el.addEventListener("click", () => {
    const template = el.dataset.template;
    if (template === "mini") window.tubeDesk.openMiniPlayer(getCurrentUrl());
    if (template === "focus") setFocusMode(true);
    if (template === "shortcuts") toast("Use the sidebar to save local shortcuts.");
    if (template === "media") urlInput.focus();
  });
});

attachWebviewEvents();
renderShortcuts();

window.tubeDesk.onCommand(command);
window.tubeDesk.onAlwaysOnTopChanged((enabled) => {
  document.getElementById("top").textContent = enabled ? "Top: on" : "Top";
  document.getElementById("top").classList.toggle("active", enabled);
});
window.tubeDesk.onFocusModeChanged(setFocusMode);
window.tubeDesk.getAppInfo().then((info) => {
  const storeLabel = info.isWindowsStore ? " · Store" : "";
  document.getElementById("appInfo").textContent = `v${info.version} · ${info.partition}${storeLabel}`;
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "l") { event.preventDefault(); urlInput.focus(); }
  if (event.ctrlKey && event.key.toLowerCase() === "r") { event.preventDefault(); webview.reload(); }
  if (event.ctrlKey && event.key.toLowerCase() === "h") { event.preventDefault(); command("start"); }
  if (event.ctrlKey && event.key.toLowerCase() === "m") { event.preventDefault(); setMute(!muted); }
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "f") { event.preventDefault(); setFocusMode(!focusMode); }
  if (event.altKey && event.key === "ArrowLeft" && webview.canGoBack()) webview.goBack();
  if (event.altKey && event.key === "ArrowRight" && webview.canGoForward()) webview.goForward();
});
