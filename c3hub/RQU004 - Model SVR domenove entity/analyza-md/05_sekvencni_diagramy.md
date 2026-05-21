# Sekvenční diagramy

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC035](#sd-UC035) | Otevřít přehled prvků stereotypu | [sd_uc035.puml](diagrams/sd_uc035.puml) |
| [SD-UC038](#sd-UC038) | Vytvořit nový prvek | [sd_uc038.puml](diagrams/sd_uc038.puml) |
| [SD-UC040](#sd-UC040) | Upravit překlady | [sd_uc040.puml](diagrams/sd_uc040.puml) |
| [SD-UC041](#sd-UC041) | Patch Request – návrh změny vztahů | [sd_uc041.puml](diagrams/sd_uc041.puml) |
| [SD-UC043](#sd-UC043) | Rozhodnout o patch requestu | [sd_uc043.puml](diagrams/sd_uc043.puml) |

---

<a id="sd-UC035"></a>
## SD-UC035 – Otevřít přehled prvků stereotypu

Sekvenční diagram pro [UC035](02_use_case_model.md#uc-UC035).

```plantuml file=diagrams/sd_uc035.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant M as ModelPage
    participant E as ElementsPage
    participant S as Server

    U->>M: 1. Otevře /web/model
    U->>M: 2. Klikne dlaždici stereotypu (např. MCA)
    M->>E: 3. Navigace /web/model/MCA_CAPABILITY
    E->>S: 4. POST /model/elements:search\n{stereotypes: ['MCA_CAPABILITY']}
    S-->>E: 5. ElementDto[]
    E-->>U: 6. Render tabulky (Kód, Název EN/CZ, Stav překladu, akce)
```

</details>

---

<a id="sd-UC038"></a>
## SD-UC038 – Vytvořit nový prvek

Sekvenční diagram pro [UC038](02_use_case_model.md#uc-UC038). Vytvoření prvku probíhá přes Patch Request workflow.

```plantuml file=diagrams/sd_uc038.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant E as ElementsPage
    participant D as CreateElementDialog
    participant S as Server

    U->>E: 1. Klikne + Přidat
    E->>D: 2. Otevře dialog Vytvoření prvku
    U->>D: 3. Vyplní Název EN, případně Název CZ, Popis, Kód země (CIS)
    U->>D: 4. (Volitelně) přidá vztahy nového prvku
    U->>D: 5. Klikne VYTVOŘIT
    D->>S: 6. POST /model/relationships/patch-requests\n(elementsToCreate = nový prvek)
    alt OK
        S-->>D: 7. 201 + ID patch requestu (stav REQUESTED)
        D-->>E: 8. Snackbar „Data uložena" + close dialog
    else Chyba
        S-->>D: 7a. 4xx/5xx
        D-->>U: 8a. Snackbar „Došlo k neočekávané chybě"
    end
```

</details>

---

<a id="sd-UC040"></a>
## SD-UC040 – Upravit překlady

Sekvenční diagram pro [UC040](02_use_case_model.md#uc-UC040).

```plantuml file=diagrams/sd_uc040.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant T as ElementsTable
    participant D as ElementDialog
    participant S as Server

    U->>T: 1. Klikne Translate ikona v řádku (nebo dvojklik)
    T->>D: 2. Otevře ElementDialog
    D-->>U: 3. Render polí (Kód/Typ/Stereotyp/Stav/Název EN/Popis EN read-only, Název CZ + Popis CZ edit)
    U->>D: 4. Upraví Název CZ / Popis CZ
    U->>D: 5. Klikne ULOŽIT
    D->>S: 6. POST /model/elements/{id}:update-translations\n{nameCz, descriptionCz}
    S-->>D: 7. 200 (stav překladu nastaví backend)
    D-->>T: 8. Snackbar „Data uložena" + invalidateQuery + close dialog
```

</details>

---

<a id="sd-UC041"></a>
## SD-UC041 – Patch Request – návrh změny vztahů

Sekvenční diagram pro [UC041](02_use_case_model.md#uc-UC041).

```plantuml file=diagrams/sd_uc041.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant T as ElementsTable
    participant R as RelationshipPatchRequestDialog
    participant C as CreateRelationshipDialog
    participant G as SummaryDialog
    participant S as Server

    U->>T: 1. Klikne Share ikona
    T->>R: 2. Otevře dialog Vztahy prvku
    R->>S: 3. GET /model/elements/{id}/relationships
    S-->>R: 4. RelationshipDetailDto[]
    R-->>U: 5. Render záložkového panelu vztahů
    alt Přidat vztah
        U->>R: 6a. Klikne + na aktivní záložce
        R->>C: 7a. Otevře CreateRelationshipDialog
        U->>C: 8a. Zvolí existující prvek / vytvoří nový
        C-->>R: 9a. Vztah přidán do toAdd (zeleně)
    else Odstranit vztah
        U->>R: 6b. Klikne odstranit u řádku
        R-->>U: 7b. Řádek označen toDelete (červeně)
    end
    U->>R: 10. Klikne ODESLAT KE SCHVÁLENÍ
    R->>G: 11. Otevře souhrnný dialog plánovaných změn
    U->>G: 12. Potvrdí ODESLAT KE SCHVÁLENÍ
    G->>S: 13. POST /model/relationships/patch-requests\n(toAdd, toDelete, elementsToCreate, referentialElementId)
    S-->>G: 14. 201 + ID patch requestu (stav REQUESTED)
    G-->>U: 15. Snackbar „Data uložena" + zavře dialogy
```

</details>

---

<a id="sd-UC043"></a>
## SD-UC043 – Rozhodnout o patch requestu

Sekvenční diagram pro [UC043](02_use_case_model.md#uc-UC043).

```plantuml file=diagrams/sd_uc043.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor S as Schvalovatel
    participant P as PatchRequestsPage
    participant D as PatchRequestDetailDialog
    participant Sv as Server

    S->>P: 1. Otevře /web/model/patch-requests
    P->>Sv: 2. GET /model/relationships/patch-requests (administrátor)
    Sv-->>P: 3. RelationshipPatchRequestDto[]
    P-->>S: 4. Tabulka patch requestů (řazeno dle data sestupně)
    S->>P: 5. Klikne akci Detail u řádku (stav REQUESTED)
    P->>D: 6. Otevře detail
    D->>Sv: 7. Načte referenční prvek a jeho vztahy
    Sv-->>D: 8. ElementDto + RelationshipDetailDto[]
    D-->>S: 9. Render metadata + záložkový panel vztahů\n(přidání zeleně, odebrání červeně)
    opt Schvalovatel upraví obsah žádosti
        S->>D: 10a. Inline přidá / odebere vztahy v panelu
    end
    alt Potvrdit
        S->>D: 11. Klikne POTVRDIT
        D->>Sv: 12. POST .../patch-requests/{id}:approve (finalChanges)
        Sv-->>D: 13. 200 (změny aplikovány do modelu)
        D-->>P: 14. Snackbar „Data uložena" + invalidate + zavřít
        Note over P: 15. Stav → APPROVED, closedBy/closedAt vyplněny
    else Zamítnout
        S->>D: 11b. Klikne ZAMÍTNOUT
        D->>Sv: 12b. POST .../patch-requests/{id}:reject
        Sv-->>D: 13b. 200 (žádné změny v modelu)
        D-->>P: 14b. Snackbar „Data uložena" + invalidate + zavřít
        Note over P: 15b. Stav → REJECTED
    end
```

</details>
