# Stavové diagramy

| Diagram | Třída LM | PlantUML |
|---|---|---|
| [SM-L002](#sm-L002) | Obsazení pozice na MV | [sm_l002.puml](diagrams/sm_l002.puml) |

---

<a id="sm-L002"></a>
## SM-L002 – Stav obsazení pozice na MV

Životní cyklus [Obsazení pozice na MV (L002)](04_logicky_model.md#lm-L002). Návrhový stavový diagram – RQU009 je chystaný požadavek.

```plantuml file=diagrams/sm_l002.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
stateDiagram-v2
    [*] --> Aktivní: obsazení pozice osobou
    Aktivní --> Historické: ukončení obsazení\n(platnostDo nastaveno)
    Historické --> [*]
    note right of Aktivní
      Na jedné pozici nejvýše
      jedno aktivní obsazení
    end note
```

</details>

### Stavová pravidla

| Z | Do | Akce | Podmínka |
|---|---|---|---|
| – | Aktivní | Obsazení pozice osobou | Pozice nemá jiné aktivní obsazení |
| Aktivní | Historické | Ukončení obsazení | Nastaveno `platnostDo` |

> Stejný princip (Aktivní → Historické) platí i pro [Zapojení osoby do mise (L003)](04_logicky_model.md#lm-L003).
