# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L041](#lm-L041) | Položka katalogu služeb | serviceCatalogItem | Abstraktní třída |
| [L034](#lm-L034) | Infrastrukturní služba | infrastructureService | Třída (stereotyp `SRV`, read-only) |
| [L035](#lm-L035) | Aplikační služba | applicationService | Třída (stereotyp `APL`, read-only) |
| [L036](#lm-L036) | CIS Aplikace | cisApplication | Třída (stereotyp `CISAPP`) |
| [L037](#lm-L037) | CIS Zařízení | cisDevice | Třída (stereotyp `CISDEV`) |
| [E034](#lm-E034) | kategorieKataloguSlužeb_E | kategorieKataloguSluzeb_E | Číselník |

> **Reverse-engineering RQU005** – katalog služeb je v aplikaci **podčástí modulu Model SVŘ** ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)). Třídy L034–L037 jsou totožné se stereotypovými třídami [RQU004 L034–L037](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L034); RQU005 je poskytuje v detailním pohledu. Atributy jsou zděděné z generického `ElementDto` (viz [RQU004 L021](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021)). Source: `/coco/web-app/src/content/model/ServiceCatalogData.ts`, `ModelElementsPage.tsx`.

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L041"></a>
## Třída: Položka katalogu služeb

Abstraktní třída – generická položka katalogu CIS služeb a prostředků. Konkretizuje [RQU004 L021 Element modelu](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021) na stereotypy katalogu služeb.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | _zděděné z [RQU004 L021](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021)_ | | | | id, type, stereotype, s5636Identifier, name, nameCz, description, descriptionCz, translationStatus |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| stereotype | [kategorieKataloguSlužeb_E](#lm-E034) | 1 | Určuje konkrétní kategorii (L034–L037) |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Stereotyp musí být jeden ze 4 katalogových: `SRV`, `APL`, `CISAPP`, `CISDEV`. |
| 2 | Read-only kategorie (`SRV`, `APL`) nelze vytvářet ani editovat z uživatelského rozhraní. |

---

<a id="lm-L034"></a>
## Třída: Infrastrukturní služba

Konkretizace [L041](#lm-L041) se stereotypem `INFRASTRUCTURE_SERVICE` (`SRV`). **Read-only** – spravována systémově. Totožná s [RQU004 L034](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L034).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívána) | [CIS Zařízení](#lm-L037) | 0..* | CIS zařízení využívají infrastrukturní služby |

---

<a id="lm-L035"></a>
## Třída: Aplikační služba

Konkretizace [L041](#lm-L041) se stereotypem `APPLICATION_SERVICE` (`APL`). **Read-only** – spravována systémově. Totožná s [RQU004 L035](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L035).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívána) | [CIS Aplikace](#lm-L036) | 0..* | CIS aplikace využívají aplikační služby |

---

<a id="lm-L036"></a>
## Třída: CIS Aplikace

Konkretizace [L041](#lm-L041) se stereotypem `CIS_APPLICATION` (`CISAPP`). **Editovatelná** – uživatel ji může vytvářet, duplikovat a měnit její vztahy. Totožná s [RQU004 L036](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L036).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívá) | [Aplikační služba](#lm-L035) | 0..* | |
| (provádí) | [RQU004 L025 TIN](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L025) | 0..* | Technologická interakce |

---

<a id="lm-L037"></a>
## Třída: CIS Zařízení

Konkretizace [L041](#lm-L041) se stereotypem `CIS_DEVICE` (`CISDEV`). **Editovatelné** – uživatel ho může vytvářet, duplikovat a měnit jeho vztahy. Totožné s [RQU004 L037](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L037).

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (využívá) | [Infrastrukturní služba](#lm-L034) | 0..* | |
| (provádí) | [RQU004 L025 TIN](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L025) | 0..* | Technologická interakce |

---

## Číselníky (Enumerace)

<a id="lm-E034"></a>
### kategorieKataloguSlužeb_E

4 kategorie katalogu CIS služeb a prostředků. Source: `getDynamicCardData` (`/coco/web-app/src/content/model/ServiceCatalogData.ts`).

| Hodnota (kód) | Stereotyp | Editovatelnost | Třída |
|---|---|---|---|
| `SRV` | INFRASTRUCTURE_SERVICE | Read-only | [L034](#lm-L034) Infrastrukturní služba |
| `APL` | APPLICATION_SERVICE | Read-only | [L035](#lm-L035) Aplikační služba |
| `CISAPP` | CIS_APPLICATION | Editovatelná | [L036](#lm-L036) CIS Aplikace |
| `CISDEV` | CIS_DEVICE | Editovatelná | [L037](#lm-L037) CIS Zařízení |
