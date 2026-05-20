# Stavové diagramy

| Diagram | Třída LM | PlantUML |
|---|---|---|
| [SM-L020](#sm-L020) | Patch Request | [sm_l020.puml](diagrams/sm_l020.puml) |
| [SM-L001](#sm-L001) | Element modelu (stav překladu) | [sm_l001.puml](diagrams/sm_l001.puml) |

---

<a id="sm-L020"></a>
## SM-L020 – Patch Request workflow

Životní cyklus [Patch Requestu (L020)](04_logicky_model.md#lm-L020). Source: enum `RelationshipPatchRequestState` (`/coco/web-app/src/client/model/ModelApiClient.tsx:150`).

```plantuml file=diagrams/sm_l020.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
stateDiagram-v2
    [*] --> REQUESTED: vytvoření žádosti uživatelem\n(POST /patch-requests)
    REQUESTED --> APPROVED: schvalovatel schválí\n(:approve – změny aplikovány)
    REQUESTED --> REJECTED: schvalovatel zamítne\n(:reject – žádné změny)
    APPROVED --> [*]
    REJECTED --> [*]
    note right of REQUESTED
      Rozhodnout může jen
      uživatel s rolí administrátora
    end note
```

</details>

### Stavová pravidla

| Z | Do | Akce | Aktér | Podmínka |
|---|---|---|---|---|
| – | REQUESTED | Vytvoření žádosti | Uživatel | Existuje aspoň jedna změna (`toAdd` / `toDelete` / `elementsToCreate`) |
| REQUESTED | APPROVED | Potvrzení (`:approve`) | Schvalovatel | Uživatel má roli administrátora |
| REQUESTED | REJECTED | Zamítnutí (`:reject`) | Schvalovatel | Uživatel má roli administrátora |

> **Verze: RQU004** – podmínka opravena ze „Schvalovatel ≠ žadatel" na roli administrátora: zdroj (`RelationshipPatchRequestDetailDialog.tsx`) gatuje rozhodnutí jen rolí `isAdmin`, kontrolu „žadatel ≠ schvalovatel" neprovádí (viz Otevřené otázky v README).

---

<a id="sm-L001"></a>
## SM-L001 – Stav překladu prvku modelu

Životní cyklus atributu `translationStatus` na třídě [Element modelu (L001)](04_logicky_model.md#lm-L001). Source: enum `ElementTranslationStatus`.

```plantuml file=diagrams/sm_l001.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
stateDiagram-v2
    [*] --> AI_TRANSLATED: prvotní AI překlad\n(automaticky)
    AI_TRANSLATED --> UPDATED: uživatel upraví Název CZ / Popis CZ
    APPROVED --> UPDATED: další úprava CZ překladu
    AI_TRANSLATED --> APPROVED: schválení překladu (backend)
    UPDATED --> APPROVED: schválení překladu (backend)
    note right of APPROVED
      Přechod do APPROVED řídí backend –
      editační dialog nemá UI akci „Schválit"
    end note
```

</details>

### Stavová pravidla

| Z | Do | Akce | Aktér |
|---|---|---|---|
| – | AI_TRANSLATED | Vytvoření prvku (automatický překlad) | Systém |
| AI_TRANSLATED | UPDATED | Změna CZ překladu (`:update-translations`) | Uživatel |
| APPROVED | UPDATED | Re-úprava CZ překladu | Uživatel |
| AI_TRANSLATED / UPDATED | APPROVED | Schválení překladu | Backend (mechanismus není ze zdroje frontendu patrný) |

> **Verze: RQU004** – opraveno: editační dialog [G007](03_gui_model.md#gui-G007) neobsahuje přepínač „Schválit překlad" – přechod do stavu APPROVED řídí backend. Odstraněny přechody navázané na neexistující UI akci.
