# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Otevřít přehled prvků stereotypu | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Otevřít přehled prvků Katalogu služeb | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Globální vyhledání v modelu | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC004 | Vytvořit nový prvek modelu | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC005 | Duplikovat existující prvek | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC006 | Upravit překlady prvku | [FR05](01_model_pozadavku.md#fr-FR05) | — |
| UC007 | Navrhnout změnu vztahů (Patch Request) | [FR06](01_model_pozadavku.md#fr-FR06) | — |
| UC008 | Prohlížet patch requesty | [FR06](01_model_pozadavku.md#fr-FR06) | — |
| UC009 | Rozhodnout o patch requestu | [FR06](01_model_pozadavku.md#fr-FR06) | extend UC008 |
| UC010 | Otevřít sousedství prvku v ArchiRepo | [FR07](01_model_pozadavku.md#fr-FR07) | — |
| UC011 | Zobrazit relevantní MV pro MCA schopnost | [FR08](01_model_pozadavku.md#fr-FR08) | — |
| UC012 | Otevřít referenční metamodel | [FR09](01_model_pozadavku.md#fr-FR09) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU004** – revize UC modelu proti zdrojovým kódům COCO (`coco/web-app/src/content/model/`). UC008 přejmenován z „Prohlížet patch requesty (přehled / moje)" na „Prohlížet patch requesty" – původní název obsahoval lomítko odrážející neexistující přepínač pohledu; rozsah zobrazení je řízen rolí uživatele. UC009 přejmenován ze „Schválit / zamítnout patch request" na „Rozhodnout o patch requestu" – jde o jeden rozhodovací UC (jeden dialog, dvě výstupní větve 4a/4b), lomítko v názvu bylo jen falešným triggerem heuristiky split kandidáta (viz `metodika-zapisu.md` kap. 2.3.5). Scénáře UC004–UC009, UC011, UC012 opraveny dle skutečné implementace (viz poznámky Verze u jednotlivých UC).

---

<a id="uc-UC001"></a>
## UC001 – Otevřít přehled prvků stereotypu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá seznam prvků modelu daného stereotypu (např. všechny MCA schopnosti, IER, Role…). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je v modulu Model (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí 9 dlaždic v panelu „Hlavní modely". | [G001](03_gui_model.md#gui-G001) |
| 2 | Uživatel klikne tlačítko **ZOBRAZIT** na dlaždici (nebo na dlaždici samotnou). | [G002](03_gui_model.md#gui-G002) |
| 3 | Systém naviguje na `/web/model/{stereotype}` a načte všechny prvky daného stereotypu. | — |
| 4 | Systém zobrazí tabulku se sloupci Kód, Název EN, Název CZ, Stav překladu, Identifikátor a akcemi. | [G004](03_gui_model.md#gui-G004) |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam prvků.

---

<a id="uc-UC002"></a>
## UC002 – Otevřít přehled prvků Katalogu služeb

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá seznam prvků jedné z 4 podkategorií katalogu služeb (Infra/Aplikační služby, CIS Aplikace/Zařízení). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Uživatel je v modulu Model.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel „Katalog služeb". | [G001](03_gui_model.md#gui-G001) |
| 2 | Uživatel klikne na dlaždici (Infrastrukturní služby / Aplikační služby / CIS Aplikace / CIS Zařízení). | [G002](03_gui_model.md#gui-G002) |
| 3 | Systém naviguje na seznam daného stereotypu. | [G003](03_gui_model.md#gui-G003) |
| 4 | Pro **Infrastrukturní / Aplikační služby** systém **nezobrazí** akci Přidat (read-only). | [G003](03_gui_model.md#gui-G003) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC002-1 | Read-only stereotypy nepovolují editaci. | 4 |

**Koncové podmínky:** Seznam prvků služeb je zobrazen.

---

<a id="uc-UC003"></a>
## UC003 – Globální vyhledání v modelu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel hledá prvek napříč všemi stereotypy bez nutnosti vědět, kde leží. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v záhlaví panelu Model klikne **VYHLEDAT**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém naviguje na `/web/model/all`. | [G005](03_gui_model.md#gui-G005) |
| 3 | Systém zobrazí tabulku se všemi prvky napříč stereotypy. | [G004](03_gui_model.md#gui-G004) |
| 4 | Uživatel zadá hledaný výraz do vyhledávacího pole nad tabulkou a potvrdí. | [G004](03_gui_model.md#gui-G004) |
| 5 | Tabulka se klient-side přefiltruje (název EN/CZ + Kód S5636 + popis). | — |

**Koncové podmínky:** Filtrovaný seznam je zobrazen.

---

<a id="uc-UC004"></a>
## UC004 – Vytvořit nový prvek modelu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhne založení nového prvku daného stereotypu (kromě read-only stereotypů). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Uživatel je na přehledu prvků editovatelného stereotypu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne akci **+ Přidat** v rámu tabulky. | [G003](03_gui_model.md#gui-G003) |
| 2 | Systém otevře dialog Vytvoření prvku. | [G006](03_gui_model.md#gui-G006) |
| 3 | Uživatel vyplní povinný **Název EN**, případně Název CZ, Popis EN/CZ; pro CIS Aplikaci/Zařízení i povinný **Kód země**. | [G016](03_gui_model.md#gui-G016) |
| 4 | (Volitelně) Uživatel v panelu vztahů přidá vztahy nového prvku. | [G008a](03_gui_model.md#gui-G008a) |
| 5 | Uživatel klikne **VYTVOŘIT**. | [G006](03_gui_model.md#gui-G006) |
| 6 | Systém volá `POST /model/relationships/patch-requests` – nový prvek je předán v poli `elementsToCreate`. | — |
| 7 | Systém zobrazí snackbar „Data uložena" a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Není vyplněn Název EN (nebo Kód země u CIS) | Tlačítko **VYTVOŘIT** je disabled. |
| 5b | Uživatel klikne **ZRUŠIT** | Systém zavře dialog bez uložení. |
| 6a | Volání selže | Snackbar „Došlo k neočekávané chybě". |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC004-1 | Nový prvek **nevzniká přímo** – vytvoří se Patch Request, který musí být schválen ([UC009](#uc-UC009)), než se prvek objeví v modelu. | 6 |
| P-UC004-2 | Akce **+ Přidat** není dostupná pro read-only stereotypy (Infrastrukturní + Aplikační služby). | 1 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření prvku (stav REQUESTED).

> **Verze: RQU004** – opraveno dle `CreateElementDialog.tsx`. Vytvoření prvku **nevolá `POST /model/elements`** (takový endpoint v `ModelApiClient` neexistuje) – dialog volá `createRelationshipPatchRequest`, prvek tedy prochází stejným schvalovacím workflow jako změny vztahů. Doplněn panel vztahů (sdílený `ElementContent`) a povinnost Kódu země u CIS stereotypů.

---

<a id="uc-UC005"></a>
## UC005 – Duplikovat existující prvek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhne vytvoření kopie existujícího prvku jako šablony pro nový. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Duplikovat** (ContentCopy) v řádku tabulky. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Duplikace prvku s předvyplněnými hodnotami originálu a načte vztahy originálu (`GET /model/elements/{id}/relationships`). | [G010](03_gui_model.md#gui-G010) |
| 3 | Systém zobrazí vztahy originálu v panelu vztahů jako **read-only** (zkopírují se spolu s prvkem). | [G008a](03_gui_model.md#gui-G008a) |
| 4 | Uživatel upraví Název / popis nového prvku. | [G016](03_gui_model.md#gui-G016) |
| 5 | Uživatel klikne **DUPLIKOVAT**. | [G010](03_gui_model.md#gui-G010) |
| 6 | Systém volá `POST /model/relationships/patch-requests` – kopie prvku v `elementsToCreate`, převzaté vztahy v `toAdd`. | — |
| 7 | Systém zobrazí snackbar „Data uložena" a zavře dialog. | — |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC005-1 | Duplikace **není** dostupná pro read-only stereotypy (`isDuplicateEnabled`). | 1 |
| P-UC005-2 | Kopie **nevzniká přímo** – vytvoří se Patch Request; kopie i převzaté vztahy čekají na schválení ([UC009](#uc-UC009)). | 6 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření kopie prvku (stav REQUESTED).

> **Verze: RQU004** – opraveno dle `DuplicateElementDialog.tsx`. Duplikace **nevytváří přímou kopii s novým UUID** – volá `createRelationshipPatchRequest`, kopie prochází schvalovacím workflow. Doplněno přebírání vztahů originálu (read-only panel) a sdílení obsahu dialogu (`ElementContent`) s UC004.

---

<a id="uc-UC006"></a>
## UC006 – Upravit překlady prvku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel doplní nebo upraví český překlad názvu a popisu prvku. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR05](01_model_pozadavku.md#fr-FR05) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Upravit překlad** (Translate) v řádku tabulky (nebo dvojklik na řádek). | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Editace překladů prvku. | [G007](03_gui_model.md#gui-G007) |
| 3 | Systém zobrazí needitovatelná pole (Kód, Identifikátor, Typ, Stereotyp, Stav překladu, Název EN, Popis EN) a editovatelná pole Název CZ a Popis CZ. | [G007](03_gui_model.md#gui-G007) |
| 4 | Uživatel upraví Název CZ a/nebo Popis CZ. | [G007](03_gui_model.md#gui-G007) |
| 5 | Uživatel klikne **ULOŽIT**. | [G007](03_gui_model.md#gui-G007) |
| 6 | Systém volá `POST /model/elements/{id}:update-translations` se `{nameCz, descriptionCz}`. | — |
| 7 | Systém zobrazí snackbar „Data uložena" a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Uživatel klikne **ZRUŠIT** | Systém zavře dialog bez uložení. |
| 6a | Volání selže | Snackbar „Došlo k neočekávané chybě". |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC006-1 | Dialog needituje anglickou verzi ani metadata – jen české Název a Popis. | 4 |
| P-UC006-2 | Stav překladu (`translationStatus`: AI_TRANSLATED → UPDATED → APPROVED) řídí server; dialog **neobsahuje** ruční přepínač schválení překladu. | 6 |

**Koncové podmínky:** Český překlad prvku je uložen.

> **Verze: RQU004** – opraveno dle `ElementDialog.tsx`. Odstraněn neexistující přepínač **„Schválit překlad"** (`EPrepinac approve`) a na něm závislé pravidlo – `ElementDialog` posílá pouze `nameCz` a `descriptionCz`, stav překladu nastavuje backend. Doplněna skutečná sada needitovatelných polí dialogu.

---

<a id="uc-UC007"></a>
## UC007 – Navrhnout změnu vztahů (Patch Request)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhuje úpravu vztahů konkrétního prvku formou Patch Requestu, který půjde do schvalovacího workflow. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR06](01_model_pozadavku.md#fr-FR06) |

**Vstupní podmínky:** Uživatel je na přehledu prvků stereotypu, který povoluje editaci vztahů (ne MCA Schopnost, Procedurální instrukce, read-only stereotypy).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Vztahy** (Share) v řádku tabulky. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Vztahy prvku a načte existující vztahy (`GET /model/elements/{id}/relationships`). | [G008](03_gui_model.md#gui-G008) |
| 3 | Systém zobrazí vztahy v záložkovém panelu – jedna záložka na povolenou dvojici stereotypů, s počítadlem vztahů. | [G008a](03_gui_model.md#gui-G008a) |
| 4 | Uživatel přepíná mezi záložkami; aktivní záložka určuje typ a cílový stereotyp pro nový vztah. | [G008a](03_gui_model.md#gui-G008a) |
| 5 | (Přidání) Uživatel klikne **+**; systém otevře dialog Vytvoření vztahu. | [G009](03_gui_model.md#gui-G009) |
| 6 | Uživatel zvolí **existující prvek** (výběr z číselníku), nebo přepne na **nový prvek** a vyplní Název a Popis. | [G009](03_gui_model.md#gui-G009) |
| 7 | Uživatel klikne **VYTVOŘIT** – nový vztah se objeví v záložce zeleně označený. | [G008a](03_gui_model.md#gui-G008a) |
| 8 | (Odstranění) Uživatel u existujícího vztahu klikne ikonu odstranění – řádek se červeně označí jako k odebrání. | [G008a](03_gui_model.md#gui-G008a) |
| 9 | Uživatel klikne **ODESLAT KE SCHVÁLENÍ**. | [G008](03_gui_model.md#gui-G008) |
| 10 | Systém otevře souhrnný dialog se seznamem plánovaných změn (vztahy k přidání / k odstranění). | [G015](03_gui_model.md#gui-G015) |
| 11 | Uživatel v souhrnu potvrdí **ODESLAT KE SCHVÁLENÍ**. | [G015](03_gui_model.md#gui-G015) |
| 12 | Systém volá `POST /model/relationships/patch-requests` se seznamy `toAdd`, `toDelete`, `elementsToCreate` a `referentialElementId`. | — |
| 13 | Systém vytvoří Patch Request ve stavu **REQUESTED**, zobrazí snackbar a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 6a | Uživatel klikne **ZRUŠIT** v dialogu Vytvoření vztahu | Dialog se zavře bez přidání vztahu. |
| 9a | Žádost neobsahuje žádnou změnu (`toAdd` i `toDelete` prázdné) | Tlačítko **ODESLAT KE SCHVÁLENÍ** je disabled. |
| 11a | Uživatel klikne **ZPĚT K EDITACI** | Souhrnný dialog se zavře, návrat do dialogu vztahů. |
| 13a | Volání selže | Snackbar „Došlo k neočekávané chybě". |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC007-1 | Změny **se neaplikují přímo** – jen vznikne Patch Request ve stavu REQUESTED. | 12 |
| P-UC007-2 | Akce není dostupná pro MCA Schopnost, Procedurální instrukci a read-only stereotypy (`isEditRelationshipsEnabled`). | 1 |
| P-UC007-3 | Typ vztahu se v dialogu Vytvoření vztahu **nevybírá** – je určen aktivní záložkou panelu (povolené dvojice stereotypů dle metamodelu vztahů). | 6 |

**Koncové podmínky:** Patch Request vznikl, čeká na schválení.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDialog.tsx`, `ModelElementRelationshipPanel.tsx` a `ModelElementRelationshipCreateDialog.tsx`. Doplněn záložkový panel vztahů (krok 3–4) a souhrnný dialog před odesláním (krok 10–11, [G015](03_gui_model.md#gui-G015)). Opraven dialog Vytvoření vztahu: typ vztahu je dán aktivní záložkou (ne výběrem), prvek se volí jako existující nebo zakládá nový.

---

<a id="uc-UC008"></a>
## UC008 – Prohlížet patch requesty

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel nebo schvalovatel prohlíží patch requesty; rozsah zobrazení je dán jeho rolí. |
| **Aktér** | Uživatel, Schvalovatel modelu |
| **Zdrojový požadavek** | [FR06](01_model_pozadavku.md#fr-FR06) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel naviguje z panelu „Ostatní" na dlaždici **Patch Requesty**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém otevře stránku `/web/model/patch-requests`. | [G012](03_gui_model.md#gui-G012) |
| 3 | Systém načte patch requesty dle role: administrátor → `findAllRelationshipPatchRequests` (všechny), ostatní → `findMyPatchRequests` (jen vlastní). | — |
| 4 | Systém zobrazí tabulku patch requestů seřazenou dle data vytvoření sestupně. | [G012a](03_gui_model.md#gui-G012a) |
| 5 | (Administrátor) Uživatel akcí **Detail** u řádku ve stavu REQUESTED otevře detail. | [G013](03_gui_model.md#gui-G013) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC008-1 | Rozsah zobrazených patch requestů je dán **rolí** uživatele (administrátor vs. ostatní), ne přepínačem v UI. | 3 |
| P-UC008-2 | Akce **Detail** je u řádku dostupná jen pro administrátora a jen pro patch request ve stavu REQUESTED. | 5 |

**Koncové podmínky:** Seznam patch requestů je zobrazen.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Odstraněn neexistující **filtr stavu** a **přepínač pohledu „Moje / Všechny"** – stránka žádné takové ovládací prvky nemá; rozsah zobrazení je řízen rolí uživatele (`isAdmin`). UC přejmenován (viz poznámka u přehledové tabulky).

---

<a id="uc-UC009"></a>
## UC009 – Rozhodnout o patch requestu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel rozhodne o návrhu změn modelu – schválí (změny se aplikují) nebo zamítne (žádné změny). |
| **Aktér** | Schvalovatel modelu |
| **Zdrojový požadavek** | [FR06](01_model_pozadavku.md#fr-FR06) |
| **Vztah** | `extend` [UC008](#uc-UC008) – z detailu patch requestu |

**Vstupní podmínky:** Patch request je ve stavu `REQUESTED`. Aktuální uživatel má roli administrátora.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel akcí Detail otevře detail patch requestu z přehledu. | [G013](03_gui_model.md#gui-G013) |
| 2 | Systém zobrazí metadata žádosti (datum, stav, žadatel, referenční prvek) a vztahy referenčního prvku v záložkovém panelu – navrhované přidání zeleně, odebrání červeně. | [G013](03_gui_model.md#gui-G013) |
| 3 | (Volitelně) Schvalovatel přímo v panelu vztahů upraví obsah žádosti – přidá nebo odebere vztahy. | [G008a](03_gui_model.md#gui-G008a) |
| 4 | Schvalovatel klikne **POTVRDIT** nebo **ZAMÍTNOUT**. | [G013](03_gui_model.md#gui-G013) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Schvalovatel klikne **POTVRDIT** | Systém volá `POST /model/relationships/patch-requests/{id}:approve` s výsledným obsahem žádosti (`finalChanges`). Změny aplikovány do modelu, stav → APPROVED, `closedBy`/`closedAt` vyplněny. |
| 4b | Schvalovatel klikne **ZAMÍTNOUT** | Systém volá `POST /model/relationships/patch-requests/{id}:reject`. Stav → REJECTED, žádné změny v modelu. |
| 4c | Žádost neobsahuje žádnou změnu (`hasChanges = false`) | Tlačítko **POTVRDIT** je disabled. |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC009-1 | Schvalovat / zamítat může jen administrátor a jen patch request ve stavu `REQUESTED`. | 1 |
| P-UC009-2 | Po schválení / zamítnutí je patch request uzavřen a nezměnitelný. | 4 |
| P-UC009-3 | Úprava obsahu žádosti se provádí přímo v záložkovém panelu vztahů (inline), ne samostatným editačním dialogem. | 3 |

**Koncové podmínky:** Patch Request je uzavřen ve stavu APPROVED nebo REJECTED.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDetailDialog.tsx`. UC přejmenován na „Rozhodnout o patch requestu" (jeden rozhodovací UC – viz poznámka u přehledové tabulky). Tlačítka opravena na **POTVRDIT** / **ZAMÍTNOUT**; odstraněna neexistující samostatná operace „Upravit" (`approveContent` se edituje inline v panelu vztahů). Pravidlo „žadatel ≠ schvalovatel" odstraněno – zdroj gatuje jen rolí administrátora (viz Otevřené otázky v README).

---

<a id="uc-UC010"></a>
## UC010 – Otevřít sousedství prvku v ArchiRepo

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá grafické zobrazení sousedství daného prvku v externím nástroji ArchiRepo. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR07](01_model_pozadavku.md#fr-FR07) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Sousedství v grafu** (GPS) v řádku tabulky. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém zavolá `archiRepoUrlResolver.resolveElementNeighbourhoodGraphUrl(elementId)`. | — |
| 3 | Systém otevře externí URL ArchiRepo v novém okně/záložce. | — |

**Koncové podmínky:** ArchiRepo zobrazuje grafy sousedství prvku.

---

<a id="uc-UC011"></a>
## UC011 – Zobrazit relevantní MV pro MCA schopnost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Analyzátor zjistí, která místa velení danou MCA schopnost deklarují. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR08](01_model_pozadavku.md#fr-FR08) |

**Vstupní podmínky:** Uživatel je v přehledu MCA Schopností (`/web/model/MCA_CAPABILITY`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Relevantní MV** (HolidayVillage) v řádku. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Relevantní místa velení a načte MV, které danou schopnost deklarují. | [G011](03_gui_model.md#gui-G011) |
| 3 | Systém zobrazí vyhledávací pole a tabulku MV (Kód, Název, Typ, Úroveň). | [G011a](03_gui_model.md#gui-G011a) |
| 4 | Uživatel může seznam zúžit zadáním výrazu do vyhledávacího pole. | [G011a](03_gui_model.md#gui-G011a) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC011-1 | Akce je dostupná jen pro stereotyp MCA Schopnost (`isRelevantCommandPostsEnabled`). | 1 |
| P-UC011-2 | Dialog je čistě informativní – tabulka MV nemá řádkové akce ani proklik na detail MV. | 3 |

**Koncové podmínky:** Uživatel zná MV s vazbou na schopnost.

> **Verze: RQU004** – opraveno dle `CapabilityCommandPostsDialog.tsx`. Odstraněno neexistující pole „MCA schopnost" a operace „OtevřítMV()" – tabulka MV nemá řádkovou navigaci. Doplněno vyhledávací pole a sloupce tabulky MV ([G011a](03_gui_model.md#gui-G011a)).

---

<a id="uc-UC012"></a>
## UC012 – Otevřít referenční metamodel

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá vizuální referenci doménového a NATO/FMN metamodelu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR09](01_model_pozadavku.md#fr-FR09) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v panelu „Ostatní" klikne na dlaždici **Metamodel**. | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém naviguje na `/web/model/metamodel`. | [G014](03_gui_model.md#gui-G014) |
| 3 | Systém zobrazí 2 obrázky – doménový metamodel a FMN metamodel – v samostatných sbalitelných sekcích. | [G014](03_gui_model.md#gui-G014) |

**Koncové podmínky:** Stránka s metamodelem je otevřená.

> **Verze: RQU004** – opraveno dle `MetamodelPage.tsx`. Stránka renderuje **2 obrázky** (`metamodel.jpg`, `metamodelFMN.jpeg`), ne 3 – soubor `MVACR.jpeg` ve složce existuje, ale komponenta jej nepoužívá.
