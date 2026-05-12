# Microsoft Store Publishing Guide — TubeDesk for Windows

This guide is tailored to the current `main` setup in this repository.

| Setting | Value |
|---|---|
| Store build command | `npm run build:store` (`electron-builder --win appx`) |
| Store artifact in CI | `TubeDesk-Windows-Store-Package` |
| Config file | `package.json` → `build.appx` |
| Listing/privacy docs | `STORE-LISTING.md`, `PRIVACY.md` |

---

## Confirmed Partner Center Account Identity

All values below have been confirmed from the Partner Center account settings.

| Field | Value |
|---|---|
| Publisher Display Name | `youtube-desktop` |
| Account type | Individual |
| Account status | Active |
| Seller ID | `94606110` |
| Windows Publisher ID | `youtube-desktop` |
| Windows Phone Publisher ID | `f6d3ec94-333b-410b-8549-456a21f3fda4` |
| Package Identity Publisher (`CN=...`) | `CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5` |

The `package.json` `build.appx` section is already fully configured with these values — no changes are required before building.

---

## Step 1 — Delete the existing Win32 app and create a new MSIX app

The Partner Center account currently has an app registered as **EXE or MSI app** (Win32). This type cannot accept an APPX/MSIX package. To publish TubeDesk as a proper Store app, the existing entry must be replaced.

1. Go to [Partner Center → Apps and games](https://partner.microsoft.com/en-us/dashboard/apps-and-games/overview).
2. Open the existing `youtube-desktop` entry.
3. Go to **Product management → Manage app name** and delete the app name reservation, or use the **Delete draft** link at the top of the app overview.
4. Click **New product** and choose **MSIX or PWA app**.
5. Reserve the app name `TubeDesk for Windows`.
6. After creation, go to **Product management → Product identity** and confirm that the **Package/Identity/Publisher** value shown is `CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5`. If it differs, update `build.appx.publisher` in `package.json` accordingly.

---

## Step 2 — Verify `package.json` identity alignment

Open `package.json` and confirm the following values under `build.appx`:

| Field | Current value | Expected |
|---|---|---|
| `publisher` | `CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5` | Must match Partner Center Product identity |
| `publisherDisplayName` | `youtube-desktop` | Must match Partner Center publisher display name |
| `displayName` | `TubeDesk for Windows` | Must match reserved app name |
| `identityName` | `youtube-desktop.TubeDeskForWindows` | Keep stable once published |
| `applicationId` | `TubeDeskForWindows` | Keep stable once published |
| `languages` | `["en-US"]` | English-only |

All fields are currently correct. If the Product identity page in Partner Center shows a different `CN=...` value after creating the new MSIX app, update `build.appx.publisher` before building.

---

## Step 3 — Build the Store package

APPX packaging must run on Windows. Use GitHub Actions (recommended) or a local Windows machine.

### Option A — GitHub Actions (recommended)

1. Push your changes to `main`.
2. In GitHub, open **Actions → Build Windows Packages**.
3. Click **Run workflow** and select the `main` branch.
4. Wait for the `build-store` job to complete.
5. Download the artifact named **TubeDesk-Windows-Store-Package** — it contains the `.appx` file.

### Option B — Local Windows machine

```powershell
npm ci
npm run build:store
```

The output file will be placed in `dist/` with a name matching `TubeDesk-for-Windows-Store-*.appx`.

---

## Step 4 — Verify the package manifest before upload

On Windows PowerShell, run the following to inspect the generated package:

```powershell
Remove-Item -Recurse -Force .\dist\appx-unpacked -ErrorAction SilentlyContinue
Expand-Archive -Path .\dist\*.appx -DestinationPath .\dist\appx-unpacked -Force
Get-Content .\dist\appx-unpacked\AppxManifest.xml | Select-String "Identity|Publisher|DisplayName"
```

Confirm that the manifest values match the Partner Center Product identity page exactly.

---

## Step 5 — Prepare Store submission assets

Before submitting, gather the following materials. All text must be in English only.

| Asset | Source |
|---|---|
| App name | `TubeDesk for Windows` |
| Short description | See `STORE-LISTING.md` |
| Long description | See `STORE-LISTING.md` |
| Privacy policy URL | Host `PRIVACY.md` at a public URL (e.g. GitHub Pages or raw GitHub) |
| Screenshots | Minimum 1 screenshot at 1366×768 or larger; all visible text must be English |
| Store logo | 300×300 PNG |
| Category | Entertainment or Music |

---

## Step 6 — Create and complete the submission

1. Open the new MSIX app in Partner Center.
2. Go to **Submissions → Create new submission**.
3. In **Packages**, upload the `.appx` file from Step 3.
4. Complete all remaining sections: Store listings, pricing/availability, properties, age ratings.
5. Resolve all validation warnings and errors.
6. Click **Submit to the Store**.

---

## Step 7 — Certification and publication

After submission, Microsoft runs automated and manual certification checks. Track the status in Partner Center. If certification fails, open the failure report, fix the reported issue, rebuild the package, and create a new submission. When certification passes, the app is published according to your availability settings.

---

## Pre-submission checklist

- [ ] Existing Win32 app deleted from Partner Center
- [ ] New MSIX app created with name `TubeDesk for Windows`
- [ ] `build.appx.publisher` in `package.json` matches the new app's Product identity `CN=...`
- [ ] `build.appx.publisherDisplayName` is `youtube-desktop`
- [ ] `build.appx.languages` is `["en-US"]`
- [ ] GitHub Actions `build-store` job passes
- [ ] AppxManifest identity/publisher/display name verified against Partner Center
- [ ] Privacy policy URL is public and reachable
- [ ] Store screenshots prepared (English only)
- [ ] Store listing text reviewed (`STORE-LISTING.md`)
- [ ] All Partner Center submission sections completed
- [ ] No validation errors before submitting
