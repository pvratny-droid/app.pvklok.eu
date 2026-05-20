# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu, IT architektury nebo plánovač velení. Spravuje karty míst velení – vytváří nová MV, edituje specifikaci, schopnosti a strukturu velení, prohlíží informační toky a FMN instrukce, generuje reporty a stahuje exporty. |
| **Systém C3 HUB** | Vlastní aplikace COCO – přijímá editační akce uživatele, persistuje karty MV, generuje exporty (PDF / XLSX) a komunikuje s ostatními moduly (Model SVŘ, Mise). |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Vést jednotnou evidenci míst velení (MCP a NATO komponentní velitelství) ve formě kartiček s vizuální reprezentací. |
| **C02** | Umožnit detailní specifikaci jednotlivého MV – jeho schopnosti, strukturu (pozice / role), informační toky a vazbu na 13 FMN instrukcí. |
| **C03** | Umožnit hierarchické členění MV (podřízená MV) a jejich vzájemné asociace. |
| **C04** | Generovat tisknutelné výstupy (Základní karta velení – PDF, Rozšířená karta velení – PDF, CIS matice – XLSX) pro distribuci mimo aplikaci. |

---

## Funkční požadavky

<a id="fr-FR01"></a>
### FR01 – Přehled karet míst velení

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit přehled všech evidovaných míst velení formou karetní mřížky (grid). Každá karta obsahuje název, krátký popis, vlajku (země), obrázek (typ MV), taktickou značku (ikona) a primární akce **REPORT** a **ZOBRAZIT**. Uživatel může filtrovat textovým vyhledávacím polem („Vyhledat místa velení podle jména nebo popisu"), přepínat zobrazení mezi grid a list ikon vpravo nahoře a založit nové MV tlačítkem **+ PŘIDAT** v záhlaví sekce. |
| **Návrh řešení** | `«Form» KartyMístVelení` (URL `/web/command-posts`) s vyhledávacím polem, view-mode přepínačem a `«Form multi area» KartaMístaVelení` jako šablonou jedné karty. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC001](02_use_case_model.md#uc-UC001), [UC002](02_use_case_model.md#uc-UC002)

---

<a id="fr-FR02"></a>
### FR02 – Detail karty místa velení

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit a editovat detail jednoho místa velení v rámci samostatné stránky se čtyřmi tematickými sekcemi: **Specifikace, schopnosti a velitelská struktura** (3 dlaždice: Specifikace MV, Formulář schopností, Strukturu velení), **Informační toky a produkty na místě velení** (2 dlaždice: Pohled přes IER, Pohled přes IP – s tlačítky „+ PŘIDAT PODLE IER" a „+ PŘIDAT PODLE IP"), **FMN instrukce** (13 dlaždic – Fire Support, Operational Level C2, C2 of Air Operations, CIMIC, Service Management & Control, Federated Medical Support, C2 of Land Operations, C2 of Space Operations, Intelligence and JISR, Communications, Joint Targeting, Electromagnetic Warfare, Identity and Access Management) a **Karty míst velení ke stažení** (Základní karta velení PDF, Rozšířená karta velení PDF, CIS matice XLSX). |
| **Návrh řešení** | `«Form» DetailKartyMV` (URL `/web/command-posts/<id>`) se čtyřmi `«Form area»` sekcemi. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC003](02_use_case_model.md#uc-UC003)

---

<a id="fr-FR03"></a>
### FR03 – Editace specifikace místa velení

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Umožnit editaci specifikace MV. Dialog `«Form modal» SpecifikaceMV` obsahuje deset tematických sekcí: **(1) Místo velení** (typ MV `*`, název, zodpovědná osoba, taktická značka, kód jednotky, vlajka, obrázek, cílový stav); **(2) Podřízená místa velení** (grid s akcemi přidat/smazat); **(3) Funkce a úroveň** (společné funkce – multi-LOV, bojové funkce – multi-LOV, úroveň – LOV); **(4) Kontinuita** (radio: Trvalé / Dočasné); **(5) Mobilita** (radio: Stacionární / Mobilní; pokud Mobilní, navíc multi-LOV druhů pohyblivosti); **(6) Stupeň balistické ochrany vozidel** (jen při Mobilní: kinetická + minová – dva LOV); **(7) Zabezpečení ochrany dle RMO č.49/2017** (Zabezpečení ochrany MV – LOV s popisem, Odolnost – LOV s popisem, Soběstačnost – LOV); **(8) Omezení, požadavky a další** (omezení – multi-LOV, funkce MV – text; požadavky – multi-LOV, P. č. dle VODOS – text); **(9) Lokace** (šířka + délka – GPS, povinné společně). **Verze: RQU002** – seznam atributů a sekcí převzat 1:1 z `CommandPostSpecificationDialog.tsx` (`/coco/web-app/src/content/post/specification/`). Editace dialogu zachová ACL `canUpdate`. |
| **Návrh řešení** | `«Form modal» SpecifikaceMV` s deseti sekcemi (viz výše); každá sekce mapována na konkrétní atributy [L001](04_logicky_model.md#lm-L001) / [L002](04_logicky_model.md#lm-L002). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC004](02_use_case_model.md#uc-UC004), [UC009](02_use_case_model.md#uc-UC009)

---

<a id="fr-FR04"></a>
### FR04 – Strukturu velení (pozice a role)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Vést na MV jeho organizační rozpad – pozice a jejich přiřazení k rolím. Pole „Rozpad Místa Velení" je multi-tag selektor (např. „H4"), tabulka pozic je hierarchická (rozbalitelný strom) s akcemi přidání podpozice (+) a smazání. Sekce „Role zastoupené na MV bez přiřazené pozice" zobrazuje role bez přiřazení. |
| **Návrh řešení** | `«Form modal» StrukturuVelení` se vstupem rozpadu (`EMultiLOV`), vyhledávacím polem pozice, hierarchickou `«Form grid area» PoziceMV` a sekcí pro role bez pozice. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC005](02_use_case_model.md#uc-UC005), [UC010](02_use_case_model.md#uc-UC010)

---

<a id="fr-FR05"></a>
### FR05 – Formulář schopností

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Specifikovat schopnosti MV podle kontextu mise. Dialog `«Form modal» FormulářSchopností` obsahuje: **(1) Druh mise/operace** (multi-select druhů misí jako entit – cross-link na [RQU003 Mise, operace, cvičení](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md); povinné); **(2) Grid MCA schopností** (stromová tabulka, kde každá MCA schopnost (`McaCapability`) má **podkategorie** (`McaCapabilitySubcategory`) zaškrtnutelné ve sloupci „Podporováno"). Schopnost MV je definována kombinací (a) reference na MCA schopnost a (b) seznamu podporovaných subkategorií. Při uložení s některou MCA schopností bez zvolených subkategorií systém zobrazí varovný dialog s možností potvrdit ukládání. **Verze: RQU002** – původní popis druhů misí jako enum (`druhMise_E`) byl nahrazen vazbou na entitu Druh mise z RQU003, viz [L010](04_logicky_model.md#lm-L010). |
| **Návrh řešení** | `«Form modal» FormulářSchopností` s `EMultiLOV` (Druhy misí; multi-select s formatováním `MissionTypeFormatter`), stromovou tabulkou MCA schopností (`CommandPostCapabilityDataGrid`) se sloupcem Akce / Název / Podporováno (checkbox per subkategorie). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC006](02_use_case_model.md#uc-UC006)

---

<a id="fr-FR06"></a>
### FR06 – Informační toky a produkty + FMN instrukce

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Spravovat na MV jeho informační toky a produkty ve třech samostatných tocích: **(a) přidání IER** – přímý výběr požadavku na výměnu informací z modelu SVŘ; **(b) přidání IP** – výběr informačního produktu, k němuž systém dohledá související IER; **(c) přidání FMN instrukce** – výběr FMN procedurální instrukce, k níž systém dohledá související IER. Sekce „Informační toky a produkty" nabízí pohledy „Pohled přes IER" / „Pohled přes IP" s akcemi „+ PŘIDAT PODLE IER" / „+ PŘIDAT PODLE IP"; sekce „FMN instrukce" vede 13 FMN instrukcí dle kategorií s akcí „+ PŘIDAT PODLE FMN INSTRUKCE" a Upravit. |
| **Návrh řešení** | Dvě `«Form area»` sekce („Informační toky a produkty na místě velení", „FMN instrukce") s `«Form multi area»` dlaždicemi. Společný cílový dialog Interakce s MV (G021) s grid interakcí ve stromové struktuře. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC007](02_use_case_model.md#uc-UC007), [UC011a](02_use_case_model.md#uc-UC011a) (přidání IER), [UC011b](02_use_case_model.md#uc-UC011b) (přidání IP), [UC011c](02_use_case_model.md#uc-UC011c) (přidání FMN instrukce), [UC014](02_use_case_model.md#uc-UC014)

> **Verze: RQU002** – Realizace FR06 upřesněna: původní jednotné UC011 „Přidat IER / IP / FMN instrukci" rozděleno na UC011a/b/c, protože tři toky se zásadně liší (výběrový dialog, backend lookup, alternativní scénáře). Popis FR06 nyní explicitně rozlišuje tři přírůstkové toky.

---

<a id="fr-FR07"></a>
### FR07 – Stažení karty MV (PDF / XLSX)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V dolní sekci detailu MV (**„Karty míst velení ke stažení"**) nabídnout uživateli stažení tří exportů: **Základní karta velení** (PDF), **Rozšířená karta velení** (PDF), **CIS matice** (XLSX). |
| **Návrh řešení** | `«Form area» KartyKeStažení` se 3 dlaždicemi `«Form multi area»` a stahovacími tlačítky. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC008](02_use_case_model.md#uc-UC008)

---

## Souhrnná tabulka realizace

| FR | UC001 | UC002 | UC003 | UC004 | UC005 | UC006 | UC007 | UC008 | UC009 | UC010 | UC011 | UC012 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR01** | X | X | | | | | | | | | | X |
| **FR02** | | | X | | | | | | | | | |
| **FR03** | | | | X | | | | | X | | | |
| **FR04** | | | | | X | | | | | X | | |
| **FR05** | | | | | | X | | | | | | |
| **FR06** | | | | | | | X | | | | X | |
| **FR07** | | | | | | | | X | | | | |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
