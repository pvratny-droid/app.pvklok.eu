# Motivace

Motivační vrstva ArchiMate zachycuje **proč** aplikace C3 HUB existuje – kdo jsou stakeholdeři, jaké drivery je ženou, jaké cíle z nich plynou a jakými požadavky se cíle realizují. Cíle jsou agregací cílů (C0x) napříč dílčími analýzami.

```plantuml file=diagrams/archimate_motivation.puml
```

---

## Stakeholdeři

| Stakeholder | Zájem |
|---|---|
| **Generální štáb** | Jednotná, sdílená evidence velitelské struktury a misí. |
| **IT architektura** | Konzistentní doménový model SVŘ v souladu s metamodelem; správa CIS prostředků. |
| **Plánovači velení** | Detailní specifikace MV a plánování informačních a velitelských vazeb. |
| **NATO / FMN** | Soulad s referenčním metamodelem a procedurálními instrukcemi (FMN), dvojjazyčnost. |

---

## Drivery

| Driver | Popis |
|---|---|
| **Jednotná evidence C2** | Jedno místo pravdy pro místa velení, mise a jejich vazby místo roztříštěných dokumentů. |
| **Soulad s ArchiMate / NATO metamodelem** | Model SVŘ respektuje 15 ArchiMate typů, 17 stereotypů a 9 typů vztahů. |
| **Řízené změny modelu** | Žádná změna vztahů bez kontroly – schvalovací workflow. |
| **Dvojjazyčnost CS/EN** | Jména a popisy prvků udržované v obou jazycích se stavem překladu. |

---

## Cíle (agregace C0x)

| Cíl | Vychází z driveru | Zdroj |
|---|---|---|
| **Jednotný vstupní bod (nástěnka)** | Jednotná evidence C2 | RQU001 C01 |
| **Vést doménový model SVŘ (17 stereotypů)** | Soulad s metamodelem | RQU004 C01 |
| **Detailní specifikace MV a misí** | Jednotná evidence C2 | RQU002 C02, RQU003 C02 |
| **Řízené schvalování změn vztahů** | Řízené změny modelu | RQU004 C04 |
| **Referenční dokumentace** | Soulad s metamodelem | RQU006, RQU007 |
| **Závazná evidence osob** *(chystané)* | Jednotná evidence C2 | RQU009 C01 |

---

## Požadavky (reprezentativní výběr)

Cíle se realizují konkrétními funkčními požadavky dílčích analýz. Níže reprezentativní výběr; úplný seznam je v modelech požadavků jednotlivých RQU.

| Požadavek | Realizuje cíl | Zdroj FR |
|---|---|---|
| **Patch Request workflow** (REQUESTED → APPROVED/REJECTED) | Řízené schvalování změn | [RQU004 FR027](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/01_model_pozadavku.md#fr-FR027) |
| **Překladové workflow** (AI → UPDATED → APPROVED) | Vést doménový model SVŘ | [RQU004 FR026](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/01_model_pozadavku.md#fr-FR026) |
| **Generování reportů PDF / CIS matice XLSX** | Detailní specifikace MV a misí | [RQU002 FR012](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/01_model_pozadavku.md#fr-FR012) |
| **Životní cyklus mise** | Detailní specifikace MV a misí | [RQU003 FR016](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/01_model_pozadavku.md#fr-FR016) |
| **Lifecycle položky číselníku** | Referenční dokumentace | [RQU010 FR050](../../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/analyza-md/01_model_pozadavku.md#fr-FR050) |

> Diagram používá vztah *realizace* (čárkovaná šipka) od požadavku k cíli a vztah *vlivu / vedení* (plná šipka) od stakeholdera k driveru a od driveru k cíli.
