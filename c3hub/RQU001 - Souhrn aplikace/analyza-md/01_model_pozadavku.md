# Model požadavků

## Aktéři

| Aktér | Popis |
|---|---|
| **Uživatel** | Pracovník generálního štábu, IT architektury nebo plánovač velení – běžný uživatel aplikace COCO (C3 HUB). Pracuje s moduly Karty MV, Mise, Model SVŘ a referenčními přehledy. |
| **Administrátor** | Uživatel s administrátorskou rolí – navíc má přístup k notifikacím schvalování (patch requesty modelu), k integraci s ArchiRepo a ke správě novinek. |
| **Systém C3 HUB** | Vlastní aplikace COCO – poskytuje rozcestník modulů, řídí navigaci, uživatelský kontext (přihlášení, role, jazyk) a propojení s externími systémy (ArchiRepo, tracker požadavků). |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Poskytnout jednotný vstupní bod (nástěnku) s rozcestníkem na všechny moduly aplikace C3 HUB. |
| **C02** | Spravovat uživatelský kontext – přihlášení, profil, změna hesla, odhlášení, volba jazyka (CZ/EN). |
| **C03** | Informovat administrátora o čekajících schvalovacích úkolech (patch requesty modelu) a zpřístupnit administrativní funkce. |
| **C04** | Zobrazovat aktuální novinky a propojit aplikaci s externími systémy (ArchiRepo, tracker požadavků). |

---

## Funkční požadavky

<a id="fr-FR01"></a>
### FR01 – Nástěnka s rozcestníkem modulů

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Úvodní stránka **Nástěnka** zobrazuje rozcestník na všechny moduly aplikace ve dvou panelech. Panel **Formuláře SVŘ** obsahuje 3 dlaždice: **Karty míst velení** ([RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/README.md)), **Mise, operace, cvičení** ([RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/README.md)), **Model SVŘ** ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)). Panel **Ostatní dokumenty** obsahuje 6 dlaždic: **Společné / bojové funkce** ([RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/README.md)), **C3 schopnosti – přehled** (PDF, [RQU007](../../RQU007%20-%20C3%20schopnosti%20a%20pozadavky/analyza-md/README.md)), **Požadavky a omezení** ([RQU007](../../RQU007%20-%20C3%20schopnosti%20a%20pozadavky/analyza-md/README.md)), **Návody a manuály** ([RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md)), **Referenční model**, **Požadavky, chyby, náměty** (externí tracker). |
| **Návrh řešení** | `«Form» Nástěnka` (URL `/web`) se 2 panely `«Form area»` a dlaždicemi `«Form multi area»`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC001](02_use_case_model.md#uc-UC001)

---

<a id="fr-FR02"></a>
### FR02 – Hlavní menu a uživatelský kontext

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Horní lišta (hlavní menu) zobrazuje přihlášeného uživatele (login + celé jméno) a poskytuje uživatelské menu s akcemi: **Profil**, **Změna hesla**, **Odhlášení**, a pro oprávněné uživatele **Administrace novinek**. Lišta dále obsahuje přepínač jazyka (CZ/EN). |
| **Návrh řešení** | `«Form area» HlavníMenu` s uživatelským rozbalovacím menu, dialogy `«Form modal» UživatelskýProfil` a `«Form modal» ZměnaHesla`. |
| **Priorita** | Vysoká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC002](02_use_case_model.md#uc-UC002), [UC003](02_use_case_model.md#uc-UC003), [UC004](02_use_case_model.md#uc-UC004), [UC005](02_use_case_model.md#uc-UC005)

---

<a id="fr-FR03"></a>
### FR03 – Notifikace schvalovacích úkolů (administrátor)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Pro administrátora se v hlavním menu zobrazuje ikona notifikací s počtem čekajících **patch requestů** modelu (stav `REQUESTED`). Kliknutí otevře panel notifikací s odkazem na stránku patch requestů ([RQU004 G012](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G012)). Ikona je viditelná pouze pro administrátory. |
| **Návrh řešení** | `«Form area» PanelNotifikací` napojený na `countRelationshipPatchRequests({state: REQUESTED})`. |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC006](02_use_case_model.md#uc-UC006)

---

<a id="fr-FR04"></a>
### FR04 – Panel novinek

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Na nástěnce se v horní části zobrazuje **panel novinek** (`NewsPanel` s lokací `DASHBOARD`). Slouží k informování uživatelů o aktuálním dění v aplikaci. Správa novinek je dostupná oprávněným uživatelům přes uživatelské menu (Administrace novinek). |
| **Návrh řešení** | `«Form area» PanelNovinek` na nástěnce. Detailní správa novinek je předmětem [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md). |
| **Priorita** | Střední |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC007](02_use_case_model.md#uc-UC007)

---

<a id="fr-FR05"></a>
### FR05 – Integrace s externími systémy

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace je propojena se dvěma externími systémy: **ArchiRepo** (repozitář modelu – administrátor má v hlavním menu ikonu pro otevření hlavní stránky ArchiRepo) a **tracker požadavků** (dlaždice „Požadavky, chyby, náměty" na nástěnce otevírá externí formulář pro hlášení požadavků, chyb a námětů). |
| **Návrh řešení** | `archiRepoUrlResolver.resolveMainPageUrl()` a `trackerUrlResolver.resolveAddSupportTaskUrl()` otevírají externí URL. |
| **Priorita** | Nízká |
| **Přírůstek** | Etapa 1 (existující) |

**Realizující UC:** [UC008](02_use_case_model.md#uc-UC008), [UC009](02_use_case_model.md#uc-UC009)

---

## Souhrnná tabulka realizace

| FR | UC001 | UC002 | UC003 | UC004 | UC005 | UC006 | UC007 | UC008 | UC009 |
|---|---|---|---|---|---|---|---|---|---|
| **FR01** | X | | | | | | | | |
| **FR02** | | X | X | X | X | | | | |
| **FR03** | | | | | | X | | | |
| **FR04** | | | | | | | X | | |
| **FR05** | | | | | | | | X | X |

Diagram realizace: [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml)
