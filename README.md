# TubeDesk - YOUTUBE PROGRAM FOR MUSIC AND VIDEOS - WINDOWS 11

DOWNLOAD FROM MICROSFT STORE =)

<br>

 <a href="https://apps.microsoft.com/detail/9NBB6K4WP0ZM" target="_blank">
  <img 
    src="https://get.microsoft.com/images/en-us%20dark.svg" 
    alt="Get it from Microsoft Store" 
    width="200"
  />
</a>

<p>

TubeDesk is a focused Windows desktop workspace for user-selected web video, audio, learning, and live-content workflows. It provides a dedicated desktop window with local custom shortcuts, mini-player mode, system tray support, keyboard shortcuts, focus mode, always-on-top mode, mute and zoom controls, and a custom power-user interface.

## Overview

**TubeDesk for Windows** is an independent Electron-based desktop app that lets users open web-based media and live-content pages of their choice in a dedicated Windows application window. It is designed as a clean, modern, power-user-friendly workspace, not as an official client for any third-party service.

TubeDesk is not a downloader, ad blocker, media extractor, scraping tool, paid-service bypass tool, or DRM circumvention tool. It does not modify, scrape, or circumvent third-party services.

TubeDesk is independent and is not affiliated with, endorsed by, sponsored by, or approved by any third-party website, media service, or platform.

## Features

| Area | Feature |
|---|---|
| Workspace | Dedicated desktop window for user-selected web media and live-content pages. |
| Shortcuts | Local custom shortcuts saved on the user's own device. |
| Window control | Mini-player, focus mode, always-on-top mode, tray support, and external-browser handoff. |
| Page control | Back, forward, reload, URL/search field, mute toggle, and zoom controls. |
| Privacy control | Clear local workspace session data from the device. |
| Packaging | Windows installer and Microsoft Store package build support. |

## Requirements

| Requirement | Version or note |
|---|---|
| Windows | Windows 10 or Windows 11 for Windows/AppX/MSIX builds. |
| Node.js | Node.js 22.12+ is required by the pinned Electron toolchain. |
| npm | Required for dependency installation and builds. |
| Git | Optional but recommended for development. |

Check your versions:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd tubedesk-for-windows
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

The generated installer will be placed in `dist/`.

## Build Microsoft Store Package

This repository uses Electron Builder's AppX target:

```bash
npm run build:store
```

AppX/MSIX packaging must be built on a real Windows environment. It does not work from Ubuntu, Linux, or WSL. Use Windows 10/11 PowerShell, a GitHub Actions `windows-latest` runner, or a Windows VM.

The recommended build path is:

```text
GitHub → Actions → Build Windows Packages → Run workflow
```

Then download the artifact named:

```text
TubeDesk-Windows-Store-Package
```

Upload that package in Microsoft Partner Center.

## Store Identity Configuration

Before building for Microsoft Store, make sure the values under `build.appx` in `package.json` match the exact package identity and publisher registered in Partner Center.

The current repository uses neutral TubeDesk metadata. If the Partner Center product identity still contains a third-party product or service name, create or reserve a new neutral product identity before resubmitting. Store package identity fields must match Partner Center exactly.

Keep Microsoft Store copy and package language metadata in English only (`en-US`). That includes the Partner Center listing, release/submission notes, screenshots with text, and `build.appx.languages`.

For the full release and Store publication workflow, see:

- [`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md)
- [`MICROSOFT_STORE_PUBLISHING.md`](MICROSOFT_STORE_PUBLISHING.md)
- [`STORE-LISTING.md`](STORE-LISTING.md)


<br>

<img width="2160" height="2160" alt="apps 18" src="https://github.com/user-attachments/assets/6d64cb66-d2b2-415d-bda6-8188652414b2" />

<br>


## Store Limitations

When running as a Store app (`process.windowsStore === true`), global keyboard shortcuts are disabled because OS-level shortcuts are restricted in the AppX sandbox. Other app-level features such as tray behavior, notifications, webview usage, mini-player mode, focus mode, and local shortcuts remain available subject to Windows and website behavior.

## Project Structure

```text
tubedesk-for-windows/
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
├─ MICROSOFT_STORE_PUBLISHING.md
├─ STORE-LISTING.md
├─ README.md
├─ LICENSE
└─ .gitignore
```

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + L` | Focus search/URL field. |
| `Ctrl + R` | Reload current page. |
| `Ctrl + H` | Show TubeDesk Start. |
| `Ctrl + M` | Toggle mute. |
| `Ctrl + Shift + F` | Toggle focus mode. |
| `Ctrl + Shift + Y` | Show/hide app globally outside Store sandbox. |
| `Alt + Left` | Go back. |
| `Alt + Right` | Go forward. |

## Privacy and Login Behavior

The app uses a persistent Electron session partition named `persist:tubedesk`. This allows cookies and session data created by user-selected websites to remain available after restarting the app.

If a user signs in to a third-party website inside TubeDesk, login is handled directly by that website. TubeDesk does not receive, store, or process usernames, passwords, authentication tokens, or payment information.

## What This App Does Not Do

TubeDesk intentionally does not include video downloading, ad blocking, paid-service bypassing, DRM circumvention, API scraping, or any feature designed to violate third-party service terms.

The goal is a clean, dedicated desktop workspace for user-selected web media and live-content workflows on Windows.

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

| Status | Item |
|---|---|
| Planned | Custom app theme selector. |
| Planned | Import/export app settings. |
| Planned | More configurable workspace templates. |
| Planned | Better mini-player controls. |
| Planned | Auto-update support outside Microsoft Store distribution. |
| Complete | GitHub Actions build pipeline. |
| Complete | Microsoft Store listing draft. |
| Complete | Privacy policy. |

## License

MIT License. See [`LICENSE`](LICENSE).

<br>

<img width="1280" height="800" alt="apps" src="https://github.com/user-attachments/assets/40d5c930-bd74-4ef3-85a4-fc34e8c15fd5" />

<p>

<img width="1357" height="878" alt="apps 41" src="https://github.com/user-attachments/assets/892d29a2-384e-4f06-9294-1ed617d11bbd" />

<br>

Regards,
MAttias Vinberg - SWEDEN - 2026

<br>

