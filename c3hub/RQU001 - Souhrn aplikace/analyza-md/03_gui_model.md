# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal).
- **Prefix atributu:** H = hlavička, E = editovatelné, R = needitovatelné (read-only).
- **Alias** = zkrácený zobrazovací label.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| [G001](#gui-G001) | Nástěnka | dashboardPage | «Form» |
| └ [G002](#gui-G002) | Panel novinek | newsPanel | «Form area» |
| └ [G003](#gui-G003) | Panel Formuláře SVŘ | formsPanel | «Form area» |
| └ [G004](#gui-G004) | Panel Ostatní dokumenty | otherDocumentsPanel | «Form area» |
| └ [G005](#gui-G005) | Dlaždice modulu | moduleCard | «Form multi area» |
| [G006](#gui-G006) | Hlavní menu | mainMenu | «Form area» |
| └ [G007](#gui-G007) | Uživatelské menu | userMenu | «Form multi area» |
| └ [G008](#gui-G008) | Panel notifikací | notificationPanel | «Form multi area» |
| [G009](#gui-G009) | Uživatelský profil | userProfileDialog | «Form modal» |
| [G010](#gui-G010) | Změna hesla | changePasswordDialog | «Form modal» |

GUI diagram tříd: [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml)

---

<a id="gui-G001"></a>
## «Form» Nástěnka

Úvodní stránka aplikace. URL: `/web`. Source: `/coco/web-app/src/content/dashboard/DashboardPage.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Nástěnka" (i18n `dashboard:dashboard`) |
| 2 | R | RPanel | Panel novinek | — | [G002](#gui-G002) |
| 3 | R | RPanel | Panel Formuláře SVŘ | — | [G003](#gui-G003) |
| 4 | R | RPanel | Panel Ostatní dokumenty | — | [G004](#gui-G004) |

### Operace

žádné vlastní – navigace probíhá přes dlaždice.

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G002](#gui-G002) | Panel novinek |
| contains | [G003](#gui-G003) | Panel Formuláře SVŘ |
| contains | [G004](#gui-G004) | Panel Ostatní dokumenty |

---

<a id="gui-G002"></a>
## «Form area» Panel novinek

Panel s aktuálními novinkami v horní části nástěnky. Source: `/coco/web-app/src/content/news/NewsPanel.tsx` (lokace `DASHBOARD`).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RList | Seznam novinek | — | Novinky s lokací `DASHBOARD` |

### Operace

žádné – read-only zobrazení. Správa novinek je předmětem [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md).

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | RQU008 – Novinka | Cross-link |

---

<a id="gui-G003"></a>
## «Form area» Panel Formuláře SVŘ

Panel se 3 dlaždicemi hlavních modulů.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Formuláře SVŘ" (i18n `dashboard:commandAndControlForms`) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G005](#gui-G005) | Dlaždice modulu (3×: Karty MV, Mise, Model) |

---

<a id="gui-G004"></a>
## «Form area» Panel Ostatní dokumenty

Panel se 6 dlaždicemi referenčních a podpůrných modulů.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Ostatní dokumenty" (i18n `dashboard:otherDocuments`) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G005](#gui-G005) | Dlaždice modulu (6×: Funkce, C3 schopnosti, Požadavky, Návody, Referenční model, Tracker) |

---

<a id="gui-G005"></a>
## «Form multi area» Dlaždice modulu

Jedna dlaždice modulu na nástěnce. Source: `CocoSimpleCard`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Název modulu | title | |
| 2 | R | RDlouhyText | Popis | description | |
| 3 | R | RPriznak | Barevný blok | color | Identifikace modulu barvou |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Otevřít() | ZOBRAZIT / STÁHNOUT PDF / NOVÝ | Naviguje na modul, stáhne PDF, nebo otevře externí systém | [UC001](02_use_case_model.md#uc-UC001), [UC008](02_use_case_model.md#uc-UC008), [UC009](02_use_case_model.md#uc-UC009) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Modul aplikace](04_logicky_model.md#lm-L001) | |
| navigates | RQU002–RQU008 | Dle modulu |

---

<a id="gui-G006"></a>
## «Form area» Hlavní menu

Horní lišta aplikace. Source: `/coco/web-app/src/content/main-menu/MainMenu.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RIkona | ArchiRepo | — | Jen pro administrátora; otevírá ArchiRepo |
| 2 | R | RIkona | Notifikace | — | Jen pro administrátora; počet pending patch requestů |
| 3 | R | RIkona | Jazyk | — | Přepínač jazyka (CZ / EN) |
| 4 | R | RText | Přihlášený uživatel | — | Login + celé jméno + ikona účtu |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OtevřítArchiRepo() | — | `archiRepoUrlResolver.resolveMainPageUrl()` (admin) | [UC008](02_use_case_model.md#uc-UC008) |
| 2 | OtevřítNotifikace() | — | Otevře [G008](#gui-G008) (admin) | [UC006](02_use_case_model.md#uc-UC006) |
| 3 | PřepnoutJazyk() | — | Otevře LanguageMenu | [UC005](02_use_case_model.md#uc-UC005) |
| 4 | OtevřítUživatelskéMenu() | — | Otevře [G007](#gui-G007) | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [G007](#gui-G007) | Uživatelské menu |
| contains | [G008](#gui-G008) | Panel notifikací |
| dataSource | [Uživatelský kontext](04_logicky_model.md#lm-L002) | |

---

<a id="gui-G007"></a>
## «Form multi area» Uživatelské menu

Rozbalovací menu přihlášeného uživatele.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RList | Položky menu | — | Profil, Změna hesla, Odhlášení, (Administrace novinek – jen oprávnění) |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OtevřítProfil() | Profil | Otevře [G009](#gui-G009) | [UC002](02_use_case_model.md#uc-UC002) |
| 2 | ZměnitHeslo() | Změna hesla | Otevře [G010](#gui-G010) | [UC003](02_use_case_model.md#uc-UC003) |
| 3 | Odhlásit() | Odhlášení | `authClient.logout()` | [UC004](02_use_case_model.md#uc-UC004) |
| 4 | AdministraceNovinek() | Administrace novinek | Naviguje na `/admin/news` (jen oprávnění) | [UC007](02_use_case_model.md#uc-UC007) |

---

<a id="gui-G008"></a>
## «Form multi area» Panel notifikací

Panel notifikací schvalovacích úkolů (jen administrátor).

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Notifikace" |
| 2 | R | RText | Čekající patch requesty | countPendingRequests | Počet patch requestů ve stavu REQUESTED |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | OtevřítPatchRequesty() | — | Naviguje na `/model/patch-requests` | [UC006](02_use_case_model.md#uc-UC006) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [RQU004 L020 Patch Request](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/04_logicky_model.md#lm-L020) | Cross-link |

---

<a id="gui-G009"></a>
## «Form modal» Uživatelský profil

Modální dialog s profilem přihlášeného uživatele. Source: `/coco/web-app/src/content/user/UserProfileDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Profil" |
| 2 | R | RText | Login | login | |
| 3 | R | RText | Celé jméno | fullName | |
| 4 | R | RText | Role | validRoles | |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zavřít() | ZAVŘÍT | Zavře dialog | [UC002](02_use_case_model.md#uc-UC002) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Uživatelský kontext](04_logicky_model.md#lm-L002) | |

---

<a id="gui-G010"></a>
## «Form modal» Změna hesla

Modální dialog pro změnu hesla. Source: `/coco/web-app/src/content/main-menu/user/ChangePasswordDialog.tsx`.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Nadpis | — | „Změna hesla" |
| 2 | E | EText | Stávající heslo | currentPassword | Povinné |
| 3 | E | EText | Nové heslo | newPassword | Povinné |
| 4 | E | EText | Potvrzení nového hesla | confirmPassword | Povinné, musí se shodovat |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit() | ULOŽIT | Změní heslo uživatele | [UC003](02_use_case_model.md#uc-UC003) |
| 2 | Zrušit() | ZRUŠIT | Zavře dialog | [UC003](02_use_case_model.md#uc-UC003) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Uživatelský kontext](04_logicky_model.md#lm-L002) | |
