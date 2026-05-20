# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L001](#lm-L001) | Položka katalogu služeb | serviceCatalogItem | Abstraktní třída |
| [L002](#lm-L002) | Infrastrukturní služba | infrastructureService | Třída (stereotyp `SRV`, read-only) |
| [L003](#lm-L003) | Aplikační služba | applicationService | Třída (stereotyp `APL`, read-only) |
| [L004](#lm-L004) | CIS Aplikace | cisApplication | Třída (stereotyp `CISAPP`) |
| [L005](#lm-L005) | CIS Zařízení | cisDevice | Třída (stereotyp `CISDEV`) |
| [E001](#lm-E001) | kategorieKataloguSlužeb_E | kategorieKataloguSluzeb_E | Číselník |

> **Reverse-engineering RQU005** – katalog služeb je v aplikaci **podčástí modulu Model SVŘ** ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)). Třídy L002–L005 jsou totožné se stereotypovými třídami [RQU004 L015–L018](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L015); RQU005 je poskytuje v detailním pohledu. Atributy jsou zděděné z generického `ElementDto` (viz [RQU004 L001](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L001)). Source: `/coco/web-app/src/content/model/ServiceCatalogData.ts`, `ModelElementsPage.tsx`.

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L001"></a>
## Třída: Položka katalogu služeb

Abstraktní třída – generická položka katalogu CIS služeb a prostředků. Konkretizuje [RQU004 L001 Element modelu](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L001) na stereotypy katalogu služeb.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | _zděděné z [RQU004 L001](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L001)_ | | | | id, type, stereotype, s5636Identifier, name, nameCz, description, descriptionCz, translationStatus |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| stereotype | [kategorieKataloguSlužeb_E](#lm-E001) | 1 | Určuje konkrétní kategorii (L002–L005) |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Stereotyp musí být jeden ze 4 katalogových: `SRV`, `APL`, `CISAPP`, `CISDEV`. |
| 2 | Read-only kategorie (`SRV`, `APL`) nelze vytvářet ani editovat z uživatelského rozhraní. |

---

<a id="lm-L002"></a>
## Třída: Infrastrukturní služba

Konkretizace [L001](#lm-L001) se stereotypem `INFRASTRUCTURE_SERVICE` (`SRV`). **Read-only** – spravována systémově. Totožná s [RQU004 L015](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L015).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívána) | [CIS Zařízení](#lm-L005) | 0..* | CIS zařízení využívají infrastrukturní služby |

---

<a id="lm-L003"></a>
## Třída: Aplikační služba

Konkretizace [L001](#lm-L001) se stereotypem `APPLICATION_SERVICE` (`APL`). **Read-only** – spravována systémově. Totožná s [RQU004 L016](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L016).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívána) | [CIS Aplikace](#lm-L004) | 0..* | CIS aplikace využívají aplikační služby |

---

<a id="lm-L004"></a>
## Třída: CIS Aplikace

Konkretizace [L001](#lm-L001) se stereotypem `CIS_APPLICATION` (`CISAPP`). **Editovatelná** – uživatel ji může vytvářet, duplikovat a měnit její vztahy. Totožná s [RQU004 L017](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L017).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívá) | [Aplikační služba](#lm-L003) | 0..* | |
| (provádí) | [RQU004 L005 TIN](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L005) | 0..* | Technologická interakce |

---

<a id="lm-L005"></a>
## Třída: CIS Zařízení

Konkretizace [L001](#lm-L001) se stereotypem `CIS_DEVICE` (`CISDEV`). **Editovatelné** – uživatel ho může vytvářet, duplikovat a měnit jeho vztahy. Totožné s [RQU004 L018](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L018).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívá) | [Infrastrukturní služba](#lm-L002) | 0..* | |
| (provádí) | [RQU004 L005 TIN](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L005) | 0..* | Technologická interakce |

---

## Číselníky (Enumerace)

<a id="lm-E001"></a>
### kategorieKataloguSlužeb_E

4 kategorie katalogu CIS služeb a prostředků. Source: `getDynamicCardData` (`/coco/web-app/src/content/model/ServiceCatalogData.ts`).

| Hodnota (kód) | Stereotyp | Editovatelnost | Třída |
|---|---|---|---|
| `SRV` | INFRASTRUCTURE_SERVICE | Read-only | [L002](#lm-L002) Infrastrukturní služba |
| `APL` | APPLICATION_SERVICE | Read-only | [L003](#lm-L003) Aplikační služba |
| `CISAPP` | CIS_APPLICATION | Editovatelná | [L004](#lm-L004) CIS Aplikace |
| `CISDEV` | CIS_DEVICE | Editovatelná | [L005](#lm-L005) CIS Zařízení |
