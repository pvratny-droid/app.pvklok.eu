# Audit – kandidáti na rozdělení Use Case (C3HUB)

**Datum:** 2026-05-19
**Rozsah:** všechny dílčí analýzy projektu C3HUB (RQU001, RQU003–RQU009; RQU002 řešena samostatně)
**Stav:** report – **bez úprav** v auditovaných analýzách; implementace splitů viz „Doporučený postup".

## Kontext

Při tvorbě HTML prototypu analýzy **RQU002 – Karty míst velení** se ukázalo, že Use Case `UC011` „Přidat IER / IP / FMN instrukci" je ve skutečnosti **kombinovaný UC** sdružující tři zásadně odlišné scénáře. Byl rozdělen na `UC011a/b/c` (viz `RQU002/analyza-md/02_use_case_model.md`). Stejnou heuristikou byly prověřeny ostatní C3HUB analýzy.

Metodické pravidlo proti kombinovaným UC bylo doplněno do `metodika/metodika-zapisu.md` kap. 2.3.5 a kontrolní pravidlo pro AI do `metodika/instrukce.md` kap. 2.1.

## Heuristika detekce „kombinovaného UC"

UC je podezřelý na rozdělení, pokud platí jeden či více signálů:

- **Lomítko mezi 2+ entitami** v názvu („Přidat IER / IP / FMN").
- **Spojka „nebo" / „/"** mezi dvěma operacemi („Vytvořit / upravit X").
- **2+ různé GUI dialogy** otevírané podle typu vstupu.
- **2+ různé backend endpointy** podle větve.
- **Alternativní scénáře podmíněné typem** vstupního artefaktu.

## Identifikovaní kandidáti

| RQU / UC | Aktuální název | Síla signálu | Důvod | Návrh splitu |
|---|---|---|---|---|
| RQU001 / UC009 | Nahlásit požadavek / chybu / námět | **Silný** | Tři typy hlášení (FR / BUG / IDEA) s odlišným business workflow a prioritizací; název obsahuje „/" mezi 3 entitami. | UC009a „Nahlásit nový požadavek", UC009b „Nahlásit chybu", UC009c „Nahlásit námět". |
| RQU005 / UC003 | Vytvořit / upravit CIS prvek | Střední | Kombinace vytvořit/upravit; vstupní podmínka rozlišuje „nový vs. stávající"; create = POST, update = PATCH/PUT. RQU004 už má oddělené UC „Vytvořit" vs. „Duplikovat". | UC003a „Vytvořit nový CIS prvek", UC003b „Upravit existující CIS prvek". |
| RQU009 / UC002 | Vytvořit / upravit osobu | Střední | Kombinace vytvořit/upravit; krok 1 rozlišuje „+ Přidat" vs. „Upravit u řádku". Konzistence s RQU003/RQU004, kde jsou create/edit oddělené. | UC002a „Vytvořit novou osobu", UC002b „Upravit existující osobu". |

### Reference

- RQU001 / UC009 → `src/C3HUB/RQU001 - Souhrn aplikace/analyza-md/02_use_case_model.md` (sekce UC009)
- RQU005 / UC003 → `src/C3HUB/RQU005 - Katalog sluzeb/analyza-md/02_use_case_model.md` (sekce UC003)
- RQU009 / UC002 → `src/C3HUB/RQU009 - Řešení evidence osob na MV a v misích/analyza-md/02_use_case_model.md` (sekce UC002)

## Čisté analýzy (bez podezření)

| RQU | Závěr |
|---|---|
| RQU003 – Mise, operace, cvičení | UC jsou buď jednoduché (UC001–UC007), nebo už správně oddělené (UC008 interakce vs. UC009 velitelské vazby), nebo generátory. Čisté. |
| RQU004 – Model SVŘ doménové entity | UC004 „Vytvořit prvek" a UC005 „Duplikovat prvek" jsou už oddělené; UC006–UC007 jsou edit vs. schvalovací workflow. Čisté. |
| RQU006 – Společné a bojové funkce | 3 UC, všechny read-only referenční zobrazení. Čisté. |
| RQU007 – C3 schopnosti a požadavky | 3 UC, všechny read-only stažení / zobrazení. Čisté. |
| RQU008 – Provozní formuláře | UC003–UC005 jasně oddělené (vytvořit / upravit / smazat), UC006 stažení. Čisté. |

## Doporučený postup

Každého identifikovaného kandidáta řešit v **samostatné pracovní session** s danou RQU jako primárním adresářem. Důvod: každá RQU má 30+ GUI tříd, vlastní LM a specifika – řešit více RQU v jednom kontextu zvyšuje riziko křížení úprav.

Pro každý split použít **stejný postup jako u RQU002 / UC011** (viz `RQU002/analyza-md/`):

1. `02_use_case_model.md` – přehledová tabulka + původní UC vyřadit (`«zrušeno-RQU…»`) + plné nové UC se scénáři, alternate paths, pravidly.
2. `01_model_pozadavku.md` – aktualizovat „Realizující UC" u dotčeného FR.
3. `03_gui_model.md` – přesměrovat „Vazba na UC" v operacích dotčených GUI tříd.
4. `05_sekvencni_diagramy.md` + `diagrams/` – doplnit SD pro nové UC.
5. `manifest.json` – doplnit nové `.puml` do `plantuml.seq`, refresh `date`.
6. `README.md` – aktualizovat rozsah a poznámky.
7. `/analyza-validate` → `/analyza-build`.

## Metodická prevence

Aby kombinované UC nevznikaly v nových analýzách, byla doplněna metodika:

- `metodika/metodika-zapisu.md` kap. **2.3.5** – anti-pattern „kombinovaný UC".
- `metodika/metodika-zapisu.md` kap. **3.3.1** – povinný výčet operací u sloupce `RAkce`.
- `metodika/metodika-zapisu.md` kap. **3.4** – sémantika typu `RTree`.
- `metodika/instrukce.md` kap. **2.1** – kontrolní pravidla AI při interpretaci.
- `CLAUDE.md` – `<workflow>` krok 3 + `<task_uml_analyza>` sekce „Anti-patterny".
