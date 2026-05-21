# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L021](#lm-L021) | Element modelu (generický) | element | Abstraktní třída |
| [L022](#lm-L022) | MCA Schopnost | mcaCapability | Třída (stereotyp `CAP`) |
| [L023](#lm-L023) | Informační tok IER | ier | Třída (stereotyp `IER`) |
| [L024](#lm-L024) | Informační produkt IP | informationProduct | Třída (stereotyp `IP`) |
| [L025](#lm-L025) | Technologická interakce TIN | tin | Třída (stereotyp `TIN`) |
| [L026](#lm-L026) | Role | role | Třída (stereotyp `ROLE`) |
| [L027](#lm-L027) | Pozice | position | Třída (stereotyp `POSITION`) |
| [L028](#lm-L028) | Aktivita | businessActivity | Třída (stereotyp `BA`) |
| [L029](#lm-L029) | Proces | businessProcess | Třída (stereotyp `BP`) |
| [L030](#lm-L030) | Procedurální instrukce | proceduralInstruction | Třída (stereotyp `PI`) |
| [L031](#lm-L031) | Organizace | org | Třída (stereotyp `ORG`) |
| [L032](#lm-L032) | Organizační jednotka | organizationalUnit | Třída (stereotyp `OU`) |
| [L003](#lm-L003) | Místo velení | commandPost | Třída (stereotyp `CP`) – viz [RQU002 L003](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) |
| [L033](#lm-L033) | IER Grouping | ierGrouping | Třída (stereotyp `IER_GROUPING`) |
| [L034](#lm-L034) | Infrastrukturní služba | infrastructureService | Třída (stereotyp `SRV`, read-only) |
| [L035](#lm-L035) | Aplikační služba | applicationService | Třída (stereotyp `APL`, read-only) |
| [L036](#lm-L036) | CIS Aplikace | cisApplication | Třída (stereotyp `CISAPP`) |
| [L037](#lm-L037) | CIS Zařízení | cisDevice | Třída (stereotyp `CISDEV`) |
| [L038](#lm-L038) | Vztah | relationship | Třída |
| [L039](#lm-L039) | Patch Request | patchRequest | Třída |
| [L040](#lm-L040) | Subkategorie MCA schopnosti | mcaSubcategory | Vazební třída |
| [E028](#lm-E028) | stereotyp_E | stereotyp_E | Číselník |
| [E029](#lm-E029) | archiMateTyp_E | archiMateTyp_E | Číselník |
| [E030](#lm-E030) | typVztahu_E | typVztahu_E | Číselník |
| [E031](#lm-E031) | stavPřekladu_E | stavPrekladu_E | Číselník |
| [E032](#lm-E032) | stavPatchRequestu_E | stavPatchRequestu_E | Číselník |
| [E033](#lm-E033) | kódZemě_E | kodZeme_E | Číselník |

> **Reverse-engineering RQU004** – třídy a číselníky vychází ze zdrojových kódů C3HUB (`/coco/web-app/src/client/model/ModelApiClient.tsx` a `/coco/web-app/src/content/model/`). Všech 17 stereotypů je definováno v enumu `Stereotype` resp. `ModelStereotype`. 9 typů vztahů v enumu `RelationshipType`. 15 ArchiMate typů v enumu `ArchiMateType`. Třída [L021](#lm-L021) reprezentuje sdílené atributy `ElementDto`, ze které jsou ostatní (L022–L037) dědící konkretizací podle stereotypu.

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L021"></a>
## Třída: Element modelu (generický)

Abstraktní generická entita reprezentující jakýkoli prvek doménového modelu. DTO `ElementDto` (`/coco/web-app/src/client/model/ModelApiClient.tsx:20`). Konkrétní stereotyp určuje, o jaký doménový prvek jde (viz L022–L037).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | UUID prvku (DTO `id`). |
| 2 | ArchiMate typ | type | archiMateTyp_E | Ne | DTO `type` – jeden z 15 ArchiMate typů (viz [E029](#lm-E029)). |
| 3 | Stereotyp | stereotype | stereotyp_E | Ne | DTO `stereotype` – jeden z 17 stereotypů (viz [E028](#lm-E028)). |
| 4 | Kód (S5636) | s5636Identifier | kod_T | Ne | NATO/STANAG 5636 identifikátor; v gridech sloupec **Kód**. |
| 5 | Název EN | name | text256_T | Ne | Anglický název. |
| 6 | Název CZ | nameCz | text256_T | Ne | Český název. |
| 7 | Popis EN | description | text2000/CLOB_T | Ne | Anglický popis. |
| 8 | Popis CZ | descriptionCz | text2000/CLOB_T | Ne | Český popis. |
| 9 | Stav překladu | translationStatus | stavPřekladu_E | Ne | `AI_TRANSLATED` / `UPDATED` / `APPROVED` (viz [E031](#lm-E031)). |
| 10 | Obrázek | image | text256_T | Ne | DTO `image` – obrazový asset (filename). |
| 11 | Kód země | countryCode | kódZemě_E | Ne | DTO `countryCode` – ISO kód země (viz [E033](#lm-E033)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| type | [archiMateTyp_E](#lm-E029) | 0..1 | |
| stereotype | [stereotyp_E](#lm-E028) | 0..1 | |
| translationStatus | [stavPřekladu_E](#lm-E031) | 0..1 | |
| countryCode | [kódZemě_E](#lm-E033) | 0..1 | |
| (vychází z) | [Vztah](#lm-L038) | 0..* | Vstupní i výstupní vztahy |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Atribut `stereotype` musí odpovídat jednomu z 17 stereotypů. Konkrétní hodnota určuje, do které specializace (L022–L037) element patří. |
| 2 | Pole `translationStatus` se mění dle workflow: `AI_TRANSLATED` (výchozí po prvotním automatickém překladu) → `UPDATED` (uživatel upravil CZ verzi) → `APPROVED` (CZ verze schválena). |
| 3 | Změna `nameCz` nebo `descriptionCz` automaticky přepne `translationStatus` na `UPDATED`. |

---

<a id="lm-L022"></a>
## Třída: MCA Schopnost

Specializace [L021](#lm-L021) se stereotypem `MCA_CAPABILITY` (`CAP`). Reprezentuje jednu položku v MCA modelu schopností.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [Subkategorie MCA schopnosti](#lm-L040) | 0..* | DTO `McaCapabilitySubcategoryDto[]`; vazba na strom subkategorií |
| (přes vazbu MV ↔ schopnost) | [RQU002 L007 Schopnost MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L007) | 0..* | „Relevantní MV" |

### Specifické chování

| # | Pravidlo |
|---|---|
| 1 | Editace vztahů je v ElementsTable **zakázaná** (`isEditRelationshipsEnabled = false` pro MCA). Vztahy jsou spravované jinde (přes capability spec MV). |
| 2 | Akce „Relevantní MV" zobrazí seznam MV, které schopnost deklarují (cross-link z RQU002). |
| 3 | Uživatel nemůže přidávat MCA schopnosti přímo přes „+ Přidat" v RQU004 – schopnosti vznikají systémově. |

---

<a id="lm-L023"></a>
## Třída: Informační tok IER

Specializace [L021](#lm-L021) se stereotypem `INFORMATION_EXCHANGE_REQUIREMENT` (`IER`). Reprezentuje požadavek na výměnu informací mezi dvěma rolemi/místy velení.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přes vztah typu) | [Role](#lm-L026) | 0..* | Producer / consumer role |
| (přes vztah typu FLOW) | [Informační produkt IP](#lm-L024) | 0..* | IP nesený tokem |
| (vazba MV ↔ IER) | [RQU002 L008 Tok IER na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L008) | 0..* | |
| (graf) | sebe a vše napojené | 0..* | Endpoint `GET /model/graphs/ier/{ierId}` |

---

<a id="lm-L024"></a>
## Třída: Informační produkt IP

Specializace [L021](#lm-L021) se stereotypem `INFORMATION_PRODUCT` (`IP`). Konkrétní informační artefakt (dokument, datová zpráva, hlášení).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přes vztah typu FLOW) | [Informační tok IER](#lm-L023) | 0..* | IP nesený toky |
| (vazba MV ↔ IP) | [RQU002 L009 Tok IP na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L009) | 0..* | |

---

<a id="lm-L025"></a>
## Třída: Technologická interakce TIN

Specializace [L021](#lm-L021) se stereotypem `TECHNOLOGY_INTERACTION` (`TIN`). Reprezentuje technologickou (datovou/komunikační) realizaci výměny informací mezi CIS aplikacemi/zařízeními.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (realizuje) | [Informační tok IER](#lm-L023) | 0..* | TIN je technickou realizací IER |
| (provádí) | [CIS Aplikace](#lm-L036) / [CIS Zařízení](#lm-L037) | 0..* | Endpoint `findTinToAppDeviceGraph` |

---

<a id="lm-L026"></a>
## Třída: Role

Specializace [L021](#lm-L021) se stereotypem `ROLE`. Funkční role na místě velení (např. „Velitel J3", „Důstojník logistiky").

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přiřazení k pozici) | [RQU002 L013 Přiřazení role k pozici](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L013) | 0..* | |
| (přes IER) | [Informační tok IER](#lm-L023) | 0..* | Producer / consumer |

---

<a id="lm-L027"></a>
## Třída: Pozice

Specializace [L021](#lm-L021) se stereotypem `POSITION`. Konkrétní organizační pozice (instance role na konkrétním MV).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (cross-link) | [RQU002 L006 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) | 1 | Specifika pozice na MV se evidují tam |

---

<a id="lm-L028"></a>
## Třída: Aktivita

Specializace [L021](#lm-L021) se stereotypem `BUSINESS_ACTIVITY` (`BA`). Elementární obchodní aktivita.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (composition do) | [Proces](#lm-L029) | 0..* | BA je součástí BP |

---

<a id="lm-L029"></a>
## Třída: Proces

Specializace [L021](#lm-L021) se stereotypem `BUSINESS_PROCESS` (`BP`). Vyšší obchodní proces obsahující jednu nebo více aktivit.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (composition) | [Aktivita](#lm-L028) | 0..* | |
| (přiřazení k roli) | [Role](#lm-L026) | 0..* | |

---

<a id="lm-L030"></a>
## Třída: Procedurální instrukce

Specializace [L021](#lm-L021) se stereotypem `PROCEDURAL_INSTRUCTION` (`PI`). FMN procedurální instrukce (např. „Instructions for Fire Support").

### Specifické chování

| # | Pravidlo |
|---|---|
| 1 | Editace vztahů je v ElementsTable **zakázaná** (jako u MCA Schopnosti). |
| 2 | Vazba na IER: endpoint `POST /model/procedural-instructions/{piId}:search-information-exchange-requirements`. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (realizuje) | [Informační tok IER](#lm-L023) | 0..* | |
| (vazba na MV) | [RQU002 L010 FMN instrukce na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L010) | 0..* | |
| (vazba na funkce) | [RQU006 funkce](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/README.md) | 0..* | Vazební tabulka FMN PI ↔ Společné/bojové funkce |

---

<a id="lm-L031"></a>
## Třída: Organizace

Specializace [L021](#lm-L021) se stereotypem `ORG`. Reprezentuje organizační jednotku nejvyšší úrovně (NATO velitelství, národní MO, …).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [Organizační jednotka](#lm-L032) | 0..* | |

---

<a id="lm-L032"></a>
## Třída: Organizační jednotka

Specializace [L021](#lm-L021) se stereotypem `ORGANIZATIONAL_UNIT` (`OU`). Podřízená organizační složka (např. složka štábu, oddělení).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazená) | [Organizace](#lm-L031) | 0..1 | |
| (využívá) | [Místo velení](#lm-L003) | 0..* | |

---

<a id="lm-L003"></a>
## Třída: Místo velení

Specializace [L021](#lm-L021) se stereotypem `COMMAND_POST` (`CP`). Detailní zachycení je předmětem [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003).

---

<a id="lm-L033"></a>
## Třída: IER Grouping

Specializace [L021](#lm-L021) se stereotypem `IER_GROUPING`. Skupina/seskupení IER pro účely tematického vyhledávání nebo schvalování dohromady.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (aggregation) | [Informační tok IER](#lm-L023) | 0..* | Sdružuje |

---

<a id="lm-L034"></a>
## Třída: Infrastrukturní služba

Specializace [L021](#lm-L021) se stereotypem `INFRASTRUCTURE_SERVICE` (`SRV`). **Read-only** stereotyp – uživatel ji nemůže přidávat ani editovat vztahy. Detail viz [RQU005 Katalog služeb](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md).

---

<a id="lm-L035"></a>
## Třída: Aplikační služba

Specializace [L021](#lm-L021) se stereotypem `APPLICATION_SERVICE` (`APL`). **Read-only** stereotyp – uživatel ji nemůže přidávat ani editovat vztahy. Detail viz [RQU005](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md).

---

<a id="lm-L036"></a>
## Třída: CIS Aplikace

Specializace [L021](#lm-L021) se stereotypem `CIS_APPLICATION` (`CISAPP`). Konkrétní aplikační software (komunikační/informační systém). Editovatelná.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (provádí) | [Technologická interakce TIN](#lm-L025) | 0..* | |
| (využívá) | [Aplikační služba](#lm-L035) | 0..* | |

---

<a id="lm-L037"></a>
## Třída: CIS Zařízení

Specializace [L021](#lm-L021) se stereotypem `CIS_DEVICE` (`CISDEV`). Konkrétní hardware (radiostanice, terminál, server).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (provádí) | [Technologická interakce TIN](#lm-L025) | 0..* | |
| (využívá) | [Infrastrukturní služba](#lm-L034) | 0..* | |

---

<a id="lm-L038"></a>
## Třída: Vztah

Vztah mezi dvěma prvky modelu. DTO `RelationshipDetailDto` (`/coco/web-app/src/client/model/ModelApiClient.tsx:113`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Typ vztahu | type | typVztahu_E | Ano | Jeden z 9 ArchiMate typů (viz [E030](#lm-E030)). |
| 3 | Vlastnosti | properties | text/JSON_T | Ne | Pole `RelationshipPropertyDto[]` (identifier, name, type, value). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| sourceElement | [Element modelu](#lm-L021) | 1 | Zdrojový prvek |
| targetElement | [Element modelu](#lm-L021) | 1 | Cílový prvek |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Vztah je orientovaný (source → target). |
| 2 | Žádná netriviální změna vztahu se neaplikuje přímo – musí projít Patch Request workflow. |

---

<a id="lm-L039"></a>
## Třída: Patch Request

Návrh na změnu vztahů v modelu. DTO `RelationshipPatchRequestDto` (`/coco/web-app/src/client/model/ModelApiClient.tsx:139`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Obsah žádosti | requestContent | komplex_C | Ano | DTO `RelationshipPatchRequestCreateDto` – pole `elementsToCreate`, `toAdd`, `toDelete`, `referentialElementId`. |
| 3 | Obsah schválení | approveContent | komplex_C | Ne | Konečný obsah po případné úpravě schvalovatelem. |
| 4 | Žadatel | requestedBy | text256_T | Ano | Uživatel, který vytvořil žádost. |
| 5 | Žádáno dne | requestedAt | datumCas_T | Ano | |
| 6 | Uzavřeno kým | closedBy | text256_T | Ne | Schvalovatel (po APPROVED/REJECTED). |
| 7 | Uzavřeno dne | closedAt | datumCas_T | Ne | |
| 8 | Stav | state | stavPatchRequestu_E | Ano | `REQUESTED` / `APPROVED` / `REJECTED` (viz [E032](#lm-E032)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| referentialElementId | [Element modelu](#lm-L021) | 1 | „Referenční" element, jehož vztahy se mění |
| (k vytvoření) | [Element modelu](#lm-L021) | 0..* | Elementy v `elementsToCreate` |
| (k přidání) | [Vztah](#lm-L038) | 0..* | Nové vztahy v `toAdd` |
| (k odebrání) | [Vztah](#lm-L038) | 0..* | Vztahy ke smazání v `toDelete` |

### Stavová pravidla

| # | Pravidlo |
|---|---|
| 1 | Vytvoření žádosti: stav `REQUESTED`. |
| 2 | Schválení: stav → `APPROVED`, `closedBy`/`closedAt` vyplněny, změny aplikovány do modelu. |
| 3 | Zamítnutí: stav → `REJECTED`, `closedBy`/`closedAt` vyplněny, žádné změny v modelu. |
| 4 | Žadatel nemůže schválit vlastní žádost (rozdělení rolí). |

Stavový diagram patch requestu viz [SM-L039](06_stavove_diagramy.md#sm-L039).

---

<a id="lm-L040"></a>
## Třída: Subkategorie MCA schopnosti

Subkategorie spojená s MCA schopností. DTO `McaCapabilitySubcategoryDto` (`/coco/web-app/src/client/post/CommandPostApiClient.tsx:72`). Detail evidence vazby na MV viz [RQU002 L007](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L007).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Název | name | text256_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [MCA Schopnost](#lm-L022) | 1 | Subkategorie patří pod schopnost |

---

## Číselníky (Enumerace)

<a id="lm-E028"></a>
### stereotyp_E

17 stereotypů doménového modelu (`/coco/web-app/src/content/model/stereotype/ModelStereotype.ts`). Sjednocuje doménové třídy L022–L037.

| Hodnota (kód) | Stereotyp | Třída | Popis |
|---|---|---|---|
| `CAP` | MCA_CAPABILITY | [L022](#lm-L022) | MCA Schopnost |
| `IER` | INFORMATION_EXCHANGE_REQUIREMENT | [L023](#lm-L023) | Informační tok |
| `IP` | INFORMATION_PRODUCT | [L024](#lm-L024) | Informační produkt |
| `TIN` | TECHNOLOGY_INTERACTION | [L025](#lm-L025) | Technologická interakce |
| `ROLE` | ROLE | [L026](#lm-L026) | Role |
| `POSITION` | POSITION | [L027](#lm-L027) | Pozice |
| `BA` | BUSINESS_ACTIVITY | [L028](#lm-L028) | Obchodní aktivita |
| `BP` | BUSINESS_PROCESS | [L029](#lm-L029) | Obchodní proces |
| `PI` | PROCEDURAL_INSTRUCTION | [L030](#lm-L030) | Procedurální instrukce |
| `ORG` | ORG | [L031](#lm-L031) | Organizace |
| `OU` | ORGANIZATIONAL_UNIT | [L032](#lm-L032) | Organizační jednotka |
| `CP` | COMMAND_POST | [L003](#lm-L003) | Místo velení |
| `IER_GROUPING` | IER_GROUPING | [L033](#lm-L033) | Seskupení IER |
| `SRV` | INFRASTRUCTURE_SERVICE | [L034](#lm-L034) | Infrastrukturní služba (read-only) |
| `APL` | APPLICATION_SERVICE | [L035](#lm-L035) | Aplikační služba (read-only) |
| `CISAPP` | CIS_APPLICATION | [L036](#lm-L036) | CIS Aplikace |
| `CISDEV` | CIS_DEVICE | [L037](#lm-L037) | CIS Zařízení |

---

<a id="lm-E029"></a>
### archiMateTyp_E

15 ArchiMate typů. Source: enum `ArchiMateType` (`/coco/web-app/src/client/model/ModelApiClient.tsx:88`).

| Hodnota | Popis |
|---|---|
| `APPLICATION_COMPONENT` | Aplikační komponenta |
| `APPLICATION_SERVICE` | Aplikační služba |
| `BUSINESS_ACTOR` | Obchodní aktér |
| `BUSINESS_INTERACTION` | Obchodní interakce |
| `BUSINESS_OBJECT` | Obchodní objekt |
| `BUSINESS_PROCESS` | Obchodní proces |
| `BUSINESS_ROLE` | Obchodní role |
| `CAPABILITY` | Schopnost |
| `COURSE_OF_ACTION` | Plán postupu |
| `DELIVERABLE` | Výstup/dodávka |
| `DEVICE` | Zařízení |
| `FACILITY` | Objekt/zařízení (facility) |
| `GROUPING` | Seskupení |
| `TECHNOLOGY_INTERACTION` | Technologická interakce |
| `TECHNOLOGY_SERVICE` | Technologická služba |

---

<a id="lm-E030"></a>
### typVztahu_E

9 ArchiMate typů vztahů. Source: enum `RelationshipType` (`/coco/web-app/src/client/model/ModelApiClient.tsx:76`).

| Hodnota | Popis |
|---|---|
| `ACCESS` | Přístup (čtení/zápis) |
| `AGGREGATION` | Agregace |
| `ASSIGNMENT` | Přiřazení |
| `ASSOCIATION` | Asociace |
| `COMPOSITION` | Kompozice |
| `FLOW` | Tok |
| `REALIZATION` | Realizace |
| `SERVING` | Obslužnost (serving) |
| `TRIGGERING` | Spouštění |

---

<a id="lm-E031"></a>
### stavPřekladu_E

Stav překladu prvku modelu. Source: enum `ElementTranslationStatus` (`/coco/web-app/src/client/model/ModelApiClient.tsx:39`).

| Hodnota | Popis |
|---|---|
| `AI_TRANSLATED` | Výchozí stav – CZ verze automaticky vygenerovaná |
| `UPDATED` | Uživatel ručně upravil CZ překlad, ale není schválen |
| `APPROVED` | CZ překlad schválen kompetentní osobou |

---

<a id="lm-E032"></a>
### stavPatchRequestu_E

Stav workflow Patch Requestu. Source: enum `RelationshipPatchRequestState` (`/coco/web-app/src/client/model/ModelApiClient.tsx:150`).

| Hodnota | Popis |
|---|---|
| `REQUESTED` | Žádost vytvořena, čeká na schválení |
| `APPROVED` | Žádost schválena, změny aplikovány do modelu |
| `REJECTED` | Žádost zamítnuta, žádné změny |

---

<a id="lm-E033"></a>
### kódZemě_E

Kód země podle ISO/STANAG 1059. Sdílený číselník s [RQU002 E006 země_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E006).

> Detailní výčet hodnot a sloupec ISO3 viz [RQU002 E006](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E006).
