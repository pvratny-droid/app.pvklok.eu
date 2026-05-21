# UML Analýza – Řešení evidence osob na MV a v misích (COCO C3 HUB)

> **Status: chystaný požadavek (návrh).** RQU009 zatím **nemá vlastní zdrojový kód** v reverse-engineering vstupu C3HUB. Tato analýza je **návrhová** – byla zpracována z pohledu **provázanosti a konzistence** s existujícími analýzami (RQU002, RQU003, RQU001) a bude zpřesněna po doplnění zdrojového kódu.

Analýza navrhuje **závaznou doménovou entitu Osoba** a její vazby na pozice MV a mise. Nahrazuje dosavadní volné textové reprezentace osob:

- `responsiblePerson` na specifikaci MV ([RQU002 L004](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)),
- `personName` na pozici na MV ([RQU002 L006](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006)).

**Vstup analýzy:** provázanost s existujícími analýzami C3HUB. Vlastní zdrojový kód modulu zatím není k dispozici.

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – Řešení evidence osob na MV a v misích
**Úroveň:** complete (návrh)
**Přírůstek:** Etapa 2 – chystaný požadavek
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C04 | 4 |
| Funkční požadavky | FR045–FR048 | 4 |
| Use Cases | UC061–UC064 | 4 |
| GUI třídy | G090–G094 | 5 |
| Logický model – třídy | L051–L053 | 3 |
| Logický model – číselníky | E039 | 1 |
| Sekvenční diagramy | — (chystaný požadavek) | 0 |
| Stavové diagramy | SM-L052 (stav obsazení pozice) | 1 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (návrh rozhraní evidence osob) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (Osoba, Obsazení pozice, Zapojení do mise) |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | (chystaný požadavek bez sekvenčních diagramů) |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | Stavový diagram obsazení pozice |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sm_l052.puml](diagrams/sm_l052.puml) | Stav obsazení pozice na MV |

---

## Provázanost s ostatními RQU

| RQU | Vazba |
|---|---|
| [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | `responsiblePerson` (legacy text) → vazba přes [L052 Obsazení pozice na MV](04_logicky_model.md#lm-L052) |
| [RQU002 L006 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) | `osoba` (legacy text) → vazba přes [L052](04_logicky_model.md#lm-L052) |
| [RQU003 L015 Mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015) | zapojení osob přes [L053 Zapojení osoby do mise](04_logicky_model.md#lm-L053) |
| [RQU001 L002 Uživatelský kontext](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/04_logicky_model.md#lm-L002) | volitelná vazba osoby na uživatelský účet (atribut `login`) |

---

## Otevřené otázky

- **Zdrojový kód** – RQU009 zatím nemá vlastní implementaci; všechny prvky jsou návrhové a po dodání zdrojového kódu budou zpřesněny / ověřeny.
- **Migrace legacy textu** – jak konkrétně proběhne převod stávajících textových hodnot `responsiblePerson` / `personName` na entity Osoba (automaticky / ručně / kombinace).
- **Vztah k IdM** – zda evidence osob bude napojena na Keycloak/IdM (`coco/idm`) nebo bude samostatná.
- **Rozsah atributů Osoby** – hodnost, osobní číslo a další atributy jsou návrhové; finální sada bude dle požadavku.
- **Zapojení do mise vs. obsazení pozice** – zda zapojení osoby do mise bude vždy přes pozici na MV, nebo i samostatně (návrh počítá s oběma).
