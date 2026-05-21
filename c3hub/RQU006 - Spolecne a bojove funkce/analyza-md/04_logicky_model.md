# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L042](#lm-L042) | Společná funkce | jointFunction | Číselníková třída |
| [L043](#lm-L043) | Bojová funkce | combatFunction | Číselníková třída |
| [L044](#lm-L044) | Vazba funkce na procedurální instrukci | functionProceduralInstructionLink | Vazební třída |
| [E035](#lm-E035) | společnáFunkce_E | spolecnaFunkce_E | Číselník |
| [E009](#lm-E009) | bojováFunkce_E | bojovaFunkce_E | Číselník |

> **Reverse-engineering RQU006** – třídy a číselníky vychází ze zdrojových kódů C3HUB (`/coco/web-app/src/content/warfighting/JointWarfightingFunctionTableData.ts`). Modul je v aktuální verzi UI **referenční** – data společných a bojových funkcí jsou statická (hardcoded v `JointWarfightingFunctionTableData.ts`). Vazba na FMN procedurální instrukce ([L044](#lm-L044)) je business konstrukce odvozená z názvu stránky („Vazební tabulka na FMN Procedurální Instrukce") a propojení s [RQU004 L030](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L030) a [RQU002 L010](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L010).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L042"></a>
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
| (klasifikace) | [Vazba funkce na procedurální instrukci](#lm-L044) | 0..* | Které PI tuto funkci realizují |
| (specifikace MV) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Atribut `jointFunctions` na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet společných funkcí pevný (8 hodnot, viz [E035](#lm-E035)). |

---

<a id="lm-L043"></a>
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
| (klasifikace) | [Vazba funkce na procedurální instrukci](#lm-L044) | 0..* | Které PI tuto funkci realizují |
| (specifikace MV) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Atribut `combatFunctions` na specifikaci MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | V aktuální verzi je výčet bojových funkcí pevný (6 hodnot, viz [E009](#lm-E009)). |

---

<a id="lm-L044"></a>
## Třída: Vazba funkce na procedurální instrukci

Vazební třída – propojuje společnou nebo bojovou funkci s FMN procedurální instrukcí, která ji realizuje. Business konstrukce odvozená z názvu stránky („Vazební tabulka na FMN Procedurální Instrukce").

> **Status: business konstrukce.** Source v aktuální verzi UI zobrazuje funkce jako statická referenční data; vlastní vazební tabulka funkce ↔ PI není ze source frontendu strukturovaně vidět. Třída zachycuje zamýšlenou business vazbu.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| funkce | [Společná funkce](#lm-L042) / [Bojová funkce](#lm-L043) | 1 | Klasifikovaná funkce |
| proceduralníInstrukce | [RQU004 L030 Procedurální instrukce](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L030) | 1 | Realizující PI |

---

## Číselníky (Enumerace)

<a id="lm-E035"></a>
### společnáFunkce_E

8 společných funkcí dle doktríny SVŘ. Source: `joinFunctionsData`. Sdílený číselník s [RQU002 E008 spolecnáFunkce_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E008).

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

<a id="lm-E009"></a>
### bojováFunkce_E

6 bojových funkcí dle doktríny SVŘ. Source: `warfightingFunctionsData`. Sdílený číselník s [RQU002 E009 bojováFunkce_E](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-E009).

| ID | Hodnota CZ | Hodnota EN |
|---|---|---|
| 1 | mission command | mission command |
| 2 | přesun a manévr | Movement & Manouver |
| 3 | zpravodajské zabezpečení | intelligence |
| 4 | palby | fires |
| 5 | udržování činnosti | sustainment |
| 6 | ochrana sil | force protection |
