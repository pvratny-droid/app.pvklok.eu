# Model požadavků

> **Status: chystaný požadavek (návrh).** RQU009 zatím nemá vlastní zdrojový kód v reverse-engineering vstupu C3HUB. Tato analýza je **návrhová** – zachycuje zamýšlené řešení evidence osob a je sestavena z pohledu provázanosti a konzistence s existujícími analýzami (RQU002 Karty MV, RQU003 Mise, RQU001 Souhrn). Po doplnění zdrojového kódu bude analýza zpřesněna.

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu nebo plánovač velení, který eviduje osoby, obsazuje jimi pozice na místech velení a zapojuje je do misí. |
| **Systém C3 HUB** | Vlastní aplikace COCO – persistuje evidenci osob a jejich vazby na pozice MV a mise; nahrazuje dosavadní volné textové reprezentace osob závaznou doménovou entitou. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Zavést **závaznou doménovou entitu Osoba** namísto dosavadních volných textových reprezentací (`responsiblePerson` na specifikaci MV, `personName` na pozici). |
| **C02** | Evidovat **obsazení pozic na MV** konkrétními osobami s časovou platností (aktivní i historické obsazení). |
| **C03** | Evidovat **zapojení osob do misí** nad rámec obsazení pozic na MV. |
| **C04** | Zachovat zpětnou kompatibilitu – legacy textové atributy zůstávají jako display name, závazná je doménová vazba. |

---

## Funkční požadavky

<a id="fr-FR01"></a>
### FR01 – Evidence osob

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Vést evidenci **osob** (pracovníků) s atributy: celé jméno, hodnost, osobní číslo a volitelná vazba na uživatelský účet. Osoba je závazná doménová entita, na kterou se odkazuje při obsazování pozic a zapojení do misí. |
| **Návrh řešení** | `«Form» SeznamOsob` s přehledem osob a `«Form modal» DetailOsoby` pro vytvoření/úpravu. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 (chystaný požadavek) |

**Realizující UC:** [UC001](02_use_case_model.md#uc-UC001), [UC002](02_use_case_model.md#uc-UC002)

---

<a id="fr-FR02"></a>
### FR02 – Obsazení pozic na MV osobami

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Umožnit obsazení **pozice na MV** ([RQU002 L004](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004)) konkrétní osobou s časovou platností. Eviduje se aktivní i historické obsazení. Tato vazba nahrazuje dosavadní volný text `personName` na pozici a `responsiblePerson` na specifikaci MV. Na jedné pozici může být v jeden okamžik nejvýše jedno aktivní obsazení. |
| **Návrh řešení** | `«Form modal» ObsazeníPozice` s výběrem osoby a časovou platností; integrace do dialogu Strukturu velení v [RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md#gui-G007). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 2 (chystaný požadavek) |

**Realizující UC:** [UC003](02_use_case_model.md#uc-UC003) |

---

<a id="fr-FR03"></a>
### FR03 – Zapojení osob do misí

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Umožnit evidenci **zapojení osob do misí** ([RQU003 L001](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L001)) s volným popisem role v misi a časovou platností – nad rámec obsazení pozic na MV. |
| **Návrh řešení** | `«Form modal» ZapojeníDoMise` s výběrem osoby a popisem role; integrace do detailu mise v [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/03_gui_model.md#gui-G004). |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 2 (chystaný požadavek) |

**Realizující UC:** [UC004](02_use_case_model.md#uc-UC004)

---

<a id="fr-FR04"></a>
### FR04 – Zpětná kompatibilita s legacy textem

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Legacy textové atributy (`responsiblePerson`, `personName`) zůstávají zachovány jako display name. Závaznou doménovou vazbou se stává reference na entitu Osoba přes [L002 Obsazení pozice na MV](04_logicky_model.md#lm-L002). Migrace stávajících textových hodnot na entity Osoba je součástí zavedení požadavku. |
| **Návrh řešení** | Migrační krok + souběžné zobrazení legacy textu a doménové vazby v UI. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 2 (chystaný požadavek) |

**Realizující UC:** [UC003](02_use_case_model.md#uc-UC003)

---

## Souhrnná tabulka realizace

| FR | UC001 | UC002 | UC003 | UC004 |
|---|---|---|---|---|
| **FR01** | X | X | | |
| **FR02** | | | X | |
| **FR03** | | | | X |
| **FR04** | | | X | |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
