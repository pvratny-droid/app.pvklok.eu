# UML Analýza – Mise, operace, cvičení (COCO C3 HUB)

Reverse-engineering modulu **Mise** v aplikaci COCO (C3 HUB). Modul slouží k evidenci misí / operací / cvičení a jejich:

- základní specifikace (název, popis, druhy mise, vlastnické MV) a životnímu cyklu (platná ↔ zneplatněná),
- plánování **informačních interakcí** mezi MV (zdrojové MV → cílové MV přes IER/TIN, s operačním tempem PACE),
- definici **velitelských vazeb C2** dle NATO typologie (FULLCOM, OPCOM, OPCON, TACOM, TACON, ADCON, LOGCON),
- grafické vizualizaci (graf interakcí / C2 / společných a bojových funkcí) s uložitelným rozložením,
- generování výstupů (report PDF, CIS matice XLSX).

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\` (React/TypeScript frontend). Klíčové zdroje:

- `/coco/web-app/src/client/mission/MissionApiClient.tsx` – DTO (MissionDto, MissionInteractionDto, C2RelationshipDto, …) a enumy (MissionInteractionPace, C2RelationshipType)
- `/coco/web-app/src/content/mission/` – stránky, dialogy a panely (MissionsPage, MissionDetailDialog, interaction/, c2/, graph/, matrix/, report/)

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-20
**Systém:** COCO · C3 HUB – Mise, operace, cvičení
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1 (revize 2026-05-20 – ověření proti zdroji COCO)
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C05 | 5 |
| Funkční požadavky | FR01–FR09 | 9 |
| Use Cases | UC001–UC012 (bez zrušeného UC007) | 11 |
| GUI třídy | G001–G018 | 18 |
| Logický model – třídy | L001–L006 | 6 |
| Logický model – číselníky | E001–E004 | 4 |
| Sekvenční diagramy | SD-UC002, 005, 008, 009 | 4 |
| Stavové diagramy | SM-L001 (životní cyklus mise) | 1 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy se stereotypy, atributy, operacemi |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy, číselníky, asociace |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagramy |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | Stavový diagram životního cyklu mise |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sd_uc002.puml](diagrams/sd_uc002.puml) | SD UC002 (Vytvořit misi) |
| [diagrams/sd_uc005.puml](diagrams/sd_uc005.puml) | SD UC005 (Zneplatnit misi) |
| [diagrams/sd_uc008.puml](diagrams/sd_uc008.puml) | SD UC008 (Plánovat interakce) |
| [diagrams/sd_uc009.puml](diagrams/sd_uc009.puml) | SD UC009 (Spravovat C2 vazby) |
| [diagrams/sm_l001.puml](diagrams/sm_l001.puml) | Životní cyklus mise |

---

## Otevřené otázky

- Auditní evidence exportů (L006 Export mise) – source frontendu ji nepotvrzuje (endpointy vrací jen binární soubor).
- Detailní obsah grafu „Společné a bojové funkce" – vizualizace existuje, business význam vazeb je předmětem [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/README.md).
- Pravidla validace cyklických C2 vazeb – source explicitně nevynucuje, předpoklad z business logiky.
- Rozsah duplikace mise (zda se kopírují i interakce a C2 vazby) – `MissionDuplicationInputDto` má jen `name`, hloubka kopie je na backendu.
- **Mazání mise** – endpoint `DELETE /missions/{id}` a ACL `canDelete` v API existují, ale UI je nikde nevyvolává. Není jasné, zda jde o nedokončenou funkci nebo úmyslně skrytou operaci. Původní UC007 „Smazat misi" byl revizí zrušen.
- **Úprava typu C2 vazby** – endpoint `PATCH /missions/{id}/c2-relationships/{id}` a hook `useUpdateC2Relationship` existují, ale žádná komponenta hook nevolá. C2 grid nabízí jen *Přidat* a *Smazat*.
- **Mód plánování COMMAND_POSTS** – ve zdroji je volba `disabled` ([G005](03_gui_model.md#gui-G005)); plánování funguje jen v módu CAPABILITIES. Není jasné, zda jde o rozpracovanou funkci.

## Poznámka k revizi 2026-05-20

Revize ověřila Use Case a GUI model přímým čtením zdrojových `.tsx` komponent COCO (ne agentských souhrnů). Hlavní opravy:

- **G006 Plánovací grid** – přepsán z plochého gridu na stromový (`RTree`, hierarchie IER → MV → TIN); doplněn rám gridu (toolbar) a řádkové akce.
- **G002 Dlaždice mise** – opraven výčet operací (akce *Duplikovat / Zneplatnit* patří detailu mise, *Smazat* neexistuje).
- **G007/G008 C2** – panel obsahuje dva gridy; odstraněna fabrikovaná operace úpravy typu vazby.
- **G012 / G013 / G014 / G015** – opraveny atributy a operace dle zdroje (multi-select v C2 dialogu, 5 pohledů grafu, odstraněny fabrikované atributy „Pro MV" a „Jazyk").
- Doplněny chybějící GUI třídy **G016–G018** (dialogy Výběr IER, Konfigurace interakcí MV a jeho vnořený grid).
- Zrušen fabrikovaný **UC007 „Smazat misi"**; přepsán **UC008** (stromový tok plánování).

Detail změn je v poznámkách `**Verze: RQU003**` u jednotlivých prvků.
