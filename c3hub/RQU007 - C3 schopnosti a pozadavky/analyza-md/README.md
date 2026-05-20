# UML Analýza – C3 schopnosti, požadavky a omezení (COCO C3 HUB)

Reverse-engineering modulu **C3 schopnosti + Požadavky a omezení** v aplikaci COCO (C3 HUB). Modul je v aktuální verzi UI **referenční** – poskytuje:

- **taxonomii C3 schopností** formou stažitelného PDF posteru,
- referenční seznam **požadavků** kladených na místa velení (81 položek),
- referenční seznam **omezení** míst velení (12 položek).

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`. Klíčové zdroje:

- `/coco/web-app/src/content/requirements/RequirementsTableData.ts` – statická data požadavků
- `/coco/web-app/src/content/requirements/ConstraintsTableData.ts` – statická data omezení
- `/coco/web-app/src/content/requirements/RequirementsModelPage.tsx` – referenční stránka
- `/coco/web-app/src/content/dashboard/capabilities-taxonomy-poster.pdf` – poster C3 schopností

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – C3 schopnosti, požadavky a omezení
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C03 | 3 |
| Funkční požadavky | FR01–FR03 | 3 |
| Use Cases | UC001–UC003 | 3 |
| GUI třídy | G001–G004 | 4 |
| Logický model – třídy | L001–L003 | 3 |
| Logický model – číselníky | E001–E002 | 2 |
| Sekvenční diagramy | — (referenční modul) | 0 |
| Stavové diagramy | — (statická data) | 0 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (referenční stránka + tabulky + dlaždice) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (požadavek, omezení, taxonomie) a číselníky |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | (modul bez sekvenčních diagramů) |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | (modul bez stavových diagramů) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |

---

## Otevřené otázky

- **Strukturovaná taxonomie C3 schopností** – v aktuální verzi UI je k dispozici pouze jako PDF poster. Strukturovaný model schopností (MCA Capability) je předmětem [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L002); vztah posteru ke konkrétním MCA schopnostem není ze source vidět.
- **Editovatelnost požadavků a omezení** – data jsou hardcoded v `RequirementsTableData.ts` / `ConstraintsTableData.ts`; není jasné, zda mají v budoucnu být editovatelná nebo napojená na backend.
- **Soulad se specifikací MV** – RQU002 specifikace MV používá `requirements` a `constraints` jako multi-LOV z backendových katalogů `/command-posts/catalogs/requirements` a `/constraints`; soulad výčtu hodnot mezi RQU007 statickými daty a backendovými katalogy nelze ze source ověřit.
