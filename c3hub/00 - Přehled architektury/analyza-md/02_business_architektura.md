# Business architektura

Business vrstva popisuje, **co C3 HUB dělá pro své uživatele** – nezávisle na tom, jak je to technicky realizováno. Je to hlavní pohled tohoto přehledu.

```plantuml file=diagrams/archimate_business.puml
```

---

## Aktéři a role

| Prvek | Typ | Popis | Zdroj |
|---|---|---|---|
| **Uživatel** | business-actor | Pracovník generálního štábu, IT architektury nebo plánovač velení. Hlavní uživatel aplikace napříč všemi moduly. | RQU001–RQU007 |
| **Administrátor** | business-actor | Uživatel s administrátorskou rolí – navíc notifikace schvalování, integrace ArchiRepo, administrace novinek. | RQU001 |
| **Schvalovatel modelu** | business-role | Role schvalující/zamítající změny doménového modelu v Patch Request workflow. | RQU004 |
| **Správce novinek** | business-role | Role oprávněná spravovat novinky (vytvoření, úprava, smazání). | RQU008 |

> Role jsou v aplikaci řízeny přes uživatelský kontext (`UserRoleResolver.isAdministrator`); detailní matice oprávnění je předmětem návrhu [NRQ002](../../NRQ002%20-%20Role%20a%20opravneni/analyza-md/README.md).

---

## Byznys služby

Deset byznys služeb, které aplikace poskytuje. Jsou to schopnosti vnímané uživatelem (ne technické moduly).

| # | Služba | Co poskytuje | Realizující modul |
|---|---|---|---|
| 1 | **Jednotný vstupní bod** | Nástěnka s rozcestníkem modulů, uživatelský kontext (přihlášení, profil, jazyk CZ/EN). | RQU001 |
| 2 | **Evidence míst velení** | Karty MV s vizuální reprezentací, specifikace, struktura velení, informační toky, FMN instrukce. | RQU002 |
| 3 | **Správa misí, operací a cvičení** | Mise s plánováním informačních interakcí, velitelských vazeb C2 a vizualizací. | RQU003 |
| 4 | **Vedení doménového modelu SVŘ** | Prohlížení, vyhledávání a navrhování změn prvků modelu (17 stereotypů). | RQU004 |
| 5 | **Katalog CIS služeb a prostředků** | Infrastrukturní a aplikační služby, CIS aplikace a zařízení. | RQU005 |
| 6 | **Referenční přehledy** | Společné/bojové funkce, taxonomie C3 schopností, požadavky a omezení MV. | RQU006, RQU007 |
| 7 | **Provozní informování** | Novinky na nástěnce (lifecycle, přečtení), návody a manuály ke stažení. | RQU008 |
| 8 | **Evidence osob** *(chystané)* | Závazná entita Osoba, obsazení pozic na MV, zapojení do misí. | RQU009 |
| 9 | **Správa číselníků MV** | Požadavky a omezení MV jako stereotypy Elementu, lifecycle aktivní/zrušená. | RQU010 |
| 10 | **Generování výstupů** | Tisknutelné reporty (PDF) a CIS matice (XLSX) z karet MV a misí. | RQU002, RQU003 |

---

## Klíčové byznys procesy

| Proces | Popis | Stavy / kroky | Zdroj |
|---|---|---|---|
| **Schvalovací workflow změn modelu** | Žádná netriviální úprava vztahů ani vznik prvku nevzniká přímo – vše přes Patch Request, který schvalovatel potvrdí nebo zamítne. | REQUESTED → APPROVED / REJECTED | RQU004 |
| **Překladové workflow CS/EN** | Dvojjazyčná údržba jmen a popisů prvků se sledováním stavu překladu. | AI_TRANSLATED → UPDATED → APPROVED | RQU004 |
| **Životní cyklus mise** | Mise lze zneplatnit a opět obnovit; přehled je dělen na aktivní a zneplatněné. | platná ↔ zneplatněná (obnovená) | RQU003 |
| **Generování výstupů** | Sestavení a stažení reportu / CIS matice z pohledu konkrétního MV. | příprava dat → render → stažení | RQU002, RQU003 |
| **Lifecycle položky číselníku** | Položka požadavku/omezení MV jde aktivní → zrušená bez ztráty historie; trvalý výmaz jen bez referencí. | aktivní ↔ zrušená (→ výmaz) | RQU010 |

---

## Byznys objekty

Hlavní informační objekty, s nimiž byznys služby a procesy pracují. (Jejich detailní datová struktura je v logických modelech dílčích RQU.)

| Objekt | Popis | Logický model |
|---|---|---|
| **Místo velení (Karta MV)** | Evidované velitelské stanoviště se specifikací, schopnostmi a strukturou. | [RQU002 L003](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/04_logicky_model.md#lm-L003) |
| **Mise / operace / cvičení** | Plánovací jednotka s informačními interakcemi a C2 vazbami mezi MV. | [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/04_logicky_model.md) |
| **Prvek modelu SVŘ** | Generický Element (MCA, IER, IP, TIN, Role, Pozice, ORG…) – 17 stereotypů. | [RQU004 L021](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L021) |
| **Patch Request** | Žádost o změnu vztahů / vznik prvků čekající na schválení. | [RQU004 L039](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L039) |
| **Osoba** *(chystané)* | Závazná doménová entita pro obsazení pozic a zapojení do misí. | [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/README.md) |
| **Novinka / dokument** | Provozní sdělení na nástěnce a referenční dokumenty ke stažení. | [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md) |

---

## Mapování na cíle

Byznys služby přímo realizují cíle (C0x) dílčích analýz. Souhrnný pohled na motivaci (stakeholdeři → drivery → cíle → požadavky) je na záložce **Motivace**.
