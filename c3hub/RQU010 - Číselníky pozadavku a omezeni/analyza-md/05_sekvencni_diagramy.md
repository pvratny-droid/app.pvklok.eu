# Sekvenční diagramy

Sekvenční diagramy pokrývají klíčové UC s netriviální logikou (deaktivace / výmaz s detekcí použití v MV, zobrazení MV používajících položku). Primárním zdrojem je **PlantUML** (`diagrams/sd_uc*.puml`, renderovaný ve vieweru inline); Mermaid je zabalený do `<details>` jako záložní zdroj pro čtení v Markdownu.

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC068](#sd-UC068) | UC068 – Aktivovat zrušenou položku | [sd_uc068.puml](diagrams/sd_uc068.puml) |
| [SD-UC069](#sd-UC069) | UC069 + UC070 – Zrušit položku (deaktivace s alternativou trvalého výmazu) | [sd_uc069.puml](diagrams/sd_uc069.puml) |
| [SD-UC071](#sd-UC071) | UC071 – Zobrazit MV používající položku | [sd_uc071.puml](diagrams/sd_uc071.puml) |

---

<a id="sd-UC068"></a>
## SD-UC068 – Aktivovat zrušenou položku

Sekvenční diagram pro [UC068](02_use_case_model.md#uc-UC068). Triviální PATCH operace; jediný diagram pro úplnost dokumentace lifecyklu.

```plantuml file=diagrams/sd_uc068.puml
```

<details>
<summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant T as «Form grid area»<br/>Tabulka prvků (G059)
    participant S as Server (Backend)

    U->>T: 1. Klik na ikonu „Aktivovat" u zrušené položky
    T->>S: 2. PATCH /api/elements/{id} { active: true }
    S-->>T: 3. 200 OK + aktualizovaný ElementDto
    T->>T: 4. Invalidate query cache
    T-->>U: 5. Řádek získá vizuál „aktivní" (sloupec Aktivní = Ano)
```

</details>

---

<a id="sd-UC069"></a>
## SD-UC069 – Zrušit položku (deaktivace s alternativou trvalého výmazu)

Sekvenční diagram pro [UC069](02_use_case_model.md#uc-UC069) + [UC070](02_use_case_model.md#uc-UC070). Klíčový diagram analýzy – pokrývá detekci použití v MV a větvení na deaktivaci × trvalý výmaz.

```plantuml file=diagrams/sd_uc069.puml
```

<details>
<summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant T as «Form grid area»<br/>Tabulka prvků (G059)
    participant D as «Form modal»<br/>Dialog zrušení (G096)
    participant S as Server (Backend)

    U->>T: 1. Klik na ikonu „Zrušit" u aktivní položky
    T->>S: 2. GET /api/elements/{id}/usage
    S-->>T: 3. { count: n, items: [...] }
    T->>D: 4. Otevři dialog s usageCount = n
    D-->>U: 5. Zobraz text + tlačítka

    alt usageCount > 0
        D-->>U: Jediné tlačítko „Deaktivovat"
        U->>D: 6a. Klik „Deaktivovat"
        D->>S: 7a. PATCH /api/elements/{id} { active: false }
        S-->>D: 8a. 200 OK
    else usageCount = 0
        D-->>U: Tlačítka „Trvale smazat" / „Deaktivovat"
        alt Uživatel volí trvalý výmaz
            U->>D: 6b. Klik „Trvale smazat"
            D->>S: 7b. DELETE /api/elements/{id}
            S->>S: re-check usageCount = 0 (transakce)
            S-->>D: 8b. 204 No Content
        else Uživatel volí deaktivaci
            U->>D: 6c. Klik „Deaktivovat"
            D->>S: 7c. PATCH /api/elements/{id} { active: false }
            S-->>D: 8c. 200 OK
        end
    end

    D->>T: 9. Invalidate query cache + zavři dialog
    T-->>U: 10. Tabulka přefiltrovaná (řádek greyed nebo úplně skrytý)

    opt Uživatel klikne „Zrušit" v dialogu
        U->>D: Klik „Zrušit"
        D-->>T: Zavři dialog bez akce
    end
```

</details>

---

<a id="sd-UC071"></a>
## SD-UC071 – Zobrazit MV používající položku

Sekvenční diagram pro [UC071](02_use_case_model.md#uc-UC071). Reuse zobecněného `CapabilityCommandPostsDialog` ([G097](03_gui_model.md#gui-G097), modified).

```plantuml file=diagrams/sd_uc071.puml
```

<details>
<summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant T as «Form grid area»<br/>Tabulka prvků (G059)
    participant D as «Form modal»<br/>Dialog MV (G097)
    participant S as Server (Backend)

    U->>T: 1. Klik na ikonu „Zobrazit odpovídající MV"
    T->>D: 2. Otevři dialog (předej id + stereotype)
    D->>S: 3. GET /api/elements/{id}/command-posts/usage
    S-->>D: 4. [{ name, type, organization }, ...]
    D-->>U: 5. Zobraz tabulku MV s parametrizovaným titulkem

    opt Uživatel klikne na řádek MV
        U->>D: 6. Klik na řádek
        D->>D: 7. Zavři dialog
        D-->>U: 8. Naviguj na /web/command-posts/{id}
    end
```

</details>
