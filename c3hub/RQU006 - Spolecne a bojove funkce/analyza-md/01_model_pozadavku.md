# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu nebo plánovač velení, který se v aplikaci orientuje v doktrinálním rozdělení **společných funkcí** a **bojových funkcí** a v jejich vazbě na FMN procedurální instrukce. |
| **Systém C3 HUB** | Vlastní aplikace COCO – zobrazuje referenční přehled funkcí (statická referenční data) a propojuje funkce s procedurálními instrukcemi a se specifikací míst velení. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Poskytnout jednotný referenční přehled **společných funkcí** (joint functions) dle doktríny SVŘ – dvojjazyčně (CZ/EN). |
| **C02** | Poskytnout jednotný referenční přehled **bojových funkcí** (warfighting / combat functions) dle doktríny SVŘ – dvojjazyčně (CZ/EN). |
| **C03** | Zachytit vazbu společných a bojových funkcí na **FMN procedurální instrukce** (vazební tabulka), aby bylo zřejmé, které instrukce funkci realizují. |

---

## Funkční požadavky

<a id="fr-FR035"></a>
### FR035 – Referenční přehled společných funkcí

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit referenční tabulku **společných funkcí** s českým a anglickým názvem. Společné funkce dle doktríny: manévr, palby, velení a řízení, zpravodajství, informační činnost, udržitelnost, ochrana sil, civilně-vojenská spolupráce (8 funkcí). Doprovází ji ilustrační obrázek a textový popis. |
| **Návrh řešení** | `«Form» FunkcePage` (URL `/web/joint-warfighting-functions`) s panelem „Společné funkce" – tabulka `«Form grid area»` (CZ / EN) + ilustrační obrázek. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC050](02_use_case_model.md#uc-UC050)

---

<a id="fr-FR036"></a>
### FR036 – Referenční přehled bojových funkcí

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit referenční tabulku **bojových funkcí** s českým a anglickým názvem. Bojové funkce dle doktríny: mission command, přesun a manévr, zpravodajské zabezpečení, palby, udržování činnosti, ochrana sil (6 funkcí). Bojové funkce představují skupinu úkolů a systémů (lidé, organizace, informace a procesy) sjednocené společným účelem. Doprovází ji ilustrační obrázek a textový popis. |
| **Návrh řešení** | Panel „Bojové funkce" v `«Form» FunkcePage` – tabulka `«Form grid area»` (CZ / EN) + ilustrační obrázek. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC051](02_use_case_model.md#uc-UC051)

---

<a id="fr-FR037"></a>
### FR037 – Vazební tabulka na FMN procedurální instrukce

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Stránka je v aplikaci pojmenována **„Vazební tabulka na FMN Procedurální Instrukce"** (i18n `jointWarfighting:mainTitle`). Společné i bojové funkce slouží jako klasifikační osa pro FMN procedurální instrukce – každá procedurální instrukce ([RQU004 L030](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L030)) realizuje jednu nebo více funkcí. Vazba propojuje doktrinální funkce se 13 FMN instrukcemi zobrazovanými na detailu MV ([RQU002 L010](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L010)). |
| **Návrh řešení** | Vazební třída [L044 Vazba funkce na procedurální instrukci](04_logicky_model.md#lm-L044). V aktuální verzi UI je stránka primárně referenční (statická data); vazební tabulka je business konstrukce. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC052](02_use_case_model.md#uc-UC052)

---

## Souhrnná tabulka realizace

| FR | UC050 | UC051 | UC052 |
|---|---|---|---|
| **FR035** | X | | |
| **FR036** | | X | |
| **FR037** | | | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
