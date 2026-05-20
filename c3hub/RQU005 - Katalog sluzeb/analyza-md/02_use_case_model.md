# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Otevřít přehled katalogu služeb | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Zobrazit a vyhledat prvky kategorie | [FR02](01_model_pozadavku.md#fr-FR02), [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC003 | Vytvořit CIS prvek | [FR03](01_model_pozadavku.md#fr-FR03) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU005** – revize UC modelu proti zdrojovým kódům COCO (`CreateElementDialog.tsx`, `ElementsTable.tsx`). UC003 přejmenován z „Vytvořit / upravit CIS prvek" na „Vytvořit CIS prvek" – lomítko v názvu odráželo kombinovaný UC (viz `metodika-zapisu.md` kap. 2.3.5); zdroj žádný samostatný „upravit" scénář nemá.

---

<a id="uc-UC001"></a>
## UC001 – Otevřít přehled katalogu služeb

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled kategorií katalogu CIS služeb a prostředků. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je v modulu Model (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel **Katalog služeb**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém zobrazí 4 dlaždice: Infrastrukturní služby, Aplikační služby, CIS Aplikace, CIS Zařízení. | [G002](03_gui_model.md#gui-G002) |
| 3 | Uživatel klikne na dlaždici (nebo tlačítko ZOBRAZIT). | [G002](03_gui_model.md#gui-G002) |
| 4 | Systém naviguje na seznam prvků dané kategorie. | [G003](03_gui_model.md#gui-G003) |

**Koncové podmínky:** Uživatel vidí seznam prvků kategorie.

---

<a id="uc-UC002"></a>
## UC002 – Zobrazit a vyhledat prvky kategorie

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel prohlíží a vyhledává prvky konkrétní kategorie katalogu služeb. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02), [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Uživatel je na stránce přehledu kategorie.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí tabulku prvků se sloupci Kód, Název EN, Název CZ, Stav překladu. | [G004](03_gui_model.md#gui-G004) |
| 2 | Uživatel zadá hledaný výraz do filtru. | [G004](03_gui_model.md#gui-G004) |
| 3 | Tabulka se přefiltruje. | — |
| 4 | Uživatel může u libovolného prvku editovat český překlad. | [G004](03_gui_model.md#gui-G004) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC002-1 | Pro read-only kategorie (SRV, APL) nejsou dostupné akce Přidat/Duplikovat/Editovat vztahy. | 4 |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam prvků.

---

<a id="uc-UC003"></a>
## UC003 – Vytvořit CIS prvek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel vytvoří nový prvek v editovatelné kategorii katalogu (CIS Aplikace, CIS Zařízení). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Uživatel je na přehledu kategorie `CISAPP` nebo `CISDEV`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** v rámu tabulky. | [G003](03_gui_model.md#gui-G003) |
| 2 | Systém otevře dialog vytvoření prvku (sdílený `CreateElementDialog` z RQU004). | — |
| 3 | Uživatel vyplní povinný **Název EN** a **Kód země**, případně Název CZ a popisy EN/CZ. | — |
| 4 | Uživatel klikne **VYTVOŘIT**. | — |
| 5 | Systém odešle Patch Request na vytvoření prvku; po schválení se prvek objeví v tabulce. | [G004](03_gui_model.md#gui-G004) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Není vyplněn Název EN nebo Kód země | Tlačítko **VYTVOŘIT** je nedostupné (disabled). |
| 4b | Uživatel klikne **ZRUŠIT** | Systém zavře dialog bez uložení. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC003-1 | UC je dostupný pouze pro `CISAPP` a `CISDEV`; pro `SRV` a `APL` (read-only) nikoli. | 1 |
| P-UC003-2 | CIS prvek nevzniká přímo – vytvoří se Patch Request, který musí být schválen ([RQU004 UC009](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC009)), než se prvek objeví v modelu. | 5 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření CIS prvku (stav REQUESTED).

> **Verze: RQU005** – UC přejmenován z „Vytvořit / upravit CIS prvek" na „Vytvořit CIS prvek" (odstraněno lomítko kombinovaného UC). Původní alternativy 1a/1b (Duplikovat, Editovat vztahy) odstraněny – jde o samostatné operace sdílené tabulky [G004](03_gui_model.md#gui-G004), dokumentované v [RQU004 UC005](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC005) a [RQU004 UC007](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/02_use_case_model.md#uc-UC007). Dle `CreateElementDialog.tsx` doplněna povinnost Kódu země u CIS prvků a workflow Patch Requestu (vytvoření nevolá přímý `POST`, ale `createRelationshipPatchRequest`).
