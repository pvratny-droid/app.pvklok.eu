# Model požadavků

> **Typ analýzy:** DA změnového požadavku **RQU010 – Číselníky požadavků a omezení MV**. Drtivá většina prvků je `modified` v [RQU004 – Model SVŘ doménové entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md); jediná zcela nová GUI třída je [G005 Dialog potvrzení zrušení/výmazu](03_gui_model.md#gui-G005).

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu / plánovač velení. Spravuje číselníky **Požadavků MV** a **Omezení MV** v rámci Modelu SVŘ (přidání, editace překladů CS/EN, deaktivace, případně výmaz nepoužité položky) a využívá hodnoty číselníků jako vstup při editaci [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002). |
| **Systém C3 HUB** | Aplikace COCO – persistuje položky číselníků (ElementDto se stereotypem `REQUIREMENT` / `CONSTRAINT`), filtruje aktivní hodnoty pro nabídku v Specifikaci MV, eviduje použití položky v jednotlivých MV a zajišťuje lokalizaci hodnot v reportech (PDF / XLSX) podle jazyka uživatele. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Sjednotit doménové entity SVŘ pod společný **Element framework** (RQU004) i pro podnikové číselníky Požadavky MV a Omezení MV – stejné CRUD, stejné překladové workflow CS/EN, stejná badge „Existující/Upravovaný" ve vieweru. |
| **C02** | Umožnit lifecycle položky **aktivní ↔ zrušená** bez ztráty historie. Zrušená položka zůstane viditelná v historických Specifikacích MV (live label, v reportu vyznačena jako *(zrušené)*), ale nová Specifikace MV ji nenabízí. Trvalý výmaz je možný pouze pro položku bez referencí. |
| **C03** | Zpřístupnit **auditovatelnost** – z přehledu položky je možné jedním kliknutím zobrazit seznam MV, které danou položku referují (analogicky existující funkci „Relevantní MV" pro MCA schopnost, [RQU004 G011](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G011)). |

---

## Funkční požadavky

> **Poznámka:** CRUD operace (přidání položky, editace překladů) jsou **dědictvím RQU004 FR03/FR04** – realizovány stávajícím Element pipeline ([G006](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G006) `CreateElementDialog`, [G007](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G007) `ElementDialog`). RQU010 je jen rozšiřuje o nové stereotypy a doplňuje funkce lifecycle, vyhledávání, zobrazení použití.

<a id="fr-FR01"></a>
### FR01 – Zařazení Požadavků a Omezení MV do Modelu SVŘ jako stereotypy ElementDto

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Rozšířit číselník stereotypů `stereotyp_E` o dvě nové hodnoty: `REQUIREMENT` a `CONSTRAINT`. V Modelu SVŘ ([RQU004 G001](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G001) `ModelPage`) přibyde nový panel **„Číselníky"** umístěný **před** panel „Ostatní" se dvěma dlaždicemi: **Požadavky MV** a **Omezení MV**. Kliknutí na dlaždici naviguje na obecný Přehled prvků stereotypu ([RQU004 G003](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G003)) parametrizovaný daným stereotypem. |
| **Návrh řešení** | Backend: rozšířit enum `Stereotype` (`coco/web-app/src/client/model/ModelApiClient.tsx`) o `REQUIREMENT` a `CONSTRAINT` a migrovat 81 hardcoded požadavků a 12 omezení z `RequirementsTableData.ts` / `ConstraintsTableData.ts` do tabulky `Element` jednorázovým skriptem. UI: doplnit do `ModelPage.tsx` nový `CocoPaper` panel s 2 dlaždicemi (`MvCatalogCardData.ts`) navigujícími na `/web/model/requirement` resp. `/web/model/constraint`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC001](02_use_case_model.md#uc-UC001)

---

<a id="fr-FR02"></a>
### FR02 – Lifecycle položky (aktivní / zrušená) s filtrací nabízených hodnot ve Specifikaci MV

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Každá položka číselníku Požadavků / Omezení MV nese příznak **aktivity** (`active`, default `true`). Aktivní položky se nabízejí v editoru [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md), zrušené (`active = false`) nikoliv. Zrušení existující reference v MV nenarušuje – v reportu se historická hodnota stále zobrazí s aktuálním labelem a přídomkem *(zrušené)*. Zrušenou položku lze kdykoliv znovu aktivovat. |
| **Návrh řešení** | Doplnit `ElementDto` o pole `active` (bool, default `true`). Hooky `useFindAllRequirements` / `useFindAllConstraints` rozšířit (nebo přepnout na nový endpoint `GET /api/elements?stereotype=REQUIREMENT&active=true`) – v editoru Specifikace MV se nabízejí jen aktivní hodnoty. V přehledu číselníku (G003) se default zobrazují jen aktivní; toggle „Zobrazit i zrušené" rozšíří filtr. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC004](02_use_case_model.md#uc-UC004), [UC005](02_use_case_model.md#uc-UC005)

---

<a id="fr-FR03"></a>
### FR03 – Zrušení položky s detekcí použití v MV a nabídkou trvalého výmazu

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Akce **Zrušit** otevře dialog ([G005](03_gui_model.md#gui-G005) `MvCatalogDeactivationDialog`), který zobrazí počet MV, ve kterých je položka aktuálně referována. Pokud je počet > 0, jediná dostupná akce je **Deaktivovat** (`active = false`). Pokud je počet 0, dialog nabídne dvě tlačítka: **Trvale smazat** (DELETE položky z DB) a **Deaktivovat**. |
| **Návrh řešení** | Backend endpoint `GET /api/elements/{id}/usage` vrátí seznam MV (z `CommandPostSpecification`) referujících danou položku. UI: nový «Form modal» [G005](03_gui_model.md#gui-G005) volaný z [G004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G004) (modifikovaná tabulka prvků). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC005](02_use_case_model.md#uc-UC005), [UC006](02_use_case_model.md#uc-UC006)

---

<a id="fr-FR04"></a>
### FR04 – Přehled položek se vyhledáváním a přepínačem zobrazení zrušených

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V přehledu položek číselníku ([RQU004 G003](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G003) modified) je v hlavičce **vyhledávací pole** (existující funkcionalita – vyhledává napříč `name`, `nameCz`, `description`, `descriptionCz`) a **toggle „Zobrazit i zrušené"**. Toggle je viditelný **jen** pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT) – pro ostatních 17 stereotypů z RQU004 (MCA, IER, Role, …) je skrytý, protože nemají koncept zrušení. Default je toggle vypnut → seznam zobrazuje jen aktivní položky. |
| **Návrh řešení** | V `ModelElementsPage.tsx` přidat lokální stav `showInactive` a controlled checkbox v hlavičce (`isCatalogStereotype(stereotype)`). Backend dotaz parametrizovat (`active=true` resp. `active=all`). V `ElementsTable.tsx` přibyde sloupec **Aktivní** (RCheckTooltip) a vizuální „greyed" stav pro zrušené řádky. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC002](02_use_case_model.md#uc-UC002), [UC003](02_use_case_model.md#uc-UC003)

---

<a id="fr-FR05"></a>
### FR05 – Zobrazení MV používajících konkrétní položku číselníku

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V přehledu položek je na každém řádku akční ikona **„Zobrazit odpovídající MV"**, která otevře dialog ([RQU004 G011](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G011) modified – zobecněný `CapabilityCommandPostsDialog`) se seznamem MV (název, typ, organizace), které danou položku Požadavku / Omezení MV používají ve své Specifikaci MV. Analogie existující akce „Relevantní MV" u MCA schopnosti. |
| **Návrh řešení** | Rozšířit `isRelevantCommandPostsEnabled` z `Stereotype.MCA_CAPABILITY` na `[MCA_CAPABILITY, REQUIREMENT, CONSTRAINT]`. Backend endpoint `GET /api/elements/{id}/command-posts/usage` (paralelní k existujícímu `…/capability/{id}/command-posts`). Titulek dialogu parametrizovat podle stereotypu. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 2 – RQU010 |

**Realizující UC:** [UC007](02_use_case_model.md#uc-UC007)

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
| [FR01](#fr-FR01) | [UC001](02_use_case_model.md#uc-UC001) | [G001](03_gui_model.md#gui-G001) (mod), [G002](03_gui_model.md#gui-G002) | [E001](04_logicky_model.md#lm-E001) (mod) |
| [FR02](#fr-FR02) | [UC004](02_use_case_model.md#uc-UC004), [UC005](02_use_case_model.md#uc-UC005) | [G003](03_gui_model.md#gui-G003) (mod), [G004](03_gui_model.md#gui-G004) (mod) | [L001](04_logicky_model.md#lm-L001) (mod) |
| [FR03](#fr-FR03) | [UC005](02_use_case_model.md#uc-UC005), [UC006](02_use_case_model.md#uc-UC006) | [G004](03_gui_model.md#gui-G004) (mod), [G005](03_gui_model.md#gui-G005) (new) | [L001](04_logicky_model.md#lm-L001) (mod) |
| [FR04](#fr-FR04) | [UC002](02_use_case_model.md#uc-UC002), [UC003](02_use_case_model.md#uc-UC003) | [G003](03_gui_model.md#gui-G003) (mod), [G004](03_gui_model.md#gui-G004) (mod) | [L001](04_logicky_model.md#lm-L001) (mod) |
| [FR05](#fr-FR05) | [UC007](02_use_case_model.md#uc-UC007) | [G004](03_gui_model.md#gui-G004) (mod), [G011](03_gui_model.md#gui-G011) (mod) | [L001](04_logicky_model.md#lm-L001) (mod), Specifikace MV ([RQU002 L002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L002)) |
