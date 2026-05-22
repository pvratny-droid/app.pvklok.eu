# NRQ001 — Vypořádání otevřených otázek RQU001 (předběžný návrh)

**Projekt:** DSZEZ (Digitální schvalování zkoušek EZ, ČEPS a.s.)
**Datum:** 2026-05-22
**Stav:** proposal (předběžný návrh změny)
**Úroveň analýzy:** `proposal` — jediný soubor [`00_predbezny_navrh.md`](00_predbezny_navrh.md), žádné UC/GUI/LM/diagramy.

> Tento dokument je **návrh změny**, ne plnohodnotná analýza. Popisuje, jak vypořádat 16 otevřených otázek analýzy RQU001. Po schválení vznikne realizační (`complete`) analýza nebo se přímo editují dotčené prvky RQU001; tento návrh poté jde do `archived`.

## Cíl

Analýza RQU001 eviduje 16 otevřených otázek (nekonzistence zadání, mezery, domněnky), které brání jejímu posunu do realizace. Návrh každou otázku vypořádá konkrétním rozhodnutím, vymezí jeho dopad do prvků RQU001 a u významných otázek je předkládá zadavateli (ČEPS) k potvrzení. Zpětně ověřuje konzistenci navržených řešení s funkčním prototypem.

## Dotčené RQU

| RQU | Soubor | Klíčové změny |
|---|---|---|
| RQU001 — Digitální schvalování zkoušek EZ | [otevřít](../../RQU001%20-%20Digitální%20schvalování%20zkoušek%20EZ/analyza-md/index.html) | Upřesnění běhu workflow (FR0004), routovacích pravidel (L0010), notifikací (FR0006), skladby polí formulářů dle typu (G0003–G0008), triggeru provedení zkoušky (SM-L0001); potvrzení rozsahu evidence vyhodnocení a integrace AŘP |

Detail změn po prvcích viz kap. 3 v [návrhu](00_predbezny_navrh.md).

## Fáze realizace

1. **Redakční úklid katalogu** — doplnění `REQ_WF_015–021`, sloučení duplicit, oprava křížových odkazů v `Byznys požadavky.xlsx` (otázky #1, #7, #8, #15).
2. **IT1 — jádro systému** — vypořádání otázek #1–#9, #11, #14, #16: workflow, formuláře provozních / certifikačních / periodických zkoušek, notifikace, zastupitelnost, ruční evidence provedení zkoušky.
3. **IT2 — následný přírůstek** — vypořádání #10 (evidence vyhodnocení), #12 (integrace AŘP), #13 (vyznačení obsahových změn), náročnější workflow rizikové skupiny.
4. **Souběžně** — samostatná RQU „Správa uživatelů a oprávnění" (otázka #9).

## Dotčené standardy

- **Kodex přenosové soustavy, část VI**, kap. 2.4 — Povolování zkoušek EZ (skladba polí formulářů, program zkoušky).
- **Pracovní postup PP/86/2025**, příloha č. 3 — Schvalovací postup rizikových zkoušek.
- **ČEPS Quick IT analýza M3P, v1.1** — varianty řešení, doporučení MS Office 365 (Entra ID, bez JIRA).

## Otevřené otázky (souhrn)

- **OQ-A** — „Black startové" zkoušky: 7. hodnota číselníku, nebo varianta rizikové skupiny? (#3)
- **OQ-B** — Patří evidence provedené zkoušky do první verze, nebo až do IT2? (#10)
- **OQ-C** — Závazná skladba a povinnost polí formulářů per typ zkoušky. (#14)
- **OQ-D** — Spadá správa uživatelských účtů do DSZEZ, nebo je centrální na úrovni ČEPS? (#9)
- **OQ-E** — Konkrétní lhůty pro posouzení a vyjádření per typ zkoušky. (#2)

Plné znění otázek viz kap. 6 v [návrhu](00_predbezny_navrh.md).

## Zkratky

| Zkratka | Význam |
|---|---|
| EZ | Elektroenergetické zařízení |
| PS | Přenosová soustava |
| AŘP | Aplikace pro řízení (plánování) přípravy provozu |
| SVR | Sekundární regulace (poskytování podpůrných služeb) |
| REQ_WF / NREQ | Funkční / nefunkční požadavek v katalogu `Byznys požadavky.xlsx` |
| RBAC | Řízení přístupu na základě rolí (Role-Based Access Control) |
| IT1 / IT2 | První / druhý realizační přírůstek |
