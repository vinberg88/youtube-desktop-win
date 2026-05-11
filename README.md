# YouTube Desktop for Windows

> A polished Electron-based desktop wrapper for YouTube on Windows — with persistent login, mini-player, system tray, shortcuts, focus mode, and a custom power-user interface.

![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-Desktop_App-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Required-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## Overview

**YouTube Desktop for Windows** is a lightweight desktop app that opens YouTube in its own dedicated Windows application window. It is designed as a clean, modern, power-user-friendly wrapper around YouTube — not a downloader, ad blocker, or Premium bypass tool.

The app keeps your YouTube/Google login session using a persistent Electron session partition, so you can sign in once and remain logged in between launches.

## Features

### Core

- Dedicated YouTube desktop window
- Persistent Google/YouTube login session
- Back, forward, reload, and home controls
- YouTube URL/search bar
- Dark custom toolbar
- Windows installer build support

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

- Windows 10 or Windows 11
- Node.js 18+
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
npm install
```

Start the app in development mode:

```bash
npm start
```

## Build Windows Installer

Create a Windows installer using `electron-builder`:

```bash
npm run build
```

The generated installer will be placed in:

```text
dist/
```

## Project Structure

```text
youtube-desktop-win/
├─ assets/
│  └─ icon.svg
├─ index.html
├─ main.js
├─ mini.html
├─ package.json
├─ preload.js
├─ renderer.js
├─ README.md
├─ LICENSE
└─ .gitignore
```

For full tray icon support, add a Windows icon at:

```text
assets/icon.ico
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + L` | Focus search/URL field |
| `Ctrl + R` | Reload YouTube |
| `Ctrl + H` | Go to custom start page / home |
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

The goal is simple: a clean desktop experience for YouTube on Windows.

## Development Notes

Run the app:

```bash
npm start
```

Build installer:

```bash
npm run build
```

Clean install:

```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, dist
Remove-Item -Force package-lock.json
npm install
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
- [ ] GitHub Actions build pipeline

## License

MIT License. See [`LICENSE`](LICENSE).
