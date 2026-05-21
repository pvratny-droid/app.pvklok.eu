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
| [G090](#gui-G090) | Seznam osob | personListPage | «Form» |
| └ [G091](#gui-G091) | Tabulka osob | personTable | «Form grid area» |
| [G092](#gui-G092) | Detail osoby | personDialog | «Form modal» |
| [G093](#gui-G093) | Obsazení pozice | positionAssignmentDialog | «Form modal» |
| [G094](#gui-G094) | Zapojení do mise | missionAssignmentDialog | «Form modal» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G090"></a>
## «Form» Seznam osob

Návrhová přehledová stránka evidence osob.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Evidence osob" |
| 2 | E | EText | Vyhledat | searchQuery | Filtr podle jména / osobního čísla |
| 3 | E | EGrid | Tabulka osob | — | Vnořený [G091](#gui-G091) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | PřidatOsobu() | + Přidat | Otevře [G092](#gui-G092) | [UC062](02_use_case_model.md#uc-UC062) |
| 2 | Vyhledat() | — | Filtruje tabulku osob | [UC061](02_use_case_model.md#uc-UC061) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G091](#gui-G091) | Tabulka osob |
| opens | [G092](#gui-G092) | Detail osoby |
| dataSource | [Osoba](04_logicky_model.md#lm-L051) | |

---

<a id="gui-G091"></a>
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
| 1 | UpravitOsobu() | — | Otevře [G092](#gui-G092) | [UC062](02_use_case_model.md#uc-UC062) |
| 2 | ObsaditPozici() | — | Otevře [G093](#gui-G093) | [UC063](02_use_case_model.md#uc-UC063) |
| 3 | ZapojitDoMise() | — | Otevře [G094](#gui-G094) | [UC064](02_use_case_model.md#uc-UC064) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Osoba](04_logicky_model.md#lm-L051) | |

---

<a id="gui-G092"></a>
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
| 1 | Uložit() | ULOŽIT | Uloží osobu | [UC062](02_use_case_model.md#uc-UC062) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC062](02_use_case_model.md#uc-UC062) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Osoba](04_logicky_model.md#lm-L051) | |

---

<a id="gui-G093"></a>
## «Form modal» Obsazení pozice

Modální dialog pro obsazení pozice na MV osobou. Integruje se do dialogu Strukturu velení v [RQU002 G017](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md#gui-G017).

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
| 1 | Uložit() | ULOŽIT | Vytvoří obsazení pozice | [UC063](02_use_case_model.md#uc-UC063) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC063](02_use_case_model.md#uc-UC063) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Obsazení pozice na MV](04_logicky_model.md#lm-L052) | |
| dataSource | [RQU002 L006 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) | Cross-link |

---

<a id="gui-G094"></a>
## «Form modal» Zapojení do mise

Modální dialog pro zapojení osoby do mise. Integruje se do detailu mise v [RQU003 G042](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/03_gui_model.md#gui-G042).

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
| 1 | Uložit() | ULOŽIT | Vytvoří zapojení do mise | [UC064](02_use_case_model.md#uc-UC064) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC064](02_use_case_model.md#uc-UC064) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Zapojení osoby do mise](04_logicky_model.md#lm-L053) | |
| dataSource | [RQU003 L015 Mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015) | Cross-link |
