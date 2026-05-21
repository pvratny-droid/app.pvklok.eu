# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G072](#gui-G072) | Panel Katalog služeb | serviceCatalogPanel | «Form area» |
| └ [G073](#gui-G073) | Dlaždice kategorie služeb | serviceCategoryCard | «Form multi area» |
| [G074](#gui-G074) | Přehled prvků kategorie | categoryElementsPage | «Form» |
| └ [G075](#gui-G075) | Tabulka prvků katalogu | catalogElementsTable | «Form grid area» |

> **Verze: RQU005** – GUI třídy G074 a G075 jsou sdílené komponenty z [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md) (`ModelElementsPage` a `ElementsTable`); RQU005 je zachycuje v kontextu katalogu služeb.

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G072"></a>
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
| contains | [G073](#gui-G073) | Dlaždice kategorií (4×) |

---

<a id="gui-G073"></a>
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
| 1 | Zobrazit() | ZOBRAZIT | Naviguje na `/web/model/{stereotype}` | [UC047](02_use_case_model.md#uc-UC047) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| navigates | [G074](#gui-G074) | Přehled prvků kategorie |
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L041) | |

---

<a id="gui-G074"></a>
## «Form» Přehled prvků kategorie

Stránka se seznamem prvků dané kategorie. URL: `/web/model/{stereotype}`. Sdílená komponenta `ModelElementsPage` ([RQU004 G058](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G058)).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Model → {Kategorie} |
| 2 | H | HText | Nadpis | title | Název kategorie |
| 3 | E | EGrid | Tabulka prvků | — | Vnořený [G075](#gui-G075) |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | PřidatPrvek() | + Přidat | jen CISAPP / CISDEV | Otevře CreateElementDialog | [UC049](02_use_case_model.md#uc-UC049) |

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Pro `SRV` a `APL` (`isReadOnlyStereotype = true`) **není** dostupné tlačítko Přidat ani řádkové akce Duplikovat a Editovat vztahy. |
| 2 | Pro `CISAPP` a `CISDEV` jsou dostupné akce Přidat, Duplikovat, Editovat vztahy. |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G075](#gui-G075) | Tabulka prvků |
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L041) | Filtrované podle stereotypu |

---

<a id="gui-G075"></a>
## «Form grid area» Tabulka prvků katalogu

Sdílená tabulka `ElementsTable` ([RQU004 G059](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G059)) v kontextu katalogu služeb. Source: `/coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx`.

**Rám gridu:**

- **Vyhledávací pole** (`SearchFilter`) nad tabulkou – klient-side filtr (`ElementFilterService`) napříč poli `name` / `nameCz` / `s5636Identifier` / `description` / `descriptionCz` / `id`; placeholder „Hledat v prvcích".
- **Akce + Přidat** v action-stacku gridu – jen pro editovatelné kategorie `CISAPP` / `CISDEV` (předáno z [G074](#gui-G074)); pro `SRV` / `APL` chybí.
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
| 1 | UpravitPřeklad() | Translate ikona | vždy | Editace CZ překladu; též dvojklik na řádek | [UC048](02_use_case_model.md#uc-UC048) |
| 2 | EditovatVztahy() | Share ikona | jen CISAPP/CISDEV | Otevře patch request dialog | [RQU004 UC041](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC041) |
| 3 | OtevřítSousedství() | GPS ikona | vždy | Otevře externí ArchiRepo URL na nové záložce | [RQU004 UC044](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC044) |
| 4 | Duplikovat() | ContentCopy ikona | jen CISAPP/CISDEV | Vytvoří kopii prvku | [RQU004 UC039](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC039) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Položka katalogu služeb](04_logicky_model.md#lm-L041) | |

> **Verze: RQU005** – revize proti `ElementsTable.tsx`. Doplněna chybějící řádková akce **OtevřítSousedství** (GPS ikona, vždy dostupná – i pro read-only kategorie). „Vyhledat" přesunut ze sloupců gridu do sekce **Rám gridu** (je to `SearchFilter` nad tabulkou, ne sloupec) a upřesněn rozsah filtru na 6 polí. Doplněn skrytý sloupec **Identifikátor**. Pořadí řádkových akcí srovnáno se zdrojem (`renderActionCell`); `translationStatus` opraven z `RIkona` na `RLOV` (formátovaná hodnota, ne ikona). Vazby operací Duplikovat/EditovatVztahy přesměrovány z lokálního UC049 na [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md) UC005/UC007.
