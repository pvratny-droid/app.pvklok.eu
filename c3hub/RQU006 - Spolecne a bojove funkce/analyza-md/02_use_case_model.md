# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC050 | Zobrazit přehled společných funkcí | [FR035](01_model_pozadavku.md#fr-FR035) | — |
| UC051 | Zobrazit přehled bojových funkcí | [FR036](01_model_pozadavku.md#fr-FR036) | — |
| UC052 | Orientovat se ve vazbě funkcí na FMN procedurální instrukce | [FR037](01_model_pozadavku.md#fr-FR037) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC050"></a>
## UC050 – Zobrazit přehled společných funkcí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v doktrinálním rozdělení společných funkcí SVŘ. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR035](01_model_pozadavku.md#fr-FR035) |

**Vstupní podmínky:** Uživatel otevřel stránku Funkce SVŘ (`/web/joint-warfighting-functions`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí panel **Společné funkce** s ilustračním obrázkem a textovým popisem. | [G076](03_gui_model.md#gui-G076) |
| 2 | Systém zobrazí tabulku 8 společných funkcí (CZ / EN). | [G077](03_gui_model.md#gui-G077) |
| 3 | Uživatel si přečte přehled. | — |

**Koncové podmínky:** Uživatel zná přehled společných funkcí.

---

<a id="uc-UC051"></a>
## UC051 – Zobrazit přehled bojových funkcí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v doktrinálním rozdělení bojových funkcí SVŘ. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR036](01_model_pozadavku.md#fr-FR036) |

**Vstupní podmínky:** Uživatel otevřel stránku Funkce SVŘ.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí panel **Bojové funkce** s ilustračním obrázkem a textovým popisem. | [G076](03_gui_model.md#gui-G076) |
| 2 | Systém zobrazí tabulku 6 bojových funkcí (CZ / EN). | [G078](03_gui_model.md#gui-G078) |
| 3 | Uživatel si přečte přehled. | — |

**Koncové podmínky:** Uživatel zná přehled bojových funkcí.

---

<a id="uc-UC052"></a>
## UC052 – Orientovat se ve vazbě funkcí na FMN procedurální instrukce

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel pochopí, že společné a bojové funkce slouží jako klasifikační osa pro FMN procedurální instrukce. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR037](01_model_pozadavku.md#fr-FR037) |

**Vstupní podmínky:** Uživatel je na stránce Funkce SVŘ.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí, že stránka je pojmenována „Vazební tabulka na FMN Procedurální Instrukce". | [G076](03_gui_model.md#gui-G076) |
| 2 | Uživatel chápe, že každá FMN procedurální instrukce ([RQU004 L030](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L030)) je klasifikovaná jednou nebo více funkcemi. | — |
| 3 | Uživatel může tuto klasifikaci využít při práci s FMN instrukcemi na detailu MV ([RQU002 L010](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L010)). | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC052-1 | V aktuální verzi UI je vazba prezentována referenčně; strukturovaná vazební tabulka funkce ↔ PI není v source frontendu editovatelná. | 2 |

**Koncové podmínky:** Uživatel rozumí vazbě funkcí na procedurální instrukce.
