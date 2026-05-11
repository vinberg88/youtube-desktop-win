# Exact guide: publish TubeDesk for Windows to Microsoft Store

This guide is tailored to the current `main` setup in this repository:

- Store build command: `npm run build:store` (`electron-builder --win appx`)
- Store artifact in CI: `TubeDesk-Windows-Store-Package`
- Relevant config: `package.json` → `build` and `build.appx`
- Supporting listing/privacy docs: `STORE-LISTING.md`, `PRIVACY.md`

Assumption: you already have a Microsoft Partner Center account.

## Known Partner Center identity values for this repository

- Provided **Package/Identity Name**: `TubeDesk for Windows`
- Still required before final submission config can be completed:
  - **Publisher** (exact Partner Center value, usually `CN=...`)
  - **Publisher Display Name** (exact Partner Center value)

Do not finalize `build.appx.publisher` for Store submission until those remaining values are confirmed from Partner Center.

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

- `build.productName` = Store display name (e.g., `TubeDesk for Windows`)
- `build.appx.displayName` = same Store display name
- `build.appx.publisher` = exact Partner Center **Package/Identity/Publisher** (`CN=...`)
- `build.appx.publisherDisplayName` = your Partner Center publisher display name
- `build.appx.applicationId` = stable app identifier (keep it stable once published)

Current repository value to update before submission:

```json
"build": {
  "appx": {
    "publisher": "CN=Vinberg88"
  }
}
```

Replace that `publisher` value with the exact Partner Center value if different.

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
npm install
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
   Use/adapt `STORE-LISTING.md`.
2. **Privacy policy URL**  
   Host `PRIVACY.md` on a public URL and use that URL in Partner Center.
3. **Store images/screenshots**  
   Prepare required Store asset sizes/screenshots.
4. **Category and age rating answers**  
   Choose category (Entertainment/Music is typically appropriate for this app).

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

## Repository-specific checklist before every Store submission

- [ ] `npm run build:store` succeeds on Windows
- [ ] `build.appx.publisher` exactly matches Partner Center publisher
- [ ] AppxManifest identity/display values verified
- [ ] `STORE-LISTING.md` text is up to date
- [ ] Privacy policy URL is public and reachable
- [ ] Store screenshots/assets are ready
