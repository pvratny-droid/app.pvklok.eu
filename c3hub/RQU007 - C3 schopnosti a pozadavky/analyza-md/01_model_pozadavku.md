# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu nebo plánovač velení, který se orientuje v katalogu C3 schopností a v referenčním seznamu **požadavků** a **omezení** kladených na místa velení. |
| **Systém C3 HUB** | Vlastní aplikace COCO – zobrazuje referenční přehledy (statická data) a poskytuje ke stažení poster taxonomie C3 schopností. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Poskytnout přehled **taxonomie C3 schopností** formou stažitelného posteru (referenční dokumentace). |
| **C02** | Poskytnout jednotný referenční seznam **požadavků** kladených na místa velení (např. balistická ochrana, mobilita, napájení, kapacita, čas výstavby). |
| **C03** | Poskytnout jednotný referenční seznam **omezení** míst velení (např. provozní teplota, vlhkost, přepravitelnost, doba bojového úkolu). |

---

## Funkční požadavky

<a id="fr-FR038"></a>
### FR038 – Taxonomie C3 schopností (poster)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Na nástěnce (dashboard) je dlaždice **„C3 schopnosti – přehled"** s akcí **Stáhnout PDF**, která poskytne uživateli poster taxonomie C3 schopností (`capabilities-taxonomy-poster.pdf`). Slouží jako referenční dokumentace pro práci s MCA schopnostmi míst velení. |
| **Návrh řešení** | Dlaždice na `«Form» Nástěnka` s akcí stažení statického PDF posteru. |
| **Priorita** | Nízká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC053](02_use_case_model.md#uc-UC053)

---

<a id="fr-FR039"></a>
### FR039 – Referenční seznam požadavků na MV

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit referenční tabulku **požadavků** kladených na místa velení (81 položek). Požadavky pokrývají oblasti: balistická ochrana, mobilita a přepravitelnost, CBRN ochrana, napájení, ochrana perimetru, informační systémy, maskování, kapacita uživatelů, čas výstavby a opuštění prostoru, plošná distribuce služeb apod. Tabulka je jednosloupcová (text požadavku). |
| **Návrh řešení** | Panel „Požadavky" v `«Form» PožadavkyAOmezeníPage` (URL `/web/requirements-and-constraints`) s tabulkou `«Form grid area»`. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC054](02_use_case_model.md#uc-UC054)

---

<a id="fr-FR040"></a>
### FR040 – Referenční seznam omezení MV

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Zobrazit referenční tabulku **omezení** míst velení (12 položek). Omezení pokrývají: dobu bojového úkolu, konektivitu a synchronizaci, přepravitelnost vybavení, provozní teplotu a chlazení, riziko slané vody, vlhkost, požadavek na vyškolený personál, prašnost. Tabulka je jednosloupcová (text omezení). |
| **Návrh řešení** | Panel „Omezení" v `«Form» PožadavkyAOmezeníPage` s tabulkou `«Form grid area»`. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC055](02_use_case_model.md#uc-UC055)

---

## Souhrnná tabulka realizace

| FR | UC053 | UC054 | UC055 |
|---|---|---|---|
| **FR038** | X | | |
| **FR039** | | X | |
| **FR040** | | | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
