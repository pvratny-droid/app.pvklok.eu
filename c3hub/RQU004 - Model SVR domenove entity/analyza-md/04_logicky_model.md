# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L001](#lm-L001) | Element modelu (generický) | element | Abstraktní třída |
| [L002](#lm-L002) | MCA Schopnost | mcaCapability | Třída (stereotyp `CAP`) |
| [L003](#lm-L003) | Informační tok IER | ier | Třída (stereotyp `IER`) |
| [L004](#lm-L004) | Informační produkt IP | informationProduct | Třída (stereotyp `IP`) |
| [L005](#lm-L005) | Technologická interakce TIN | tin | Třída (stereotyp `TIN`) |
| [L006](#lm-L006) | Role | role | Třída (stereotyp `ROLE`) |
| [L007](#lm-L007) | Pozice | position | Třída (stereotyp `POSITION`) |
| [L008](#lm-L008) | Aktivita | businessActivity | Třída (stereotyp `BA`) |
| [L009](#lm-L009) | Proces | businessProcess | Třída (stereotyp `BP`) |
| [L010](#lm-L010) | Procedurální instrukce | proceduralInstruction | Třída (stereotyp `PI`) |
| [L011](#lm-L011) | Organizace | org | Třída (stereotyp `ORG`) |
| [L012](#lm-L012) | Organizační jednotka | organizationalUnit | Třída (stereotyp `OU`) |
| [L013](#lm-L013) | Místo velení | commandPost | Třída (stereotyp `CP`) – viz [RQU002 L001](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L001) |
| [L014](#lm-L014) | IER Grouping | ierGrouping | Třída (stereotyp `IER_GROUPING`) |
| [L015](#lm-L015) | Infrastrukturní služba | infrastructureService | Třída (stereotyp `SRV`, read-only) |
| [L016](#lm-L016) | Aplikační služba | applicationService | Třída (stereotyp `APL`, read-only) |
| [L017](#lm-L017) | CIS Aplikace | cisApplication | Třída (stereotyp `CISAPP`) |
| [L018](#lm-L018) | CIS Zařízení | cisDevice | Třída (stereotyp `CISDEV`) |
| [L019](#lm-L019) | Vztah | relationship | Třída |
| [L020](#lm-L020) | Patch Request | patchRequest | Třída |
| [L021](#lm-L021) | Subkategorie MCA schopnosti | mcaSubcategory | Vazební třída |
| [E001](#lm-E001) | stereotyp_E | stereotyp_E | Číselník |
| [E002](#lm-E002) | archiMateTyp_E | archiMateTyp_E | Číselník |
| [E003](#lm-E003) | typVztahu_E | typVztahu_E | Číselník |
| [E004](#lm-E004) | stavPřekladu_E | stavPrekladu_E | Číselník |
| [E005](#lm-E005) | stavPatchRequestu_E | stavPatchRequestu_E | Číselník |
| [E006](#lm-E006) | kódZemě_E | kodZeme_E | Číselník |

> **Reverse-engineering RQU004** – třídy a číselníky vychází ze zdrojových kódů C3HUB (`/coco/web-app/src/client/model/ModelApiClient.tsx` a `/coco/web-app/src/content/model/`). Všech 17 stereotypů je definováno v enumu `Stereotype` resp. `ModelStereotype`. 9 typů vztahů v enumu `RelationshipType`. 15 ArchiMate typů v enumu `ArchiMateType`. Třída [L001](#lm-L001) reprezentuje sdílené atributy `ElementDto`, ze které jsou ostatní (L002–L018) dědící konkretizací podle stereotypu.

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L001"></a>
## Třída: Element modelu (generický)

Abstraktní generická entita reprezentující jakýkoli prvek doménového modelu. DTO `ElementDto` (`/coco/web-app/src/client/model/ModelApiClient.tsx:20`). Konkrétní stereotyp určuje, o jaký doménový prvek jde (viz L002–L018).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | UUID prvku (DTO `id`). |
| 2 | ArchiMate typ | type | archiMateTyp_E | Ne | DTO `type` – jeden z 15 ArchiMate typů (viz [E002](#lm-E002)). |
| 3 | Stereotyp | stereotype | stereotyp_E | Ne | DTO `stereotype` – jeden z 17 stereotypů (viz [E001](#lm-E001)). |
| 4 | Kód (S5636) | s5636Identifier | kod_T | Ne | NATO/STANAG 5636 identifikátor; v gridech sloupec **Kód**. |
| 5 | Název EN | name | text256_T | Ne | Anglický název. |
| 6 | Název CZ | nameCz | text256_T | Ne | Český název. |
| 7 | Popis EN | description | text2000/CLOB_T | Ne | Anglický popis. |
| 8 | Popis CZ | descriptionCz | text2000/CLOB_T | Ne | Český popis. |
| 9 | Stav překladu | translationStatus | stavPřekladu_E | Ne | `AI_TRANSLATED` / `UPDATED` / `APPROVED` (viz [E004](#lm-E004)). |
| 10 | Obrázek | image | text256_T | Ne | DTO `image` – obrazový asset (filename). |
| 11 | Kód země | countryCode | kódZemě_E | Ne | DTO `countryCode` – ISO kód země (viz [E006](#lm-E006)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| type | [archiMateTyp_E](#lm-E002) | 0..1 | |
| stereotype | [stereotyp_E](#lm-E001) | 0..1 | |
| translationStatus | [stavPřekladu_E](#lm-E004) | 0..1 | |
| countryCode | [kódZemě_E](#lm-E006) | 0..1 | |
| (vychází z) | [Vztah](#lm-L019) | 0..* | Vstupní i výstupní vztahy |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Atribut `stereotype` musí odpovídat jednomu z 17 stereotypů. Konkrétní hodnota určuje, do které specializace (L002–L018) element patří. |
| 2 | Pole `translationStatus` se mění dle workflow: `AI_TRANSLATED` (výchozí po prvotním automatickém překladu) → `UPDATED` (uživatel upravil CZ verzi) → `APPROVED` (CZ verze schválena). |
| 3 | Změna `nameCz` nebo `descriptionCz` automaticky přepne `translationStatus` na `UPDATED`. |

---

<a id="lm-L002"></a>
## Třída: MCA Schopnost

Specializace [L001](#lm-L001) se stereotypem `MCA_CAPABILITY` (`CAP`). Reprezentuje jednu položku v MCA modelu schopností.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [Subkategorie MCA schopnosti](#lm-L021) | 0..* | DTO `McaCapabilitySubcategoryDto[]`; vazba na strom subkategorií |
| (přes vazbu MV ↔ schopnost) | [RQU002 L005 Schopnost MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L005) | 0..* | „Relevantní MV" |

### Specifické chování

| # | Pravidlo |
|---|---|
| 1 | Editace vztahů je v ElementsTable **zakázaná** (`isEditRelationshipsEnabled = false` pro MCA). Vztahy jsou spravované jinde (přes capability spec MV). |
| 2 | Akce „Relevantní MV" zobrazí seznam MV, které schopnost deklarují (cross-link z RQU002). |
| 3 | Uživatel nemůže přidávat MCA schopnosti přímo přes „+ Přidat" v RQU004 – schopnosti vznikají systémově. |

---

<a id="lm-L003"></a>
## Třída: Informační tok IER

Specializace [L001](#lm-L001) se stereotypem `INFORMATION_EXCHANGE_REQUIREMENT` (`IER`). Reprezentuje požadavek na výměnu informací mezi dvěma rolemi/místy velení.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přes vztah typu) | [Role](#lm-L006) | 0..* | Producer / consumer role |
| (přes vztah typu FLOW) | [Informační produkt IP](#lm-L004) | 0..* | IP nesený tokem |
| (vazba MV ↔ IER) | [RQU002 L006 Tok IER na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) | 0..* | |
| (graf) | sebe a vše napojené | 0..* | Endpoint `GET /model/graphs/ier/{ierId}` |

---

<a id="lm-L004"></a>
## Třída: Informační produkt IP

Specializace [L001](#lm-L001) se stereotypem `INFORMATION_PRODUCT` (`IP`). Konkrétní informační artefakt (dokument, datová zpráva, hlášení).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přes vztah typu FLOW) | [Informační tok IER](#lm-L003) | 0..* | IP nesený toky |
| (vazba MV ↔ IP) | [RQU002 L007 Tok IP na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L007) | 0..* | |

---

<a id="lm-L005"></a>
## Třída: Technologická interakce TIN

Specializace [L001](#lm-L001) se stereotypem `TECHNOLOGY_INTERACTION` (`TIN`). Reprezentuje technologickou (datovou/komunikační) realizaci výměny informací mezi CIS aplikacemi/zařízeními.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (realizuje) | [Informační tok IER](#lm-L003) | 0..* | TIN je technickou realizací IER |
| (provádí) | [CIS Aplikace](#lm-L017) / [CIS Zařízení](#lm-L018) | 0..* | Endpoint `findTinToAppDeviceGraph` |

---

<a id="lm-L006"></a>
## Třída: Role

Specializace [L001](#lm-L001) se stereotypem `ROLE`. Funkční role na místě velení (např. „Velitel J3", „Důstojník logistiky").

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (přiřazení k pozici) | [RQU002 L011 Přiřazení role k pozici](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L011) | 0..* | |
| (přes IER) | [Informační tok IER](#lm-L003) | 0..* | Producer / consumer |

---

<a id="lm-L007"></a>
## Třída: Pozice

Specializace [L001](#lm-L001) se stereotypem `POSITION`. Konkrétní organizační pozice (instance role na konkrétním MV).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (cross-link) | [RQU002 L004 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 1 | Specifika pozice na MV se evidují tam |

---

<a id="lm-L008"></a>
## Třída: Aktivita

Specializace [L001](#lm-L001) se stereotypem `BUSINESS_ACTIVITY` (`BA`). Elementární obchodní aktivita.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (composition do) | [Proces](#lm-L009) | 0..* | BA je součástí BP |

---

<a id="lm-L009"></a>
## Třída: Proces

Specializace [L001](#lm-L001) se stereotypem `BUSINESS_PROCESS` (`BP`). Vyšší obchodní proces obsahující jednu nebo více aktivit.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (composition) | [Aktivita](#lm-L008) | 0..* | |
| (přiřazení k roli) | [Role](#lm-L006) | 0..* | |

---

<a id="lm-L010"></a>
## Třída: Procedurální instrukce

Specializace [L001](#lm-L001) se stereotypem `PROCEDURAL_INSTRUCTION` (`PI`). FMN procedurální instrukce (např. „Instructions for Fire Support").

### Specifické chování

| # | Pravidlo |
|---|---|
| 1 | Editace vztahů je v ElementsTable **zakázaná** (jako u MCA Schopnosti). |
| 2 | Vazba na IER: endpoint `POST /model/procedural-instructions/{piId}:search-information-exchange-requirements`. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (realizuje) | [Informační tok IER](#lm-L003) | 0..* | |
| (vazba na MV) | [RQU002 L008 FMN instrukce na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L008) | 0..* | |
| (vazba na funkce) | [RQU006 funkce](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/README.md) | 0..* | Vazební tabulka FMN PI ↔ Společné/bojové funkce |

---

<a id="lm-L011"></a>
## Třída: Organizace

Specializace [L001](#lm-L001) se stereotypem `ORG`. Reprezentuje organizační jednotku nejvyšší úrovně (NATO velitelství, národní MO, …).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [Organizační jednotka](#lm-L012) | 0..* | |

---

<a id="lm-L012"></a>
## Třída: Organizační jednotka

Specializace [L001](#lm-L001) se stereotypem `ORGANIZATIONAL_UNIT` (`OU`). Podřízená organizační složka (např. složka štábu, oddělení).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazená) | [Organizace](#lm-L011) | 0..1 | |
| (využívá) | [Místo velení](#lm-L013) | 0..* | |

---

<a id="lm-L013"></a>
## Třída: Místo velení

Specializace [L001](#lm-L001) se stereotypem `COMMAND_POST` (`CP`). Detailní zachycení je předmětem [RQU002 L001 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L001).

---

<a id="lm-L014"></a>
## Třída: IER Grouping

Specializace [L001](#lm-L001) se stereotypem `IER_GROUPING`. Skupina/seskupení IER pro účely tematického vyhledávání nebo schvalování dohromady.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (aggregation) | [Informační tok IER](#lm-L003) | 0..* | Sdružuje |

---

<a id="lm-L015"></a>
## Třída: Infrastrukturní služba

Specializace [L001](#lm-L001) se stereotypem `INFRASTRUCTURE_SERVICE` (`SRV`). **Read-only** stereotyp – uživatel ji nemůže přidávat ani editovat vztahy. Detail viz [RQU005 Katalog služeb](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md).

---

<a id="lm-L016"></a>
## Třída: Aplikační služba

Specializace [L001](#lm-L001) se stereotypem `APPLICATION_SERVICE` (`APL`). **Read-only** stereotyp – uživatel ji nemůže přidávat ani editovat vztahy. Detail viz [RQU005](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md).

---

<a id="lm-L017"></a>
## Třída: CIS Aplikace

Specializace [L001](#lm-L001) se stereotypem `CIS_APPLICATION` (`CISAPP`). Konkrétní aplikační software (komunikační/informační systém). Editovatelná.

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (provádí) | [Technologická interakce TIN](#lm-L005) | 0..* | |
| (využívá) | [Aplikační služba](#lm-L016) | 0..* | |

---

<a id="lm-L018"></a>
## Třída: CIS Zařízení

Specializace [L001](#lm-L001) se stereotypem `CIS_DEVICE` (`CISDEV`). Konkrétní hardware (radiostanice, terminál, server).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (provádí) | [Technologická interakce TIN](#lm-L005) | 0..* | |
| (využívá) | [Infrastrukturní služba](#lm-L015) | 0..* | |

---

<a id="lm-L019"></a>
## Třída: Vztah

Vztah mezi dvěma prvky modelu. DTO `RelationshipDetailDto` (`/coco/web-app/src/client/model/ModelApiClient.tsx:113`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Typ vztahu | type | typVztahu_E | Ano | Jeden z 9 ArchiMate typů (viz [E003](#lm-E003)). |
| 3 | Vlastnosti | properties | text/JSON_T | Ne | Pole `RelationshipPropertyDto[]` (identifier, name, type, value). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| sourceElement | [Element modelu](#lm-L001) | 1 | Zdrojový prvek |
| targetElement | [Element modelu](#lm-L001) | 1 | Cílový prvek |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Vztah je orientovaný (source → target). |
| 2 | Žádná netriviální změna vztahu se neaplikuje přímo – musí projít Patch Request workflow. |

---

<a id="lm-L020"></a>
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
| 8 | Stav | state | stavPatchRequestu_E | Ano | `REQUESTED` / `APPROVED` / `REJECTED` (viz [E005](#lm-E005)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| referentialElementId | [Element modelu](#lm-L001) | 1 | „Referenční" element, jehož vztahy se mění |
| (k vytvoření) | [Element modelu](#lm-L001) | 0..* | Elementy v `elementsToCreate` |
| (k přidání) | [Vztah](#lm-L019) | 0..* | Nové vztahy v `toAdd` |
| (k odebrání) | [Vztah](#lm-L019) | 0..* | Vztahy ke smazání v `toDelete` |

### Stavová pravidla

| # | Pravidlo |
|---|---|
| 1 | Vytvoření žádosti: stav `REQUESTED`. |
| 2 | Schválení: stav → `APPROVED`, `closedBy`/`closedAt` vyplněny, změny aplikovány do modelu. |
| 3 | Zamítnutí: stav → `REJECTED`, `closedBy`/`closedAt` vyplněny, žádné změny v modelu. |
| 4 | Žadatel nemůže schválit vlastní žádost (rozdělení rolí). |

Stavový diagram patch requestu viz [SM-L020](06_stavove_diagramy.md#sm-L020).

---

<a id="lm-L021"></a>
## Třída: Subkategorie MCA schopnosti

Subkategorie spojená s MCA schopností. DTO `McaCapabilitySubcategoryDto` (`/coco/web-app/src/client/post/CommandPostApiClient.tsx:72`). Detail evidence vazby na MV viz [RQU002 L005](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L005).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Název | name | text256_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [MCA Schopnost](#lm-L002) | 1 | Subkategorie patří pod schopnost |

---

## Číselníky (Enumerace)

<a id="lm-E001"></a>
### stereotyp_E

17 stereotypů doménového modelu (`/coco/web-app/src/content/model/stereotype/ModelStereotype.ts`). Sjednocuje doménové třídy L002–L018.

| Hodnota (kód) | Stereotyp | Třída | Popis |
|---|---|---|---|
| `CAP` | MCA_CAPABILITY | [L002](#lm-L002) | MCA Schopnost |
| `IER` | INFORMATION_EXCHANGE_REQUIREMENT | [L003](#lm-L003) | Informační tok |
| `IP` | INFORMATION_PRODUCT | [L004](#lm-L004) | Informační produkt |
| `TIN` | TECHNOLOGY_INTERACTION | [L005](#lm-L005) | Technologická interakce |
| `ROLE` | ROLE | [L006](#lm-L006) | Role |
| `POSITION` | POSITION | [L007](#lm-L007) | Pozice |
| `BA` | BUSINESS_ACTIVITY | [L008](#lm-L008) | Obchodní aktivita |
| `BP` | BUSINESS_PROCESS | [L009](#lm-L009) | Obchodní proces |
| `PI` | PROCEDURAL_INSTRUCTION | [L010](#lm-L010) | Procedurální instrukce |
| `ORG` | ORG | [L011](#lm-L011) | Organizace |
| `OU` | ORGANIZATIONAL_UNIT | [L012](#lm-L012) | Organizační jednotka |
| `CP` | COMMAND_POST | [L013](#lm-L013) | Místo velení |
| `IER_GROUPING` | IER_GROUPING | [L014](#lm-L014) | Seskupení IER |
| `SRV` | INFRASTRUCTURE_SERVICE | [L015](#lm-L015) | Infrastrukturní služba (read-only) |
| `APL` | APPLICATION_SERVICE | [L016](#lm-L016) | Aplikační služba (read-only) |
| `CISAPP` | CIS_APPLICATION | [L017](#lm-L017) | CIS Aplikace |
| `CISDEV` | CIS_DEVICE | [L018](#lm-L018) | CIS Zařízení |

---

<a id="lm-E002"></a>
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

<a id="lm-E003"></a>
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

<a id="lm-E004"></a>
### stavPřekladu_E

Stav překladu prvku modelu. Source: enum `ElementTranslationStatus` (`/coco/web-app/src/client/model/ModelApiClient.tsx:39`).

| Hodnota | Popis |
|---|---|
| `AI_TRANSLATED` | Výchozí stav – CZ verze automaticky vygenerovaná |
| `UPDATED` | Uživatel ručně upravil CZ překlad, ale není schválen |
| `APPROVED` | CZ překlad schválen kompetentní osobou |

---

<a id="lm-E005"></a>
### stavPatchRequestu_E

Stav workflow Patch Requestu. Source: enum `RelationshipPatchRequestState` (`/coco/web-app/src/client/model/ModelApiClient.tsx:150`).

| Hodnota | Popis |
|---|---|
| `REQUESTED` | Žádost vytvořena, čeká na schválení |
| `APPROVED` | Žádost schválena, změny aplikovány do modelu |
| `REJECTED` | Žádost zamítnuta, žádné změny |

---

<a id="lm-E006"></a>
### kódZemě_E

Kód země podle ISO/STANAG 1059. Sdílený číselník s [RQU002 E004 země_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E004).

> Detailní výčet hodnot a sloupec ISO3 viz [RQU002 E004](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E004).
