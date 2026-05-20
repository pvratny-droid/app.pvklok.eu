# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Mise (přehled) | missionsPage | «Form» |
| └ [G002](#gui-G002) | Dlaždice mise | missionCard | «Form multi area» |
| [G003](#gui-G003) | Vytvoření mise | missionCreateDialog | «Form modal» |
| [G004](#gui-G004) | Detail mise | missionDetailDialog | «Form modal» |
| └ [G005](#gui-G005) | Záložka Interakce | interactionsTab | «Form area» |
| │  └ [G006](#gui-G006) | Plánovací grid interakcí | planningGrid | «Form grid area» |
| └ [G007](#gui-G007) | Záložka Velení a řízení | c2Tab | «Form area» |
| │  └ [G008](#gui-G008) | Grid C2 vazeb | c2Grid | «Form grid area» |
| [G009](#gui-G009) | Editace detailu mise | missionDetailsUpdateDialog | «Form modal» |
| [G010](#gui-G010) | Duplikace mise | missionDuplicateDialog | «Form modal» |
| [G011](#gui-G011) | Potvrzení zneplatnění mise | missionInvalidateDialog | «Form modal» |
| [G012](#gui-G012) | Vytvoření C2 vazby | c2CreateDialog | «Form modal» |
| [G013](#gui-G013) | Graf mise | missionGraphDialog | «Form modal» |
| [G014](#gui-G014) | CIS matice mise | cisMatrixDialog | «Form modal» |
| [G015](#gui-G015) | Možnosti reportu mise | missionReportOptionsDialog | «Form modal» |
| [G016](#gui-G016) | Výběr IER | ierSelectionDialog | «Form modal» |
| [G017](#gui-G017) | Konfigurace interakcí MV | commandPostInteractionDialog | «Form modal» |
| └ [G018](#gui-G018) | Grid interakcí MV | commandPostInteractionDataGrid | «Form grid area» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G001"></a>
## «Form» Mise (přehled)

Přehledová stránka misí. URL: `/web/missions`. Source: `/coco/web-app/src/content/mission/MissionsPage.tsx`.

Stránka zobrazuje mise ve dvou panelech (`CocoCardPanel`): panel **Mise** (aktivní mise, `invalidated = false`) s akcí **+ Přidat** v záhlaví a panel **Zneplatněné mise** (`invalidated = true`), který se zobrazí jen tehdy, existují-li zneplatněné mise. Nad panely je drobečková navigace (Domů → Mise, operace, cvičení).

> **Verze: RQU003** – odstraněna operace `OtevřítGrafMise()` (graf se otevírá z dlaždice mise [G002](#gui-G002), ne ze stránky); upřesněn název aktivního panelu na „Mise". Ověřeno proti `MissionsPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Mise, operace, cvičení" (drobečková navigace) |
| 2 | R | RPanel | Mise | activeMissions | Panel s dlaždicemi aktivních misí (`invalidated = false`) |
| 3 | R | RPanel | Zneplatněné mise | invalidatedMissions | Panel s dlaždicemi zneplatněných misí; zobrazen jen pokud existují |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatMisi() | + Přidat | Akce v záhlaví panelu „Mise" – otevře [G003](#gui-G003) | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Dlaždice misí |
| opens | [G003](#gui-G003) | Vytvoření mise |
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G002"></a>
## «Form multi area» Dlaždice mise

Jedna dlaždice mise v přehledu (`CocoSimpleCard`). Source: `/coco/web-app/src/content/mission/MissionsPage.tsx`.

Dlaždice má dvě varianty podle toho, ve kterém panelu je:
- **Aktivní mise** – plně interaktivní karta s tlačítky *Report*, *Graf*, *Upravit*; klik na kartu otevře detail mise.
- **Zneplatněná mise** – karta je vizuálně ztlumená (`disabled`); jediné tlačítko *Obnovit* (jen při `canRestore`); klik na kartu otevře potvrzení obnovení.

> **Verze: RQU003** – přepracován výčet operací. Původně dokumentovány akce *Duplikovat / Zneplatnit / Smazat* – tyto na dlaždici **nejsou**: *Duplikovat* a *Zneplatnit* jsou v patičce detailu mise [G004](#gui-G004), *Smazat* v UI neexistuje. Doplněny skutečné akce karty (*Report / Graf / Upravit / Obnovit*). Ověřeno proti `MissionsPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název mise | name | |
| 2 | R | RDlouhyText | Popis | description | |
| 3 | R | RPriznak | Zneplatněna | invalidated | Zneplatněná dlaždice je vizuálně ztlumená (`disabled`) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OtevřítDetail() | UPRAVIT / klik na kartu | Otevře [G004](#gui-G004) (aktivní mise) | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | OtevřítGrafMise() | GRAF | Otevře [G013](#gui-G013) (aktivní mise) | [UC010](02_use_case_model.md#uc-UC010) |
| 3 | Report() | REPORT | Otevře [G015](#gui-G015) (aktivní mise, `canGenerateReport`) | [UC012](02_use_case_model.md#uc-UC012) |
| 4 | Obnovit() | OBNOVIT | Obnoví misi s potvrzením (jen zneplatněné dlaždice, `canRestore`) | [UC006](02_use_case_model.md#uc-UC006) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G004](#gui-G004) | Detail mise |
| opens | [G013](#gui-G013) | Graf mise |
| opens | [G015](#gui-G015) | Možnosti reportu |
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

> Potvrzení obnovení je generický `ConfirmationDialog` („Obnovit misi?") renderovaný přímo v `MissionsPage.tsx` – není veden jako samostatná GUI třída (na rozdíl od dedikovaného [G011](#gui-G011) pro zneplatnění).

---

<a id="gui-G003"></a>
## «Form modal» Vytvoření mise

Modální dialog pro vytvoření nové mise. Source: `/coco/web-app/src/content/mission/MissionCreateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Nová mise" |
| 2 | E | EText | **Název** | name | Povinné |
| 3 | E | ELOV | **Vlastnické MV** | missionOwner | Povinné; výběr z MV |
| 4 | E | EMultiLOV | **Druhy mise** | missionTypes | Povinné, multi-select (limitTags 5) |
| 5 | E | EDlouhyText | Popis | description | Textarea (2 řádky) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | `POST /missions` (MissionCreateDto) | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | Zrušit() | — | Zavře dialog (křížek) | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G004"></a>
## «Form modal» Detail mise

Celoobrazovkový modální dialog detailu mise. Source: `/coco/web-app/src/content/mission/MissionDetailDialog.tsx`.

Dialog má tři části: sekci **Detaily** (read-only údaje mise s ikonou tužky pro editaci), sekci **Plánování** s povinným výběrem **Z pohledu MV** a dvě záložky **Interakce** / **Velení a řízení**. Obsah obou záložek se vykreslí až po zvolení MV pohledu. V patičce jsou akce *Zneplatnit* a *Duplikovat*.

> **Verze: RQU003** – doplněna operace `Zneplatnit()` (tlačítko v patičce dialogu, dříve mylně přiřazeno dlaždici [G002](#gui-G002)). Ověřeno proti `MissionDetailDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Mise" |
| 2 | R | RText | Název mise | name | Sekce Detaily, read-only |
| 3 | R | RText | Vlastnické MV | missionOwner | Sekce Detaily, read-only |
| 4 | R | RText | Druhy mise | missionTypes | Sekce Detaily, read-only |
| 5 | R | RDlouhyText | Popis | description | Sekce Detaily, read-only |
| 6 | E | ELOV | **Z pohledu MV** | pointOfViewCommandPost | Sekce Plánování; povinné; bez něj se záložky nevykreslí |
| 7 | E | EPrepinac | Záložky | selectedTab | Interakce / Velení a řízení |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | UpravitDetail() | ikona tužky | Otevře [G009](#gui-G009) | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | Zneplatnit() | ZNEPLATNIT | Otevře [G011](#gui-G011) | [UC005](02_use_case_model.md#uc-UC005) |
| 3 | Duplikovat() | DUPLIKOVAT | Otevře [G010](#gui-G010) | [UC004](02_use_case_model.md#uc-UC004) |
| 4 | PřepnoutZáložku() | — | Interakce ↔ Velení a řízení | [UC008](02_use_case_model.md#uc-UC008), [UC009](02_use_case_model.md#uc-UC009) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G005](#gui-G005) | Záložka Interakce |
| contains | [G007](#gui-G007) | Záložka Velení a řízení |
| opens | [G009](#gui-G009) | Editace detailu |
| opens | [G010](#gui-G010) | Duplikace |
| opens | [G011](#gui-G011) | Potvrzení zneplatnění |
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G005"></a>
## «Form area» Záložka Interakce

Záložka detailu mise pro plánování informačních interakcí. Source: `/coco/web-app/src/content/mission/interaction/MissionInteractionPlanningPanel.tsx`.

> **Verze: RQU003** – upřesněno, že mód **COMMAND_POSTS** je ve zdroji `disabled` (volba radia `MissionInteractionPlanningPanel.tsx:113`) – v UI ji nelze zvolit, panel pracuje vždy v módu CAPABILITIES.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | ERadio | Mód plánování | planningMode | CAPABILITIES (dle schopností) / COMMAND_POSTS (dle MV) – **COMMAND_POSTS je v UI disabled**; default a jediná funkční volba je CAPABILITIES |
| 2 | E | EGrid | Plánovací grid interakcí | — | Vnořený [G006](#gui-G006) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřepnoutMód() | — | V UI dostupný jen mód CAPABILITIES (COMMAND_POSTS disabled) | [UC008](02_use_case_model.md#uc-UC008) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G006](#gui-G006) | Plánovací grid interakcí |

---

<a id="gui-G006"></a>
## «Form grid area» Plánovací grid interakcí

Stromový grid (`RTree`) pro plánování interakcí mezi MV z pohledu zvoleného MV. Source: `/coco/web-app/src/content/mission/interaction/MissionPlanningDataGrid.tsx`, ColDefs `MissionPlanningDataGridColDefs.tsx`.

> **Verze: RQU003** – třída zásadně přepracována. Původně dokumentována jako plochý grid se sloupci *Zdrojové MV / Cílové MV / IER / TIN / PACE* (sloupce odvozené z DTO `MissionInteractionDto`, ne z gridu). Reálně jde o **stromový grid** (`StyledCocoTreeDataGrid`, `treeData`, `TREE_DATA_GROUP_FIELD`, `defaultGroupingExpansionDepth = 3`) s hierarchií **IER → MV → TIN**. Opraveny sloupce, doplněn **rám gridu** (toolbar Přidat IER / CIS matice / Stáhnout CIS matici) a **řádkové akce**. Ověřeno proti `MissionPlanningDataGrid.tsx`. Viz metodika kap. 3.3.2 a 3.4.

### Typy uzlů ve stromu a hierarchie

Strom je tříúrovňový (`getTreeDataPath`, `path.length`):

- **IER** – kořenový uzel (`path.length = 1`); přidává se přes toolbar [G016](#gui-G016).
- **MV** – cílové místo velení pod IER (`path.length = 2`); přidává se přes akci *Přidat interakce MV* nad IER uzlem → [G017](#gui-G017).
- **TIN** – technologická interakce pod MV (`path.length = 3`); vzniká uložením konfigurace v [G017](#gui-G017).

Hierarchie: `IER → MV → TIN`. Výchozí rozbalení do hloubky 3 (celý strom). Implicitní operace `RTree` (rozbalit/sbalit uzel, vizuální odsazení) viz metodika kap. 3.4.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Viz Operace 4–8; min. šířka 120 px |
| 2 | R | RTree | Strom (identifikátor) | TREE_DATA_GROUP_FIELD | Group field – identifikátor prvku (IER / MV / TIN) |
| 3 | R | RText | Název (EN) | name | `ElementDto` – anglický název prvku |
| 4 | R | RCheck | Konzument | consumer | Zatržítko **disabled** (read-only) + odznak operačního tempa (PACE); na IER řádcích se nezobrazuje |
| 5 | R | RCheck | Poskytovatel | provider | Zatržítko **disabled** (read-only) + odznak PACE; na IER řádcích se nezobrazuje |

> Sloupce 4–5 jsou v tomto gridu **pouze pro čtení** (`Checkbox disabled={true}`). Operační tempo (PACE) se zde jen zobrazuje jako odznak; edituje se v dialogu [G017](#gui-G017) / [G018](#gui-G018).

### Rám gridu (toolbar)

Toolbar (svislý panel akcí vpravo od mřížky, prop `actions`):

| # | Akce | Ikona | Popis |
|---|---|---|---|
| 1 | Přidat IER | PlaylistAdd | Otevře [G016](#gui-G016) – výběr IER k přidání do plánu |
| 2 | CIS matice | FactCheck | Otevře [G014](#gui-G014) – interaktivní CIS matici |
| 3 | Stáhnout CIS matici | FileDownload | Přímé stažení XLSX (`generateCisMatrixReport`) |

Grid nemá vyhledávání, filtry ani počet záznamů (komponenta `CocoTable` je nenabízí). Na řádky IER a MV je navázáno **kontextové menu** (pravé tlačítko) zrcadlící akce *Přidat / Upravit interakce MV*.

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatIER() | — | Toolbar – otevře [G016](#gui-G016) | [UC008](02_use_case_model.md#uc-UC008) |
| 2 | OtevřítCISMatici() | — | Toolbar – otevře [G014](#gui-G014) | [UC011](02_use_case_model.md#uc-UC011) |
| 3 | StáhnoutCISMatici() | — | Toolbar – přímé stažení XLSX | [UC011](02_use_case_model.md#uc-UC011) |
| 4 | PřidatInterakceMV() | — | Řádková akce na IER uzlu – otevře [G017](#gui-G017) | [UC008](02_use_case_model.md#uc-UC008) |
| 5 | UpravitInterakceMV() | — | Řádková akce na MV uzlu – otevře [G017](#gui-G017) s předvyplněnými hodnotami | [UC008](02_use_case_model.md#uc-UC008) |
| 6 | SmazatInterakceIER() | — | Řádková akce na IER uzlu – smaže IER a všechny jeho interakce (s potvrzením) | [UC008](02_use_case_model.md#uc-UC008) |
| 7 | SmazatInterakceMV() | — | Řádková akce na MV uzlu – smaže interakce daného MV (s potvrzením) | [UC008](02_use_case_model.md#uc-UC008) |
| 8 | OtevřítGrafSousedství() | — | Řádková akce na libovolném uzlu – graf sousedství prvku v ArchiRepo (nová záložka) | — |

> Změny stromu se promítají do evidence diferenčně – systém porovná nový stav s uloženými interakcemi a volá `POST /missions/{id}/interactions` pro přibylé a `DELETE /missions/{id}/interactions/{interactionId}` pro odebrané (`MissionInteractionDiff`).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G016](#gui-G016) | Výběr IER |
| opens | [G017](#gui-G017) | Konfigurace interakcí MV |
| opens | [G014](#gui-G014) | CIS matice mise |
| dataSource | [Interakce mise](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G007"></a>
## «Form area» Záložka Velení a řízení

Záložka detailu mise pro správu velitelských vazeb C2. Source: `/coco/web-app/src/content/mission/c2/C2RelationshipPanel.tsx`.

> **Verze: RQU003** – opraveno: panel obsahuje **dva** gridy (Nadřízená MV / Podřízená MV), ne jeden. Odstraněn fiktivní nadpis „Velení a řízení". Ověřeno proti `C2RelationshipPanel.tsx`.

Panel se vykreslí až po zvolení MV pohledu v detailu mise a obsahuje dvě skupiny, každou s vlastním nadpisem a vlastní instancí gridu [G008](#gui-G008):

- **Nadřízená MV** – vazby, kde je MV pohledu *podřízeným* (zobrazuje nadřízená MV).
- **Podřízená MV** – vazby, kde je MV pohledu *nadřízeným* (zobrazuje podřízená MV).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadřízená MV | — | Nadpis skupiny nadřízených vazeb |
| 2 | E | EGrid | Grid nadřízených vazeb | — | Vnořená instance [G008](#gui-G008) |
| 3 | H | HText | Podřízená MV | — | Nadpis skupiny podřízených vazeb |
| 4 | E | EGrid | Grid podřízených vazeb | — | Vnořená instance [G008](#gui-G008) |

### Operace

Panel sám operace nemá – akce *Přidat vazbu* je v toolbaru každého gridu [G008](#gui-G008).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G008](#gui-G008) | Grid C2 vazeb (2 instance – nadřízené / podřízené) |

---

<a id="gui-G008"></a>
## «Form grid area» Grid C2 vazeb

Grid velitelských vazeb C2. Source: `/coco/web-app/src/content/mission/c2/C2RelationshipDataGrid.tsx`, ColDefs `C2RelationshipDataGridColDefs.tsx`.

Grid se v rámci [G007](#gui-G007) vyskytuje ve dvou instancích – pro nadřízené a pro podřízené vazby; liší se jen popisem sloupce MV (2 varianty colDefs).

> **Verze: RQU003** – odstraněna fabrikovaná operace `UpravitTypVazby()`. C2 grid nabízí na řádku **pouze Smazat** (`actionCellRenderer` v `C2RelationshipDataGrid.tsx`); hook `useUpdateC2Relationship` ve zdroji existuje, ale žádná komponenta ho nevolá – endpoint `PATCH` není v UI vystaven. Zdroj upřesněn z ColDefs na celou grid komponentu, doplněn rám (toolbar „+") a potvrzení mazání. Ověřeno proti `C2RelationshipDataGrid.tsx`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Viz Operace 2; min. šířka 80 px |
| 2 | R | RText | Nadřízené / Podřízené MV | superordinate / subordinate | Dle směru gridu (2 varianty colDefs) |
| 3 | R | RText | Typ vazby | type | FULLCOM / OPCOM / OPCON / TACOM / TACON / ADCON / LOGCON |

### Rám gridu (toolbar)

| # | Akce | Ikona | Popis |
|---|---|---|---|
| 1 | Přidat vazbu | + (Add) | Otevře [G012](#gui-G012) – vytvoření C2 vazby (směr dle gridu) |

Grid nemá vyhledávání, filtry ani počet záznamů.

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatVazbu() | + | Toolbar – otevře [G012](#gui-G012) | [UC009](02_use_case_model.md#uc-UC009) |
| 2 | SmazatVazbu() | — | Řádková akce – smaže C2 vazbu (`DELETE`, s potvrzením) | [UC009](02_use_case_model.md#uc-UC009) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [G012](#gui-G012) | Vytvoření C2 vazby |
| dataSource | [Velitelská vazba C2](04_logicky_model.md#lm-L004) | |

---

<a id="gui-G009"></a>
## «Form modal» Editace detailu mise

Modální dialog pro editaci základních údajů mise. Source: `/coco/web-app/src/content/mission/MissionDetailsUpdateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Upravit detail mise" |
| 2 | E | EText | **Název** | name | Povinné |
| 3 | E | ELOV | **Vlastnické MV** | missionOwner | Povinné |
| 4 | E | EMultiLOV | **Druhy mise** | missionTypes | Povinné (limitTags 5) |
| 5 | E | EDlouhyText | Popis | description | Textarea (2 řádky) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | `PUT /missions/{id}` (MissionUpdateDto) | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | Zrušit() | STORNO | Zavře dialog | [UC003](02_use_case_model.md#uc-UC003) |

### Validace

| ID | Pravidlo |
|---|---|
| V-G009-1 | Název je povinný a neprázdný. |
| V-G009-2 | Vlastnické MV je povinné. |
| V-G009-3 | Alespoň jeden Druh mise. |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G010"></a>
## «Form modal» Duplikace mise

Modální dialog pro duplikaci mise. Source: `/coco/web-app/src/content/mission/MissionDuplicateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Duplikovat misi" |
| 2 | R | RText | Informace | — | Vysvětlující text duplikace |
| 3 | E | EText | **Název nové mise** | name | Povinné; DTO `MissionDuplicationInputDto`; musí se lišit od názvu originálu |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Duplikovat() | DUPLIKOVAT | `POST /missions/{id}:duplicate` | [UC004](02_use_case_model.md#uc-UC004) |
| 2 | Zrušit() | STORNO | Zavře dialog | [UC004](02_use_case_model.md#uc-UC004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Mise](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G011"></a>
## «Form modal» Potvrzení zneplatnění mise

Modální potvrzovací dialog před zneplatněním mise. Source: `/coco/web-app/src/content/mission/MissionInvalidateConfirmationDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Zneplatnit misi" |
| 2 | R | RText | Varování | — | „Mise bude zneplatněna." |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Potvrdit() | ZNEPLATNIT | `POST /missions/{id}:invalidate` | [UC005](02_use_case_model.md#uc-UC005) |
| 2 | Zrušit() | STORNO | Zavře dialog | [UC005](02_use_case_model.md#uc-UC005) |

---

<a id="gui-G012"></a>
## «Form modal» Vytvoření C2 vazby

Modální dialog pro definici velitelských vazeb. Source: `/coco/web-app/src/content/mission/c2/C2RelationshipCreateDialog.tsx`.

> **Verze: RQU003** – opraveno. Dialog je **směrově závislý**: jedna strana vazby je fixně MV pohledu (read-only pole), druhá strana je **multi-select** (vytvoří jednu vazbu na každé vybrané MV). Původně dokumentováno jako dvě samostatná povinná pole Nadřízené/Podřízené MV. Ověřeno proti `C2RelationshipCreateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Nové vazby velení a řízení" |
| 2 | R | RText | MV pohledu | pointOfViewCommandPost | Read-only; label „Podřízené MV" nebo „Nadřízené MV" dle směru gridu |
| 3 | E | EMultiLOV | **Protější MV** | selectedCommandPosts | Povinné, multi-select; label „Nadřízená MV" / „Podřízená MV" dle směru |
| 4 | E | ELOV | **Typ vazby** | type | Povinné; 7 typů C2 |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | Vytvoří C2 vazby – jednu na každé vybrané protější MV (`POST` C2RelationshipCreateDto) | [UC009](02_use_case_model.md#uc-UC009) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Velitelská vazba C2](04_logicky_model.md#lm-L004) | |

---

<a id="gui-G013"></a>
## «Form modal» Graf mise

Celoobrazovkový modální dialog s grafickou vizualizací mise. Source: `/coco/web-app/src/content/mission/graph/MissionGraphDialog.tsx`.

> **Verze: RQU003** – opraveno. Graf nabízí **5 pohledů** (ne 3): C2, IER, IP, TIN, Společné a bojové funkce. Uložení rozložení je **automatické** při tažení uzlu (`PUT graph-layout`) – samostatné tlačítko *Uložit* ani *Resetovat* v UI není (operace `ResetovatRozložení()` odstraněna; `deleteGraphLayout` endpoint není v dialogu vystaven). Doplněn filtr „Zvýraznit v grafu". Ověřeno proti `MissionGraphDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Graf interakcí mise" |
| 2 | E | ERadio | Zobrazit dle | viewMode | C2 / IER / IP / TIN / Společné a bojové funkce (JF-WFF) – 5 pohledů |
| 3 | E | EMultiLOV | Zvýraznit v grafu | highlighted | Filtr zvýraznění prvků; nabídka závisí na zvoleném pohledu |
| 4 | R | RNahled | Vizualizace grafu | — | Interaktivní graf s přesouvatelnými uzly |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřepnoutPohled() | — | C2 / IER / IP / TIN / JF-WFF | [UC010](02_use_case_model.md#uc-UC010) |
| 2 | PřesunoutUzel() | — | Tažení uzlu; rozložení se uloží automaticky (`PUT` MissionGraphLayoutDto) | [UC010](02_use_case_model.md#uc-UC010) |
| 3 | Zavřít() | ZAVŘÍT | Zavře dialog | [UC010](02_use_case_model.md#uc-UC010) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Rozložení grafu mise](04_logicky_model.md#lm-L005) | |
| dataSource | [Interakce mise](04_logicky_model.md#lm-L003) | |
| dataSource | [Velitelská vazba C2](04_logicky_model.md#lm-L004) | |

---

<a id="gui-G014"></a>
## «Form modal» CIS matice mise

Modální dialog s CIS maticí pro místo velení. Source: `/coco/web-app/src/content/mission/matrix/CisMatrixDialog.tsx`, grid `CisMatrixDataGrid.tsx`.

> **Verze: RQU003** – odstraněn fabrikovaný atribut „Pro MV" (ELOV). Dialog **nemá výběr MV** – místo velení (pohled) přebírá jako prop z plánovacího gridu [G006](#gui-G006), odkud se otevírá. Doplněny patičkové akce. Ověřeno proti `CisMatrixDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „CIS matice" |
| 2 | E | EGrid | CIS matice | — | Interaktivní grid: sloupce Pozice, Role + dynamické TIN sloupce; zatržítka jsou read-only (`disabled`) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | StáhnoutXLSX() | STÁHNOUT CIS MATICI | `generateCisMatrixReport(missionId, commandPostId)` → XLSX | [UC011](02_use_case_model.md#uc-UC011) |
| 2 | Zavřít() | ZAVŘÍT | Zavře dialog | [UC011](02_use_case_model.md#uc-UC011) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Interakce mise](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G015"></a>
## «Form modal» Možnosti reportu mise

Modální dialog volby parametrů reportu mise (PDF). Source: `/coco/web-app/src/content/mission/report/MissionReportOptionsDialog.tsx`.

> **Verze: RQU003** – odstraněn fabrikovaný atribut „Jazyk" (ELOV). Dialog má jen pole *Varianta* a *Klasifikace*; jazyk reportu se přebírá automaticky z jazyka aplikace (`i18n.language`). Ověřeno proti `MissionReportOptionsDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Možnosti reportu mise" |
| 2 | E | ELOV | **Varianta** | reportVariant | BASIC / COMPLETE; default BASIC |
| 3 | E | ELOV | **Klasifikace** | reportClassification | OFFICIAL / RESTRICTED; default OFFICIAL |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Stáhnout() | STÁHNOUT | `generateMissionReport(id, options)` → PDF (jazyk dle jazyka aplikace) | [UC012](02_use_case_model.md#uc-UC012) |
| 2 | Zrušit() | STORNO | Zavře dialog | [UC012](02_use_case_model.md#uc-UC012) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Export mise](04_logicky_model.md#lm-L006) | (navrhované) |

---

<a id="gui-G016"></a>
## «Form modal» Výběr IER

Modální dialog pro výběr informačních toků (IER) k přidání do plánu interakcí. Source: `/coco/web-app/src/content/mission/interaction/IerSelectionDialog.tsx`.

> **Verze: RQU003** – nová třída doplněná revizí. Při původním reverse-engineeringu vynechána, ač je navázána na toolbar plánovacího gridu [G006](#gui-G006).

Dialog nabízí IER prvky (stereotyp `INFORMATION_EXCHANGE_REQUIREMENT`); již zařazené IER jsou z nabídky vyloučeny.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Přidat IER" |
| 2 | E | EMultiLOV | **IER** | selectedIers | Povinné, multi-select; bez limitu zobrazených tagů |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Přidat() | PŘIDAT | Vloží vybrané IER jako kořenové uzly do plánovacího gridu [G006](#gui-G006) | [UC008](02_use_case_model.md#uc-UC008) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [RQU004 L003 Informační tok IER](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L003) | |

---

<a id="gui-G017"></a>
## «Form modal» Konfigurace interakcí MV

Modální dialog pro konfiguraci interakcí mezi zdrojovým a cílovým MV pro daný IER. Source: `/coco/web-app/src/content/mission/interaction/CommandPostInteractionDialog.tsx`.

> **Verze: RQU003** – nová třída doplněná revizí. Otevírá se z řádkových akcí plánovacího gridu [G006](#gui-G006) (*Přidat / Upravit interakce MV*); při původním reverse-engineeringu vynechána.

Dialog má dva režimy:
- **Přidání interakce MV** – cílové MV se vybírá (volba ze seznamu).
- **Úprava interakce MV** – cílové MV je dané (read-only), grid je předvyplněn stávající konfigurací.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Upravit interakce MV" |
| 2 | R | RText | Zdrojové MV | sourceCommandPost | Read-only |
| 3 | E | ELOV | **Cílové MV** | targetCommandPost | Povinné; výběr ze seznamu při přidání, read-only při úpravě |
| 4 | E | EGrid | Interakce MV | — | Vnořený [G018](#gui-G018) (zobrazí se po zvolení cílového MV) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Uloží konfiguraci interakcí do plánovacího gridu [G006](#gui-G006) | [UC008](02_use_case_model.md#uc-UC008) |
| 2 | Zrušit() | STORNO | Zavře dialog | [UC008](02_use_case_model.md#uc-UC008) |

### Validace

| ID | Pravidlo |
|---|---|
| V-G017-1 | Cílové MV je povinné. |
| V-G017-2 | Musí být zaškrtnuta alespoň jedna role (Konzument / Poskytovatel) u některého TIN. |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G018](#gui-G018) | Grid interakcí MV |
| dataSource | [Interakce mise](04_logicky_model.md#lm-L003) | |

---

<a id="gui-G018"></a>
## «Form grid area» Grid interakcí MV

Stromový grid (`RTree`) v dialogu [G017](#gui-G017) pro zaškrtání rolí a operačního tempa interakcí. Source: `/coco/web-app/src/content/mission/interaction/CommandPostInteractionDataGrid.tsx`, ColDefs `CommandPostInteractionDataGridColDefs.tsx`, buňka `CommandPostInteractionCell.tsx`.

> **Verze: RQU003** – nová třída doplněná revizí. Vnořený stromový grid dialogu [G017](#gui-G017); zde se na rozdíl od read-only [G006](#gui-G006) operační tempo (PACE) skutečně edituje.

### Typy uzlů ve stromu a hierarchie

Strom je dvouúrovňový (`getTreeDataPath`, výchozí stav rozbalený):

- **IER** – kořenový uzel (`path.length = 1`).
- **TIN** – technologická interakce pod IER (`path.length = 2`).

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Viz Operace 2; min. šířka 80 px |
| 2 | R | RTree | Strom (identifikátor) | TREE_DATA_GROUP_FIELD | Group field – identifikátor IER / TIN |
| 3 | R | RText | Název (EN) | name | Anglický název prvku |
| 4 | E | ECheck | Konzument | consumer | Zatržítko + výběr operačního tempa (PACE); editovatelné na TIN řádcích, na IER řádcích `disabled` |
| 5 | E | ECheck | Poskytovatel | provider | Zatržítko + výběr PACE; editovatelné na TIN řádcích, na IER řádcích `disabled` |

> Sloupce 4–5 (`CommandPostInteractionCell`) kombinují zatržítko role a rozbalovací výběr operačního tempa. Tempo se nastavuje pro každý TIN zvlášť; v rámci jednoho IER nelze stejné tempo použít pro dvě role/TIN duplicitně (zakázané hodnoty jsou ve výběru `disabled`).

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | ZměnitInterakci() | — | Zaškrtnutí role (Konzument / Poskytovatel) a nastavení PACE na TIN řádku | [UC008](02_use_case_model.md#uc-UC008) |
| 2 | OtevřítGrafSousedství() | — | Řádková akce – graf sousedství prvku v ArchiRepo (nová záložka) | — |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Interakce mise](04_logicky_model.md#lm-L003) | |
