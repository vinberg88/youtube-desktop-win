let webview = document.getElementById("youtube");
const urlInput = document.getElementById("url");
const start = document.getElementById("start");
const progress = document.getElementById("progress");
const statusEl = document.getElementById("status");
const toastEl = document.getElementById("toast");
const contentEl = document.querySelector(".content");

const routes = {
  home: "https://www.youtube.com",
  subscriptions: "https://www.youtube.com/feed/subscriptions",
  music: "https://music.youtube.com",
  trending: "https://www.youtube.com/feed/trending",
  history: "https://www.youtube.com/feed/history",
  later: "https://www.youtube.com/playlist?list=WL"
};

let zoom = 1;
let muted = false;
let focusMode = false;

function toast(message) {
  toastEl.textContent = message;
  toastEl.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => (toastEl.style.display = "none"), 2200);
}

function normalizeUrl(value) {
  const input = value.trim();
  if (!input) return routes.home;
  if (input.includes(" ") || !input.includes(".")) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(input)}`;
  }
  return input.startsWith("http://") || input.startsWith("https://") ? input : `https://${input}`;
}

function getHost(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

function shouldRecreateWebview(currentUrl, nextUrl) {
  const currentHost = getHost(currentUrl);
  const nextHost = getHost(nextUrl);
  const currentIsMusic = currentHost === "music.youtube.com";
  const nextIsMusic = nextHost === "music.youtube.com";

  return currentIsMusic !== nextIsMusic;
}

function attachWebviewEvents() {
  webview.addEventListener("did-start-loading", () => {
    progress.style.width = "45%";
    statusEl.textContent = "Laddar...";
  });

  webview.addEventListener("did-stop-loading", () => {
    progress.style.width = "100%";
    setTimeout(() => (progress.style.width = "0"), 250);
    statusEl.textContent = webview.getTitle() || "Redo";
    webview.setZoomFactor(zoom);
    webview.setAudioMuted(muted);
  });

  webview.addEventListener("did-navigate", (e) => {
    urlInput.value = e.url;
  });

  webview.addEventListener("did-navigate-in-page", (e) => {
    urlInput.value = e.url;
  });
}

function recreateWebview(url) {
  const nextWebview = document.createElement("webview");
  nextWebview.id = "youtube";
  nextWebview.setAttribute("partition", "persist:youtube");
  nextWebview.setAttribute("allowpopups", "");
  nextWebview.src = url;

  webview.replaceWith(nextWebview);
  webview = nextWebview;
  attachWebviewEvents();

  webview.setZoomFactor(zoom);
  webview.setAudioMuted(muted);
}

function showStart() {
  start.classList.remove("hidden");
  urlInput.value = routes.home;
  statusEl.textContent = "Startsida";
}

function go(url) {
  start.classList.add("hidden");

  const currentUrl = webview.getURL ? webview.getURL() : webview.src;
  if (shouldRecreateWebview(currentUrl, url)) {
    recreateWebview(url);
    toast(getHost(url) === "music.youtube.com" ? "Växlar till YouTube Music" : "Växlar till YouTube Videos");
  } else {
    webview.src = url;
  }

  urlInput.value = url;
}

function command(cmd) {
  if (cmd === "start") {
    showStart();
    return;
  }

  go(routes[cmd] || routes.home);
}

function setFocusMode(enabled) {
  focusMode = Boolean(enabled);
  document.body.classList.toggle("focus", focusMode);
  document.getElementById("focus").classList.toggle("active", focusMode);
  window.youtubeApp.setFocusMode(focusMode);
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

document.getElementById("go").addEventListener("click", () => go(normalizeUrl(urlInput.value)));
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") go(normalizeUrl(urlInput.value));
});

document.getElementById("back").addEventListener("click", () => webview.canGoBack() && webview.goBack());
document.getElementById("forward").addEventListener("click", () => webview.canGoForward() && webview.goForward());
document.getElementById("reload").addEventListener("click", () => webview.reload());
document.getElementById("home").addEventListener("click", () => command("home"));
document.getElementById("startBtn").addEventListener("click", () => command("start"));
document.getElementById("mini").addEventListener("click", () => window.youtubeApp.openMiniPlayer(webview.getURL()));
document.getElementById("top").addEventListener("click", async () => {
  const enabled = await window.youtubeApp.toggleAlwaysOnTop();
  document.getElementById("top").textContent = enabled ? "Top: på" : "Top";
  document.getElementById("top").classList.toggle("active", enabled);
});
document.getElementById("mute").addEventListener("click", () => setMute(!muted));
document.getElementById("focus").addEventListener("click", () => setFocusMode(!focusMode));
document.getElementById("external").addEventListener("click", () => window.youtubeApp.openExternal(webview.getURL()));
document.getElementById("clear").addEventListener("click", async () => { await window.youtubeApp.clearSession(); toast("Session rensad"); });
document.getElementById("zoomIn").addEventListener("click", () => setZoom(zoom + 0.1));
document.getElementById("zoomOut").addEventListener("click", () => setZoom(zoom - 0.1));
document.getElementById("zoomReset").addEventListener("click", () => setZoom(1));

document.querySelectorAll("[data-cmd]").forEach((el) => el.addEventListener("click", () => command(el.dataset.cmd)));

attachWebviewEvents();

window.youtubeApp.onCommand(command);
window.youtubeApp.onAlwaysOnTopChanged((enabled) => {
  document.getElementById("top").textContent = enabled ? "Top: på" : "Top";
  document.getElementById("top").classList.toggle("active", enabled);
});
window.youtubeApp.onFocusModeChanged(setFocusMode);
window.youtubeApp.getAppInfo().then((info) => {
  const storeLabel = info.isWindowsStore ? " · Store" : "";
  document.getElementById("appInfo").textContent = `v${info.version} · ${info.partition}${storeLabel}`;
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "l") { event.preventDefault(); urlInput.focus(); }
  if (event.ctrlKey && event.key.toLowerCase() === "r") { event.preventDefault(); webview.reload(); }
  if (event.ctrlKey && event.key.toLowerCase() === "h") { event.preventDefault(); command("home"); }
  if (event.ctrlKey && event.key.toLowerCase() === "m") { event.preventDefault(); setMute(!muted); }
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "f") { event.preventDefault(); setFocusMode(!focusMode); }
  if (event.altKey && event.key === "ArrowLeft" && webview.canGoBack()) webview.goBack();
  if (event.altKey && event.key === "ArrowRight" && webview.canGoForward()) webview.goForward();
});

urlInput.value = routes.home;
