# Logický model

## Konvence

- Názvy atributů jsou v **„lidské češtině"**.
- Systémový název (DB / API) je ve vlastnosti **Alias** v konvenci **camelCase**.
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní.

---

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| [L001](#lm-L001) | Modul aplikace | applicationModule | Číselníková třída |
| [L002](#lm-L002) | Uživatelský kontext | userContext | Třída |
| [E001](#lm-E001) | modulAplikace_E | modulAplikace_E | Číselník |
| [E002](#lm-E002) | jazyk_E | jazyk_E | Číselník |
| [E003](#lm-E003) | role_E | role_E | Číselník |

> **Reverse-engineering RQU001** – RQU001 je **souhrnná** analýza aplikace C3 HUB. Soustředí se na navigační strukturu (nástěnka, hlavní menu, rozcestník modulů) a uživatelský kontext. Detailní doménový model jednotlivých modulů je v samostatných analýzách RQU002–RQU009. Source: `/coco/web-app/src/content/dashboard/DashboardPage.tsx`, `/coco/web-app/src/content/main-menu/MainMenu.tsx`, `/coco/web-app/src/content/user/`.

Diagram tříd: [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml)

---

<a id="lm-L001"></a>
## Třída: Modul aplikace

Reprezentuje jeden modul aplikace C3 HUB dostupný z nástěnky jako dlaždice. Source: `DashboardPage.tsx`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor modulu | id | modulAplikace_E | Ano | Viz [E001](#lm-E001). |
| 2 | Název | title | text256_T | Ano | Zobrazovaný název dlaždice. |
| 3 | Popis | description | text2000/CLOB_T | Ne | Krátký popis modulu. |
| 4 | Cesta (URL) | path | text256_T | Ne | Cílová routa (např. `/command-posts`); u externích modulů URL externího systému. |
| 5 | Panel | panel | text50_T | Ano | „Formuláře SVŘ" / „Ostatní dokumenty". |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| id | [modulAplikace_E](#lm-E001) | 1 | |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Nástěnka zobrazuje moduly ve dvou panelech: **Formuláře SVŘ** (3 moduly) a **Ostatní dokumenty** (6 modulů). |
| 2 | Modul „Požadavky, chyby, náměty" otevírá **externí** tracker (není interní routa). |
| 3 | Modul „C3 schopnosti – přehled" nemá routu – jeho akcí je stažení PDF posteru. |

---

<a id="lm-L002"></a>
## Třída: Uživatelský kontext

Reprezentuje přihlášeného uživatele a jeho kontext v aplikaci. Source: `/coco/web-app/src/content/user/UserContext.ts`, `UserRoleResolver.ts`.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Login | login | text256_T | Ano | Přihlašovací jméno. |
| 2 | Celé jméno | fullName | text256_T | Ne | Zobrazuje se v hlavním menu vedle ikony účtu. |
| 3 | Role | validRoles | role_E[] | Ne | Platné role uživatele; `isAdministrator` rozhoduje o admin funkcích. |
| 4 | Jazyk | language | jazyk_E | Ano | Aktuálně zvolený jazyk rozhraní (CZ / EN). |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| validRoles | [role_E](#lm-E003) | 0..* | |
| language | [jazyk_E](#lm-E002) | 1 | |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| 1 | Administrátorské funkce (notifikace patch requestů, ArchiRepo ikona, Administrace novinek) jsou dostupné pouze pokud `UserRoleResolver.isAdministrator(validRoles)`. |
| 2 | Detailní evidence osob a jejich vazby na MV/mise je předmětem [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/README.md). |

---

## Číselníky (Enumerace)

<a id="lm-E001"></a>
### modulAplikace_E

9 modulů aplikace C3 HUB dostupných z nástěnky. Source: `DashboardPage.tsx`.

| Hodnota | Panel | Cesta | Vazba na RQU |
|---|---|---|---|
| Karty míst velení | Formuláře SVŘ | `/command-posts` | RQU002 |
| Mise, operace, cvičení | Formuláře SVŘ | `/missions` | RQU003 |
| Model SVŘ | Formuláře SVŘ | `/model` | RQU004 |
| Společné / bojové funkce | Ostatní dokumenty | `/joint-warfighting-functions` | RQU006 |
| C3 schopnosti – přehled | Ostatní dokumenty | (stažení PDF) | RQU007 |
| Požadavky a omezení | Ostatní dokumenty | `/requirements-and-constraints` | RQU007 |
| Návody a manuály | Ostatní dokumenty | `/instructions-and-manuals` | RQU008 |
| Referenční model | Ostatní dokumenty | `/reference-model` | RQU004 / RQU007 |
| Požadavky, chyby, náměty | Ostatní dokumenty | externí tracker | — |

---

<a id="lm-E002"></a>
### jazyk_E

Jazyk uživatelského rozhraní. Source: `/coco/web-app/src/content/main-menu/localization/`.

| Hodnota | Popis |
|---|---|
| `cs` | Čeština |
| `en` | Angličtina |

---

<a id="lm-E003"></a>
### role_E

Role uživatele rozhodující o dostupnosti administrátorských funkcí. Source: `UserRoleResolver.ts`.

| Hodnota | Popis |
|---|---|
| Administrátor | Přístup k notifikacím patch requestů, ArchiRepo, Administraci novinek |
| Běžný uživatel | Standardní přístup k modulům aplikace |

> Detailní matice rolí a oprávnění není ze source frontendu strukturovaně vidět – `UserRoleResolver` exponuje pouze predikát `isAdministrator`.
