# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC035 | Otevřít přehled prvků stereotypu | [FR022](01_model_pozadavku.md#fr-FR022) | — |
| UC036 | Otevřít přehled prvků Katalogu služeb | [FR023](01_model_pozadavku.md#fr-FR023) | — |
| UC037 | Globální vyhledání v modelu | [FR024](01_model_pozadavku.md#fr-FR024) | — |
| UC038 | Vytvořit nový prvek modelu | [FR025](01_model_pozadavku.md#fr-FR025) | — |
| UC039 | Duplikovat existující prvek | [FR025](01_model_pozadavku.md#fr-FR025) | — |
| UC040 | Upravit překlady prvku | [FR026](01_model_pozadavku.md#fr-FR026) | — |
| UC041 | Navrhnout změnu vztahů (Patch Request) | [FR027](01_model_pozadavku.md#fr-FR027) | — |
| UC042 | Prohlížet patch requesty | [FR027](01_model_pozadavku.md#fr-FR027) | — |
| UC043 | Rozhodnout o patch requestu | [FR027](01_model_pozadavku.md#fr-FR027) | extend UC042 |
| UC044 | Otevřít sousedství prvku v ArchiRepo | [FR028](01_model_pozadavku.md#fr-FR028) | — |
| UC045 | Zobrazit relevantní MV pro MCA schopnost | [FR029](01_model_pozadavku.md#fr-FR029) | — |
| UC046 | Otevřít referenční metamodel | [FR030](01_model_pozadavku.md#fr-FR030) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU004** – revize UC modelu proti zdrojovým kódům COCO (`coco/web-app/src/content/model/`). UC042 přejmenován z „Prohlížet patch requesty (přehled / moje)" na „Prohlížet patch requesty" – původní název obsahoval lomítko odrážející neexistující přepínač pohledu; rozsah zobrazení je řízen rolí uživatele. UC043 přejmenován ze „Schválit / zamítnout patch request" na „Rozhodnout o patch requestu" – jde o jeden rozhodovací UC (jeden dialog, dvě výstupní větve 4a/4b), lomítko v názvu bylo jen falešným triggerem heuristiky split kandidáta (viz `metodika-zapisu.md` kap. 2.3.5). Scénáře UC038–UC043, UC045, UC046 opraveny dle skutečné implementace (viz poznámky Verze u jednotlivých UC).

---

<a id="uc-UC035"></a>
## UC035 – Otevřít přehled prvků stereotypu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá seznam prvků modelu daného stereotypu (např. všechny MCA schopnosti, IER, Role…). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR022](01_model_pozadavku.md#fr-FR022) |

**Vstupní podmínky:** Uživatel je v modulu Model (`/web/model`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí 9 dlaždic v panelu „Hlavní modely". | [G056](03_gui_model.md#gui-G056) |
| 2 | Uživatel klikne tlačítko **ZOBRAZIT** na dlaždici (nebo na dlaždici samotnou). | [G057](03_gui_model.md#gui-G057) |
| 3 | Systém naviguje na `/web/model/{stereotype}` a načte všechny prvky daného stereotypu. | — |
| 4 | Systém zobrazí tabulku se sloupci Kód, Název EN, Název CZ, Stav překladu, Identifikátor a akcemi. | [G059](03_gui_model.md#gui-G059) |

**Koncové podmínky:** Uživatel vidí filtrovaný seznam prvků.

---

<a id="uc-UC036"></a>
## UC036 – Otevřít přehled prvků Katalogu služeb

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá seznam prvků jedné z 4 podkategorií katalogu služeb (Infra/Aplikační služby, CIS Aplikace/Zařízení). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR023](01_model_pozadavku.md#fr-FR023) |

**Vstupní podmínky:** Uživatel je v modulu Model.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na panel „Katalog služeb". | [G056](03_gui_model.md#gui-G056) |
| 2 | Uživatel klikne na dlaždici (Infrastrukturní služby / Aplikační služby / CIS Aplikace / CIS Zařízení). | [G057](03_gui_model.md#gui-G057) |
| 3 | Systém naviguje na seznam daného stereotypu. | [G058](03_gui_model.md#gui-G058) |
| 4 | Pro **Infrastrukturní / Aplikační služby** systém **nezobrazí** akci Přidat (read-only). | [G058](03_gui_model.md#gui-G058) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC036-1 | Read-only stereotypy nepovolují editaci. | 4 |

**Koncové podmínky:** Seznam prvků služeb je zobrazen.

---

<a id="uc-UC037"></a>
## UC037 – Globální vyhledání v modelu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel hledá prvek napříč všemi stereotypy bez nutnosti vědět, kde leží. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR024](01_model_pozadavku.md#fr-FR024) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v záhlaví panelu Model klikne **VYHLEDAT**. | [G056](03_gui_model.md#gui-G056) |
| 2 | Systém naviguje na `/web/model/all`. | [G060](03_gui_model.md#gui-G060) |
| 3 | Systém zobrazí tabulku se všemi prvky napříč stereotypy. | [G059](03_gui_model.md#gui-G059) |
| 4 | Uživatel zadá hledaný výraz do vyhledávacího pole nad tabulkou a potvrdí. | [G059](03_gui_model.md#gui-G059) |
| 5 | Tabulka se klient-side přefiltruje (název EN/CZ + Kód S5636 + popis). | — |

**Koncové podmínky:** Filtrovaný seznam je zobrazen.

---

<a id="uc-UC038"></a>
## UC038 – Vytvořit nový prvek modelu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhne založení nového prvku daného stereotypu (kromě read-only stereotypů). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR025](01_model_pozadavku.md#fr-FR025) |

**Vstupní podmínky:** Uživatel je na přehledu prvků editovatelného stereotypu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne akci **+ Přidat** v rámu tabulky. | [G058](03_gui_model.md#gui-G058) |
| 2 | Systém otevře dialog Vytvoření prvku. | [G061](03_gui_model.md#gui-G061) |
| 3 | Uživatel vyplní povinný **Název EN**, případně Název CZ, Popis EN/CZ; pro CIS Aplikaci/Zařízení i povinný **Kód země**. | [G071](03_gui_model.md#gui-G071) |
| 4 | (Volitelně) Uživatel v panelu vztahů přidá vztahy nového prvku. | [G063a](03_gui_model.md#gui-G063a) |
| 5 | Uživatel klikne **VYTVOŘIT**. | [G061](03_gui_model.md#gui-G061) |
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
| P-UC038-1 | Nový prvek **nevzniká přímo** – vytvoří se Patch Request, který musí být schválen ([UC043](#uc-UC043)), než se prvek objeví v modelu. | 6 |
| P-UC038-2 | Akce **+ Přidat** není dostupná pro read-only stereotypy (Infrastrukturní + Aplikační služby). | 1 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření prvku (stav REQUESTED).

> **Verze: RQU004** – opraveno dle `CreateElementDialog.tsx`. Vytvoření prvku **nevolá `POST /model/elements`** (takový endpoint v `ModelApiClient` neexistuje) – dialog volá `createRelationshipPatchRequest`, prvek tedy prochází stejným schvalovacím workflow jako změny vztahů. Doplněn panel vztahů (sdílený `ElementContent`) a povinnost Kódu země u CIS stereotypů.

---

<a id="uc-UC039"></a>
## UC039 – Duplikovat existující prvek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhne vytvoření kopie existujícího prvku jako šablony pro nový. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR025](01_model_pozadavku.md#fr-FR025) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Duplikovat** (ContentCopy) v řádku tabulky. | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém otevře dialog Duplikace prvku s předvyplněnými hodnotami originálu a načte vztahy originálu (`GET /model/elements/{id}/relationships`). | [G065](03_gui_model.md#gui-G065) |
| 3 | Systém zobrazí vztahy originálu v panelu vztahů jako **read-only** (zkopírují se spolu s prvkem). | [G063a](03_gui_model.md#gui-G063a) |
| 4 | Uživatel upraví Název / popis nového prvku. | [G071](03_gui_model.md#gui-G071) |
| 5 | Uživatel klikne **DUPLIKOVAT**. | [G065](03_gui_model.md#gui-G065) |
| 6 | Systém volá `POST /model/relationships/patch-requests` – kopie prvku v `elementsToCreate`, převzaté vztahy v `toAdd`. | — |
| 7 | Systém zobrazí snackbar „Data uložena" a zavře dialog. | — |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC039-1 | Duplikace **není** dostupná pro read-only stereotypy (`isDuplicateEnabled`). | 1 |
| P-UC039-2 | Kopie **nevzniká přímo** – vytvoří se Patch Request; kopie i převzaté vztahy čekají na schválení ([UC043](#uc-UC043)). | 6 |

**Koncové podmínky:** Vznikl Patch Request na vytvoření kopie prvku (stav REQUESTED).

> **Verze: RQU004** – opraveno dle `DuplicateElementDialog.tsx`. Duplikace **nevytváří přímou kopii s novým UUID** – volá `createRelationshipPatchRequest`, kopie prochází schvalovacím workflow. Doplněno přebírání vztahů originálu (read-only panel) a sdílení obsahu dialogu (`ElementContent`) s UC038.

---

<a id="uc-UC040"></a>
## UC040 – Upravit překlady prvku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel doplní nebo upraví český překlad názvu a popisu prvku. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR026](01_model_pozadavku.md#fr-FR026) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Upravit překlad** (Translate) v řádku tabulky (nebo dvojklik na řádek). | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém otevře dialog Editace překladů prvku. | [G062](03_gui_model.md#gui-G062) |
| 3 | Systém zobrazí needitovatelná pole (Kód, Identifikátor, Typ, Stereotyp, Stav překladu, Název EN, Popis EN) a editovatelná pole Název CZ a Popis CZ. | [G062](03_gui_model.md#gui-G062) |
| 4 | Uživatel upraví Název CZ a/nebo Popis CZ. | [G062](03_gui_model.md#gui-G062) |
| 5 | Uživatel klikne **ULOŽIT**. | [G062](03_gui_model.md#gui-G062) |
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
| P-UC040-1 | Dialog needituje anglickou verzi ani metadata – jen české Název a Popis. | 4 |
| P-UC040-2 | Stav překladu (`translationStatus`: AI_TRANSLATED → UPDATED → APPROVED) řídí server; dialog **neobsahuje** ruční přepínač schválení překladu. | 6 |

**Koncové podmínky:** Český překlad prvku je uložen.

> **Verze: RQU004** – opraveno dle `ElementDialog.tsx`. Odstraněn neexistující přepínač **„Schválit překlad"** (`EPrepinac approve`) a na něm závislé pravidlo – `ElementDialog` posílá pouze `nameCz` a `descriptionCz`, stav překladu nastavuje backend. Doplněna skutečná sada needitovatelných polí dialogu.

---

<a id="uc-UC041"></a>
## UC041 – Navrhnout změnu vztahů (Patch Request)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel navrhuje úpravu vztahů konkrétního prvku formou Patch Requestu, který půjde do schvalovacího workflow. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR027](01_model_pozadavku.md#fr-FR027) |

**Vstupní podmínky:** Uživatel je na přehledu prvků stereotypu, který povoluje editaci vztahů (ne MCA Schopnost, Procedurální instrukce, read-only stereotypy).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Vztahy** (Share) v řádku tabulky. | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém otevře dialog Vztahy prvku a načte existující vztahy (`GET /model/elements/{id}/relationships`). | [G063](03_gui_model.md#gui-G063) |
| 3 | Systém zobrazí vztahy v záložkovém panelu – jedna záložka na povolenou dvojici stereotypů, s počítadlem vztahů. | [G063a](03_gui_model.md#gui-G063a) |
| 4 | Uživatel přepíná mezi záložkami; aktivní záložka určuje typ a cílový stereotyp pro nový vztah. | [G063a](03_gui_model.md#gui-G063a) |
| 5 | (Přidání) Uživatel klikne **+**; systém otevře dialog Vytvoření vztahu. | [G064](03_gui_model.md#gui-G064) |
| 6 | Uživatel zvolí **existující prvek** (výběr z číselníku), nebo přepne na **nový prvek** a vyplní Název a Popis. | [G064](03_gui_model.md#gui-G064) |
| 7 | Uživatel klikne **VYTVOŘIT** – nový vztah se objeví v záložce zeleně označený. | [G063a](03_gui_model.md#gui-G063a) |
| 8 | (Odstranění) Uživatel u existujícího vztahu klikne ikonu odstranění – řádek se červeně označí jako k odebrání. | [G063a](03_gui_model.md#gui-G063a) |
| 9 | Uživatel klikne **ODESLAT KE SCHVÁLENÍ**. | [G063](03_gui_model.md#gui-G063) |
| 10 | Systém otevře souhrnný dialog se seznamem plánovaných změn (vztahy k přidání / k odstranění). | [G070](03_gui_model.md#gui-G070) |
| 11 | Uživatel v souhrnu potvrdí **ODESLAT KE SCHVÁLENÍ**. | [G070](03_gui_model.md#gui-G070) |
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
| P-UC041-1 | Změny **se neaplikují přímo** – jen vznikne Patch Request ve stavu REQUESTED. | 12 |
| P-UC041-2 | Akce není dostupná pro MCA Schopnost, Procedurální instrukci a read-only stereotypy (`isEditRelationshipsEnabled`). | 1 |
| P-UC041-3 | Typ vztahu se v dialogu Vytvoření vztahu **nevybírá** – je určen aktivní záložkou panelu (povolené dvojice stereotypů dle metamodelu vztahů). | 6 |

**Koncové podmínky:** Patch Request vznikl, čeká na schválení.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDialog.tsx`, `ModelElementRelationshipPanel.tsx` a `ModelElementRelationshipCreateDialog.tsx`. Doplněn záložkový panel vztahů (krok 3–4) a souhrnný dialog před odesláním (krok 10–11, [G070](03_gui_model.md#gui-G070)). Opraven dialog Vytvoření vztahu: typ vztahu je dán aktivní záložkou (ne výběrem), prvek se volí jako existující nebo zakládá nový.

---

<a id="uc-UC042"></a>
## UC042 – Prohlížet patch requesty

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel nebo schvalovatel prohlíží patch requesty; rozsah zobrazení je dán jeho rolí. |
| **Aktér** | Uživatel, Schvalovatel modelu |
| **Zdrojový požadavek** | [FR027](01_model_pozadavku.md#fr-FR027) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel naviguje z panelu „Ostatní" na dlaždici **Patch Requesty**. | [G056](03_gui_model.md#gui-G056) |
| 2 | Systém otevře stránku `/web/model/patch-requests`. | [G067](03_gui_model.md#gui-G067) |
| 3 | Systém načte patch requesty dle role: administrátor → `findAllRelationshipPatchRequests` (všechny), ostatní → `findMyPatchRequests` (jen vlastní). | — |
| 4 | Systém zobrazí tabulku patch requestů seřazenou dle data vytvoření sestupně. | [G067a](03_gui_model.md#gui-G067a) |
| 5 | (Administrátor) Uživatel akcí **Detail** u řádku ve stavu REQUESTED otevře detail. | [G068](03_gui_model.md#gui-G068) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC042-1 | Rozsah zobrazených patch requestů je dán **rolí** uživatele (administrátor vs. ostatní), ne přepínačem v UI. | 3 |
| P-UC042-2 | Akce **Detail** je u řádku dostupná jen pro administrátora a jen pro patch request ve stavu REQUESTED. | 5 |

**Koncové podmínky:** Seznam patch requestů je zobrazen.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestsPage.tsx`. Odstraněn neexistující **filtr stavu** a **přepínač pohledu „Moje / Všechny"** – stránka žádné takové ovládací prvky nemá; rozsah zobrazení je řízen rolí uživatele (`isAdmin`). UC přejmenován (viz poznámka u přehledové tabulky).

---

<a id="uc-UC043"></a>
## UC043 – Rozhodnout o patch requestu

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel rozhodne o návrhu změn modelu – schválí (změny se aplikují) nebo zamítne (žádné změny). |
| **Aktér** | Schvalovatel modelu |
| **Zdrojový požadavek** | [FR027](01_model_pozadavku.md#fr-FR027) |
| **Vztah** | `extend` [UC042](#uc-UC042) – z detailu patch requestu |

**Vstupní podmínky:** Patch request je ve stavu `REQUESTED`. Aktuální uživatel má roli administrátora.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel akcí Detail otevře detail patch requestu z přehledu. | [G068](03_gui_model.md#gui-G068) |
| 2 | Systém zobrazí metadata žádosti (datum, stav, žadatel, referenční prvek) a vztahy referenčního prvku v záložkovém panelu – navrhované přidání zeleně, odebrání červeně. | [G068](03_gui_model.md#gui-G068) |
| 3 | (Volitelně) Schvalovatel přímo v panelu vztahů upraví obsah žádosti – přidá nebo odebere vztahy. | [G063a](03_gui_model.md#gui-G063a) |
| 4 | Schvalovatel klikne **POTVRDIT** nebo **ZAMÍTNOUT**. | [G068](03_gui_model.md#gui-G068) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Schvalovatel klikne **POTVRDIT** | Systém volá `POST /model/relationships/patch-requests/{id}:approve` s výsledným obsahem žádosti (`finalChanges`). Změny aplikovány do modelu, stav → APPROVED, `closedBy`/`closedAt` vyplněny. |
| 4b | Schvalovatel klikne **ZAMÍTNOUT** | Systém volá `POST /model/relationships/patch-requests/{id}:reject`. Stav → REJECTED, žádné změny v modelu. |
| 4c | Žádost neobsahuje žádnou změnu (`hasChanges = false`) | Tlačítko **POTVRDIT** je disabled. |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC043-1 | Schvalovat / zamítat může jen administrátor a jen patch request ve stavu `REQUESTED`. | 1 |
| P-UC043-2 | Po schválení / zamítnutí je patch request uzavřen a nezměnitelný. | 4 |
| P-UC043-3 | Úprava obsahu žádosti se provádí přímo v záložkovém panelu vztahů (inline), ne samostatným editačním dialogem. | 3 |

**Koncové podmínky:** Patch Request je uzavřen ve stavu APPROVED nebo REJECTED.

> **Verze: RQU004** – opraveno dle `RelationshipPatchRequestDetailDialog.tsx`. UC přejmenován na „Rozhodnout o patch requestu" (jeden rozhodovací UC – viz poznámka u přehledové tabulky). Tlačítka opravena na **POTVRDIT** / **ZAMÍTNOUT**; odstraněna neexistující samostatná operace „Upravit" (`approveContent` se edituje inline v panelu vztahů). Pravidlo „žadatel ≠ schvalovatel" odstraněno – zdroj gatuje jen rolí administrátora (viz Otevřené otázky v README).

---

<a id="uc-UC044"></a>
## UC044 – Otevřít sousedství prvku v ArchiRepo

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá grafické zobrazení sousedství daného prvku v externím nástroji ArchiRepo. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR028](01_model_pozadavku.md#fr-FR028) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Sousedství v grafu** (GPS) v řádku tabulky. | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém zavolá `archiRepoUrlResolver.resolveElementNeighbourhoodGraphUrl(elementId)`. | — |
| 3 | Systém otevře externí URL ArchiRepo v novém okně/záložce. | — |

**Koncové podmínky:** ArchiRepo zobrazuje grafy sousedství prvku.

---

<a id="uc-UC045"></a>
## UC045 – Zobrazit relevantní MV pro MCA schopnost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Analyzátor zjistí, která místa velení danou MCA schopnost deklarují. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR029](01_model_pozadavku.md#fr-FR029) |

**Vstupní podmínky:** Uživatel je v přehledu MCA Schopností (`/web/model/MCA_CAPABILITY`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Relevantní MV** (HolidayVillage) v řádku. | [G059](03_gui_model.md#gui-G059) |
| 2 | Systém otevře dialog Relevantní místa velení a načte MV, které danou schopnost deklarují. | [G066](03_gui_model.md#gui-G066) |
| 3 | Systém zobrazí vyhledávací pole a tabulku MV (Kód, Název, Typ, Úroveň). | [G066a](03_gui_model.md#gui-G066a) |
| 4 | Uživatel může seznam zúžit zadáním výrazu do vyhledávacího pole. | [G066a](03_gui_model.md#gui-G066a) |

### Pravidla

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC045-1 | Akce je dostupná jen pro stereotyp MCA Schopnost (`isRelevantCommandPostsEnabled`). | 1 |
| P-UC045-2 | Dialog je čistě informativní – tabulka MV nemá řádkové akce ani proklik na detail MV. | 3 |

**Koncové podmínky:** Uživatel zná MV s vazbou na schopnost.

> **Verze: RQU004** – opraveno dle `CapabilityCommandPostsDialog.tsx`. Odstraněno neexistující pole „MCA schopnost" a operace „OtevřítMV()" – tabulka MV nemá řádkovou navigaci. Doplněno vyhledávací pole a sloupce tabulky MV ([G066a](03_gui_model.md#gui-G066a)).

---

<a id="uc-UC046"></a>
## UC046 – Otevřít referenční metamodel

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá vizuální referenci doménového a NATO/FMN metamodelu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR030](01_model_pozadavku.md#fr-FR030) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v panelu „Ostatní" klikne na dlaždici **Metamodel**. | [G056](03_gui_model.md#gui-G056) |
| 2 | Systém naviguje na `/web/model/metamodel`. | [G069](03_gui_model.md#gui-G069) |
| 3 | Systém zobrazí 2 obrázky – doménový metamodel a FMN metamodel – v samostatných sbalitelných sekcích. | [G069](03_gui_model.md#gui-G069) |

**Koncové podmínky:** Stránka s metamodelem je otevřená.

> **Verze: RQU004** – opraveno dle `MetamodelPage.tsx`. Stránka renderuje **2 obrázky** (`metamodel.jpg`, `metamodelFMN.jpeg`), ne 3 – soubor `MVACR.jpeg` ve složce existuje, ale komponenta jej nepoužívá.
