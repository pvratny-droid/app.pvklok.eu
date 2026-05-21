# Stavové diagramy

| Diagram | Třída LM | PlantUML |
|---|---|---|
| [SM-L015](#sm-L015) | Mise (životní cyklus) | [sm_l015.puml](diagrams/sm_l015.puml) |

---

<a id="sm-L015"></a>
## SM-L015 – Životní cyklus mise

Životní cyklus [Mise (L015)](04_logicky_model.md#lm-L015). Source: atribut `invalidated` + endpointy `:invalidate`, `:restore` (`/coco/web-app/src/client/mission/MissionApiClient.tsx`).

> **Verze: RQU003** – z diagramu odstraněn terminální přechod „smazání". Endpoint `DELETE /missions/{id}` v API existuje, ale není v UI vystaven – mazání mise není dostupné.

```plantuml file=diagrams/sm_l015.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
stateDiagram-v2
    [*] --> Aktivní: vytvoření mise\n(POST /missions)
    Aktivní --> Zneplatněná: zneplatnění\n(:invalidate – canInvalidate)
    Zneplatněná --> Aktivní: obnovení\n(:restore – canRestore)
    note right of Zneplatněná
      Data se zachovají,
      eviduje se invalidatedBy/At
    end note
```

</details>

### Stavová pravidla

| Z | Do | Akce | Endpoint | ACL |
|---|---|---|---|---|
| – | Aktivní | Vytvoření mise | `POST /missions` | — |
| Aktivní | Zneplatněná | Zneplatnění | `POST /missions/{id}:invalidate` | `canInvalidate` |
| Zneplatněná | Aktivní | Obnovení | `POST /missions/{id}:restore` | `canRestore` |
