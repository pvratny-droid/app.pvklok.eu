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
| [G056](#gui-G056) | Model (rozcestník) | modelPage | «Form» |
| └ [G057](#gui-G057) | Dlaždice stereotypu | modelCard | «Form multi area» |
| [G058](#gui-G058) | Přehled prvků stereotypu | modelElementsPage | «Form» |
| └ [G059](#gui-G059) | Tabulka prvků | elementsTable | «Form grid area» |
| [G060](#gui-G060) | Všechny prvky modelu | allModelElementsPage | «Form» |
| [G061](#gui-G061) | Vytvoření prvku | createElementDialog | «Form modal» |
| └ [G071](#gui-G071) | Obsah prvku | elementContent | «Form area» |
| [G062](#gui-G062) | Editace překladů prvku | elementDialog | «Form modal» |
| [G063](#gui-G063) | Vztahy prvku | relationshipPatchRequestDialog | «Form modal» |
| └ [G063a](#gui-G063a) | Panel vztahů prvku | modelElementRelationshipPanel | «Form grid area» |
| [G064](#gui-G064) | Vytvoření vztahu | modelElementRelationshipCreateDialog | «Form modal» |
| [G070](#gui-G070) | Souhrn plánovaných změn | relationshipPatchRequestSummaryDialog | «Form modal» |
| [G065](#gui-G065) | Duplikace prvku | duplicateElementDialog | «Form modal» |
| [G066](#gui-G066) | Relevantní MV pro MCA schopnost | capabilityCommandPostsDialog | «Form modal» |
| └ [G066a](#gui-G066a) | Tabulka relevantních MV | capabilityCommandPostsTable | «Form grid area» |
| [G067](#gui-G067) | Patch Requesty (přehled) | relationshipPatchRequestsPage | «Form» |
| └ [G067a](#gui-G067a) | Tabulka patch requestů | patchRequestsTable | «Form grid area» |
| [G068](#gui-G068) | Detail patch requestu | relationshipPatchRequestDetailDialog | «Form modal» |
| [G069](#gui-G069) | Metamodel (referenční dokumentace) | metamodelPage | «Form» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

> **Verze: RQU004** – revize GUI modelu proti zdrojovým kódům COCO. Doplněny tři dříve nezachycené třídy: [G071](#gui-G071) Obsah prvku (sdílený `ElementContent`), [G070](#gui-G070) Souhrn plánovaných změn (`RelationshipPatchRequestSummaryDialog`) a [G066a](#gui-G066a) Tabulka relevantních MV. Třídy G059, G061–G068 opraveny dle skutečné implementace – viz poznámky Verze u jednotlivých tříd.

---

<a id="gui-G056"></a>
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
| 1 | OtevřítPřehledStereotypu() | — | Klik na dlaždici → naviguje na `/web/model/{stereotype}` | [UC035](02_use_case_model.md#uc-UC035), [UC036](02_use_case_model.md#uc-UC036) |
| 2 | Vyhledat() | VYHLEDAT | Akce v záhlaví panelu „Hlavní modely" → naviguje na `/web/model/all` | [UC037](02_use_case_model.md#uc-UC037) |
| 3 | OtevřítMetamodel() | — | Dlaždice Metamodel → naviguje na `/web/model/metamodel` | [UC046](02_use_case_model.md#uc-UC046) |
| 4 | OtevřítPatchRequesty() | — | Dlaždice Patch Requesty → naviguje na `/web/model/patch-requests` | [UC042](02_use_case_model.md#uc-UC042) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G057](#gui-G057) | Dlaždice (15× = 9 hlavních + 4 služby + 2 ostatní) |
| navigates | [G058](#gui-G058) | Přehled prvků stereotypu |
| navigates | [G060](#gui-G060) | Všechny prvky modelu |
| navigates | [G067](#gui-G067) | Patch Requesty |
| navigates | [G069](#gui-G069) | Metamodel |

---

<a id="gui-G057"></a>
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
| 1 | Zobrazit() | ZOBRAZIT | Naviguje na seznam prvků daného stereotypu (tlačítko i klik na dlaždici) | [UC035](02_use_case_model.md#uc-UC035), [UC036](02_use_case_model.md#uc-UC036) |

---

<a id="gui-G058"></a>
## «Form» Přehled prvků stereotypu

Stránka se seznamem prvků jednoho stereotypu. URL: `/web/model/{stereotype}`. Source: `/coco/web-app/src/content/model/ModelElementsPage.tsx`. Otevře se kliknutím na dlaždici v [G056](#gui-G056).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → {Stereotyp} |
| 2 | H | HText | Nadpis | title | Název stereotypu (`CocoPaper` title) |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G059](#gui-G059) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatPrvek() | + Přidat | Akce v rámu tabulky [G059](#gui-G059); otevře [G061](#gui-G061) – jen pro editovatelné stereotypy | [UC038](02_use_case_model.md#uc-UC038) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Pro **read-only stereotypy** (`INFRASTRUCTURE_SERVICE`, `APPLICATION_SERVICE`) není akce Přidat dostupná a je zakázána i editace vztahů a duplikace. |
| 2 | Pro **MCA Schopnost** a **Procedurální instrukci** je akce Přidat dostupná, ale editace vztahů zakázána (`isEditRelationshipsEnabled = false`). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G059](#gui-G059) | Tabulka prvků |
| opens | [G061](#gui-G061) | Vytvoření prvku |
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | Filtrováno podle stereotypu |

---

<a id="gui-G059"></a>
## «Form grid area» Tabulka prvků

Sdílená tabulka prvků v [G058](#gui-G058) i [G060](#gui-G060). Source: `/coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx`.

**Rám gridu:**

- **Vyhledávací pole** (`SearchFilter`) nad tabulkou – klient-side filtr (`ElementFilterService`) napříč poli `name` / `nameCz` / `s5636Identifier` / `description`; placeholder „Hledat v prvcích".
- **Akce + Přidat** v action-stacku gridu – jen na [G058](#gui-G058) pro editovatelné stereotypy (`CocoTableAction`); na [G060](#gui-G060) chybí.
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
| 1 | UpravitPřeklad() | Translate ikona | vždy | Otevře [G062](#gui-G062); též dvojklik na řádek | [UC040](02_use_case_model.md#uc-UC040) |
| 2 | UpravitVztahy() | Share ikona | `isEditRelationshipsEnabled` | Otevře [G063](#gui-G063) | [UC041](02_use_case_model.md#uc-UC041) |
| 3 | OtevřítSousedství() | GPS ikona | vždy | Otevře externí ArchiRepo URL na nové záložce | [UC044](02_use_case_model.md#uc-UC044) |
| 4 | RelevantníMV() | HolidayVillage ikona | `isRelevantCommandPostsEnabled` (jen MCA Schopnost) | Otevře [G066](#gui-G066) | [UC045](02_use_case_model.md#uc-UC045) |
| 5 | Duplikovat() | ContentCopy ikona | `isDuplicateEnabled` | Otevře [G065](#gui-G065) | [UC039](02_use_case_model.md#uc-UC039) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | |
| opens | [G062](#gui-G062) | Editace překladů |
| opens | [G063](#gui-G063) | Vztahy prvku |
| opens | [G065](#gui-G065) | Duplikace prvku |
| opens | [G066](#gui-G066) | Relevantní MV |

> **Verze: RQU004** – „Vyhledat" přesunut ze sloupců gridu do **rámu gridu** (je to `SearchFilter` nad tabulkou, ne sloupec). Doplněna akce **+ Přidat** v rámu gridu. Pořadí řádkových akcí srovnáno se zdrojem (`renderActionCell`).

---

<a id="gui-G060"></a>
## «Form» Všechny prvky modelu

Stránka s nezfiltrovaným seznamem všech prvků napříč stereotypy. URL: `/web/model/all`. Source: `/coco/web-app/src/content/model/AllModelElementsPage.tsx`. Sdílí grid [G059](#gui-G059) bez akce Přidat (předává se přes `ModelElementsPage` bez `modelStereotype`).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → Vyhledat |
| 2 | H | HText | Nadpis | title | „Vyhledat" (i18n `CommonTranslKey.SEARCH`) |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G059](#gui-G059) |

### Operace

žádné nad rámec gridu – vyhledávání probíhá ve vyhledávacím poli rámu [G059](#gui-G059).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G059](#gui-G059) | Sdílená tabulka (bez akce Přidat) |
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | Bez filtru stereotypu |

---

<a id="gui-G061"></a>
## «Form modal» Vytvoření prvku

Modální dialog pro návrh založení nového prvku daného stereotypu. Source: `/coco/web-app/src/content/model/stereotype/element/CreateElementDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vytvořit nový prvek" (i18n `CREATE_NEW_ELEMENT`) |
| 2 | E | EArea | Obsah prvku | — | Vnořený [G071](#gui-G071) – pole prvku + panel vztahů |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | `createRelationshipPatchRequest` – nový prvek v `elementsToCreate`; disabled bez Názvu EN (a bez Kódu země u CIS) | [UC038](02_use_case_model.md#uc-UC038) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC038](02_use_case_model.md#uc-UC038) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G071](#gui-G071) | Obsah prvku |
| produces | [Patch Request](04_logicky_model.md#lm-L039) | Nový PR (`elementsToCreate`) po VYTVOŘIT |

> **Verze: RQU004** – opraveno dle `CreateElementDialog.tsx`. Tlačítko VYTVOŘIT volá `createRelationshipPatchRequest` (ne neexistující `POST /model/elements`) – prvek vzniká přes schvalovací workflow. Obsah dialogu je sdílená komponenta `ElementContent` ([G071](#gui-G071)) včetně panelu vztahů; samostatné výčty polí nahrazeny odkazem na G071.

---

<a id="gui-G071"></a>
## «Form area» Obsah prvku

Sdílený obsah dialogů [Vytvoření prvku (G061)](#gui-G061) a [Duplikace prvku (G065)](#gui-G065). Source: `/coco/web-app/src/content/model/relationship/dialog/ElementContent.tsx`.

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
| 9 | E | EGrid | Panel vztahů | — | Vnořený [G063a](#gui-G063a); v Duplikaci v režimu read-only |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G063a](#gui-G063a) | Panel vztahů prvku |
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | |

---

<a id="gui-G062"></a>
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
| 1 | Uložit() | ULOŽIT | `POST /model/elements/{id}:update-translations` se `{nameCz, descriptionCz}` | [UC040](02_use_case_model.md#uc-UC040) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC040](02_use_case_model.md#uc-UC040) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | |

> **Verze: RQU004** – opraveno dle `ElementDialog.tsx`. Odstraněn neexistující přepínač **„Schválit překlad"** (`EPrepinac`) – dialog posílá pouze `nameCz` a `descriptionCz`. Doplněna skutečná sada needitovatelných polí (Kód, Identifikátor, Typ, Stereotyp, Stav překladu, Název EN, Popis EN).

---

<a id="gui-G063"></a>
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
| 6 | E | EGrid | Panel vztahů | — | Vnořený [G063a](#gui-G063a) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OdeslatŽádost() | ODESLAT KE SCHVÁLENÍ | Otevře souhrnný dialog [G070](#gui-G070); disabled, pokud nejsou žádné změny | [UC041](02_use_case_model.md#uc-UC041) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC041](02_use_case_model.md#uc-UC041) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G063a](#gui-G063a) | Panel vztahů prvku |
| opens | [G070](#gui-G070) | Souhrn plánovaných změn |
| dataSource | [Vztah](04_logicky_model.md#lm-L038) | `GET /model/elements/{id}/relationships` |
| produces | [Patch Request](04_logicky_model.md#lm-L039) | Nový PR po potvrzení v G070 |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDialog.tsx`. Hlavička obsahuje 4 needitovatelná pole prvku (ne „Referenční prvek"). Akce **+ (Přidat vztah)** je součástí rámu panelu [G063a](#gui-G063a), ne samostatným atributem dialogu. Tlačítko ODESLAT KE SCHVÁLENÍ neotevírá přímo POST, ale **souhrnný dialog [G070](#gui-G070)**.

---

<a id="gui-G063a"></a>
## «Form grid area» Panel vztahů prvku

Sdílený **záložkový panel vztahů**. Source: `/coco/web-app/src/content/model/relationship/ModelElementRelationshipPanel.tsx` + tabulka `relationship/table/ModelElementRelationshipTable.tsx`. Použit v [G063](#gui-G063) Vztahy prvku, [G071](#gui-G071) Obsah prvku (vytvoření / duplikace) a [G068](#gui-G068) Detail patch requestu.

**Rám gridu:**

- **Záložkový pruh** (`Tabs`) – jedna záložka na povolenou dvojici stereotypů (`StereotypeRelationshipMetamodel`) přípustnou pro stereotyp referenčního prvku. Každá záložka nese **počítadlo** (badge) vztahů. **Aktivní záložka určuje, které vztahy grid zobrazuje** a zároveň typ + cílový stereotyp pro nově přidaný vztah.
- **Akce + (Přidat)** v action-stacku gridu – otevře [G064](#gui-G064); skryta v read-only režimu (Duplikace prvku).
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
| 1 | PřidatVztah() | + | Akce v rámu gridu; otevře [G064](#gui-G064) – aktivní záložka určuje typ vztahu | [UC041](02_use_case_model.md#uc-UC041) |
| 2 | OznačitKOdstranění() | — | Toggle: existující vztah označí jako `toDelete` / zruší označení; nově přidaný vztah odebere ze seznamu | [UC041](02_use_case_model.md#uc-UC041) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G064](#gui-G064) | Vytvoření vztahu |
| dataSource | [Vztah](04_logicky_model.md#lm-L038) | |

> **Verze: RQU004** – přepracováno dle `ModelElementRelationshipPanel.tsx` a `ModelElementRelationshipTable.tsx`. Doplněn **záložkový pruh** (filtr měnící, které vztahy grid zobrazuje – slepé místo reverse-engineeringu, viz metodika kap. 3.3.2). Sloupce opraveny: reálně Prvek + Kód + Směr + Typ vztahu (ne „Zdrojový/Cílový prvek"); stav řádku je barva, ne sloupec.

---

<a id="gui-G064"></a>
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
| 1 | Vytvořit() | VYTVOŘIT | Přidá vztah do aktivní záložky [G063a](#gui-G063a) (`toAdd`); nový prvek navíc do `elementsToCreate`; disabled při neplatném formuláři | [UC041](02_use_case_model.md#uc-UC041) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC041](02_use_case_model.md#uc-UC041) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | **Typ vztahu a cílový stereotyp se v dialogu nevybírají** – jsou dány aktivní záložkou panelu [G063a](#gui-G063a) (`relationshipMetamodel`). |
| 2 | Pole 3 vs. 4–6 se zobrazují podle režimu výběru (atribut 2). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L021) | Výběr existujícího nebo definice nového prvku |

> **Verze: RQU004** – přepracováno dle `ModelElementRelationshipCreateDialog.tsx`. Dialog nemá 3 ELOV pole (Typ/Zdroj/Cíl) – má **přepínač Existující/Nový prvek**; typ vztahu je dán aktivní záložkou panelu vztahů.

---

<a id="gui-G070"></a>
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
| 1 | Odeslat() | ODESLAT KE SCHVÁLENÍ | Potvrdí souhrn → `POST /model/relationships/patch-requests`; vznikne PR ve stavu REQUESTED | [UC041](02_use_case_model.md#uc-UC041) |
| 2 | ZpětKEditaci() | ZPĚT K EDITACI | Zavře souhrn, návrat do [G063](#gui-G063) | [UC041](02_use_case_model.md#uc-UC041) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Vztah](04_logicky_model.md#lm-L038) | Náhledové tabulky toAdd / toDelete (read-only) |
| produces | [Patch Request](04_logicky_model.md#lm-L039) | Po ODESLAT KE SCHVÁLENÍ |

> **Verze: RQU004** – nová třída doplněná revizí. Dialog se v původní analýze nevyskytoval, ač je krokem mezi „ODESLAT KE SCHVÁLENÍ" v [G063](#gui-G063) a vlastním POST.

---

<a id="gui-G065"></a>
## «Form modal» Duplikace prvku

Modální dialog pro návrh kopie existujícího prvku. Source: `/coco/web-app/src/content/model/stereotype/element/duplicate/DuplicateElementDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Duplikovat prvek : {název originálu}" |
| 2 | E | EArea | Obsah prvku | — | Vnořený [G071](#gui-G071); předvyplněno z originálu, panel vztahů **read-only** (vztahy originálu se přebírají) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Duplikovat() | DUPLIKOVAT | `createRelationshipPatchRequest` – kopie v `elementsToCreate`, převzaté vztahy v `toAdd` | [UC039](02_use_case_model.md#uc-UC039) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog bez uložení | [UC039](02_use_case_model.md#uc-UC039) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G071](#gui-G071) | Obsah prvku (panel vztahů read-only) |
| produces | [Patch Request](04_logicky_model.md#lm-L039) | Nový PR po DUPLIKOVAT |

> **Verze: RQU004** – opraveno dle `DuplicateElementDialog.tsx`. Tlačítko DUPLIKOVAT volá `createRelationshipPatchRequest` (ne přímou kopii s novým UUID). Obsah dialogu je sdílená komponenta `ElementContent` ([G071](#gui-G071)); doplněno přebírání vztahů originálu.

---

<a id="gui-G066"></a>
## «Form modal» Relevantní MV pro MCA schopnost

Modální dialog s tabulkou míst velení, která deklarují podporu dané MCA schopnosti. Source: `/coco/web-app/src/content/model/stereotype/element/capability/CapabilityCommandPostsDialog.tsx`. Šířka `maxWidth: xl`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Relevantní místa velení" (i18n `RELEVANT_COMMAND_POST`) |
| 2 | E | EGrid | Tabulka MV | — | Vnořený [G066a](#gui-G066a) |

### Operace

žádné – dialog je čistě informativní, zavírá se křížkem / klávesou Esc.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G066a](#gui-G066a) | Tabulka relevantních MV |

> **Verze: RQU004** – opraveno dle `CapabilityCommandPostsDialog.tsx`. Odstraněno neexistující pole „MCA schopnost" (dialog dostává jen `capabilityId`) a operace „OtevřítMV()" (tabulka nemá řádkovou navigaci). Tabulka MV vyčleněna do [G066a](#gui-G066a).

---

<a id="gui-G066a"></a>
## «Form grid area» Tabulka relevantních MV

Vnořená tabulka míst velení v [G066](#gui-G066). Source: `CapabilityCommandPostsDialog.tsx` + `CapabilityCommandPostsDataGridColDefs.tsx`.

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
| dataSource | [RQU002 L007 Schopnost MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L007) | Cross-link – MV deklarující danou schopnost (`useSearchCommandPosts`) |

---

<a id="gui-G067"></a>
## «Form» Patch Requesty (přehled)

Stránka s přehledem patch requestů. URL: `/web/model/patch-requests`. Source: `/coco/web-app/src/content/model/relationship/patchrequest/RelationshipPatchRequestsPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Patch Requesty" (i18n `PATCH_REQUESTS`); sekce `CocoPaper` je sbalitelná |
| 2 | E | EGrid | Tabulka patch requestů | — | Vnořený [G067a](#gui-G067a) |

### Operace

žádné nad rámec gridu – stránka jen zobrazuje tabulku.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G067a](#gui-G067a) | Tabulka patch requestů |
| opens | [G068](#gui-G068) | Detail patch requestu |
| dataSource | [Patch Request](04_logicky_model.md#lm-L039) | |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Odstraněn neexistující **filtr stavu** a **přepínač pohledu „Moje / Všechny"** – rozsah zobrazení je řízen rolí uživatele (`isAdmin`), ne ovládacími prvky stránky.

---

<a id="gui-G067a"></a>
## «Form grid area» Tabulka patch requestů

Vnořená tabulka v [G067](#gui-G067). Source: `RelationshipPatchRequestsPage.tsx` (definice sloupců).

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
| 1 | OtevřítDetail() | Detail (Feed ikona) | administrátor **a** stav `REQUESTED` | Otevře [G068](#gui-G068); též dvojklik na řádek | [UC042](02_use_case_model.md#uc-UC042), [UC043](02_use_case_model.md#uc-UC043) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Patch Request](04_logicky_model.md#lm-L039) | |
| opens | [G068](#gui-G068) | Detail patch requestu |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Doplněn chybějící výčet operací u sloupce `RAkce` (jediná akce Detail, podmíněná). Sloupce srovnány se zdrojem: odstraněny neexistující „Referenční element", „Uzavřel", „Uzavřeno"; sloupec Žadatel je viditelný jen administrátorovi.

---

<a id="gui-G068"></a>
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
| 6 | E | EGrid | Panel vztahů | — | Vnořený [G063a](#gui-G063a); vztahy referenčního prvku s vyznačenými navrhovanými změnami (přidání zeleně, odebrání červeně). Administrátor je může upravit inline. |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | Potvrdit() | POTVRDIT | administrátor + stav REQUESTED; disabled bez změn | `POST /model/relationships/patch-requests/{id}:approve` s výsledným obsahem (`finalChanges`) | [UC043](02_use_case_model.md#uc-UC043) |
| 2 | Zamítnout() | ZAMÍTNOUT | administrátor + stav REQUESTED | `POST /model/relationships/patch-requests/{id}:reject` | [UC043](02_use_case_model.md#uc-UC043) |
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
| contains | [G063a](#gui-G063a) | Panel vztahů prvku |
| dataSource | [Patch Request](04_logicky_model.md#lm-L039) | |

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDetailDialog.tsx`. Odstraněno neexistující pole „Komentář", tři samostatné EGridy (toAdd/toDelete/elementsToCreate) i operace „Upravit" – obsah je metadata + týž záložkový panel vztahů [G063a](#gui-G063a), úpravy se dělají inline. Tlačítka opravena na POTVRDIT / ZAMÍTNOUT.

---

<a id="gui-G069"></a>
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
| dokumentuje | [Element modelu](04_logicky_model.md#lm-L021), [Vztah](04_logicky_model.md#lm-L038) | Vizuální orientační dokumentace |

> **Verze: RQU004** – opraveno dle `MetamodelPage.tsx`. Stránka renderuje **2 obrázky** (`metamodel.jpg`, `metamodelFMN.jpeg`), ne 3 – soubor `MVACR.jpeg` ve složce existuje, ale komponenta jej nevkládá.
