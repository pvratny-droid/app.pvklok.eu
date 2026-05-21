# Use Case model

> **Delta vůči RQU004:** Tato analýza eviduje jen UC, které RQU004 buď neposkytuje (lifecycle aktivní/zrušená – UC068–UC070), nebo modifikuje (UC065 otevření přehledu se vstupem z nového panelu Číselníky, UC066 / UC067 / UC071 rozšířené chování pro stereotypy REQ/CONSTR). UC pro vytvoření prvku a editaci překladů zůstávají dědictvím RQU004 a v RQU010 se nepřepisují.

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC065 | Otevřít číselník | [FR049](01_model_pozadavku.md#fr-FR049) | — |
| UC066 | Vyhledat v seznamu položek číselníku | [FR052](01_model_pozadavku.md#fr-FR052) | — |
| UC067 | Přepnout zobrazení zrušených položek | [FR052](01_model_pozadavku.md#fr-FR052) | — |
| UC068 | Aktivovat zrušenou položku | [FR050](01_model_pozadavku.md#fr-FR050) | — |
| UC069 | Zrušit položku (deaktivace) | [FR050](01_model_pozadavku.md#fr-FR050), [FR051](01_model_pozadavku.md#fr-FR051) | — |
| UC070 | Trvale smazat nepoužitou položku | [FR051](01_model_pozadavku.md#fr-FR051) | extend UC069 |
| UC071 | Zobrazit MV používající položku | [FR053](01_model_pozadavku.md#fr-FR053) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

```plantuml file=diagrams/uc_diagram.puml
```

---

<a id="uc-UC065"></a>
## UC065 – Otevřít číselník

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se z rozcestníku Modelu SVŘ dostane na seznam položek vybraného číselníku (Požadavky MV nebo Omezení MV). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR049](01_model_pozadavku.md#fr-FR049) |

**Vstupní podmínky:** Uživatel je v modulu Model SVŘ (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel **„Číselníky"** (umístěný před panelem „Ostatní"). | [G056](03_gui_model.md#gui-G056) |
| 2 | Uživatel klikne tlačítko **ZOBRAZIT** na dlaždici **Požadavky MV** nebo **Omezení MV** (případně na dlaždici samotnou). | [G095](03_gui_model.md#gui-G095) |
| 3 | Systém naviguje na `/web/model/requirement` resp. `/web/model/constraint` a načte všechny aktivní položky daného stereotypu. | — |
| 4 | Systém zobrazí tabulku se sloupci Akce, Kód, Název EN, Název CZ, Aktivní a Identifikátor. Default jsou zobrazeny jen položky `active = true`. | [G058](03_gui_model.md#gui-G058), [G059](03_gui_model.md#gui-G059) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC065-1 | Panel „Číselníky" je vždy umístěn před panelem „Ostatní" v rozcestníku Modelu SVŘ. | 1 |
| P-UC065-2 | Pro stereotypy `REQUIREMENT` a `CONSTRAINT` systém **nezobrazí** tlačítka „Upravit vztahy", „Sousedství v grafu" a „Patch Request" (číselník nemá vztahy v ArchiMate metamodelu). | 4 |

**Verze: RQU010**

- Nové dlaždice **Požadavky MV** a **Omezení MV** v Modelu SVŘ; navigace na obecný přehled prvků stereotypu rozšířený o lifecycle (aktivní/zrušené).
- UC přejmenován z „Otevřít přehled číselníku Požadavků nebo Omezení MV z Modelu SVŘ" na „Otevřít číselník" – odstraněno „nebo" (signál kombinovaného UC, metodika 2.3.5). Jde o jeden generický tok parametrizovaný stereotypem (REQUIREMENT / CONSTRAINT), ne dva UC. Anchor `uc-UC065` zachován.

**Koncové podmínky:** Uživatel vidí seznam aktivních položek vybraného číselníku.

---

<a id="uc-UC066"></a>
## UC066 – Vyhledat v seznamu položek číselníku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel rychle dohledá konkrétní položku číselníku napříč názvy CS / EN a popisy. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR052](01_model_pozadavku.md#fr-FR052) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV (UC065).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne do vyhledávacího pole **„Vyhledat"** v hlavičce tabulky. | [G058](03_gui_model.md#gui-G058) |
| 2 | Uživatel zapíše hledaný výraz. | [G059](03_gui_model.md#gui-G059) |
| 3 | Systém klient-side filtruje řádky napříč `name`, `nameCz`, `description`, `descriptionCz`, `s5636Identifier`. | — |

**Koncové podmínky:** Tabulka zobrazuje jen řádky odpovídající filtru.

---

<a id="uc-UC067"></a>
## UC067 – Přepnout zobrazení zrušených položek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel chce vidět zrušené (deaktivované) položky, aby je mohl znovu aktivovat (UC068) nebo trvale smazat (UC070). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR052](01_model_pozadavku.md#fr-FR052) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na toggle **„Zobrazit i zrušené"** v hlavičce přehledu. | [G058](03_gui_model.md#gui-G058) |
| 2 | Systém přenačte data se širším filtrem (`active=all`) a zobrazí v tabulce i řádky se `active = false`. | — |
| 3 | Zrušené řádky jsou vizuálně odlišené (greyed), v sloupci **Aktivní** mají označení Ne. | [G059](03_gui_model.md#gui-G059) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC067-1 | Toggle **„Zobrazit i zrušené"** je viditelný **jen** pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT). Pro ostatních 17 stereotypů z RQU004 (MCA, IER, Role, …) je skrytý. | 1 |

**Verze: RQU010**

- Nový toggle v hlavičce přehledu, nový sloupec **Aktivní** v tabulce a vizuální odlišení deaktivovaných řádků.

**Koncové podmínky:** Tabulka zobrazuje jak aktivní, tak deaktivované položky.

---

<a id="uc-UC068"></a>
## UC068 – Aktivovat zrušenou položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel obnoví dříve zrušenou položku tak, aby se znovu nabízela v editoru Specifikace MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR050](01_model_pozadavku.md#fr-FR050) |

**Vstupní podmínky:** Uživatel má zapnutý toggle „Zobrazit i zrušené" (UC067) a v tabulce vidí požadovanou zrušenou položku.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Aktivovat"** (toggle stav, viditelná u řádků se `active = false`). | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém volá `PATCH /api/elements/{id}` s payloadem `active = true`. | — |
| 3 | Systém invaliduje cache přehledu; řádek získá zpět standardní vizuál a v sloupci Aktivní hodnotu Ano. | [G059](03_gui_model.md#gui-G059) |

**Verze: RQU010**

- Nová řádková akce **Aktivovat** v tabulce prvků (viditelná jen pro stereotypy REQ/CONSTR a jen u zrušených řádků).

**Koncové podmínky:** Položka je aktivní a nabízí se v editoru Specifikace MV.

---

<a id="uc-UC069"></a>
## UC069 – Zrušit položku (deaktivace)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zruší (deaktivuje) položku tak, aby se přestala nabízet v editoru Specifikace MV, ale zůstala viditelná v historických MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR050](01_model_pozadavku.md#fr-FR050), [FR051](01_model_pozadavku.md#fr-FR051) |

**Vstupní podmínky:** Uživatel je v přehledu položek a vybraná položka je aktuálně aktivní.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Zrušit"** (toggle stav, viditelná u řádků se `active = true`). | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém volá `GET /api/elements/{id}/usage` a v odpovědi obdrží počet MV, které položku referují. | — |
| 3 | Systém otevře dialog potvrzení a zobrazí počet referujících MV. | [G096](03_gui_model.md#gui-G096) |
| 4 | Pokud `usage.count > 0`, dialog nabídne jediné tlačítko **Deaktivovat**. Uživatel ho stiskne. | [G096](03_gui_model.md#gui-G096) |
| 5 | Systém volá `PATCH /api/elements/{id}` s payloadem `active = false`, invaliduje cache a zavře dialog. | — |
| 6 | Položka je v tabulce vizuálně odlišená (greyed) a default skrytá (pokud uživatel nemá zapnutý toggle „Zobrazit i zrušené"). | [G059](03_gui_model.md#gui-G059) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | `usage.count = 0` | Dialog nabídne kromě **Deaktivovat** i tlačítko **Trvale smazat** → větvení do [UC070](#uc-UC070). |
| 4b | Uživatel klikne **Zrušit** v dialogu | Dialog se zavře bez akce; položka zůstane aktivní. |

**Verze: RQU010**

- Nová řádková akce **Zrušit** v tabulce prvků (viditelná jen pro stereotypy REQ/CONSTR a jen u aktivních řádků). Nový dialog potvrzení [G096](03_gui_model.md#gui-G096). Backend rozšířen o pole `active` v [ElementDto](04_logicky_model.md#lm-L054) a endpoint `GET /api/elements/{id}/usage`.

**Koncové podmínky:** Položka má `active = false`. Existující reference v historických Specifikacích MV zůstávají; nové Specifikace MV položku nenabízejí.

---

<a id="uc-UC070"></a>
## UC070 – Trvale smazat nepoužitou položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel trvale odstraní položku z DB, pokud ji nikde nereferuje žádná Specifikace MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR051](01_model_pozadavku.md#fr-FR051) |
| **Vztah** | extend [UC069](#uc-UC069) (větev pro `usage.count = 0`) |

**Vstupní podmínky:** Uživatel prochází scénář UC069 a backend vrátil `usage.count = 0`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Dialog potvrzení zobrazuje text *„Položka není použita v žádné Specifikaci MV. Můžete ji deaktivovat nebo trvale smazat."* a obě tlačítka **Trvale smazat** a **Deaktivovat**. | [G096](03_gui_model.md#gui-G096) |
| 2 | Uživatel klikne **Trvale smazat**. | [G096](03_gui_model.md#gui-G096) |
| 3 | Systém volá `DELETE /api/elements/{id}`, invaliduje cache a zavře dialog. | — |
| 4 | Řádek zmizí z tabulky úplně. | [G059](03_gui_model.md#gui-G059) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC070-1 | Trvalé smazání je nevratné. Backend před akcí znovu ověří `usage.count = 0` v rámci stejné transakce, aby vyloučil race condition. | 3 |

**Verze: RQU010**

- Nová akce **Trvale smazat** v dialogu potvrzení [G096](03_gui_model.md#gui-G096). Backend endpoint `DELETE /api/elements/{id}` s validační kontrolou `usage.count = 0`.

**Koncové podmínky:** Položka je z DB odstraněna; pořadové ID se nepřečísluje (auto-increment pokračuje od následujícího čísla).

---

<a id="uc-UC071"></a>
## UC071 – Zobrazit MV používající položku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled, ve kterých MV je daná položka číselníku aktuálně referována. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR053](01_model_pozadavku.md#fr-FR053) |

**Vstupní podmínky:** Uživatel je v přehledu položek číselníku Požadavků MV nebo Omezení MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne v sloupci Akce na ikonu **„Zobrazit odpovídající MV"** (analogická existující ikoně „Relevantní MV" u MCA schopnosti). | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém volá `GET /api/elements/{id}/command-posts/usage` a v odpovědi obdrží seznam MV. | — |
| 3 | Systém otevře dialog **„MV používající '{nazev}' "** s tabulkou (Název MV, Typ MV, Organizace). | [G097](03_gui_model.md#gui-G097) |
| 4 | Uživatel může kliknout na řádek MV; systém naviguje na [Detail karty MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md) a dialog zavře. | [G097](03_gui_model.md#gui-G097) |

**Verze: RQU010**

- Akce **Zobrazit odpovídající MV** se rozšiřuje ze stávajícího chování pro MCA schopnost (`isRelevantCommandPostsEnabled`) i na stereotypy REQUIREMENT a CONSTRAINT. Dialog [G097](03_gui_model.md#gui-G097) (RQU004 `CapabilityCommandPostsDialog`) se zobecňuje a získává parametrizovaný titulek.

**Koncové podmínky:** Uživatel má přehled o použití položky napříč MV.
