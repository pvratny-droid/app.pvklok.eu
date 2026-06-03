# Aplikační architektura

Aplikační vrstva popisuje **softwarové komponenty** aplikace C3 HUB (jednostránková aplikace – SPA COCO), jejich vzájemnou **spolupráci**, **aplikační služby**, které poskytují, a **datové objekty**, s nimiž pracují.

```plantuml file=diagrams/archimate_application_cooperation.puml
```

---

## Aplikační komponenty

### Vstup a kontext (SPA shell)

| Komponenta | Popis | Zdroj |
|---|---|---|
| **Nástěnka (Dashboard)** | Úvodní rozcestník – dlaždice modulů ve dvou panelech (Formuláře SVŘ / Ostatní dokumenty), panel novinek. | RQU001 `DashboardPage` |
| **Hlavní menu + Uživatelský kontext** | Horní lišta s přihlášeným uživatelem, profil, změna hesla, jazyk CZ/EN. | RQU001 `MainMenu`, `UserContext` |
| **Panel notifikací** | Pro administrátora počet čekajících Patch Requestů s odkazem na jejich přehled. | RQU001 |

### Funkční moduly

| Komponenta | Popis | Zdroj |
|---|---|---|
| **Modul Karty míst velení** | Grid karet MV, detail, editace specifikace, struktura velení, exporty. | RQU002 |
| **Modul Mise / operace / cvičení** | Přehled misí, editace, informační interakce, C2 vazby, vizualizace. | RQU003 |
| **Modul Model SVŘ** | `ModelPage` + `ElementsTable` + `ElementDialog` – přehledy per stereotyp, globální vyhledávání, editace překladů a vztahů. | RQU004 |
| **Katalog služeb (CIS)** | Podčást Modelu SVŘ – 4 kategorie (SRV, APL, CISAPP, CISDEV), read-only vs. editovatelné. | RQU005 |
| **Modul Patch Request** | Přehled a detail patch requestů, potvrzení / zamítnutí změn. | RQU004 |
| **Referenční přehledy** | Společné/bojové funkce, taxonomie C3 schopností, požadavky a omezení MV, metamodel. | RQU006, RQU007 |
| **Provozní formuláře** | Panel novinek, administrace novinek, návody a manuály. | RQU008 |
| **Evidence osob** *(chystané)* | Seznam osob, obsazení pozic, zapojení do misí. | RQU009 |

---

## Aplikační služby (vybrané)

| Služba | Co poskytuje | Využívají |
|---|---|---|
| **Element pipeline (CRUD prvků modelu)** | Vytvoření, editace a duplikace prvků modelu přes sdílený `ElementContent`/`ElementDialog`. | Modul Model SVŘ, Katalog služeb, Číselníky (RQU010) |
| **Schvalování změn (Patch Request API)** | Založení patch requestu (`createRelationshipPatchRequest`), `:approve`, `:reject`. | Modul Patch Request |
| **Generování exportů (PDF / XLSX)** | Reporty karet MV, rozšířené karty, CIS matice misí. | Karty MV, Mise |
| **Vizualizace grafů (IER / C2)** | Grafy informačních toků a velitelských vazeb (vč. integrace s ArchiRepo). | Karty MV, Mise, Model SVŘ |
| **Lokalizace a překlady CS/EN** | Dvojjazyčné rozhraní a údržba překladů prvků. | Všechny moduly, zvl. Model SVŘ |

---

## Datové objekty

| Objekt | Popis | Odpovídá byznys objektu |
|---|---|---|
| **ElementDto** | Generická perzistovaná entita prvku modelu (17 stereotypů). | Prvek modelu SVŘ |
| **Karta MV** | Perzistovaná specifikace místa velení. | Místo velení |
| **Mise** | Perzistovaná mise s interakcemi a vazbami. | Mise |
| **PatchRequestDto** | `RelationshipPatchRequestCreateDto` se seznamy `toAdd`, `toDelete`, `elementsToCreate`. | Patch Request |

---

## Klíčové vazby spolupráce

- **Nástěnka** je vstupní bod – naviguje do všech funkčních modulů.
- **Modul Karty MV** a **Modul Mise** čtou doménové prvky (MCA, IER, IP, TIN, MV) z **Modulu Model SVŘ**.
- **Modul Model SVŘ** (a Katalog služeb) **nezapisuje změny vztahů přímo** – navrhuje je přes **Modul Patch Request**.
- **Evidence osob** *(chystané)* obsazuje pozice na MV a zapojuje osoby do misí – proto čerpá z modulů Karty MV a Mise.
- Společné aplikační služby (**Element pipeline**, **exporty**, **grafy**, **i18n**) jsou sdílené napříč moduly.
