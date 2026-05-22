# Stavové diagramy

Stavové diagramy popisují životní cyklus instancí logických tříd s netriviální dynamikou.
V analýze DSZEZ má takový lifecyklus třída **Žádost o zkoušku**, která prochází stavy od
rozpracování přes schvalování a provedení zkoušky až po archivaci.

| Diagram | Logická třída | Stavový atribut | PlantUML |
|---|---|---|---|
| [SM-L0001](#DSZEZ-sm-L0001) | Žádost o zkoušku | `stav` typu `stavZadosti_E` | [sm_l0001.puml](diagrams/sm_l0001.puml) |

---

<a id="DSZEZ-sm-L0001"></a>
## L0001 – Žádost o zkoušku

Stavový model třídy [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001).

**Stavový atribut:** `stav` typu `stavZadosti_E` ([číselník stavZadosti_E](04_logicky_model.md#~DSZEZ-lm-E0002))

```plantuml file=diagrams/sm_l0001.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
stateDiagram-v2
    [*] --> Rozpracovana : založit žádost
    Rozpracovana --> Rozpracovana : uložit rozpracované
    Rozpracovana --> VeSchvalovani : podat žádost [validace OK]
    VeSchvalovani --> Schvalena : schválení všemi schvalovateli
    VeSchvalovani --> Zamitnuta : zamítnutí schvalovatelem
    VeSchvalovani --> VeSchvalovani : změna žádosti
    Schvalena --> VeSchvalovani : změna žádosti
    Zamitnuta --> VeSchvalovani : změna žádosti
    Schvalena --> ZkouskaProvedena : zkouška provedena
    ZkouskaProvedena --> Vyhodnocena : přijetí vyhodnocení
    Vyhodnocena --> Archivovana : archivace objektu zkoušky
    Archivovana --> [*]
    Zamitnuta --> [*] : uzavření bez změny
```

</details>

### Přehled stavů

| Stav | Význam | Vstupní podmínka | Typická událost odchodu |
|---|---|---|---|
| `ROZPRACOVANA` | Žádost se vyplňuje, dosud nebyla podána. | Vznik záznamu žádosti (entry) | Podání žádosti |
| `VE_SCHVALOVANI` | Běží schvalovací workflow, schvalovatelé žádost posuzují. | Úspěšná kontrola podané žádosti, založení workflow | Schválení nebo zamítnutí všemi schvalovateli |
| `SCHVALENA` | Workflow dokončeno – žádost schválena všemi schvalovateli. | Všechna posouzení mají výsledek „Schváleno" | Provedení zkoušky nebo změna žádosti |
| `ZAMITNUTA` | Workflow ukončeno zamítnutím. | Kterékoli posouzení skončilo výsledkem „Zamítnuto" | Změna žádosti, nebo uzavření bez změny |
| `ZKOUSKA_PROVEDENA` | Schválená zkouška byla fyzicky uskutečněna. | Provedení zkoušky | Přijetí vyhodnocení |
| `VYHODNOCENA` | Vyhodnocení provedené zkoušky bylo přijato ČEPS. | Schválení přijetí vyhodnocení | Archivace |
| `ARCHIVOVANA` | Objekt zkoušky je uzavřen a archivován. | Archivace objektu zkoušky (entry) | — (koncový stav) |

### Přechody

| Z | Do | Událost | UC | Guard / Efekt |
|---|---|---|---|---|
| `[*]` | `ROZPRACOVANA` | založit žádost | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) | entry / inicializace záznamu žádosti |
| `ROZPRACOVANA` | `ROZPRACOVANA` | uložit rozpracované | [UC0002](02_use_case_model.md#~DSZEZ-uc-UC0002) | / žádost uložena do účtu žadatele |
| `ROZPRACOVANA` | `VE_SCHVALOVANI` | podat žádost | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) | [kontrola vyplnění a formátu OK] / určení schvalovatelů, založení workflow |
| `VE_SCHVALOVANI` | `SCHVALENA` | schválit | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) | [všechna posouzení mají výsledek „Schváleno"] |
| `VE_SCHVALOVANI` | `ZAMITNUTA` | zamítnout | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) | [některé posouzení má výsledek „Zamítnuto"] / notifikace žadatele |
| `VE_SCHVALOVANI` | `VE_SCHVALOVANI` | změnit žádost | [UC0008](02_use_case_model.md#~DSZEZ-uc-UC0008) | / zrušení běhu workflow, založení nového |
| `SCHVALENA` | `VE_SCHVALOVANI` | změnit žádost | [UC0008](02_use_case_model.md#~DSZEZ-uc-UC0008) | / nevratné zrušení schválení, nové workflow |
| `ZAMITNUTA` | `VE_SCHVALOVANI` | změnit žádost | [UC0008](02_use_case_model.md#~DSZEZ-uc-UC0008) | / nové workflow |
| `SCHVALENA` | `ZKOUSKA_PROVEDENA` | zkouška provedena | — | událost mimo aplikaci; mechanismus označení provedení není v zadání určen – viz Otevřené otázky |
| `ZKOUSKA_PROVEDENA` | `VYHODNOCENA` | přijmout vyhodnocení | [UC0011](02_use_case_model.md#~DSZEZ-uc-UC0011) | [vyhodnocení vypořádáno bez výhrad] |
| `VYHODNOCENA` | `ARCHIVOVANA` | archivovat | [UC0011](02_use_case_model.md#~DSZEZ-uc-UC0011) | entry / objekt zkoušky uložen a archivován |
| `ARCHIVOVANA` | `[*]` | — | — | koncový stav |
| `ZAMITNUTA` | `[*]` | uzavřít bez změny | — | žadatel žádost dále neupravuje |
