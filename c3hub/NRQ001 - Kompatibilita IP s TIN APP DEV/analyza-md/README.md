# NRQ001 — Kompatibilita IP s TIN, APP a DEV (předběžný návrh)

**Projekt:** C3HUB (Command, Control & Consult Hub)
**Datum:** 2026-05-10
**Stav:** proposal (předběžný návrh změny)
**Úroveň analýzy:** `proposal` — jediný obsahový soubor [`00_predbezny_navrh.md`](00_predbezny_navrh.md), žádné UC/GUI/LM/diagramy.

> Tento dokument je **návrh změny**, ne plnohodnotná analýza. Popisuje, co je potřeba doplnit/upravit v dotčených RQU. Po schválení vznikne samostatná `complete` analýza nebo se přímo edituje dotčené RQU; tento návrh poté jde do `archived`.

## Cíl

Doplnit do doménového modelu C3HUB atributy a entity nutné k zodpovězení dotazu **„lze daný informační produkt (IP) přenést pomocí konkrétní technologické interakce (TIN)?"**. V kartě MV (RQU002 FR06 „Informační toky a produkty") přidat ke každému IP akci, která pro zvolený TIN vrátí verdikt kompatibility (✓/⚠/✗) a zdůvodnění, určenou primárně pro CIS architekta.

## Dotčené RQU

| RQU | Soubor | Klíčové změny |
|---|---|---|
| RQU002 — Karty mist veleni | [otevřít](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/index.html) | Rozšíření `fr-FR06` o akci „Ověřit kompatibilitu s TIN", nový UC „Ověření kompatibility IP s TIN" (volné ID `UC015`), nový GUI prvek `«Form modal» KontrolaKompatibilityIP` (volné ID `G029`). |
| RQU004 — Model SVR domenove entity | [otevřít](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/index.html) | Doplnění atributů na `lm-L004` (IP), `lm-L005` (TIN), `lm-L017` (CIS Aplikace), `lm-L018` (CIS Zařízení); nová třída **L022 Protokol** (stereotyp `PROTOCOL`) s M:N vazbami; doplnění číselníku `stereotyp_E` o hodnotu `PROTOCOL`. |

Detail změn po prvcích viz kap. 3 v [návrhu](00_predbezny_navrh.md).

## Fáze realizace

1. **Fáze 0 — ARCHIREPO (externí závislost):** Rozšíření grafového schématu ARCHIREPO o SV-7 / SvcV-7 atributy a entitu Protocol na úrovni typů SVŘ entit. Samostatný úkol týmu ARCHIREPO, blokuje fáze 1+2.
2. **Fáze 1 — RQU004 (doménový model):** Doplnění atributů a entity Protokol dle kap. 3; cílový stav tříd viz diagram v kap. 4.1; aktualizace `lm_class_diagram.puml` v RQU004.
3. **Fáze 2 — RQU002 (UC + GUI kontrola kompatibility):** Rozšíření FR06, nový UC „Ověření kompatibility IP s TIN" a GUI modal s rozpisem pravidel (algoritmus kompatibility viz kap. 4).

## Dotčené standardy

- **NAFv4 / DODAF SV-7** — Systems Measures Matrix (kontejner kvantitativních výkonnostních atributů systémů).
- **STANAG 5066** — Profile for HF Data Communications.
- **STANAG 5516** — Link 16 (ATDLP-5.16, Tactical Data Exchange).
- **STANAG 4406** — Military Message Handling System (MMHS).
- **STANAG 4774 / 4778** — klasifikační (confidentiality) metadata.
- **STANAG 5636** — Subject Matter Identifiers (už používáno v RQU004 jako `s5636Id`).
- **FMN** — Federated Mission Networking, Spiral Specifications, Service Interface Profiles.
- **NISP** — NATO Interoperability Standards and Profiles.

## Otevřené otázky (souhrn)

- **OQ1 — Vícenásobné hodnoty atributů:** bandwidth/latence se liší podle provozního módu (např. STANAG 5066); jeden skalární atribut nestačí. Rozhodnutí ve Fázi 0.
- **OQ2 — Strukturovaná klasifikace:** STANAG 4774/4778 metadata jsou strukturovaná (classification + policy + categories + caveats); modelovat jako komplexní datový typ. Rozhodnutí ve Fázi 0.
- **OQ3 — Rozšíření na vyhledávání kandidátních TIN:** návrh řeší jen kontrolu jedné dvojice (IP, TIN); hromadné vyhledávání „které TIN přenesou daný IP", příp. mezi dvěma MV, je možné budoucí rozšíření — mimo scope.
- **OQ4 — Úroveň detailu výstupu:** plný rozpis po pravidlech (pro CIS architekta) vs. kompaktní souhrnný verdikt (pro plánovače spojení). K rozhodnutí ve Fázi 2.
- **OQ5 — Číslování změnových požadavků:** vyřešeno — návrh dostal kód **NRQ001** (samostatná řada NRQ pro předběžné návrhy). Po schválení vznikne `complete` analýza nebo se editují RQU002 a RQU004 a tato NRQ001 jde do `archived`.
- **OQ6 — Formátové pravidlo algoritmu:** kap. 4 porovnává `IP.formát ∈ TIN.podporovanéFormáty`, ale kap. 3 přiřazuje „podporované formáty IP" Aplikaci (L017), ne TIN (L005). Nutno sjednotit. Rozhodnutí ve Fázi 1.

Plné znění otázek viz kap. 6 v [návrhu](00_predbezny_navrh.md).

## Zkratky

| Zkratka | Význam |
|---|---|
| IP | Informační produkt |
| TIN | Technologická interakce (Technical Interaction Node) |
| MV | Místo velení |
| IER | Information Exchange Requirement |
| CIS | Communication and Information Systems |
| App / DEV | Aplikace / Zařízení (Device) |
