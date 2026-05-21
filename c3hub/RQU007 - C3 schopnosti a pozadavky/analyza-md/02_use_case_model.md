# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC053 | Stáhnout poster taxonomie C3 schopností | [FR038](01_model_pozadavku.md#fr-FR038) | — |
| UC054 | Zobrazit referenční seznam požadavků na MV | [FR039](01_model_pozadavku.md#fr-FR039) | — |
| UC055 | Zobrazit referenční seznam omezení MV | [FR040](01_model_pozadavku.md#fr-FR040) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC053"></a>
## UC053 – Stáhnout poster taxonomie C3 schopností

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá referenční poster taxonomie C3 schopností pro orientaci v doménovém modelu schopností. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR038](01_model_pozadavku.md#fr-FR038) |

**Vstupní podmínky:** Uživatel je na nástěnce (dashboardu).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí dlaždici **„C3 schopnosti – přehled"**. | [G082](03_gui_model.md#gui-G082) |
| 2 | Uživatel klikne **Stáhnout PDF**. | [G082](03_gui_model.md#gui-G082) |
| 3 | Systém zahájí stažení souboru `capabilities-taxonomy-poster.pdf`. | — |

**Koncové podmínky:** Poster je stažen.

---

<a id="uc-UC054"></a>
## UC054 – Zobrazit referenční seznam požadavků na MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v referenčním seznamu požadavků kladených na místa velení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR039](01_model_pozadavku.md#fr-FR039) |

**Vstupní podmínky:** Uživatel otevřel stránku Požadavky a omezení (`/web/requirements-and-constraints`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí sbalitelný panel **Požadavky**. | [G079](03_gui_model.md#gui-G079) |
| 2 | Systém zobrazí tabulku 81 požadavků. | [G080](03_gui_model.md#gui-G080) |
| 3 | Uživatel si přečte seznam a může jej využít při specifikaci MV ([RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)). | — |

**Koncové podmínky:** Uživatel zná referenční seznam požadavků.

---

<a id="uc-UC055"></a>
## UC055 – Zobrazit referenční seznam omezení MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se zorientuje v referenčním seznamu omezení míst velení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR040](01_model_pozadavku.md#fr-FR040) |

**Vstupní podmínky:** Uživatel otevřel stránku Požadavky a omezení.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí sbalitelný panel **Omezení**. | [G079](03_gui_model.md#gui-G079) |
| 2 | Systém zobrazí tabulku 12 omezení. | [G081](03_gui_model.md#gui-G081) |
| 3 | Uživatel si přečte seznam a může jej využít při specifikaci MV ([RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)). | — |

**Koncové podmínky:** Uživatel zná referenční seznam omezení.
