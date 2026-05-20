# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Panel novinek | newsPanel | «Form area» |
| └ [G002](#gui-G002) | Položka novinky | newsItem | «Form multi area» |
| [G003](#gui-G003) | Administrace novinek | newsAdministrationPage | «Form» |
| └ [G004](#gui-G004) | Grid novinek | newsListDataGrid | «Form grid area» |
| [G005](#gui-G005) | Vytvoření novinky | newsCreateDialog | «Form modal» |
| [G006](#gui-G006) | Úprava novinky | newsUpdateDialog | «Form modal» |
| [G007](#gui-G007) | Návody a manuály | manualsPage | «Form» |
| └ [G008](#gui-G008) | Karta ke stažení | fileDownloadCard | «Form multi area» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

> **Verze: RQU008** – revize GUI modelu proti zdrojovým kódům COCO. [G001](#gui-G001): odebrán neexistující „Nadpis" (`NewsPanel` nemá hlavičku). [G002](#gui-G002): odebrány atributy `createdAt` (v panelu se nezobrazuje) a `markedAsRead` (panel ukazuje jen nepřečtené). [G003](#gui-G003): opravena ACL na `canCreate`, operace **+ Vytvořit** přesunuta do rámu [G004](#gui-G004). [G005](#gui-G005)/[G006](#gui-G006): pole Lokace opraveno z editovatelného na read-only. [G008](#gui-G008): doplněn atribut Popis. Detail rámu gridu viz poznámka u [G004](#gui-G004).

---

<a id="gui-G001"></a>
## «Form area» Panel novinek

Panel novinek zobrazovaný na nástěnce. Source: `/coco/web-app/src/content/news/NewsPanel.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RList | Seznam novinek | — | Pouze nepřečtené novinky lokace `DASHBOARD`; prázdný panel se nerenderuje |

### Operace

žádné vlastní – akce jsou na položkách novinek.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Položky novinek |
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G002"></a>
## «Form multi area» Položka novinky

Jedna novinka v panelu novinek.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RPriznak | Typ | type | INFO / WARNING / ATTENTION – barevné odlišení položky (`<Alert severity>`) |
| 2 | R | RDlouhyText | Obsah | content | Text novinky |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OznačitJakoPřečtené() | ✕ | Tlačítko ✕ na položce novinky; `markNewsAsRead(newsId)`, dle ACL `canMarkAsRead` | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |
| dataSource | [Přečtení novinky uživatelem](04_logicky_model.md#lm-L002) | |

---

<a id="gui-G003"></a>
## «Form» Administrace novinek

Administrační stránka pro správu novinek. URL: `/web/admin/news`. Source: `/coco/web-app/src/content/news/NewsAdministrationPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Administrace novinek" |
| 2 | E | EGrid | Grid novinek | — | Vnořený [G004](#gui-G004) |

### Operace

žádné vlastní – stránka je obal `CocoPaper` nad gridem [G004](#gui-G004); akce **+ Vytvořit** patří rámu gridu.

### Pravidla

| ID | Pravidlo |
|---|---|
| 1 | Stránka je dostupná pouze pokud `NewsResourceAclDto.canCreate`; jinak systém přesměruje na nástěnku (`/dashboard`). |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G004](#gui-G004) | Grid novinek |
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |

> **Verze: RQU008** – opraveno dle `NewsAdministrationPage.tsx`: přístup ke stránce je gateován ACL `canCreate` (dříve uvedeno `canAccess`). Operace **VytvořitNovinku** přesunuta do rámu gridu [G004](#gui-G004) – tlačítko **+ Vytvořit** renderuje komponenta `NewsListDataGrid`, ne stránka administrace.

---

<a id="gui-G004"></a>
## «Form grid area» Grid novinek

Tabulka všech novinek v administraci. Source: `/coco/web-app/src/content/news/NewsListDataGrid.tsx`.

**Rám gridu:**

- **Akce + Vytvořit** v action-stacku gridu (`CocoTableAction`) – jen pokud `NewsResourceAclDto.canCreate`; otevírá dialog [G005](#gui-G005).
- Standardní footer MUI DataGridu (řazení, stránkování, počet řádků).
- Výchozí řazení: dle data vytvoření sestupně (`NewsComparator.sortByCreatedAtDesc`).
- Grid **nemá** vlastní vyhledávací pole ani filtry (typ / lokace) – ověřeno proti `NewsListDataGrid.tsx`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Řádkové akce – viz Operace |
| 2 | R | RText | Identifikátor | id | DTO `id` |
| 3 | R | RText | Typ | type | INFO / WARNING / ATTENTION (`NewsTypeFormatter`) |
| 4 | R | RText | Lokace | location | `dashboard` |
| 5 | R | RDlouhyText | Obsah | content | |

### Operace

| # | Název | Alias | Podmínka | Popis | Vazba na UC |
|---|---|---|---|---|---|
| 1 | VytvořitNovinku() | + Vytvořit | ACL `canCreate` | Akce v rámu gridu; otevře [G005](#gui-G005) | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | UpravitNovinku() | Edit ikona | ACL `canUpdate` | Řádková akce; otevře [G006](#gui-G006) | [UC004](02_use_case_model.md#uc-UC004) |
| 3 | SmazatNovinku() | Delete ikona | ACL `canDelete` | Řádková akce; přes potvrzovací dialog → `deleteNews(newsId)` | [UC005](02_use_case_model.md#uc-UC005) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |
| opens | [G005](#gui-G005) | Vytvoření novinky |
| opens | [G006](#gui-G006) | Úprava novinky |

> **Verze: RQU008** – doplněna sekce **Rám gridu** dle `NewsListDataGrid.tsx`. Audit „grid frame" označil G004 za silný kandidát na chybějící vyhledávání/filtry – **ověřením zdroje potvrzeno, že grid žádné vlastní vyhledávání ani filtry nemá** (false-positive auditu). Doplněna operace **VytvořitNovinku** (akce + Vytvořit je v rámu tohoto gridu, ne na [G003](#gui-G003)). U akce Smazat doplněn potvrzovací dialog. Sloupce gridu beze změny.

---

<a id="gui-G005"></a>
## «Form modal» Vytvoření novinky

Modální dialog pro vytvoření novinky. Source: `/coco/web-app/src/content/news/NewsCreateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vytvořit novinku" |
| 2 | E | ELOV | **Typ** | type | INFO / WARNING / ATTENTION (`SingleSelectField`, default INFO) |
| 3 | R | RText | Lokace | location | Pevně `dashboard` – pole jen pro čtení (`readOnly`) |
| 4 | E | EDlouhyText | **Obsah** | content | Víceřádkový text |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Vytvořit() | VYTVOŘIT | `createNews(NewsUpdateDto)` | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC003](02_use_case_model.md#uc-UC003) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G006"></a>
## «Form modal» Úprava novinky

Modální dialog pro úpravu existující novinky. Source: `/coco/web-app/src/content/news/NewsUpdateDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Upravit novinku" |
| 2 | E | ELOV | **Typ** | type | INFO / WARNING / ATTENTION (`SingleSelectField`) |
| 3 | R | RText | Lokace | location | Jen pro čtení (`readOnly`) – hodnota novinky |
| 4 | E | EDlouhyText | **Obsah** | content | Víceřádkový text |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | `updateNews(newsId, NewsUpdateDto)` | [UC004](02_use_case_model.md#uc-UC004) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC004](02_use_case_model.md#uc-UC004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Novinka](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G007"></a>
## «Form» Návody a manuály

Stránka s referenčními dokumenty ke stažení. URL: `/web/instructions-and-manuals`. Source: `/coco/web-app/src/content/manuals/ManualsModelPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Breadcrumb | — | Home → Návody a manuály |
| 2 | R | RPanel | Panel Základní informace | — | Sbalitelný panel s úvodním textem |
| 3 | R | RPanel | Panely dokumentů | — | Sbalitelné panely s kartami ke stažení |

### Operace

žádné vlastní – akce stažení jsou na kartách.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G008](#gui-G008) | Karty ke stažení |

---

<a id="gui-G008"></a>
## «Form multi area» Karta ke stažení

Karta pro stažení jednoho referenčního dokumentu. Source: `/coco/web-app/src/common/FileDownloadCard.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název dokumentu | title | Nadpis karty |
| 2 | R | RDlouhyText | Popis | description | Krátký popis dokumentu |
| 3 | R | RText | Název souboru | fileName | např. `C3HUB_navod_full_2026_01.pdf`; karta může nést více souborů (`files[]`) |
| 4 | R | RPriznak | Dostupnost | disabled | Nedostupné dokumenty (`disabled: true`) nelze stáhnout |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Stáhnout() | STÁHNOUT | Odkaz `<a download>` na soubor (PDF / MP4); label lze přepsat (`downloadLabel`) | [UC006](02_use_case_model.md#uc-UC006) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Referenční dokument](04_logicky_model.md#lm-L003) | |
