# Přehled architektury C3 HUB

Tento dokument je **architektonický přehled aplikace C3 HUB / COCO** – nástroje pro velitelské a štábní řízení (Command, Control & Consult Hub). Není to dílčí požadavková analýza, ale **syntéza** napříč dílčími analýzami **RQU001–RQU010**, převedená do notace **ArchiMate** s důrazem na **business architekturu** (co aplikace dělá pro své uživatele).

> **Pozor na dvojí rovinu „modelu".** C3 HUB je nástroj, který sám **spravuje** doménový (ArchiMate) model SVŘ – 17 stereotypů prvků a 9 typů vztahů (viz [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md)). Tento přehled popisuje **architekturu samotné aplikace** (její business, aplikační a technologickou vrstvu), **ne** obsah doménového modelu, který aplikace eviduje. Doménové prvky (Karta MV, IER, IP, TIN…) zde vystupují jen jako *business objekty*, s nimiž aplikace pracuje.

## Vrstvený přehled

```plantuml file=diagrams/archimate_layered.puml
```

Diagram výše ukazuje reprezentativní výřez napříč všemi vrstvami a směr realizace **shora dolů**: motivace → business služby a procesy → aplikační komponenty a služby → technologie a integrace.

---

## Co dokument obsahuje

Záložky jsou řazené dle vrstev ArchiMate shora dolů (Motivace → Business → Aplikační → Technologická):

| Záložka | Vrstva ArchiMate | Obsah |
|---|---|---|
| **Přehled** | — | Tento úvod + vrstvený přehledový diagram. |
| **Motivace** | Motivation | Stakeholdeři, drivery, cíle (agregace C0x), reprezentativní požadavky. |
| **Business architektura** | Business | Aktéři a role, byznys služby (10 schopností aplikace), klíčové procesy (Patch Request, překlady, životní cyklus mise, exporty), byznys objekty. **Hlavní důraz.** |
| **Aplikační architektura** | Application | Komponenty SPA (nástěnka, moduly, Patch Request) a jejich spolupráce, aplikační služby, datové objekty. |
| **Technologie a integrace** | Technology | Nasazení SPA + backend COCO, databáze, integrace na ArchiRepo a tracker. |

---

## Zdroje (dílčí analýzy)

Přehled agreguje tyto reverse-engineering analýzy aplikace C3 HUB:

| RQU | Modul | Hlavní příspěvek do architektury |
|---|---|---|
| [RQU001](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/README.md) | Souhrn aplikace | Nástěnka, hlavní menu, uživatelský kontext, integrace |
| [RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/README.md) | Karty míst velení | Evidence MV, specifikace, struktura velení, exporty |
| [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/README.md) | Mise / operace / cvičení | Mise, informační interakce, C2 vazby, životní cyklus |
| [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/README.md) | Model SVŘ | Doménový model (17 stereotypů), Patch Request workflow, překlady |
| [RQU005](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/README.md) | Katalog služeb | CIS služby a prostředky (read-only vs. editovatelné) |
| [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/README.md) | Společné / bojové funkce | Referenční doktrinální přehledy + vazba na PI |
| [RQU007](../../RQU007%20-%20C3%20schopnosti%20a%20pozadavky/analyza-md/README.md) | C3 schopnosti, požadavky a omezení | Poster taxonomie, referenční seznamy požadavků/omezení MV |
| [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md) | Provozní formuláře | Novinky (lifecycle, přečtení), návody a manuály |
| [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/README.md) | Evidence osob *(chystané)* | Doménová entita Osoba, obsazení pozic, zapojení do misí |
| [RQU010](../../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/analyza-md/README.md) | Číselníky požadavků a omezení | Požadavky/omezení MV jako stereotypy Elementu, lifecycle |

---

## Metoda a notace

- **Notace:** ArchiMate 3 (vrstvy Motivation / Business / Application / Technology). Diagramy jsou v **PlantUML** s nativní `archimate` syntaxí, vykreslené lokálním enginem vieweru (offline).
- **Granularita:** přehledová. Diagramy ukazují **reprezentativní** prvky a vazby, ne úplný výčet – ten je v dílčích RQU analýzách.
- **Barevná konvence ArchiMate:** žlutá = business, modrá = application, zelená = technology, fialová = motivation.

> **Otevřené body.** Detailní matice rolí a oprávnění (kdo smí které akce) není ze zdrojového kódu frontendu strukturovaně čitelná – `UserRoleResolver` exponuje jen predikát `isAdministrator`; návrh je předmětem [NRQ002 – Role a oprávnění](../../NRQ002%20-%20Role%20a%20opravneni/analyza-md/README.md). RQU009 (Evidence osob) je zatím **návrhová** (chybí zdrojový kód) – v business vrstvě je proto vedena jako chystaná služba.
