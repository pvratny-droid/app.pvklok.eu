# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L001](#lm-L001) | Společná funkce | jointFunction | Číselníková třída |
| [L002](#lm-L002) | Bojová funkce | combatFunction | Číselníková třída |
| [L003](#lm-L003) | Vazba funkce na procedurální instrukci | functionProceduralInstructionLink | Vazební třída |
| [E001](#lm-E001) | společnáFunkce_E | spolecnaFunkce_E | Číselník |
| [E002](#lm-E002) | bojováFunkce_E | bojovaFunkce_E | Číselník |

> **Reverse-engineering RQU006** – třídy a číselníky vychází ze zdrojových kódů C3HUB (`/coco/web-app/src/content/warfighting/JointWarfightingFunctionTableData.ts`). Modul je v aktuální verzi UI **referenční** – data společných a bojových funkcí jsou statická (hardcoded v `JointWarfightingFunctionTableData.ts`). Vazba na FMN procedurální instrukce ([L003](#lm-L003)) je business konstrukce odvozená z názvu stránky („Vazební tabulka na FMN Procedurální Instrukce") a propojení s [RQU004 L010](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L010) a [RQU002 L008](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L008).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L001"></a>
## Třída: Společná funkce

Doktrinální společná funkce SVŘ. Source: `joinFunctionsData` (`/coco/web-app/src/content/warfighting/JointWarfightingFunctionTableData.ts`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | cisloCele_T | Ano | Pořadí v tabulce (1–8). |
| 2 | Název CZ | cz | text256_T | Ano | Český název funkce. |
| 3 | Název EN | en | text256_T | Ano | Anglický název funkce. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (klasifikace) | [Vazba funkce na procedurální instrukci](#lm-L003) | 0..* | Které PI tuto funkci realizují |
| (specifikace MV) | [RQU002 L002 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002) | 0..* | Atribut `jointFunctions` na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet společných funkcí pevný (8 hodnot, viz [E001](#lm-E001)). |

---

<a id="lm-L002"></a>
## Třída: Bojová funkce

Doktrinální bojová funkce SVŘ. Source: `warfightingFunctionsData` (`/coco/web-app/src/content/warfighting/JointWarfightingFunctionTableData.ts`). Bojové funkce představují skupinu úkolů a systémů (lidé, organizace, informace a procesy) sjednocené společným účelem.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | cisloCele_T | Ano | Pořadí v tabulce (1–6). |
| 2 | Název CZ | cz | text256_T | Ano | Český název funkce. |
| 3 | Název EN | en | text256_T | Ano | Anglický název funkce. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (klasifikace) | [Vazba funkce na procedurální instrukci](#lm-L003) | 0..* | Které PI tuto funkci realizují |
| (specifikace MV) | [RQU002 L002 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002) | 0..* | Atribut `combatFunctions` na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet bojových funkcí pevný (6 hodnot, viz [E002](#lm-E002)). |

---

<a id="lm-L003"></a>
## Třída: Vazba funkce na procedurální instrukci

Vazební třída – propojuje společnou nebo bojovou funkci s FMN procedurální instrukcí, která ji realizuje. Business konstrukce odvozená z názvu stránky („Vazební tabulka na FMN Procedurální Instrukce").

> **Status: business konstrukce.** Source v aktuální verzi UI zobrazuje funkce jako statická referenční data; vlastní vazební tabulka funkce ↔ PI není ze source frontendu strukturovaně vidět. Třída zachycuje zamýšlenou business vazbu.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| funkce | [Společná funkce](#lm-L001) / [Bojová funkce](#lm-L002) | 1 | Klasifikovaná funkce |
| proceduralníInstrukce | [RQU004 L010 Procedurální instrukce](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L010) | 1 | Realizující PI |

---

## Číselníky (Enumerace)

<a id="lm-E001"></a>
### společnáFunkce_E

8 společných funkcí dle doktríny SVŘ. Source: `joinFunctionsData`. Sdílený číselník s [RQU002 E006 spolecnáFunkce_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E006).

| ID | Hodnota CZ | Hodnota EN |
|---|---|---|
| 1 | manévr | maneuver |
| 2 | palby | fires |
| 3 | velení a řízení | command and control |
| 4 | zpravodajství | intelligence |
| 5 | informační činnost | information |
| 6 | udržitelnost | sustainment |
| 7 | ochrana sil | force protection |
| 8 | civilně-vojenská spolupráce | CIMIC |

---

<a id="lm-E002"></a>
### bojováFunkce_E

6 bojových funkcí dle doktríny SVŘ. Source: `warfightingFunctionsData`. Sdílený číselník s [RQU002 E007 bojováFunkce_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E007).

| ID | Hodnota CZ | Hodnota EN |
|---|---|---|
| 1 | mission command | mission command |
| 2 | přesun a manévr | Movement & Manouver |
| 3 | zpravodajské zabezpečení | intelligence |
| 4 | palby | fires |
| 5 | udržování činnosti | sustainment |
| 6 | ochrana sil | force protection |
