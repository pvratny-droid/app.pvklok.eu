# Sekvenční diagramy

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC025](#sd-UC025) | Vytvořit novou misi | [sd_uc025.puml](diagrams/sd_uc025.puml) |
| [SD-UC028](#sd-UC028) | Zneplatnit misi | [sd_uc028.puml](diagrams/sd_uc028.puml) |
| [SD-UC030](#sd-UC030) | Plánovat interakce mise | [sd_uc030.puml](diagrams/sd_uc030.puml) |
| [SD-UC031](#sd-UC031) | Spravovat C2 vazby | [sd_uc031.puml](diagrams/sd_uc031.puml) |

---

<a id="sd-UC025"></a>
## SD-UC025 – Vytvořit novou misi

Sekvenční diagram pro [UC025](02_use_case_model.md#uc-UC025).

```plantuml file=diagrams/sd_uc025.puml
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

<a id="sd-UC028"></a>
## SD-UC028 – Zneplatnit misi

Sekvenční diagram pro [UC028](02_use_case_model.md#uc-UC028).

```plantuml file=diagrams/sd_uc028.puml
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

<a id="sd-UC030"></a>
## SD-UC030 – Plánovat interakce mise

Sekvenční diagram pro [UC030](02_use_case_model.md#uc-UC030). Plánovací grid je stromový (IER → MV → TIN).

```plantuml file=diagrams/sd_uc030.puml
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

<a id="sd-UC031"></a>
## SD-UC031 – Spravovat C2 vazby

Sekvenční diagram pro [UC031](02_use_case_model.md#uc-UC031).

```plantuml file=diagrams/sd_uc031.puml
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
