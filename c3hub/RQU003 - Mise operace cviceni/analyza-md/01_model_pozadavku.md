# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Plánovač velení nebo pracovník generálního štábu, který zakládá a edituje mise/operace/cvičení, plánuje informační interakce mezi místy velení, definuje velitelské vazby (C2), generuje výstupy (report, CIS matice) a spravuje životní cyklus mise (zneplatnění / obnovení). |
| **Systém C3 HUB** | Vlastní aplikace COCO – persistuje mise a jejich interakce, řídí životní cyklus (platná / zneplatněná), generuje exporty a propojuje s modelem SVŘ (IER, TIN, MV). |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Vést evidenci misí, operací a cvičení s jejich základní specifikací (název, popis, druhy mise, vlastnické MV) a životním cyklem (platná / zneplatněná / obnovená). |
| **C02** | Umožnit plánování **informačních interakcí** mezi místy velení v rámci mise – které IER/TIN toky probíhají mezi kterými MV, s definovaným operačním tempem (PACE). |
| **C03** | Umožnit definici **velitelských vazeb (C2 relationships)** mezi MV v misi dle NATO typologie (FULLCOM, OPCOM, OPCON, TACOM, TACON, ADCON, LOGCON). |
| **C04** | Poskytovat grafickou vizualizaci mise (graf interakcí, graf C2 vazeb, graf společných/bojových funkcí) s uložitelným rozložením. |
| **C05** | Generovat tisknutelné výstupy mise – report (PDF) a CIS matici (XLSX) z pohledu konkrétního MV. |

---

## Funkční požadavky

<a id="fr-FR01"></a>
### FR01 – Přehled misí

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit přehled misí ve dvou skupinách: **aktivní mise** a **zneplatněné mise**. Každá mise je dlaždice s názvem, popisem a akcemi (aktivní dlaždice: Report, Graf, Upravit; zneplatněná dlaždice: Obnovit). Uživatel může založit novou misi tlačítkem **+ Přidat**. |
| **Návrh řešení** | `«Form» MisePage` (URL `/web/missions`) se dvěma panely: Mise (aktivní), Zneplatněné mise. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC001](02_use_case_model.md#uc-UC001)

---

<a id="fr-FR02"></a>
### FR02 – Vytvoření a editace mise

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Umožnit vytvoření nové mise (dialog s poli Název, Popis, Druhy mise – multi-select, Vlastnické MV) a editaci existující. Druhy mise jsou entity (cross-link na [RQU004 model](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)); Vlastnické MV je výběr z [RQU002 Karty MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/README.md). Povinné: Název, Vlastnické MV, alespoň jeden Druh mise. |
| **Návrh řešení** | `«Form modal» MiseVytvoření` a `«Form modal» MiseEditaceDetailu` s validací povinných polí. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC002](02_use_case_model.md#uc-UC002), [UC003](02_use_case_model.md#uc-UC003)

---

<a id="fr-FR03"></a>
### FR03 – Duplikace mise

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Umožnit duplikaci existující mise jako šablonu pro novou – uživatel zadá název nové mise, systém zkopíruje specifikaci, interakce a C2 vazby. |
| **Návrh řešení** | `«Form modal» MiseDuplikace` s jedním polem (Název nové mise). |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC004](02_use_case_model.md#uc-UC004)

---

<a id="fr-FR04"></a>
### FR04 – Životní cyklus mise (zneplatnění / obnovení)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Mise má životní cyklus: **platná** ↔ **zneplatněná**. Zneplatnění (s potvrzením, z patičky detailu mise) přesune misi do skupiny „Zneplatněné mise", zachová data a zaznamená kdo/kdy (`invalidatedBy`, `invalidatedAt`). Obnovení (s potvrzením, z dlaždice zneplatněné mise) vrátí misi mezi aktivní (`restoredBy`, `restoredAt`). Dostupnost akcí řídí ACL (`canInvalidate`, `canRestore`). |
| **Návrh řešení** | `«Form modal» MiseZneplatněníPotvrzení`; obnovení přes generický potvrzovací dialog. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC005](02_use_case_model.md#uc-UC005), [UC006](02_use_case_model.md#uc-UC006)

> **Verze: RQU003** – z FR04 vypuštěno **smazání mise**. Endpoint `DELETE /missions/{id}` a ACL `canDelete` v API existují, ale v UI aplikace COCO nejsou nikde vystaveny – mazání není dostupné. Původní UC007 „Smazat misi" byl revizí zrušen.

---

<a id="fr-FR05"></a>
### FR05 – Plánování informačních interakcí mise

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V detailu mise (záložka **Interakce**) uživatel plánuje informační interakce mezi MV. Interakce je definována zdrojovým MV, cílovým MV, IER tokem, TIN technologickou interakcí a operačním tempem (**PACE**: PRIMARY / ALTERNATE / CONTINGENCY / EMERGENCY). Plánování probíhá z **pohledu konkrétního MV** (`pointOfViewCommandPost`) ve **stromovém gridu** s hierarchií IER → MV → TIN. Mód `CAPABILITIES` (dle schopností) je jediný funkční; mód `COMMAND_POSTS` je v UI nedostupný (`disabled`). |
| **Návrh řešení** | `«Form area» MiseInterakcePanel` s výběrem POV MV a stromovým `«Form grid area» MisePlanningGrid`; dialogy Výběr IER a Konfigurace interakcí MV. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC008](02_use_case_model.md#uc-UC008)

---

<a id="fr-FR06"></a>
### FR06 – Správa velitelských vazeb C2

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V detailu mise (záložka **Velení a řízení**) uživatel definuje velitelské vazby mezi MV. Vazba C2 je orientovaná (nadřízené MV → podřízené MV) a má typ dle NATO typologie: **FULLCOM** (Full Command), **OPCOM** (Operational Command), **OPCON** (Operational Control), **TACOM** (Tactical Command), **TACON** (Tactical Control), **ADCON** (Administrative Control), **LOGCON** (Logistic Control). |
| **Návrh řešení** | `«Form area» C2VazbyPanel` s `«Form grid area» C2VazbyGrid` a `«Form modal» C2VazbaVytvoření`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC009](02_use_case_model.md#uc-UC009)

---

<a id="fr-FR07"></a>
### FR07 – Grafická vizualizace mise

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Graf mise nabízí **5 pohledů**: **C2** (velitelská hierarchie), **IER**, **IP**, **TIN** (informační interakce) a **Společné a bojové funkce**. Uživatel může přesouvat uzly; rozložení se ukládá automaticky při tažení (`MissionGraphLayoutDto` – `nodePositions`). |
| **Návrh řešení** | `«Form modal» MiseGrafDialog` s 3 vizualizátory a uložitelným layoutem. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC010](02_use_case_model.md#uc-UC010)

---

<a id="fr-FR08"></a>
### FR08 – CIS matice mise

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Z detailu mise lze pro konkrétní MV vygenerovat **CIS matici** (matici minimálních požadavků na KIP) – jednak interaktivně v dialogu, jednak jako stažitelný XLSX (`generateCisMatrixReport(missionId, commandPostId)`). |
| **Návrh řešení** | `«Form modal» MiseCISMaticeDialog` s interaktivním gridem; export XLSX. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC011](02_use_case_model.md#uc-UC011)

---

<a id="fr-FR09"></a>
### FR09 – Report mise (PDF)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Z přehledu misí (tlačítko REPORT na dlaždici) lze vygenerovat souhrnný **report mise** (PDF) přes dialog s volbou varianty (BASIC / COMPLETE) a klasifikace (OFFICIAL / RESTRICTED). Jazyk reportu se přebírá automaticky z jazyka aplikace. |
| **Návrh řešení** | `«Form modal» MiseReportMožnosti`; endpoint `generateMissionReport`. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC012](02_use_case_model.md#uc-UC012)

---

## Souhrnná tabulka realizace

| FR | UC001 | UC002 | UC003 | UC004 | UC005 | UC006 | UC008 | UC009 | UC010 | UC011 | UC012 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR01** | X | | | | | | | | | | |
| **FR02** | | X | X | | | | | | | | |
| **FR03** | | | | X | | | | | | | |
| **FR04** | | | | | X | X | | | | | |
| **FR05** | | | | | | | X | | | | |
| **FR06** | | | | | | | | X | | | |
| **FR07** | | | | | | | | | X | | |
| **FR08** | | | | | | | | | | X | |
| **FR09** | | | | | | | | | | | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
