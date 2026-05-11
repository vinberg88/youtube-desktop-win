# TubeDesk for Windows

> A polished, unofficial Electron-based desktop wrapper for YouTube and YouTube Music on Windows — with persistent login, mini-player, system tray, shortcuts, focus mode, and a custom power-user interface.

![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-Desktop_App-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Required-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## Overview

**TubeDesk for Windows** is a lightweight desktop app that opens YouTube and YouTube Music in a dedicated Windows application window. It is designed as a clean, modern, power-user-friendly wrapper — not a downloader, ad blocker, or Premium bypass tool.

The app keeps your YouTube/Google login session using a persistent Electron session partition, so you can sign in once and remain logged in between launches.

TubeDesk for Windows is unofficial and is not affiliated with, endorsed by, sponsored by, or approved by Google LLC or YouTube.

## Features

### Core

- Dedicated YouTube / YouTube Music desktop window
- Persistent Google/YouTube login session
- Back, forward, reload, and home controls
- YouTube URL/search bar
- Dark custom toolbar
- Windows installer build support
- Microsoft Store package build support on Windows

### Power-user extras

- Custom start page
- Quick links for Home, Subscriptions, YouTube Music, Trending, History, and Watch Later
- Mini-player window
- Always-on-top mode
- System tray integration when `assets/icon.ico` is present
- Focus mode
- Mute toggle
- Zoom in, zoom out, and reset zoom
- Progress indicator
- Toast notifications
- Open current page in external browser
- Clear local login/session data
- Keyboard shortcuts

## Requirements

- Windows 10 or Windows 11 for Windows/AppX/MSIX builds
- Node.js 22.12+ (required by the pinned Electron toolchain)
- npm
- Git, optional but recommended

Check your versions:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone https://github.com/vinberg88/youtube-desktop-win.git
cd youtube-desktop-win
```

Install dependencies:

```bash
npm ci
```

Start the app in development mode:

```bash
npm start
```

## Build Windows Installer

Create a standard Windows NSIS installer:

```bash
npm run build
```

The generated installer will be placed in:

```text
dist/
```

## Build Microsoft Store Package

The Store package uses Electron Builder's AppX/MSIX target:

```bash
npm run build:store
```

Important: `appx` / Microsoft Store packaging must be built on a real Windows environment. It does **not** work from Ubuntu, Linux, or WSL.

Use one of these instead:

```text
Windows 10/11 PowerShell
GitHub Actions windows-latest runner
Windows VM
```

Recommended path:

```text
GitHub → Actions → Build Windows Packages → Run workflow
```

Then download the artifact named:

```text
TubeDesk-Windows-Store-Package
```

Upload that package in Microsoft Partner Center.

### Store Identity Configuration

Before building for Microsoft Store, make sure the values under `build.appx` in `package.json` match the package identity and publisher registered in Partner Center.

For the full release and Store publication workflow, see:

- [`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md)
- [`MICROSOFT-STORE-PUBLISHING.md`](MICROSOFT-STORE-PUBLISHING.md)

### Store Limitations

When running as a Store app (`process.windowsStore === true`):

- Global keyboard shortcuts are disabled (OS-level shortcuts are restricted in AppX sandbox)
- The AppUserModelId is managed by Windows automatically
- All other features (tray, notifications, webview, mini-player) work normally

## Project Structure

```text
youtube-desktop-win/
├─ .github/workflows/build-windows.yml
├─ assets/
│  ├─ icon.svg
│  └─ icon.ico
├─ index.html
├─ main.js
├─ mini.html
├─ package.json
├─ preload.js
├─ renderer.js
├─ PRIVACY.md
├─ RELEASE-CHECKLIST.md
├─ MICROSOFT-STORE-PUBLISHING.md
├─ STORE-LISTING.md
├─ README.md
├─ LICENSE
└─ .gitignore
```

For full tray icon and installer icon support, add a Windows icon at:

```text
assets/icon.ico
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + L` | Focus search/URL field |
| `Ctrl + R` | Reload YouTube |
| `Ctrl + H` | Go to YouTube Home |
| `Ctrl + M` | Toggle mute |
| `Ctrl + Shift + F` | Toggle focus mode |
| `Ctrl + Shift + Y` | Show/hide app globally |
| `Alt + Left` | Go back |
| `Alt + Right` | Go forward |

## Login Behavior

The app uses a persistent Electron session partition:

```html
partition="persist:youtube"
```

This allows YouTube/Google cookies and session data to remain available after restarting the app.

Note: Google may occasionally restrict sign-in in embedded browser environments. This project does not attempt to bypass Google security mechanisms.

## What This App Does Not Do

This project intentionally does **not** include:

- Video downloading
- Ad blocking
- Premium bypassing
- DRM circumvention
- YouTube API scraping
- Any feature designed to violate YouTube or Google terms

The goal is simple: a clean desktop experience for YouTube and YouTube Music on Windows.

## Development Notes

Run the app:

```bash
npm start
```

Build NSIS installer:

```bash
npm run build
```

Build Store package on Windows:

```bash
npm run build:store
```

Clean install on Linux/macOS:

```bash
rm -rf node_modules dist
npm ci
npm run build
```

Clean install on Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, dist
npm ci
npm run build
```

## Roadmap

- [ ] Custom app theme selector
- [ ] More quick links
- [ ] Configurable start page
- [ ] Better mini-player controls
- [ ] Import/export app settings
- [ ] Auto-update support
- [ ] Screenshot assets for README
- [x] GitHub Actions build pipeline
- [x] Microsoft Store listing draft
- [x] Privacy policy

## License

MIT License. See [`LICENSE`](LICENSE).
