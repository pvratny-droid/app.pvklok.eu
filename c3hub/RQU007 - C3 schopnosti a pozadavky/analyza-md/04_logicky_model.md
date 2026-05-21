# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L045](#lm-L045) | Požadavek na MV | requirement | Číselníková třída |
| [L046](#lm-L046) | Omezení MV | constraint | Číselníková třída |
| [L047](#lm-L047) | Taxonomie C3 schopností | c3CapabilityTaxonomy | Referenční dokument |
| [E020](#lm-E020) | požadavek_E | pozadavek_E | Číselník |
| [E019](#lm-E019) | omezení_E | omezeni_E | Číselník |

> **Reverse-engineering RQU007** – třídy a číselníky vychází ze zdrojových kódů C3HUB. Modul je v aktuální verzi UI **referenční**: požadavky a omezení jsou statická data (hardcoded v `RequirementsTableData.ts` a `ConstraintsTableData.ts`), C3 schopnosti jsou poskytnuty jako stažitelný PDF poster (`capabilities-taxonomy-poster.pdf`). Číselníky [E020](#lm-E020) / [E019](#lm-E019) jsou sdílené s [RQU002 specifikací MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) (atributy `requirements`, `constraints`).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L045"></a>
## Třída: Požadavek na MV

Referenční položka seznamu požadavků kladených na místa velení. Source: `requirementsData` (`/coco/web-app/src/content/requirements/RequirementsTableData.ts`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | cisloCele_T | Ano | Pořadí v seznamu (1–81). |
| 2 | Text požadavku | text | text2000/CLOB_T | Ano | Slovní popis požadavku (např. „MV disponuje vysokou balistickou ochranou."). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (specifikace MV) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Atribut `requirements` (multi-LOV) na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet požadavků pevný (81 položek). |
| 2 | Požadavky pokrývají tematické oblasti: balistická ochrana, mobilita/přepravitelnost, CBRN ochrana, napájení, ochrana perimetru, informační systémy, maskování, kapacita uživatelů, čas výstavby/opuštění, plošná distribuce služeb. |

---

<a id="lm-L046"></a>
## Třída: Omezení MV

Referenční položka seznamu omezení míst velení. Source: `constraintsData` (`/coco/web-app/src/content/requirements/ConstraintsTableData.ts`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | cisloCele_T | Ano | Pořadí v seznamu (1–12). |
| 2 | Text omezení | text | text2000/CLOB_T | Ano | Slovní popis omezení (např. „Schopnost MV je omezena pouze na 48 hodinový bojový úkol/mise na bojišti."). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (specifikace MV) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Atribut `constraints` (multi-LOV) na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet omezení pevný (12 položek). |
| 2 | Omezení pokrývají oblasti: doba bojového úkolu, konektivita/synchronizace, přepravitelnost vybavení, provozní teplota a chlazení, slaná voda, vlhkost, vyškolený personál, prašnost. |

---

<a id="lm-L047"></a>
## Třída: Taxonomie C3 schopností

Referenční dokument – poster taxonomie C3 schopností. Source: `capabilities-taxonomy-poster.pdf` (`/coco/web-app/src/content/dashboard/`).

> **Status: referenční dokument.** C3 schopnosti jsou v aktuální verzi UI poskytnuty pouze jako stažitelný PDF poster. Strukturovaná taxonomie není ze source frontendu vidět. Doménová entita „MCA schopnost" (s níž C3 schopnosti souvisejí) je předmětem [RQU004 L022 MCA Schopnost](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L022).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Soubor posteru | posterFile | text256_T | Ano | `capabilities-taxonomy-poster.pdf` |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (souvisí s) | [RQU004 L022 MCA Schopnost](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L022) | 0..* | Taxonomie zastřešuje doménové MCA schopnosti |

---

## Číselníky (Enumerace)

<a id="lm-E020"></a>
### požadavek_E

81 referenčních požadavků na MV. Source: `requirementsData`. Sdílený s [RQU002 E020 požadavek_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E020). Ukázka prvních hodnot:

| ID | Text |
|---|---|
| 1 | MV disponuje vysokou balistickou ochranou. |
| 4 | MV je mobilní. |
| 12 | MV disponuje centrální ochranou CBRN. |
| 17 | MV má schopnost C4ISTAR. |
| 30 | Počet uživatelů MV je do 5 osob. (družstvo, četa, rota) |
| 37 | Čas výstavby MV je max 30 minut. |
| 81 | Jednotlivec musí mít přístup na MV k základním službám (Hlas, VTC, chat, email, APV) |
| … | (celkem 81 položek – viz `RequirementsTableData.ts`) |

---

<a id="lm-E019"></a>
### omezení_E

12 referenčních omezení MV. Source: `constraintsData`. Sdílený s [RQU002 E019 omezení_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E019).

| ID | Text |
|---|---|
| 1 | Schopnost MV je omezena pouze na 48 hodinový bojový úkol/mise na bojišti. |
| 2 | Konektivita může bránit automatické synchronizaci a aktualizacím dat v reálném čase z reachbacku. |
| 3 | Vybavení musí být přenosné a přepravitelné na komerčních vzdušných/leteckých linkách. |
| 4 | Vybavení musí být přenosné a přepravitelné běžnými komerčními prostředky vlak/letadlo/loď |
| 5 | Provozní teplota vybavení je kritická a systém může vyžadovat chlazení. |
| 6 | Ponoření do slané vody a vystavení působení slané vody představuje riziko. |
| 7 | Vlhkost v rozsahu (až do 50%). |
| 8 | Vlhkost v rozsahu (až do 94%). |
| 9 | Výstavba a zprovoznění KIP musí být provedeno vyškoleným vojenským personálem. |
| 10 | Provozní teplota –25 °C až +25 °C. (kancelářské prostředí) |
| 11 | Provozní teplota –50 °C až +50 °C. (nasazení v bojových podmínkách) |
| 12 | Prašnost. |
