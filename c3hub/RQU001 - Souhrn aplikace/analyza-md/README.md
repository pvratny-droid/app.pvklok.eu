# UML Analýza – Souhrn aplikace C3 HUB (COCO)

Souhrnná reverse-engineering analýza aplikace COCO (C3 HUB). Poskytuje **navigačně-přehledový pohled** na celou aplikaci:

- **nástěnka** s rozcestníkem na 9 modulů ve dvou panelech (Formuláře SVŘ, Ostatní dokumenty),
- **hlavní menu** s uživatelským kontextem (profil, změna hesla, odhlášení, volba jazyka CZ/EN),
- **notifikace** schvalovacích úkolů pro administrátora (patch requesty modelu),
- **panel novinek** a integrace s externími systémy (ArchiRepo, tracker požadavků).

Detailní doménový model jednotlivých modulů je v samostatných analýzách **RQU002–RQU010**.

**Vstup analýzy:** zdrojové kódy aplikace v `d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`. Klíčové zdroje:

- `/coco/web-app/src/content/dashboard/DashboardPage.tsx` – nástěnka s rozcestníkem
- `/coco/web-app/src/content/main-menu/MainMenu.tsx` – hlavní menu, uživatelský kontext, notifikace
- `/coco/web-app/src/content/user/` – uživatelský kontext a role

Analýza je zpracována dle [interní metodiky zápisu analýzy](../../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-14
**Systém:** COCO · C3 HUB – Souhrn aplikace
**Úroveň:** complete
**Přírůstek:** Reverse-engineering · Etapa 1

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Uživatel, Administrátor, Systém C3 HUB | 3 |
| Cíle | C01–C04 | 4 |
| Funkční požadavky | FR001–FR005 | 5 |
| Use Cases | UC001–UC009 | 9 |
| GUI třídy | G001–G010 | 10 |
| Logický model – třídy | L001–L002 | 2 |
| Logický model – číselníky | E001–E003 | 3 |
| Sekvenční diagramy | — (souhrnná analýza) | 0 |
| Stavové diagramy | — (souhrnná analýza) | 0 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků (cíle, funkční požadavky) |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy (nástěnka, hlavní menu, dialogy) |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy (modul, uživatelský kontext) a číselníky |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | (souhrnná analýza bez sekvenčních diagramů) |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | (souhrnná analýza bez stavových diagramů) |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Diagram realizace požadavků (cíle ↔ FR) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |

---

## Mapa modulů C3 HUB

| Modul | Analýza |
|---|---|
| Karty míst velení | [RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/index.html) |
| Mise, operace, cvičení | [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/index.html) |
| Model SVŘ – doménové entity | [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/index.html) |
| Katalog služeb | [RQU005](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/index.html) |
| Společné a bojové funkce | [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/index.html) |
| C3 schopnosti, požadavky a omezení | [RQU007](../../RQU007%20-%20C3%20schopnosti%20a%20pozadavky/analyza-md/index.html) |
| Provozní formuláře (novinky, návody) | [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/index.html) |
| Řešení evidence osob na MV a v misích | [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/index.html) |
| Číselníky požadavků a omezení MV | [RQU010](../../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/analyza-md/index.html) |

---

## Otevřené otázky

- **Matice rolí a oprávnění** – `UserRoleResolver` exponuje pouze predikát `isAdministrator`; jemnější role-based authorizace (per modul, per akce) není ze source frontendu strukturovaně vidět.
- **Referenční model** – dlaždice „Referenční model" naviguje na `/reference-model` (2 obrázky); její zařazení mezi RQU004 a RQU007 je orientační.
- **News / novinky** – panel novinek na nástěnce je zde zmíněn pouze referenčně; detailní model je předmětem RQU008.
- **Autentizace** – přihlašování, správa relace a Keycloak/IdM integrace (`coco/idm`) nejsou předmětem této analýzy frontendu.
