# Use Case model

> **Delta vůči RQU004:** Tato analýza eviduje jen UC, které RQU004 buď neposkytuje (lifecycle aktivní/zrušená – UC004–UC006), nebo modifikuje (UC001 otevření přehledu se vstupem z nového panelu Číselníky, UC002 / UC003 / UC007 rozšířené chování pro stereotypy REQ/CONSTR). UC pro vytvoření prvku a editaci překladů zůstávají dědictvím RQU004 a v RQU010 se nepřepisují.

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Otevřít přehled číselníku Požadavků nebo Omezení MV z Modelu SVŘ | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Vyhledat v seznamu položek číselníku | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC003 | Přepnout zobrazení zrušených položek | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC004 | Aktivovat zrušenou položku | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC005 | Zrušit položku (deaktivace) | [FR02](01_model_pozadavku.md#fr-FR02), [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC006 | Trvale smazat nepoužitou položku | [FR03](01_model_pozadavku.md#fr-FR03) | extend UC005 |
| UC007 | Zobrazit MV používající položku | [FR05](01_model_pozadavku.md#fr-FR05) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

```plantuml file=diagrams/uc_diagram.puml
```

---

<a id="uc-UC001"></a>
## UC001 – Otevřít přehled číselníku Požadavků nebo Omezení MV z Modelu SVŘ

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se z rozcestníku Modelu SVŘ dostane na seznam položek vybraného číselníku (Požadavky MV nebo Omezení MV). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je v modulu Model SVŘ (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel **„Číselníky"** (umístěný před panelem „Ostatní"). | [G001](03_gui_model.md#gui-G001) |
| 2 | Uživatel klikne tlačítko **ZOBRAZIT** na dlaždici **Požadavky MV** nebo **Omezení MV** (případně na dlaždici samotnou). | [G002](03_gui_model.md#gui-G002) |
| 3 | Systém naviguje na `/web/model/requirement` resp. `/web/model/constraint` a načte všechny aktivní položky daného stereotypu. | — |
| 4 | Systém zobrazí tabulku se sloupci Akce, Kód, Název EN, Název CZ, Aktivní a Identifikátor. Default jsou zobrazeny jen položky `active = true`. | [G003](03_gui_model.md#gui-G003), [G004](03_gui_model.md#gui-G004) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC001-1 | Panel „Číselníky" je vždy umístěn před panelem „Ostatní" v rozcestníku Modelu SVŘ. | 1 |
| P-UC001-2 | Pro stereotypy `REQUIREMENT` a `CONSTRAINT` systém **nezobrazí** tlačítka „Upravit vztahy", „Sousedství v grafu" a „Patch Request" (číselník nemá vztahy v ArchiMate metamodelu). | 4 |

**Verze: RQU010**

- Nové dlaždice **Požadavky MV** a **Omezení MV** v Modelu SVŘ; navigace na obecný přehled prvků stereotypu rozšířený o lifecycle (aktivní/zrušené).

**Koncové podmínky:** Uživatel vidí seznam aktivních položek vybraného číselníku.

---

<a id="uc-UC002"></a>
## UC002 – Vyhledat v seznamu položek číselníku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel rychle dohledá konkrétní položku číselníku napříč názvy CS / EN a popisy. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV (UC001).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne do vyhledávacího pole **„Vyhledat"** v hlavičce tabulky. | [G003](03_gui_model.md#gui-G003) |
| 2 | Uživatel zapíše hledaný výraz. | [G004](03_gui_model.md#gui-G004) |
| 3 | Systém klient-side filtruje řádky napříč `name`, `nameCz`, `description`, `descriptionCz`, `s5636Identifier`. | — |

**Koncové podmínky:** Tabulka zobrazuje jen řádky odpovídající filtru.

---

<a id="uc-UC003"></a>
## UC003 – Přepnout zobrazení zrušených položek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel chce vidět zrušené (deaktivované) položky, aby je mohl znovu aktivovat (UC004) nebo trvale smazat (UC006). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na toggle **„Zobrazit i zrušené"** v hlavičce přehledu. | [G003](03_gui_model.md#gui-G003) |
| 2 | Systém přenačte data se širším filtrem (`active=all`) a zobrazí v tabulce i řádky se `active = false`. | — |
| 3 | Zrušené řádky jsou vizuálně odlišené (greyed), v sloupci **Aktivní** mají označení Ne. | [G004](03_gui_model.md#gui-G004) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC003-1 | Toggle **„Zobrazit i zrušené"** je viditelný **jen** pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT). Pro ostatních 17 stereotypů z RQU004 (MCA, IER, Role, …) je skrytý. | 1 |

**Verze: RQU010**

- Nový toggle v hlavičce přehledu, nový sloupec **Aktivní** v tabulce a vizuální odlišení deaktivovaných řádků.

**Koncové podmínky:** Tabulka zobrazuje jak aktivní, tak deaktivované položky.

---

<a id="uc-UC004"></a>
## UC004 – Aktivovat zrušenou položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel obnoví dříve zrušenou položku tak, aby se znovu nabízela v editoru Specifikace MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Uživatel má zapnutý toggle „Zobrazit i zrušené" (UC003) a v tabulce vidí požadovanou zrušenou položku.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Aktivovat"** (toggle stav, viditelná u řádků se `active = false`). | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém volá `PATCH /api/elements/{id}` s payloadem `active = true`. | — |
| 3 | Systém invaliduje cache přehledu; řádek získá zpět standardní vizuál a v sloupci Aktivní hodnotu Ano. | [G004](03_gui_model.md#gui-G004) |

**Verze: RQU010**

- Nová řádková akce **Aktivovat** v tabulce prvků (viditelná jen pro stereotypy REQ/CONSTR a jen u zrušených řádků).

**Koncové podmínky:** Položka je aktivní a nabízí se v editoru Specifikace MV.

---

<a id="uc-UC005"></a>
## UC005 – Zrušit položku (deaktivace)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zruší (deaktivuje) položku tak, aby se přestala nabízet v editoru Specifikace MV, ale zůstala viditelná v historických MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02), [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Uživatel je v přehledu položek a vybraná položka je aktuálně aktivní.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Zrušit"** (toggle stav, viditelná u řádků se `active = true`). | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém volá `GET /api/elements/{id}/usage` a v odpovědi obdrží počet MV, které položku referují. | — |
| 3 | Systém otevře dialog potvrzení a zobrazí počet referujících MV. | [G005](03_gui_model.md#gui-G005) |
| 4 | Pokud `usage.count > 0`, dialog nabídne jediné tlačítko **Deaktivovat**. Uživatel ho stiskne. | [G005](03_gui_model.md#gui-G005) |
| 5 | Systém volá `PATCH /api/elements/{id}` s payloadem `active = false`, invaliduje cache a zavře dialog. | — |
| 6 | Položka je v tabulce vizuálně odlišená (greyed) a default skrytá (pokud uživatel nemá zapnutý toggle „Zobrazit i zrušené"). | [G004](03_gui_model.md#gui-G004) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | `usage.count = 0` | Dialog nabídne kromě **Deaktivovat** i tlačítko **Trvale smazat** → větvení do [UC006](#uc-UC006). |
| 4b | Uživatel klikne **Zrušit** v dialogu | Dialog se zavře bez akce; položka zůstane aktivní. |

**Verze: RQU010**

- Nová řádková akce **Zrušit** v tabulce prvků (viditelná jen pro stereotypy REQ/CONSTR a jen u aktivních řádků). Nový dialog potvrzení [G005](03_gui_model.md#gui-G005). Backend rozšířen o pole `active` v [ElementDto](04_logicky_model.md#lm-L001) a endpoint `GET /api/elements/{id}/usage`.

**Koncové podmínky:** Položka má `active = false`. Existující reference v historických Specifikacích MV zůstávají; nové Specifikace MV položku nenabízejí.

---

<a id="uc-UC006"></a>
## UC006 – Trvale smazat nepoužitou položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel trvale odstraní položku z DB, pokud ji nikde nereferuje žádná Specifikace MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |
| **Vztah** | extend [UC005](#uc-UC005) (větev pro `usage.count = 0`) |

**Vstupní podmínky:** Uživatel prochází scénář UC005 a backend vrátil `usage.count = 0`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Dialog potvrzení zobrazuje text *„Položka není použita v žádné Specifikaci MV. Můžete ji deaktivovat nebo trvale smazat."* a obě tlačítka **Trvale smazat** a **Deaktivovat**. | [G005](03_gui_model.md#gui-G005) |
| 2 | Uživatel klikne **Trvale smazat**. | [G005](03_gui_model.md#gui-G005) |
| 3 | Systém volá `DELETE /api/elements/{id}`, invaliduje cache a zavře dialog. | — |
| 4 | Řádek zmizí z tabulky úplně. | [G004](03_gui_model.md#gui-G004) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC006-1 | Trvalé smazání je nevratné. Backend před akcí znovu ověří `usage.count = 0` v rámci stejné transakce, aby vyloučil race condition. | 3 |

**Verze: RQU010**

- Nová akce **Trvale smazat** v dialogu potvrzení [G005](03_gui_model.md#gui-G005). Backend endpoint `DELETE /api/elements/{id}` s validační kontrolou `usage.count = 0`.

**Koncové podmínky:** Položka je z DB odstraněna; pořadové ID se nepřečísluje (auto-increment pokračuje od následujícího čísla).

---

<a id="uc-UC007"></a>
## UC007 – Zobrazit MV používající položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled, ve kterých MV je daná položka číselníku aktuálně referována. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR05](01_model_pozadavku.md#fr-FR05) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Zobrazit odpovídající MV"** (analogická existující ikoně „Relevantní MV" u MCA schopnosti). | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém volá `GET /api/elements/{id}/command-posts/usage` a v odpovědi obdrží seznam MV. | — |
| 3 | Systém otevře dialog **„MV používající '{nazev}' "** s tabulkou (Název MV, Typ MV, Organizace). | [G011](03_gui_model.md#gui-G011) |
| 4 | Uživatel může kliknout na řádek MV; systém naviguje na [Detail karty MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md) a dialog zavře. | [G011](03_gui_model.md#gui-G011) |

**Verze: RQU010**

- Akce **Zobrazit odpovídající MV** se rozšiřuje ze stávajícího chování pro MCA schopnost (`isRelevantCommandPostsEnabled`) i na stereotypy REQUIREMENT a CONSTRAINT. Dialog [G011](03_gui_model.md#gui-G011) (RQU004 `CapabilityCommandPostsDialog`) se zobecňuje a získává parametrizovaný titulek.

**Koncové podmínky:** Uživatel má přehled o použití položky napříč MV.
