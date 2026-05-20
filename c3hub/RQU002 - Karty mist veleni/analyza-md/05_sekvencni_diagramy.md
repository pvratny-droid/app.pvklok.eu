# Sekvenční diagramy

> **Verze: RQU002** – endpointy přepsány na reálné z `/coco/web-app/src/client/post/CommandPostApiClient.tsx`. Doplněn SD-UC004 (Editovat specifikaci – 10 sekcí + GPS validace) a SD-UC006 (Editovat schopnosti – MCA tree + confirm dialog). Po splitu UC011 doplněny SD-UC011a (Přidat IER), SD-UC011b (Přidat IP – s lookupem IER) a SD-UC011c (Přidat FMN instrukci – s lookupem IER).

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC001](#sd-UC001) | Vyhledat MV | [sd_uc001.puml](diagrams/sd_uc001.puml) |
| [SD-UC003](#sd-UC003) | Otevřít detail karty MV | [sd_uc003.puml](diagrams/sd_uc003.puml) |
| [SD-UC004](#sd-UC004) | Editovat specifikaci MV | [sd_uc004.puml](diagrams/sd_uc004.puml) |
| [SD-UC005](#sd-UC005) | Spravovat strukturu velení | [sd_uc005.puml](diagrams/sd_uc005.puml) |
| [SD-UC006](#sd-UC006) | Editovat formulář schopností | [sd_uc006.puml](diagrams/sd_uc006.puml) |
| [SD-UC008](#sd-UC008) | Stáhnout export karty MV | [sd_uc008.puml](diagrams/sd_uc008.puml) |
| [SD-UC011a](#sd-UC011a) | Přidat IER do MV | [sd_uc011a.puml](diagrams/sd_uc011a.puml) |
| [SD-UC011b](#sd-UC011b) | Přidat IP do MV | [sd_uc011b.puml](diagrams/sd_uc011b.puml) |
| [SD-UC011c](#sd-UC011c) | Přidat FMN instrukci do MV | [sd_uc011c.puml](diagrams/sd_uc011c.puml) |

---

<a id="sd-UC001"></a>
## SD-UC001 – Vyhledat místo velení

Sekvenční diagram pro [UC001](02_use_case_model.md#uc-UC001).

```plantuml file=diagrams/sd_uc001.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant F as KartyMístVelení
    participant S as Server

    U->>F: 1. Otevře /web/command-posts
    F->>S: 2. findAllCommandPosts() = filter Stereotype.COMMAND_POST
    S-->>F: 3. CommandPostElementDto[]
    U->>F: 4. Zadá searchTerm do SearchFilter
    Note over F: 5. Klient-side filtrace name + description (case-insensitive)
    F-->>U: 6. Aktualizuje grid/tile
    alt Nic neodpovídá
        F-->>U: 6a. Prázdný stav
    end
```
</details>

---

<a id="sd-UC003"></a>
## SD-UC003 – Otevřít detail karty MV

Sekvenční diagram pro [UC003](02_use_case_model.md#uc-UC003).

```plantuml file=diagrams/sd_uc003.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant L as KartyMístVelení
    participant T as KartaMV
    participant D as DetailKartyMV
    participant S as Server

    U->>L: 1. Vidí grid karet
    L->>T: 2. Render karty (CocoCommandPostCard)
    U->>T: 3. Klikne ZOBRAZIT
    T->>D: 4. Navigace na /command-posts/{id}
    D->>S: 5. modelClient.findElementById(commandPostId)
    par Načítání paralelně
        D->>S: 5a. GET /command-posts/{id}/specification
    and
        D->>S: 5b. GET /command-posts/{id}/capability-spec
    and
        D->>S: 5c. GET /command-posts/{id}/position-definition
    and
        D->>S: 5d. POST /command-posts/interactions:search-assigned-iers
    and
        D->>S: 5e. POST /command-posts/interactions:search-procedural-instructions
    end
    alt MV existuje
        S-->>D: 6. ElementDto + 5 paralelních DTO
        D-->>U: 7. Render 4 sekcí (Specifikace, IER/IP, FMN, Ke stažení)
    else MV nenalezeno
        S-->>D: 6a. 404
        D-->>U: 7a. „Místo velení nenalezeno"
    end
```
</details>

---

<a id="sd-UC004"></a>
## SD-UC004 – Editovat specifikaci MV

Sekvenční diagram pro [UC004](02_use_case_model.md#uc-UC004).

```plantuml file=diagrams/sd_uc004.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant D as DetailKartyMV
    participant G as SpecifikaceMV
    participant S as Server

    U->>D: 1. Klikne UPRAVIT na dlaždici Specifikace
    D->>G: 2. Otevře dialog
    par Načítání katalogů a specifikace paralelně
        G->>S: 3a. GET /command-posts/{id}/specification
    and
        G->>S: 3b. GET /command-posts/types
    and
        G->>S: 3c. GET /command-posts/catalogs/joint-functions
    and
        G->>S: 3d. GET /command-posts/catalogs/combat-functions
    and
        G->>S: 3e. GET /command-posts/catalogs/levels
    and
        G->>S: 3f. GET /command-posts/catalogs/mobilities
    and
        G->>S: 3g. GET /command-posts/catalogs/security-protections
    and
        G->>S: 3h. GET /command-posts/catalogs/resiliences
    and
        G->>S: 3i. GET /command-posts/catalogs/self-sustainments
    and
        G->>S: 3j. GET /command-posts/catalogs/kinetic-protection-levels
    and
        G->>S: 3k. GET /command-posts/catalogs/mine-protection-levels
    and
        G->>S: 3l. GET /command-posts/catalogs/constraints
    and
        G->>S: 3m. GET /command-posts/catalogs/requirements
    end
    S-->>G: 4. CommandPostSpecificationDto + LOVs
    G-->>U: 5. Render dialogu s 10 sekcemi
    U->>G: 6. Upraví pole (10 sekcí: MV, Podřízená MV, Funkce/Úroveň, Kontinuita, Mobilita, Balist.ochrana, Zabezp.ochrany, Omezení/Požadavky, Lokace)
    U->>G: 7. Klikne ULOŽIT
    Note over G: 8. Lokální validate(): párovost GPS, požadovaná pole
    alt Validace OK
        G->>S: 9. PUT /command-posts/{id}/specification (CommandPostSpecificationUpdateDto)
        alt OK
            S-->>G: 10. 200
            G-->>U: 11. Snackbar „Specifikace uložena"
            G-->>D: 12. Zavře dialog, refetch
        else Chyba
            S-->>G: 10a. 4xx/5xx
            G-->>U: 11a. Snackbar „Došlo k neočekávané chybě"
        end
    else Validace selhala
        G-->>U: 9a. Inline chyba (např. „Šířka je povinná, pokud je zadána délka")
    end
```
</details>

---

<a id="sd-UC005"></a>
## SD-UC005 – Spravovat strukturu velení

Sekvenční diagram pro [UC005](02_use_case_model.md#uc-UC005).

```plantuml file=diagrams/sd_uc005.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant D as DetailKartyMV
    participant M as StrukturuVelení
    participant G as PoziceMV
    participant P as PoziceDialog
    participant S as Server

    U->>D: 1. Klikne UPRAVIT na dlaždici Strukturu velení
    D->>M: 2. Otevře dialog
    par
        M->>S: 3a. GET /command-posts/{id}/position-definition
    and
        M->>S: 3b. GET /command-posts/{id}/assigned-roles
    and
        M->>S: 3c. GET /command-posts/{id}/assigned-roles-without-position
    and
        M->>S: 3d. GET /roles
    end
    S-->>M: 4. CommandPostPositionDefinitionDto + 3 grafy rolí
    M-->>U: 5. Render dialogu (strom pozic + rozpad H)
    alt Přidá pozici
        U->>M: 6a. Klikne + Přidat pozici
        M->>P: 7a. Otevře CommandPositionCreateDialog
        U->>P: 8a. Vyplní název, osobu, zvolí role
        P->>P: 9a. validate (jedinečnost názvu)
        P-->>M: 10a. Pozice + role
    else Upraví pozici
        U->>G: 6b. Klikne Upravit v gridu
        G->>P: 7b. Otevře dialog s předvyplněním
    else Smaže pozici
        U->>G: 6c. Klikne Smazat
        G-->>U: 7c. Potvrzení (pokud má podpozice/role)
    end
    U->>M: 11. Upravuje rozpad (multi-tag breakdowns)
    U->>M: 12. Klikne ULOŽIT
    M->>S: 13. POST /command-posts/{id}/position-definition (positions[], breakdowns[])
    alt OK
        S-->>M: 14. 200
        M-->>D: 15. Zavře dialog, snackbar success
    else Validace selže
        S-->>M: 14a. 4xx
        M-->>U: 15a. Inline chyba
    end
```
</details>

---

<a id="sd-UC006"></a>
## SD-UC006 – Editovat formulář schopností

Sekvenční diagram pro [UC006](02_use_case_model.md#uc-UC006).

```plantuml file=diagrams/sd_uc006.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant D as DetailKartyMV
    participant F as FormulářSchopností
    participant G as MCAGrid
    participant S as Server

    U->>D: 1. Klikne UPRAVIT na dlaždici Formulář schopností
    D->>F: 2. Otevře dialog
    par
        F->>S: 3a. GET /command-posts/{id}/capability-spec
    and
        F->>S: 3b. GET /mission/mission-types (RQU003)
    end
    S-->>F: 4. CommandPostCapabilitySpecDto (mcaCapabilities + missionTypes) + LOV druhů misí
    F-->>U: 5. Render: Druhy misí (multi-select) + tree grid MCA schopností
    U->>F: 6. Zvolí druhy misí (povinné)
    U->>G: 7. Rozbalí MCA schopnost, zaškrtne subkategorie v "Podporováno"
    U->>F: 8. Klikne ULOŽIT
    alt Všechny schopnosti mají subkategorie
        F->>S: 9. PUT /command-posts/{id}/capability-spec (missionTypeIds, mcaCapabilitySpecUpdates[])
        S-->>F: 10. 200
        F-->>D: 11. Zavře dialog, refetch
    else Některá schopnost má prázdné subkategorie
        F-->>U: 9a. ConfirmationDialog "Některé schopnosti nemají zvoleno »Podporováno« - nedojde k jejich uložení"
        alt Potvrzeno
            U->>F: 10a. Klikne "Přesto zavřít"
            F->>S: 11a. PUT /command-posts/{id}/capability-spec
        else Zrušeno
            U->>F: 10b. Klikne "Zpět k úpravám"
        end
    end
```
</details>

---

<a id="sd-UC008"></a>
## SD-UC008 – Stáhnout export karty MV

Sekvenční diagram pro [UC008](02_use_case_model.md#uc-UC008).

```plantuml file=diagrams/sd_uc008.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant D as DetailKartyMV
    participant T as DlaždiceKeStažení
    participant O as MožnostiDialog
    participant S as Server
    participant Gen as Generátor

    U->>D: 1. Skroluje na sekci „Karty MV ke stažení"
    D->>T: 2. Render dlaždic (Základní, Rozšířená, CIS matice)
    U->>T: 3. Klikne STÁHNOUT PDF / STÁHNOUT XLSX
    T->>O: 4. Otevře dialog možností (jazyk, varianta, klasifikace)
    U->>O: 5. Zvolí možnosti, klikne Potvrdit
    alt Karta velení (BASIC / COMPLETE)
        O->>S: 6a. POST /command-posts/{id}:generate-command-post-report (CommandPostReportOptionsDto)
        S->>Gen: 7a. Generuje PDF report
        Gen-->>S: 8a. PDF blob
        S-->>O: 9a. HTTP 200 + Blob (responseType blob)
        O-->>U: 10a. FileUtils.download(`{id}-Report.pdf`)
    else CIS matice (XLSX)
        O->>S: 6b. POST /command-posts/{id}:generate-cis-matrix (CisMatrixReportOptionsDto)
        S->>Gen: 7b. Generuje XLSX
        Gen-->>S: 8b. XLSX blob
        S-->>O: 9b. HTTP 200 + Blob
        O-->>U: 10b. FileUtils.download(`{id}-CIS-MATRIX.xlsx`)
    end
    alt Selže
        S-->>O: 9c. 4xx/5xx
        O-->>U: 10c. Snackbar „Došlo k neočekávané chybě"
    end
```
</details>

---

<a id="sd-UC011a"></a>
## SD-UC011a – Přidat IER do MV

Sekvenční diagram pro [UC011a](02_use_case_model.md#uc-UC011a).

```plantuml file=diagrams/sd_uc011a.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant Sec as InformačníToky
    participant Sel as VýběrIER
    participant Dlg as InterakceMV
    participant S as Server

    U->>Sec: 1. Klikne + PŘIDAT PODLE IER
    Sec->>Sel: 2. Otevře dialog výběru IER
    Sel->>S: 2a. Načte IER z modelu SVŘ (vyloučí přiřazené)
    S-->>Sel: 2b. Seznam dostupných IER
    alt Žádné nepřiřazené IER (A-UC011a-1)
        Sel-->>U: Info „Všechny IER jsou již přiřazeny"
    else Existují dostupné IER
        U->>Sel: 3. Zvolí IER, potvrdí
        Sel->>Dlg: 4. Otevře Interakce MV (isIer=true, fetchInteractions=true)
        Note over Dlg: 4a. Render strom IER → TIN (2 úrovně)
        U->>Dlg: 5. Nastaví Req / Konzument / Poskytovatel
        U->>Dlg: 6. Klikne ULOŽIT
        Dlg->>S: 6a. PATCH /command-posts/{id}/interactions
        S-->>Dlg: 6b. HTTP 200
        Dlg-->>U: 6c. Zavře dialog, aktualizuje detail
        alt Selže
            S-->>Dlg: 6d. 4xx/5xx
            Dlg-->>U: 6e. Snackbar „Došlo k neočekávané chybě"
        end
    end
```
</details>

---

<a id="sd-UC011b"></a>
## SD-UC011b – Přidat IP do MV

Sekvenční diagram pro [UC011b](02_use_case_model.md#uc-UC011b).

```plantuml file=diagrams/sd_uc011b.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant Sec as InformačníToky
    participant Sel as VýběrIP
    participant Dlg as InterakceMV
    participant S as Server

    U->>Sec: 1. Klikne + PŘIDAT PODLE IP
    Sec->>Sel: 2. Otevře dialog výběru IP
    Sel->>S: 2a. Načte IP z modelu SVŘ
    S-->>Sel: 2b. Seznam IP
    U->>Sel: 3. Zvolí IP, potvrdí
    Sel->>S: 4. POST /model/information-products/{ipId}:search-information-exchange-requirements
    S-->>Sel: 4a. Seznam souvisejících IER
    alt Pro IP nebyly nalezeny IER (A-UC011b-1)
        Sel-->>U: Info snackbar „Pro vybrané IP nebyly nalezeny žádné IER"
    else IER nalezeny
        Sel->>Dlg: 5. Otevře Interakce MV (isIer=true, showAlsoUnassigned=true, initExpandDataGridTree=true)
        Note over Dlg: 5a. Render IER-rooted strom (IER → TIN; filtry BA/BP a IP předzapnuté)
        U->>Dlg: 6. Nastaví Req / Konzument / Poskytovatel (IER a TIN řádky)
        U->>Dlg: 7. Klikne ULOŽIT
        Dlg->>S: 7a. PATCH /command-posts/{id}/interactions
        S-->>Dlg: 7b. HTTP 200
        Dlg-->>U: 7c. Zavře dialog, aktualizuje detail
    end
```
</details>

---

<a id="sd-UC011c"></a>
## SD-UC011c – Přidat FMN instrukci do MV

Sekvenční diagram pro [UC011c](02_use_case_model.md#uc-UC011c).

```plantuml file=diagrams/sd_uc011c.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor U as Uživatel
    participant Sec as FMNInstrukce
    participant Sel as VýběrProcInstrukce
    participant Dlg as InterakceMV
    participant S as Server

    U->>Sec: 1. Klikne + PŘIDAT PODLE FMN INSTRUKCE
    Sec->>Sel: 2. Otevře dialog výběru procedurální instrukce
    Sel->>S: 2a. Načte FMN procedurální instrukce
    S-->>Sel: 2b. Seznam instrukcí
    U->>Sel: 3. Zvolí FMN instrukci, potvrdí
    Sel->>S: 4. POST /model/procedural-instructions/{piId}:iers
    S-->>Sel: 4a. Seznam IER navázaných na PI (1:N)
    alt Pro instrukci nebyly nalezeny IER (A-UC011c-1)
        Sel-->>U: Info snackbar „Pro vybranou instrukci nebyly nalezeny IER"
    else IER nalezeny
        Sel->>Dlg: 5. Otevře Interakce MV (isIer=true, showAlsoUnassigned=true)
        Note over Dlg: 5a. Render strom FMN → IER → TIN (3 úrovně)
        U->>Dlg: 6. Nastaví Req / Konzument / Poskytovatel
        U->>Dlg: 7. Klikne ULOŽIT
        Dlg->>S: 7a. PATCH /command-posts/{id}/interactions
        S-->>Dlg: 7b. HTTP 200
        Dlg-->>U: 7c. Zavře dialog, aktualizuje detail
    end
```
</details>
