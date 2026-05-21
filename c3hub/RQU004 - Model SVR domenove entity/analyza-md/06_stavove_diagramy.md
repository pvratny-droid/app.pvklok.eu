# Stavové diagramy

| Diagram | Třída LM | PlantUML |
|---|---|---|
| [SM-L039](#sm-L039) | Patch Request | [sm_l039.puml](diagrams/sm_l039.puml) |
| [SM-L021](#sm-L021) | Element modelu (stav překladu) | [sm_l021.puml](diagrams/sm_l021.puml) |

---

<a id="sm-L039"></a>
## SM-L039 – Patch Request workflow

Životní cyklus [Patch Requestu (L039)](04_logicky_model.md#lm-L039). Source: enum `RelationshipPatchRequestState` (`/coco/web-app/src/client/model/ModelApiClient.tsx:150`).

```plantuml file=diagrams/sm_l039.puml
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

<a id="sm-L021"></a>
## SM-L021 – Stav překladu prvku modelu

Životní cyklus atributu `translationStatus` na třídě [Element modelu (L021)](04_logicky_model.md#lm-L021). Source: enum `ElementTranslationStatus`.

```plantuml file=diagrams/sm_l021.puml
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

> **Verze: RQU004** – opraveno: editační dialog [G062](03_gui_model.md#gui-G062) neobsahuje přepínač „Schválit překlad" – přechod do stavu APPROVED řídí backend. Odstraněny přechody navázané na neexistující UI akci.
