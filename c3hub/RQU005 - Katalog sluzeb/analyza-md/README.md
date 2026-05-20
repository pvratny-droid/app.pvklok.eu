# UML Analýza – Katalog služeb (C3 Taxonomy) (COCO C3 HUB)

Reverse-engineering **katalogu CIS služeb a prostředků** v aplikaci COCO (C3 HUB). Katalog služeb je v aplikaci podčástí modulu **Model SVŘ** ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)) – samostatný panel na stránce Model se 4 kategoriemi:

- **Infrastrukturní služby** (SRV) – read-only,
- **Aplikační služby** (APL) – read-only,
- **CIS Aplikace** (CISAPP) – editovatelné,
- **CIS Zařízení** (CISDEV) – editovatelné.

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`. Klíčové zdroje:

- `/coco/web-app/src/content/model/ServiceCatalogData.ts` – 4 kategorie katalogu
- `/coco/web-app/src/content/model/ModelElementsPage.tsx` – přehled prvků, příznak `isReadOnlyStereotype`
- `/coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx` – sdílená tabulka prvků

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – Katalog služeb (C3 Taxonomy)
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C03 | 3 |
| Funkční požadavky | FR01–FR04 | 4 |
| Use Cases | UC001–UC003 | 3 |
| GUI třídy | G001–G004 (G003, G004 sdílené z RQU004) | 4 |
| Logický model – třídy | L001–L005 | 5 |
| Logický model – číselníky | E001 | 1 |
| Sekvenční diagramy | — (sdílené z RQU004) | 0 |
| Stavové diagramy | — (sdílené z RQU004) | 0 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (panel katalogu, dlaždice, sdílené komponenty) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (4 kategorie) a číselník |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | (sdílené sekvenční diagramy z RQU004) |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | (sdílené stavové diagramy z RQU004) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |

---

## Otevřené otázky

- **Atributy specifické pro CIS prvky** – CIS Aplikace a CIS Zařízení sdílí generický `ElementDto`; specifické technické atributy (verze, výrobce, kapacita…) nejsou ze source frontendu vidět.
- **Zdroj read-only služeb** – Infrastrukturní a Aplikační služby jsou „spravované systémově", ale konkrétní zdroj (import, jiný systém) není ze source patrný.
- **Vztah CIS Aplikace ↔ Aplikační služba a CIS Zařízení ↔ Infrastrukturní služba** – odvozený z ArchiMate vrstev; konkrétní vztahy se spravují přes Patch Request workflow (RQU004).
