# Publishing TubeDesk for Windows to Microsoft Store

This app uses Electron Builder's `appx` target, so Microsoft Store publication depends on the package identity and publisher information matching the app registration in Partner Center.

## 1. Prerequisites

- An active Microsoft Partner Center developer account
- A reserved app name for **TubeDesk for Windows**
- Windows 10/11 build environment (local Windows machine, VM, or GitHub Actions Windows runner)
- The repository checked out with `package.json` and `package-lock.json` in sync

## 2. Package identity and publisher alignment

Before building the Store package, verify these values against Partner Center:

- `build.appx.publisher` must match the Partner Center package publisher exactly (`CN=...`)
- `build.appx.publisherDisplayName` must match the publisher display name shown in Partner Center
- `build.appx.displayName` should match the app name users will see in Store/install surfaces
- `build.appx.applicationId` should remain a stable internal app identifier
- `build.appId` should remain stable so packaged app identity does not drift across releases

If Partner Center shows a different package identity or publisher, update `package.json` before generating the Store package.

## 3. Signing and certificate considerations

- Store submissions still require publisher identity alignment even when the final package is distributed through Partner Center
- If you sign locally, use a certificate whose subject matches the same publisher identity configured in `build.appx.publisher`
- If you rely on Partner Center signing, keep the package identity values aligned so submission validation succeeds
- Any mismatch between the package publisher, reserved Store identity, and signing certificate subject can cause submission rejection

## 4. Required metadata and assets

Prepare these items before submission:

- App description and short description (see `STORE-LISTING.md`)
- Privacy policy URL or document reference (`PRIVACY.md`)
- App category and age rating answers
- Support/contact details
- Store screenshots from the packaged app
- App icon and Store art that match the shipped branding

For this repository, verify at minimum:

- `assets/icon.ico`
- Store screenshots for the main window, YouTube view, YouTube Music view, mini-player, and focus mode
- Listing text in `STORE-LISTING.md`

## 5. Build the Store package

Run the Store build on Windows:

```bash
npm ci
npm run build:store -- --publish never
```

Expected output:

- `.appx` or `.msix` package in `dist/`

## 6. Verify the package before submission

Check the generated package for:

- Correct app name and publisher
- Expected version number
- Successful install/update/uninstall on a Windows test machine
- Launch, navigation, persistent sign-in, tray integration, mini-player, and notification behavior
- Expected Store sandbox behavior (`process.windowsStore === true`, global shortcut limitations)

## 7. Submit in Partner Center

1. Open the reserved app in Microsoft Partner Center.
2. Create a new submission.
3. Upload the generated `.appx`/`.msix` package from `dist/`.
4. Complete listing, pricing, markets, age rating, and privacy/support fields.
5. Review automated validation results and fix any identity, metadata, or asset issues.
6. Submit for certification and monitor the certification report until approved.

## 8. Recommended release order

1. Finalize version and changelog
2. Build and verify the NSIS installer
3. Build and verify the Store package
4. Submit to Partner Center
5. Publish the corresponding GitHub release/install artifacts
