# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

> **Verze: RQU002** – mapovací tabulka rozšířena dle zdrojových kódů C3HUB (`/coco/web-app`). Doplněny atributy specifikace, nové vazební třídy `Druh mise MV` (L010) a `Pozice ↔ Role` (L011), nové katalogy E006–E017. Třídy L001/L002/L005 zpřesněny dle DTO `CommandPostSpecificationDto`, `CommandPostCapabilitySpecDto` a `CommandPostPositionDefinitionDto`.

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L001](#lm-L001) | Místo velení | commandPost | Třída |
| [L002](#lm-L002) | Specifikace MV | commandPostSpec | Třída |
| [L003](#lm-L003) | Vazba podřízenosti MV | commandPostSubordination | Vazební třída |
| [L004](#lm-L004) | Pozice na MV | commandPostPosition | Třída |
| [L005](#lm-L005) | Schopnost MV | commandPostCapability | Vazební třída |
| [L006](#lm-L006) | Tok IER na MV | commandPostIerFlow | Vazební třída |
| [L007](#lm-L007) | Tok IP na MV | commandPostIpFlow | Vazební třída |
| [L008](#lm-L008) | FMN instrukce na MV | commandPostFmnInstruction | Vazební třída |
| [L009](#lm-L009) | Export karty MV (audit log) | commandPostExport | Třída |
| [L010](#lm-L010) | Druh mise MV | commandPostMissionType | Vazební třída |
| [L011](#lm-L011) | Přiřazení role k pozici | commandPostPositionRole | Vazební třída |
| [E001](#lm-E001) | typMístaVelení_E | typMistaVeleni_E | Číselník |
| [E003](#lm-E003) | taktickáZnačka_E | taktickaZnacka_E | Číselník |
| [E004](#lm-E004) | země_E | zeme_E | Číselník |
| [E005](#lm-E005) | typExportuMV_E | typExportuMV_E | Číselník |
| [E006](#lm-E006) | spolecnáFunkce_E | spolecnaFunkce_E | Číselník |
| [E007](#lm-E007) | bojováFunkce_E | bojovaFunkce_E | Číselník |
| [E008](#lm-E008) | úroveňMV_E | urovenMV_E | Číselník |
| [E009](#lm-E009) | kontinuita_E | kontinuita_E | Číselník |
| [E010](#lm-E010) | mobilita_E | mobilita_E | Číselník |
| [E011](#lm-E011) | druhMobility_E | druhMobility_E | Číselník |
| [E012](#lm-E012) | zabezpečeníOchrany_E | zabezpeceniOchrany_E | Číselník (s popisem) |
| [E013](#lm-E013) | odolnost_E | odolnost_E | Číselník (s popisem) |
| [E014](#lm-E014) | soběstačnost_E | sobestacnost_E | Číselník |
| [E015](#lm-E015) | stupeňKinetickéOchrany_E | stupenKinetickeOchrany_E | Číselník |
| [E016](#lm-E016) | stupeňMinovéOchrany_E | stupenMinoveOchrany_E | Číselník |
| [E017](#lm-E017) | omezení_E | omezeni_E | Číselník |
| [E018](#lm-E018) | požadavek_E | pozadavek_E | Číselník |
| [E019](#lm-E019) | obrázek_E | obrazek_E | Číselník |
| [E020](#lm-E020) | vlajka_E | vlajka_E | Číselník |
| [E021](#lm-E021) | taktickýSymbol_E | taktickySymbol_E | Číselník |

> **Verze: RQU002** – číselník `druhMise_E` (původní E002) byl **zrušen**. Druhy mise jsou v C3HUB samostatnou entitou (`MissionType`) ze sousední analýzy [RQU003 – Mise, operace, cvičení](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md) a vazba MV ↔ MissionType je nyní v [L010](#lm-L010).

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L001"></a>
## Třída: Místo velení

Centrální entita modulu. Reprezentuje vojenský velitelský uzel (MCP, Strategic Command, JTF/JFAC/JFMCC/LCC/SpCC/CyOCC, …).

> **Verze: RQU002** – atributy `description`, `s5636Identifier` doplněny dle DTO `ElementDto` / `CommandPostElementDto` (`/coco/web-app/src/client/post/CommandPostApiClient.tsx:197`). Atribut `dateUpdated` přejmenován na `lastModified` dle implementace. Atribut „Popis" (`description`) byl dříve evidován v [L002](#lm-L002) jako `cilovyStav`; ve skutečnosti jde **o jedno a totéž pole** s odlišnými UI popiskami: v `«Form» KartyMístVelení` se zobrazuje jako sloupec **Popis**, v `«Form modal» SpecifikaceMV` jako **Cílový stav**. Atribut tedy patří na identitu MV, ne do specifikace.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | např. UUID `id-el-afc37a54-...` |
| 2 | Kód MV | s5636Identifier | kod_T | Ne | NATO/STANAG 5636 identifikátor; v UI sloupec **Kód** (i18n `commandPost:code`, DTO `ElementDto.s5636Identifier`) |
| 3 | Název | nazev | text256_T | Ano | např. „Strategic Command 22"; DTO `name` |
| 4 | Popis (cílový stav) | description | text2000/CLOB_T | Ne | V přehledu sloupec „Popis", v editaci pole „Cílový stav" (DTO `description`, label `commandPost:targetState` v editaci, `commandPost:description` v gridu) |
| 5 | Typ MV | typ | typMistaVeleni_E | Ano | DTO `commandPost.type` (`LabeledCatalogValueDto`), edituje se v `«Form modal» SpecifikaceMV` (UI `*`) |
| 6 | Datum vytvoření | dateCreated | datumCas_T | Ano | (audit) |
| 7 | Datum poslední úpravy | lastModified | datumCas_T | Ne | DTO `ElementDto.lastModified`, v UI sloupec „Naposledy změněno" |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| typ | [typMístaVelení_E](#lm-E001) | 1 | LOV; endpoint `GET /command-posts/types` |
| *(kompozice)* | [Specifikace MV](#lm-L002) | 1 | Detail (vlajka, taktická značka, schopnosti vozidla, …) |
| *(kompozice)* | [Vazba podřízenosti MV](#lm-L003) | 0..* | Hierarchie velení |
| *(kompozice)* | [Pozice na MV](#lm-L004) | 0..* | Strukturu velení |
| *(kompozice)* | [Schopnost MV](#lm-L005) | 0..* | Vazby MV ↔ Schopnost |
| *(kompozice)* | [Tok IER na MV](#lm-L006) | 0..* | Pohled přes IER |
| *(kompozice)* | [Tok IP na MV](#lm-L007) | 0..* | Pohled přes IP |
| *(kompozice)* | [FMN instrukce na MV](#lm-L008) | 0..* | 13 typů FMN instrukcí (FMN Spiral instructions) |
| *(kompozice)* | [Druh mise MV](#lm-L010) | 0..* | Mise/operace, pro něž platí specifikace schopností |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Název MV je unikátní napříč všemi MV. |
| 2 | Smazání MV vyžaduje, aby nebylo nadřízeným v žádné aktivní vazbě. |
| 3 | Akce „Upravit specifikaci MV" je dostupná pouze pokud má aktér v ACL příznak `canUpdate` (DTO `CommandPostAclDto.canUpdate`). |
| 4 | Akce „Generovat report karty MV" je dostupná pouze pokud má aktér v ACL příznak `canGenerateReport` (DTO `CommandPostAclDto.canGenerateReport`). |

---

<a id="lm-L002"></a>
## Třída: Specifikace MV

Atributy specifikace získané z dialogu „Specifikace místa velení" (DTO `CommandPostSpecificationDto`, endpoint `GET /command-posts/{id}/specification`). Tvoří 1:1 s [Místem velení](#lm-L001).

> **Verze: RQU002** – atributy doplněny dle zdrojových kódů C3HUB (`/coco/web-app/src/client/post/CommandPostApiClient.tsx:113-135` a `/coco/web-app/src/content/post/specification/CommandPostSpecificationDialog.tsx`). Atribut **Kód schopnosti** byl chybnou interpretací prvního průchodu webem (popisek v cs i18n je chybný překlad pro `unitCode`): jde o **Kód jednotky / útvaru**, nikoli o kód schopnosti. Vazba MV na schopnosti je výhradně přes [L005 Schopnost MV](#lm-L005) (a entita Schopnost je předmětem [RQU004 Model SVŘ doménové entity](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md)). Atributy `typ`, `nazev`, `description` přesunuty na [L001](#lm-L001).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Sdílí ID s [L001](#lm-L001) (1:1) |
| 2 | Zodpovědná osoba | zodpovednaOsoba | text256_T | Ne | např. „Petr Novák". DTO `responsiblePerson`, label `commandPost:commandPostResponsiblePerson`. **Verze: RQU009**: text zůstává jako legacy display name. Závazná doménová vazba je přes [RQU009 L002 Obsazení pozice na MV](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/04_logicky_model.md#lm-L002) → [Pozice na MV (L004)](#lm-L004). |
| 3 | Taktická značka | tacticalSign | taktickySymbol_E | Ne | LOV s ikonami (PNG/SVG); DTO `tacticalSign` (perzistovaná hodnota = `filename` z `/command-posts/tactical-symbols`). Label `commandPost:tacticalSymbol`. |
| 4 | Kód jednotky | unitCode | kod_T | Ne | např. „INF-HEAVY-BDE". DTO `unitCode`. **Verze: RQU002**: V cs i18n je atribut chybně přeložen jako „Kód schopnosti" – jedná se však o kód útvaru/jednotky (en label je správně „Unit code"). |
| 5 | Vlajka | flagImage | vlajka_E | Ne | LOV obrázků vlajek (PNG); DTO `flagImage` (perzistovaná hodnota = `filename` z `/command-posts/flags`). Business význam = země; viz [vlajka_E (E020)](#lm-E020). |
| 6 | Obrázek | image | obrazek_E | Ne | LOV thumbnailů; DTO `image` = `filename` z `/command-posts/images`. |
| 7 | Společné funkce | jointFunctions | spolecnaFunkce_E[] | Ne | Multi-LOV; DTO `jointFunctions: LabeledCatalogValueDto[]`. Endpoint `GET /command-posts/catalogs/joint-functions`. Vazba na [RQU006 Společné a bojové funkce](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/04_logicky_model.md). |
| 8 | Bojové funkce | combatFunctions | bojovaFunkce_E[] | Ne | Multi-LOV; DTO `combatFunctions`. Endpoint `GET /command-posts/catalogs/combat-functions`. Vazba na [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/04_logicky_model.md). |
| 9 | Úroveň | level | urovenMV_E | Ne | LOV; DTO `level: LabeledCatalogValueDto`. Endpoint `GET /command-posts/catalogs/levels`. |
| 10 | Kontinuita | continuity | kontinuita_E | Ne | LOV – Trvalé / Dočasné; DTO `continuity` (kódy `PERMANENT`, `TEMPORARY`). UI radio. |
| 11 | Mobilita (typ) | mobilityType | mobilita_E | Ne | Radio: `STATIONARY` (Stacionární) / `MOBILE` (Mobilní); DTO součást `mobilities` jako kód. |
| 12 | Druhy pohyblivosti | mobilitySpec | druhMobility_E[] | Ne | Aktivní jen je-li `mobilityType = MOBILE`. Multi-LOV; DTO `mobilities: LabeledCatalogValueDto[]` (filtrované vyjma `STATIONARY`/`MOBILE`). Endpoint `GET /command-posts/catalogs/mobilities`. |
| 13 | Zabezpečení ochrany | securityProtection | zabezpeceniOchrany_E | Ne | LOV s textovým popisem; DTO `securityProtection: DescribedCatalogValue`. Endpoint `GET /command-posts/catalogs/security-protections`. RMO č.49/2017. |
| 14 | Odolnost | resilience | odolnost_E | Ne | LOV s popisem; DTO `resilience: DescribedCatalogValue`. Endpoint `GET /command-posts/catalogs/resiliences`. |
| 15 | Soběstačnost | selfSustainment | sobestacnost_E | Ne | LOV; DTO `selfSustainment`. Endpoint `GET /command-posts/catalogs/self-sustainments`. |
| 16 | Stupeň kinetické ochrany vozidla | kineticProtectionLevel | stupeňKinetickéOchrany_E | Ne | LOV (KP_1..KP_6); DTO `balisticVehicleProtectionLevel.kinetic: number` (1..6). Endpoint `GET /command-posts/catalogs/kinetic-protection-levels`. Aktivní jen pokud mobilita = MOBILE. |
| 17 | Stupeň minové ochrany vozidla | mineProtectionLevel | stupeňMinovéOchrany_E | Ne | LOV (MP_1..MP_4); DTO `balisticVehicleProtectionLevel.mine: number` (1..4). Endpoint `GET /command-posts/catalogs/mine-protection-levels`. Aktivní jen pokud mobilita = MOBILE. |
| 18 | Omezení | constraints | omezení_E[] | Ne | Multi-LOV; DTO `constraints: LabeledCatalogValueDto[]`. Endpoint `GET /command-posts/catalogs/constraints`. |
| 19 | Požadavky | requirements | požadavek_E[] | Ne | Multi-LOV; DTO `requirements: LabeledCatalogValueDto[]`. Endpoint `GET /command-posts/catalogs/requirements`. |
| 20 | Funkce MV | functionDescription | text2000/CLOB_T | Ne | Volný text; DTO `functionDescription`. Label `commandPost:commandPostFunction`. |
| 21 | Pořadové číslo dle VODOS | vodosNumber | text50_T | Ne | DTO `vodosNumber`. Label `commandPost:vodos` („P. č. dle VODOS"). |
| 22 | Zeměpisná šířka | latitude | text50_T | Podmíněně | Součást GPS lokace; DTO `gps.latitude`. Povinná pokud je vyplněna `longitude`. |
| 23 | Zeměpisná délka | longitude | text50_T | Podmíněně | Součást GPS lokace; DTO `gps.longitude`. Povinná pokud je vyplněna `latitude`. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Místo velení](#lm-L001) | 1 | 1:1 specifikace MV |
| tacticalSign | [taktickýSymbol_E](#lm-E021) | 0..1 | |
| flagImage | [vlajka_E](#lm-E020) | 0..1 | Business interpretace = země |
| image | [obrázek_E](#lm-E019) | 0..1 | |
| jointFunctions | [spolecnáFunkce_E](#lm-E006) | 0..* | |
| combatFunctions | [bojováFunkce_E](#lm-E007) | 0..* | |
| level | [úroveňMV_E](#lm-E008) | 0..1 | |
| continuity | [kontinuita_E](#lm-E009) | 0..1 | |
| mobilityType | [mobilita_E](#lm-E010) | 0..1 | |
| mobilitySpec | [druhMobility_E](#lm-E011) | 0..* | |
| securityProtection | [zabezpečeníOchrany_E](#lm-E012) | 0..1 | |
| resilience | [odolnost_E](#lm-E013) | 0..1 | |
| selfSustainment | [soběstačnost_E](#lm-E014) | 0..1 | |
| kineticProtectionLevel | [stupeňKinetickéOchrany_E](#lm-E015) | 0..1 | |
| mineProtectionLevel | [stupeňMinovéOchrany_E](#lm-E016) | 0..1 | |
| constraints | [omezení_E](#lm-E017) | 0..* | |
| requirements | [požadavek_E](#lm-E018) | 0..* | |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Pokud je vyplněna `latitude`, musí být vyplněna i `longitude` a naopak (validace v `CommandPostSpecificationDialog.validate()`). |
| 2 | Atributy `kineticProtectionLevel`, `mineProtectionLevel`, `mobilitySpec` jsou relevantní pouze pokud `mobilityType = MOBILE`; jinak se neukládají. |
| 3 | Druhy mobility (`mobilitySpec`) vždy vylučují kódy `STATIONARY` a `MOBILE` (ty jsou v atributu `mobilityType`). |
| 4 | LOV `securityProtection` a `resilience` mají kromě kódu/labelu i textový popis zobrazený jako tooltip. |

---

<a id="lm-L003"></a>
## Třída: Vazba podřízenosti MV

Vazební třída zachycující vztah „A je podřízeno B".

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Datum platnosti od | platnostOd | datumCas_T | Ne | |
| 3 | Datum platnosti do | platnostDo | datumCas_T | Ne | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| nadřazenéMV | [Místo velení](#lm-L001) | 1 | „velitel" |
| podřízenéMV | [Místo velení](#lm-L001) | 1 | „podřízený" |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Cyklické podřízenosti zakázány. |
| 2 | Stejná dvojice nesmí být duplicitní. |

---

<a id="lm-L004"></a>
## Třída: Pozice na MV

Pozice (organizační prvek) na konkrétním MV. Definice je součástí DTO `CommandPostPositionDefinitionDto` (endpoint `GET /command-posts/{id}/position-definition`).

> **Verze: RQU002** – atribut `osoba` (`personName`) doplněn jako legacy display name. Atribut `rozpadH` (`breakdowns`) doplněn dle DTO `CommandPostPositionDefinitionDto.breakdowns: string[]` – jde o pole textových tagů (např. „H4") na **úrovni MV jako celku**, ne na jednotlivé pozici. Vazba pozice ↔ role je extrahována do samostatné vazební třídy [L011 Přiřazení role k pozici](#lm-L011), protože v DTO je `CommandPostPositionSpecDto.roles: ElementDto[]` (více rolí na pozici, role jsou entity z RIV/Modelu SVŘ).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | DTO `PositionDto.id` (UUID) |
| 2 | Název pozice | nazev | text256_T | Ano | DTO `PositionDto.name`. Pravidlo: unikátní v rámci MV. |
| 3 | Osoba | osoba | text256_T | Ne | DTO `PositionDto.personName`. Volný text, legacy display; viz cross-link [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/04_logicky_model.md#lm-L002). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| role | [Přiřazení role k pozici](#lm-L011) | 0..* | Přes vazební třídu L011 |
| obsazení | [RQU009 L002 Obsazení pozice na MV](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/04_logicky_model.md#lm-L002) | 0..* | **Verze: RQU009**: aktivní i historické obsazení pozice konkrétními osobami |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Název pozice musí být unikátní v rámci jednoho MV (validace `validatePositionName` v `CommandPositionCreateDialog.tsx`). |
| 2 | Pozice musí mít aspoň jednu přiřazenou roli (UI tlačítko „Přidat" disabled, dokud není zvolena role). |

> Pozn.: Rozpad MV (multi-tag jako „H4") **není** atributem pozice, ale celého MV – viz nová třída [L012 Rozpad MV](#lm-L012) níže.

---

<a id="lm-L005"></a>
## Třída: Schopnost MV

Vazební třída – záznam o tom, že MV deklaruje vazbu na konkrétní schopnost z MCA modelu a k ní podmnožinu subkategorií, které podporuje. DTO `CommandPostMcaCapabilitySpecDto` (endpoint `GET /command-posts/{id}/capability-spec`).

> **Verze: RQU002** – třída přepracována dle zdrojových kódů (`CommandPostApiClient.tsx:57-75`, `CommandPostCapabilityDialog.tsx`). Původní atributy `podporovano` a `druhMise` jsou nahrazeny vazbami: schopnost MV je definována kombinací (a) reference na **MCA schopnost** (z RQU004) a (b) seznamu jejích **subkategorií**, které MV podporuje. „Druhy mise" jsou vyňaty z této třídy do samostatné vazby [L010 Druh mise MV](#lm-L010), protože v DTO jsou definovány na úrovni *celé* specifikace schopností, ne per schopnost.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | ID MCA schopnosti | mcaCapabilityId | identifikator_T | Ano | DTO `CommandPostMcaCapabilitySpecDto.capability.id` – reference na entitu **Schopnost (MCA)** v [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| mcaCapability | RQU004 – MCA Schopnost | 1 | Cross-link na entitu Schopnost mimo tuto analýzu |
| podporovanéSubkategorie | RQU004 – MCA Subkategorie schopnosti | 0..* | DTO `subcategories: McaCapabilitySubcategoryDto[]` |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (MV, mcaCapability) je unikátní – jedna MCA schopnost má na MV nejvýše jeden záznam. |
| 2 | Pokud má MV navázanou MCA schopnost, ale s prázdným seznamem subkategorií, systém před uložením zobrazí varovný dialog („Některé schopnosti nemají zvoleno »Podporováno«"); uložení je možné po potvrzení. |

---

<a id="lm-L006"></a>
## Třída: Tok IER na MV

Vazební třída – přiřazení IER ke konkrétnímu MV. V DTO reprezentováno jako stav řádku (`req`, `consumer`, `provider`) interakce nad IER. Endpoint update: `PATCH /command-posts/{id}/interactions`.

> **Verze: RQU002** – atribut `roleMV` zpřesněn dle `CommandPostInteractionState` (`/coco/web-app/src/client/post/CommandPostInteractionApiClient.tsx`). Stav je trojice příznaků `req` (požadováno), `consumer` (konzument), `provider` (poskytovatel); v UI jsou vzájemně výlučné (`req` ⊻ `consumer`/`provider`). Reprezentační kódy: `undefined`, `exists`, `required`, `missing`, `consumer`, `provider`, `consumerAndProvider`.
>
> **Verze: RQU002 (2026-05-20)** – graf interakcí zobrazovaný v [G021a](03_gui_model.md#gui-G021a) odkazuje kromě IER a TIN i na další modelové prvky z **RQU004** (Model SVŘ): Business Activity (BA), Business Process (BP), Information Product (IP), CIS aplikace a CIS zařízení. Nejde o nové LM třídy této RQU – jde o **cross-link rozsah** grafu; třída L006 modeluje pouze stav toku na úrovni IER a TIN.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Požadováno | req | anoNe_T | Ano | DTO `CommandPostInteractionRowState.req` |
| 3 | Konzument | konzument | anoNe_T | Ano | DTO `CommandPostInteractionRowState.consumer` |
| 4 | Poskytovatel | poskytovatel | anoNe_T | Ano | DTO `CommandPostInteractionRowState.provider` |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| IER | RQU004 – IER (Information Exchange Requirement) | 1 | DTO `CommandPostInteractionRowPath.ierId` |
| TIN (volitelně) | RQU004 – TIN (Technology Interaction) | 0..1 | DTO `CommandPostInteractionRowPath.tinId` – pokud je TIN vyplněn, jde o detail toku na úrovni technologie |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Trojice (MV, ierId, tinId) je unikátní – tatáž kombinace má nejvýše jeden záznam. |

---

<a id="lm-L007"></a>
## Třída: Tok IP na MV

Vazební třída – přiřazení IP ke konkrétnímu MV. V UI pohled „přes IP" je odvozený – konkrétní IP je vstupem pro vyhledání souvisejících IER pomocí endpointu `POST /model/information-products/{ipId}:search-information-exchange-requirements`.

> **Verze: RQU002** – třída zachycuje vazbu **MV ↔ IP** odvozenou z UI „Pohled přes IP". Při „+ Přidat podle IP" si uživatel vybere IP a systém z něj odvodí IER, které k MV následně přiřadí (přes L006). Detailní role MV vůči IP (producent/konzument) je odvozená vlastnost odvozené z L006.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| IP | RQU004 – IP (Information Product) | 1 | |

---

<a id="lm-L008"></a>
## Třída: FMN instrukce na MV

Vazební třída – přiřazení **FMN procedurální instrukce** ke konkrétnímu MV. Endpoint: `POST /command-posts/interactions:search-procedural-instructions`. UI: sekce „FMN instrukce" na detailu MV.

> **Verze: RQU002** – třída zpřesněna: jde o vazbu MV ↔ **Procedurální instrukce** (entita z RQU007 C3 schopnosti a požadavky / RQU006 Společné a bojové funkce). Atribut `nazev` se odvozuje z napárované entity (DTO `ElementDto.name`), proto je odstraněn. Mezní počet 13 byl pozorováním v UI; v source potvrzeno není – kotegorie je řízena daty katalogu. Otevřená otázka: zda 13 FMN instrukcí je pevný číselník nebo se může rozšiřovat.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| proceduralniInstrukce | RQU006/RQU007 – Procedurální instrukce | 1 | Vazba na entitu mimo tuto analýzu |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (MV, proceduralniInstrukce) je unikátní. |

---

<a id="lm-L009"></a>
## Třída: Export karty MV (audit log)

Záznam o vygenerovaném exportu (Základní/Rozšířená karta, CIS matice).

> **Verze: RQU002** – třída byla v původní analýze označena jako odhadnutá. Procházení source kódu **nepotvrdilo** existenci audit logu na frontendu – endpointy `POST /command-posts/{id}:generate-command-post-report` a `POST /command-posts/{id}:generate-cis-matrix` vracejí pouze binární obsah souboru, žádný záznam o exportu se v UI neobjevuje. Tato třída zůstává jako **návrhový (přírůstkový) prvek** – pokud existuje na backendu (zde nemáme zdroj), patří sem. Pokud ne, patří mezi otevřené otázky pro implementaci. **Status: navrhovaný, neověřený.**

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Typ exportu | typ | typExportuMV_E | Ano | Základní / Rozšířená / CIS matice |
| 3 | Datum vygenerování | datumGenerovani | datumCas_T | Ano | |
| 4 | Velikost (B) | velikost | cisloCele_T | Ne | |
| 5 | Cesta k souboru | cesta | text500_T | Ne | (volitelně) |
| 6 | Varianta reportu | varianta | textVariantaReportu_T | Ne | „BASIC" / „COMPLETE" – DTO `CommandPostReportOptionsDto.reportVariant` |
| 7 | Klasifikace | klasifikace | textKlasifikace_T | Ne | „OFFICIAL" / „RESTRICTED" – DTO `CommandPostReportOptionsDto.reportClassification` |
| 8 | Jazyk | jazyk | textJazyk_T | Ne | DTO `CommandPostReportOptionsDto.language` |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |

---

<a id="lm-L010"></a>
## Třída: Druh mise MV

Vazební třída – přiřazení druhu mise/operace k MV pro účely specifikace schopností. DTO `CommandPostCapabilitySpecDto.missionTypes: MissionTypeDto[]` (endpoint `GET /command-posts/{id}/capability-spec`).

> **Verze: RQU002** – nová třída. Vznikla rozdělením původního atributu `druhMise` na třídě [L005](#lm-L005). V source kódu jsou druhy mise modelovány jako **samostatná entita** (z RQU003), nikoli jako enum, a jsou definovány na úrovni *celé* specifikace schopností MV (ne per schopnost), proto je vazba MV ↔ druh mise samostatnou vazební třídou.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | ID druhu mise | missionTypeId | identifikator_T | Ano | DTO `MissionTypeDto.id` – reference na entitu **Druh mise/operace** v [RQU003 Mise, operace, cvičení](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |
| missionType | RQU003 – Druh mise/operace | 1 | Cross-link na entitu mimo tuto analýzu |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (MV, missionType) je unikátní. |
| 2 | Atribut je v UI ve „Formuláři schopností" označen jako povinný (`required`); při ukládání musí být zvolen alespoň jeden druh mise. |

---

<a id="lm-L011"></a>
## Třída: Přiřazení role k pozici

Vazební třída – přiřazení **role** (z modelu SVŘ) ke konkrétní **pozici na MV**. DTO `CommandPostPositionSpecDto.roles: ElementDto[]` (endpoint `GET /command-posts/{id}/position-definition`).

> **Verze: RQU002** – nová třída. V původní analýze byla na [L004 Pozice na MV](#lm-L004) jen agregátní hodnota „Počet rolí" (sloupec v UI). Source kód odhaluje, že pozice má **seznam přiřazených rolí** (DTO `roleIds: string[]` při update), a role jsou entity (`ElementDto` se stereotypem ROLE) ze sousedního modelu SVŘ – patrně z RIV/RQU004. Endpoint pro výpis všech rolí: `GET /roles`. Endpoint pro role aktuálně reprezentované na MV: `GET /command-posts/{id}/assigned-roles` a `GET /command-posts/{id}/assigned-roles-without-position`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | ID role | roleId | identifikator_T | Ano | DTO `ElementDto.id` – reference na entitu **Role** v sousedním modelu (RIV/RQU004). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| pozice | [Pozice na MV](#lm-L004) | 1 | |
| role | RQU004 / RIV – Role | 1 | Cross-link na entitu mimo tuto analýzu |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Dvojice (pozice, role) je unikátní – jedna role je na pozici nejvýše jednou. |
| 2 | Role lze přiřadit ve třech režimech UI (radio): **Všechny role**, **Role reprezentované na MV (dle IER)**, **Role na MV bez přiřazené pozice**. |

---

<a id="lm-L012"></a>
## Třída: Rozpad MV

Volné textové tagy reprezentující organizační rozpad MV (např. „H4", „H3"…). DTO `CommandPostPositionDefinitionDto.breakdowns: string[]`.

> **Verze: RQU002** – nová třída. Atribut `rozpadH` byl v původní analýze chybně přiřazen pozici (G007 mělo „Rozpad MV" jako pole formuláře). Ve skutečnosti je rozpad **na úrovni celého MV**, je editovatelný v dialogu „Strukturu velení" (multi-tag selektor) a ukládán společně s pozicemi v endpointu `POST /command-posts/{id}/position-definition`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | |
| 2 | Tag rozpadu | tag | text50_T | Ano | Volný text (např. „H4"). Multi-tag. |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| místoVelení | [Místo velení](#lm-L001) | 1 | |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Tagy rozpadu jsou unikátní v rámci jednoho MV. |

---

## Číselníky (Enumerace)

> **Verze: RQU002** – číselník `druhMise_E` (původní E002) **zrušen** a nahrazen vazbou [L010 Druh mise MV](#lm-L010) → entita Druh mise/operace v [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md). Číselníky E006–E021 doplněny dle endpointů `/command-posts/catalogs/*` v `CommandPostApiClient.tsx:275-369`. U LOV typu „Described" (E012 zabezpečeníOchrany_E, E013 odolnost_E) je u každé hodnoty kromě kódu/labelu uložen i textový popis pro tooltip.

<a id="lm-E001"></a>
### typMístaVelení_E

Endpoint: `GET /command-posts/types`.

| Hodnota | Popis |
|---|---|
| Hlavní místo velení | „Hlavní místo velení" – pozorováno |
| Komponentní velitelství | LCC, JFAC, JFMCC, SpCC, CyOCC |
| MCP | Main Command Post |
| Záložní MV | Záložní místo velení |

---

<a id="lm-E003"></a>
### taktickáZnačka_E

Logický číselník – business hodnota je název taktické značky (NATO Joint Symbology). Viz též [taktickýSymbol_E](#lm-E021) pro UI LOV obrázků.

| Hodnota | Popis |
|---|---|
| Umístěný senzor | NATO taktická značka |
| … | (další NATO taktické značky) |

---

<a id="lm-E004"></a>
### země_E

Business číselník zemí. V UI v zobrazuje formou vlajky (viz [vlajka_E](#lm-E020) pro odkaz na obrazový asset).

> **Verze: RQU009**: doplněn sloupec `iso3` dle **STANAG 1059** (NATO 3-letter country code) pro NATO federaci a FMN Naming Convention.

| Hodnota | iso3 | Popis |
|---|---|---|
| CZ | CZE | Česká republika |
| BG | BGR | Bulharsko |
| NO | NOR | Norsko |
| ME | MNE | Černá Hora |
| US | USA | USA |

---

<a id="lm-E005"></a>
### typExportuMV_E

Typ generovaného exportu karty MV.

| Hodnota | Popis |
|---|---|
| ZakladniKarta | Základní karta velení (PDF) – varianta `BASIC` |
| RozsirenaKarta | Rozšířená karta velení (PDF) – varianta `COMPLETE` |
| CISmatice | CIS matice (XLSX) |

---

<a id="lm-E006"></a>
### spolecnáFunkce_E

Společné funkce dle doktríny SVŘ. Endpoint: `GET /command-posts/catalogs/joint-functions`. Cross-link na [RQU006 Společné a bojové funkce](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/04_logicky_model.md).

| Hodnota | Popis |
|---|---|
| manevr | Manévr |
| palby | Palby |
| veleniRizeni | Velení a řízení |
| zpravodajstvi | Zpravodajství |
| informacniCinnost | Informační činnost |
| udrzitelnost | Udržitelnost |
| ochranaSil | Ochrana sil |
| civilneVojenskaSpoluprace | Civilně-vojenská spolupráce |

---

<a id="lm-E007"></a>
### bojováFunkce_E

Bojové funkce dle doktríny SVŘ. Endpoint: `GET /command-posts/catalogs/combat-functions`. Cross-link na [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/04_logicky_model.md).

| Hodnota | Popis |
|---|---|
| missionCommand | Mission Command |
| presunManevr | Přesun a manévr |
| zpravodajskeZabezpeceni | Zpravodajské zabezpečení |
| palby | Palby |
| udrzovaniCinnosti | Udržování činnosti |
| ochranaSil | Ochrana sil |

---

<a id="lm-E008"></a>
### úroveňMV_E

Úroveň místa velení (strategická / operační / taktická…). Endpoint: `GET /command-posts/catalogs/levels`. Detailní hodnoty z source nevyplývají – LOV se načítá z backendu.

---

<a id="lm-E009"></a>
### kontinuita_E

Kontinuita provozu MV. Endpoint: `GET /command-posts/catalogs/continuities`. Source `CommandPostContinuity` enum.

| Hodnota | Popis |
|---|---|
| PERMANENT | Trvalé |
| TEMPORARY | Dočasné |

---

<a id="lm-E010"></a>
### mobilita_E

Základní typ mobility (radio button v UI). Source `COMMAND_POST_MOBILITY`.

| Hodnota | Popis |
|---|---|
| STATIONARY | Stacionární |
| MOBILE | Mobilní |

---

<a id="lm-E011"></a>
### druhMobility_E

Detailní druhy pohyblivosti (kdy je mobilita = MOBILE). Endpoint: `GET /command-posts/catalogs/mobilities` (filtrované vyjma kódů `STATIONARY` a `MOBILE`).

| Hodnota | Popis |
|---|---|
| … | Specifické druhy pohyblivosti (kontejner, vozidlo, podtyp…) – konkrétní hodnoty z backendu |

---

<a id="lm-E012"></a>
### zabezpečeníOchrany_E

Stupeň zabezpečení a ochrany MV dle RMO č.49/2017. Endpoint: `GET /command-posts/catalogs/security-protections`. Typ s popisem (`DescribedCatalogValue`) – každá hodnota má textový popis zobrazený jako tooltip.

| Hodnota | Popis (tooltip) |
|---|---|
| … | Hodnoty stupňů ochrany – konkrétní hodnoty z backendu |

---

<a id="lm-E013"></a>
### odolnost_E

Odolnost MV. Endpoint: `GET /command-posts/catalogs/resiliences`. Typ s popisem (`DescribedCatalogValue`).

| Hodnota | Popis (tooltip) |
|---|---|
| … | Stupně odolnosti – konkrétní hodnoty z backendu |

---

<a id="lm-E014"></a>
### soběstačnost_E

Soběstačnost MV. Endpoint: `GET /command-posts/catalogs/self-sustainments`.

| Hodnota | Popis |
|---|---|
| … | Stupně soběstačnosti – konkrétní hodnoty z backendu |

---

<a id="lm-E015"></a>
### stupeňKinetickéOchrany_E

Stupeň balistické (kinetické) ochrany vozidla. Endpoint: `GET /command-posts/catalogs/kinetic-protection-levels`. Source `KINETIC_PROTECTION_LEVEL_MAPPING`.

| Hodnota | Pořadí | Popis |
|---|---|---|
| KP_1 | 1 | Stupeň 1 |
| KP_2 | 2 | Stupeň 2 |
| KP_3 | 3 | Stupeň 3 |
| KP_4 | 4 | Stupeň 4 |
| KP_5 | 5 | Stupeň 5 |
| KP_6 | 6 | Stupeň 6 |

---

<a id="lm-E016"></a>
### stupeňMinovéOchrany_E

Stupeň minové ochrany vozidla. Endpoint: `GET /command-posts/catalogs/mine-protection-levels`. Source `MINE_PROTECTION_LEVEL_MAPPING`.

| Hodnota | Pořadí | Popis |
|---|---|---|
| MP_1 | 1 | Stupeň 1 |
| MP_2 | 2 | Stupeň 2 |
| MP_3 | 3 | Stupeň 3 |
| MP_4 | 4 | Stupeň 4 |

---

<a id="lm-E017"></a>
### omezení_E

Omezení provozu MV. Endpoint: `GET /command-posts/catalogs/constraints`.

| Hodnota | Popis |
|---|---|
| … | Specifická omezení – konkrétní hodnoty z backendu |

---

<a id="lm-E018"></a>
### požadavek_E

Požadavky na MV. Endpoint: `GET /command-posts/catalogs/requirements`.

| Hodnota | Popis |
|---|---|
| … | Specifické požadavky – konkrétní hodnoty z backendu |

---

<a id="lm-E019"></a>
### obrázek_E

Katalog obrázků (vizuálních reprezentací) MV. Endpoint: `GET /command-posts/images`, asset endpoint: `GET /command-posts/images/{name}`. Hodnoty jsou názvy souborů (`.png`/`.jpg`).

| Hodnota | Popis |
|---|---|
| … | Názvy souborů obrázků z backendu |

---

<a id="lm-E020"></a>
### vlajka_E

Katalog obrazových assetů vlajek pro reprezentaci země MV. Endpoint: `GET /command-posts/flags`, asset endpoint: `GET /command-posts/flags/{name}`. Business interpretace: identifikuje zemi (viz [země_E](#lm-E004)).

| Hodnota | Popis |
|---|---|
| … | Názvy souborů vlajek (PNG) z backendu |

---

<a id="lm-E021"></a>
### taktickýSymbol_E

Katalog obrazových assetů NATO taktických značek. Endpoint: `GET /command-posts/tactical-symbols`, asset endpoint: `GET /command-posts/tactical-symbols/{name}`. UI LOV; business interpretace v [taktickáZnačka_E](#lm-E003).

| Hodnota | Popis |
|---|---|
| … | Názvy souborů taktických značek (PNG/SVG) z backendu |
