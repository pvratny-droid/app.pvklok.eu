# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Stáhnout poster taxonomie C3 schopností | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Zobrazit referenční seznam požadavků na MV | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Zobrazit referenční seznam omezení MV | [FR03](01_model_pozadavku.md#fr-FR03) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Stáhnout poster taxonomie C3 schopností

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá referenční poster taxonomie C3 schopností pro orientaci v doménovém modelu schopností. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je na nástěnce (dashboardu).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí dlaždici **„C3 schopnosti – přehled"**. | [G004](03_gui_model.md#gui-G004) |
| 2 | Uživatel klikne **Stáhnout PDF**. | [G004](03_gui_model.md#gui-G004) |
| 3 | Systém zahájí stažení souboru `capabilities-taxonomy-poster.pdf`. | — |

**Koncové podmínky:** Poster je stažen.

---

<a id="uc-UC002"></a>
## UC002 – Zobrazit referenční seznam požadavků na MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v referenčním seznamu požadavků kladených na místa velení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Uživatel otevřel stránku Požadavky a omezení (`/web/requirements-and-constraints`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí sbalitelný panel **Požadavky**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém zobrazí tabulku 81 požadavků. | [G002](03_gui_model.md#gui-G002) |
| 3 | Uživatel si přečte seznam a může jej využít při specifikaci MV ([RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002)). | — |

**Koncové podmínky:** Uživatel zná referenční seznam požadavků.

---

<a id="uc-UC003"></a>
## UC003 – Zobrazit referenční seznam omezení MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v referenčním seznamu omezení míst velení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Uživatel otevřel stránku Požadavky a omezení.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí sbalitelný panel **Omezení**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém zobrazí tabulku 12 omezení. | [G003](03_gui_model.md#gui-G003) |
| 3 | Uživatel si přečte seznam a může jej využít při specifikaci MV ([RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002)). | — |

**Koncové podmínky:** Uživatel zná referenční seznam omezení.
