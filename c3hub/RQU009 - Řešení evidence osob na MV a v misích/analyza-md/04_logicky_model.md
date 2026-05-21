# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L051](#lm-L051) | Osoba | person | Třída |
| [L052](#lm-L052) | Obsazení pozice na MV | commandPostPositionAssignment | Vazební třída |
| [L053](#lm-L053) | Zapojení osoby do mise | missionPersonnelAssignment | Vazební třída |
| [E039](#lm-E039) | stavObsazení_E | stavObsazeni_E | Číselník |

> **Status: chystaný požadavek (návrh).** RQU009 zatím **nemá vlastní zdrojový kód** v reverse-engineering vstupu C3HUB – aktuální verze aplikace eviduje osoby pouze jako volný text (`responsiblePerson` na specifikaci MV, `personName` na pozici). RQU009 je **návrhová** analýza, jejímž účelem je zavést **závaznou doménovou entitu Osoba** a její vazby na MV a mise. Tato verze logického modelu je sestavena z pohledu **provázanosti a konzistence** s existujícími analýzami:
>
> - [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) – atribut `zodpovednaOsoba` (legacy volný text) → má být nahrazen vazbou přes [L052](#lm-L052).
> - [RQU002 L006 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) – atribut `osoba` (legacy volný text) → vazba přes [L052](#lm-L052).
> - [RQU003 L015 Mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015) – zapojení osob do mise přes [L053](#lm-L053).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L051"></a>
## Třída: Osoba

Doménová entita reprezentující konkrétní osobu (pracovníka), kterou lze obsadit na pozici na MV nebo zapojit do mise. Nahrazuje dosavadní volné textové reprezentace osob.

> **Verze: RQU009** – nová doménová entita. V aktuální verzi aplikace osoby existují jen jako volný text (`responsiblePerson`, `personName`); RQU009 navrhuje jejich povýšení na evidovanou entitu.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Celé jméno | celeJmeno | text256_T | Ano | Zobrazované jméno osoby (nahrazuje legacy `personName` / `responsiblePerson`). |
| 3 | Hodnost | hodnost | text50_T | Ne | Vojenská hodnost. |
| 4 | Osobní číslo | osobniCislo | text50_T | Ne | Identifikační číslo osoby. |
| 5 | Login | login | text256_T | Ne | Volitelná vazba na uživatelský účet ([RQU001 L002](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/04_logicky_model.md#lm-L002)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| (kompozice) | [Obsazení pozice na MV](#lm-L052) | 0..* | Pozice, které osoba obsazuje |
| (kompozice) | [Zapojení osoby do mise](#lm-L053) | 0..* | Mise, do kterých je osoba zapojena |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Osobní číslo (je-li vyplněno) je unikátní. |

---

<a id="lm-L052"></a>
## Třída: Obsazení pozice na MV

Vazební třída – obsazení konkrétní [pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) konkrétní [osobou](#lm-L051), s časovou platností. Tato třída je **referenčním cílem** cross-linků z [RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004).

> **Verze: RQU009** – nová vazební třída. Nahrazuje legacy volný text `personName` na pozici a `responsiblePerson` na specifikaci MV závaznou doménovou vazbou.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Platnost od | platnostOd | datumCas_T | Ne | Začátek obsazení. |
| 3 | Platnost do | platnostDo | datumCas_T | Ne | Konec obsazení; prázdné = aktivní. |
| 4 | Stav | stav | stavObsazení_E | Ano | Aktivní / Historické (viz [E039](#lm-E039)). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| osoba | [Osoba](#lm-L051) | 1 | Obsazující osoba |
| pozice | [RQU002 L006 Pozice na MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L006) | 1 | Obsazovaná pozice na MV |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Na jedné pozici může být v jeden okamžik nejvýše jedno aktivní obsazení. |
| 2 | Historická obsazení (`platnostDo` v minulosti) se zachovávají pro auditní účely. |

---

<a id="lm-L053"></a>
## Třída: Zapojení osoby do mise

Vazební třída – zapojení konkrétní [osoby](#lm-L051) do konkrétní [mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015).

> **Verze: RQU009** – nová vazební třída. Umožňuje evidovat, které osoby se podílejí na konkrétní misi (nad rámec obsazení pozic na MV).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Role v misi | roleVMisi | text256_T | Ne | Volný popis role osoby v misi. |
| 3 | Platnost od | platnostOd | datumCas_T | Ne | |
| 4 | Platnost do | platnostDo | datumCas_T | Ne | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| osoba | [Osoba](#lm-L051) | 1 | Zapojená osoba |
| mise | [RQU003 L015 Mise](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md#lm-L015) | 1 | Mise, do které je osoba zapojena |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (osoba, mise) je unikátní pro aktivní zapojení. |

---

## Číselníky (Enumerace)

<a id="lm-E039"></a>
### stavObsazení_E

Stav obsazení pozice / zapojení do mise.

| Hodnota | Popis |
|---|---|
| Aktivní | Obsazení je aktuálně platné (`platnostDo` prázdné nebo v budoucnu) |
| Historické | Obsazení skončilo (`platnostDo` v minulosti); zachováno pro audit |
