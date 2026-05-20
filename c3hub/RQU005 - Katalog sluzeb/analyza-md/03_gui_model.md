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

Sdílená tabulka `ElementsTable` ([RQU004 G004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G004)) v kontextu katalogu služeb. Source: `/coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx`.

**Rám gridu:**

- **Vyhledávací pole** (`SearchFilter`) nad tabulkou – klient-side filtr (`ElementFilterService`) napříč poli `name` / `nameCz` / `s5636Identifier` / `description` / `descriptionCz` / `id`; placeholder „Hledat v prvcích".
- **Akce + Přidat** v action-stacku gridu – jen pro editovatelné kategorie `CISAPP` / `CISDEV` (předáno z [G003](#gui-G003)); pro `SRV` / `APL` chybí.
- Standardní footer MUI DataGridu (řazení, stránkování, počet řádků).
- Sloupec **Identifikátor** je ve výchozím stavu skrytý (`columnVisibilityModel`).

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Řádkové akce – viz Operace; šířka min. 160 px |
| 2 | R | RText | Kód | s5636Identifier | `CisElementIdentifierFormatter.formatIdentifier` |
| 3 | R | RText | Název EN | name | `ElementNameFormatter.formatName` |
| 4 | R | RText | Název CZ | nameCz | DTO `nameCz` |
| 5 | R | RLOV | Stav překladu | translationStatus | `ElementTranslationStatusFormatter` – 3 stavy (AI_TRANSLATED / UPDATED / APPROVED) |
| 6 | R | RText | Identifikátor | id | DTO `id`; ve výchozím stavu skrytý |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | UpravitPřeklad() | Translate ikona | vždy | Editace CZ překladu; též dvojklik na řádek | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | EditovatVztahy() | Share ikona | jen CISAPP/CISDEV | Otevře patch request dialog | [RQU004 UC007](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC007) |
| 3 | OtevřítSousedství() | GPS ikona | vždy | Otevře externí ArchiRepo URL na nové záložce | [RQU004 UC010](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC010) |
| 4 | Duplikovat() | ContentCopy ikona | jen CISAPP/CISDEV | Vytvoří kopii prvku | [RQU004 UC005](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC005) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L001) | |

> **Verze: RQU005** – revize proti `ElementsTable.tsx`. Doplněna chybějící řádková akce **OtevřítSousedství** (GPS ikona, vždy dostupná – i pro read-only kategorie). „Vyhledat" přesunut ze sloupců gridu do sekce **Rám gridu** (je to `SearchFilter` nad tabulkou, ne sloupec) a upřesněn rozsah filtru na 6 polí. Doplněn skrytý sloupec **Identifikátor**. Pořadí řádkových akcí srovnáno se zdrojem (`renderActionCell`); `translationStatus` opraven z `RIkona` na `RLOV` (formátovaná hodnota, ne ikona). Vazby operací Duplikovat/EditovatVztahy přesměrovány z lokálního UC003 na [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md) UC005/UC007.
