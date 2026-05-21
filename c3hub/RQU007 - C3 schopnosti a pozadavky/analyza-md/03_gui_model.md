# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G079](#gui-G079) | Požadavky a omezení (referenční stránka) | requirementsModelPage | «Form» |
| └ [G080](#gui-G080) | Tabulka požadavků | requirementsTable | «Form grid area» |
| └ [G081](#gui-G081) | Tabulka omezení | constraintsTable | «Form grid area» |
| [G082](#gui-G082) | Dlaždice C3 schopnosti (na nástěnce) | c3CapabilitiesCard | «Form multi area» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G079"></a>
## «Form» Požadavky a omezení (referenční stránka)

Referenční stránka se dvěma panely. URL: `/web/requirements-and-constraints`. Source: `/coco/web-app/src/content/requirements/RequirementsModelPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis panelu Požadavky | — | „Požadavky" (i18n `requirements:requirements`) |
| 2 | R | RPanel | Panel Požadavky | requirementsPanel | Sbalitelný panel s tabulkou [G080](#gui-G080) |
| 3 | H | HText | Nadpis panelu Omezení | — | „Omezení" (i18n `requirements:constraints`) |
| 4 | R | RPanel | Panel Omezení | constraintsPanel | Sbalitelný panel s tabulkou [G081](#gui-G081) |

### Operace

žádné – stránka je čistě referenční (read-only zobrazení).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G080](#gui-G080) | Tabulka požadavků |
| contains | [G081](#gui-G081) | Tabulka omezení |

---

<a id="gui-G080"></a>
## «Form grid area» Tabulka požadavků

Jednosloupcová tabulka požadavků. Source: `/coco/web-app/src/content/requirements/RequirementsTable.tsx` + data `requirementsData`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RDlouhyText | Text požadavku | text | Slovní popis požadavku |

### Operace

žádné – read-only tabulka.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Požadavek na MV](04_logicky_model.md#lm-L045) | 81 řádků (statická data) |

---

<a id="gui-G081"></a>
## «Form grid area» Tabulka omezení

Jednosloupcová tabulka omezení. Source: `/coco/web-app/src/content/requirements/RequirementsTable.tsx` + data `constraintsData`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RDlouhyText | Text omezení | text | Slovní popis omezení |

### Operace

žádné – read-only tabulka.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Omezení MV](04_logicky_model.md#lm-L046) | 12 řádků (statická data) |

---

<a id="gui-G082"></a>
## «Form multi area» Dlaždice C3 schopnosti (na nástěnce)

Dlaždice na nástěnce (dashboardu) poskytující poster taxonomie C3 schopností. Source: `/coco/web-app/src/content/dashboard/DashboardPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název dlaždice | — | „C3 schopnosti – přehled" (i18n `dashboard:c3Capabilities`) |
| 2 | R | RDlouhyText | Popis | — | „Přehled C3 schopností." (i18n `dashboard:c3CapabilitiesDescription`) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | StáhnoutPoster() | Stáhnout PDF | `saveAs(capabilitiesTaxonomyPosterPdf, "capabilities-taxonomy-poster.pdf")` | [UC053](02_use_case_model.md#uc-UC053) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Taxonomie C3 schopností](04_logicky_model.md#lm-L047) | Statický PDF poster |
