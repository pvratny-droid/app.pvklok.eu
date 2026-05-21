# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **`/` (lomítko)** na začátku = **vypočítávaná hodnota**.
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

> **Verze: RQU002** – GUI třídy zpřesněny dle zdrojových kódů (`/coco/web-app/src/content/post/`). Klíčové změny: G015 (specifikační dialog) přepsán na 10 sekcí dle `CommandPostSpecificationDialog.tsx`. Doplněna nová třída G030 (dialog vytvoření MV), G031 (dialog interakcí – IER), G032 (dialog výběru IER), G033 (dialog výběru IP), G034 (dialog importu interakcí), G035 (dialog výběru procedurální instrukce), G036 (dialog možností reportu MV), G037 (dialog možností CIS matice), G038 (dialog přidání/úpravy pozice). Sloupce gridů G011 doplněny dle `CommandPostTableGridColDefs.tsx`.

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G011](#gui-G011) | Karty míst velení | commandPostsList | «Form» |
| └ [G012](#gui-G012) | Karta místa velení (dlaždice) | commandPostCard | «Form multi area» |
| └ [G011b](#gui-G011b) | Tabulkové zobrazení karet MV | commandPostsTable | «Form grid area» |
| [G013](#gui-G013) | Detail karty místa velení | commandPostDetail | «Form» |
| └ [G014](#gui-G014) | Sekce specifikace | sectionSpec | «Form area» |
| └ [G021](#gui-G021) | Sekce informačních toků | sectionInfoFlows | «Form area» |
| └ [G024](#gui-G024) | Sekce FMN instrukcí | sectionFmn | «Form area» |
| └ [G025](#gui-G025) | Sekce ke stažení | sectionDownload | «Form area» |
| [G015](#gui-G015) | Specifikace MV (dialog) | specificationDialog | «Form modal» |
| └ [G016](#gui-G016) | Podřízená místa velení (grid) | subordinatesGrid | «Form grid area» |
| [G017](#gui-G017) | Strukturu velení (dialog) | structureDialog | «Form modal» |
| └ [G018](#gui-G018) | Pozice MV (grid – strom) | positionsGrid | «Form grid area» |
| [G019](#gui-G019) | Formulář schopností (dialog) | capabilitiesDialog | «Form modal» |
| └ [G020](#gui-G020) | Schopnosti MV – MCA tree (grid) | capabilitiesGrid | «Form grid area» |
| [G022](#gui-G022) | Pohled přes IER (dlaždice) | ierTile | «Form multi area» |
| [G023](#gui-G023) | Pohled přes IP (dlaždice) | ipTile | «Form multi area» |
| [G026](#gui-G026) | FMN dlaždice | fmnTile | «Form multi area» |
| [G027](#gui-G027) | Základní karta velení (dlaždice) | basicCardTile | «Form multi area» |
| [G028](#gui-G028) | Rozšířená karta velení (dlaždice) | extendedCardTile | «Form multi area» |
| [G029](#gui-G029) | CIS matice (dlaždice) | cisMatrixTile | «Form multi area» |
| [G030](#gui-G030) | Vytvoření MV (dialog) | createCpDialog | «Form modal» |
| [G031](#gui-G031) | Interakce s MV (dialog) | interactionsUpdateDialog | «Form modal» |
| └ [G031a](#gui-G031a) | Grid interakcí | interactionsGrid | «Form grid area» |
| [G032](#gui-G032) | Výběr IER (dialog) | ierSelectionDialog | «Form modal» |
| [G033](#gui-G033) | Výběr IP (dialog) | ipSelectionDialog | «Form modal» |
| [G034](#gui-G034) | Import interakcí z jiného MV (dialog) | interactionsImportDialog | «Form modal» |
| [G035](#gui-G035) | Výběr procedurální instrukce (dialog) | proceduralInstrSelDialog | «Form modal» |
| [G036](#gui-G036) | Možnosti reportu MV (dialog) | reportOptionsDialog | «Form modal» |
| [G037](#gui-G037) | Možnosti CIS matice (dialog) | cisMatrixOptionsDialog | «Form modal» |
| [G038](#gui-G038) | Přidat / Upravit pozici (dialog) | positionCreateDialog | «Form modal» |
| └ [G038a](#gui-G038a) | Grid rolí (uvnitř G038) | rolesGrid | «Form grid area» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G011"></a>
## «Form» Karty míst velení

Přehledový formulář všech evidovaných míst velení. URL: `/web/command-posts`. Source: `/coco/web-app/src/content/post/CommandPostsPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis sekce | — | „Karty míst velení" (i18n `commandPost:label`) |
| 2 | E | EText | Vyhledat | searchQuery | Placeholder „Vyhledat místa velení podle jména nebo popisu" (i18n `commandPost:searchCommandPostsByNameOrDescription`); filtruje název + popis |
| 3 | E | EPrepinac | Tile/Table | viewMode | `ToggleButtonGroup` – Tile view (default) / Table view |
| 4 | R | RList | Seznam karet (Tile) | — | Mřížka `«Form multi area»` G012 (4 karty na řádek) |
| 5 | R | RGrid | Seznam karet (Table) | — | Tabulkový grid `«Form grid area»` [G011b](#gui-G011b) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vyhledat() | — | Filtruje karty (case-insensitive, název + popis) | [UC010](02_use_case_model.md#uc-UC010) |
| 2 | PřepnoutZobrazení() | — | Tile ↔ Table | [UC011](02_use_case_model.md#uc-UC011) |
| 3 | PřidatKartuMV() | + Přidat | Otevře dialog [G030](#gui-G030) | [UC018](02_use_case_model.md#uc-UC018) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G012](#gui-G012) | Karty MV v Tile zobrazení (1..N) |
| contains | [G011b](#gui-G011b) | Karty MV v Table zobrazení |
| opens | [G030](#gui-G030) | Vytvoření MV (+ Přidat) |
| opens | [G036](#gui-G036) | Možnosti reportu MV (Report) |
| opens | [G037](#gui-G037) | Možnosti CIS matice (CIS report) |
| navigates | [G013](#gui-G013) | Detail karty |
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G011b"></a>
## «Form grid area» Tabulkové zobrazení karet MV

Alternativní zobrazení k Tile view. Sloupce dle `CommandPostTableGridColDefs.tsx`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Tlačítka **Zobrazit** (PageView) a **Report** (Feed); min šířka 160 px |
| 2 | R | RText | Kód | s5636Identifier | Sloupec `s5636Identifier` (DTO `ElementDto`); i18n `commandPost:code` |
| 3 | R | RText | Název | name | Třída [L003](04_logicky_model.md#lm-L003) `nazev` |
| 4 | R | RDlouhyText | Popis | description | Pro tento sloupec UI label je „Popis"; DTO atribut `description` (= cílový stav v editaci) |
| 5 | R | RDatumCas | Naposledy změněno | lastModified | DTO `ElementDto.lastModified` |
| 6 | R | RText | Zodpovědná osoba | cp.responsiblePerson | DTO custom field |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zobrazit() | — | Navigace na detail MV | [UC012](02_use_case_model.md#uc-UC012) |
| 2 | StáhnoutReport() | Report | Otevře dialog [G036](#gui-G036) | [UC021](02_use_case_model.md#uc-UC021) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | |
| navigates | [G013](#gui-G013) | Detail karty |
| opens | [G036](#gui-G036) | Možnosti reportu |

---

<a id="gui-G012"></a>
## «Form multi area» Karta místa velení (dlaždice)

Jedna karta MV v Tile zobrazení. Source: `/coco/web-app/src/component/card/CocoCommandPostCard.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název | name | např. „Strategic Command 22"; DTO `name` |
| 2 | R | RNahled | Obrázek | imageSrc | Fotografie / vizuál; DTO `image` (filename z `/command-posts/images`) |
| 3 | R | RPriznak | Vlajka | flagImageSrc | Vlajka země; DTO `flagImage` |
| 4 | R | RPriznak | Taktická značka | tacticalSymbolSrc | NATO značka; DTO `cp.tacticalSign` |
| 5 | R | RDlouhyText | Popis | description | DTO `description` (= cílový stav v editaci) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zobrazit() | ZOBRAZIT | Naviguje na `/command-posts/{id}` | [UC012](02_use_case_model.md#uc-UC012) |
| 2 | Report() | REPORT | Split-action button: **Report MV** (PDF) / **CIS matice** (XLSX) – otevře [G036](#gui-G036) nebo [G037](#gui-G037) | [UC021](02_use_case_model.md#uc-UC021) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| navigates | [G013](#gui-G013) | Detail karty |
| opens | [G036](#gui-G036) | Možnosti reportu MV |
| opens | [G037](#gui-G037) | Možnosti CIS matice |
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G013"></a>
## «Form» Detail karty místa velení

Detail karty MV. URL: `/web/command-posts/<id>`

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název MV (breadcrumb) | name | např. „Strategic Command 22" |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G014](#gui-G014) | Sekce specifikace |
| contains | [G021](#gui-G021) | Sekce IER/IP |
| contains | [G024](#gui-G024) | Sekce FMN instrukcí |
| contains | [G025](#gui-G025) | Sekce ke stažení |
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G014"></a>
## «Form area» Sekce specifikace

Tematická sekce detailu MV se 3 dlaždicemi.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis sekce | — | „Specifikace, schopnosti a velitelská struktura" |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | UpravitSpecifikaci() | Upravit | Otevře dialog Specifikace | [UC013](02_use_case_model.md#uc-UC013) |
| 2 | UpravitFormulářSchopností() | Upravit | Otevře dialog Schopnosti | [UC015](02_use_case_model.md#uc-UC015) |
| 3 | UpravitStrukturuVelení() | Upravit | Otevře dialog Strukturu velení | [UC014](02_use_case_model.md#uc-UC014) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G015](#gui-G015) | Specifikace MV |
| opens | [G017](#gui-G017) | Strukturu velení |
| opens | [G019](#gui-G019) | Formulář schopností |

---

<a id="gui-G015"></a>
## «Form modal» Specifikace MV

Modální dialog editace specifikace MV. Source: `/coco/web-app/src/content/post/specification/CommandPostSpecificationDialog.tsx`. Endpoint: `GET /command-posts/{id}/specification` → `PUT /command-posts/{id}/specification`. Šířka `maxWidth: xl`. Confirm-close potvrzení neuložených změn.

> **Verze: RQU002** – kompletní revize atributů 1:1 dle source. Pole **Kód schopnosti** přejmenováno na **Kód jednotky** (`unitCode`) – cs i18n překlad „Kód schopnosti" je chybný (en label „Unit code"); business význam = kód útvaru, nikoli vazba na entitu Schopnost. Doplněno 14 nových sekcí/polí (Společné funkce, Bojové funkce, Úroveň, Kontinuita, Mobilita, Druh mobility, Balistická ochrana – kinetická + minová, Zabezpečení ochrany, Odolnost, Soběstačnost, Omezení, Požadavky, Funkce MV, P. č. dle VODOS, Lokace – šířka/délka).

Dialog je strukturován do **10 vizuálních sekcí**, oddělených nadpisy `<Typography variant="h6">`.

### Atributy – Sekce 1: Místo velení (`CommandPostUpdateForm`)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Specifikace místa velení" (i18n `commandPost:commandPostSpecification`) |
| 2 | H | HText | Sekce | — | „Místo velení" (i18n `commandPost:commandPost`) |
| 3 | E | ELOV | **Typ místa velení** | commandPostTypeCode | Povinné `*`; LOV z `GET /command-posts/types` |
| 4 | E | EText | Název | name | |
| 5 | E | EText | Zodpovědná osoba | responsiblePerson | i18n `commandPostResponsiblePerson` |
| 6 | E | ELOV | Taktická značka | tacticalSymbol | LOV s ikonami z `GET /command-posts/tactical-symbols`; v DTO `tacticalSign` |
| 7 | E | EText | Kód jednotky | unitCode | i18n cs „Kód schopnosti" (**chybný překlad** – business = kód jednotky/útvaru) |
| 8 | E | ELOV | Vlajka | flagImage | LOV vlajek z `GET /command-posts/flags` (komponenta `FlagSelectField`) |
| 9 | E | ELOV | Obrázek | image | LOV thumbnailů z `GET /command-posts/images` |
| 10 | E | EDlouhyText | Cílový stav | description | i18n `commandPost:targetState`; v gridu se totéž pole zobrazuje jako „Popis" (na L003) |

### Atributy – Sekce 2: Podřízená místa velení

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 11 | H | HText | Sekce | — | „Podřízená místa velení" (i18n `commandPost:subordinateCommandPosts`) |
| 12 | E | EGrid | Grid podřízených MV | — | Vnořený grid [G016](#gui-G016) |

### Atributy – Sekce 3: Funkce a úroveň

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 13 | H | HText | Sekce | — | „Funkce a úroveň" (i18n `commandPost:functionsAndLevel`) |
| 14 | E | EMultiLOV | Společné funkce | jointFunctions | Multi-LOV; LOV z `GET /command-posts/catalogs/joint-functions` |
| 15 | E | EMultiLOV | Bojové funkce | combatFunctions | Multi-LOV; LOV z `GET /command-posts/catalogs/combat-functions` |
| 16 | E | ELOV | Úroveň | level | LOV z `GET /command-posts/catalogs/levels` |

### Atributy – Sekce 4: Kontinuita

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 17 | H | HText | Sekce | — | „Trvalost" (i18n `commandPost:continuity`) |
| 18 | E | ERadio | Kontinuita | continuityCode | Radio: PERMANENT (Trvalé) / TEMPORARY (Dočasné) |

### Atributy – Sekce 5: Mobilita

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 19 | H | HText | Sekce | — | „Pohyblivost" (i18n `commandPost:mobility`) |
| 20 | E | ERadio | Mobilita | mobilityType | Radio: STATIONARY (Stacionární) / MOBILE (Mobilní) |
| 21 | E | EMultiLOV | Druh pohyblivosti | mobilitySpec | Viditelné jen pokud mobilityType = MOBILE; multi-LOV z `GET /command-posts/catalogs/mobilities` (filtr vyjma STATIONARY/MOBILE) |

### Atributy – Sekce 6: Stupeň balistické ochrany vozidel (jen pokud MOBILE)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 22 | H | HText | Sekce | — | „Stupeň balistické ochrany vozidel" (i18n `commandPost:levelOfTheBalisticVehicleProtection`) |
| 23 | E | ELOV | Kinetická | balisticProtectionKinetic | LOV KP_1..KP_6 z `GET /command-posts/catalogs/kinetic-protection-levels` |
| 24 | E | ELOV | Minová | balisticProtectionMine | LOV MP_1..MP_4 z `GET /command-posts/catalogs/mine-protection-levels` |

### Atributy – Sekce 7: Zabezpečení ochrany dle RMO č.49/2017

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 25 | H | HText | Sekce | — | „Zabezpečení ochrany dle RMO č.49/2017" + tlačítko download `zabezpeceni_ochrany_vojenskych_objektu.docx` |
| 26 | E | ELOV | Zabezpečení ochrany MV | securityProtection | LOV s popisem (tooltip) z `GET /command-posts/catalogs/security-protections` |
| 27 | E | ELOV | Odolnost | resilience | LOV s popisem (tooltip) z `GET /command-posts/catalogs/resiliences` |
| 28 | E | ELOV | Soběstačnost | selfSustainment | LOV z `GET /command-posts/catalogs/self-sustainments` |

### Atributy – Sekce 8: Omezení, požadavky a další

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 29 | H | HText | Sekce | — | „Omezení, požadavky a další" (i18n `commandPost:constraintsRequirementsAndOther`) |
| 30 | E | EMultiLOV | Omezení | constraints | Multi-LOV z `GET /command-posts/catalogs/constraints` |
| 31 | E | EDlouhyText | Funkce místa velení | functionDescription | Textarea (minRows 3); i18n `commandPost:commandPostFunction` |
| 32 | E | EMultiLOV | Požadavky | requirements | Multi-LOV z `GET /command-posts/catalogs/requirements` |
| 33 | E | EText | P. č. dle VODOS | vodosNumber | i18n `commandPost:vodos` |

### Atributy – Sekce 9: Lokace (GPS)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 34 | H | HText | Sekce | — | „Lokace" (i18n `commandPost:location`) |
| 35 | E | EText | Šířka | latitude | Helper „Šířka je povinná, pokud je zadána délka"; validace párovosti |
| 36 | E | EText | Délka | longitude | Helper „Délka je povinná, pokud je zadána šířka"; validace párovosti |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Uloží specifikaci přes `PUT /command-posts/{id}/specification` | [UC013](02_use_case_model.md#uc-UC013) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog (s confirm při neuložených změnách) | [UC013](02_use_case_model.md#uc-UC013) |

### Validace

| ID | Pravidlo | Implementace |
|---|---|---|
| V-G015-1 | Šířka je povinná, pokud je vyplněna délka | Funkce `validate()` v dialogu |
| V-G015-2 | Délka je povinná, pokud je vyplněna šířka | Funkce `validate()` v dialogu |
| V-G015-3 | Typ MV je povinný (UI `*`) | `required` na poli |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G016](#gui-G016) | Podřízená MV (grid) |
| dataSource | [Specifikace MV](04_logicky_model.md#lm-L004) | Hlavní; obsahuje atributy 5–36 |
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | Atributy 3–4, 10 (typ, název, popis/cílový stav) jsou na L003 |

---

<a id="gui-G016"></a>
## «Form grid area» Podřízená místa velení

Tabulka v rámci dialogu Specifikace MV.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce (smazat) | — | Ikona koše |
| 2 | R | RText | Název | name | Název podřízeného MV |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | SmazatPodřízenéMV() | — | Smaže vazbu | [UC019](02_use_case_model.md#uc-UC019) |
| 2 | PřidatPodřízenéMV() | ≡+ | LOV pro výběr | [UC019](02_use_case_model.md#uc-UC019) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Vazba podřízenosti MV](04_logicky_model.md#lm-L005) | |

---

<a id="gui-G017"></a>
## «Form modal» Strukturu velení

Modální dialog správy pozic a jejich přiřazení k rolím. Source: `/coco/web-app/src/content/post/structure/CommandStructureDialogDataGrid.tsx`. Endpoint: `GET /command-posts/{id}/position-definition` → `POST /command-posts/{id}/position-definition`.

> **Verze: RQU002** – atribut `searchQuery` přesunut do nested grid [G018](#gui-G018). Atribut **Rozpad MV** je multi-tag pole na **úrovni celého MV** (ne pozice) – viz [L014](04_logicky_model.md#lm-L014).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Strukturu velení" (i18n `commandPost:commandStructure`) |
| 2 | E | EMultiLOV | Rozpad Místa Velení | breakdowns | Multi-tag (např. „H4", „H3"); DTO `CommandPostPositionDefinitionDto.breakdowns: string[]` |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatPozici() | + Přidat pozici | Otevře dialog [G038](#gui-G038) | [UC014](02_use_case_model.md#uc-UC014) |
| 2 | UpravitPozici() | Upravit | Otevře dialog [G038](#gui-G038) s vyplněnými hodnotami | [UC014](02_use_case_model.md#uc-UC014) |
| 3 | Uložit() | ULOŽIT | Uloží přes `POST /command-posts/{id}/position-definition` | [UC014](02_use_case_model.md#uc-UC014) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G018](#gui-G018) | Pozice MV (strom) |
| opens | [G038](#gui-G038) | Přidat / Upravit pozici |
| dataSource | [Pozice na MV](04_logicky_model.md#lm-L006) | |
| dataSource | [Rozpad MV](04_logicky_model.md#lm-L014) | |

---

<a id="gui-G018"></a>
## «Form grid area» Pozice MV (strom)

Tabulka pozic v dialogu Strukturu velení. Hierarchický strom (tree data grid) – řádky lze rozbalit. Source: `CommandStructureDialogDataGrid.tsx`, ColDefs: `CommandStructureDataGridColDefs.tsx`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Tlačítka (Upravit, Smazat); min šířka 80 px |
| 2 | R | RTree | Strom pozic | TREE_DATA_GROUP_FIELD | Group field se zalomením – zobrazuje název pozice + počet rolí (X) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | UpravitPozici() | — | Otevře [G038](#gui-G038) | [UC014](02_use_case_model.md#uc-UC014) |
| 2 | SmazatPozici() | — | Smaže pozici (s potvrzením, pokud má podpozice/role) | [UC014](02_use_case_model.md#uc-UC014) |
| 3 | RozbalitVšechnyŘádky() | Rozbalit všechny řádky | i18n `commandPost:expandAllRows` | [UC014](02_use_case_model.md#uc-UC014) |
| 4 | ZabalitVšechnyŘádky() | Zabalit všechny řádky | i18n `commandPost:collapseAllRows` | [UC014](02_use_case_model.md#uc-UC014) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Pozice na MV](04_logicky_model.md#lm-L006) | |

---

<a id="gui-G019"></a>
## «Form modal» Formulář schopností

Modální dialog specifikace MCA schopností MV. Source: `/coco/web-app/src/content/post/capabilities/CommandPostCapabilityDialog.tsx`. Endpoint: `GET /command-posts/{id}/capability-spec` → `PUT /command-posts/{id}/capability-spec`. Šířka `maxWidth: xl`.

> **Verze: RQU002** – atribut **Mód zobrazení (Kódy/Hierarchie)** v source kódu **není** – v původní analýze byl chybně předpokládán z UI prvního průchodu. Místo toho je dialog jen druh mise + tree grid. Atribut **Druhy misí** je nyní multi-select entit `MissionTypeDto` (z RQU003), ne enum.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Formulář schopností" (i18n `commandPost:capabilityForm`) |
| 2 | H | HText | Sekce | — | „Druh mise/operace" (i18n `mission:missionOrOperationType`) |
| 3 | E | EMultiLOV | **Druhy misí** | selectedMissionTypes | Povinné `required`; multi-select entit `MissionTypeDto` z RQU003 (endpoint `GET /mission/mission-types`); formátování `MissionTypeFormatter.formatMissionType` |
| 4 | E | EGrid | MCA schopnosti | selectedCapabilitySpecs | Tree grid [G020](#gui-G020) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Uloží přes `PUT /command-posts/{id}/capability-spec`; pokud má některá MCA schopnost prázdné subkategorie, zobrazí confirm dialog (i18n `mission:abilitiesDoNotHaveSelectedSubcategory`) | [UC015](02_use_case_model.md#uc-UC015) |

### Validace

| ID | Pravidlo | Implementace |
|---|---|---|
| V-G019-1 | Druhy misí jsou povinné | `required` na MultiSelectField |
| V-G019-2 | Při ukládání MCA schopnosti s prázdnými subkategoriemi zobrazit confirm | `ConfirmationDialog` v dialogu |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G020](#gui-G020) | MCA schopnosti (tree grid) |
| dataSource | [Schopnost MV](04_logicky_model.md#lm-L007) | |
| dataSource | [Druh mise MV](04_logicky_model.md#lm-L012) | |

---

<a id="gui-G020"></a>
## «Form grid area» Schopnosti MV – MCA tree

Tree grid schopností MV. Source: `/coco/web-app/src/content/post/capabilities/CommandPostCapabilityDataGrid.tsx`, ColDefs: `CommandPostCapabilityDataGridColDefs.tsx`.

> **Verze: RQU002** – grid je stromový (`tree data`): root řádky = MCA schopnosti (`McaCapability`), child řádky = subkategorie (`McaCapabilitySubcategory`). Sloupec **Podporováno** je checkbox **per subkategorie**, ne per schopnost. Sloupec **Akce** je per řádek.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Akce per řádek; min šířka 80 px |
| 2 | R | RTree | Schopnost / Subkategorie | TREE_DATA_GROUP_FIELD | Strom: schopnost → subkategorie |
| 3 | E | ECheck | Podporováno | support | Checkbox per subkategorie (i18n `commandPost:supported`); šířka 100 px |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OznačitPodporováno() | — | Toggle podpory subkategorie | [UC015](02_use_case_model.md#uc-UC015) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Schopnost MV](04_logicky_model.md#lm-L007) | |

---

<a id="gui-G021"></a>
## «Form area» Informační toky a produkty

Tematická sekce s 2 dlaždicemi. Source: `/coco/web-app/src/content/post/CommandPostInteractionsCardPanel.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis sekce | — | „Informační toky a produkty na místě velení" (i18n `commandPost:iersAndProductsAtCommandPost`) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatPodleIER() | + Přidat podle IER | Otevře dialog [G032](#gui-G032) výběru IER, pak [G031](#gui-G031) | [UC020a](02_use_case_model.md#uc-UC020a) |
| 2 | PřidatPodleIP() | + Přidat podle IP | Otevře dialog [G033](#gui-G033) výběru IP, pak [G031](#gui-G031) | [UC020b](02_use_case_model.md#uc-UC020b) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G022](#gui-G022) | Pohled přes IER |
| contains | [G023](#gui-G023) | Pohled přes IP |
| opens | [G031](#gui-G031) | Interakce s MV |
| opens | [G032](#gui-G032) | Výběr IER |
| opens | [G033](#gui-G033) | Výběr IP |

---

<a id="gui-G022"></a>
## «Form multi area» Pohled přes IER

Dlaždice pohledu na informační toky podle IER. Kliknutí na dlaždici nebo **Upravit** otevírá [G031](#gui-G031) v režimu `isIer=true`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název pohledu | — | „Pohled přes IER" (i18n `commandPost:ierView`) |
| 2 | R | RNahled | Vizuální blok | — | Modrý panel `COLORS.BLUE` |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Upravit() | UPRAVIT | Otevře [G031](#gui-G031) (`isIer=true`, `fetchInteractions=true`) – načte IER přiřazené k MV (`POST /command-posts/interactions:search-assigned-iers`) | [UC016](02_use_case_model.md#uc-UC016) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G031](#gui-G031) | Interakce IER |
| dataSource | [Tok IER na MV](04_logicky_model.md#lm-L008) | |

---

<a id="gui-G023"></a>
## «Form multi area» Pohled přes IP

Dlaždice pohledu na informační toky podle IP. Kliknutí otevírá [G031](#gui-G031) v režimu `isIer=false`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název pohledu | — | „Pohled přes IP" (i18n `commandPost:ipView`) |
| 2 | R | RNahled | Vizuální blok | — | Oranžový panel `COLORS.ORANGE_LIGHT` |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zobrazit() | ZOBRAZIT | Otevře [G031](#gui-G031) (`isIer=false`) | [UC016](02_use_case_model.md#uc-UC016) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G031](#gui-G031) | Interakce IP |
| dataSource | [Tok IP na MV](04_logicky_model.md#lm-L009) | |

---

<a id="gui-G024"></a>
## «Form area» FMN instrukce

Tematická sekce s dlaždicemi 13 FMN instrukcí.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis sekce | — | „FMN instrukce" |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatFMNInstrukci() | + PŘIDAT PODLE FMN INSTRUKCE | Otevře dialog [G035](#gui-G035) výběru procedurální instrukce, pak [G031](#gui-G031) | [UC020c](02_use_case_model.md#uc-UC020c) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G026](#gui-G026) | Dlaždice FMN (1..13) |

---

<a id="gui-G025"></a>
## «Form area» Karty MV ke stažení

Tematická sekce s dlaždicemi pro stažení.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis sekce | — | „Karty míst velení ke stažení" |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G027](#gui-G027) | Základní karta |
| contains | [G028](#gui-G028) | Rozšířená karta |
| contains | [G029](#gui-G029) | CIS matice |

---

<a id="gui-G026"></a>
## «Form multi area» FMN dlaždice

Dlaždice jedné FMN instrukce. Třináct typů (Fire Support, C2 of Air Operations, CIMIC, Communications, …).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název instrukce | — | např. „Instructions for Fire Support" |
| 2 | R | RNahled | Vizuální blok | — | Tmavě modrý panel |
| 3 | R | RDlouhyText | Popis interakce | — | „Interakce na místě velení : Instructions for ..." |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Upravit() | UPRAVIT | Editor instrukce | [UC016](02_use_case_model.md#uc-UC016) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [FMN instrukce na MV](04_logicky_model.md#lm-L010) | |

---

<a id="gui-G027"></a>
## «Form multi area» Základní karta velení

Dlaždice pro stažení Základní karty velení (PDF).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název | — | „Základní karta velení" |
| 2 | R | RNahled | Vizuální blok | — | Modrofialový panel |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | StáhnoutPDF() | STÁHNOUT PDF | Stáhne PDF | [UC017](02_use_case_model.md#uc-UC017) |

---

<a id="gui-G028"></a>
## «Form multi area» Rozšířená karta velení

Dlaždice pro stažení Rozšířené karty velení (PDF).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název | — | „Rozšířená karta velení" |
| 2 | R | RNahled | Vizuální blok | — | Tyrkysový panel |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | StáhnoutPDF() | STÁHNOUT PDF | Stáhne PDF | [UC017](02_use_case_model.md#uc-UC017) |

---

<a id="gui-G029"></a>
## «Form multi area» CIS matice

Dlaždice pro stažení CIS matice (XLSX). Otevírá dialog možností [G037](#gui-G037) před generováním.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název | — | „CIS matice" (i18n `commandPost:cisMatrixCard`) |
| 2 | R | RNahled | Vizuální blok | — | Fialový panel `COLORS.PURPLE` |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | StáhnoutXLSX() | STÁHNOUT XLSX | Otevře [G037](#gui-G037), pak generuje přes `POST /command-posts/{id}:generate-cis-matrix` | [UC017](02_use_case_model.md#uc-UC017) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G037](#gui-G037) | Možnosti CIS matice |

---

<a id="gui-G030"></a>
## «Form modal» Vytvoření MV

Modální dialog pro vytvoření nové karty MV. Source: `/coco/web-app/src/content/post/CommandPostCreateDialog.tsx`. Endpoint: `POST /command-posts` (DTO `CommandPostCreateDto`). Šířka `maxWidth: sm`.

> **Verze: RQU002** – nová třída, řeší otevřenou otázku **„Workflow vytvoření nové karty MV"**. Dialog je **jednoduchý** (3 pole), ne wizard; po uložení následuje navigace na detail nové karty, kde uživatel vyplňuje [G015](#gui-G015) Specifikaci.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vytvořit místo velení" (i18n `commandPost:createCommandPost`) |
| 2 | E | ELOV | **Typ místa velení** | commandPostType | Povinné `*`; LOV `GET /command-posts/types` (sortováno podle labelu) |
| 3 | E | EText | **Název** | name | Povinné `*`; `text256_T` |
| 4 | E | EDlouhyText | Popis | description | Textarea (5 řádků) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | Vytvoří MV (`POST /command-posts`), po úspěchu uzavře dialog a invaliduje cache | [UC018](02_use_case_model.md#uc-UC018) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC018](02_use_case_model.md#uc-UC018) |

### Validace

| ID | Pravidlo | Implementace |
|---|---|---|
| V-G030-1 | Název nesmí být prázdný | `isFormValid` |
| V-G030-2 | Typ MV musí být zvolen | `isFormValid` |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Místo velení](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G031"></a>
## «Form modal» Interakce s MV

Modální dialog správy informačních toků (IER/IP) na MV. Source: `/coco/web-app/src/content/post/interactions/CommandPostInteractionsUpdateDialog.tsx` + `grid/CommandPostInteractionDataGrid.tsx`. Endpoint update: `PATCH /command-posts/{id}/interactions`. Graf interakcí se načítá přes `POST /command-posts/interactions:search-graph` (DTO `CommandPostInteractionsFilterDto` s `includeIps` (vždy true), `includeBasAndBps`, `includeTins`, `includeAppsAndDevices`). Šířka `maxWidth: false` (full screen).

Tři režimy provozu (řízeno propsy `isIer`, `fetchInteractions`, `showAlsoUnassigned`):
- **IER editace** – `isIer=true, fetchInteractions=true` (z dlaždice [G022](#gui-G022)) – IER-rooted strom, editovatelný.
- **IP zobrazení** – `isIer=false, fetchInteractions=true` (z dlaždice [G023](#gui-G023)) – IP-rooted strom (IP → IER, 2 úrovně), **read-only** (stavové checkboxy disabled, bez tlačítka Uložit).
- **Přidání IP / IER** – `isIer=true, showAlsoUnassigned=true, initExpandDataGridTree=true` (přes [G032](#gui-G032)/[G033](#gui-G033)/[G035](#gui-G035)) – IER-rooted strom s předzapnutými filtry BA/BP a IP.

> **Verze: RQU002** – doplněn **rám gridu** G031 (počet záznamů, 3 filtrační checkboxy typů prvků, vyhledávací pole) – při původním reverse-engineeringu vynechán (zachyceny jen sloupce gridu, ne toolbar nad ním), odhalen revizí prototypu. Atributy 4–8 jsou v reálné aplikaci v JSX bloku `{isIer && …}` → **zobrazují se pouze v IER pohledu**. Viz audit `src/C3HUB/AUDIT-grid-frame-2026-05-20.md` a metodika kap. 3.3.2.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Formulář na správu informačních toků - interakce na místě velení" (i18n `commandPost:commandPostInteractions`) |
| 2 | R | RText | Místo velení | commandPostName | Read-only zobrazení jména MV |
| 3 | R | HText | Počet záznamů | recordCount | „IER (N záznamů)" / „IP (N záznamů)" – N = počet root řádků po filtraci (i18n `RECORDS`) |
| 4 | E | ECheck | Zobrazit Aktivity a Procesy | showBusinessElements | **Jen IER pohled.** Přidá do stromu prvky BA (Business Activity) + BP (Business Process). Default vyp. (zap. v toku Přidat IP/IER) |
| 5 | E | ECheck | Zobrazit Produkty | showInformationProducts | **Jen IER pohled.** Přidá do stromu prvky IP (Information Product). Default vyp. |
| 6 | E | ECheck | Zobrazit zařízení a aplikace | showAppsAndDevices | **Jen IER pohled.** Přidá do stromu CIS aplikace + CIS zařízení. Default vyp. |
| 7 | E | EText | Vyhledat | searchQuery | **Jen IER pohled.** Klient-side filtr; hledá v polích `name/nameCz/description/descriptionCz/s5636Identifier`; ponechá celý root-subtree, pokud kterýkoli jeho uzel matchuje |
| 8 | E | EGrid | Grid interakcí | — | Vnořený [G031a](#gui-G031a) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatPodleIER() | + (Add) | Otevře [G032](#gui-G032) výběr IER (jen v `IER editace`) | [UC020a](02_use_case_model.md#uc-UC020a) |
| 2 | NačístData() | Načíst data | Otevře [G034](#gui-G034) import z jiného MV (jen v `IER editace`) | [UC023](02_use_case_model.md#uc-UC023) |
| 3 | FiltrovatTypyPrvků() | — | Checkboxy 4–6 filtrují stereotypy ve stromu (TIN+IER vždy; BA/BP/IP/CIS gated); jen IER pohled | [UC016](02_use_case_model.md#uc-UC016) |
| 4 | Vyhledat() | — | Klient-side filtr stromu; jen IER pohled | [UC016](02_use_case_model.md#uc-UC016) |
| 5 | Uložit() | ULOŽIT | `PATCH /command-posts/{id}/interactions` se změněnými IER/TIN řádky; jen v `IER editace` / `showAlsoUnassigned`; invaliduje role a procedurální instrukce cache | [UC016](02_use_case_model.md#uc-UC016) |
| 6 | Zavřít() | ZAVŘÍT | Zavře (s confirm při neuložených změnách) | [UC016](02_use_case_model.md#uc-UC016) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G031a](#gui-G031a) | Grid interakcí |
| opens | [G032](#gui-G032) | Výběr IER |
| opens | [G034](#gui-G034) | Import z jiného MV |
| dataSource | [Tok IER na MV](04_logicky_model.md#lm-L008) | |
| dataSource | [Tok IP na MV](04_logicky_model.md#lm-L009) | |

---

<a id="gui-G031a"></a>
## «Form grid area» Grid interakcí

Stromový grid (`RTree`) s checkboxy stavu interakce. Source: `/coco/web-app/src/content/post/interactions/grid/CommandPostInteractionDataGrid.tsx`, ColDefs `CommandPostInteractionColumnDefinition.tsx`, transformace grafu `InteractionGraphTransformer.ts`.

> **Verze: RQU002** – sloupce upřesněny dle `CommandPostInteractionColumnDefinition.tsx` (původně dokumentovány jen 3 stavové sloupce + Akce; reálně 9 sloupců vč. Kód/Název/Popis EN+CZ). Popis stromu opraven: strom je **dynamicky rozšiřitelný** přes filtrační checkboxy v [G031](#gui-G031), ne fixní IER→TIN. IP pohled je **IP → IER (2 úrovně)**, ne „IP→IER→TIN" – ověřeno v `InteractionGraphTransformer.convertGraphDtoIpToInteractionRows`.

### Typy prvků ve stromu a hierarchie

**IER pohled** (`isIer=true`) – IER-rooted, dynamicky rozšiřitelný filtry G031:

- **IER** – root (vždy)
- **TIN** – pod IER (vždy)
- **BA** (Business Activity) → **BP** (Business Process) – pod IER, jen při `showBusinessElements`; BA nese vztah `[Konzument]` / `[Poskytovatel]` (suffix `-consumer`/`-provider` na path)
- **IP** (Information Product) – pod IER, jen při `showInformationProducts`
- **CIS_APPLICATION**, **CIS_DEVICE** – pod TIN, jen při `showAppsAndDevices`

Hierarchie: `IER → [BA→BP], [IP], [TIN→CIS aplikace/zařízení]`.

**IP pohled** (`isIer=false`) – `IP → IER` (2 úrovně). Filtrační checkboxy ani vyhledávání se nezobrazují; grid je read-only.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Viz Operace; min šířka 80 px |
| 2 | R | RTree | Kód (strom) | TREE_DATA_GROUP_FIELD | Group field – identifikátor prvku; u BA suffix `[Konzument]`/`[Poskytovatel]` (`formatIdentifierWithRelationType`) |
| 3 | R | RText | Název (Anglický) | name | `ElementDto.name` |
| 4 | R | RText | Název | nameCz | `ElementDto.nameCz` |
| 5 | R | RDlouhyText | Popis (Anglický) | description | `ElementDto.description` |
| 6 | R | RDlouhyText | Popis | descriptionCz | `ElementDto.descriptionCz` – **skrytý ve výchozím** `columnVisibilityModel` |
| 7 | E | ECheck | Req | req | DTO `state.req`; jen na IER a TIN řádcích; výlučné s Konzument/Poskytovatel |
| 8 | E | ECheck | Konzument | consumer | DTO `state.consumer`; jen na IER a TIN řádcích |
| 9 | E | ECheck | Poskytovatel | provider | DTO `state.provider`; jen na IER a TIN řádcích |

> Stavové checkboxy (7–9) jsou viditelné **pouze na řádcích typu IER a TIN** (`shouldShowControls`). V IP pohledu jsou `disabled` (read-only), pokud není `showAlsoUnassigned`. Vzájemná výlučnost: zaškrtnutí Req zruší Konzument+Poskytovatel; zaškrtnutí Konzument/Poskytovatel zruší Req.

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | ZměnitStav() | — | Toggle req/consumer/provider (na IER/TIN řádcích) | [UC016](02_use_case_model.md#uc-UC016) |
| 2 | UpravitPřeklad() | Detail | Jen IER pohled – otevře ElementDialog (RQU004) pro editaci překladů prvku | — |
| 3 | UpravitInterakceIER() | Upravit | Jen IP pohled, na IER řádcích – otevře vnořený [G031](#gui-G031) v IER editaci | [UC016](02_use_case_model.md#uc-UC016) |
| 4 | OtevřítGrafSousedství() | — | Otevře graf sousedství prvku v Archirepo na nové záložce | — |
| 5 | RozbalitVšechny() / ZabalitVšechny() | — | Tlačítko v hlavičce sloupce Kód – rozbalí/sbalí celý strom | [UC016](02_use_case_model.md#uc-UC016) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Tok IER na MV](04_logicky_model.md#lm-L008) | |
| dataSource | [Tok IP na MV](04_logicky_model.md#lm-L009) | |

---

<a id="gui-G032"></a>
## «Form modal» Výběr IER

Modální dialog pro výběr existujícího IER z modelu SVŘ. Source: `/coco/web-app/src/content/post/interactions/IerSelectionDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vyberte Infotoky (IER)" (i18n `commandPost:selectIers`) |
| 2 | E | EText | Vyhledat | searchQuery | |
| 3 | E | EGrid | Tabulka IER | — | Z modelu SVŘ s vyloučenými již přiřazenými |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | OK | Vrátí zvolené IER do [G031](#gui-G031) | [UC020a](02_use_case_model.md#uc-UC020a) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | RQU004 – IER | Cross-link |

---

<a id="gui-G033"></a>
## «Form modal» Výběr IP

Modální dialog pro výběr existujícího IP z modelu SVŘ. Source: `/coco/web-app/src/content/post/interactions/IpSelectionDialog.tsx`. Po výběru IP systém pomocí `POST /model/information-products/{ipId}:search-information-exchange-requirements` zjistí související IER a otevře [G031](#gui-G031).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vyberte Informační produkty (IP)" (i18n `commandPost:selectIps`) |
| 2 | E | EGrid | Tabulka IP | — | Z modelu SVŘ |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | OK | Najde IER pro vybrané IP a otevře [G031](#gui-G031) | [UC020b](02_use_case_model.md#uc-UC020b) |

### Alternativní stavy

| ID | Podmínka | Reakce |
|---|---|---|
| A-G033-1 | Pro vybrané IP nebyly nalezeny IER | Info snackbar „Pro vybrané IP nebyly nalezeny žádné IER" (i18n `commandPost:noIersFoundForSelectedIps`) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | RQU004 – IP | Cross-link |

---

<a id="gui-G034"></a>
## «Form modal» Import interakcí z jiného MV

Modální dialog umožňující načíst (importovat) interakce z jiného MV jako šablonu. Source: `/coco/web-app/src/content/post/interactions/CommandPostInteractionsImportDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Načíst data z jiného místa velení" (i18n `commandPost:loadDataFromAnotherCommandPost`) |
| 2 | E | ELOV | Vyberte MV | sourceCommandPost | Dropdown s místy velení (vyjma aktuální) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Načíst() | Načíst data | Načte graf interakcí zdrojového MV a sloučí přes `CommandPostInteractionMergeTool` | [UC023](02_use_case_model.md#uc-UC023) |

### Alternativní stavy

| ID | Podmínka | Reakce |
|---|---|---|
| A-G034-1 | Zdrojové MV nemá žádné interakce | Snackbar „Zvolené místo velení nemá nastavené žádné interakce. Pro import tedy nejsou k dispozici žádná data." |

---

<a id="gui-G035"></a>
## «Form modal» Výběr procedurální instrukce

Modální dialog pro výběr **FMN procedurální instrukce** při akci „+ Přidat podle FMN instrukce" v sekci G024. Source: `/coco/web-app/src/content/post/interactions/ProceduralInstructionSelectionDialog.tsx`. Po výběru se najdou IER podle PI (`/model/procedural-instructions/.../iers`) a otevře se [G031](#gui-G031).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vyberte procedurální instrukci" (i18n `commandPost:selectProceduralInstruction`) |
| 2 | E | EGrid | Tabulka procedurálních instrukcí | — | |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | OK | Najde IER pro PI a otevře [G031](#gui-G031) | [UC020c](02_use_case_model.md#uc-UC020c) |

### Alternativní stavy

| ID | Podmínka | Reakce |
|---|---|---|
| A-G035-1 | Pro vybranou procedurální instrukci nebyly nalezeny IER | Info snackbar „Pro vybranou instrukci nebyly nalezeny IER" (i18n `commandPost:noIersFoundForSelectedInstruction`); dialog [G031](#gui-G031) se neotevře. Viz [A-UC020c-1](02_use_case_model.md#uc-UC020c). |

> **Verze: RQU002** – doplněn alternativní stav A-G035-1 (PI bez navázaných IER) – analogie k A-G033-1 u výběru IP. Vazba na UC přesměrována na [UC020c](02_use_case_model.md#uc-UC020c) (split UC020).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | RQU006/RQU007 – Procedurální instrukce | Cross-link |

---

<a id="gui-G036"></a>
## «Form modal» Možnosti reportu MV

Modální dialog volby parametrů reportu karty MV (PDF). Source: `/coco/web-app/src/content/post/report/CommandPostReportOptionsDialog.tsx`. Po potvrzení: `POST /command-posts/{id}:generate-command-post-report`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Možnosti reportu místa velení" (i18n `commandPost:commandPostReportOptions`) |
| 2 | E | ELOV | Jazyk | language | LOV: čeština / angličtina |
| 3 | E | ELOV | Varianta | reportVariant | LOV: BASIC (Základní) / COMPLETE (Kompletní); DTO konstanta `variantOptions` |
| 4 | E | ELOV | Klasifikace | reportClassification | LOV: OFFICIAL (Pro služební potřebu) / RESTRICTED (Vyhrazené); DTO konstanta `classificationOptions` |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | STÁHNOUT PDF | Generuje + stahne PDF | [UC017](02_use_case_model.md#uc-UC017), [UC021](02_use_case_model.md#uc-UC021) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | — |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Export karty MV](04_logicky_model.md#lm-L011) | (navrhované) |

---

<a id="gui-G037"></a>
## «Form modal» Možnosti CIS matice

Modální dialog volby parametrů CIS matice (XLSX). Source: `/coco/web-app/src/content/post/report/CisMatrixReportOptionsDialog.tsx`. Po potvrzení: `POST /command-posts/{id}:generate-cis-matrix`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Možnosti reportu CIS matice" (i18n `commandPost:cisMatrixReportOptions`) |
| 2 | E | ELOV | Jazyk | language | |
| 3 | E | ELOV | Klasifikace | reportClassification | LOV: OFFICIAL / RESTRICTED |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | STÁHNOUT XLSX | Generuje + stahne XLSX | [UC022](02_use_case_model.md#uc-UC022) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | — |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Export karty MV](04_logicky_model.md#lm-L011) | (navrhované) |

---

<a id="gui-G038"></a>
## «Form modal» Přidat / Upravit pozici

Modální dialog vytvoření nebo úpravy pozice v rámci [G017](#gui-G017). Source: `/coco/web-app/src/content/post/structure/CommandPositionCreateDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Přidat pozici" nebo „Upravit pozici" (i18n) |
| 2 | E | EText | **Název pozice** | positionName | Povinné `*`; unikátní v rámci MV |
| 3 | E | EText | Osoba | personName | Volný text (legacy display name) |
| 4 | E | ERadio | Režim rolí | roleDataMode | Radio: **Role reprezentované na MV** / **Role na MV bez přiřazené pozice** / **Všechny role** |
| 5 | E | EText | Vyhledat | searchTerm | Vyhledává v `name` a `s5636Identifier` rolí |
| 6 | E | EGrid | Tabulka rolí | — | Vnořený [G038a](#gui-G038a) s checkbox selection |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Přidat() / Upravit() | PŘIDAT / UPRAVIT | Validuje, vrátí pozici + role do [G017](#gui-G017) | [UC014](02_use_case_model.md#uc-UC014) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | — |

### Validace

| ID | Pravidlo | Implementace |
|---|---|---|
| V-G038-1 | Název pozice je povinný | `validatePositionName` |
| V-G038-2 | Název pozice musí být unikátní v rámci MV | `validatePositionName` |
| V-G038-3 | Musí být zvolena aspoň jedna role | tlačítko Přidat disabled |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G038a](#gui-G038a) | Grid rolí |
| dataSource | [Pozice na MV](04_logicky_model.md#lm-L006) | |
| dataSource | [Přiřazení role k pozici](04_logicky_model.md#lm-L013) | |

---

<a id="gui-G038a"></a>
## «Form grid area» Grid rolí

Tabulka rolí v dialogu [G038](#gui-G038) s checkbox selection. ColDefs: `/coco/web-app/src/content/post/RoleDataGridColDefs.tsx`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | ECheck | Výběr | selection | Checkbox per row (multi-select) |
| 2 | R | RText | Kód role | s5636Identifier | |
| 3 | R | RText | Název role | name | |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OznačitRole() | — | Toggle role selection | [UC014](02_use_case_model.md#uc-UC014) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | RQU004 / RIV – Role | Cross-link |
