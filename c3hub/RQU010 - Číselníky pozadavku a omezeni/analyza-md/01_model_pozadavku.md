# Model požadavků

> **Typ analýzy:** DA změnového požadavku **RQU010 – Číselníky požadavků a omezení MV**. Drtivá většina prvků je `modified` v [RQU004 – Model SVŘ doménové entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md); jediná zcela nová GUI třída je [G096 Dialog potvrzení zrušení/výmazu](03_gui_model.md#gui-G096).

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu / plánovač velení. Spravuje číselníky **Požadavků MV** a **Omezení MV** v rámci Modelu SVŘ (přidání, editace překladů CS/EN, deaktivace, případně výmaz nepoužité položky) a využívá hodnoty číselníků jako vstup při editaci [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004). |
| **Systém C3 HUB** | Aplikace COCO – persistuje položky číselníků (ElementDto se stereotypem `REQUIREMENT` / `CONSTRAINT`), filtruje aktivní hodnoty pro nabídku v Specifikaci MV, eviduje použití položky v jednotlivých MV a zajišťuje lokalizaci hodnot v reportech (PDF / XLSX) podle jazyka uživatele. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Sjednotit doménové entity SVŘ pod společný **Element framework** (RQU004) i pro podnikové číselníky Požadavky MV a Omezení MV – stejné CRUD, stejné překladové workflow CS/EN, stejná badge „Existující/Upravovaný" ve vieweru. |
| **C02** | Umožnit lifecycle položky **aktivní ↔ zrušená** bez ztráty historie. Zrušená položka zůstane viditelná v historických Specifikacích MV (live label, v reportu vyznačena jako *(zrušené)*), ale nová Specifikace MV ji nenabízí. Trvalý výmaz je možný pouze pro položku bez referencí. |
| **C03** | Zpřístupnit **auditovatelnost** – z přehledu položky je možné jedním kliknutím zobrazit seznam MV, které danou položku referují (analogicky existující funkci „Relevantní MV" pro MCA schopnost, [RQU004 G066](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G066)). |

---

## Funkční požadavky

> **Poznámka:** CRUD operace (přidání položky, editace překladů) jsou **dědictvím RQU004 FR051/FR052** – realizovány stávajícím Element pipeline ([G061](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G061) `CreateElementDialog`, [G062](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G062) `ElementDialog`). RQU010 je jen rozšiřuje o nové stereotypy a doplňuje funkce lifecycle, vyhledávání, zobrazení použití.

<a id="fr-FR049"></a>
### FR049 – Zařazení Požadavků a Omezení MV do Modelu SVŘ jako stereotypy ElementDto

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Rozšířit číselník stereotypů `stereotyp_E` o dvě nové hodnoty: `REQUIREMENT` a `CONSTRAINT`. V Modelu SVŘ ([RQU004 G056](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G056) `ModelPage`) přibyde nový panel **„Číselníky"** umístěný **před** panel „Ostatní" se dvěma dlaždicemi: **Požadavky MV** a **Omezení MV**. Kliknutí na dlaždici naviguje na obecný Přehled prvků stereotypu ([RQU004 G058](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G058)) parametrizovaný daným stereotypem. |
| **Návrh řešení** | Backend: rozšířit enum `Stereotype` (`coco/web-app/src/client/model/ModelApiClient.tsx`) o `REQUIREMENT` a `CONSTRAINT` a migrovat 81 hardcoded požadavků a 12 omezení z `RequirementsTableData.ts` / `ConstraintsTableData.ts` do tabulky `Element` jednorázovým skriptem. UI: doplnit do `ModelPage.tsx` nový `CocoPaper` panel s 2 dlaždicemi (`MvCatalogCardData.ts`) navigujícími na `/web/model/requirement` resp. `/web/model/constraint`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC065](02_use_case_model.md#uc-UC065)

---

<a id="fr-FR050"></a>
### FR050 – Lifecycle položky (aktivní / zrušená) s filtrací nabízených hodnot ve Specifikaci MV

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Každá položka číselníku Požadavků / Omezení MV nese příznak **aktivity** (`active`, default `true`). Aktivní položky se nabízejí v editoru [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md), zrušené (`active = false`) nikoliv. Zrušení existující reference v MV nenarušuje – v reportu se historická hodnota stále zobrazí s aktuálním labelem a přídomkem *(zrušené)*. Zrušenou položku lze kdykoliv znovu aktivovat. |
| **Návrh řešení** | Doplnit `ElementDto` o pole `active` (bool, default `true`). Hooky `useFindAllRequirements` / `useFindAllConstraints` rozšířit (nebo přepnout na nový endpoint `GET /api/elements?stereotype=REQUIREMENT&active=true`) – v editoru Specifikace MV se nabízejí jen aktivní hodnoty. V přehledu číselníku (G058) se default zobrazují jen aktivní; toggle „Zobrazit i zrušené" rozšíří filtr. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC068](02_use_case_model.md#uc-UC068), [UC069](02_use_case_model.md#uc-UC069)

---

<a id="fr-FR051"></a>
### FR051 – Zrušení položky s detekcí použití v MV a nabídkou trvalého výmazu

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Akce **Zrušit** otevře dialog ([G096](03_gui_model.md#gui-G096) `MvCatalogDeactivationDialog`), který zobrazí počet MV, ve kterých je položka aktuálně referována. Pokud je počet > 0, jediná dostupná akce je **Deaktivovat** (`active = false`). Pokud je počet 0, dialog nabídne dvě tlačítka: **Trvale smazat** (DELETE položky z DB) a **Deaktivovat**. |
| **Návrh řešení** | Backend endpoint `GET /api/elements/{id}/usage` vrátí seznam MV (z `CommandPostSpecification`) referujících danou položku. UI: nový «Form modal» [G096](03_gui_model.md#gui-G096) volaný z [G059](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G059) (modifikovaná tabulka prvků). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC069](02_use_case_model.md#uc-UC069), [UC070](02_use_case_model.md#uc-UC070)

---

<a id="fr-FR052"></a>
### FR052 – Přehled položek se vyhledáváním a přepínačem zobrazení zrušených

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V přehledu položek číselníku ([RQU004 G058](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G058) modified) je v hlavičce **vyhledávací pole** (existující funkcionalita – vyhledává napříč `name`, `nameCz`, `description`, `descriptionCz`) a **toggle „Zobrazit i zrušené"**. Toggle je viditelný **jen** pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT) – pro ostatních 17 stereotypů z RQU004 (MCA, IER, Role, …) je skrytý, protože nemají koncept zrušení. Default je toggle vypnut → seznam zobrazuje jen aktivní položky. |
| **Návrh řešení** | V `ModelElementsPage.tsx` přidat lokální stav `showInactive` a controlled checkbox v hlavičce (`isCatalogStereotype(stereotype)`). Backend dotaz parametrizovat (`active=true` resp. `active=all`). V `ElementsTable.tsx` přibyde sloupec **Aktivní** (RCheckTooltip) a vizuální „greyed" stav pro zrušené řádky. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC066](02_use_case_model.md#uc-UC066), [UC067](02_use_case_model.md#uc-UC067)

---

<a id="fr-FR053"></a>
### FR053 – Zobrazení MV používajících konkrétní položku číselníku

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V přehledu položek je na každém řádku akční ikona **„Zobrazit odpovídající MV"**, která otevře dialog ([RQU004 G066](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G066) modified – zobecněný `CapabilityCommandPostsDialog`) se seznamem MV (název, typ, organizace), které danou položku Požadavku / Omezení MV používají ve své Specifikaci MV. Analogie existující akce „Relevantní MV" u MCA schopnosti. |
| **Návrh řešení** | Rozšířit `isRelevantCommandPostsEnabled` z `Stereotype.MCA_CAPABILITY` na `[MCA_CAPABILITY, REQUIREMENT, CONSTRAINT]`. Backend endpoint `GET /api/elements/{id}/command-posts/usage` (paralelní k existujícímu `…/capability/{id}/command-posts`). Titulek dialogu parametrizovat podle stereotypu. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC071](02_use_case_model.md#uc-UC071)

---

## Diagram realizace

Diagram realizace cílů přes funkční požadavky:

```plantuml file=diagrams/fr_realizace.puml
```

Vícevrstvový pohled (RQU010 → FR → UC → GUI → LM), povinný pro DA změnových požadavků dle [metodiky zápisu kap. 7.4](../../../../metodika/metodika-zapisu.md):

```plantuml file=diagrams/fr_realizace_detail.puml
```

---

## Souhrnná tabulka realizace

| FR | UC | Klíčové GUI | Klíčové LM |
|---|---|---|---|
| [FR049](#fr-FR049) | [UC065](02_use_case_model.md#uc-UC065) | [G056](03_gui_model.md#gui-G056) (mod), [G095](03_gui_model.md#gui-G095) | [E028](04_logicky_model.md#lm-E028) (mod) |
| [FR050](#fr-FR050) | [UC068](02_use_case_model.md#uc-UC068), [UC069](02_use_case_model.md#uc-UC069) | [G058](03_gui_model.md#gui-G058) (mod), [G059](03_gui_model.md#gui-G059) (mod) | [L054](04_logicky_model.md#lm-L054) (mod) |
| [FR051](#fr-FR051) | [UC069](02_use_case_model.md#uc-UC069), [UC070](02_use_case_model.md#uc-UC070) | [G059](03_gui_model.md#gui-G059) (mod), [G096](03_gui_model.md#gui-G096) (new) | [L054](04_logicky_model.md#lm-L054) (mod) |
| [FR052](#fr-FR052) | [UC066](02_use_case_model.md#uc-UC066), [UC067](02_use_case_model.md#uc-UC067) | [G058](03_gui_model.md#gui-G058) (mod), [G059](03_gui_model.md#gui-G059) (mod) | [L054](04_logicky_model.md#lm-L054) (mod) |
| [FR053](#fr-FR053) | [UC071](02_use_case_model.md#uc-UC071) | [G059](03_gui_model.md#gui-G059) (mod), [G097](03_gui_model.md#gui-G097) (mod) | [L054](04_logicky_model.md#lm-L054) (mod), Specifikace MV ([RQU002 L004](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)) |
