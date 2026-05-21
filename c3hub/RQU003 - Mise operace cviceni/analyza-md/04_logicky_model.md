# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L015](#lm-L015) | Mise | mission | Třída |
| [L016](#lm-L016) | Druh mise | missionType | Číselníková třída |
| [L017](#lm-L017) | Interakce mise | missionInteraction | Vazební třída |
| [L018](#lm-L018) | Velitelská vazba C2 | c2Relationship | Vazební třída |
| [L019](#lm-L019) | Rozložení grafu mise | missionGraphLayout | Třída |
| [L020](#lm-L020) | Export mise (audit log) | missionExport | Třída |
| [E024](#lm-E024) | operačníTempo_E | operacniTempo_E | Číselník |
| [E025](#lm-E025) | typC2Vazby_E | typC2Vazby_E | Číselník |
| [E026](#lm-E026) | variantaReportu_E | variantaReportu_E | Číselník |
| [E027](#lm-E027) | klasifikace_E | klasifikace_E | Číselník |

> **Reverse-engineering RQU003** – třídy a číselníky vychází ze zdrojových kódů C3HUB (`/coco/web-app/src/client/mission/MissionApiClient.tsx` a `/coco/web-app/src/content/mission/`). Druh mise (L016) je entita sdílená s [RQU002 L012 Druh mise MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L012) a [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L015"></a>
## Třída: Mise

Centrální entita modulu. Mise / operace / cvičení. DTO `MissionDto` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:14`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | UUID mise. |
| 2 | Název | name | text256_T | Ano | DTO `name`. |
| 3 | Popis | description | text2000/CLOB_T | Ne | DTO `description`. |
| 4 | Zneplatněna | invalidated | anoNe_T | Ano | DTO `invalidated` – `true` = mise je ve skupině „Zneplatněné mise". |
| 5 | Zneplatněno kým | invalidatedBy | text256_T | Ne | DTO `invalidatedBy`. |
| 6 | Zneplatněno dne | invalidatedAt | datumCas_T | Ne | DTO `invalidatedAt`. |
| 7 | Obnoveno kým | restoredBy | text256_T | Ne | DTO `restoredBy`. |
| 8 | Obnoveno dne | restoredAt | datumCas_T | Ne | DTO `restoredAt`. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| missionTypeIds | [Druh mise](#lm-L016) | 1..* | DTO `missionTypeIds: string[]`; povinné aspoň jeden |
| missionOwnerCommandPostId | [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) | 1 | Vlastnické MV mise |
| (kompozice) | [Interakce mise](#lm-L017) | 0..* | Informační interakce v misi |
| (kompozice) | [Velitelská vazba C2](#lm-L018) | 0..* | Velitelské vazby v misi |
| (kompozice) | [Rozložení grafu mise](#lm-L019) | 0..1 | Uložené pozice uzlů grafu |
| (kompozice) | [Export mise](#lm-L020) | 0..* | (navrhované) audit log exportů |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Mise musí mít vyplněn Název, Vlastnické MV a alespoň jeden Druh mise (validace v `MissionDetailsUpdateDialog.validate()`). |
| 2 | Životní cyklus: platná (`invalidated = false`) ↔ zneplatněná (`invalidated = true`). Viz [SM-L015](06_stavove_diagramy.md#sm-L015). |
| 3 | Dostupnost akcí (Upravit / Zneplatnit / Obnovit / Report) řídí ACL (`MissionAclDto`: `canUpdate`, `canInvalidate`, `canRestore`, `canGenerateReport`). DTO `MissionAclDto` obsahuje i pole `canDelete`, ale odpovídající akce smazání není v UI aplikace vystavena. |

---

<a id="lm-L016"></a>
## Třída: Druh mise

Druh mise / operace dle NATO (např. Peacemaking, Peacebuilding, Joint Operation, Multi-Domain Operations). DTO `MissionTypeDto` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:109`). Endpoint `findAllMissionTypes`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Název | name | text256_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (zařazení mise) | [Mise](#lm-L015) | 0..* | |
| (zařazení specifikace schopností MV) | [RQU002 L012 Druh mise MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L012) | 0..* | Sdílená entita |

---

<a id="lm-L017"></a>
## Třída: Interakce mise

Vazební třída – jedna informační interakce mezi dvěma MV v rámci mise. DTO `MissionInteractionDto` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:42`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Operační tempo | pace | operačníTempo_E | Ne | DTO `pace` – PRIMARY / ALTERNATE / CONTINGENCY / EMERGENCY (viz [E024](#lm-E024)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazený) | [Mise](#lm-L015) | 1 | |
| sourceCommandPostId | [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) | 1 | Zdrojové MV |
| targetCommandPostId | [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) | 1 | Cílové MV |
| ierId | [RQU004 L023 Informační tok IER](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L023) | 1 | IER tok |
| tinId | [RQU004 L025 Technologická interakce TIN](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L025) | 1 | TIN realizace |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Interakce spojuje dvě různá MV (source ≠ target). |
| 2 | Kombinace (mise, sourceCP, targetCP, ier, tin) je unikátní. |

---

<a id="lm-L018"></a>
## Třída: Velitelská vazba C2

Vazební třída – velitelská vazba mezi dvěma MV v rámci mise. DTO `C2RelationshipDto` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:82`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Typ vazby | type | typC2Vazby_E | Ano | DTO `type` – FULLCOM / OPCOM / OPCON / TACOM / TACON / ADCON / LOGCON (viz [E025](#lm-E025)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazený) | [Mise](#lm-L015) | 1 | |
| superordinateId | [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) | 1 | Nadřízené MV |
| subordinateId | [RQU002 L003 Místo velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) | 1 | Podřízené MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Vazba je orientovaná (nadřízené → podřízené); nadřízené ≠ podřízené. |
| 2 | Cyklické velitelské vazby jsou zakázané. |

---

<a id="lm-L019"></a>
## Třída: Rozložení grafu mise

Uložené rozložení uzlů v grafické vizualizaci mise. DTO `MissionGraphLayoutDto` / `MissionGraphLayoutDataDto` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:67`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Pozice uzlů | nodePositions | komplex_C | Ano | Mapa `elementId → {x, y, fx, fy}` (DTO `GraphPositionDto`). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazený) | [Mise](#lm-L015) | 1 | 0..1 layout na misi |

---

<a id="lm-L020"></a>
## Třída: Export mise (audit log)

Záznam o vygenerovaném exportu mise. Návrhová třída – source frontendu persistenci nepotvrzuje (`generateMissionReport` / `generateCisMatrixReport` vrací jen `FileDetail`).

> **Status: navrhovaný, neověřený.** Endpointy vracejí binární soubor; backendová evidence exportů není ze source ověřitelná.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Typ exportu | typ | text50_T | Ano | „Report mise" (PDF) / „CIS matice" (XLSX) |
| 3 | Varianta | varianta | variantaReportu_E | Ne | BASIC / COMPLETE (jen pro report) |
| 4 | Klasifikace | klasifikace | klasifikace_E | Ne | OFFICIAL / RESTRICTED |
| 5 | Jazyk | jazyk | text50_T | Ne | |
| 6 | Datum vygenerování | datumGenerovani | datumCas_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (nadřazený) | [Mise](#lm-L015) | 1 | |

---

## Číselníky (Enumerace)

<a id="lm-E024"></a>
### operačníTempo_E

Operační tempo (PACE) informační interakce. Source: enum `MissionInteractionPace` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:59`).

| Hodnota | Popis |
|---|---|
| `PRIMARY` | Primární tempo |
| `ALTERNATE` | Alternativní tempo |
| `CONTINGENCY` | Pohotovostní tempo |
| `EMERGENCY` | Nouzové tempo |

---

<a id="lm-E025"></a>
### typC2Vazby_E

Typ velitelské vazby dle NATO typologie. Source: enum `C2RelationshipType` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:99`).

| Hodnota | Popis |
|---|---|
| `FULLCOM` | Full Command – plné velení |
| `OPCOM` | Operational Command – operační velení |
| `OPCON` | Operational Control – operační řízení |
| `TACOM` | Tactical Command – taktické velení |
| `TACON` | Tactical Control – taktické řízení |
| `ADCON` | Administrative Control – administrativní řízení |
| `LOGCON` | Logistic Control – logistické řízení |

---

<a id="lm-E026"></a>
### variantaReportu_E

Varianta generovaného reportu mise. Source: `missionVariantOptions` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:129`).

| Hodnota | Popis |
|---|---|
| `BASIC` | Základní |
| `COMPLETE` | Kompletní |

---

<a id="lm-E027"></a>
### klasifikace_E

Klasifikace generovaného výstupu. Source: `missionClassificationOptions` (`/coco/web-app/src/client/mission/MissionApiClient.tsx:134`).

| Hodnota | Popis |
|---|---|
| `OFFICIAL` | Pro služební potřebu |
| `RESTRICTED` | Vyhrazené |
