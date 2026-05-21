# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L048](#lm-L048) | Novinka | news | Třída |
| [L049](#lm-L049) | Přečtení novinky uživatelem | newsReadMark | Vazební třída |
| [L050](#lm-L050) | Referenční dokument | referenceDocument | Třída |
| [E036](#lm-E036) | typNovinky_E | typNovinky_E | Číselník |
| [E037](#lm-E037) | lokaceNovinky_E | lokaceNovinky_E | Číselník |
| [E038](#lm-E038) | typReferenčníhoDokumentu_E | typReferenckihoDokumentu_E | Číselník |

> **Reverse-engineering RQU008** – třídy vychází ze zdrojových kódů C3HUB. Novinky (L048) mají plný CRUD přes `NewsApiClient` (`/coco/web-app/src/client/news/NewsApiClient.tsx`). Referenční dokumenty (L050) jsou statické soubory ke stažení (`/coco/web-app/src/content/manuals/`). Atribut `markedAsRead` na DTO je per-uživatelský příznak – modelován jako vazební třída [L049](#lm-L049).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L048"></a>
## Třída: Novinka

Novinka zobrazovaná uživatelům v aplikaci. DTO `NewsDto` (`/coco/web-app/src/client/news/NewsApiClient.tsx:12`).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Lokace | location | lokaceNovinky_E | Ano | DTO `location` – kde se novinka zobrazuje (viz [E037](#lm-E037)). |
| 3 | Obsah | content | text2000/CLOB_T | Ano | DTO `content` – textový obsah novinky. |
| 4 | Typ | type | typNovinky_E | Ano | DTO `type` – INFO / WARNING / ATTENTION (viz [E036](#lm-E036)). |
| 5 | Datum vytvoření | createdAt | datumCas_T | Ano | DTO `createdAt`. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| location | [lokaceNovinky_E](#lm-E037) | 1 | |
| type | [typNovinky_E](#lm-E036) | 1 | |
| (přečtení) | [Přečtení novinky uživatelem](#lm-L049) | 0..* | Per-uživatelský příznak přečtení |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Vytvoření / úpravu / smazání novinky řídí ACL: `NewsResourceAclDto.canCreate` (vytvoření), `NewsAclDto.canUpdate` (úprava), `NewsAclDto.canDelete` (smazání). |
| 2 | Přístup k administraci novinek řídí `NewsResourceAclDto.canAccess`. |

---

<a id="lm-L049"></a>
## Třída: Přečtení novinky uživatelem

Vazební třída – záznam o tom, že konkrétní uživatel přečetl konkrétní novinku. Odvozeno z atributu `markedAsRead` na `NewsDto` a endpointu `markNewsAsRead`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Přečteno | markedAsRead | anoNe_T | Ano | DTO `NewsDto.markedAsRead` – příznak je per uživatel. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| novinka | [Novinka](#lm-L048) | 1 | |
| uživatel | [RQU001 L002 Uživatelský kontext](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/04_logicky_model.md#lm-L002) | 1 | |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (novinka, uživatel) je unikátní. |
| 2 | Označení přečtení řídí ACL `NewsAclDto.canMarkAsRead`. |

---

<a id="lm-L050"></a>
## Třída: Referenční dokument

Statický referenční dokument (návod, metodika, školicí video) ke stažení. Source: `/coco/web-app/src/content/manuals/ManualsModelPage.tsx`.

> **Status: statický zdroj.** Referenční dokumenty jsou v aktuální verzi UI **soubory zabudované v aplikaci** (`/manuals/pdf/`, `/manuals/mp4/`), ne databázová entita. Třída zachycuje jejich evidenci.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Název souboru | fileName | text256_T | Ano | např. `C3HUB_navod_full_2026_01.pdf` |
| 2 | Typ dokumentu | typ | typReferenčníhoDokumentu_E | Ano | Návod / Metodika / Výstup cvičení / Školicí video (viz [E038](#lm-E038)). |
| 3 | Jazyk | jazyk | text50_T | Ne | CZ / EN; dostupnost EN/CZ verzí se řídí jazykem rozhraní. |
| 4 | Dostupnost | disabled | anoNe_T | Ne | Některé dokumenty mohou být dočasně nedostupné (`disabled: true`). |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Kompletní návod v EN verzi je v aktuální verzi UI nedostupný (`disabled: true`). |

---

## Číselníky (Enumerace)

<a id="lm-E036"></a>
### typNovinky_E

Typ novinky. Source: enum `NewsType` (`/coco/web-app/src/client/news/NewsApiClient.tsx:3`).

| Hodnota | Popis |
|---|---|
| `INFO` | Informace |
| `WARNING` | Varování |
| `ATTENTION` | Upozornění |

---

<a id="lm-E037"></a>
### lokaceNovinky_E

Lokace zobrazení novinky. Source: enum `NewsLocation` (`/coco/web-app/src/client/news/NewsApiClient.tsx:9`).

| Hodnota | Popis |
|---|---|
| `dashboard` | Nástěnka |

> V aktuální verzi UI je definována jediná lokace (`dashboard`); enum je připraven na rozšíření.

---

<a id="lm-E038"></a>
### typReferenčníhoDokumentu_E

Typ referenčního dokumentu na stránce Návody a manuály. Source: `ManualsModelPage.tsx`.

| Hodnota | Popis |
|---|---|
| Návod (zkrácený) | Zkrácená verze návodu C3HUB (CZ/EN) |
| Návod (kompletní) | Kompletní verze návodu C3HUB (CZ; EN nedostupná) |
| Výstup cvičení | Výstupy z cvičení FECL25 |
| Školicí materiál | Školicí materiály z cvičení FECL25 |
| Školicí video | Video demo a školicí videa (MP4) |
