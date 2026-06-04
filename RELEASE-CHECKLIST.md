# TubeDesk Release Checklist

Use this checklist before creating a Microsoft Store submission or GitHub release.

## Code and metadata

| Check | Requirement |
|---|---|
| App first run | TubeDesk Start appears first; no third-party service opens by default. |
| UI language | Visible Store-facing UI text is English unless complete localization is added. |
| App identity | Product name and package metadata use neutral TubeDesk branding. |
| Third-party references | Third-party product names are not used as product identity, keywords, screenshot titles, or default app content. |
| Privacy policy | `PRIVACY.md` describes user-selected websites and local session behavior accurately. |
| Store listing | `STORE-LISTING.md` matches the shipped app behavior and screenshots. |

## Store metadata

| Field | Expected value or rule |
|---|---|
| `build.appx.publisher` | Must exactly match Partner Center package identity publisher. |
| `build.appx.publisherDisplayName` | `Placeholder_5909898657`; must exactly match the publisher display name shown by Partner Center. |
| `build.appx.displayName` | `TubeDesk` or exact neutral reserved Store product name. |
| `build.appx.identityName` | Neutral Partner Center identity, for example `MattiasVinberg.TubeDesk`; must not contain a third-party service title. |
| `build.appx.applicationId` | `TubeDesk`, unless Partner Center requires a different stable value. |
| `build.appx.languages` | `['en-US']` unless complete localization is added. |

If Partner Center has a locked product identity that contains a third-party product or service name, reserve a new neutral app/product identity before resubmission.

## Build checks

```bash
npm ci
npm run build
```

For Microsoft Store packaging, build on Windows or GitHub Actions:

```powershell
npm ci
npm run build:store
```

## Pre-submission validation

| Check | Action |
|---|---|
| Brand scan | Run `grep -RIn --exclude-dir=.git --exclude=package-lock.json -E "YouTube|youtube|Google|google" .` and review any remaining references. |
| Manifest scan | Inspect generated `AppxManifest.xml` and verify identity, publisher, display name, logos, and language. |
| Screenshot review | Confirm screenshots show TubeDesk value and do not make a third-party website the dominant product identity. |
| Certification notes | Include the resubmission explanation from `MICROSOFT_STORE_PUBLISHING.md`. |
| Privacy URL | Ensure hosted privacy policy is public and reachable. |

## GitHub release checks

| Check | Requirement |
|---|---|
| Version | `package.json` version matches release tag. |
| Installer metadata | NSIS installer metadata uses current version and neutral publisher name. |
| Artifacts | NSIS, MSI, and Store artifacts are generated successfully as needed. |
| Release notes | Notes describe TubeDesk features and any Store-compliance changes accurately. |
