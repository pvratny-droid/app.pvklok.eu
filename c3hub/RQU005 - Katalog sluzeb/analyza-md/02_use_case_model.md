# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC047 | Otevřít přehled katalogu služeb | [FR031](01_model_pozadavku.md#fr-FR031) | — |
| UC048 | Zobrazit a vyhledat prvky kategorie | [FR032](01_model_pozadavku.md#fr-FR032), [FR034](01_model_pozadavku.md#fr-FR034) | — |
| UC049 | Vytvořit CIS prvek | [FR033](01_model_pozadavku.md#fr-FR033) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU005** – revize UC modelu proti zdrojovým kódům COCO (`CreateElementDialog.tsx`, `ElementsTable.tsx`). UC049 přejmenován z „Vytvořit / upravit CIS prvek" na „Vytvořit CIS prvek" – lomítko v názvu odráželo kombinovaný UC (viz `metodika-zapisu.md` kap. 2.3.5); zdroj žádný samostatný „upravit" scénář nemá.

---

<a id="uc-UC047"></a>
## UC047 – Otevřít přehled katalogu služeb

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled kategorií katalogu CIS služeb a prostředků. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR031](01_model_pozadavku.md#fr-FR031) |

**Vstupní podmínky:** Uživatel je v modulu Model (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel **Katalog služeb**. | [G072](03_gui_model.md#gui-G072) |
| 2 | Systém zobrazí 4 dlaždice: Infrastrukturní služby, Aplikační služby, CIS Aplikace, CIS Zařízení. | [G073](03_gui_model.md#gui-G073) |
| 3 | Uživatel klikne na dlaždici (nebo tlačítko ZOBRAZIT). | [G073](03_gui_model.md#gui-G073) |
| 4 | Systém naviguje na seznam prvků dané kategorie. | [G074](03_gui_model.md#gui-G074) |

**Koncové podmínky:** Uživatel vidí seznam prvků kategorie.

---

<a id="uc-UC048"></a>
## UC048 – Zobrazit a vyhledat prvky kategorie

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel prohlíží a vyhledává prvky konkrétní kategorie katalogu služeb. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR032](01_model_pozadavku.md#fr-FR032), [FR034](01_model_pozadavku.md#fr-FR034) |

**Vstupní podmínky:** Uživatel je na stránce přehledu kategorie.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí tabulku prvků se sloupci Kód, Název EN, Název CZ, Stav překladu. | [G075](03_gui_model.md#gui-G075) |
| 2 | Uživatel zadá hledaný výraz do filtru. | [G075](03_gui_model.md#gui-G075) |
| 3 | Tabulka se přefiltruje. | — |
| 4 | Uživatel může u libovolného prvku editovat český překlad. | [G075](03_gui_model.md#gui-G075) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC048-1 | Pro read-only kategorie (SRV, APL) nejsou dostupné akce Přidat/Duplikovat/Editovat vztahy. | 4 |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam prvků.

---

<a id="uc-UC049"></a>
## UC049 – Vytvořit CIS prvek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel vytvoří nový prvek v editovatelné kategorii katalogu (CIS Aplikace, CIS Zařízení). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR033](01_model_pozadavku.md#fr-FR033) |

**Vstupní podmínky:** Uživatel je na přehledu kategorie `CISAPP` nebo `CISDEV`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** v rámu tabulky. | [G074](03_gui_model.md#gui-G074) |
| 2 | Systém otevře dialog vytvoření prvku (sdílený `CreateElementDialog` z RQU004). | — |
| 3 | Uživatel vyplní povinný **Název EN** a **Kód země**, případně Název CZ a popisy EN/CZ. | — |
| 4 | Uživatel klikne **VYTVOŘIT**. | — |
| 5 | Systém odešle Patch Request na vytvoření prvku; po schválení se prvek objeví v tabulce. | [G075](03_gui_model.md#gui-G075) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Není vyplněn Název EN nebo Kód země | Tlačítko **VYTVOŘIT** je nedostupné (disabled). |
| 4b | Uživatel klikne **ZRUŠIT** | Systém zavře dialog bez uložení. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC049-1 | UC je dostupný pouze pro `CISAPP` a `CISDEV`; pro `SRV` a `APL` (read-only) nikoli. | 1 |
| P-UC049-2 | CIS prvek nevzniká přímo – vytvoří se Patch Request, který musí být schválen ([RQU004 UC043](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC043)), než se prvek objeví v modelu. | 5 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření CIS prvku (stav REQUESTED).

> **Verze: RQU005** – UC přejmenován z „Vytvořit / upravit CIS prvek" na „Vytvořit CIS prvek" (odstraněno lomítko kombinovaného UC). Původní alternativy 1a/1b (Duplikovat, Editovat vztahy) odstraněny – jde o samostatné operace sdílené tabulky [G075](03_gui_model.md#gui-G075), dokumentované v [RQU004 UC039](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC039) a [RQU004 UC041](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC041). Dle `CreateElementDialog.tsx` doplněna povinnost Kódu země u CIS prvků a workflow Patch Requestu (vytvoření nevolá přímý `POST`, ale `createRelationshipPatchRequest`).
