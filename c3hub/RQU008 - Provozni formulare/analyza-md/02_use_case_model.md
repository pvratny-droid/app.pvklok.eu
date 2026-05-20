# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Zobrazit panel novinek | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Označit novinku jako přečtenou | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Vytvořit novinku | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC004 | Upravit novinku | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC005 | Smazat novinku | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC006 | Stáhnout návod / manuál | [FR04](01_model_pozadavku.md#fr-FR04) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Zobrazit panel novinek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se informuje o aktuálním dění formou novinek na nástěnce. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je na nástěnce.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém načte novinky (`findAll`) a vyfiltruje je dle lokace `DASHBOARD`. | — |
| 2 | Systém zobrazí panel novinek s položkami (typ, obsah, datum). | [G001](03_gui_model.md#gui-G001) |
| 3 | Nepřečtené novinky jsou vizuálně zvýrazněné. | [G002](03_gui_model.md#gui-G002) |

**Koncové podmínky:** Uživatel vidí aktuální novinky.

---

<a id="uc-UC002"></a>
## UC002 – Označit novinku jako přečtenou

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel označí novinku jako přečtenou, aby ji odlišil od nepřečtených. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Uživatel vidí novinku v panelu, ACL `canMarkAsRead`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **Označit jako přečtené** na položce novinky. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém volá `markNewsAsRead(newsId)`. | — |
| 3 | Systém aktualizuje příznak `markedAsRead` pro daného uživatele a novinku. | — |

**Koncové podmínky:** Novinka je označena jako přečtená.

---

<a id="uc-UC003"></a>
## UC003 – Vytvořit novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek vytvoří novou novinku pro uživatele. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Aktér má ACL `NewsResourceAclDto.canCreate` a přístup k administraci (`canAccess`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce otevře administraci novinek (`/web/admin/news`). | [G003](03_gui_model.md#gui-G003) |
| 2 | Správce klikne **+ Vytvořit**. | [G003](03_gui_model.md#gui-G003) |
| 3 | Systém otevře dialog Vytvoření novinky. | [G005](03_gui_model.md#gui-G005) |
| 4 | Správce vyplní Typ, Lokaci a Obsah. | [G005](03_gui_model.md#gui-G005) |
| 5 | Správce klikne **VYTVOŘIT**. | [G005](03_gui_model.md#gui-G005) |
| 6 | Systém volá `createNews(NewsUpdateDto)` a zavře dialog. | — |

**Koncové podmínky:** Nová novinka je v evidenci.

---

<a id="uc-UC004"></a>
## UC004 – Upravit novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek upraví existující novinku. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Novinka existuje, aktér má ACL `NewsAclDto.canUpdate`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce v gridu novinek klikne **Upravit** u řádku. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Úprava novinky s předvyplněnými hodnotami. | [G006](03_gui_model.md#gui-G006) |
| 3 | Správce upraví Typ / Lokaci / Obsah. | [G006](03_gui_model.md#gui-G006) |
| 4 | Správce klikne **ULOŽIT**. | [G006](03_gui_model.md#gui-G006) |
| 5 | Systém volá `updateNews(newsId, NewsUpdateDto)`. | — |

**Koncové podmínky:** Novinka je aktualizována.

---

<a id="uc-UC005"></a>
## UC005 – Smazat novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek odstraní novinku. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Novinka existuje, aktér má ACL `NewsAclDto.canDelete`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce v gridu novinek klikne **Smazat** u řádku. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém volá `deleteNews(newsId)`. | — |
| 3 | Systém aktualizuje grid novinek. | [G004](03_gui_model.md#gui-G004) |

**Koncové podmínky:** Novinka je odstraněna.

---

<a id="uc-UC006"></a>
## UC006 – Stáhnout návod / manuál

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel stáhne referenční dokument (návod, metodiku nebo školicí video). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Uživatel je na stránce Návody a manuály.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel prochází sbalitelné panely s kartami dokumentů. | [G007](03_gui_model.md#gui-G007) |
| 2 | Uživatel klikne **STÁHNOUT** na kartě dokumentu. | [G008](03_gui_model.md#gui-G008) |
| 3 | Prohlížeč zahájí stažení souboru (PDF / MP4). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | Dokument je nedostupný (`disabled: true`, např. kompletní návod EN) | Karta neumožňuje stažení. |

**Koncové podmínky:** Dokument je stažen.
