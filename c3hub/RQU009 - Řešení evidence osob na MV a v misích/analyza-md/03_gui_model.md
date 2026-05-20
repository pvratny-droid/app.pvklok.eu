# GUI model

> **Status: chystaný požadavek (návrh).** GUI třídy jsou návrhové – v aktuální verzi aplikace neexistují. Slouží k zachycení zamýšleného rozhraní pro evidenci osob.

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Podtržení** názvu = atribut je v editaci **povinný**.
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Seznam osob | personListPage | «Form» |
| └ [G002](#gui-G002) | Tabulka osob | personTable | «Form grid area» |
| [G003](#gui-G003) | Detail osoby | personDialog | «Form modal» |
| [G004](#gui-G004) | Obsazení pozice | positionAssignmentDialog | «Form modal» |
| [G005](#gui-G005) | Zapojení do mise | missionAssignmentDialog | «Form modal» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G001"></a>
## «Form» Seznam osob

Návrhová přehledová stránka evidence osob.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Evidence osob" |
| 2 | E | EText | Vyhledat | searchQuery | Filtr podle jména / osobního čísla |
| 3 | E | EGrid | Tabulka osob | — | Vnořený [G002](#gui-G002) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatOsobu() | + Přidat | Otevře [G003](#gui-G003) | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | Vyhledat() | — | Filtruje tabulku osob | [UC001](02_use_case_model.md#uc-UC001) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Tabulka osob |
| opens | [G003](#gui-G003) | Detail osoby |
| dataSource | [Osoba](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G002"></a>
## «Form grid area» Tabulka osob

Tabulka evidovaných osob.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RAkce | Akce | actions | Upravit / Obsadit pozici / Zapojit do mise |
| 2 | R | RText | Celé jméno | celeJmeno | |
| 3 | R | RText | Hodnost | hodnost | |
| 4 | R | RText | Osobní číslo | osobniCislo | |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | UpravitOsobu() | — | Otevře [G003](#gui-G003) | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | ObsaditPozici() | — | Otevře [G004](#gui-G004) | [UC003](02_use_case_model.md#uc-UC003) |
| 3 | ZapojitDoMise() | — | Otevře [G005](#gui-G005) | [UC004](02_use_case_model.md#uc-UC004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Osoba](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G003"></a>
## «Form modal» Detail osoby

Modální dialog pro vytvoření / úpravu osoby.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Detail osoby" |
| 2 | E | EText | **Celé jméno** | celeJmeno | Povinné |
| 3 | E | EText | Hodnost | hodnost | |
| 4 | E | EText | Osobní číslo | osobniCislo | Unikátní (je-li vyplněno) |
| 5 | E | EText | Login | login | Volitelná vazba na uživatelský účet |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Uloží osobu | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Osoba](04_logicky_model.md#lm-L001) | |

---

<a id="gui-G004"></a>
## «Form modal» Obsazení pozice

Modální dialog pro obsazení pozice na MV osobou. Integruje se do dialogu Strukturu velení v [RQU002 G007](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md#gui-G007).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Obsazení pozice" |
| 2 | E | ELOV | **Osoba** | osoba | Povinné; výběr z evidence osob |
| 3 | R | RText | Pozice na MV | pozice | Kontext (pozice, která se obsazuje) |
| 4 | E | EDatumCas | Platnost od | platnostOd | |
| 5 | E | EDatumCas | Platnost do | platnostDo | Prázdné = aktivní obsazení |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Vytvoří obsazení pozice | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC003](02_use_case_model.md#uc-UC003) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Obsazení pozice na MV](04_logicky_model.md#lm-L002) | |
| dataSource | [RQU002 L004 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | Cross-link |

---

<a id="gui-G005"></a>
## «Form modal» Zapojení do mise

Modální dialog pro zapojení osoby do mise. Integruje se do detailu mise v [RQU003 G004](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/03_gui_model.md#gui-G004).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Zapojení do mise" |
| 2 | E | ELOV | **Osoba** | osoba | Povinné; výběr z evidence osob |
| 3 | R | RText | Mise | mise | Kontext (mise, do které se zapojuje) |
| 4 | E | EText | Role v misi | roleVMisi | Volný popis role |
| 5 | E | EDatumCas | Platnost od | platnostOd | |
| 6 | E | EDatumCas | Platnost do | platnostDo | |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Vytvoří zapojení do mise | [UC004](02_use_case_model.md#uc-UC004) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC004](02_use_case_model.md#uc-UC004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Zapojení osoby do mise](04_logicky_model.md#lm-L003) | |
| dataSource | [RQU003 L001 Mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L001) | Cross-link |
