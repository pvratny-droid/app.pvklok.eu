# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Funkce SVŘ (referenční stránka) | jointWarfightingPage | «Form» |
| └ [G002](#gui-G002) | Tabulka společných funkcí | jointFunctionsTable | «Form grid area» |
| └ [G003](#gui-G003) | Tabulka bojových funkcí | combatFunctionsTable | «Form grid area» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G001"></a>
## «Form» Funkce SVŘ (referenční stránka)

Referenční stránka se dvěma panely funkcí. URL: `/web/joint-warfighting-functions`. Source: `/coco/web-app/src/content/warfighting/JointWarfightingPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Vazební tabulka na FMN Procedurální Instrukce" (i18n `jointWarfighting:mainTitle`) |
| 2 | R | RPanel | Panel Společné funkce | jointPanel | Nadpis „Společné funkce" + ilustrační obrázek (`join-function-pic.png`) + popis + tabulka [G002](#gui-G002) |
| 3 | R | RPanel | Panel Bojové funkce | combatPanel | Nadpis „Bojové funkce" + ilustrační obrázek (`warfighting-function-pic.png`) + popis + tabulka [G003](#gui-G003) |
| 4 | R | RDlouhyText | Popis společných funkcí | — | i18n `jointWarfighting:jointFunctionDescription` |
| 5 | R | RDlouhyText | Popis bojových funkcí | — | i18n `jointWarfighting:warfightingFunctionDescription` |

### Operace

žádné – stránka je čistě referenční (read-only zobrazení).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Tabulka společných funkcí |
| contains | [G003](#gui-G003) | Tabulka bojových funkcí |

---

<a id="gui-G002"></a>
## «Form grid area» Tabulka společných funkcí

Dvojjazyčná tabulka společných funkcí. Source: `/coco/web-app/src/content/warfighting/JointWarfightingFunctionsTable.tsx` + data `joinFunctionsData`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RText | Název CZ | cz | Český název funkce |
| 2 | R | RText | Název EN | en | Anglický název funkce |

### Operace

žádné – read-only tabulka.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Společná funkce](04_logicky_model.md#lm-L001) | 8 řádků (statická data) |

---

<a id="gui-G003"></a>
## «Form grid area» Tabulka bojových funkcí

Dvojjazyčná tabulka bojových funkcí. Source: `/coco/web-app/src/content/warfighting/JointWarfightingFunctionsTable.tsx` + data `warfightingFunctionsData`.

### Atributy (sloupce gridu)

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RText | Název CZ | cz | Český název funkce |
| 2 | R | RText | Název EN | en | Anglický název funkce |

### Operace

žádné – read-only tabulka.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Bojová funkce](04_logicky_model.md#lm-L002) | 6 řádků (statická data) |
