# TubeDesk for Windows Release Checklist

- [ ] Confirm the release version in `package.json` and any release notes/draft text.
- [ ] Verify `package-lock.json` is committed and matches the pinned Electron/electron-builder versions.
- [ ] Run `npm ci`.
- [ ] Run `npm run build -- --publish never` on Windows and confirm the NSIS installer is generated in `dist/`.
- [ ] Run `npm run build:store -- --publish never` on Windows and confirm the AppX/MSIX package is generated in `dist/`.
- [ ] Check installer metadata: app name, publisher, version, icon, uninstall entry, and install/uninstall flow.
- [ ] Check Store package metadata: display name, publisher, application ID, background color, supported languages, and package identity alignment.
- [ ] Verify required assets are present and current (`assets/icon.ico`, Store screenshots, privacy policy URL, listing copy).
- [ ] Smoke-test the packaged app: launch, sign-in persistence, tray/menu behavior, mini-player, notifications, and external-link handling.
- [ ] Confirm Microsoft Store prerequisites are ready: Partner Center app reservation, publisher/certificate alignment, and listing metadata.
- [ ] Upload the Store package in Partner Center, complete the submission fields, and validate warnings/errors before submission.
- [ ] Publish the GitHub release or release notes with the final installer/package artifacts if applicable.
