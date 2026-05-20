# Use Case model

> **Status: chystaný požadavek (návrh).** Use Case scénáře jsou návrhové – zachycují zamýšlené chování po zavedení evidence osob.

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Zobrazit a vyhledat osoby | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Vytvořit / upravit osobu | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC003 | Obsadit pozici na MV osobou | [FR02](01_model_pozadavku.md#fr-FR02), [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC004 | Zapojit osobu do mise | [FR03](01_model_pozadavku.md#fr-FR03) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Zobrazit a vyhledat osoby

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled evidovaných osob a vyhledá konkrétní osobu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je na stránce evidence osob.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí tabulku evidovaných osob (jméno, hodnost, osobní číslo). | [G002](03_gui_model.md#gui-G002) |
| 2 | Uživatel zadá hledaný výraz do filtru. | [G001](03_gui_model.md#gui-G001) |
| 3 | Tabulka se přefiltruje podle jména nebo osobního čísla. | — |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam osob.

---

<a id="uc-UC002"></a>
## UC002 – Vytvořit / upravit osobu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel založí novou osobu nebo upraví existující. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** (nebo Upravit u řádku). | [G001](03_gui_model.md#gui-G001), [G002](03_gui_model.md#gui-G002) |
| 2 | Systém otevře dialog Detail osoby. | [G003](03_gui_model.md#gui-G003) |
| 3 | Uživatel vyplní Celé jméno (povinné), Hodnost, Osobní číslo, Login. | [G003](03_gui_model.md#gui-G003) |
| 4 | Uživatel klikne **ULOŽIT**. | [G003](03_gui_model.md#gui-G003) |
| 5 | Systém uloží osobu a aktualizuje tabulku. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Osobní číslo není unikátní | Inline chyba, osoba se neuloží. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC002-1 | Celé jméno je povinné. | 4 |
| P-UC002-2 | Osobní číslo (je-li vyplněno) je unikátní. | 5 |

**Koncové podmínky:** Osoba je v evidenci.

---

<a id="uc-UC003"></a>
## UC003 – Obsadit pozici na MV osobou

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel obsadí pozici na MV konkrétní osobou s časovou platností. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02), [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Existuje pozice na MV ([RQU002 L004](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)) i osoba.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v evidenci osob (nebo v dialogu Strukturu velení) zvolí **Obsadit pozici**. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém otevře dialog Obsazení pozice. | [G004](03_gui_model.md#gui-G004) |
| 3 | Uživatel zvolí osobu, případně časovou platnost. | [G004](03_gui_model.md#gui-G004) |
| 4 | Uživatel klikne **ULOŽIT**. | [G004](03_gui_model.md#gui-G004) |
| 5 | Systém vytvoří obsazení pozice (stav Aktivní). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Pozice již má aktivní obsazení | Systém ukončí stávající obsazení (`platnostDo`) a vytvoří nové, nebo vyžádá potvrzení. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC003-1 | Na jedné pozici je v jeden okamžik nejvýše jedno aktivní obsazení. | 5 |
| P-UC003-2 | Legacy text `personName` na pozici zůstává jako display name; závazná je doménová vazba. | 5 |

**Koncové podmínky:** Pozice je obsazena osobou.

---

<a id="uc-UC004"></a>
## UC004 – Zapojit osobu do mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zapojí osobu do mise s popisem její role. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Existuje mise ([RQU003 L001](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L001)) i osoba.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v evidenci osob (nebo v detailu mise) zvolí **Zapojit do mise**. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém otevře dialog Zapojení do mise. | [G005](03_gui_model.md#gui-G005) |
| 3 | Uživatel zvolí osobu, popíše roli v misi, případně časovou platnost. | [G005](03_gui_model.md#gui-G005) |
| 4 | Uživatel klikne **ULOŽIT**. | [G005](03_gui_model.md#gui-G005) |
| 5 | Systém vytvoří zapojení osoby do mise. | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC004-1 | Dvojice (osoba, mise) je unikátní pro aktivní zapojení. | 5 |

**Koncové podmínky:** Osoba je zapojena do mise.
