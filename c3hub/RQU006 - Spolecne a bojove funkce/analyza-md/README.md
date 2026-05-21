# UML Analýza – Společné a bojové funkce + PI (COCO C3 HUB)

Reverse-engineering modulu **Funkce SVŘ** v aplikaci COCO (C3 HUB). Modul je v aktuální verzi UI **referenční** – zobrazuje doktrinální rozdělení:

- **společných funkcí** (joint functions – 8 funkcí),
- **bojových funkcí** (warfighting / combat functions – 6 funkcí),

dvojjazyčně (CZ/EN), a slouží jako klasifikační osa pro **FMN procedurální instrukce** (název stránky: „Vazební tabulka na FMN Procedurální Instrukce").

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`. Klíčové zdroje:

- `/coco/web-app/src/content/warfighting/JointWarfightingFunctionTableData.ts` – statická data funkcí (CZ/EN)
- `/coco/web-app/src/content/warfighting/JointWarfightingPage.tsx` – referenční stránka
- `/coco/web-app/src/i18n/translations.json` – `jointWarfighting` sekce (popisy funkcí)

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – Funkce SVŘ
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C03 | 3 |
| Funkční požadavky | FR035–FR037 | 3 |
| Use Cases | UC050–UC052 | 3 |
| GUI třídy | G076–G078 | 3 |
| Logický model – třídy | L042–L044 | 3 |
| Logický model – číselníky | E035–E009 | 2 |
| Sekvenční diagramy | — (referenční modul, bez netriviální logiky) | 0 |
| Stavové diagramy | — (statická data bez životního cyklu) | 0 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (referenční stránka + 2 tabulky) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (funkce) a číselníky |
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

- **Strukturovaná vazební tabulka funkce ↔ FMN PI** – stránka se jmenuje „Vazební tabulka na FMN Procedurální Instrukce", ale source frontendu zobrazuje pouze statické referenční tabulky funkcí. Skutečná vazební matice (která PI realizuje kterou funkci) není ze source vidět – třída [L044](04_logicky_model.md#lm-L044) je business konstrukce.
- **Editovatelnost funkcí** – funkce jsou hardcoded v `JointWarfightingFunctionTableData.ts`; není jasné, zda mají v budoucnu být editovatelné nebo napojené na backend.
- **Vztah ke specifikaci MV** – RQU002 specifikace MV používá `jointFunctions` a `combatFunctions` jako multi-LOV; soulad výčtu hodnot mezi RQU006 statickými daty a backendovými katalogy `/command-posts/catalogs/joint-functions` a `/combat-functions` nelze ze source ověřit.
