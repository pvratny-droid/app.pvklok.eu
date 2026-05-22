# Sekvenční diagramy

Sekvenční diagramy jsou zpracovány pro klíčové Use Case s komplexnější logikou (podání žádosti,
posouzení, delegace, změna žádosti). Každý diagram je dostupný jako PlantUML soubor v adresáři
`diagrams/`; Mermaid varianta je přiložena jako záložní zdroj.

| Diagram | UC | PlantUML |
|---|---|---|
| [SD-UC0001](#DSZEZ-sd-UC0001) | Podat žádost o zkoušku | [sd_uc0001.puml](diagrams/sd_uc0001.puml) |
| [SD-UC0003](#DSZEZ-sd-UC0003) | Rychle posoudit žádost | [sd_uc0003.puml](diagrams/sd_uc0003.puml) |
| [SD-UC0004](#DSZEZ-sd-UC0004) | Věcně posoudit žádost | [sd_uc0004.puml](diagrams/sd_uc0004.puml) |
| [SD-UC0005](#DSZEZ-sd-UC0005) | Delegovat posouzení na podpůrný útvar | [sd_uc0005.puml](diagrams/sd_uc0005.puml) |
| [SD-UC0008](#DSZEZ-sd-UC0008) | Změnit žádost o zkoušku | [sd_uc0008.puml](diagrams/sd_uc0008.puml) |

---

<a id="DSZEZ-sd-UC0001"></a>
## UC0001 – Podat žádost o zkoušku

Sekvenční diagram pro [UC0001 – Podat žádost o zkoušku](02_use_case_model.md#~DSZEZ-uc-UC0001).

```plantuml file=diagrams/sd_uc0001.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor Z as Žadatel
    participant P as «Form»<br/>Portál žadatele
    participant V as «Form modal»<br/>Výběr typu zkoušky
    participant F as «Form»<br/>Žádost o zkoušku
    participant A as Aplikace DSZEZ

    Z->>P: 1. Nová žádost
    P->>V: 2. Zobrazí dialog výběru typu
    Z->>V: 3. Zvolí typ zkoušky a potvrdí
    V->>F: 4. Připraví formulář dle typu
    Z->>F: 5.–9. Vyplní údaje, přílohy, souhlas
    Z->>F: 10. Podat žádost
    F->>A: 11. Kontrola vyplnění a formátu

    alt Žádost je vyplněna správně
        A->>A: 12. Určí schvalovatele a parametry workflow
        A->>A: 13. Založí záznam a spustí workflow
        A->>A: 14. Notifikuje schvalovatele (UC0007)
        A-->>P: 15. Potvrzení o podání
    else 11a. Žádost obsahuje chyby
        A-->>F: Chybová hláška, zvýraznění polí
    end

    opt 9a. Nevyplněná nepovinná pole
        A-->>F: Pop-up upozornění s doporučením doplnit
    end
```

</details>

---

<a id="DSZEZ-sd-UC0003"></a>
## UC0003 – Rychle posoudit žádost

Sekvenční diagram pro [UC0003 – Rychle posoudit žádost](02_use_case_model.md#~DSZEZ-uc-UC0003).

```plantuml file=diagrams/sd_uc0003.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor S as Schvalovatel
    participant PP as «Form grid area»<br/>Přehled žádostí ke schválení
    participant D as «Form»<br/>Detail žádosti
    participant SH as «Form area»<br/>Souhrn žádosti
    participant R as «Form modal»<br/>Rozhodnutí o žádosti

    S->>PP: 1. Otevře žádost ke schválení
    PP->>D: 2. Zobrazí detail žádosti
    D->>SH: 2. Zobrazí souhrn žádosti
    S->>SH: 3. Zkontroluje popis součinnosti ČEPS

    alt Žádost je srozumitelná
        S->>D: 4.–5. Pokračuje věcným posouzením (UC0004)
    else 4a. Nedostatek / nesrozumitelnost informací
        S->>R: Zamítne žádost a zapíše důvod
    end
```

</details>

---

<a id="DSZEZ-sd-UC0004"></a>
## UC0004 – Věcně posoudit žádost

Sekvenční diagram pro [UC0004 – Věcně posoudit žádost](02_use_case_model.md#~DSZEZ-uc-UC0004).

```plantuml file=diagrams/sd_uc0004.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor S as Schvalovatel
    participant D as «Form»<br/>Detail žádosti
    participant R as «Form modal»<br/>Rozhodnutí o žádosti
    participant A as Aplikace DSZEZ
    actor Z as Žadatel

    S->>D: 1. Posoudí proveditelnost zkoušky

    opt 2a. Potřebuje vyjádření jiného útvaru
        S->>D: Deleguje posouzení (UC0005)
    end

    S->>D: 3.–4. Rozhodnout o žádosti
    D->>R: 5. Zobrazí dialog rozhodnutí

    alt Schváleno
        S->>R: 6. Schválí, volitelně odůvodnění a podmínky
        R->>A: 7. Zaznamená schválení části workflow
        A->>A: 8. Vyhodnotí stav workflow
        A-->>Z: 9. Notifikuje žadatele a schvalovatele (UC0007)
    else 6a. Zamítnuto
        S->>R: Zamítne s povinným důvodem
        R->>A: Zamítne celou zkoušku
        A-->>Z: Notifikuje žadatele a schvalovatele (UC0007)
    end
```

</details>

---

<a id="DSZEZ-sd-UC0005"></a>
## UC0005 – Delegovat posouzení na podpůrný útvar

Sekvenční diagram pro [UC0005 – Delegovat posouzení na podpůrný útvar](02_use_case_model.md#~DSZEZ-uc-UC0005) včetně navazujícího vyjádření podpůrného útvaru ([UC0006](02_use_case_model.md#~DSZEZ-uc-UC0006)).

```plantuml file=diagrams/sd_uc0005.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor S as Schvalovatel
    participant D as «Form»<br/>Detail žádosti
    participant DL as «Form modal»<br/>Delegace na podpůrný útvar
    participant A as Aplikace DSZEZ
    actor PU as Podpůrný útvar
    participant K as «Form multi area»<br/>Komentáře a vyjádření

    S->>D: 1. Delegovat posouzení
    D->>DL: 2. Zobrazí dialog delegace
    S->>DL: 3.–5. Zvolí útvar, zapíše pokyn, nastaví lhůtu
    S->>DL: 6. Potvrdí delegaci
    DL->>A: 7. Zaznamená delegaci
    A-->>PU: 8. Notifikuje podpůrný útvar (UC0007)

    PU->>D: UC0006/1. Otevře žádost s pokynem
    PU->>K: UC0006/4. Zapíše vyjádření
    K->>A: UC0006/5. Uloží vyjádření
    A-->>S: UC0006/6. Notifikuje schvalovatele (UC0007)
```

</details>

---

<a id="DSZEZ-sd-UC0008"></a>
## UC0008 – Změnit žádost o zkoušku

Sekvenční diagram pro [UC0008 – Změnit žádost o zkoušku](02_use_case_model.md#~DSZEZ-uc-UC0008).

```plantuml file=diagrams/sd_uc0008.puml
```

<details><summary>Mermaid zdroj</summary>

```mermaid
sequenceDiagram
    actor Z as Žadatel
    participant PP as «Form grid area»<br/>Přehled mých žádostí
    participant F as «Form»<br/>Žádost o zkoušku
    participant A as Aplikace DSZEZ

    Z->>PP: 1. Otevře žádost a zvolí Upravit žádost
    PP->>F: 2. Zobrazí formulář s původními hodnotami
    Z->>F: 3. Provede změny v polích
    Z->>F: 4. Uložit změny
    F->>Z: 5. Upozornění na nevratnou operaci

    alt Žadatel potvrdí
        Z->>F: 6. Potvrdí upozornění
        F->>A: 7. Kontrola a určení schvalovatelů
        A->>A: 8. Zruší dosavadní workflow, založí nové
        A->>A: 9. Vyznačí změny pro schvalovatele
        A-->>A: 10. Notifikuje schvalovatele (UC0007)
    else 6a. Žadatel nepotvrdí
        F-->>PP: Žádost zůstává beze změny
    end

    opt 7a. Kontrola odhalí chyby
        A-->>F: Vrátí formulář k opravě
    end
```

</details>
