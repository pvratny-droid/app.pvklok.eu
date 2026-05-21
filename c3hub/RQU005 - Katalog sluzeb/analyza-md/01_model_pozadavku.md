# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník IT architektury nebo plánovač velení, který pracuje s katalogem CIS služeb a prostředků – prohlíží infrastrukturní a aplikační služby, eviduje CIS aplikace a CIS zařízení. |
| **Systém C3 HUB** | Vlastní aplikace COCO – poskytuje katalog služeb jako součást modulu Model SVŘ, řídí editovatelnost jednotlivých kategorií. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Vést katalog **CIS služeb a prostředků** ve 4 kategoriích: Infrastrukturní služby, Aplikační služby, CIS Aplikace, CIS Zařízení. |
| **C02** | Umožnit prohlížení a vyhledávání prvků katalogu; u editovatelných kategorií (CIS Aplikace, CIS Zařízení) i jejich vytváření a údržbu. |
| **C03** | Odlišit **read-only** kategorie (Infrastrukturní a Aplikační služby – spravované systémově) od **editovatelných** kategorií (CIS Aplikace, CIS Zařízení). |

---

## Funkční požadavky

<a id="fr-FR031"></a>
### FR031 – Přehled katalogu služeb

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Na stránce **Model** je samostatný panel **„Katalog služeb"** se 4 dlaždicemi kategorií: **Infrastrukturní služby** (SRV), **Aplikační služby** (APL), **CIS Aplikace** (CISAPP), **CIS Zařízení** (CISDEV). Klik na dlaždici naviguje na seznam prvků dané kategorie. RQU005 je detailní pohled na katalogovou část modulu Model SVŘ ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)). |
| **Návrh řešení** | Panel `«Form area» KatalogSlužeb` na `«Form» Model` se 4 dlaždicemi `«Form multi area»`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC047](02_use_case_model.md#uc-UC047)

---

<a id="fr-FR032"></a>
### FR032 – Detail kategorie a vyhledávání v prvcích

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Klik na dlaždici kategorie otevře stránku se seznamem prvků dané kategorie (URL `/web/model/{stereotype}`). Stránka obsahuje vyhledávací filtr a tabulku prvků se sloupci Kód, Název EN, Název CZ, Stav překladu. Použije se sdílená komponenta `ElementsTable` z [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G059). |
| **Návrh řešení** | Sdílená `«Form» ElementsPage` + `«Form grid area» ElementsTable` z RQU004. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC048](02_use_case_model.md#uc-UC048)

---

<a id="fr-FR033"></a>
### FR033 – Vytvoření a editace CIS prvku

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Pro **editovatelné** kategorie (CIS Aplikace, CIS Zařízení) je dostupné tlačítko **+ Přidat** a řádkové akce Duplikovat a Editovat vztahy. Pro **read-only** kategorie (Infrastrukturní a Aplikační služby) tyto akce dostupné **nejsou** (`isReadOnlyStereotype = true`). |
| **Návrh řešení** | Sdílený `«Form modal» CreateElementDialog` z RQU004; dostupnost akcí řízena příznakem read-only. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC049](02_use_case_model.md#uc-UC049) |

---

<a id="fr-FR034"></a>
### FR034 – Read-only zobrazení služeb

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Infrastrukturní služby (SRV) a Aplikační služby (APL) jsou v aplikaci pouze pro čtení – jsou spravované systémově (mimo uživatelské rozhraní). Uživatel je smí prohlížet a vyhledávat, ale ne vytvářet, duplikovat ani upravovat jejich vztahy. |
| **Návrh řešení** | Příznak `isReadOnlyStereotype` na `ModelElementsPage` skryje akce Přidat/Duplikovat/Editovat vztahy. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC048](02_use_case_model.md#uc-UC048)

---

## Souhrnná tabulka realizace

| FR | UC047 | UC048 | UC049 |
|---|---|---|---|
| **FR031** | X | | |
| **FR032** | | X | |
| **FR033** | | | X |
| **FR034** | | X | |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
