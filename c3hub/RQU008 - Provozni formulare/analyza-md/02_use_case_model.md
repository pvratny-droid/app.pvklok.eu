# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC007 | Zobrazit panel novinek | [FR041](01_model_pozadavku.md#fr-FR041) | — |
| UC056 | Označit novinku jako přečtenou | [FR042](01_model_pozadavku.md#fr-FR042) | — |
| UC057 | Vytvořit novinku | [FR043](01_model_pozadavku.md#fr-FR043) | — |
| UC058 | Upravit novinku | [FR043](01_model_pozadavku.md#fr-FR043) | — |
| UC059 | Smazat novinku | [FR043](01_model_pozadavku.md#fr-FR043) | — |
| UC060 | Stáhnout návod / manuál | [FR044](01_model_pozadavku.md#fr-FR044) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU008** – revize UC modelu proti zdrojovým kódům COCO (`news/`, `manuals/`). **UC007:** scénář opraven dle `NewsPanel.tsx` – panel zobrazuje **pouze nepřečtené** novinky (přečtené jsou odfiltrovány, ne „zvýrazněny"), položka nezobrazuje datum; doplněna alternativa 1a. **UC057:** přístup k administraci je gateován ACL `canCreate` (ne `canAccess`), akce **+ Vytvořit** patří rámu gridu [G085](03_gui_model.md#gui-G085), pole Lokace je v dialogu jen pro čtení. **UC059:** doplněn potvrzovací dialog před smazáním. **UC060:** název „Stáhnout návod / manuál" ponechán – přes lomítko jde o jednu uniformní operaci stažení referenčního dokumentu, ne kombinovaný UC.

---

<a id="uc-UC007"></a>
## UC007 – Zobrazit panel novinek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se informuje o aktuálním dění formou novinek na nástěnce. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR041](01_model_pozadavku.md#fr-FR041) |

**Vstupní podmínky:** Uživatel je na nástěnce.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém načte novinky (`findAll`), vyfiltruje je dle lokace `DASHBOARD` a ponechá jen **nepřečtené**. | — |
| 2 | Systém zobrazí panel novinek; každá položka je barevně odlišena dle typu (INFO / WARNING / ATTENTION). | [G002](03_gui_model.md#gui-G002), [G083](03_gui_model.md#gui-G083) |
| 3 | Uživatel si přečte obsah novinek. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 1a | Žádná nepřečtená novinka pro lokaci `DASHBOARD` | Panel novinek se nezobrazí. |

**Koncové podmínky:** Uživatel vidí aktuální nepřečtené novinky.

---

<a id="uc-UC056"></a>
## UC056 – Označit novinku jako přečtenou

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel označí novinku jako přečtenou, aby ji odlišil od nepřečtených. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR042](01_model_pozadavku.md#fr-FR042) |

**Vstupní podmínky:** Uživatel vidí novinku v panelu, ACL `canMarkAsRead`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **Označit jako přečtené** na položce novinky. | [G083](03_gui_model.md#gui-G083) |
| 2 | Systém volá `markNewsAsRead(newsId)`. | — |
| 3 | Systém aktualizuje příznak `markedAsRead` pro daného uživatele a novinku. | — |

**Koncové podmínky:** Novinka je označena jako přečtená.

---

<a id="uc-UC057"></a>
## UC057 – Vytvořit novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek vytvoří novou novinku pro uživatele. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR043](01_model_pozadavku.md#fr-FR043) |

**Vstupní podmínky:** Aktér má ACL `NewsResourceAclDto.canCreate` – administrace novinek je dostupná jen s tímto oprávněním.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce otevře administraci novinek (`/web/admin/news`). | [G084](03_gui_model.md#gui-G084) |
| 2 | Správce klikne **+ Vytvořit** v rámu gridu. | [G085](03_gui_model.md#gui-G085) |
| 3 | Systém otevře dialog Vytvoření novinky. | [G086](03_gui_model.md#gui-G086) |
| 4 | Správce vyplní Typ a Obsah; Lokace je pevně `dashboard` (jen pro čtení). | [G086](03_gui_model.md#gui-G086) |
| 5 | Správce klikne **VYTVOŘIT**. | [G086](03_gui_model.md#gui-G086) |
| 6 | Systém volá `createNews(NewsUpdateDto)` a zavře dialog. | — |

**Koncové podmínky:** Nová novinka je v evidenci.

---

<a id="uc-UC058"></a>
## UC058 – Upravit novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek upraví existující novinku. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR043](01_model_pozadavku.md#fr-FR043) |

**Vstupní podmínky:** Novinka existuje, aktér má ACL `NewsAclDto.canUpdate`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce v gridu novinek klikne **Upravit** u řádku. | [G085](03_gui_model.md#gui-G085) |
| 2 | Systém otevře dialog Úprava novinky s předvyplněnými hodnotami. | [G087](03_gui_model.md#gui-G087) |
| 3 | Správce upraví Typ / Lokaci / Obsah. | [G087](03_gui_model.md#gui-G087) |
| 4 | Správce klikne **ULOŽIT**. | [G087](03_gui_model.md#gui-G087) |
| 5 | Systém volá `updateNews(newsId, NewsUpdateDto)`. | — |

**Koncové podmínky:** Novinka je aktualizována.

---

<a id="uc-UC059"></a>
## UC059 – Smazat novinku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Správce novinek odstraní novinku. |
| **Aktér** | Správce novinek |
| **Zdrojový požadavek** | [FR043](01_model_pozadavku.md#fr-FR043) |

**Vstupní podmínky:** Novinka existuje, aktér má ACL `NewsAclDto.canDelete`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Správce v gridu novinek klikne **Smazat** u řádku. | [G085](03_gui_model.md#gui-G085) |
| 2 | Systém zobrazí potvrzovací dialog („Smazat novinku" / „Novinka bude smazána"). | — |
| 3 | Správce potvrdí smazání. | — |
| 4 | Systém volá `deleteNews(newsId)` a aktualizuje grid novinek. | [G085](03_gui_model.md#gui-G085) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | Správce klikne **Zrušit** v potvrzovacím dialogu | Novinka se nesmaže, dialog se zavře. |

**Koncové podmínky:** Novinka je odstraněna.

---

<a id="uc-UC060"></a>
## UC060 – Stáhnout návod / manuál

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel stáhne referenční dokument (návod, metodiku nebo školicí video). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR044](01_model_pozadavku.md#fr-FR044) |

**Vstupní podmínky:** Uživatel je na stránce Návody a manuály.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel prochází sbalitelné panely s kartami dokumentů. | [G088](03_gui_model.md#gui-G088) |
| 2 | Uživatel klikne **STÁHNOUT** na kartě dokumentu. | [G089](03_gui_model.md#gui-G089) |
| 3 | Prohlížeč zahájí stažení souboru (PDF / MP4). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | Dokument je nedostupný (`disabled: true`, např. kompletní návod EN) | Karta neumožňuje stažení. |

**Koncové podmínky:** Dokument je stažen.
