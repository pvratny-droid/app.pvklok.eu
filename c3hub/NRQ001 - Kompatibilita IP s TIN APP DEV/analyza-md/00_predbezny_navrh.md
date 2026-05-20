# Předběžný návrh změny — Kompatibilita IP s TIN, APP a DEV

> **Status:** `proposal` · **Datum:** 2026-05-10 · **Autor:** Petr Vratný
> **Dotčené RQU:** [RQU002 — Karty mist veleni](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/), [RQU004 — Model SVR domenove entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/)

---

## 1. Cíl změny

Doplnit do doménového modelu C3HUB atributy a entity nutné k zodpovězení dotazu **„lze daný informační produkt (IP) přenést pomocí konkrétní technologické interakce (TIN)?"**. V kartě MV (RQU002 FR06 „Informační toky a produkty") přidat ke každému IP akci, která pro zvolený TIN vrátí verdikt kompatibility (✓/⚠/✗) a zdůvodnění, určenou primárně pro CIS architekta.

Cílový stav: pro libovolnou dvojici (IP, TIN) umí C3HUB vrátit verdikt kompatibility s rozpisem po jednotlivých pravidlech a zdůvodněním každého nesouladu (např. „bandwidth nestačí", „klasifikace TIN nižší než požadavek IP").

## 2. Motivace

- **Operativní potřeba:** plánovači spojení a CIS architekti dnes musí kompatibilitu posuzovat ručně mimo C3HUB. C3HUB drží MV, IP, TIN, App, Device, ale neumí spojit, _zda_ daný TIN konkrétní IP fyzicky přenese.
- **NATO interoperabilita:** doménový model už referuje NATO standardy přes `s5636Id` (STANAG 5636). Atributy kompatibility navazují na standardy:
  - **NAFv4 / DODAF SV-7** Systems Measures Matrix — kontejner pro kvantitativní výkonnostní atributy systémů.
  - **STANAG 5066** (HF data, 75 b/s – 9.6 kbit/s), **STANAG 5516** (Link 16, ATDLP-5.16), **STANAG 4406** (MMHS), **STANAG 4774/4778** (klasifikační metadata).
  - **FMN Spirál Service Interface Profiles** — definují, který protokol musí daná služba mluvit.
  - **NISP (NATO Interoperability Standards and Profiles)** — katalog závazných standardů.
- **Standalone potřeba protokolu:** dnes je „Protokol" v RQU004 L005 (TIN) jen volný text v popisu. Standardy (NAFv4 SV-6 Resource Data Exchange Matrix, FMN SIP) ho modelují jako samostatný prvek odkazovaný TIN-em, Aplikací, Zařízením a Aplikační/Infrastrukturní službou současně. Bez explicitní entity Protokol je dotaz kompatibility nesestavitelný.

## 3. Dotčené RQU a prvky

### RQU004 — Model SVR domenove entity

**Cesta:** `src/C3HUB/RQU004 - Model SVR domenove entity/analyza-md/`

> **Pozn. ke konzistenci (revize 2026-05-14):** Anchor ID níže byly sladěny s aktuální analýzou RQU004 (verze 2026-05-13). Původní návrh (2026-05-10) odkazoval na starší číslování (`L015`/`L016`/`L021`/`L022`), které dnes v RQU004 znamená jiné třídy. Aktuální mapování: **IP = `L004`**, **TIN = `L005`**, **CIS Aplikace = `L017`**, **CIS Zařízení = `L018`**; nová třída Protokol dostává nejbližší volné ID **`L022`**.

| Prvek (anchor) | Typ změny | Popis změny |
|---|---|---|
| [`lm-L004`](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L004) Informační produkt IP | doplnění atributů (požadavky na přenos) | Klasifikace (STANAG 4774/4778), velikost zprávy (typ./max), min throughput [kbit/s], max latence [ms], datový formát (enum: ADatP-3, NVG, OTH-Gold, JSON, XML, binary), šifrovací požadavek. Třída dnes nemá vlastní atributovou tabulku (jen dědí z L001) – přidá se vlastní. |
| [`lm-L005`](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L005) Technologická interakce TIN | doplnění atributů (kapacita kanálu) + nahrazení textového „Protokol" vazbou | Bandwidth (min/max), latence (typ./max), max klasifikace přenášené info, QoS, topologie (P2P / multicast / broadcast), spolehlivost. Textový „Protokol" (dnes jen v popisu třídy) odstranit; nahradit M:N vazbou na novou L022 Protokol (protokolový stack). |
| [`lm-L017`](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L017) CIS Aplikace | doplnění atributů + nová vazba | Podporované formáty IP (vstup/výstup), role v IER (zdroj / cíl / relay), rozhraní (REST/MQ/SOAP/...). Nová vazba M:N na L022 Protokol (aplikační vrstva). |
| [`lm-L018`](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L018) CIS Zařízení | doplnění atributů + nová vazba | Síťová rozhraní (Ethernet, Wi-Fi, Link 16, HF, VHF, UHF, SATCOM), frekvenční pásma + max data rate per interface, vysílací výkon / dosah, mobilita (stacionární / mobilní). Nová vazba M:N na L022 Protokol (fyzická/linková vrstva). |
| **L022 Protokol** *(nová třída – specializace L001 Element, stereotyp `PROTOCOL`)* | nová třída + 5 nových M:N vazeb | Atributy: `kod` (REST, MQTT, STANAG-5066, ATDLP-5.16, …), `osiVrstva` (enum L1–L7), `kategorie` (enum: Aplikační / Transportní / Síťová / Linková / Fyzická / TDL / Bezpečnostní), `standardId` (FK na STANAG/RFC, volitelně samostatná entita Standard), `maxBandwidth` [kbit/s], `vyzadujeSifrovani` (bool). Vazby: TIN (L005), CIS Aplikace (L017), CIS Zařízení (L018), Aplikační služba (L016), Infrastrukturní služba (L015). |
| „Asociace" tabulky dotčených tříd | doplnění řádků | Do per-class sekcí „Asociace" u L005/L017/L018/L016/L015 doplnit M:N vazbu na L022 Protokol. RQU004 nemá jednu „Tabulku klíčových vazeb" – vazby jsou vedené per třída. |
| Číselník [`stereotyp_E` (E001)](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-E001) | doplnění hodnoty | Přidat stereotyp `PROTOCOL` (kód `PROTO`) pro novou třídu L022. RQU004 nemá číselník `typEntity_E` – typy doménových entit rozlišuje `stereotyp_E`. |

### RQU002 — Karty mist veleni

**Cesta:** `src/C3HUB/RQU002 - Karty mist veleni/analyza-md/`

| Prvek (anchor) | Typ změny | Popis změny |
|---|---|---|
| [`fr-FR06`](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/01_model_pozadavku.md#fr-FR06) Informační toky a produkty + FMN instrukce | rozšíření | Doplnit do sekce „Pohled přes IP" akci **„Ověřit kompatibilitu s TIN"**. Vstup: vybraný IP (z karty) + TIN (LOV technologických interakcí). Výstup: verdikt kompatibility s rozpisem po pravidlech (viz nový GUI prvek níže). |
| **UC „Ověření kompatibility IP s TIN"** *(nový UC v 02_use_case_model.md – nejbližší volné ID je `UC015`; UC001–UC014 už existují)* | nový UC | Aktér: Uživatel (CIS architekt). Vstup: vybraný IP a vybraný TIN. Hlavní scénář: pro dvojici (IP, TIN) vyhodnoť pravidla kompatibility (viz Návrh řešení), vrať verdikt ✓/⚠/✗ se zdůvodněním pro každé pravidlo. |
| **GUI komponenta „KontrolaKompatibilityIP"** *(nový GUI prvek v 03_gui_model.md, stereotyp `«Form modal»`; nejbližší volné ID je `G029`)* | nový GUI prvek | Modální dialog vyvolaný akcí v FR06. V hlavičce vybraný IP a TIN; pod tím tabulka pravidel kompatibility (Pravidlo, Hodnota IP, Hodnota TIN, Výsledek ✓/⚠/✗) a celkový verdikt Σ. Každý řádek má zdůvodnění (např. „bandwidth 4.8 kbit/s < požadavek 9.6 kbit/s"). |

## 4. Návrh řešení

### 4.1 Diagram tříd návrhu

Diagram zachycuje cílový stav dotčených tříd doménového modelu RQU004 – dotčené třídy (`«modified»`), novou třídu Protokol (`«new»`) a napojení na základní prvky (`«existing»`). Růžově zvýrazněné atributy označené `(K)` jsou ty, které vyhodnocuje **Algoritmus kompatibility** (viz Fáze 2).

```plantuml file=diagrams/lm_navrh_kompatibilita.puml
```

### Fáze 0 — ARCHIREPO (mimo C3HUB)

**Předpoklad pro fáze 1+2.** Rozšíření grafového schématu ARCHIREPO o SV-7 / SvcV-7 atributy a entitu Protocol na úrovni typů SVŘ entit (IP, TIN, Application, Device, AppService, InfraService, Protocol). Bez tohoto kroku nemá C3HUB UI odkud číst (princip „read-only zrcadlo ARCHIREPO" zůstává v platnosti).

Tato fáze je **samostatným úkolem pro tým ARCHIREPO**, mimo scope tohoto návrhu. Zachycuje se zde jen jako blokující závislost.

### Fáze 1 — RQU004 (doplnění atributů a entity Protokol)

Po dokončení Fáze 0 doplnit do RQU004 atributy a entitu dle tabulky výše (cílový stav viz diagram tříd v kap. 4.1). Atributy v sekci „Třída: …" označit poznámkou _„Read-only z ARCHIREPO"_; v poznámce u L005 (TIN) a L022 (Protokol) odkázat na NAFv4 SV-7 a relevantní STANAGy / FMN Spirál jako zdroj _hodnot_.

V diagramu tříd RQU004 (`diagrams/lm_class_diagram.puml`) přidat L022 Protokol s vazbami na L005 (TIN), L017 (CIS Aplikace), L018 (CIS Zařízení), L016 (Aplikační služba) a L015 (Infrastrukturní služba).

### Fáze 2 — RQU002 (UC + GUI matice kompatibility)

Po dokončení Fáze 1 doplnit do RQU002:

1. Rozšířit FR06 o akci „Ověřit kompatibilitu s TIN".
2. Vytvořit UC „Ověření kompatibility IP s TIN" (nejbližší volné ID `UC015`).
3. Vytvořit GUI prvek `«Form modal» KontrolaKompatibilityIP` s rozpisem pravidel.

**Algoritmus kompatibility** (deklarativní pravidla, vyhodnocení pro dvojici (IP, TIN)):

- `TIN.bandwidth ≥ IP.minThroughput`
- `TIN.maxLatence ≤ IP.maxTolerovatelnáLatence`
- `IP.formát ∈ TIN.podporovanéFormáty`
- `TIN.maxKlasifikace ≥ IP.klasifikace`
- `TIN.šifrování ⊇ IP.šifrovacíPožadavek`

Celkový verdikt Σ: `✓` = všechna pravidla ✓; `⚠` = aspoň jedno ⚠ a žádné ✗; `✗` = aspoň jedno ✗.

## 5. Závislosti a předpoklady

- **ARCHIREPO Fáze 0** — nutná předem. Bez schématu pro SV-7 atributy a entitu Protocol nemá C3HUB co číst.
- **Dohoda na enumeracích** — datový formát IP, OSI vrstva protokolu, klasifikace (STANAG 4774/4778) — sjednotit napříč ARCHIREPO a C3HUB.
- **Source-of-truth pravidlo** — atributy zůstávají read-only v C3HUB UI; editace probíhá v ARCHIREPO.

## 6. Otevřené otázky

- **Vícenásobné hodnoty atributů** — bandwidth se v reálu liší podle režimu (např. STANAG 5066 má 75 b/s při robustním modu vs. 9.6 kbit/s při optimálním). Jeden skalární atribut nestačí. Buď enum „provozních módů" jako sub-entitu TIN, nebo strukturovaný komplexní typ. **Rozhodnutí v Fázi 0.**
- **Strukturovaná klasifikace** — STANAG 4774/4778 metadata jsou strukturovaná (classification + policy + categories + release caveats). Jeden enum nestačí. Modelovat jako komplexní datový typ. **Rozhodnutí v Fázi 0.**
- **Rozšíření na vyhledávání kandidátních TIN** — tento návrh řeší jen kontrolu jedné dvojice (IP, TIN). Hromadné vyhledávání „které TIN přenesou daný IP", případně mezi dvěma MV (přes průnik zařízení MV_A ∩ MV_B), je možné budoucí rozšíření — mimo scope tohoto návrhu.
- **Úroveň detailu výstupu** — návrh počítá s plným rozpisem po jednotlivých pravidlech (pro CIS architekta). Zvážit, zda nabídnout i kompaktní výstup (jen souhrnný verdikt Σ) pro operativního plánovače spojení. K rozhodnutí během Fáze 2.
- **Formátové pravidlo algoritmu** — kap. 4 „Algoritmus kompatibility" porovnává `IP.formát ∈ TIN.podporovanéFormáty`, ale kap. 3 přiřazuje atribut „podporované formáty IP" Aplikaci (L017), ne TIN (L005). Sjednotit: buď přesunout atribut na TIN, nebo pravidlo přepsat na `IP.datovýFormát ∈ App.podporovanéFormátyIP`. **Rozhodnutí ve Fázi 1.**
- **Číslování změnových požadavků** — tento předběžný návrh dostal kód NRQ001 (samostatná řada NRQ pro předběžné návrhy). Po schválení vznikne cílová `complete` analýza s běžným RQU číslem, nebo se editují existující RQU002 a RQU004 (a tato NRQ001 jde do `archived`). Konvenci konzultovat.

## 7. Verifikace

Po implementaci Fáze 1 + 2:

1. **Datová úroveň:** v ARCHIREPO existuje aspoň jeden `Protocol` (např. STANAG 5066) s vazbami na TIN, App, Device. C3HUB mu zobrazuje atributy v read-only panelu.
2. **Funkční úroveň (smoke test):** v C3HUB UI otevřít kartu libovolného MV s alespoň jedním tokem IP. V „Pohled přes IP" u vybraného IP kliknout „Ověřit kompatibilitu s TIN" → vybrat TIN → zobrazí se modal s verdiktem a rozpisem pravidel.
3. **Diagnostika nesouladu:** uměle nastavit IP s `minThroughput = 50 Mbit/s` a TIN s `bandwidth = 9.6 kbit/s` (např. HF přes STANAG 5066) — pravidlo bandwidth musí být označeno `✗` se zdůvodněním „bandwidth 9.6 kbit/s < požadavek 50000 kbit/s", celkový verdikt `✗`.
4. **Klasifikace:** IP s klasifikací `NS` proti TIN s `maxKlasifikace = NC` musí dát `✗` se zdůvodněním „klasifikace TIN (NC) nižší než požadavek IP (NS)".
5. **Kompatibilní dvojice:** IP a TIN, které si vyhovují ve všech pravidlech — všechna pravidla zelená, celkový verdikt `✓`.

## 8. Reference

- **NAFv4 / DODAF SV-7** Systems Measures Matrix — kontejner pro kvantitativní atributy systémů: <https://dodcio.defense.gov/Library/DoD-Architecture-Framework/dodaf20_sv7/>, <https://acqnotes.com/acqnote/tasks/sv-7-systems-measures-matrix>
- **STANAG 5066** Profile for HF Data Communications: <https://www.isode.com/whitepaper/stanag-5066-ed4/>
- **STANAG 5516** Link 16, ATDLP-5.16 (Tactical Data Exchange): <https://standards.globalspec.com/std/14253055/stanag-5516>
- **STANAG 4406** Military Message Handling System (MMHS): <https://www.isode.com/whitepaper/using-smtp-to-provide-a-stanag-4406-military-messaging-service/>
- **STANAG 4774 / 4778** Confidentiality Metadata
- **STANAG 5636** Subject Matter Identifiers (už používáno v RQU004 jako `s5636Id`)
- **FMN — Federated Mission Networking**, Spiral Specifications, Service Interface Profiles: <https://en.wikipedia.org/wiki/Federated_Mission_Networking>, <https://storage.nisp.nw3.dk/20221202_FMN_Spiral_5_Standards_Profile.pdf>
- **NISP — NATO Interoperability Standards and Profiles**
- **Předchozí konverzace** v repu: konzultativní rozbor s rešerší (chat, 2026-05-10) — viz schválený plán `C:\Users\pvrat\.claude\plans\navrhni-pro-projekt-c3hub-shimmering-falcon.md`.
