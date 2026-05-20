# Sekvenční diagramy

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC003](#sd-UC003) | Vytvořit novinku | [sd_uc003.puml](diagrams/sd_uc003.puml) |

---

<a id="sd-UC003"></a>
## SD-UC003 – Vytvořit novinku

Sekvenční diagram pro [UC003](02_use_case_model.md#uc-UC003). Ostatní UC (zobrazení panelu, označení přečtení, úprava/smazání novinky, stažení dokumentu) jsou triviální CRUD/akce a samostatný sekvenční diagram nevyžadují.

```plantuml file=diagrams/sd_uc003.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor S as Správce novinek
    participant A as AdministraceNovinek
    participant D as VytvořeníNovinky
    participant Sv as Server

    S->>A: 1. Otevře /web/admin/news
    A->>Sv: 2. getNewsResourceAcl()
    Sv-->>A: 3. NewsResourceAclDto (canAccess, canCreate)
    A->>Sv: 4. findAll()
    Sv-->>A: 5. NewsDto[]
    A-->>S: 6. Grid novinek
    S->>A: 7. Klikne + Vytvořit
    A->>D: 8. Otevře dialog
    S->>D: 9. Vyplní Typ, Lokaci, Obsah
    S->>D: 10. Klikne VYTVOŘIT
    D->>Sv: 11. createNews(NewsUpdateDto)
    alt OK
        Sv-->>D: 12. 201 + news ID
        D-->>A: 13. invalidate + zavřít dialog
        A-->>S: 14. Grid obsahuje novou novinku
    else Chyba
        Sv-->>D: 12a. 4xx/5xx
        D-->>S: 13a. Snackbar „Došlo k neočekávané chybě"
    end
```

</details>
