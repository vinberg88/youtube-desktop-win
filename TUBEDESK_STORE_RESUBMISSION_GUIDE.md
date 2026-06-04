# TubeDesk: åtgärdsrapport och resubmission-guide för Microsoft Store

Författare: Manus AI  
Datum: 2026-06-04

## Sammanfattning

Microsofts avslag enligt **10.1.1.4 Inaccurate Representation** pekar på att produkten kan uppfattas som att den representerar, förväxlas med eller bygger sin kärnidentitet på en annan produkt eller tjänst. Microsofts policy 10.1 kräver att appens funktion, källa, relation till andra produkter och värdeproposition är tydlig och korrekt i både appen och Store-listningen.[1]

Jag har därför ändrat appen från en tjänstespecifik inbäddning till en tydligare och mer neutral **TubeDesk**-produkt: en oberoende Windows-arbetsyta för användarvalda webbaserade video-, audio-, utbildnings- och liveinnehållsflöden. Appen öppnar nu en egen TubeDesk-startsida vid första körning, presenterar egna funktioner och använder neutral metadata.

## Huvudorsaken till avslaget

Den tidigare versionen riskerade att granskas som en app vars värde och identitet låg för nära en specifik tredjepartstjänst. Detta är särskilt känsligt om appnamn, standardvy, Store-texter, genvägar, metadata eller screenshots gör att användaren tror att appen är officiell, sponsrad, godkänd eller ersätter en annan produkt.

| Riskområde | Tidigare risk | Åtgärd |
|---|---|---|
| Första körning | Appen öppnade tredjepartsinnehåll direkt. | Appen öppnar nu en egen TubeDesk-startworkspace. |
| Produktidentitet | Metadata och dokumentation kunde uppfattas som tjänstespecifik. | Produktnamn, beskrivning och Store-copy är nu neutral TubeDesk-positionering. |
| Tydligt eget värde | Den egna nyttan var inte tillräckligt framträdande i appens första vy. | Startvyn beskriver lokala genvägar, mini-player, focus mode, always-on-top, tray, mute/zoom och sessionsrensning. |
| Förväxlingsrisk | Tredjepartsnamn kunde användas som appidentitet, keywords eller default-flöde. | Store-texten instruerar att undvika tredjepartsnamn som produktidentitet och keywords. |
| Integritet | Policytexten behövde förklara webbinnehåll och inloggning tydligare. | `PRIVACY.md` beskriver lokal session, tredjepartswebbplatser och att utvecklaren inte samlar in data. |

## Ändringar i koden

Appens huvudfiler har ändrats för att göra TubeDesk till den tydliga primära produkten. Den nya implementationen använder `persist:tubedesk` som session och visar `about:blank` eller TubeDesk-startvy istället för att starta i en specifik tredjepartstjänst.

| Fil | Viktig ändring |
|---|---|
| `main.js` | Omskriven huvudprocess med TubeDesk-namn, lokal workspace-session, traymeny, mini-player, focus mode och Store-säker shortcut-hantering. |
| `preload.js` | Bytt exponerad brygga från tjänstespecifik API till `tubeDesk`. |
| `index.html` | Ny TubeDesk-startsida som förklarar appens oberoende värde och tredjepartsdisclaimer. |
| `renderer.js` | Generisk URL/search-navigation, lokala användargenvägar, mute/zoom/focus/mini-player-logik och TubeDesk-startkommando. |
| `mini.html` | Generisk TubeDesk Mini Player utan tjänstespecifika standardknappar. |
| `package.json` | Neutral produktbeskrivning, `displayName: TubeDesk`, `applicationId: TubeDesk`, `publisherDisplayName: Placeholder_5909898657` och neutral `identityName`. |

## Ändringar i Store- och publiceringsmaterial

Dokumentationen har uppdaterats för att Partner Center-listningen ska stämma med appens faktiska beteende. Det är viktigt eftersom Microsoft granskar både app, metadata, screenshots och policytext som en helhet.[1]

| Fil | Syfte |
|---|---|
| `STORE-LISTING.md` | Ny Store-listning med kort beskrivning, lång beskrivning, funktioner, begränsningar, disclaimer, keywords och certifieringsnotering. |
| `MICROSOFT_STORE_PUBLISHING.md` | Ny steg-för-steg-guide för resubmission efter 10.1-avslag. |
| `RELEASE-CHECKLIST.md` | Ny checklista som hindrar att gamla tredjepartsnamn återinförs i Store-metadata. |
| `README.md` | Uppdaterad publik dokumentation som beskriver TubeDesk som oberoende Windows-arbetsyta. |
| `PRIVACY.md` | Uppdaterad integritetspolicy med tydlig hantering av lokala sessionsdata och tredjepartstjänster. |
| `build/installer.nsh` | Neutraliserade support-/about-länkar i installer-metadata. |

## Teknisk validering som redan är gjord

Jag har kört syntaxkontroll på Electron-huvudprocessen och preload-filen, installerat beroenden med `npm ci`, genererat AppX Store-assets via `npm run prepare:appx-assets` och gjort en varumärkessökning i relevanta filer.

| Kontroll | Resultat |
|---|---|
| `node --check main.js` | Godkänd. |
| `node --check preload.js` | Godkänd. |
| `npm ci` | Godkänd, men `npm audit` rapporterar en high-severity dependency-varning. Den bör granskas separat innan release. |
| `npm run prepare:appx-assets` | Godkänd; Store-logotyper och AppX-assets genererades under `build/` och `build/appx/`. |
| Varumärkessökning | Kvarvarande träffar finns endast i checklistans egen söksträng och publiceringsguidens egen söksträng. |

## Viktigt innan du bygger Store-paketet

`package.json` är nu satt till en neutral identitet, men Microsoft Partner Center kräver att paketets identity-värden matchar Partner Center exakt. Om Partner Center fortfarande har en låst identitet som innehåller ett gammalt tredjepartsnamn bör du reservera en ny neutral appidentitet innan ny inskickning.

| Fält | Nuvarande värde i repo | Vad du måste kontrollera |
|---|---|---|
| `publisher` | `CN=0A041C83-6229-4D05-83CD-8D8BF7D93CB5` | Måste matcha Partner Center exakt. |
| `publisherDisplayName` | `Placeholder_5909898657` | Måste matcha Partner Centers Publisher Display Name exakt; detta var orsaken till det blockerande uppladdningsfelet. |
| `displayName` | `TubeDesk` | Bör matcha reserverat appnamn. |
| `identityName` | `MattiasVinberg.TubeDesk` | Måste matcha Partner Centers Package/Identity Name exakt. |
| `languages` | `en-US` | Behåll engelska om du inte lokaliserar app, screenshots och Store-listning fullt ut. |

## Aktuellt uppladdningsfel: PublisherDisplayName

Partner Center rapporterade att paketet innehöll `PublisherDisplayName` = `Mattias Vinberg`, men att kontots Publisher Display Name är `Placeholder_5909898657`. Detta är ett blockerande manifestfel. Lösningen är att bygga ett nytt paket efter att `package.json` har uppdaterats till exakt `Placeholder_5909898657`; det gamla `.appx`-paketet ska inte laddas upp igen.

`runFullTrust`-meddelandet är däremot en separat restricted capability-varning för Electron/AppX och ska motiveras i Partner Center, inte lösas genom att ta bort capabilityn.

## Rekommenderade steg i Partner Center

Börja med att kontrollera om den befintliga appen i Partner Center är en MSIX/PWA-app och om produktnamn och package identity är neutrala. Om appen är skapad som Win32/EXE eller om identity är låst till ett olämpligt gammalt namn, skapa en ny MSIX/PWA-produkt med ett neutralt namn som **TubeDesk**.

| Steg | Åtgärd |
|---|---|
| 1 | Säkerställ att appen är en MSIX/PWA-produkt, inte en Win32/EXE-produkt. |
| 2 | Reservera ett neutralt appnamn, helst `TubeDesk`. |
| 3 | Kopiera exakt `Package/Identity/Publisher` från Partner Center till `package.json` om det skiljer sig. |
| 4 | Bygg Store-paketet på Windows eller via GitHub Actions: `npm run build:store`. |
| 5 | Kontrollera genererad `AppxManifest.xml` mot Partner Center innan uppladdning. |
| 6 | Använd texten i `STORE-LISTING.md` för Store-listningen. |
| 7 | Ladda upp screenshots som visar TubeDesk-startsidan, genvägar, mini-player, focus mode och tray. |
| 8 | Lägg in certifieringsnoteringen från `MICROSOFT_STORE_PUBLISHING.md`. |
| 9 | Skicka in ny submission. |

## Rekommenderad certifieringsnotering

Kopiera denna text till Partner Center under submission notes:

> This resubmission updates TubeDesk to address Microsoft Store Policy 10.1 / 10.1.1.4 feedback. The app is now represented and implemented as an independent Windows workspace for user-selected web media, audio, learning, and live-content workflows. The first-run experience opens a TubeDesk-branded start workspace instead of a third-party service. Metadata, privacy policy, Store description, keywords, and screenshots avoid using third-party product names as the app identity or search terms. TubeDesk provides distinct desktop workflow features including local custom shortcuts, mini-player mode, focus mode, always-on-top mode, tray behavior, local session controls, mute/zoom controls, and external-browser handoff. TubeDesk is not affiliated with, endorsed by, sponsored by, or approved by any third-party website or media service and does not download, scrape, bypass, or circumvent third-party services.

## Rekommenderade screenshots

För att undvika ett nytt 10.1.1.4-avslag bör screenshots visa TubeDesk som huvudprodukten. Den första bilden bör därför visa den nya TubeDesk-startsidan, inte en tredjepartswebbplats. Om du visar en tredjepartswebbplats i någon screenshot ska TubeDesk-kromet och TubeDesk-funktionerna vara tydliga.

| Screenshot | Rekommenderat motiv |
|---|---|
| 1 | TubeDesk-startsidan med värdeproposition och disclaimer. |
| 2 | Sidopanelen med lokala custom shortcuts. |
| 3 | Mini-player-fönster med TubeDesk Mini-krom. |
| 4 | Focus mode före/efter eller ren workspace-vy. |
| 5 | System tray-menyn med TubeDesk-kommandon. |

## Nästa praktiska beslut

Ändringarna finns på branchen `store-10-1-fix`. Efter varje metadataändring behöver ett nytt Store-paket byggas via GitHub Actions eller på Windows. Ladda inte upp ett äldre `.appx`-paket, eftersom manifestet i det paketet fortfarande innehåller gamla värden.

## Referenser

[1]: https://learn.microsoft.com/en-us/windows/apps/publish/store-policies "Microsoft Store Policies, section 10.1 Distinct Function & Value; Accurate Representation"
