# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Běžný uživatel aplikace COCO (C3 HUB) – čte novinky na nástěnce, označuje je jako přečtené a stahuje návody a manuály. |
| **Správce novinek** | Uživatel s oprávněním ke správě novinek (`NewsResourceAclDto.canAccess`) – vytváří, upravuje a maže novinky. |
| **Systém C3 HUB** | Vlastní aplikace COCO – persistuje novinky, řídí jejich zobrazení dle lokace a sleduje stav přečtení; poskytuje ke stažení referenční dokumenty (návody, manuály, videa). |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Informovat uživatele o aktuálním dění formou **novinek** zobrazovaných na nástěnce, s rozlišením typu (informace / varování / upozornění). |
| **C02** | Umožnit oprávněným uživatelům **správu novinek** (vytvoření, úprava, smazání) přes administrační rozhraní. |
| **C03** | Sledovat, které novinky uživatel již **přečetl**, a podle toho je vizuálně odlišit. |
| **C04** | Poskytnout uživatelům **referenční dokumenty** – návody, metodiky a školicí videa – ke stažení. |

---

## Funkční požadavky

<a id="fr-FR041"></a>
### FR041 – Panel novinek na nástěnce

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Na nástěnce ([RQU001 G002](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/03_gui_model.md#gui-G002)) se zobrazuje **panel novinek** s novinkami s lokací `DASHBOARD`. Každá novinka má typ (**INFO** / **WARNING** / **ATTENTION**), textový obsah, datum vytvoření a příznak přečtení. Nepřečtené novinky jsou vizuálně zvýrazněné. |
| **Návrh řešení** | `«Form area» PanelNovinek` napojený na `findAll()` filtrovaný dle lokace. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC007](02_use_case_model.md#uc-UC007)

---

<a id="fr-FR042"></a>
### FR042 – Označení novinky jako přečtené

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Uživatel může novinku označit jako **přečtenou** (`markNewsAsRead`). Příznak `markedAsRead` se ukládá per uživatel; dostupnost akce řídí ACL (`NewsAclDto.canMarkAsRead`). |
| **Návrh řešení** | Akce „Označit jako přečtené" na položce novinky v `«Form area» PanelNovinek`. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC056](02_use_case_model.md#uc-UC056)

---

<a id="fr-FR043"></a>
### FR043 – Administrace novinek

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Oprávnění uživatelé (`NewsResourceAclDto.canAccess`) mají přístup k administrační stránce novinek (URL `/web/admin/news`) s tabulkou všech novinek (sloupce Akce, Identifikátor, Typ, Lokace, Obsah). Mohou novinku **vytvořit** (dialog s poli Typ, Lokace, Obsah), **upravit** a **smazat** (dostupnost řídí `NewsAclDto.canUpdate` / `canDelete`). |
| **Návrh řešení** | `«Form» AdministraceNovinek` (URL `/web/admin/news`) s `«Form grid area» GridNovinek` a dialogy `«Form modal» VytvořeníNovinky` / `«Form modal» ÚpravaNovinky`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC057](02_use_case_model.md#uc-UC057), [UC058](02_use_case_model.md#uc-UC058), [UC059](02_use_case_model.md#uc-UC059)

---

<a id="fr-FR044"></a>
### FR044 – Návody a manuály

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Stránka **Návody a manuály** (URL `/web/instructions-and-manuals`) poskytuje ke stažení referenční dokumenty: zkrácený a kompletní návod C3HUB (CZ), zkrácený návod (EN), výstupy a školicí materiály z cvičení FECL25, a školicí videa (MP4). Dostupnost CZ/EN verzí se řídí jazykem rozhraní. |
| **Návrh řešení** | `«Form» NávodyAManuály` se sbalitelnými panely a kartami pro stažení souborů (`FileDownloadCard`). |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC060](02_use_case_model.md#uc-UC060)

---

## Souhrnná tabulka realizace

| FR | UC007 | UC056 | UC057 | UC058 | UC059 | UC060 |
|---|---|---|---|---|---|---|
| **FR041** | X | | | | | |
| **FR042** | | X | | | | |
| **FR043** | | | X | X | X | |
| **FR044** | | | | | | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
