# UML Analýza – Karty míst velení (COCO C3 HUB)

Detailní analýza modulu **Karty míst velení** v aplikaci COCO (C3 HUB). Modul slouží k evidenci míst velení (MCP – Main Command Posts a NATO komponentní velitelství: JFAC, JFMCC, LCC, SpCC, CyOCC, JTF, JTF HQ, …) včetně jejich specifikace, schopností, struktury velení, informačních toků (IER, IP), 13 FMN instrukcí a generování tisknutelných výstupů (PDF/XLSX).

**Vstup analýzy:**

1. **Procházení živé aplikace** `https://coco.archirepo.com/web/command-posts` (reverse-engineering – kap. 10 metodiky zápisu) – původní zdroj, květen 2026.
2. **Zdrojové kódy aplikace** v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\` (React/TypeScript frontend nad REST API Archirepo) – doplňující zdroj, 2026-05-13. Pokrývá zejména `src/content/post/` (Karty MV), `src/client/post/` (DTO + API client), `src/i18n/translations.json` (české labely).

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-20
**Systém:** COCO · C3 HUB – Karty míst velení
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1 → **Verze: RQU002** – zpřesnění LM/GUI/UC dle zdrojových kódů (2026-05-13), revize z prototypu: split UC011 → UC011a/b/c (2026-05-19), doplnění rámu gridu G021 + oprava IP-view (2026-05-20)
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/index.html)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C04 | 4 |
| Funkční požadavky | FR01–FR07 | 7 |
| Use Cases | UC001–UC014 (UC011 → UC011a/b/c) | 16 |
| GUI třídy | G001–G028 (vč. G001b, G021a, G028a) | 30 |
| Logický model – třídy | L001–L012 | 12 |
| Logický model – číselníky | E001, E003–E021 (E002 zrušeno) | 19 |
| Sekvenční diagramy | SD-UC001, 003, 004, 005, 006, 008, 011a, 011b, 011c | 9 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy se stereotypy, atributy, operacemi |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy, číselníky, asociace |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagramy (PlantUML + Mermaid) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sd_uc001.puml](diagrams/sd_uc001.puml) | Sekvenční diagram UC001 (Vyhledat MV) |
| [diagrams/sd_uc003.puml](diagrams/sd_uc003.puml) | Sekvenční diagram UC003 (Detail karty MV) |
| [diagrams/sd_uc004.puml](diagrams/sd_uc004.puml) | Sekvenční diagram UC004 (Editovat specifikaci MV) |
| [diagrams/sd_uc005.puml](diagrams/sd_uc005.puml) | Sekvenční diagram UC005 (Strukturu velení) |
| [diagrams/sd_uc006.puml](diagrams/sd_uc006.puml) | Sekvenční diagram UC006 (Editovat schopnosti) |
| [diagrams/sd_uc008.puml](diagrams/sd_uc008.puml) | Sekvenční diagram UC008 (Stažení karty MV) |
| [diagrams/sd_uc011a.puml](diagrams/sd_uc011a.puml) | Sekvenční diagram UC011a (Přidat IER do MV) |
| [diagrams/sd_uc011b.puml](diagrams/sd_uc011b.puml) | Sekvenční diagram UC011b (Přidat IP do MV) |
| [diagrams/sd_uc011c.puml](diagrams/sd_uc011c.puml) | Sekvenční diagram UC011c (Přidat FMN instrukci do MV) |

---

## Poznámky k reverse-engineering

- **Verze 2026-05-09 (původní)** – analýza vycházela z procházení živé aplikace. Atributy a operace formulářů byly převzaty 1:1 z UI, doménové asociace a popisy entit sestaveny analyticky.
- **Verze 2026-05-13 (RQU002 – zpřesnění ze source)** – přírůstkové zpřesnění dle zdrojových kódů C3HUB (React/TypeScript frontend nad REST API). Konkrétně:
  - Doplněno **~20 atributů specifikace MV** (společné/bojové funkce, úroveň, kontinuita, mobilita, balistická ochrana, zabezpečení ochrany, odolnost, soběstačnost, omezení, požadavky, funkce MV, VODOS, GPS lokace).
  - Vyřešen rozpor **„Kód schopnosti"** vs. **`unitCode`** (chybný cs překlad – jde o kód jednotky, ne vazbu na entitu Schopnost).
  - Přepracována třída [L005 Schopnost MV](04_logicky_model.md#lm-L005) (vazba na MCA Capability + subkategorie z RQU004 místo enumu).
  - Doplněna vazební třída [L010 Druh mise MV](04_logicky_model.md#lm-L010) (cross-link na MissionType z RQU003); zrušen enum `druhMise_E` (E002).
  - Doplněny [L011 Přiřazení role k pozici](04_logicky_model.md#lm-L011) a [L012 Rozpad MV](04_logicky_model.md#lm-L012).
  - Doplněno **16 nových LOV katalogů** (E006–E021).
  - Doplněny GUI třídy [G020](03_gui_model.md#gui-G020) (Vytvoření MV), [G021](03_gui_model.md#gui-G021) (Interakce MV), [G022](03_gui_model.md#gui-G022)–[G025](03_gui_model.md#gui-G025) (Výběr IER/IP/PI, Import), [G026](03_gui_model.md#gui-G026)/[G027](03_gui_model.md#gui-G027) (Možnosti reportu), [G028](03_gui_model.md#gui-G028) (Pozice dialog).
  - Doplněny [UC013](02_use_case_model.md#uc-UC013) (CIS matice) a [UC014](02_use_case_model.md#uc-UC014) (Import interakcí z jiného MV).
  - Doplněny sekvenční diagramy [SD-UC004](05_sekvencni_diagramy.md#sd-UC004) a [SD-UC006](05_sekvencni_diagramy.md#sd-UC006); endpointy v ostatních SD nahrazeny reálnými.
  - Doplněna **ACL pravidla** na L001 (`canUpdate`, `canGenerateReport`).
- **Verze 2026-05-19 (RQU002 – revize z prototypu)** – při tvorbě HTML prototypu se ukázala dvě slepá místa:
  - **Split UC011** „Přidat IER / IP / FMN instrukci" na tři samostatné Use Case [UC011a](02_use_case_model.md#uc-UC011a) (IER), [UC011b](02_use_case_model.md#uc-UC011b) (IP – s dohledáním IER), [UC011c](02_use_case_model.md#uc-UC011c) (FMN instrukce – s dohledáním IER). Tři toky mají rozdílné výběrové dialogy, backend lookupy a alternativní scénáře. Doplněny sekvenční diagramy SD-UC011a/b/c.
  - Doplněn alternativní stav [A-G025-1](03_gui_model.md#gui-G025) (procedurální instrukce bez navázaných IER) – analogie k A-G023-1.
  - Grid interakcí [G021a](03_gui_model.md#gui-G021a) – akce sloupce upřesněny (Detail, Otevřít graf sousedství); viz nové otevřené otázky níže.
- **Verze 2026-05-20 (RQU002 – ověření G021 proti zdroji)** – revize prototypu odhalila, že reverse-engineering zachytil u dialogu G021 jen **sloupce gridu**, ne **rám gridu**. Přímým čtením zdroje (`CommandPostInteractionDataGrid.tsx`, `InteractionGraphTransformer.ts`, `CommandPostInteractionsUpdateDialog.tsx`) doplněno:
  - [G021](03_gui_model.md#gui-G021) – počet záznamů + 3 filtrační checkboxy („Zobrazit Aktivity a Procesy / Produkty / zařízení a aplikace") + vyhledávací pole; vše jen v IER pohledu (`{isIer && …}`).
  - [G021a](03_gui_model.md#gui-G021a) – strom je dynamicky rozšiřitelný o typy prvků BA/BP/IP/CIS; sloupce upřesněny na 9 (Kód, Název EN/CZ, Popis EN/CZ, Req/Konzument/Poskytovatel, Akce).
  - **Oprava IP-view**: IP pohled je `IP → IER` (2 úrovně), ne „IP→IER→TIN"; cílový dialog UC011b „Přidat podle IP" je IER-rooted (`isIer=true`). Předchozí popis vznikl z agentského souhrnu bez ověření zdroje.
  - Příčina slepého místa a metodická prevence: viz `metodika/metodika-zapisu.md` kap. 3.3.2 a audit `src/C3HUB/AUDIT-grid-frame-2026-05-20.md`.

## Otevřené otázky

### Vyřešené (verze RQU002)

- ~~Význam pole „Kód schopnosti"~~ → **Vyřešeno**: jde o `unitCode` = kód jednotky/útvaru, **ne** vazbu na entitu Schopnost. Cs překlad v i18n je chybný (en label je správně „Unit code"); doporučujeme nahlásit překladatelům C3HUB.
- ~~„Formulář schopností" – Kódy/Hierarchie přepínač~~ → **Vyřešeno**: v source neexistuje; grid je vždy stromový (MCA schopnosti → subkategorie). Druhy mise jsou entity z RQU003, ne enum.
- ~~Detailní obsah dialogu Pohled přes IER / IP~~ → **Vyřešeno**: pohledy otevírají [G021 InterakceMV](03_gui_model.md#gui-G021) v různých režimech (`isIer=true/false`); stav interakce je trojice příznaků `req`/`consumer`/`provider`.
- ~~Workflow vytvoření nové karty MV~~ → **Vyřešeno**: krátký dialog [G020](03_gui_model.md#gui-G020) (Typ, Název, Popis), žádný wizard. Plnou specifikaci uživatel vyplňuje až na detailu nové karty.
- ~~Role/oprávnění~~ → **Částečně vyřešeno**: existuje `CommandPostAclDto { canUpdate, canGenerateReport }` per MV, který řídí dostupnost akcí. Globální role-based authorizace mimo scope frontendového source.

### Stále otevřené

- Konkrétní seznam taktických značek ([taktickýSymbol_E](04_logicky_model.md#lm-E021)) – endpoint `GET /command-posts/tactical-symbols` vrací LOV, hodnoty z backendu.
- Kompletní seznam typů místa velení ([typMístaVelení_E](04_logicky_model.md#lm-E001)) – endpoint `GET /command-posts/types`, hodnoty z backendu.
- Kompletní seznam zemí ve vlajce ([země_E](04_logicky_model.md#lm-E004) / [vlajka_E](04_logicky_model.md#lm-E020)) – endpoint `GET /command-posts/flags`, hodnoty z backendu.
- Detailní atributy **13 FMN instrukcí** (popis, soubory) – v source je FMN instrukce navázána na entitu Procedurální instrukce (RQU006/RQU007), detail entity zde není; mezní počet 13 je pozorování v UI, source neomezuje.
- Existence backendového audit logu exportů ([L009](04_logicky_model.md#lm-L009)) – frontend ho nepoužívá; třída zůstává jako návrh.
- Hodnoty LOV [E008](04_logicky_model.md#lm-E008) (úroveň), [E011](04_logicky_model.md#lm-E011) (druhy mobility), [E012](04_logicky_model.md#lm-E012)–[E014](04_logicky_model.md#lm-E014) (zabezpečení, odolnost, soběstačnost), [E017](04_logicky_model.md#lm-E017) (omezení), [E018](04_logicky_model.md#lm-E018) (požadavky) – načítají se dynamicky z backendu, konkrétní hodnoty zde nejsou.

### Otevřené otázky z revize prototypu

- ~~**Q-G021a-1**: Má grid interakcí akci „Smazat řádek"?~~ → **Vyřešeno (2026-05-20)**: zdroj (`CommandPostInteractionColumnDefinition.tsx` → `CommandPostInteractionActionCell`) akci „Smazat" nemá. Akce v gridu jsou: Detail (editor překladů), Upravit interakce IER (jen IP pohled), Otevřít graf sousedství. Odebrání interakce se řeší odznačením stavů.
- ~~**Q-G021a-2**: Jak konstruovat URL grafu sousedství do Archirepo?~~ → **Částečně vyřešeno (2026-05-20)**: zdroj volá `archiRepoUrlResolver.resolveElementNeighbourhoodGraphUrl(elementId)` → `window.open(url, "_blank")`. Konkrétní tvar URL je v resolveru (backend konfigurace); v prototypu je stub.
- **Q-G010-1**: Sloupec Akce per řádek na [G010](03_gui_model.md#gui-G010) (MCA tree) – spec deklaruje `RAkce`, ale neuvádí konkrétní operace. Jaké akce zobrazit (Detail prvku / Smazat asociaci / jiné)? V prototypu zatím nasazena akce „Detail" jako placeholder.
