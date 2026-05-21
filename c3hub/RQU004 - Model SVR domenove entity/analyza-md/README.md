# UML Analýza – Model SVŘ doménové entity (COCO C3 HUB)

Reverse-engineering doménového modelu SVŘ v aplikaci COCO (C3 HUB). Modul **Model** poskytuje:

- centrální zachycení **17 stereotypů** prvků (MCA schopnost, IER, IP, TIN, Role, Pozice, Organizace, Organizační jednotka, Místo velení, Procesy, Aktivity, Procedurální instrukce, IER Grouping, Infrastrukturní/Aplikační služby, CIS Aplikace, CIS Zařízení) v souladu s ArchiMate metamodelem,
- prohlížení a vyhledávání prvků jednak per stereotyp, jednak globálně,
- dvojjazyčnou údržbu jmen a popisů (CS/EN) s tracking statusu překladu (AI_TRANSLATED → UPDATED → APPROVED),
- schvalovací workflow změn vztahů přes **Patch Request** (REQUESTED → APPROVED/REJECTED),
- referenční dokumentaci doménového a NATO/FMN metamodelu.

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\` (React/TypeScript frontend nad REST API). Klíčové zdroje:

- `/coco/web-app/src/client/model/ModelApiClient.tsx` – DTO (ElementDto, RelationshipDto, PatchRequestDto, …) a enumy (Stereotype, RelationshipType, ArchiMateType, ElementTranslationStatus, RelationshipPatchRequestState)
- `/coco/web-app/src/content/model/` – stránky a komponenty (ModelPage, ElementsPage, ElementsTable, dialogy)
- `/coco/web-app/src/content/metamodel/` – referenční dokumentace metamodelu

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-20
**Systém:** COCO · C3 HUB – Model SVŘ doménové entity
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Schvalovatel modelu, Systém C3 HUB | 3 |
| Cíle | C01–C05 | 5 |
| Funkční požadavky | FR022–FR030 | 9 |
| Use Cases | UC035–UC046 | 12 |
| GUI třídy | G056–G071 + G063a, G066a, G067a | 19 |
| Logický model – třídy | L021–L040 | 21 |
| Logický model – číselníky | E028–E033 | 6 |
| Sekvenční diagramy | SD-UC035, 004, 006, 007, 009 | 5 |
| Stavové diagramy | SM-L021 (překlad), SM-L039 (Patch Request) | 2 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy se stereotypy, atributy, operacemi |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (17 stereotypů + Vztah + Patch Request), číselníky |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagramy |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | Stavové diagramy (Patch Request workflow + Stav překladu) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sd_uc035.puml](diagrams/sd_uc035.puml) | SD UC035 (Otevřít přehled stereotypu) |
| [diagrams/sd_uc038.puml](diagrams/sd_uc038.puml) | SD UC038 (Vytvořit prvek) |
| [diagrams/sd_uc040.puml](diagrams/sd_uc040.puml) | SD UC040 (Upravit překlady) |
| [diagrams/sd_uc041.puml](diagrams/sd_uc041.puml) | SD UC041 (Patch Request – návrh) |
| [diagrams/sd_uc043.puml](diagrams/sd_uc043.puml) | SD UC043 (Patch Request – schválení) |
| [diagrams/sm_l021.puml](diagrams/sm_l021.puml) | Stav překladu prvku |
| [diagrams/sm_l039.puml](diagrams/sm_l039.puml) | Patch Request workflow |

---

## Revize 2026-05-20 (RQU004)

Striktní ověření analýzy proti zdrojovým kódům COCO (`coco/web-app/src/content/model/`) – odhaleny a opraveny rozpory reverse-engineeringu se zdrojem:

- **Workflow vytvoření/duplikace prvku** – `CreateElementDialog` i `DuplicateElementDialog` volají `createRelationshipPatchRequest`; prvek vzniká přes schvalovací Patch Request, ne přímým `POST /model/elements` (endpoint neexistuje). Opraveno v UC038, UC039, G061, G065, FR025.
- **Záložkový panel vztahů** – `ModelElementRelationshipPanel` renderuje záložky podle povolených dvojic stereotypů; reverse-engineering zachytil jen ploché sloupce. Opraveno v G063a (rám gridu).
- **Souhrnný dialog** `RelationshipPatchRequestSummaryDialog` doplněn jako nová třída [G070](03_gui_model.md#gui-G070).
- **Odstraněny fabrikované prvky** – přepínač „Schválit překlad" (G062), filtr stavu a přepínač „Moje/Všechny" (G067), pole „Komentář" a operace „Upravit" (G068), pole „MCA schopnost" a navigace „OtevřítMV" (G066), 3. obrázek metamodelu (G069).
- **UC přejmenovány** – UC042 „Prohlížet patch requesty", UC043 „Rozhodnout o patch requestu" (odstraněna lomítka odrážející neexistující funkce / falešný split-trigger).
- **Doplněny třídy** [G066a](03_gui_model.md#gui-G066a) Tabulka relevantních MV a [G071](03_gui_model.md#gui-G071) Obsah prvku (sdílený `ElementContent`).

## Otevřené otázky

- **Schvalovatel modelu** je v UI gatován rolí administrátora (`UserRoleResolver.isAdministrator`). Source **neprovádí** kontrolu „žadatel ≠ schvalovatel" – administrátor tedy patrně může schválit i vlastní patch request. Ověřit, zda to omezuje backend.
- **Přechod stavu překladu do `APPROVED`** – editační dialog [G062](03_gui_model.md#gui-G062) nemá UI akci „Schválit"; přechod řídí backend. Mechanismus (automatika, jiná obrazovka, role) není ze zdroje frontendu patrný.
- Sledování auditu změn aplikovaných patch requestem (kdo, kdy, co) – source nepotvrzuje.
- Reprezentace doménových konkretizací (např. role „Velitel J3" je `ElementDto` se stereotypem ROLE; konkrétní speciální atributy per role nejsou ze source vidět).
- Vyšší ArchiMate vrstvy (Strategy, Motivation) – source je nepoužívá ani neexponuje.
- Soulad mezi enumy `Stereotype` (z `ModelApiClient`) a `ModelStereotype` (z `model/stereotype/`) – udržují se manuálně, mohou se rozejít.
