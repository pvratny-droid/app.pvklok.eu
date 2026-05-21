# NRQ002 — Role a oprávnění C3HUB

**Předběžný návrh změny** (`proposal`) · C3HUB · 2026-05-21

Návrh zavedení **aplikačních rolí a oprávnění (RBAC)** do systému C3HUB na základě
nezávisle vytvořeného dokumentu *„C3HUB – Use Cases, Role a Oprávnění"* (verze 3.4 wip).

## Cíl

Zmapovat **8 aplikačních rolí** na existující Use Case a GUI prvky analýz RQU001–RQU010,
navrhnout katalog oprávnění a cílovou strukturu RBAC subsystému, a definovat rozsah
zadání pro vývoj. Nejde o klasický funkční změnový požadavek — RBAC je **průřezová**
záležitost přes všechny dosavadní analýzy projektu.

## Obsah návrhu (záložka „Návrh změny")

| Kap. | Obsah |
|---|---|
| 1–3 | Cíl, motivace, východiska a omezení zdroje |
| 4 | Model rolí — 8 rolí (ROLE-01…ROLE-08) |
| 5 | Katalog oprávnění (hybrid: 14 skupinových + jemný rozpad) |
| 6 | Matice **Role × Oprávnění** (hrubá + jemná) |
| 7 | Datový rozsah — 2. dimenze přístupu (+ chráněná MV) |
| 8 | Matice **Aktér × UC** — hrubá (13 oblastí) + jemná (74 UC) |
| 9 | Matice **Aktér × GUI** — odvozená (103 GUI tříd) |
| 10 | Dotčené RQU a prvky |
| 11 | Návrh cílové struktury RBAC (datový model + architektura autorizace) |
| 12 | Rozsah zadání pro vývoj (3 fáze + odložené) |
| 13–16 | Závislosti, otevřené otázky, verifikace, reference |

## Klíčová zjištění

- **Původ obsahu je vyznačen** odznaky 🟩 ZDROJ / 🟦 DERIVACE / 🟧 NÁVRH u každé tabulky
  a matice — výchozí prvky převzaté ze zdroje jsou rozpoznatelné na první pohled.
- **Dvouvrstvý model přístupu:** aplikační oprávnění (*co*) + datový rozsah (*na čem*).
- **C3HUB je implementovaná aplikace** (RQU001–008/010 vznikly reverse-engineeringem,
  rozpracovaná je jen RQU009) — zavedení RBAC je retrofit; aplikace už dnes obsahuje
  dílčí ACL primitivy, které návrh formalizuje a rozšiřuje.
- **Nová funkcionalita mimo overlay:** přihlášení, správa rolí a org. zařazení (UC-08,
  UC-09, UC-11, UC-12) — doporučena samostatná `complete` analýza modulu Administrace/IAM.
- **24 ze 74 jemných UC** zdroj neřeší (moduly Katalog služeb, Novinky, Osoby, Číselníky)
  — v maticích označeno `?` a předáno do otevřených otázek.
- **Odloženo dle zdroje:** delegace oprávnění (UC-13), doménové filtrování.

## Zdroj

`src/C3HUB/Role a práva/C3HUB_UseCases_Role_Opravneni.docx (1).md` (interní pracovní
dokument, verze 3.4 wip, 14. 5. 2026).
