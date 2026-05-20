# UML Analýza – Číselníky požadavků a omezení MV (C3 HUB)

**DA změnového požadavku RQU010.** Analýza rozšiřuje doménový Model SVŘ z [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md) o **dvě nové stereotypy** prvků – **REQUIREMENT** (Požadavek MV) a **CONSTRAINT** (Omezení MV). V Modelu SVŘ přibyde panel **„Číselníky"** se 2 dlaždicemi navigujícími na obecný přehled prvků stereotypu, doplněný o lifecycle aktivní/zrušená a akci „Zobrazit MV používající položku".

> **Kontext:** V současné aplikaci je statická placeholder stránka `RequirementsModelPage` (`/requirements-and-constraints`) s dvěma `CocoPaper` panely a hardcoded daty (81 požadavků + 12 omezení v `RequirementsTableData.ts` / `ConstraintsTableData.ts`, sloupec jen `text`). Backend již má funkční endpointy `/command-posts/catalogs/requirements` a `/constraints`, ze kterých čerpá editor [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md) přes hooky `useFindAllRequirements` / `useFindAllConstraints`. RQU010 tuto evidenci povýší na plnohodnotné spravované doménové entity (CRUD, dvojjazyčnost, lifecycle, auditovatelnost).
>
> **Pojem „Požadavek MV / Omezení MV":** Sufix *MV* odlišuje tento číselník od **Dashboard dlaždice** „Požadavky a omezení" (`DashboardPage.tsx:126`), která vede na **změnové požadavky na systém** (RQU). Dashboard dlaždice s touto analýzou nesouvisí.

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-19
**Systém:** COCO · C3 HUB – Model SVŘ · Číselníky
**Úroveň:** complete
**Přírůstek:** Etapa 2 – RQU010
**Vazba na souhrn:** [RQU001 – Souhrn aplikace C3 HUB](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md)
**Vazba na nadřazenou analýzu:** [RQU004 – Model SVŘ doménové entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Systém C3 HUB | 2 |
| Cíle | C01–C03 | 3 |
| Funkční požadavky | FR01–FR05 | 5 |
| Use Cases | UC001–UC007 | 7 |
| GUI třídy | G001 (mod), G002 (existing), G003 (mod), G004 (mod), G005 (new), G006 (mod), G007 (existing), G011 (mod) | 8 |
| Logický model – třídy | L001 Element modelu (mod – přes RQU004) | 0 vlastních |
| Logický model – číselníky | E001 stereotyp_E (mod – přes RQU004) | 0 vlastních |
| Sekvenční diagramy | SD-UC004, SD-UC005 (UC005+UC006), SD-UC007 | 3 |

> **Poznámka k LM:** RQU010 nezavádí žádnou vlastní LM třídu ani číselník. Modeluje delta v existujících prvcích RQU004 (atribut `active` na `Element modelu`, nové hodnoty `REQUIREMENT` a `CONSTRAINT` v `stereotyp_E`).

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle C01–C03, funkční požadavky FR01–FR05) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model UC001–UC007 |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (delta vůči RQU004 + nová G005) |
| [04_logicky_model.md](04_logicky_model.md) | Logický model (delta `Element modelu` + `stereotyp_E`) |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagramy (SD-UC004, SD-UC005, SD-UC007) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/fr_realizace_detail.puml](diagrams/fr_realizace_detail.puml) | Vícevrstvový pohled RQU010 → FR → UC → GUI → LM |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| [diagrams/sd_uc004.puml](diagrams/sd_uc004.puml) | SD UC004 – Aktivovat zrušenou položku |
| [diagrams/sd_uc005.puml](diagrams/sd_uc005.puml) | SD UC005 + UC006 – Zrušit (deaktivace s alt. trvalého výmazu) |
| [diagrams/sd_uc007.puml](diagrams/sd_uc007.puml) | SD UC007 – Zobrazit MV používající položku |

---

## Otevřené otázky

| # | Otázka | Stav |
|---|---|---|
| 1 | Backend rozšíření `ElementDto` o pole `active` (a volitelně `archivedAt`) – kdo a kdy implementuje? | Open |
| 2 | Migrace FK v `CommandPostSpecification`: ponechat `requirementsCodes` / `constraintsCodes` přes `s5636Identifier` (snazší přechod) vs. přechod na `requirementIds` / `constraintIds` přes `ElementDto.id` (čistší)? | Open |
| 3 | Migrace 81 hardcoded požadavků a 12 omezení z `RequirementsTableData.ts` / `ConstraintsTableData.ts` do tabulky `Element` se stereotypem REQUIREMENT / CONSTRAINT – jednorázový skript, kdo zajistí? | Open |
| 4 | `translationStatus` (AI_TRANSLATED → UPDATED → APPROVED) – aplikovat i pro REQ / CONSTR, nebo defaultně přeskočit? | Open |
| 5 | Oprávnění: kdo smí spravovat číselníky (admin role, „Schvalovatel modelu" z RQU004, všichni přihlášení)? | Open |
| 6 | Patch Request workflow (RQU004 UC007–UC009) – vztahuje se i na změny REQ / CONSTR? Doporučení: ne (číselník bez vztahů). | Open |
| 7 | Dashboard dlaždice „Požadavky a omezení" (`DashboardPage.tsx:126`) vede na změnové požadavky na systém, ne na číselník MV-specifický – mimo scope RQU010. | Resolved |
| 8 | URL nových stránek: `/web/model/requirement` a `/web/model/constraint` (analogicky RQU004 pattern `/web/model/{stereotype}`). | Open |
| 9 | Generování `s5636Identifier` pro REQ / CONSTR – formát `REQ-NNN` / `CON-NNN`, per typ auto-increment, **stálé po výmazu** (rozhodnutí uživatele). | Resolved |
| 10 | Historický label v reportech: **live label** (default); zrušená položka v reportu označena jako *(zrušené)* (rozhodnutí uživatele). | Resolved |

---

## Varianty datového modelu (zvažované)

V průběhu analýzy byly zvažovány dvě varianty:

| Varianta | Stručně | Status |
|---|---|---|
| **1 – Rozšíření `LabeledCatalogValueDto`** | Doplnit existující DTO o `description`, `descriptionEn`, `active`. Vlastní LM třídy Požadavek MV / Omezení MV. Minimální backend refactor (FK přes `code` zůstává). | Zamítnuta |
| **2 – REQUIREMENT / CONSTRAINT jako stereotypy ElementDto** | Reuse celý Element framework (CRUD, překlady, badge). Breaking change v `CommandPostSpecification` (FK migrace), migrace 81+12 položek. | **Zvolena** |

Varianta 2 zvolena pro **sjednocení doménových entit SVŘ pod jeden framework** – stejné CRUD, stejné překladové workflow, stejná badge, stejný stylový jazyk.

---

## Reference

- **Cross-RQU:**
  - [RQU004 – Model SVŘ doménové entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md) (vzor + cílové prvky modifikace)
  - [RQU002 – Karty míst velení](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/README.md) (asociace na Specifikace MV)
- **Metodika:** [metodika-zapisu.md](../../../../metodika/metodika-zapisu.md) (zejména kap. 8 – DA změny, 8.5 – stereotyp «RQU010», 8.11 – Verze: RQU010 vs. věcný popis)
- **Source code COCO:**
  - `coco/web-app/src/client/model/ModelApiClient.tsx` – `ElementDto`, `Stereotype` enum
  - `coco/web-app/src/content/model/ModelPage.tsx` – rozcestník Modelu SVŘ (modifikace panelu Číselníky)
  - `coco/web-app/src/content/model/ModelElementsPage.tsx` – přehled prvků (modifikace toggle „zrušené")
  - `coco/web-app/src/content/model/stereotype/element/ElementsTable.tsx` – tabulka prvků
  - `coco/web-app/src/content/post/CommandPostQueries.ts` – `useFindAllRequirements`, `useFindAllConstraints`
  - `coco/web-app/src/content/post/specification/CommandPostSpecificationDialog.tsx` – konzument číselníku
