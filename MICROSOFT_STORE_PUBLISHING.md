# Microsoft Store Publishing Guide for TubeDesk

This guide explains how to prepare and resubmit TubeDesk for Microsoft Store after a Policy 10.1 rejection related to inaccurate representation.

## Current Store compliance position

TubeDesk should be submitted as an independent Windows desktop workspace for user-selected web video, audio, learning, and live-content workflows. It should not be presented as an official app, replacement client, or single-service container for any third-party service.

The Store listing, screenshots, privacy policy, package metadata, and first-run app experience must all communicate the same product identity: **TubeDesk**, published under the Partner Center publisher display name **Placeholder_5909898657**, with distinct workflow value around local shortcuts, mini-player mode, focus mode, tray behavior, local session controls, mute and zoom controls, and external-browser handoff.

## Important Microsoft Store Policy 10.1 points

Microsoft Store Policy 10.1 requires the product and metadata to accurately and clearly reflect the product's source, functionality, features, and relationship to other products. Policy 10.1.1 also requires that the value proposition be clear during the first-run experience and that the product must not mislead customers about its relationship to other products.

For TubeDesk, this means the first screen should be the TubeDesk-branded start workspace, not a third-party website. Screenshots and text should show TubeDesk features, and third-party service names should not be used as keywords or as the product's identity.

## Partner Center identity checklist

Before building the Store package, verify the exact identity fields in Partner Center and mirror them in `package.json` under `build.appx`.

| Field | Recommended value or rule |
|---|---|
| Product name | `TubeDesk` or another neutral name that does not contain another product or service title. |
| Publisher display name | `Placeholder_5909898657`, exactly as shown by Partner Center for this developer account. |
| Package identity name | Use the exact Partner Center package identity name reserved for this Store listing: `youtube-desktop.TubeDesk`. Do not use another neutral-looking value, because Partner Center validates this field exactly. |
| Publisher | Use the exact publisher certificate string shown in Partner Center. |
| Package language | `en-US`, unless you add complete localized Store listings and app UI. |

If the existing Partner Center product has a locked identity that contains a third-party product or service name, reserve a new neutral app/product identity and submit a new Store product. Package identity mismatches will fail ingestion, so update `package.json` only to values that Partner Center confirms.

## package.json example

The current repository uses the following Partner Center values. These must match the exact values shown by Partner Center:

```json
"appx": {
  "applicationId": "TubeDesk",
  "backgroundColor": "#0f0f0f",
  "displayName": "TubeDesk",
  "publisher": "CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5",
  "publisherDisplayName": "Placeholder_5909898657",
  "identityName": "youtube-desktop.TubeDesk",
  "languages": ["en-US"],
  "artifactName": "TubeDesk-Store-${version}.${ext}"
}
```

## Build package

Build the Store package on Windows, not Linux or WSL:

```powershell
npm ci
npm run build:store
```

You can also use GitHub Actions:

```text
GitHub → Actions → Build Windows Packages → Run workflow
```

Download the artifact named `TubeDesk-Windows-Store-Package`, unzip it, and upload the generated `.appx` or `.msix` package in Partner Center.

## Partner Center blocking error: `PublisherDisplayName`

If Partner Center reports that the app manifest uses the wrong `PublisherDisplayName`, set `build.appx.publisherDisplayName` in `package.json` to the exact value shown in the validation message. For the current developer account, Partner Center expects:

```json
"publisherDisplayName": "Placeholder_5909898657"
```

After changing this value, rebuild the Store package and upload the newly generated `.appx` package. Do not re-upload an older artifact, because the old manifest will still contain the rejected value.

## Partner Center warning: `runFullTrust`

Electron AppX packages normally declare the restricted capability `runFullTrust`. Microsoft documents that restricted capabilities require approval for Store submission, and Electron Builder documents that `runFullTrust` is required for most Electron apps and is added by default for AppX packages.

Do **not** remove `runFullTrust` from the TubeDesk AppX package as a normal fix. Removing it can make the packaged Electron desktop app fail schema validation or fail to run correctly. Instead, handle the Partner Center package validation warning by completing the restricted-capability explanation in the submission flow.

Use this explanation if Partner Center asks why `runFullTrust` is needed:

> TubeDesk is a packaged Electron desktop application submitted as an AppX/MSIX package. The `runFullTrust` capability is required so the packaged desktop application can start and run its Electron main process as a standard full-trust Windows desktop app. TubeDesk uses this capability only for its local desktop shell features, including the application window, tray behavior, mini-player window, local session controls, and user-initiated navigation. TubeDesk does not use this capability to bypass Windows security, access user files without consent, install services, run background tasks outside the app session, or circumvent third-party websites or services.

If Partner Center shows this as a **warning**, continue the submission after providing the explanation. If Partner Center shows it as a **blocking error** stating that the account is not authorized to submit `runFullTrust`, use Partner Center support or submit TubeDesk through the Store's Win32 desktop app flow instead of the AppX flow.

## Store listing checklist

Use the copy in `STORE-LISTING.md` and keep the listing in English unless you provide complete localized variants.

| Store item | Requirement |
|---|---|
| App name | Use `TubeDesk`; do not add third-party product names or keyword phrases. |
| Short description | State that it is a focused Windows workspace for user-selected web media workflows. |
| Long description | Explain desktop workflow features and third-party-service limitations clearly. |
| Keywords | Use at most seven relevant generic terms; do not use third-party product titles. |
| Screenshots | Show TubeDesk branding, start workspace, shortcuts, mini-player, focus mode, and tray menu. |
| Privacy policy | Use the updated `PRIVACY.md` text or a hosted equivalent. |
| Certification notes | Explain exactly what changed after the 10.1 rejection. |

## Recommended certification notes

Use a concise note similar to this in Partner Center:

> This resubmission updates TubeDesk to address Microsoft Store Policy 10.1 / 10.1.1.4 feedback. The app is now represented and implemented as an independent Windows workspace for user-selected web media, audio, learning, and live-content workflows. The first-run experience opens a TubeDesk-branded start workspace instead of a third-party service. Metadata, privacy policy, Store description, keywords, and screenshots avoid using third-party product names as the app identity or search terms. TubeDesk provides distinct desktop workflow features including local custom shortcuts, mini-player mode, focus mode, always-on-top mode, tray behavior, local session controls, mute/zoom controls, and external-browser handoff. TubeDesk is not affiliated with, endorsed by, sponsored by, or approved by any third-party website or media service and does not download, scrape, bypass, or circumvent third-party services.

## Screenshot guidance

The first screenshot should be the TubeDesk start page because this proves that the value proposition is clear during first run. Subsequent screenshots should show user-created shortcuts, the mini-player, focus mode, and the system tray menu. If a third-party website appears in a screenshot, keep TubeDesk UI chrome visible and do not make the third-party brand the dominant visual identity.

## Final pre-submission checks

Run a search through the repository and listing copy before submission. Third-party names should appear only in neutral disclaimers or technical compatibility notes when absolutely necessary, not in product name, package identity, keywords, screenshot titles, or first-run app identity.

```bash
grep -RIn --exclude-dir=.git --exclude=package-lock.json -E "YouTube|youtube|Google|google" .
```

Any remaining references should be reviewed and either removed or justified as neutral legal/privacy wording.
