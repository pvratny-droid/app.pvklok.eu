# GUI model

> **Delta vůči RQU004:** Drtivá většina GUI tříd existuje v [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md) – v této analýze jsou označené statusem `modified` v [existing_elements.json](existing_elements.json) a doplněné o sekci `**Verze: RQU010**` se shrnutím změn. Jediná zcela nová GUI třída je [G005](#gui-G005) `MvCatalogDeactivationDialog`. Reuse přehledu prvků stereotypu, tabulky prvků a dialogu vytvoření je možný díky volbě varianty „**REQUIREMENT / CONSTRAINT jako nové stereotypy ElementDto**" (viz [README – kontext analýzy](README.md)).

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form modal …).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **Alias** = zkrácený zobrazovací label.
- **Stereotyp «RQU010»** ve sloupci Stereotyp tabulky atributů/operací = prvek byl přidán nebo změněn touto analýzou. Existující prvky mají Stereotyp prázdný.
- V delta tabulkách (modified třídy) jsou uvedeny **jen** nové/změněné atributy a operace; zbytek je shrnut zkratkou `.. stávající atributy ..` resp. `.. stávající operace ..` (dle [metodika-zapisu.md kap. 8.5](../../../../metodika/metodika-zapisu.md)).

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp | Status |
|---|---|---|---|---|
| [G001](#gui-G001) | Model (rozcestník) | modelPage | «Form» | modified |
| └ [G002](#gui-G002) | Dlaždice číselníku | mvCatalogCard | «Form multi area» | existing (typově) |
| [G003](#gui-G003) | Přehled prvků stereotypu | modelElementsPage | «Form» | modified |
| └ [G004](#gui-G004) | Tabulka prvků | elementsTable | «Form grid area» | modified |
| [G005](#gui-G005) | Dialog potvrzení zrušení/výmazu | mvCatalogDeactivationDialog | «Form modal» | new |
| [G006](#gui-G006) | Vytvoření prvku | createElementDialog | «Form modal» | modified |
| [G007](#gui-G007) | Editace překladů prvku | elementDialog | «Form modal» | existing |
| [G011](#gui-G011) | Dialog MV používajících prvek | catalogItemCommandPostsDialog | «Form modal» | modified |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

```plantuml file=diagrams/gui_class_diagram.puml
```

---

<a id="gui-G001"></a>
## «Form» Model (rozcestník)

Úvodní stránka modulu Model. URL: `/web/model`. Source: `coco/web-app/src/content/model/ModelPage.tsx`. Cross-RQU: [RQU004 G001](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G001).

### Atributy (delta)

| # | Kat. | GUI typ | Název | Alias | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Hlavní modely, Katalog služeb, Ostatní, Vyhledat) .. | – | – | viz [RQU004 G001](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G001) |
| 4½ | R | RPanel | Číselníky | mvCatalogPanel | «RQU010» | Nový panel umístěný **mezi** panely *Katalog služeb* (4) a *Ostatní* (5). Obsahuje 2 dlaždice: **Požadavky MV** a **Omezení MV**. |

### Operace (delta)

| # | Název | Alias | Stereotyp | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 5 | OtevřítČíselníkPožadavkůMV() | — | «RQU010» | Naviguje na `/web/model/requirement` | [UC001](02_use_case_model.md#uc-UC001) |
| 6 | OtevřítČíselníkOmezeníMV() | — | «RQU010» | Naviguje na `/web/model/constraint` | [UC001](02_use_case_model.md#uc-UC001) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Nové dlaždice Požadavky MV / Omezení MV (2 instance) |
| navigates | [G003](#gui-G003) | Přehled prvků stereotypu (parametrizováno) |

**Verze: RQU010**

- Vložen nový panel **„Číselníky"** mezi panel *Katalog služeb* a panel *Ostatní*. Panel obsahuje 2 dlaždice navigující na obecný přehled prvků stereotypu pro `REQUIREMENT` resp. `CONSTRAINT`.

---

<a id="gui-G002"></a>
## «Form multi area» Dlaždice číselníku

Reuse stávající komponenty `CocoSimpleCard` (typově totožné s [RQU004 G002](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G002)). RQU010 přidává **dvě nové instance dat** v `MvCatalogCardData.ts` – samotná GUI třída se nemění.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Název stereotypu, Barevný blok, Popis) .. | – | viz [RQU004 G002](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| navigates | [G003](#gui-G003) | Přehled prvků stereotypu (REQUIREMENT / CONSTRAINT) |

**Verze: RQU010**

- Beze změny komponenty. Dvě nové instance dat: **Požadavky MV** (barevný blok např. *yellow*) a **Omezení MV** (např. *red-light-dark*).

---

<a id="gui-G003"></a>
## «Form» Přehled prvků stereotypu

Stránka se seznamem prvků jednoho stereotypu. URL: `/web/model/{stereotype}`. Source: `coco/web-app/src/content/model/ModelElementsPage.tsx`. Cross-RQU: [RQU004 G003](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G003).

### Atributy (delta)

| # | Kat. | GUI typ | Název | Alias | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Breadcrumb, Nadpis, Tabulka prvků) .. | – | – | viz [RQU004 G003](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G003) |
| 4 | E | ECheck | Zobrazit i zrušené | showInactive | «RQU010» | Toggle v hlavičce přehledu. Default vypnut (zobrazí jen `active = true`). Viditelný **jen** pro stereotypy REQ / CONSTR. |

### Operace (delta)

| # | Název | Alias | Stereotyp | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 2 | PřepnoutZobrazitZrušené() | Zobrazit i zrušené | «RQU010» | Toggle filtru přehledu | [UC003](02_use_case_model.md#uc-UC003) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Toggle **„Zobrazit i zrušené"** je viditelný jen pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT) – řízeno funkcí `isCatalogStereotype(stereotype)`. |
| 2 | Pro stereotypy REQ / CONSTR systém **skrývá** tlačítka „Upravit vztahy", „Sousedství v grafu" a „Patch Request" (číselník nemá vztahy v ArchiMate metamodelu). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G004](#gui-G004) | Tabulka prvků (modified) |
| opens | [G006](#gui-G006) | Vytvoření prvku (existující akce **+ Přidat**) |
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | Filtrované podle stereotypu a `active` |

**Verze: RQU010**

- Přidán toggle **„Zobrazit i zrušené"** (jen pro REQ / CONSTR). Default filtr `active = true`; po zapnutí toggle se přenačtou data s filtrem `active = all`.

---

<a id="gui-G004"></a>
## «Form grid area» Tabulka prvků

Sdílená tabulka prvků pro [G003](#gui-G003) i [RQU004 G005 AllModelElementsPage](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G005). Source: `coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx`. Cross-RQU: [RQU004 G004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G004).

### Atributy (delta sloupců gridu)

| # | Kat. | GUI typ | Název | Alias | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | – | – | .. stávající sloupce (Vyhledat, Akce, Kód, Název EN, Název CZ, Stav překladu, Identifikátor) .. | – | – | viz [RQU004 G004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G004) |
| 8 | R | RCheckTooltip | Aktivní | active | «RQU010» | Ano/Ne. Viditelný **jen** pro stereotypy REQ / CONSTR. U zrušených řádků dodatečně vizuální „greyed" styl. |

### Operace (delta řádkových akcí)

| # | Název | Alias | Podmínka | Stereotyp | Popis | Vazba na UC |
|---|---|---|---|---|---|---|
| 6 | Zrušit() | ikona „eye-slash" | jen REQ / CONSTR a `active = true` | «RQU010» | Otevře [G005](#gui-G005) | [UC005](02_use_case_model.md#uc-UC005) |
| 7 | Aktivovat() | ikona „eye" | jen REQ / CONSTR a `active = false` | «RQU010» | `PATCH /api/elements/{id}` s `active = true`, invaliduje cache | [UC004](02_use_case_model.md#uc-UC004) |
| 5 | RelevantníMV() | ikona HolidayVillage | nyní rozšířeno na MCA / REQ / CONSTR | «RQU010» | Otevře [G011](#gui-G011) | [UC007](02_use_case_model.md#uc-UC007) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Akce **Upravit vztahy**, **Sousedství v grafu** a **Patch Request** jsou pro REQ / CONSTR skryté. |
| 2 | Akce **Aktivovat / Zrušit** jsou toggle – nikdy nejsou viditelné současně. |
| 3 | Zrušené řádky (`active = false`) jsou default skryté; viditelné jen při zapnutém toggle „Zobrazit i zrušené" v [G003](#gui-G003). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | |
| opens | [G005](#gui-G005) | Dialog potvrzení zrušení/výmazu |
| opens | [G006](#gui-G006) | Editace prvku (řádková akce **Upravit**) |
| opens | [G007](#gui-G007) | Editace překladů |
| opens | [G011](#gui-G011) | Dialog MV používajících prvek |

**Verze: RQU010**

- Nový sloupec **Aktivní** (viditelný jen pro REQ / CONSTR). Nové řádkové akce **Zrušit** a **Aktivovat** (toggle podle `active`). Akce **Zobrazit odpovídající MV** se rozšiřuje z MCA na MCA / REQ / CONSTR. Pro REQ / CONSTR se skrývají akce **Upravit vztahy**, **Sousedství v grafu**, **Patch Request**.

---

<a id="gui-G005"></a>
## «Form modal» Dialog potvrzení zrušení/výmazu

**Nová** GUI třída zavedená touto analýzou. Slouží k potvrzení zrušení (deaktivace) položky číselníku Požadavků MV nebo Omezení MV s automatickou detekcí, zda je položka aktuálně používaná v některé Specifikaci MV.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | `Zrušit položku „{nazevCs}"?` |
| 2 | R | RText | Počet referujících MV | usageCount | Načteno z `GET /api/elements/{id}/usage`. Zobrazeno jako věta dle počtu odkazů (viz Pravidla). |
| 3 | R | RDlouhyText | Seznam referujících MV | usageList | Nepovinný (zobrazí se jen na rozkliknutí *„Zobrazit seznam"* pokud `usageCount > 0`). |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | Deaktivovat() | DEAKTIVOVAT | vždy | `PATCH /api/elements/{id}` s `active = false`; invaliduje cache; zavře dialog | [UC005](02_use_case_model.md#uc-UC005) |
| 2 | TrvaleSmazat() | TRVALE SMAZAT | jen pokud `usageCount = 0` | `DELETE /api/elements/{id}`; invaliduje cache; zavře dialog | [UC006](02_use_case_model.md#uc-UC006) |
| 3 | Zrušit() | ZRUŠIT | vždy | Zavře dialog bez akce | — |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Tlačítko **Trvale smazat** je viditelné **jen** pokud `usageCount = 0`. Pokud je položka používaná, jediná akce je **Deaktivovat**. |
| 2 | Backend před `DELETE` znovu ověří `usage.count = 0` v rámci stejné transakce (ochrana před race condition). |
| 3 | Po **Deaktivaci** zůstávají existující reference v historických Specifikacích MV nedotčené (live label, v reportu vyznačeno *(zrušené)*). |
| 4 | Text dialogu pro `usageCount > 0`: *„Položka je použita v {n} MV. Bude pouze deaktivována."*. Pro `usageCount = 0`: *„Položka není použita v žádné Specifikaci MV. Můžete ji deaktivovat nebo trvale smazat."*. |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | Položka číselníku k zrušení / výmazu |

---

<a id="gui-G006"></a>
## «Form modal» Vytvoření prvku

Modální dialog pro vytvoření nového prvku daného stereotypu. Source: `coco/web-app/src/content/model/stereotype/element/CreateElementDialog.tsx`. Cross-RQU: [RQU004 G006](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G006).

### Atributy (delta – chování pro REQ / CONSTR)

| # | Kat. | GUI typ | Název | Alias | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Nadpis, Název EN, Název CZ, Popis EN, Popis CZ, Kód země) .. | – | – | viz [RQU004 G006](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G006) |

### Pravidla (delta)

| ID | Pravidlo |
|---|---|
| 1 | Pro stereotypy REQUIREMENT a CONSTRAINT systém **skrývá** pole `s5636Identifier` (NATO kód) a `archiMateType` (ArchiMate typ) – pro číselník nemají smysl. |
| 2 | Pro stereotypy REQUIREMENT a CONSTRAINT je `s5636Identifier` generován automaticky podle vzoru `REQ-NNN` resp. `CON-NNN` (auto-increment, per typ, stálé po výmazu). Slouží jako stable `code` pro FK z [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002). |
| 3 | Pole **Název EN** (`name`) a **Název CZ** (`nameCz`) jsou pro REQ / CONSTR oba povinné. |

**Verze: RQU010**

- Pro nové stereotypy REQ / CONSTR upraveno zobrazení dialogu – skrytí ArchiMate typu a S5636 ID; automatické generování S5636 ID podle vzoru `REQ-NNN` / `CON-NNN`. Povinnost obou jazykových variant názvu.

---

<a id="gui-G007"></a>
## «Form modal» Editace překladů prvku

Reuse existující komponenty `ElementDialog` ze [RQU004 G007](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G007) **beze změny**. Slouží i pro editaci popisů CS/EN položek číselníku REQ / CONSTR. Existující `translationStatus` workflow (AI_TRANSLATED → UPDATED → APPROVED) je platný i pro nové stereotypy (otevřená otázka v [README](README.md), zda se má pro číselníky aktivně používat).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Název EN, Název CZ, Popis EN, Popis CZ, Stav překladu) .. | – | viz [RQU004 G007](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G007) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Element modelu](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G011"></a>
## «Form modal» Dialog MV používajících prvek

Modální dialog se seznamem MV, ve kterých je daný prvek modelu referován (Specifikace MV, Schopnosti MV, …). Source: `coco/web-app/src/content/model/stereotype/element/capability/CapabilityCommandPostsDialog.tsx`. Cross-RQU: [RQU004 G011](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G011).

### Atributy (delta)

| # | Kat. | GUI typ | Název | Alias | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | – | – | .. stávající atributy (Tabulka MV) .. | – | – | viz [RQU004 G011](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G011) |
| 1 | H | HText | Nadpis (parametrizovaný) | — | «RQU010» | Dle stereotypu: MCA → *Relevantní MV pro schopnost …*; REQ → *MV používající požadavek …*; CONSTR → *MV používající omezení …*. |

### Pravidla (delta)

| ID | Pravidlo |
|---|---|
| 1 | Funkce `isRelevantCommandPostsEnabled` se rozšiřuje z `Stereotype.MCA_CAPABILITY` na `[MCA_CAPABILITY, REQUIREMENT, CONSTRAINT]`. |
| 2 | Backend endpoint pro načtení MV se volí podle stereotypu: pro MCA `GET /capabilities/{id}/command-posts` (stávající), pro REQ / CONSTR `GET /api/elements/{id}/command-posts/usage` (nový, agreguje napříč Specifikacemi MV). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [RQU002 Místo velení – L001](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L001) | Tabulka MV |
| dataSource | [RQU002 Specifikace MV – L002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002) | Agregace referencí položky číselníku |

**Verze: RQU010**

- Dialog se zobecňuje z výhradního použití pro MCA schopnost na obecný „Seznam MV používajících prvek". Parametrizovaný titulek dle stereotypu. Nový endpoint pro stereotypy REQ / CONSTR.
