# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Zobrazit přehled společných funkcí | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Zobrazit přehled bojových funkcí | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Orientovat se ve vazbě funkcí na FMN procedurální instrukce | [FR03](01_model_pozadavku.md#fr-FR03) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Zobrazit přehled společných funkcí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v doktrinálním rozdělení společných funkcí SVŘ. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel otevřel stránku Funkce SVŘ (`/web/joint-warfighting-functions`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí panel **Společné funkce** s ilustračním obrázkem a textovým popisem. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém zobrazí tabulku 8 společných funkcí (CZ / EN). | [G002](03_gui_model.md#gui-G002) |
| 3 | Uživatel si přečte přehled. | — |

**Koncové podmínky:** Uživatel zná přehled společných funkcí.

---

<a id="uc-UC002"></a>
## UC002 – Zobrazit přehled bojových funkcí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v doktrinálním rozdělení bojových funkcí SVŘ. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Uživatel otevřel stránku Funkce SVŘ.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí panel **Bojové funkce** s ilustračním obrázkem a textovým popisem. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém zobrazí tabulku 6 bojových funkcí (CZ / EN). | [G003](03_gui_model.md#gui-G003) |
| 3 | Uživatel si přečte přehled. | — |

**Koncové podmínky:** Uživatel zná přehled bojových funkcí.

---

<a id="uc-UC003"></a>
## UC003 – Orientovat se ve vazbě funkcí na FMN procedurální instrukce

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel pochopí, že společné a bojové funkce slouží jako klasifikační osa pro FMN procedurální instrukce. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Uživatel je na stránce Funkce SVŘ.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí, že stránka je pojmenována „Vazební tabulka na FMN Procedurální Instrukce". | [G001](03_gui_model.md#gui-G001) |
| 2 | Uživatel chápe, že každá FMN procedurální instrukce ([RQU004 L010](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L010)) je klasifikovaná jednou nebo více funkcemi. | — |
| 3 | Uživatel může tuto klasifikaci využít při práci s FMN instrukcemi na detailu MV ([RQU002 L008](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L008)). | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC003-1 | V aktuální verzi UI je vazba prezentována referenčně; strukturovaná vazební tabulka funkce ↔ PI není v source frontendu editovatelná. | 2 |

**Koncové podmínky:** Uživatel rozumí vazbě funkcí na procedurální instrukce.
