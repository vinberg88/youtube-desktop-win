# TubeDesk for Windows — Release Checklist

## Before every release

- [ ] Confirm the release version in `package.json` and any release notes/draft text.
- [ ] Verify `package-lock.json` is committed and matches the pinned Electron/electron-builder versions.
- [ ] Run `npm ci`.

## Windows builds (via GitHub Actions)

- [ ] Trigger **Build Windows Packages** workflow on `main` branch.
- [ ] Confirm `TubeDesk-Windows-NSIS` artifact generated (`dist/*.exe`).
- [ ] Confirm `TubeDesk-Windows-MSI` artifact generated (`dist/*.msi`).
- [ ] Confirm `TubeDesk-Windows-Store-Package` artifact generated (`dist/*.appx`).

## Installer metadata check

- [ ] App name, publisher, version, icon, uninstall entry, and install/uninstall flow are correct.

## Store package metadata check

- [ ] `build.appx.publisher` is `CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5` (confirmed Partner Center value).
- [ ] `build.appx.publisherDisplayName` is `youtube-desktop`.
- [ ] `build.appx.displayName` is `TubeDesk for Windows`.
- [ ] `build.appx.identityName` is `youtube-desktop.TubeDeskForWindows`.
- [ ] `build.appx.languages` is `["en-US"]`.
- [ ] AppxManifest identity/publisher/display name verified against Partner Center Product identity page.

## Assets and listing

- [ ] `assets/icon.ico` is present and current.
- [ ] Store screenshots prepared (English only, 1366×768 or larger).
- [ ] Privacy policy URL is public and reachable.
- [ ] Store listing copy is English only (`STORE-LISTING.md`).

## Smoke test

- [ ] Packaged app launches correctly.
- [ ] Sign-in persistence works.
- [ ] Tray/menu behavior is correct.
- [ ] Mini-player opens.
- [ ] Notifications work.
- [ ] External-link handling is correct.

## Partner Center submission

> **Important:** The app must be registered as an **MSIX app** (not Win32/EXE) in Partner Center.
> See `MICROSOFT_STORE_PUBLISHING.md` Step 1 for instructions on deleting the old Win32 entry and creating a new MSIX app.

- [ ] Partner Center app is of type **MSIX or PWA app** (not EXE or MSI app).
- [ ] New submission created in Partner Center.
- [ ] `.appx` package uploaded to the Packages section.
- [ ] All submission sections completed (availability, properties, age ratings, store listing).
- [ ] No validation errors before submitting.
- [ ] Submitted to the Store.

## GitHub release

- [ ] GitHub release created with tag matching `package.json` version (e.g. `v0.4.7`).
- [ ] NSIS installer attached to release.
- [ ] MSI installer attached to release.
- [ ] Release notes written.
