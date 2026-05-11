# Exact guide: publish TubeDesk for Windows to Microsoft Store

This guide is tailored to the current `main` setup in this repository:

- Store build command: `npm run build:store` (`electron-builder --win appx`)
- Store artifact in CI: `TubeDesk-Windows-Store-Package`
- Relevant config: `package.json` → `build` and `build.appx`
- Supporting listing/privacy docs: `STORE-LISTING.md`, `PRIVACY.md`

Assumption: you already have a Microsoft Partner Center account.

## 0) Exact materials to copy for this repository

### (1) Exact Microsoft Store listing draft (English)

**App name**
`TubeDesk for Windows`

**Short description**
`A clean, unofficial desktop wrapper for YouTube and YouTube Music on Windows.`

**Long description**

> TubeDesk for Windows gives YouTube and YouTube Music a dedicated desktop experience on Windows.
>
> It provides a polished app window, persistent sign-in, quick navigation, mini-player support, always-on-top mode, focus mode, system tray integration, mute controls, zoom controls, and keyboard shortcuts.
>
> TubeDesk is designed for users who want a focused desktop app experience without browser tab clutter.

**Key features**

- Dedicated desktop window for YouTube and YouTube Music
- Persistent Google/YouTube login session
- Quick links for Home, Subscriptions, Music, Trending, History, and Watch Later
- Mini-player window
- Always-on-top mode
- Focus mode
- System tray support
- Mute toggle
- Zoom controls
- Open current page in external browser
- Clear local session data
- Keyboard shortcuts

**Disclaimer**

> TubeDesk for Windows is an unofficial application and is not affiliated with, endorsed by, sponsored by, or approved by Google LLC or YouTube.
>
> YouTube and YouTube Music are trademarks of Google LLC.

### (2) Exact `package.json` `appx` example for current Electron/electron-builder setup

Use this exact structure under `build.appx` in `package.json`:

```json
"appx": {
  "applicationId": "TubeDeskForWindows",
  "backgroundColor": "#0f0f0f",
  "displayName": "TubeDesk for Windows",
  "publisher": "CN=<exact-value-from-product-identity-page>",
  "publisherDisplayName": "Mattias Vinberg",
  "languages": [
    "en-US"
  ],
  "artifactName": "TubeDesk-for-Windows-Store-${version}.${ext}"
}
```

### (3) Final pre-submission checklist (Microsoft Store)

- [ ] Retrieve exact `CN=...` publisher value from **Partner Center → Product identity**
- [ ] Set `build.appx.publisher` in `package.json` to that exact `CN=...` value
- [ ] Keep `build.appx.publisherDisplayName` as `"Mattias Vinberg"`
- [ ] Keep `build.appx.displayName` as `"TubeDesk for Windows"`
- [ ] Keep `build.appx.languages` as `["en-US"]` (English-only listing/package metadata)
- [ ] Run `npm ci` and `npm run build:store -- --publish never` on Windows
- [ ] Confirm generated `.appx`/`.msix` appears in `dist/`
- [ ] Verify `AppxManifest.xml` identity/publisher/display name match Partner Center
- [ ] Confirm Store listing text is English-only (`STORE-LISTING.md`)
- [ ] Confirm privacy policy URL is public and reachable
- [ ] Upload package in Partner Center and resolve all validation warnings/errors before submit

## Known Partner Center identity values for this repository

Confirmed account details from Microsoft Partner Center:

| Field | Value |
|---|---|
| Publisher name / Publisher Display Name | `Mattias Vinberg` |
| Account type | Individual |
| Account status | Active |
| Windows phone publisher ID (GUID) | `576bb53a-ae72-4179-9e13-98a74cc8fe32` |

The `build.appx.publisherDisplayName` in `package.json` is already set to `Mattias Vinberg` — no change needed there.

### What still needs to be retrieved before final submission

The **Package/Identity Publisher** (`CN=...`) is a per-app value shown on the app's **Product identity** page in Partner Center — it is different from the account-level publisher name. You must retrieve this exact value to set `build.appx.publisher` correctly.

**How to find it:**

1. Go to <https://partner.microsoft.com/dashboard>
2. Open **Apps and games** → open your app (e.g., `TubeDesk for Windows`)
3. In the left menu, go to **Product management** → **Product identity** (or look for **Package/Identity**)
4. Copy the exact value shown next to **Publisher** — it looks like `CN=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

Once you have that value, update `package.json`:

```json
"build": {
  "appx": {
    "publisher": "CN=<exact-value-from-product-identity-page>"
  }
}
```

> **Note:** For Individual accounts, the publisher CN often contains your Windows phone publisher GUID
> (`576bb53a-ae72-4179-9e13-98a74cc8fe32`) in the format `CN=<GUID-in-uppercase>`, but the exact format
> varies by account. Always copy the precise value from the Product identity page rather than constructing it manually.

Do not finalize `build.appx.publisher` for Store submission until the exact `CN=...` value is confirmed from the app's Product identity page in Partner Center.

## 1) Reserve/create the app in Partner Center

1. Go to <https://partner.microsoft.com/dashboard>
2. Open **Apps and games**.
3. If TubeDesk is not created yet:
   - Click **Create a new app**
   - Reserve the app name (e.g., `TubeDesk for Windows`)
4. Open the app entry and note these exact values:
   - **Package/Identity Name**: for this repository, currently provided as `TubeDesk for Windows`
   - **Package/Identity/Publisher** (e.g., `CN=...`)
   - Publisher display name used by your account

## 2) Align `package.json` with Partner Center identity

Open `package.json` and verify:

- `build.productName` = Store display name → currently `"TubeDesk for Windows"` ✓
- `build.appx.displayName` = same Store display name → currently `"TubeDesk for Windows"` ✓
- `build.appx.publisher` = exact Partner Center **Package/Identity/Publisher** (`CN=...`) → **⚠ must be updated** (see "What still needs to be retrieved" section above)
- `build.appx.publisherDisplayName` = Partner Center publisher display name → currently `"Mattias Vinberg"` ✓
- `build.appx.applicationId` = stable app identifier → currently `"TubeDeskForWindows"` ✓ (keep stable once published)
- `build.appx.languages` = supported Store package languages → keep only `"en-US"` ✓

The one field that must be updated before submission is `build.appx.publisher`. Replace the current placeholder with the exact `CN=...` value from the app's Product identity page in Partner Center:

```json
"build": {
  "appx": {
    "publisher": "CN=<exact-value-from-product-identity-page>"
  }
}
```

> All other `appx` fields already match the confirmed Partner Center account details.

## 2.5) Signing and certificate considerations

- Keep the package identity aligned even if the final Store-distributed package is handled through Partner Center.
- If you sign locally before submission, use a certificate whose subject matches `build.appx.publisher`.
- If you rely on Partner Center signing, the package publisher and reserved Store identity still need to match exactly.
- Any mismatch between package identity, publisher, and signing certificate subject can cause Store validation or certification failure.

## 3) Build the Store package on Windows

`appx` builds must run on Windows.

### Option A (recommended): GitHub Actions

1. Push your config changes to your branch.
2. In GitHub, open **Actions** → **Build Windows Packages**.
3. Click **Run workflow** (branch containing your final store config).
4. Wait for `build-store` job to pass.
5. Download artifact **TubeDesk-Windows-Store-Package**.

### Option B: local Windows machine

From repository root:

```powershell
npm ci
npm run build:store -- --publish never
```

Expected output in `dist/`: at least one `.appx` (sometimes also `.msix`).

## 4) Verify package identity before upload

On Windows PowerShell, from repository root:

```powershell
Remove-Item -Recurse -Force .\dist\appx-unpacked -ErrorAction SilentlyContinue
Expand-Archive -Path .\dist\*.appx -DestinationPath .\dist\appx-unpacked -Force
Get-Content .\dist\appx-unpacked\AppxManifest.xml | Select-String "Identity|Publisher|DisplayName"
```

Confirm the manifest identity/publisher/display name matches Partner Center.

## 5) Prepare Store submission metadata/assets

In Partner Center submission, you will need:

1. **Descriptions and text**
   Use/adapt `STORE-LISTING.md`. Keep all Store text in English only.
2. **Privacy policy URL**
   Host `PRIVACY.md` on a public URL and use that URL in Partner Center.
3. **Store images/screenshots**
   Prepare required Store asset sizes/screenshots and keep any visible text in English only.
4. **Category and age rating answers**
   Choose category (Entertainment/Music is typically appropriate for this app).

Also keep any submission notes, release notes, and other Partner Center text fields in English only so they match the repository documentation and `en-US` package language metadata.

## 6) Create and complete the submission in Partner Center

1. Open your app in Partner Center.
2. Go to **Submissions** → **Create new submission**.
3. In **Packages**, upload the `.appx` from step 3.
4. Complete remaining sections (Store listings, pricing/availability, properties, age ratings, etc.).
5. Resolve all validation warnings/errors.
6. Click **Submit to the Store**.

## 7) Certification and publication

1. Track certification status in Partner Center.
2. If certification fails:
   - Open the failure report.
   - Fix the reported issue in code/config.
   - Rebuild package on Windows.
   - Create a new submission and upload the new package.
3. When certification passes, Microsoft publishes the app per your availability settings.

## Recommended release order

1. Finalize version and changelog
2. Build and verify the NSIS installer
3. Build and verify the Store package
4. Submit to Partner Center
5. Publish the corresponding GitHub release/install artifacts

## Repository-specific checklist before every Store submission

- [ ] Retrieve exact `CN=...` publisher value from app's Product identity page in Partner Center
- [ ] Set `build.appx.publisher` to that `CN=...` value in `package.json`
- [ ] `npm run build:store` succeeds on Windows
- [ ] `build.appx.publisher` exactly matches Partner Center publisher (`CN=...`)
- [ ] `build.appx.publisherDisplayName` is `"Mattias Vinberg"` ✓ (already correct)
- [ ] `build.appx.languages` is `["en-US"]`
- [ ] AppxManifest identity/display values verified (see step 4)
- [ ] `STORE-LISTING.md` text is up to date and remains English only
- [ ] Privacy policy URL is public and reachable
- [ ] Store screenshots/assets are ready and use English only where text appears
