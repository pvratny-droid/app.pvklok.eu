# Logický model

> **Delta vůči RQU004:** Vlastní nová LM třída v RQU010 **nevzniká**. Analýza obsahuje **delta modifikace** dvou existujících prvků z RQU004 – třídy [Element modelu](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021) (přidání atributu `active`) a číselníku [stereotyp_E](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-E028) (přidání hodnot `REQUIREMENT` a `CONSTRAINT`). Nová asociace 0..* k třídě [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) z RQU002 vyjadřuje, že každá Specifikace MV referuje 0..* Požadavků MV a 0..* Omezení MV.

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (doporučený pro DB) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.
- **Stereotyp «RQU010»** ve sloupci Stereotyp tabulky atributů = atribut byl přidán nebo změněn touto analýzou.
- V delta tabulkách jsou uvedeny **jen** nové/změněné atributy; zbytek je shrnut zkratkou `.. stávající atributy ..` (viz [metodika-zapisu.md kap. 8.5](../../../../metodika/metodika-zapisu.md)).

---

## Mapovací tabulka

| ID | Název | Alias | Typ | Status |
|---|---|---|---|---|
| [L054](#lm-L054) | Element modelu | element | Třída | modified – nový atribut `active` («RQU010») |
| [E028](#lm-E028) | stereotyp_E | stereotype_E | Číselník | modified – nové hodnoty REQUIREMENT, CONSTRAINT («RQU010») |

## Diagram

Diagram tříd logického modelu: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

```plantuml file=diagrams/lm_class_diagram.puml
```

---

<a id="lm-L054"></a>
## L054 Element modelu

Univerzální nositel doménového prvku ArchiMate (MCA schopnost, IER, IP, TIN, Role, …) i nově též podnikových číselníků **Požadavky MV** a **Omezení MV**. Záznamy se odlišují atributem `stereotyp`. Pro stereotypy `REQUIREMENT` a `CONSTRAINT` slouží `s5636Identifier` jako stable code pro FK ze Specifikace MV a `name` / `nameCz` jako vícejazyčný label nabízený v editoru Specifikace MV i v reportech (PDF / XLSX).

Cross-RQU: [RQU004 L021](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021).

### Atributy (delta)

| # | Název | Alias | Datový typ | Povinný | Stereotyp | Poznámka |
|---|---|---|---|---|---|---|
| – | .. stávající atributy (id, s5636Identifier, name, nameCz, description, descriptionCz, stereotype, archiMateType, countryCode, translationStatus, image) .. | – | – | – | – | viz [RQU004 L021](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021) |
| 12 | Aktivní | active | anoNe_T | Ano | «RQU010» | Default `true`. Pro stereotypy číselníkového charakteru (REQUIREMENT, CONSTRAINT) je smysluplný – řídí nabídku v editoru Specifikace MV (jen aktivní položky se nabízejí). Pro ostatních 17 stereotypů zůstává nevyužit (default `true`). |
| 13 | Datum zrušení | archivedAt | datumCas_T | Ne | «RQU010» | Volitelné. Nastaveno backendem při přechodu `active = true → false` pro audit. |

### Asociace (delta)

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| s5636Identifier (jako FK) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Pro stereotyp REQUIREMENT – referuje 0..* Specifikací MV přes pole `requirementsCodes[]`. Cílově (po backend refactoru) FK přes `id`. |
| s5636Identifier (jako FK) | [RQU002 L004 Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) | 0..* | Pro stereotyp CONSTRAINT – referuje 0..* Specifikací MV přes pole `constraintsCodes[]`. Cílově (po backend refactoru) FK přes `id`. |

### Integritní pravidla (delta)

| # | Pravidlo |
|---|---|
| 1 | Pro stereotypy `REQUIREMENT` a `CONSTRAINT` je `s5636Identifier` generován automaticky vzorem `REQ-NNN` resp. `CON-NNN` (per typ, auto-increment, **stálé po výmazu**). Slouží jako stable code pro FK ze Specifikace MV. |
| 2 | Pro stereotypy `REQUIREMENT` a `CONSTRAINT` jsou pole `name` (Název EN) a `nameCz` (Název CS) **oba povinné**. Pro ostatní stereotypy zůstává původní pravidlo z RQU004 (povinné jen `name` EN). |
| 3 | Pole `archiMateType` se pro stereotypy `REQUIREMENT` / `CONSTRAINT` nevyplňuje (číselník nemá ArchiMate typ). |
| 4 | Trvalý výmaz (DELETE) je možný **jen** pokud `usage.count = 0` (žádná Specifikace MV položku nereferuje) – kontrola backendem v rámci stejné transakce. |
| 5 | Zrušení (`active = false`) nemaže existující reference v Specifikacích MV – historická data zůstávají integrální. |

**Verze: RQU010**

- Přidán atribut **`active`** (anoNe_T, default `true`) – řídí nabídku položky v editoru Specifikace MV pro stereotypy REQ / CONSTR.
- Přidán volitelný atribut **`archivedAt`** (datumCas_T) – záznam o okamžiku deaktivace pro audit.
- Nová asociace 0..* na [Specifikace MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L004) pro stereotypy REQUIREMENT a CONSTRAINT (implementačně přes `s5636Identifier`, cílově přes `id`).

---

## Číselníky (Enumerace)

<a id="lm-E028"></a>
### E028 stereotyp_E

Číselník stereotypů prvků modelu SVŘ. Cross-RQU: [RQU004 E028](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-E028).

### Hodnoty (delta)

| Hodnota | Popis | Stereotyp |
|---|---|---|
| .. stávajících 17 hodnot (APPLICATION_SERVICE, BUSINESS_ACTIVITY, BUSINESS_PROCESS, CIS_APPLICATION, CIS_DEVICE, COMMAND_POST, IER_GROUPING, INFORMATION_EXCHANGE_REQUIREMENT, INFORMATION_PRODUCT, INFRASTRUCTURE_SERVICE, MCA_CAPABILITY, ORG, ORGANIZATIONAL_UNIT, POSITION, PROCEDURAL_INSTRUCTION, ROLE, TECHNOLOGY_INTERACTION) .. | viz [RQU004 E028](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-E028) | – |
| **REQUIREMENT** | Požadavek MV (číselník nabízený v editoru Specifikace MV, sekce „Omezení, požadavky a další"). | «RQU010» |
| **CONSTRAINT** | Omezení MV (číselník nabízený v editoru Specifikace MV, sekce „Omezení, požadavky a další"). | «RQU010» |

### Integritní pravidla (delta)

| # | Pravidlo |
|---|---|
| 1 | Hodnoty `REQUIREMENT` a `CONSTRAINT` jsou „číselníkového charakteru" – pro Element s těmito stereotypy se uplatní lifecycle `active`, skrytí ArchiMate vztahů a Patch Request workflow, generování `s5636Identifier` vzorem `REQ-NNN` / `CON-NNN`. |

**Verze: RQU010**

- Přidány hodnoty **REQUIREMENT** a **CONSTRAINT** pro modelaci podnikových číselníků Požadavků MV a Omezení MV jako stereotypů Element frameworku.
