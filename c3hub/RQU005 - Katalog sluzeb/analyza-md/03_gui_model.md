# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Panel Katalog služeb | serviceCatalogPanel | «Form area» |
| └ [G002](#gui-G002) | Dlaždice kategorie služeb | serviceCategoryCard | «Form multi area» |
| [G003](#gui-G003) | Přehled prvků kategorie | categoryElementsPage | «Form» |
| └ [G004](#gui-G004) | Tabulka prvků katalogu | catalogElementsTable | «Form grid area» |

> **Verze: RQU005** – GUI třídy G003 a G004 jsou sdílené komponenty z [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md) (`ModelElementsPage` a `ElementsTable`); RQU005 je zachycuje v kontextu katalogu služeb.

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G001"></a>
## «Form area» Panel Katalog služeb

Panel na stránce Model se 4 dlaždicemi kategorií. Source: `/coco/web-app/src/content/model/ModelPage.tsx` (panel „Katalog služeb"), data `getDynamicCardData`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis panelu | — | „Katalog služeb" (i18n `ModelTranslKey.SERVICE_CATALOG`) |

### Operace

žádné vlastní – navigace přes dlaždice.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Dlaždice kategorií (4×) |

---

<a id="gui-G002"></a>
## «Form multi area» Dlaždice kategorie služeb

Jedna dlaždice kategorie katalogu služeb.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název kategorie | title | Infrastrukturní služby / Aplikační služby / CIS Aplikace / CIS Zařízení |
| 2 | R | RPriznak | Barevný blok | color | Identifikace kategorie barvou |
| 3 | R | RDlouhyText | Popis | description | Krátký popis kategorie |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zobrazit() | ZOBRAZIT | Naviguje na `/web/model/{stereotype}` | [UC001](02_use_case_model.md#uc-UC001) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| navigates | [G003](#gui-G003) | Přehled prvků kategorie |
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G003"></a>
## «Form» Přehled prvků kategorie

Stránka se seznamem prvků dané kategorie. URL: `/web/model/{stereotype}`. Sdílená komponenta `ModelElementsPage` ([RQU004 G003](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G003)).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → {Kategorie} |
| 2 | H | HText | Nadpis | title | Název kategorie |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G004](#gui-G004) |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | PřidatPrvek() | + Přidat | jen CISAPP / CISDEV | Otevře CreateElementDialog | [UC003](02_use_case_model.md#uc-UC003) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Pro `SRV` a `APL` (`isReadOnlyStereotype = true`) **není** dostupné tlačítko Přidat ani řádkové akce Duplikovat a Editovat vztahy. |
| 2 | Pro `CISAPP` a `CISDEV` jsou dostupné akce Přidat, Duplikovat, Editovat vztahy. |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G004](#gui-G004) | Tabulka prvků |
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L001) | Filtrované podle stereotypu |

---

<a id="gui-G004"></a>
## «Form grid area» Tabulka prvků katalogu

Sdílená tabulka `ElementsTable` ([RQU004 G004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G004)) v kontextu katalogu služeb.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EText | Vyhledat | searchTerm | Filtruje napříč name/nameCz/s5636Identifier |
| 2 | R | RAkce | Akce | actions | Editovat překlad; pro CISAPP/CISDEV navíc Duplikovat, Editovat vztahy |
| 3 | R | RText | Kód | s5636Identifier | |
| 4 | R | RText | Název EN | name | |
| 5 | R | RText | Název CZ | nameCz | |
| 6 | R | RIkona | Stav překladu | translationStatus | AI_TRANSLATED / UPDATED / APPROVED |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | UpravitPřeklad() | — | vždy | Editace CZ překladu | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | Duplikovat() | — | jen CISAPP/CISDEV | Vytvoří kopii prvku | [UC003](02_use_case_model.md#uc-UC003) |
| 3 | EditovatVztahy() | — | jen CISAPP/CISDEV | Otevře patch request dialog | [UC003](02_use_case_model.md#uc-UC003) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L001) | |
