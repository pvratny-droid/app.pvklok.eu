# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **Alias** = technický identifikátor převzatý ze zdrojového kódu (název komponenty / DTO pole).
- **Rám gridu** = počet záznamů, vyhledávání, filtry a akce nad gridem; dokumentuje se vedle sloupců (viz metodika kap. 3.3.2).

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Model (rozcestník) | modelPage | «Form» |
| └ [G002](#gui-G002) | Dlaždice stereotypu | modelCard | «Form multi area» |
| [G003](#gui-G003) | Přehled prvků stereotypu | modelElementsPage | «Form» |
| └ [G004](#gui-G004) | Tabulka prvků | elementsTable | «Form grid area» |
| [G005](#gui-G005) | Všechny prvky modelu | allModelElementsPage | «Form» |
| [G006](#gui-G006) | Vytvoření prvku | createElementDialog | «Form modal» |
| └ [G016](#gui-G016) | Obsah prvku | elementContent | «Form area» |
| [G007](#gui-G007) | Editace překladů prvku | elementDialog | «Form modal» |
| [G008](#gui-G008) | Vztahy prvku | relationshipPatchRequestDialog | «Form modal» |
| └ [G008a](#gui-G008a) | Panel vztahů prvku | modelElementRelationshipPanel | «Form grid area» |
| [G009](#gui-G009) | Vytvoření vztahu | modelElementRelationshipCreateDialog | «Form modal» |
| [G015](#gui-G015) | Souhrn plánovaných změn | relationshipPatchRequestSummaryDialog | «Form modal» |
| [G010](#gui-G010) | Duplikace prvku | duplicateElementDialog | «Form modal» |
| [G011](#gui-G011) | Relevantní MV pro MCA schopnost | capabilityCommandPostsDialog | «Form modal» |
| └ [G011a](#gui-G011a) | Tabulka relevantních MV | capabilityCommandPostsTable | «Form grid area» |
| [G012](#gui-G012) | Patch Requesty (přehled) | relationshipPatchRequestsPage | «Form» |
| └ [G012a](#gui-G012a) | Tabulka patch requestů | patchRequestsTable | «Form grid area» |
| [G013](#gui-G013) | Detail patch requestu | relationshipPatchRequestDetailDialog | «Form modal» |
| [G014](#gui-G014) | Metamodel (referenční dokumentace) | metamodelPage | «Form» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

> **Verze: RQU004** – revize GUI modelu proti zdrojovým kódům COCO. Doplněny tři dříve nezachycené třídy: [G016](#gui-G016) Obsah prvku (sdílený `ElementContent`), [G015](#gui-G015) Souhrn plánovaných změn (`RelationshipPatchRequestSummaryDialog`) a [G011a](#gui-G011a) Tabulka relevantních MV. Třídy G004, G006–G013 opraveny dle skutečné implementace – viz poznámky Verze u jednotlivých tříd.

---

<a id="gui-G001"></a>
## «Form» Model (rozcestník)

Úvodní stránka modulu Model. URL: `/web/model`. Source: `/coco/web-app/src/content/model/ModelPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Model" (i18n `ModelTranslKey.MODEL_LABEL`) |
| 2 | R | RPanel | Hlavní modely | mainPanel | Panel s 9 dlaždicemi hlavních stereotypů (MCA, IER, Role, BP, BA, IP, TIN, PI, ORG) |
| 3 | R | RPanel | Katalog služeb | serviceCatalogPanel | Panel se 4 dlaždicemi (SRV, APL, CISAPP, CISDEV) |
| 4 | R | RPanel | Ostatní | otherPanel | Panel s dlaždicemi Metamodel a Patch Requesty |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OtevřítPřehledStereotypu() | — | Klik na dlaždici → naviguje na `/web/model/{stereotype}` | [UC001](02_use_case_model.md#uc-UC001), [UC002](02_use_case_model.md#uc-UC002) |
| 2 | Vyhledat() | VYHLEDAT | Akce v záhlaví panelu „Hlavní modely" → naviguje na `/web/model/all` | [UC003](02_use_case_model.md#uc-UC003) |
| 3 | OtevřítMetamodel() | — | Dlaždice Metamodel → naviguje na `/web/model/metamodel` | [UC012](02_use_case_model.md#uc-UC012) |
| 4 | OtevřítPatchRequesty() | — | Dlaždice Patch Requesty → naviguje na `/web/model/patch-requests` | [UC008](02_use_case_model.md#uc-UC008) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Dlaždice (15× = 9 hlavních + 4 služby + 2 ostatní) |
| navigates | [G003](#gui-G003) | Přehled prvků stereotypu |
| navigates | [G005](#gui-G005) | Všechny prvky modelu |
| navigates | [G012](#gui-G012) | Patch Requesty |
| navigates | [G014](#gui-G014) | Metamodel |

---

<a id="gui-G002"></a>
## «Form multi area» Dlaždice stereotypu

Jedna dlaždice pro stereotyp / kategorii v ModelPage. Source: `/coco/web-app/src/component/card/CocoSimpleCard.tsx` + data v `ModelCardData.ts`, `ServiceCatalogData.ts`, `OtherCardData.ts`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název stereotypu | title | např. „MCA schopnost", „IER", „Role" |
| 2 | R | RPriznak | Barevný blok | color | Identifikace stereotypu barvou (`showColorBlock`) |
| 3 | R | RDlouhyText | Popis | description | Krátký popis stereotypu / kategorie |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zobrazit() | ZOBRAZIT | Naviguje na seznam prvků daného stereotypu (tlačítko i klik na dlaždici) | [UC001](02_use_case_model.md#uc-UC001), [UC002](02_use_case_model.md#uc-UC002) |

---

<a id="gui-G003"></a>
## «Form» Přehled prvků stereotypu

Stránka se seznamem prvků jednoho stereotypu. URL: `/web/model/{stereotype}`. Source: `/coco/web-app/src/content/model/ModelElementsPage.tsx`. Otevře se kliknutím na dlaždici v [G001](#gui-G001).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → {Stereotyp} |
| 2 | H | HText | Nadpis | title | Název stereotypu (`CocoPaper` title) |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G004](#gui-G004) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatPrvek() | + Přidat | Akce v rámu tabulky [G004](#gui-G004); otevře [G006](#gui-G006) – jen pro editovatelné stereotypy | [UC004](02_use_case_model.md#uc-UC004) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Pro **read-only stereotypy** (`INFRASTRUCTURE_SERVICE`, `APPLICATION_SERVICE`) není akce Přidat dostupná a je zakázána i editace vztahů a duplikace. |
| 2 | Pro **MCA Schopnost** a **Procedurální instrukci** je akce Přidat dostupná, ale editace vztahů zakázána (`isEditRelationshipsEnabled = false`). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G004](#gui-G004) | Tabulka prvků |
| opens | [G006](#gui-G006) | Vytvoření prvku |
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | Filtrováno podle stereotypu |

---

<a id="gui-G004"></a>
## «Form grid area» Tabulka prvků

Sdílená tabulka prvků v [G003](#gui-G003) i [G005](#gui-G005). Source: `/coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx`.

**Rám gridu:**

- **Vyhledávací pole** (`SearchFilter`) nad tabulkou – klient-side filtr (`ElementFilterService`) napříč poli `name` / `nameCz` / `s5636Identifier` / `description`; placeholder „Hledat v prvcích".
- **Akce + Přidat** v action-stacku gridu – jen na [G003](#gui-G003) pro editovatelné stereotypy (`CocoTableAction`); na [G005](#gui-G005) chybí.
- Standardní footer MUI DataGridu (řazení, stránkování, počet řádků).
- Sloupec **Identifikátor** je ve výchozím stavu skrytý (`columnVisibilityModel`).

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | 5 řádkových akcí (viz Operace); šířka min. 160 px |
| 2 | R | RText | Kód | s5636Identifier | `CisElementIdentifierFormatter.formatIdentifier` |
| 3 | R | RText | Název EN | name | `ElementNameFormatter.formatName` |
| 4 | R | RText | Název CZ | nameCz | DTO `nameCz` |
| 5 | R | RLOV | Stav překladu | translationStatus | `ElementTranslationStatusFormatter` – 3 stavy (AI_TRANSLATED / UPDATED / APPROVED) |
| 6 | R | RText | Identifikátor | id | DTO `id`; ve výchozím stavu skrytý |

### Operace (řádkové akce)

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | UpravitPřeklad() | Translate ikona | vždy | Otevře [G007](#gui-G007); též dvojklik na řádek | [UC006](02_use_case_model.md#uc-UC006) |
| 2 | UpravitVztahy() | Share ikona | `isEditRelationshipsEnabled` | Otevře [G008](#gui-G008) | [UC007](02_use_case_model.md#uc-UC007) |
| 3 | OtevřítSousedství() | GPS ikona | vždy | Otevře externí ArchiRepo URL na nové záložce | [UC010](02_use_case_model.md#uc-UC010) |
| 4 | RelevantníMV() | HolidayVillage ikona | `isRelevantCommandPostsEnabled` (jen MCA Schopnost) | Otevře [G011](#gui-G011) | [UC011](02_use_case_model.md#uc-UC011) |
| 5 | Duplikovat() | ContentCopy ikona | `isDuplicateEnabled` | Otevře [G010](#gui-G010) | [UC005](02_use_case_model.md#uc-UC005) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | |
| opens | [G007](#gui-G007) | Editace překladů |
| opens | [G008](#gui-G008) | Vztahy prvku |
| opens | [G010](#gui-G010) | Duplikace prvku |
| opens | [G011](#gui-G011) | Relevantní MV |

> **Verze: RQU004** – „Vyhledat" přesunut ze sloupců gridu do **rámu gridu** (je to `SearchFilter` nad tabulkou, ne sloupec). Doplněna akce **+ Přidat** v rámu gridu. Pořadí řádkových akcí srovnáno se zdrojem (`renderActionCell`).

---

<a id="gui-G005"></a>
## «Form» Všechny prvky modelu

Stránka s nezfiltrovaným seznamem všech prvků napříč stereotypy. URL: `/web/model/all`. Source: `/coco/web-app/src/content/model/AllModelElementsPage.tsx`. Sdílí grid [G004](#gui-G004) bez akce Přidat (předává se přes `ModelElementsPage` bez `modelStereotype`).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → Vyhledat |
| 2 | H | HText | Nadpis | title | „Vyhledat" (i18n `CommonTranslKey.SEARCH`) |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G004](#gui-G004) |

### Operace

žádné nad rámec gridu – vyhledávání probíhá ve vyhledávacím poli rámu [G004](#gui-G004).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G004](#gui-G004) | Sdílená tabulka (bez akce Přidat) |
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | Bez filtru stereotypu |

---

<a id="gui-G006"></a>
## «Form modal» Vytvoření prvku

Modální dialog pro návrh založení nového prvku daného stereotypu. Source: `/coco/web-app/src/content/model/stereotype/element/CreateElementDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vytvořit nový prvek" (i18n `CREATE_NEW_ELEMENT`) |
| 2 | E | EArea | Obsah prvku | — | Vnořený [G016](#gui-G016) – pole prvku + panel vztahů |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | `createRelationshipPatchRequest` – nový prvek v `elementsToCreate`; disabled bez Názvu EN (a bez Kódu země u CIS) | [UC004](02_use_case_model.md#uc-UC004) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC004](02_use_case_model.md#uc-UC004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G016](#gui-G016) | Obsah prvku |
| produces | [Patch Request](04_logicky_model.md#lm-L020) | Nový PR (`elementsToCreate`) po VYTVOŘIT |

> **Verze: RQU004** – opraveno dle `CreateElementDialog.tsx`. Tlačítko VYTVOŘIT volá `createRelationshipPatchRequest` (ne neexistující `POST /model/elements`) – prvek vzniká přes schvalovací workflow. Obsah dialogu je sdílená komponenta `ElementContent` ([G016](#gui-G016)) včetně panelu vztahů; samostatné výčty polí nahrazeny odkazem na G016.

---

<a id="gui-G016"></a>
## «Form area» Obsah prvku

Sdílený obsah dialogů [Vytvoření prvku (G006)](#gui-G006) a [Duplikace prvku (G010)](#gui-G010). Source: `/coco/web-app/src/content/model/relationship/dialog/ElementContent.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RText | Identifikátor | id | Vygenerované ID; read-only, s ikonou kopírování do schránky |
| 2 | E | ELOV | Kód země | countryCode | `FlagSelectField`; zobrazen a **povinný** jen pro CIS Aplikace / CIS Zařízení |
| 3 | E | EText | **Název EN** | name | Povinný |
| 4 | E | EText | Název CZ | nameCz | |
| 5 | E | EDlouhyText | Popis EN | description | Textarea (3 řádky) |
| 6 | E | EDlouhyText | Popis CZ | descriptionCz | Textarea (3 řádky) |
| 7 | R | RLOV | Typ | type | ArchiMate typ; read-only (dán stereotypem) |
| 8 | R | RLOV | Stereotyp | stereotype | Read-only |
| 9 | E | EGrid | Panel vztahů | — | Vnořený [G008a](#gui-G008a); v Duplikaci v režimu read-only |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G008a](#gui-G008a) | Panel vztahů prvku |
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G007"></a>
## «Form modal» Editace překladů prvku

Modální dialog pro editaci českého překladu prvku. Source: `/coco/web-app/src/content/model/stereotype/element/ElementDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | Název prvku (`ElementNameFormatter.formatName`) |
| 2 | R | RText | Kód | s5636Identifier | Read-only |
| 3 | R | RText | Identifikátor | id | Read-only |
| 4 | R | RLOV | Typ | type | Read-only |
| 5 | R | RLOV | Stereotyp | stereotype | Read-only |
| 6 | R | RLOV | Stav překladu | translationStatus | Read-only; zobrazeno jen je-li vyplněn |
| 7 | R | RText | Název EN | name | Read-only |
| 8 | E | EText | Název CZ | nameCz | |
| 9 | R | RDlouhyText | Popis EN | description | Read-only (12 řádků) |
| 10 | E | EDlouhyText | Popis CZ | descriptionCz | Textarea (12 řádků) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | `POST /model/elements/{id}:update-translations` se `{nameCz, descriptionCz}` | [UC006](02_use_case_model.md#uc-UC006) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC006](02_use_case_model.md#uc-UC006) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | |

> **Verze: RQU004** – opraveno dle `ElementDialog.tsx`. Odstraněn neexistující přepínač **„Schválit překlad"** (`EPrepinac`) – dialog posílá pouze `nameCz` a `descriptionCz`. Doplněna skutečná sada needitovatelných polí (Kód, Identifikátor, Typ, Stereotyp, Stav překladu, Název EN, Popis EN).

---

<a id="gui-G008"></a>
## «Form modal» Vztahy prvku

Modální dialog pro návrh změny vztahů daného prvku. Source: `/coco/web-app/src/content/model/relationship/RelationshipPatchRequestDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | Název prvku (`ElementNameFormatter.formatName`) |
| 2 | R | RText | Název EN | name | Read-only |
| 3 | R | RText | Kód | s5636Identifier | Read-only |
| 4 | R | RLOV | Typ | type | Read-only |
| 5 | R | RLOV | Stereotyp | stereotype | Read-only |
| 6 | E | EGrid | Panel vztahů | — | Vnořený [G008a](#gui-G008a) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OdeslatŽádost() | ODESLAT KE SCHVÁLENÍ | Otevře souhrnný dialog [G015](#gui-G015); disabled, pokud nejsou žádné změny | [UC007](02_use_case_model.md#uc-UC007) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC007](02_use_case_model.md#uc-UC007) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G008a](#gui-G008a) | Panel vztahů prvku |
| opens | [G015](#gui-G015) | Souhrn plánovaných změn |
| dataSource | [Vztah](04_logicky_model.md#lm-L019) | `GET /model/elements/{id}/relationships` |
| produces | [Patch Request](04_logicky_model.md#lm-L020) | Nový PR po potvrzení v G015 |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDialog.tsx`. Hlavička obsahuje 4 needitovatelná pole prvku (ne „Referenční prvek"). Akce **+ (Přidat vztah)** je součástí rámu panelu [G008a](#gui-G008a), ne samostatným atributem dialogu. Tlačítko ODESLAT KE SCHVÁLENÍ neotevírá přímo POST, ale **souhrnný dialog [G015](#gui-G015)**.

---

<a id="gui-G008a"></a>
## «Form grid area» Panel vztahů prvku

Sdílený **záložkový panel vztahů**. Source: `/coco/web-app/src/content/model/relationship/ModelElementRelationshipPanel.tsx` + tabulka `relationship/table/ModelElementRelationshipTable.tsx`. Použit v [G008](#gui-G008) Vztahy prvku, [G016](#gui-G016) Obsah prvku (vytvoření / duplikace) a [G013](#gui-G013) Detail patch requestu.

**Rám gridu:**

- **Záložkový pruh** (`Tabs`) – jedna záložka na povolenou dvojici stereotypů (`StereotypeRelationshipMetamodel`) přípustnou pro stereotyp referenčního prvku. Každá záložka nese **počítadlo** (badge) vztahů. **Aktivní záložka určuje, které vztahy grid zobrazuje** a zároveň typ + cílový stereotyp pro nově přidaný vztah.
- **Akce + (Přidat)** v action-stacku gridu – otevře [G009](#gui-G009); skryta v read-only režimu (Duplikace prvku).
- Standardní footer MUI DataGridu.
- Sloupec **Identifikátor** je ve výchozím stavu skrytý (`columnVisibilityModel`).

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Označit k odstranění / vrátit (jen v editovatelném režimu) |
| 2 | R | RText | Prvek | secondElementName | Název druhého prvku vztahu; nové prvky vizuálně odlišeny (`ElementNameCell isNew`) |
| 3 | R | RText | Kód | secondElementS5636Identifier | Kód S5636 druhého prvku |
| 4 | R | RPriznak | Směr | direction | Ikona šipky – příchozí / odchozí vztah (`DirectionCell`) |
| 5 | R | RLOV | Typ vztahu | type | `RelationshipTypeFormatter`; 9 typů ArchiMate vztahů |
| 6 | R | RText | Identifikátor | id | ID druhého prvku; ve výchozím stavu skrytý |

> Stav řádku **není samostatný sloupec** – řádky se barevně odlišují přes `getRowClassName`: zelená = vztah k přidání, červená = vztah k odstranění.

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatVztah() | + | Akce v rámu gridu; otevře [G009](#gui-G009) – aktivní záložka určuje typ vztahu | [UC007](02_use_case_model.md#uc-UC007) |
| 2 | OznačitKOdstranění() | — | Toggle: existující vztah označí jako `toDelete` / zruší označení; nově přidaný vztah odebere ze seznamu | [UC007](02_use_case_model.md#uc-UC007) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G009](#gui-G009) | Vytvoření vztahu |
| dataSource | [Vztah](04_logicky_model.md#lm-L019) | |

> **Verze: RQU004** – přepracováno dle `ModelElementRelationshipPanel.tsx` a `ModelElementRelationshipTable.tsx`. Doplněn **záložkový pruh** (filtr měnící, které vztahy grid zobrazuje – slepé místo reverse-engineeringu, viz metodika kap. 3.3.2). Sloupce opraveny: reálně Prvek + Kód + Směr + Typ vztahu (ne „Zdrojový/Cílový prvek"); stav řádku je barva, ne sloupec.

---

<a id="gui-G009"></a>
## «Form modal» Vytvoření vztahu

Modální dialog pro přidání nového vztahu. Source: `/coco/web-app/src/content/model/relationship/create/ModelElementRelationshipCreateDialog.tsx` (+ `ExistingElementForm.tsx`, `NewElementForm.tsx`).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vytvořit vztah" (i18n `CREATE_RELATIONSHIP`) |
| 2 | E | EPrepinac | Režim výběru | selectionMode | Radio: „Vybrat existující prvek" / „Vytvořit nový prvek"; výchozí = existující |
| 3 | E | ELOV | **Prvek** | selectedElement | *(režim Existující)* Výběr z prvků cílového stereotypu; label `{Kód} - {Název}` |
| 4 | R | RText | Identifikátor | id | *(režim Nový)* Vygenerované ID; read-only, s kopírováním |
| 5 | E | EText | **Název prvku** | name | *(režim Nový)* Povinný |
| 6 | E | EDlouhyText | Popis | description | *(režim Nový)* Textarea (4 řádky) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | Přidá vztah do aktivní záložky [G008a](#gui-G008a) (`toAdd`); nový prvek navíc do `elementsToCreate`; disabled při neplatném formuláři | [UC007](02_use_case_model.md#uc-UC007) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC007](02_use_case_model.md#uc-UC007) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | **Typ vztahu a cílový stereotyp se v dialogu nevybírají** – jsou dány aktivní záložkou panelu [G008a](#gui-G008a) (`relationshipMetamodel`). |
| 2 | Pole 3 vs. 4–6 se zobrazují podle režimu výběru (atribut 2). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | Výběr existujícího nebo definice nového prvku |

> **Verze: RQU004** – přepracováno dle `ModelElementRelationshipCreateDialog.tsx`. Dialog nemá 3 ELOV pole (Typ/Zdroj/Cíl) – má **přepínač Existující/Nový prvek**; typ vztahu je dán aktivní záložkou panelu vztahů.

---

<a id="gui-G015"></a>
## «Form modal» Souhrn plánovaných změn

Modální potvrzovací dialog se souhrnem navržených změn vztahů před odesláním Patch Requestu. Source: `/coco/web-app/src/content/model/relationship/summary/RelationshipPatchRequestSummaryDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Seznam plánovaných změn" (i18n `LIST_OF_PLANNED_CHANGES`) |
| 2 | R | RText | Sekce „Vztahy k přidání" | — | Nadpis sekce |
| 3 | R | RGrid | Tabulka vztahů k přidání | toAdd | `BasicRelationshipTable`, zeleně; sloupce Prvek, Kód, Směr, Typ vztahu |
| 4 | R | RText | Sekce „Vztahy k odstranění" | — | Nadpis sekce |
| 5 | R | RGrid | Tabulka vztahů k odstranění | toDelete | `BasicRelationshipTable`, červeně; stejné sloupce |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Odeslat() | ODESLAT KE SCHVÁLENÍ | Potvrdí souhrn → `POST /model/relationships/patch-requests`; vznikne PR ve stavu REQUESTED | [UC007](02_use_case_model.md#uc-UC007) |
| 2 | ZpětKEditaci() | ZPĚT K EDITACI | Zavře souhrn, návrat do [G008](#gui-G008) | [UC007](02_use_case_model.md#uc-UC007) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Vztah](04_logicky_model.md#lm-L019) | Náhledové tabulky toAdd / toDelete (read-only) |
| produces | [Patch Request](04_logicky_model.md#lm-L020) | Po ODESLAT KE SCHVÁLENÍ |

> **Verze: RQU004** – nová třída doplněná revizí. Dialog se v původní analýze nevyskytoval, ač je krokem mezi „ODESLAT KE SCHVÁLENÍ" v [G008](#gui-G008) a vlastním POST.

---

<a id="gui-G010"></a>
## «Form modal» Duplikace prvku

Modální dialog pro návrh kopie existujícího prvku. Source: `/coco/web-app/src/content/model/stereotype/element/duplicate/DuplicateElementDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Duplikovat prvek : {název originálu}" |
| 2 | E | EArea | Obsah prvku | — | Vnořený [G016](#gui-G016); předvyplněno z originálu, panel vztahů **read-only** (vztahy originálu se přebírají) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Duplikovat() | DUPLIKOVAT | `createRelationshipPatchRequest` – kopie v `elementsToCreate`, převzaté vztahy v `toAdd` | [UC005](02_use_case_model.md#uc-UC005) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC005](02_use_case_model.md#uc-UC005) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G016](#gui-G016) | Obsah prvku (panel vztahů read-only) |
| produces | [Patch Request](04_logicky_model.md#lm-L020) | Nový PR po DUPLIKOVAT |

> **Verze: RQU004** – opraveno dle `DuplicateElementDialog.tsx`. Tlačítko DUPLIKOVAT volá `createRelationshipPatchRequest` (ne přímou kopii s novým UUID). Obsah dialogu je sdílená komponenta `ElementContent` ([G016](#gui-G016)); doplněno přebírání vztahů originálu.

---

<a id="gui-G011"></a>
## «Form modal» Relevantní MV pro MCA schopnost

Modální dialog s tabulkou míst velení, která deklarují podporu dané MCA schopnosti. Source: `/coco/web-app/src/content/model/stereotype/element/capability/CapabilityCommandPostsDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Relevantní místa velení" (i18n `RELEVANT_COMMAND_POST`) |
| 2 | E | EGrid | Tabulka MV | — | Vnořený [G011a](#gui-G011a) |

### Operace

žádné – dialog je čistě informativní, zavírá se křížkem / klávesou Esc.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G011a](#gui-G011a) | Tabulka relevantních MV |

> **Verze: RQU004** – opraveno dle `CapabilityCommandPostsDialog.tsx`. Odstraněno neexistující pole „MCA schopnost" (dialog dostává jen `capabilityId`) a operace „OtevřítMV()" (tabulka nemá řádkovou navigaci). Tabulka MV vyčleněna do [G011a](#gui-G011a).

---

<a id="gui-G011a"></a>
## «Form grid area» Tabulka relevantních MV

Vnořená tabulka míst velení v [G011](#gui-G011). Source: `CapabilityCommandPostsDialog.tsx` + `CapabilityCommandPostsDataGridColDefs.tsx`.

**Rám gridu:**

- **Vyhledávací pole** (`SearchFilter`) nad tabulkou – klient-side filtr napříč poli `name` / `s5636Identifier` / typ / úroveň.
- Standardní footer MUI DataGridu.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RText | Kód | s5636Identifier | DTO `s5636Identifier` |
| 2 | R | RText | Název | name | DTO `name` |
| 3 | R | RLOV | Typ MV | type | `findCatalogValueLabel` (číselník typu MV) |
| 4 | R | RLOV | Úroveň | level | `findCatalogValueLabel` (číselník úrovně MV) |

### Operace

žádné – tabulka nemá řádkové akce ani proklik na detail MV.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [RQU002 L005 Schopnost MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L005) | Cross-link – MV deklarující danou schopnost (`useSearchCommandPosts`) |

---

<a id="gui-G012"></a>
## «Form» Patch Requesty (přehled)

Stránka s přehledem patch requestů. URL: `/web/model/patch-requests`. Source: `/coco/web-app/src/content/model/relationship/patchrequest/RelationshipPatchRequestsPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Patch Requesty" (i18n `PATCH_REQUESTS`); sekce `CocoPaper` je sbalitelná |
| 2 | E | EGrid | Tabulka patch requestů | — | Vnořený [G012a](#gui-G012a) |

### Operace

žádné nad rámec gridu – stránka jen zobrazuje tabulku.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G012a](#gui-G012a) | Tabulka patch requestů |
| opens | [G013](#gui-G013) | Detail patch requestu |
| dataSource | [Patch Request](04_logicky_model.md#lm-L020) | |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Odstraněn neexistující **filtr stavu** a **přepínač pohledu „Moje / Všechny"** – rozsah zobrazení je řízen rolí uživatele (`isAdmin`), ne ovládacími prvky stránky.

---

<a id="gui-G012a"></a>
## «Form grid area» Tabulka patch requestů

Vnořená tabulka v [G012](#gui-G012). Source: `RelationshipPatchRequestsPage.tsx` (definice sloupců).

**Rám gridu:**

- Sbalitelná sekce `CocoPaper`; žádné vyhledávání ani filtry.
- Výchozí **řazení dle data vytvoření sestupně** (`requestedAt desc`).
- Standardní footer MUI DataGridu.
- **Rozsah řádků je dán rolí** uživatele: administrátor vidí všechny (`findAllRelationshipPatchRequests`), ostatní jen vlastní (`findMyPatchRequests`).

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Akce Detail (viz Operace) |
| 2 | R | RText | Žadatel | requestedBy | Sloupec se zobrazuje **jen administrátorovi** |
| 3 | R | RDatumCas | Vytvořeno | requestedAt | `DateTimeFormatter.formatDateTime` |
| 4 | R | RLOV | Stav | state | `RelationshipPatchRequestStateFormatter` (REQUESTED / APPROVED / REJECTED) |

### Operace (řádkové akce)

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | OtevřítDetail() | Detail (Feed ikona) | administrátor **a** stav `REQUESTED` | Otevře [G013](#gui-G013); též dvojklik na řádek | [UC008](02_use_case_model.md#uc-UC008), [UC009](02_use_case_model.md#uc-UC009) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Patch Request](04_logicky_model.md#lm-L020) | |
| opens | [G013](#gui-G013) | Detail patch requestu |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Doplněn chybějící výčet operací u sloupce `RAkce` (jediná akce Detail, podmíněná). Sloupce srovnány se zdrojem: odstraněny neexistující „Referenční element", „Uzavřel", „Uzavřeno"; sloupec Žadatel je viditelný jen administrátorovi.

---

<a id="gui-G013"></a>
## «Form modal» Detail patch requestu

Modální dialog s detailem patch requestu pro rozhodnutí (schválení / zamítnutí). Source: `/coco/web-app/src/content/model/relationship/patchrequest/RelationshipPatchRequestDetailDialog.tsx` (+ `RelationshipPatchRequestMetadata.tsx`). Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Detail patch requestu" (i18n `PATCH_REQUEST_DETAIL`) |
| 2 | R | RDatumCas | Datum | requestedAt | Metadata; read-only |
| 3 | R | RLOV | Stav | state | Metadata; read-only |
| 4 | R | RText | Žadatel | requestedBy | Metadata; read-only |
| 5 | R | RText | Prvek | referentialElement | Název referenčního prvku; read-only |
| 6 | E | EGrid | Panel vztahů | — | Vnořený [G008a](#gui-G008a); vztahy referenčního prvku s vyznačenými navrhovanými změnami (přidání zeleně, odebrání červeně). Administrátor je může upravit inline. |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | Potvrdit() | POTVRDIT | administrátor + stav REQUESTED; disabled bez změn | `POST /model/relationships/patch-requests/{id}:approve` s výsledným obsahem (`finalChanges`) | [UC009](02_use_case_model.md#uc-UC009) |
| 2 | Zamítnout() | ZAMÍTNOUT | administrátor + stav REQUESTED | `POST /model/relationships/patch-requests/{id}:reject` | [UC009](02_use_case_model.md#uc-UC009) |
| 3 | Zavřít() | ZAVŘÍT | jinak | Zavře dialog (sekundární tlačítko mimo režim rozhodování) | — |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Tlačítka POTVRDIT / ZAMÍTNOUT jsou dostupná jen administrátorovi a jen pro stav `REQUESTED`. |
| 2 | POTVRDIT je disabled, pokud žádost neobsahuje žádnou změnu (`hasChanges = false`). |
| 3 | Není-li uživatel administrátor nebo stav ≠ REQUESTED, dialog je čistě prohlížecí (jen tlačítko ZAVŘÍT). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G008a](#gui-G008a) | Panel vztahů prvku |
| dataSource | [Patch Request](04_logicky_model.md#lm-L020) | |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDetailDialog.tsx`. Odstraněno neexistující pole „Komentář", tři samostatné EGridy (toAdd/toDelete/elementsToCreate) i operace „Upravit" – obsah je metadata + týž záložkový panel vztahů [G008a](#gui-G008a), úpravy se dělají inline. Tlačítka opravena na POTVRDIT / ZAMÍTNOUT.

---

<a id="gui-G014"></a>
## «Form» Metamodel (referenční dokumentace)

Stránka s obrázky doménového a NATO/FMN metamodelu. URL: `/web/model/metamodel`. Source: `/coco/web-app/src/content/metamodel/MetamodelPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Metamodel" |
| 2 | R | RNahled | Doménový metamodel | image1 | `metamodel.jpg`; ve sbalitelné sekci s popisem |
| 3 | R | RNahled | FMN metamodel | image2 | `metamodelFMN.jpeg`; ve sbalitelné sekci s popisem |

### Operace

žádné – stránka je čistě informativní.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dokumentuje | [Element modelu](04_logicky_model.md#lm-L001), [Vztah](04_logicky_model.md#lm-L019) | Vizuální orientační dokumentace |

> **Verze: RQU004** – opraveno dle `MetamodelPage.tsx`. Stránka renderuje **2 obrázky** (`metamodel.jpg`, `metamodelFMN.jpeg`), ne 3 – soubor `MVACR.jpeg` ve složce existuje, ale komponenta jej nevkládá.
