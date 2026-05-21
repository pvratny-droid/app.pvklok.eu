# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu, IT architektury nebo plánovač, který prohlíží a edituje prvky modelu SVŘ – přidává/upravuje elementy 17 stereotypů (MCA schopnost, IER, IP, TIN, Role, Pozice, Org. jednotka, Procesy, Aktivity, Procedurální instrukce, CIS aplikace/zařízení, služby), edituje překlady (en/cz) a navrhuje změny vztahů formou Patch Requestů. |
| **Schvalovatel modelu** | Specializovaná role, která schvaluje nebo zamítá změny modelu (Patch Request workflow) – navržené úpravy vztahů se neaplikují do modelu, dokud je schvalovatel nepotvrdí. |
| **Systém C3 HUB** | Vlastní aplikace COCO – persistuje model, řídí workflow Patch Requestů, propojuje s ArchiRepo (externí repozitář modelu) a synchronizuje překlady prvků. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Vést centrální doménový model SVŘ se sjednoceným zachycením 17 stereotypů (MCA schopnosti, IER, IP, TIN, Role, Pozice, Org. jednotka, Org. struktura, Procesy, Aktivity, Procedurální instrukce, CIS aplikace/zařízení, infrastrukturní a aplikační služby, IER Grouping) v souladu s ArchiMate metamodelem (15 typů + 9 typů vztahů). |
| **C02** | Umožnit prohlížení a vyhledávání modelových prvků jednak per stereotyp (tematické přehledy), jednak globálně napříč všemi prvky. |
| **C03** | Umožnit dvojjazyčnou (CS/EN) údržbu jmen a popisů prvků se sledováním stavu překladu (AI-translated → Updated → Approved). |
| **C04** | Spravovat změny vztahů mezi prvky modelu řízeně přes schvalovací workflow (Patch Request: REQUESTED → APPROVED/REJECTED) tak, aby žádná netriviální úprava nevznikla bez kontroly. |
| **C05** | Poskytovat referenční dokumentaci doménového metamodelu a NATO/FMN metamodelu (vč. obrázků) jako orientační podklad pro uživatele. |

---

## Funkční požadavky

<a id="fr-FR022"></a>
### FR022 – Přehled modelových prvků per stereotyp

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Na úvodní stránce **Model** zobrazit tematické dlaždice odpovídající 9 hlavním stereotypům: **MCA schopnost** (CAP), **Informační tok IER**, **Role**, **Proces** (BP), **Aktivita** (BA), **Informační produkt IP**, **Technologická interakce TIN**, **Procedurální instrukce** (PI) a **Organizace** (ORG). Klik na dlaždici naviguje na stránku se seznamem prvků daného stereotypu. Stránka obsahuje vyhledávací filtr, tabulku s atributy (Kód `s5636Identifier`, Název EN, Název CZ, Stav překladu, Identifikátor) a akce nad řádky (Editovat překlad, Editovat vztahy, Duplikovat, Otevřít v ArchiRepo, MCA: Relevantní MV). |
| **Návrh řešení** | `«Form» Model` (URL `/web/model`) se 3 panely: hlavní modely (9 dlaždic), Katalog služeb (4 dlaždice) a Ostatní (Metamodel, Patch Requests). Detail per stereotyp v `«Form» ElementsPage` (URL `/web/model/{stereotype}`). |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC035](02_use_case_model.md#uc-UC035), [UC036](02_use_case_model.md#uc-UC036)

---

<a id="fr-FR023"></a>
### FR023 – Katalog služeb (CIS)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Vést katalog služeb v 4 podkategoriích: **Infrastrukturní služby** (SRV), **Aplikační služby** (APL), **CIS Aplikace** (CISAPP) a **CIS Zařízení** (CISDEV). Stránka **Model** zobrazuje tyto 4 kategorie samostatným panelem „Katalog služeb". CIS Aplikace a Zařízení podporují vytváření a editaci uživatelem; Infrastrukturní a Aplikační služby jsou pouze pro čtení (`isReadOnlyStereotype`). Detail katalogu viz [RQU005 Katalog služeb](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md). |
| **Návrh řešení** | Samostatný panel na ModelPage. Read-only stereotypy nemají tlačítko Přidat a nepovolují editaci vztahů. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC035](02_use_case_model.md#uc-UC035), [UC036](02_use_case_model.md#uc-UC036)

---

<a id="fr-FR024"></a>
### FR024 – Globální vyhledávání v modelu

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Akce „Vyhledat" v záhlaví panelu Model otevře stránku **Všechny prvky modelu** (URL `/web/model/all`), kde uživatel může vyhledávat napříč všemi 17 stereotypy najednou. Použije se ten samý ElementsTable s textovým filtrem na názvy (en/cz), identifikátory a popisy. |
| **Návrh řešení** | `«Form» AllModelElementsPage` (URL `/web/model/all`) s nezfiltrovaným seznamem všech elementů. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC037](02_use_case_model.md#uc-UC037)

---

<a id="fr-FR025"></a>
### FR025 – Vytvoření a duplikace prvku modelu

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Uživatel může na přehledu editovatelného stereotypu navrhnout nový prvek akcí **+ Přidat** v rámu tabulky; dialog přijímá Název EN (povinný), Název CZ, Popis EN/CZ, pro CIS Aplikaci/Zařízení i povinný Kód země, a umožní k prvku rovnou přidat vztahy. Pro existující prvky je dostupná akce **Duplikovat** (kopie prvku včetně jeho vztahů jako šablona). Vytvoření i duplikace **nevznikají přímo** – obě akce vytvoří **Patch Request** (`createRelationshipPatchRequest`, nový prvek v poli `elementsToCreate`), který musí projít schvalovacím workflow ([FR027](#fr-FR027)). Read-only stereotypy (Infrastrukturní + Aplikační služby) Přidat/Duplikovat nemají. |
| **Návrh řešení** | Sdílený dialogový obsah `ElementContent` (pole prvku + panel vztahů) v `«Form modal»` Vytvoření prvku a Duplikace prvku. Po potvrzení vzniká Patch Request ve stavu REQUESTED. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC038](02_use_case_model.md#uc-UC038), [UC039](02_use_case_model.md#uc-UC039)

> **Verze: RQU004** – opraveno dle zdroje: vytvoření i duplikace prvku probíhají přes Patch Request workflow (`createRelationshipPatchRequest`), ne přímým zápisem; neexistuje endpoint `POST /model/elements`. Název FR upřesněn (duplikace, ne obecná „editace").

---

<a id="fr-FR026"></a>
### FR026 – Dvojjazyčná údržba a workflow překladů

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Každý prvek modelu má pole **Název EN / Název CZ** a **Popis EN / Popis CZ**, plus atribut **Stav překladu** (`AI_TRANSLATED`, `UPDATED`, `APPROVED`). Akce „Upravit překlad" otevře dialog `«Form modal»` Editace překladů prvku, kde lze editovat pouze českou verzi (Název CZ, Popis CZ); anglická verze a metadata jsou needitovatelná. Uložení volá `POST /model/elements/{id}:update-translations`. **Stav překladu řídí backend** – dialog neobsahuje ruční přepínač schválení. Cílem je systematické dosažení stavu APPROVED u relevantních prvků. |
| **Návrh řešení** | `«Form modal»` Editace překladů prvku (`ElementDialog`) – editovatelná pole Název CZ a Popis CZ. Stav překladu se zobrazuje sloupcem v tabulce prvků. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC040](02_use_case_model.md#uc-UC040)

> **Verze: RQU004** – opraveno dle `ElementDialog.tsx`: dialog nemá přepínač „Schválit překlad", posílá pouze `nameCz`/`descriptionCz`; přechod do stavu APPROVED řídí backend (viz Otevřené otázky v README).

---

<a id="fr-FR027"></a>
### FR027 – Vztahy mezi prvky a Patch Request workflow

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Akce „Vztahy" otevře dialog `«Form modal»` Vztahy prvku, který zobrazí existující vztahy prvku v **záložkovém panelu** (záložka na povolenou dvojici stereotypů) a umožní navrhnout přidání nových (přes dialog Vytvoření vztahu – výběr existujícího nebo založení nového prvku) i odebrání existujících. Před odesláním systém zobrazí **souhrnný dialog** plánovaných změn. Uložení **nevytváří přímou změnu** v modelu, ale **Patch Request** (DTO `RelationshipPatchRequestCreateDto`) se seznamy `toAdd`, `toDelete` a nově zakládaných prvků (`elementsToCreate`). Schvalovatel patch requesty prohlíží na stránce `/web/model/patch-requests` (administrátor vidí všechny, ostatní jen vlastní – rozsah je řízen **rolí**, ne přepínačem v UI) a v detailu může obsah žádosti upravit a poté **POTVRDIT** (změny se aplikují) nebo **ZAMÍTNOUT**. Stavy Patch Requestu: **REQUESTED** → **APPROVED** / **REJECTED**. Pro Procedurální instrukce, MCA Schopnosti a read-only stereotypy je editace vztahů zakázána (`isEditRelationshipsEnabled = false`). |
| **Návrh řešení** | `«Form modal»` Vztahy prvku → Souhrn plánovaných změn → Patch Request; `«Form»` Patch Requesty (přehled) + `«Form modal»` Detail patch requestu. Backend endpointy `POST /model/relationships/patch-requests`, `:approve`, `:reject`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC041](02_use_case_model.md#uc-UC041), [UC042](02_use_case_model.md#uc-UC042), [UC043](02_use_case_model.md#uc-UC043)

> **Verze: RQU004** – opraveno dle zdroje: doplněn záložkový panel vztahů a souhrnný dialog před odesláním; odstraněna neexistující akce „Moje žádosti" (rozsah zobrazení patch requestů je řízen rolí uživatele).

---

<a id="fr-FR028"></a>
### FR028 – Detail vztahů prvku (sousedství v grafu)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Akce „Otevřít v ArchiRepo / Sousedství v grafu" otevře externí URL do ArchiRepo s grafickým zobrazením sousedství daného prvku (vstupy a výstupy vztahů). U IER lze rovněž zobrazit graf IER (endpoint `GET /model/graphs/ier/{ierId}`), který používá modul Karty MV ([RQU002 G031](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/03_gui_model.md#gui-G031)). |
| **Návrh řešení** | `archiRepoUrlResolver.resolveElementNeighbourhoodGraphUrl(elementId)` otevírá externí stránku. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC044](02_use_case_model.md#uc-UC044)

---

<a id="fr-FR029"></a>
### FR029 – Specifické akce pro MCA Schopnost

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Pro stereotyp **MCA Schopnost** je dostupná dodatečná řádková akce **„Relevantní místa velení"**, která otevře dialog `«Form modal» RelevantníMV` se seznamem MV, jež danou MCA schopnost deklarují (vazba z [RQU002 L007 Schopnost MV](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L007)). Slouží orientačně pro analytiky modelu schopností. |
| **Návrh řešení** | `«Form modal» CapabilityCommandPostsDialog`. Endpoint využívající RQU002 capability-spec. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC045](02_use_case_model.md#uc-UC045)

---

<a id="fr-FR030"></a>
### FR030 – Referenční dokumentace metamodelu

| Vlastnost | Hodnota |
|---|---|
| **Popis** | V panelu „Ostatní" je dlaždice **Metamodel**, která naviguje na stránku `«Form»` Metamodel (URL `/web/model/metamodel`). Stránka obsahuje **2 obrázky** ve sbalitelných sekcích – doménový metamodel (`metamodel.jpg`) a FMN metamodel (`metamodelFMN.jpeg`). Slouží jako orientační dokumentace pro uživatele. |
| **Návrh řešení** | `«Form»` Metamodel se 2 vloženými obrázky. |
| **Priorita** | Nízká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC046](02_use_case_model.md#uc-UC046)

> **Verze: RQU004** – opraveno dle `MetamodelPage.tsx`: stránka renderuje 2 obrázky, ne 3 – soubor `MVACR.jpeg` ve složce existuje, ale komponenta jej nepoužívá.

---

## Souhrnná tabulka realizace

| FR | UC035 | UC036 | UC037 | UC038 | UC039 | UC040 | UC041 | UC042 | UC043 | UC044 | UC045 | UC046 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR022** | X | X | | | | | | | | | | |
| **FR023** | X | X | | | | | | | | | | |
| **FR024** | | | X | | | | | | | | | |
| **FR025** | | | | X | X | | | | | | | |
| **FR026** | | | | | | X | | | | | | |
| **FR027** | | | | | | | X | X | X | | | |
| **FR028** | | | | | | | | | | X | | |
| **FR029** | | | | | | | | | | | X | |
| **FR030** | | | | | | | | | | | | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
