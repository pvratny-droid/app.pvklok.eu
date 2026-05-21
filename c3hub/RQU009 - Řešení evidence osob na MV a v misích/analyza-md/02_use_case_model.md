# Use Case model

> **Status: chystaný požadavek (návrh).** Use Case scénáře jsou návrhové – zachycují zamýšlené chování po zavedení evidence osob.

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC061 | Zobrazit a vyhledat osoby | [FR045](01_model_pozadavku.md#fr-FR045) | — |
| UC062 | Vytvořit / upravit osobu | [FR045](01_model_pozadavku.md#fr-FR045) | — |
| UC063 | Obsadit pozici na MV osobou | [FR046](01_model_pozadavku.md#fr-FR046), [FR048](01_model_pozadavku.md#fr-FR048) | — |
| UC064 | Zapojit osobu do mise | [FR047](01_model_pozadavku.md#fr-FR047) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC061"></a>
## UC061 – Zobrazit a vyhledat osoby

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled evidovaných osob a vyhledá konkrétní osobu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR045](01_model_pozadavku.md#fr-FR045) |

**Vstupní podmínky:** Uživatel je na stránce evidence osob.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí tabulku evidovaných osob (jméno, hodnost, osobní číslo). | [G091](03_gui_model.md#gui-G091) |
| 2 | Uživatel zadá hledaný výraz do filtru. | [G090](03_gui_model.md#gui-G090) |
| 3 | Tabulka se přefiltruje podle jména nebo osobního čísla. | — |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam osob.

---

<a id="uc-UC062"></a>
## UC062 – Vytvořit / upravit osobu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel založí novou osobu nebo upraví existující. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR045](01_model_pozadavku.md#fr-FR045) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** (nebo Upravit u řádku). | [G090](03_gui_model.md#gui-G090), [G091](03_gui_model.md#gui-G091) |
| 2 | Systém otevře dialog Detail osoby. | [G092](03_gui_model.md#gui-G092) |
| 3 | Uživatel vyplní Celé jméno (povinné), Hodnost, Osobní číslo, Login. | [G092](03_gui_model.md#gui-G092) |
| 4 | Uživatel klikne **ULOŽIT**. | [G092](03_gui_model.md#gui-G092) |
| 5 | Systém uloží osobu a aktualizuje tabulku. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Osobní číslo není unikátní | Inline chyba, osoba se neuloží. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC062-1 | Celé jméno je povinné. | 4 |
| P-UC062-2 | Osobní číslo (je-li vyplněno) je unikátní. | 5 |

**Koncové podmínky:** Osoba je v evidenci.

---

<a id="uc-UC063"></a>
## UC063 – Obsadit pozici na MV osobou

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel obsadí pozici na MV konkrétní osobou s časovou platností. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR046](01_model_pozadavku.md#fr-FR046), [FR048](01_model_pozadavku.md#fr-FR048) |

**Vstupní podmínky:** Existuje pozice na MV ([RQU002 L006](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006)) i osoba.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v evidenci osob (nebo v dialogu Strukturu velení) zvolí **Obsadit pozici**. | [G091](03_gui_model.md#gui-G091) |
| 2 | Systém otevře dialog Obsazení pozice. | [G093](03_gui_model.md#gui-G093) |
| 3 | Uživatel zvolí osobu, případně časovou platnost. | [G093](03_gui_model.md#gui-G093) |
| 4 | Uživatel klikne **ULOŽIT**. | [G093](03_gui_model.md#gui-G093) |
| 5 | Systém vytvoří obsazení pozice (stav Aktivní). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Pozice již má aktivní obsazení | Systém ukončí stávající obsazení (`platnostDo`) a vytvoří nové, nebo vyžádá potvrzení. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC063-1 | Na jedné pozici je v jeden okamžik nejvýše jedno aktivní obsazení. | 5 |
| P-UC063-2 | Legacy text `personName` na pozici zůstává jako display name; závazná je doménová vazba. | 5 |

**Koncové podmínky:** Pozice je obsazena osobou.

---

<a id="uc-UC064"></a>
## UC064 – Zapojit osobu do mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zapojí osobu do mise s popisem její role. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR047](01_model_pozadavku.md#fr-FR047) |

**Vstupní podmínky:** Existuje mise ([RQU003 L015](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015)) i osoba.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v evidenci osob (nebo v detailu mise) zvolí **Zapojit do mise**. | [G091](03_gui_model.md#gui-G091) |
| 2 | Systém otevře dialog Zapojení do mise. | [G094](03_gui_model.md#gui-G094) |
| 3 | Uživatel zvolí osobu, popíše roli v misi, případně časovou platnost. | [G094](03_gui_model.md#gui-G094) |
| 4 | Uživatel klikne **ULOŽIT**. | [G094](03_gui_model.md#gui-G094) |
| 5 | Systém vytvoří zapojení osoby do mise. | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC064-1 | Dvojice (osoba, mise) je unikátní pro aktivní zapojení. | 5 |

**Koncové podmínky:** Osoba je zapojena do mise.
