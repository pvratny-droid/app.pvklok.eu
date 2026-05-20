# Audit – „rám gridu" v GUI modelech (C3HUB)

**Datum:** 2026-05-20
**Rozsah:** všechny dílčí analýzy projektu C3HUB (RQU001, RQU003–RQU010; RQU002 řešena samostatně)
**Stav:** report – **bez úprav** v auditovaných analýzách; implementace doplnění viz „Doporučený postup".

## Kontext

Při revizi prototypu RQU002 se ukázalo, že reverse-engineering u dialogu **G021 (Interakce s MV)** zachytil jen **sloupce gridu** (`ColDefs`), ale ne **rám gridu** – toolbar nad mřížkou: počet záznamů, 3 filtrační checkboxy (měnící typy zobrazených prvků) a vyhledávací pole. Tyto prvky byly ve zdrojovém kódu (`CommandPostInteractionDataGrid.tsx`), jen nebyly vytěženy – seděly v JSX bloku `{isIer && …}` mimo definici sloupců.

Stejnou heuristikou byly prověřeny ostatní C3HUB analýzy. Metodické pravidlo „grid = sloupce + rám" bylo doplněno do `metodika/metodika-zapisu.md` kap. 3.3.2 a 10.5, kontrolní pravidlo pro AI do `metodika/instrukce.md` kap. 2.1.

## Heuristika detekce

Grid třída («Form grid area» nebo «Form» obsahující grid) je podezřelá, pokud:

- má dokumentované **jen sloupce** (sekce „Atributy (sloupce gridu)") a řádkové akce,
- ale v nadřazené třídě **chybí** zmínka o vyhledávání, filtrech, počtu záznamů nebo akcích nad gridem,
- a přitom jde o **přehledový grid** (samostatná stránka / velký katalog), kde toolbar dává smysl.

Malé vnořené gridy v modálních dialozích, kde toolbar legitimně chybí, se značí jako slabý signál.

## Identifikovaní kandidáti

| RQU / GUI | Třída | Síla signálu | Co rámu chybí | Reference |
|---|---|---|---|---|
| RQU008 / G004 | Grid novinek (`newsListDataGrid`) | **Silný** | Vyhledávání, filtr (typ/lokace), počet záznamů. Přehledová admin stránka s potenciálně desítkami novinek. | `RQU008 …/03_gui_model.md` (sekce G004) |
| RQU009 / G002 | Tabulka osob (`personTable`) | Střední | Počet záznamů v gridu; filtr (hodnost/typ osoby). Vyhledávání je na nadřazené G001, ne v gridu – ověřit, zda odpovídá zdroji. | `RQU009 …/03_gui_model.md` (sekce G002) |
| RQU003 / G006 | Plánovací grid interakcí (`planningGrid`) | Slabý | Počet záznamů. Malý grid v záložce detailu mise – toolbar pravděpodobně legitimně chybí, ověřit proti zdroji. | `RQU003 …/03_gui_model.md` (sekce G006) |
| RQU003 / G008 | Grid C2 vazeb (`c2Grid`) | Slabý | Počet záznamů. Malý grid v záložce dialogu – obdobně. | `RQU003 …/03_gui_model.md` (sekce G008) |

## Čisté analýzy (bez podezření)

| RQU | Závěr |
|---|---|
| RQU001 – Souhrn aplikace | Žádné grid třídy (jen «Form area» / «Form multi area» dlaždice). Čisté. |
| RQU004 – Model SVŘ | G004 (Tabulka prvků) má vyhledávání přímo v gridu (atribut `searchTerm`); G008a/G012a jsou vnořené dialogové gridy. Čisté. |
| RQU005 – Katalog služeb | Sdílí G003/G004 z RQU004. Čisté. |
| RQU006 – Společné a bojové funkce | Malé statické read-only tabulky (přehled). Toolbar není potřeba. Čisté. |
| RQU007 – C3 schopnosti a požadavky | Malé statické read-only tabulky. Čisté. |
| RQU010 – Číselníky požadavků a omezení | Modifikace RQU004, sdílí G003/G004. Čisté. |

## Doporučený postup

Každého kandidáta řešit v **samostatné pracovní session** s danou RQU jako primárním adresářem. **Klíčové:** před úpravou analýzy **ověřit rám gridu přímo proti zdrojovému kódu** příslušné `*DataGrid.tsx` / grid komponenty – přečíst celé JSX tělo komponenty, ne jen `ColDefs`, a trasovat podmíněné bloky (`{isX && …}`). Nepřebírat fakta z agentských souhrnů (viz poučení z RQU002 níže).

Pro každé doplnění použít postup jako u RQU002 / G021:

1. `03_gui_model.md` – do atributů grid třídy (nebo nadřazené «Form») doplnit rám: počet záznamů, vyhledávání, filtry, akce nad gridem; sekci „Verze: RQU…" s odůvodněním.
2. Pokud filtr mění typy zobrazených prvků, zachytit i variabilitu stromu/gridu.
3. `README.md` – poznámka + případné otevřené otázky.
4. `/analyza-validate` → `/analyza-build`.

## Poučení z RQU002 (proč slepé místo vzniklo)

Reverse-engineering i následný průzkum přes Explore agenta zachytil grid jen jako **sloupce**. Příčiny:

1. **Grid ≠ jen sloupce** – toolbar je v kódu renderovaný mimo `ColDefs`.
2. **Podmíněné UI** – ovládací prvky v bloku `{isIer && …}` se renderují jen v jednom režimu.
3. **„Filtr = boilerplate" slepota** – filtry vypadají jako generická výbava, ač mění rozsah datového modelu.
4. **Agentský souhrn zkreslil** – průzkumný agent uvedl „search v obou pohledech" (reálně jen IER) a „IP-view 3 úrovně" (reálně 2). Fakta o struktuře gridu je nutné ověřovat **přímým čtením zdroje**.

## Metodická prevence

- `metodika/metodika-zapisu.md` kap. **3.3.2** – „Grid = sloupce + rám (toolbar)".
- `metodika/metodika-zapisu.md` kap. **10.5** – „grid není jen ColDefs": čti celé JSX, trasuj podmíněné bloky.
- `metodika/instrukce.md` kap. **2.1** bod 5 – kontrola rámu gridu.
- `CLAUDE.md` – `<task_uml_analyza>` „Anti-patterny": grid = sloupce + rám.
