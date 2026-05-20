# Sekvenční diagramy

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC002](#sd-UC002) | Vytvořit novou misi | [sd_uc002.puml](diagrams/sd_uc002.puml) |
| [SD-UC005](#sd-UC005) | Zneplatnit misi | [sd_uc005.puml](diagrams/sd_uc005.puml) |
| [SD-UC008](#sd-UC008) | Plánovat interakce mise | [sd_uc008.puml](diagrams/sd_uc008.puml) |
| [SD-UC009](#sd-UC009) | Spravovat C2 vazby | [sd_uc009.puml](diagrams/sd_uc009.puml) |

---

<a id="sd-UC002"></a>
## SD-UC002 – Vytvořit novou misi

Sekvenční diagram pro [UC002](02_use_case_model.md#uc-UC002).

```plantuml file=diagrams/sd_uc002.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant P as MisePage
    participant D as MiseVytvoření
    participant S as Server

    U->>P: 1. Klikne + Přidat
    P->>D: 2. Otevře dialog
    D->>S: 3a. findAllMissionTypes()
    D->>S: 3b. findAllCommandPosts()
    S-->>D: 4. MissionTypeDto[] + MV
    U->>D: 5. Vyplní Název, Vlastnické MV, Druhy mise, Popis
    U->>D: 6. Klikne VYTVOŘIT
    D->>D: 7. validate()
    alt Validace OK
        D->>S: 8. POST /missions (MissionCreateDto)
        S-->>D: 9. 201 + mission ID
        D-->>P: 10. invalidate + zavřít dialog
    else Chybí povinné pole
        D-->>U: 8a. Inline chyba
    end
```

</details>

---

<a id="sd-UC005"></a>
## SD-UC005 – Zneplatnit misi

Sekvenční diagram pro [UC005](02_use_case_model.md#uc-UC005).

```plantuml file=diagrams/sd_uc005.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant D as DetailMise
    participant K as ZneplatněníPotvrzení
    participant S as Server

    U->>D: 1. Klikne ZNEPLATNIT v patičce detailu\n(jen aktivní, canInvalidate)
    D->>K: 2. Otevře potvrzovací dialog
    U->>K: 3. Potvrdí
    K->>S: 4. POST /missions/{id}:invalidate
    S-->>K: 5. 200 (invalidated=true, invalidatedBy/At)
    K-->>D: 6. invalidate query, zavře detail
    Note over D: 7. Mise se přesune do panelu „Zneplatněné mise"
```

</details>

---

<a id="sd-UC008"></a>
## SD-UC008 – Plánovat interakce mise

Sekvenční diagram pro [UC008](02_use_case_model.md#uc-UC008). Plánovací grid je stromový (IER → MV → TIN).

```plantuml file=diagrams/sd_uc008.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant G as PlanningGrid
    participant I as VýběrIER
    participant K as KonfiguraceInterakcíMV
    participant S as Server

    Note over G: Detail mise, záložka Interakce, zvolené MV pohledu
    U->>G: 1. Klikne Přidat IER (toolbar)
    G->>I: 2. Otevře dialog Výběr IER
    U->>I: 3. Vybere IER, potvrdí PŘIDAT
    I-->>G: 4. IER jako kořenové uzly stromu
    U->>G: 5. Na IER uzlu zvolí Přidat interakce MV
    G->>K: 6. Otevře dialog Konfigurace interakcí MV
    U->>K: 7. Zvolí cílové MV, zaškrtá role + PACE u TIN
    U->>K: 8. Klikne ULOŽIT
    K-->>G: 9. Konfigurace interakcí
    G->>S: 10. Diff – POST přibylých, DELETE odebraných interakcí
    S-->>G: 11. 200
    alt Smazat interakce (IER nebo MV uzel)
        U->>G: 12a. Řádková akce Smazat + potvrzení
        G->>S: 13a. DELETE /missions/{id}/interactions/{interactionId}
    end
```

</details>

---

<a id="sd-UC009"></a>
## SD-UC009 – Spravovat C2 vazby

Sekvenční diagram pro [UC009](02_use_case_model.md#uc-UC009).

```plantuml file=diagrams/sd_uc009.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant P as C2Panel
    participant C as C2VazbaVytvoření
    participant S as Server

    Note over P: Detail mise, záložka Velení a řízení, zvolené MV pohledu
    P->>S: 1. findAllC2Relationships(missionId)
    S-->>P: 2. C2RelationshipDto[]
    P-->>U: 3. Dva gridy: Nadřízená MV / Podřízená MV
    alt Přidat vazbu
        U->>P: 4a. Klikne + nad gridem
        P->>C: 5a. Otevře dialog (směr dle gridu)
        U->>C: 6a. Zvolí protější MV (multi) a Typ vazby
        U->>C: 7a. Klikne VYTVOŘIT
        C->>S: 8a. POST C2 vazba – jedna na každé vybrané MV
    else Smazat vazbu
        U->>P: 4b. Řádková akce Smazat + potvrzení
        P->>S: 5b. DELETE C2 vazba
    end
    S-->>P: 9. 200 + invalidate
```

</details>
