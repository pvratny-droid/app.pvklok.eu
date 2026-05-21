# Předběžný návrh změny — Role a oprávnění C3HUB

> **Status:** `proposal` · **Kód:** NRQ002 · **Datum:** 2026-05-21 · **Autor:** Petr Vratný
> **Zdrojový podklad:** `src/C3HUB/Role a práva/C3HUB_UseCases_Role_Opravneni.docx (1).md` (verze 3.4 wip, 14. 5. 2026)
> **Dotčené analýzy:** RQU001–RQU010 (průřezově) + doporučení nové `complete` analýzy pro modul Administrace/IAM

---

## Legenda značek

| Značka | Význam (matice oprávnění / UC / GUI) | Značka | Význam (datový rozsah) |
|---|---|---|---|
| `✔` | plný přístup | `ANO` | přístup |
| `●` | podmíněný přístup | `PODM.` | podmíněně |
| `○` | jen čtení / pasivní zobrazení | `*(odl.)*` | odloženo |
| `—` | bez přístupu | `—` | bez přístupu |
| `?` | **neodvoditelné ze zdroje → viz Otevřené otázky** | | |

### Původ obsahu — vyznačeno odznakem u každé tabulky a matice

| Odznak | Původ obsahu |
|---|---|
| 🟩 **ZDROJ** | Převzato 1:1 ze zdrojového dokumentu v3.4 — **výchozí prvky**. |
| 🟦 **DERIVACE** | Odvozeno dle zdokumentovaného pravidla ze zdroje + existujících analýz RQU001–RQU010. |
| 🟧 **NÁVRH** | Návrh nad rámec zdroje v3.4 — vyžaduje potvrzení. |

---

## 1. Cíl změny

Zavést do systému C3HUB **model aplikačních rolí a oprávnění (RBAC)** dle zdrojového
dokumentu „C3HUB – Use Cases, Role a Oprávnění" (verze 3.4 wip). Cílem je, aby C3HUB při
každém požadavku vyhodnocoval **dvě nezávislé dimenze přístupu**:

1. **Aplikační oprávnění** — *co* uživatel smí dělat (zakládat MV, editovat mise,
   schvalovat prvky modelu apod.);
2. **Datový rozsah** — *na kterých datech* (MV, mise, model SVŘ) tu akci smí provést,
   odvozeno z pozice uživatele ve velitelské hierarchii.

Tento návrh **nezavádí novou funkcionalitu do existujících analýz** — mapuje, kterým
**aktérům (rolím)** patří už zanalyzované Use Case a GUI prvky napříč RQU001–RQU010, a
definuje **cílovou strukturu** a **rozsah zadání pro vývoj** RBAC subsystému. Po schválení
vznikne samostatná `complete` analýza modulu Administrace/IAM, resp. se upřesní pole
*Aktér* v dotčených RQU.

## 2. Motivace

- **Bezpečnost a auditovatelnost.** C3HUB drží citlivá data o místech velení (MV),
  schopnostech a misích. Bez rolí a oprávnění nelze omezit, kdo data vidí a mění, ani
  doložit, kdo k nim přistoupil.
- **Dvouvrstvý model je závazný předpoklad.** Zdroj (§1) stanovuje, že aplikační
  oprávnění a datový rozsah jsou *nezávislé* a *vyhodnocují se společně při každém
  požadavku*. To je architektonické zadání, které musí návrh respektovat.
- **Napojení na Active Directory.** Na jednání 14. 5. 2026 bylo odsouhlaseno přihlašování
  přes AD (zdroj UC-08, §9.1). C3HUB identity nespravuje — pouze přijímá informaci o roli
  a org. zařazení.
- **Chráněná místa velení.** Zdroj (§8) označuje implementaci chráněných MV jako
  *prioritu č. 1 pro příští iteraci* — RBAC model musí s touto kategorií počítat od začátku.
- **Auditní stopa místo schvalování.** Zamítnutí UC-10 (§9.2) přesouvá ochranu dat z
  procesu schvalování na auditní stopu a bezpečnostní alerting — to je funkční požadavek
  na RBAC subsystém.

## 3. Východiska a omezení podkladu

Zdrojový dokument je **nezávisle vytvořený** (mimo interní metodiku) a slouží jako
**závazná textová specifikace** rolí a oprávnění. Při zpracování platí:

- **Status zdroje:** *verze 3.4 wip*, *interní pracovní dokument*. Některá rozhodnutí
  jsou výslovně odložená nebo otevřená.
- **Stav dotčených analýz:** RQU001–RQU008 a RQU010 popisují **již implementovanou**
  aplikaci C3HUB — vznikly **reverse-engineeringem kódu**; stav „k revizi" znamená jen
  ověřování proti aktuálnímu stavu aplikace, nikoli rozpracovaný návrh. Rozpracovaná
  (návrhová, dosud neimplementovaná) je pouze **RQU009** (evidence osob). Zavedení RBAC
  je proto **retrofit do běžící aplikace**, ne tvorba na zelené louce — viz kap. 10 a 12.
- **UC ve zdroji nejsou na úrovni detailu analýz dle interní metodiky.** Zdroj sám uvádí (ř. 25):
  *„Výčet je úvodní a není kompletní."* Use Case UC-01…UC-14 zde slouží k vymezení
  **oblastí**, do nichž oprávnění a role patří — ne jako jednotlivé scénáře. Tento návrh
  je proto mapuje na **jemné UC** existujících analýz RQU001–RQU010 (crosswalk, kap. 8b).
- **Terminologie není finální.** Zdroj (ř. 472): termín *„aplikační role"* bude
  přejmenován, aby se odlišil od rolí v modelu SVŘ (FMN). Návrh termín zatím přebírá.
- **Princip striktní věrnosti.** Obsah tohoto návrhu vzniká **jen** ze zdrojového
  dokumentu a z existujících analýz C3HUB. Kde je zdroj němý nebo vnitřně rozporný,
  položka se **neřeší dohadem** — značí se `?` a zapisuje do *Otevřených otázek* (kap. 14).
- **Tři tabulky zdroje se mírně rozcházejí.** Karty rolí (§3), matice oprávnění (§4) a
  matice datového rozsahu (§5) nejsou ve 100 % shodě. Zjištěné rozpory jsou vyznačeny
  poznámkami pod maticemi a shrnuty v kap. 14.

## 4. Model rolí

🟩 **ZDROJ** — katalog 8 rolí převzat 1:1 ze zdroje, §3.

Zdroj definuje **8 aplikačních rolí**. Role nejsou hierarchické (žádná nedědí od jiné);
liší se typem práce, opěrným bodem a datovým rozsahem. Převzato 1:1 ze zdroje §3.

| Role | Název | Stručný popis | Typické osoby | Pokryté oblasti (UC zdroje) |
|---|---|---|---|---|
| **ROLE-01** | Vedoucí organizačního celku | Zakládá a spravuje kartu MV vlastního OC; odpovídá za úplnost a aktuálnost dat svého MV. | Velitel útvaru, náčelník štábu, ředitel sekce | UC-01, UC-02, UC-05, UC-07, UC-11, UC-13, UC-14 |
| **ROLE-02** | Všeobecný plánovač | Pracuje s informačními toky, schopnostmi a technologiemi napříč více MV. Nová MV nezakládá, existující edituje. | Náčelník štábu, informační manažer, náčelník KIS | UC-01 (editace), UC-02, UC-05, UC-07, UC-11, UC-13 |
| **ROLE-03** | Plánovač a správce mise | Vytváří, upravuje a finalizuje mise; ke schopnostem MV přistupuje přímo. Karty MV needituje. | Plánovač operací, operační důstojník, J5/G5 | UC-03, UC-07 (mise), UC-11, UC-13, UC-14 (čtení) |
| **ROLE-04** | Správce schopností SVŘ / Garant PI | Odborný garant PI v oblasti odpovědnosti; zajišťuje konzistenci a edituje CZ překlady. | Odborný garant PI (J6, J2…), informační architekt domény | UC-04, UC-05, UC-07 (čtení), UC-11, UC-13 |
| **ROLE-05** | Architekt / správce modelu SVŘ | Spravuje celý model SVŘ, schvaluje nové prvky, aplikuje aktualizace modelu. | Architekt C3/SVŘ, správce odborného obsahu | UC-05 (schválení), UC-06, UC-07, UC-11 |
| **ROLE-06** | Čtenář | Manažer s rozhodovací pravomocí; potřebuje přehled, neprovádí editace. | Člen generálního štábu, senior officer | UC-07 (čtení), UC-11, UC-13 |
| **ROLE-07** | Správce infrastruktury | Technické zajištění přihlašování a správy identit přes AD; přístup k logům. **Není uživatelem aplikace C3HUB.** | IT správce infrastruktury, administrátor systémů | UC-08, UC-09 |
| **ROLE-08** | Provozní administrátor ★ nová | Administrativní a provozní chod C3HUB: přiřazení uživatelů, org. zařazení, (budoucí) delegace. | Správce aplikace C3HUB, provozní administrátor | UC-09, UC-12, UC-11, UC-13 (po implementaci) |

**Poznámky ke zdroji:**

- ROLE-08 je v3.4 **nová** — oddělená od ROLE-05; provozně-administrativní oprávnění
  přesunuta z ROLE-05 do ROLE-08 (zdroj §9.1).
- ROLE-05 a ROLE-08 mohou být kumulovány v jedné osobě, nebo rozděleny (zdroj ř. 326).
- **Delegace** (sloupec ve zdroji §3) je u všech rolí *odložena* — viz UC-13 a kap. 12.

## 5. Katalog oprávnění (hybrid)

Dle rozhodnutí zadání: katalog kombinuje **(a)** oprávnění z matice §4 zdroje jako
*skupiny* a **(b)** *návrh* jemnějšího rozpadu tam, kde je skupinové oprávnění pro
implementaci příliš hrubé.

### 5a. Skupinová oprávnění ze zdroje (matice §4) — 1:1

🟩 **ZDROJ** — 14 oprávnění převzato 1:1 z matice §4 zdroje.

Matice oprávnění §4 zdroje obsahuje **14 řádků oprávnění**:

| # | Oprávnění (skupina) | Kód (návrh) | Modul |
|---|---|---|---|
| 1 | Číst model SVŘ | `MODEL_READ` | Model SVŘ |
| 2 | Číst karty MV | `MV_READ` | Karty MV |
| 3 | Zakládat MV | `MV_CREATE` | Karty MV |
| 4 | Editovat MV (vlastní + podřízené) | `MV_EDIT` | Karty MV |
| 5 | Navrhovat prvky modelu | `MODEL_PROPOSE` | Model SVŘ |
| 6 | Schvalovat prvky modelu | `MODEL_APPROVE` | Model SVŘ |
| 7 | Editovat překlady PI/FMN | `MODEL_TRANSLATE` | Model SVŘ |
| 8 | Vytvářet / editovat mise | `MISE_EDIT` | Mise |
| 9 | Přístup ke kartě mise (UC-14) | `MISE_CARD_OWNER` | Mise |
| 10 | Generovat reporty PDF | `REPORT_GEN` | Reporty |
| 11 | Přiřazovat org. zařazení | `ORG_ASSIGN` | Administrace |
| 12 | Správa delegací *(odloženo)* | `DELEG_MANAGE` | Administrace |
| 13 | Technické přihlašování / AD | `AUTH_CONFIG` | Administrace |
| 14 | Přístup k logům aplikace | `LOG_READ` | Administrace |

### 5b. Oprávnění zmíněná jen v kartách rolí §3 (mimo matici §4) — k odsouhlasení

🟩 **ZDROJ** — oprávnění pocházejí z karet rolí §3 zdroje (chybí ale v matici §4).

Karty rolí §3 zmiňují oprávnění, která **nejsou řádkem matice §4**. Nelze rozhodnout, zda
jde o opomenutí matice, nebo o záměrně neformalizovaná oprávnění → **Otevřená otázka O-3**.
Návrh je eviduje jako kandidáty:

| Oprávnění (zmíněno v §3) | Role | Kód (návrh) | Pozn. |
|---|---|---|---|
| Správa katalogu služeb | ROLE-01, ROLE-02, ROLE-05 | `KATALOG_MANAGE` | Chybí v §4; ROLE-01/02 jako „ANO" v kartách |
| Konfigurovat mapování aplikačních oprávnění | ROLE-05 | `PERM_MAPPING_CONFIG` | Chybí v §4; meta-oprávnění správy RBAC |
| Editovat karty MV — technická oprava chyb | ROLE-05 | (= `MV_EDIT` podmíněně) | §4 řeší jako `●` u řádku 4 |
| Kopírovat mise (od v2.3) | ROLE-03 | (= `MISE_EDIT`) | Dílčí operace skupiny `MISE_EDIT` |
| Číst schopnosti všech MV | ROLE-03 | — | Spíše **datový rozsah** (§5) než aplikační oprávnění |

### 5c. Návrh jemnějšího rozpadu (CRUD per modul) — návrh pro vývoj

🟧 **NÁVRH** — jemnější rozpad nad rámec zdroje, k odsouhlasení.

Tam, kde je skupinové oprávnění pro kontrolu v kódu příliš hrubé, návrh doporučuje jemná
oprávnění **odvozená z jemných UC existujících analýz**. Rozpad je **návrh k odsouhlasení**;
jeho úplné napojení na role je předmětem jemné matice (kap. 6b, po kontrolním bodu).

| Skupina | Jemná oprávnění (návrh) | Odvozeno z jemných UC |
|---|---|---|
| `MV_EDIT` | `MV_EDIT_SPEC` (specifikace), `MV_EDIT_CAPABILITIES` (schopnosti), `MV_MANAGE_FLOWS` (informační toky/FMN), `MV_MANAGE_COMMAND` (struktura velení), `MV_MANAGE_SUBORDINATES` (podřízená MV), `MV_IMPORT_INTERACTIONS` (import interakcí) | RQU002 UC013, UC015, UC016/UC020a-c, UC014, UC019, UC023 |
| `MISE_EDIT` | `MISE_CREATE`, `MISE_EDIT_DETAIL`, `MISE_DUPLICATE`, `MISE_INVALIDATE`/`MISE_RESTORE`, `MISE_PLAN_IER`, `MISE_MANAGE_C2` | RQU003 UC025–UC031 |
| `MODEL_*` | `MODEL_ELEMENT_CREATE`, `MODEL_ELEMENT_DUPLICATE`, `MODEL_PATCH_PROPOSE`, `MODEL_PATCH_DECIDE`, `MODEL_TRANSLATE` | RQU004 UC038, UC039, UC041, UC043, UC040 |
| `REPORT_GEN` | `REPORT_MV`, `REPORT_MISE`, `REPORT_CIS_MATRIX` | RQU002 UC017/UC021/UC022, RQU003 UC033/UC034 |
| `KATALOG_*` | `KATALOG_READ`, `KATALOG_ELEMENT_CREATE` | RQU005 UC047–UC049 |
| `CISELNIK_*` | `CISELNIK_READ`, `CISELNIK_ITEM_MANAGE` (zrušit/aktivovat/smazat) | RQU010 UC065–UC071 |
| `OSOBY_*` | `OSOBY_READ`, `OSOBY_MANAGE`, `OSOBY_ASSIGN_POSITION` | RQU009 UC061–UC064 |

> **Pozn.:** Modul **Číselníky** (RQU010) a **Osoby** (RQU009) nejsou ve zdroji
> samostatně rozebrány — jemná oprávnění výše jsou *návrh*; jejich přidělení rolím je
> **Otevřená otázka O-5**.

## 6. Matice Role × Oprávnění

### 6a. Skupinová matice — 1:1 ze zdroje §4

🟩 **ZDROJ** — matice převzata 1:1 z §4 zdroje.

Pořadí sloupců odpovídá ROLE-01 … ROLE-08.

| Oprávnění \ Role | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Číst model SVŘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| Číst karty MV | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| Zakládat MV | ✔ | — | — | — | ● | — | — | — |
| Editovat MV (vlastní + pod.) | ✔ | ✔ | — | — | ● | — | — | — |
| Navrhovat prvky modelu | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| Schvalovat prvky modelu | — | — | — | — | ✔ | — | — | — |
| Editovat překlady PI/FMN | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| Vytvářet / editovat mise | — | — | ✔ | — | — | — | — | — |
| Přístup ke kartě mise (UC-14) | ✔ | — | ✔ | — | — | — | — | — |
| Generovat reporty PDF | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| Přiřazovat org. zařazení | — | — | — | — | — | — | — | ✔ |
| Správa delegací *(odloženo)* | ● | ● | ● | ● | — | — | — | ✔ |
| Technické přihlašování / AD | — | — | — | — | — | — | ✔ | — |
| Přístup k logům aplikace | — | — | — | — | ✔ | — | ✔ | ✔ |

> **Rozpor R-1:** §3 (karta ROLE-04) uvádí „UC-07 (čtení)", ale §4 dává ROLE-04 u
> „Generovat reporty PDF" hodnotu `—`. Návrh přebírá `—` z matice §4. → Otevřená otázka O-2.

### 6b. Jemná (hybridní) matice Role × Oprávnění

🟦 **DERIVACE** — odvozeno z jemné matice 8c dle pravidla (sloupce rolí jsou ze zdroje).

Přidělení **jemných oprávnění** z kap. 5c rolím. Hodnoty derivovány z jemné matice
Aktér × UC (kap. 8c) — každé jemné oprávnění odpovídá konkrétní operaci jemného UC.
ROLE-07 a ROLE-08 mají u všech datových oprávnění `—` (nejsou uživateli dat aplikace).

| Jemné oprávnění | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| `MV_EDIT_SPEC` (specifikace MV) | ✔ | ✔ | — | — | ● | — | — | — |
| `MV_EDIT_CAPABILITIES` (schopnosti MV) | ✔ | ✔ | — | — | ● | — | — | — |
| `MV_MANAGE_FLOWS` (informační toky / FMN) | ✔ | ✔ | — | — | ● | — | — | — |
| `MV_MANAGE_COMMAND` (struktura velení) | ✔ | ✔ | — | — | ● | — | — | — |
| `MV_MANAGE_SUBORDINATES` (podřízená MV) | ✔ | ✔ | — | — | ● | — | — | — |
| `MV_IMPORT_INTERACTIONS` (import interakcí) | ✔ | ✔ | — | — | ● | — | — | — |
| `MISE_CREATE` (vytvořit misi) | — | — | ✔ | — | — | — | — | — |
| `MISE_EDIT_DETAIL` (editovat detail mise) | — | — | ✔ | — | — | — | — | — |
| `MISE_DUPLICATE` (duplikovat misi) | — | — | ✔ | — | — | — | — | — |
| `MISE_INVALIDATE` / `MISE_RESTORE` | — | — | ✔ | — | — | — | — | — |
| `MISE_PLAN_IER` (plánovat interakce mise) | — | — | ✔ | — | — | — | — | — |
| `MISE_MANAGE_C2` (velitelské vazby C2) | — | — | ✔ | — | — | — | — | — |
| `MODEL_ELEMENT_CREATE` (vytvořit prvek) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| `MODEL_ELEMENT_DUPLICATE` (duplikovat prvek) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| `MODEL_PATCH_PROPOSE` (navrhnout změnu vztahů) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| `MODEL_PATCH_DECIDE` (rozhodnout o patch req.) | — | — | — | — | ✔ | — | — | — |
| `MODEL_TRANSLATE` (editovat překlady) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| `REPORT_MV` (report karty MV) | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| `REPORT_CIS_MATRIX_MV` (CIS matice MV) | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| `REPORT_MISE` (report mise) | ● | — | ✔ | — | ✔ | ✔ | — | — |
| `REPORT_CIS_MATRIX_MISE` (CIS matice mise) | — | — | ✔ | — | ✔ | ✔ | — | — |
| `KATALOG_READ`, `KATALOG_ELEMENT_CREATE` | ? | ? | ? | ? | ? | ? | — | — |
| `CISELNIK_READ`, `CISELNIK_ITEM_MANAGE` | ? | ? | ? | ? | ? | ? | — | — |
| `OSOBY_READ`, `OSOBY_MANAGE`, `OSOBY_ASSIGN_POSITION` | ? | ? | ? | ? | ? | ? | — | — |

> **Pozn.:** `●` u ROLE-05 (`MV_*`) = jen technická oprava chyb (zdroj §3, karta ROLE-05).
> `●` u ROLE-01 (`REPORT_MISE`) = jen za vlastní MV v misi (zdroj UC-14). Oprávnění
> modulů Katalog služeb / Číselníky / Osoby = `?` — zdroj je neřeší (Otevřené otázky O-3, O-5).

## 7. Datový rozsah (2. dimenze přístupu)

Datový rozsah je **nezávislá dimenze** — určuje, *na kterých* MV / datech smí role
provést akci povolenou aplikačním oprávněním. Odvozuje se z **org. zařazení** uživatele.

### 7a. Atributy org. zařazení (zdroj §8)

🟩 **ZDROJ** — atributy org. zařazení dle §8 zdroje.

| Atribut | Hodnoty / vliv |
|---|---|
| **Velitelská úroveň** | Strategická / Operační / Taktická — určuje dosah nahoru a dolů ve velitelské hierarchii. |
| **Doména** | Navržen, ale *neimplementován*. Datový rozsah se odvozuje výhradně z velitelské hierarchie. *(odloženo)* |
| **Přiřazená MV** | Konkrétní seznam MV odvozený od velitelské úrovně. |

Org. zařazení konfiguruje **ROLE-08** přes UC-12. Změna role (UC-09) a změna datového
rozsahu (UC-12) jsou **nezávislé operace**.

### 7b. Chráněná místa velení (chráněnky)

Zvláštní kategorie **mimo standardní hierarchické filtrování** (zdroj §8): chráněné MV
jsou zařazené v org. struktuře, ale pro ostatní neviditelné bez ohledu na hierarchii.
Přístup ke konkrétní chráněnce vyžaduje **explicitní přiřazení práv**. V datových tocích
chráněného MV se zobrazuje pouze **anonymizovaná reference** (název, kontaktní osoba);
v misi je chráněné MV zobrazeno anonymizovaně. Implementace = priorita č. 1 příští iterace.
Rozšiřující návrh (kap. 11c) modeluje chráněnku jako **doménu režimu `CHRÁNĚNÁ`**.

### 7c. Matice Role × Datový rozsah — 1:1 ze zdroje §5

🟩 **ZDROJ** — matice převzata 1:1 z §5 zdroje.

`Typ`: Č = čtení, Z = zápis, D = doménové omezení.

| Typ | Datový rozsah \ Role | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|:--:|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Č | Vlastní MV – čtení | ANO | ANO | ANO | — | ANO | ANO | — | — |
| Z | Vlastní MV – zápis | ANO | ANO | — | — | PODM. | — | — | — |
| Č | Podřízená MV – čtení | ANO | ANO | ANO | — | ANO | ANO | — | — |
| Z | Podřízená MV – zápis (1 úroveň) | PODM. | PODM. | — | — | PODM. | — | — | — |
| Č | Nadřízené MV +1 – čtení | ANO | ANO | ANO | — | ANO | ANO | — | — |
| Č | Nadřízené MV +2 – čtení | — | ANO | ANO | — | ANO | ANO | — | — |
| Č | Jiné MV (mise) – čtení | — | — | ANO | — | ANO | — | — | — |
| Č | Model SVŘ – čtení | ANO | ANO | ANO | ANO | ANO | ANO | — | — |
| Z | Model SVŘ – zápis | — | — | — | PODM. | ANO | — | — | — |
| D | Omezení doménou | *(odl.)* | *(odl.)* | *(odl.)* | *(odl.)* | — | — | — | — |
| Č | Chráněná MV – čtení | PODM. | PODM. | PODM. | — | PODM. | PODM. | — | — |
| Č | Logy aplikace – čtení | — | — | — | — | ANO | — | ANO | ANO |

> **Pozn.:** Chráněná MV — `PODM.` znamená přístup *pouze* při explicitním přiřazení
> práv ke konkrétní chráněnce; hierarchická pozice na to nemá vliv.

## 8. Matice Aktér × Use Case

### 8a. Hrubá matice — 8 rolí × 13 UC-oblastí zdroje (1:1 ze zdroje §2–§4)

🟩 **ZDROJ** — konsolidace tabulek §2 / §3 / §4 zdroje (rozpory vyznačeny poznámkami).

Hodnoty odvozeny z výčtu aktérů jednotlivých UC (§2), karet rolí (§3) a matice §4.

| UC-oblast zdroje | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC-01 Vytvoření a správa karty MV | ✔ | ● | — | — | ● | — | — | — |
| UC-02 Pohled přes nadřízené MV (synchr. IER/TIN) | ✔ | ✔ | — | — | — | — | — | — |
| UC-03 Plánování a správa misí | — | — | ✔ | — | — | — | — | — |
| UC-04 Správa schopností a PI v modelu SVŘ | — | — | — | ✔ | — | — | — | — |
| UC-05 Návrh nového prvku modelu SVŘ | ✔ | ✔ | — | ✔ | ✔ ⁵ | — | — | — |
| UC-06 Schválení a správa modelu SVŘ | — | — | — | — | ✔ | — | — | — |
| UC-07 Generování reportů a karet MV (PDF) | ✔ | ✔ | ✔ | — ¹ | ✔ | ✔ | — | — |
| UC-08 Konfigurace přihlašování / AD | — | — | — | — | — | — | ✔ | — |
| UC-09 Přiřazení uživatele k aplikační roli | — | — | — | — | — | — | ✔ | ✔ |
| UC-11 Přihlášení uživatele do C3HUB | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — ² | ✔ |
| UC-12 Správa org. zařazení uživatele | — | — | — | — | — | — | — | ✔ |
| UC-13 Delegace oprávnění *(odloženo)* | ● | ● | ● | ● | — | — | — | ✔ ³ |
| UC-14 Přístup vlastníka MV ke kartě mise | ✔ | — | ✔ ⁴ | — | — | — | — | — |

**Poznámky a rozpory:**

- ¹ `—` u ROLE-04 / UC-07 přebírá hodnotu z matice §4 („Generovat reporty PDF" = `—`),
  ač karta ROLE-04 §3 uvádí „UC-07 (čtení)". → Otevřená otázka **O-2**.
- ² ROLE-07 *není uživatelem aplikace C3HUB* (zdroj ř. 308, 315) — do aplikace se
  nepřihlašuje; UC-11 se jí proto netýká.
- ³ U UC-13 plní ROLE-08 roli **schvalovatele/správce** delegací; ROLE-01–04 vystupují
  jako delegant/delegát (`●`, odloženo). Celá oblast je odložená (zdroj §9.3).
- ⁴ ROLE-03 u UC-14 = **jen čtení** (karta ROLE-03 §3, matice §4 „Přístup ke kartě mise"
  = `✔`). §2 (UC-14, ř. 129) uvádí jako aktéra pouze ROLE-01 → drobný rozpor, řešeno
  ve prospěch §3/§4. → Otevřená otázka **O-2**.
- ⁵ ROLE-05 u UC-05 vystupuje jako **schvalovatel** návrhu (karta ROLE-05 §3:
  „UC-05 (schválení)"), ne jako navrhovatel.

### 8b. Crosswalk: UC-oblast zdroje → RQU → jemné UC

🟦 **DERIVACE** — mapování oblastí zdroje na jemné UC existujících analýz.

Mapování hrubých oblastí zdroje na **jemné Use Case existujících analýz** C3HUB
(RQU001–RQU010). Toto je **základ pro jemné matice** (kap. 8c, 9) — slouží jako kontrolní
bod před jejich derivací. Mapování je odvozeno z názvů a tematického zařazení jemných UC;
sporné případy jsou označeny.

| UC-oblast zdroje | Dotčená RQU | Jemné UC (existující analýzy) |
|---|---|---|
| **UC-01** Vytvoření a správa karty MV | RQU002 | UC010 Vyhledat MV, UC011 Přepnout zobrazení, UC012 Otevřít detail karty MV, UC013 Editovat specifikaci MV, UC014 Spravovat strukturu velení, UC015 Editovat formulář schopností MV, UC016 Spravovat informační toky a FMN instrukce, UC018 Přidat nové místo velení, UC019 Spravovat podřízená MV, UC020a/b/c Přidat IER/IP/FMN instrukci |
| **UC-02** Pohled přes nadřízené MV (synchr. IER/TIN) | RQU002 | UC023 Importovat interakce z jiného MV |
| **UC-03** Plánování a správa misí | RQU003 | UC024 Zobrazit přehled misí, UC025 Vytvořit novou misi, UC026 Editovat detail mise, UC027 Duplikovat misi, UC028 Zneplatnit misi, UC029 Obnovit zneplatněnou misi, UC030 Plánovat informační interakce mise, UC031 Spravovat velitelské vazby C2, UC032 Zobrazit graf mise |
| **UC-04** Správa schopností a PI v modelu SVŘ | RQU006, RQU007, RQU004 | RQU006: UC050 Přehled společných funkcí, UC051 Přehled bojových funkcí, UC052 Vazba funkcí na FMN PI · RQU007: UC053 Stáhnout poster taxonomie, UC054 Referenční seznam požadavků, UC055 Referenční seznam omezení · RQU004: UC040 Upravit překlady prvku |
| **UC-05** Návrh nového prvku modelu SVŘ | RQU004 | UC038 Vytvořit nový prvek modelu, UC039 Duplikovat existující prvek, UC041 Navrhnout změnu vztahů (Patch Request) |
| **UC-06** Schválení a správa modelu SVŘ | RQU004 | UC035 Přehled prvků stereotypu, UC036 Přehled prvků Katalogu služeb, UC037 Globální vyhledání v modelu, UC042 Prohlížet patch requesty, UC043 Rozhodnout o patch requestu, UC044 Sousedství prvku v ArchiRepo, UC045 Relevantní MV pro MCA schopnost, UC046 Referenční metamodel |
| **UC-07** Generování reportů a karet MV (PDF) | RQU002, RQU003 | RQU002: UC017 Stáhnout export karty MV, UC021 Generovat report karty MV, UC022 Generovat CIS matici (XLSX) · RQU003: UC033 Generovat CIS matici mise, UC034 Generovat report mise |
| **UC-08** Konfigurace přihlašování / AD | — (nová funkcionalita) | Žádná existující RQU. → modul Administrace/IAM (kap. 11–12) |
| **UC-09** Přiřazení uživatele k aplikační roli | — (nová funkcionalita) | Žádná existující RQU. → modul Administrace/IAM |
| **UC-11** Přihlášení uživatele do C3HUB | RQU001 (částečně) | Přihlášení samotné = nová funkcionalita. Navazující relační UC: RQU001 UC002 Zobrazit profil, UC003 Změnit heslo, UC004 Odhlásit se, UC005 Přepnout jazyk |
| **UC-12** Správa org. zařazení uživatele | — (nová funkcionalita) | Žádná existující RQU. → modul Administrace/IAM |
| **UC-13** Delegace oprávnění *(odloženo)* | — (nová funkcionalita) | Žádná existující RQU. → modul Administrace/IAM (odloženo) |
| **UC-14** Přístup vlastníka MV ke kartě mise | RQU003 | UC024 Zobrazit přehled misí (filtr na vlastní MV), UC032 Zobrazit graf mise (čtení), UC034 Generovat report mise (za vlastní MV) |

**Jemné UC mimo oblasti zdroje** (zdroj je nepokrývá — viz Otevřená otázka **O-4**):

| RQU | Jemné UC bez pokrytí ve zdroji |
|---|---|
| RQU001 | UC001 Navigovat z nástěnky, UC006 Notifikace patch requestů, UC007 Panel novinek, UC008 Otevřít ArchiRepo, UC009 Nahlásit podnět do trackeru |
| RQU005 | UC047 Přehled katalogu služeb, UC048 Vyhledat prvky kategorie, UC049 Vytvořit CIS prvek (souvisí s „Správa katalogu služeb" §3 — viz O-3) |
| RQU008 | UC056–UC059 Správa novinek, UC060 Stáhnout návod/manuál |
| RQU009 | UC061–UC064 Evidence osob na MV a v misích |
| RQU010 | UC065–UC071 Správa číselníků požadavků a omezení |

> **Charakter „obecných" UC:** UC001 (navigace), UC002–UC005 (profil/heslo/jazyk),
> UC007 (novinky) jsou obecné aplikační scénáře dostupné **všem přihlášeným uživatelům**
> (ROLE-01…ROLE-06, ROLE-08; nikoli ROLE-07, která se do aplikace nepřihlašuje). Ostatní
> UC bez pokrytí (RQU005/008/009/010, UC006/008/009) **zdroj neřeší** — jejich přidělení
> rolím je Otevřená otázka **O-4**.

---

### 8c. Jemná matice Aktér × UC

🟦 **DERIVACE** — všechny dílčí tabulky níže odvozeny dle pravidla; sloupce rolí jsou 🟩 ze zdroje, hodnota `?` značí neodvoditelné.

Mapování 8 rolí na **74 jemných Use Case** analýz RQU001–RQU010. Sloupce = 8 aplikačních rolí
(zkratky jednotné s kap. 6–8; plné názvy viz kap. 4).

**Pravidlo derivace:** typ operace jemného UC → řádek matice oprávnění §4 → množina rolí.
`✔`/`●`/`—` dle §4; `?` = zdroj UC vůbec neřeší (kap. 8b, Otevřená otázka O-4).
Matice oprávnění §4 je při rozporu s výčtem aktérů §2 **nadřazená** (strukturovaný zdroj).

#### RQU001 – Souhrn aplikace

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC001 Navigovat z nástěnky na modul | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| UC002 Zobrazit uživatelský profil | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| UC003 Změnit heslo | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| UC004 Odhlásit se | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| UC005 Přepnout jazyk rozhraní | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| UC006 Zobrazit notifikace patch requestů | ? | ? | ? | ? | ? | ? | — | ? |
| UC007 Zobrazit panel novinek | ? | ? | ? | ? | ? | ? | — | ? |
| UC008 Otevřít ArchiRepo | ? | ? | ? | ? | ? | ? | — | ? |
| UC009 Nahlásit podnět do externího trackeru | ? | ? | ? | ? | ? | ? | — | ? |

> **Obecné aplikační UC:** UC001–UC005 jsou součástí přihlášené relace (navázané na UC-11
> zdroje) → dostupné **všem přihlášeným uživatelům** (ROLE-01–06, ROLE-08; ROLE-07 se do
> aplikace nepřihlašuje). UC006/UC008 (aktér «Administrátor»), UC007 (novinky), UC009
> (podnět) zdroj neřeší → `?` (O-4). UC003 „Změnit heslo" může při SSO/AD odpadnout (O-7).

#### RQU002 – Karty míst velení (R7, R8 = bez přístupu k datům MV)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC010 Vyhledat místo velení | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC011 Přepnout zobrazení (grid / list) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC012 Otevřít detail karty MV | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC013 Editovat specifikaci MV | ✔ | ✔ | — | — | ● | — | — | — |
| UC014 Spravovat strukturu velení | ✔ | ✔ | — | — | ● | — | — | — |
| UC015 Editovat formulář schopností MV | ✔ | ✔ | — | — | ● | — | — | — |
| UC016 Spravovat informační toky a FMN instrukce | ✔ | ✔ | — | — | ● | — | — | — |
| UC017 Stáhnout export karty MV (PDF / XLSX) | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| UC018 Přidat nové místo velení | ✔ | — | — | — | ● | — | — | — |
| UC019 Spravovat podřízená místa velení | ✔ | ✔ | — | — | ● | — | — | — |
| UC020a Přidat IER do MV | ✔ | ✔ | — | — | ● | — | — | — |
| UC020b Přidat IP do MV | ✔ | ✔ | — | — | ● | — | — | — |
| UC020c Přidat FMN instrukci do MV | ✔ | ✔ | — | — | ● | — | — | — |
| UC021 Generovat report karty MV | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| UC022 Generovat CIS matici (XLSX) | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| UC023 Importovat interakce z jiného MV | ✔ | ✔ | — | — | ● | — | — | — |

> `●` u ROLE-05 = technická oprava chyb (zdroj §3, karta ROLE-05). „Zakládat MV" (UC018)
> má ROLE-02 `—` (zakládat smí jen ROLE-01, podmíněně ROLE-05).

#### RQU003 – Mise, operace, cvičení (R2, R4, R7, R8 = bez přístupu k misím)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC024 Zobrazit přehled misí | ● | — | ✔ | — | ✔ | ✔ | — | — |
| UC025 Vytvořit novou misi | — | — | ✔ | — | — | — | — | — |
| UC026 Editovat detail mise | — | — | ✔ | — | — | — | — | — |
| UC027 Duplikovat misi | — | — | ✔ | — | — | — | — | — |
| UC028 Zneplatnit misi | — | — | ✔ | — | — | — | — | — |
| UC029 Obnovit zneplatněnou misi | — | — | ✔ | — | — | — | — | — |
| UC030 Plánovat informační interakce mise | — | — | ✔ | — | — | — | — | — |
| UC031 Spravovat velitelské vazby C2 | — | — | ✔ | — | — | — | — | — |
| UC032 Zobrazit graf mise | ● | — | ✔ | — | ✔ | ✔ | — | — |
| UC033 Generovat CIS matici mise | — | — | ✔ | — | ✔ | ✔ | — | — |
| UC034 Generovat report mise | ● | — | ✔ | — | ✔ | ✔ | — | — |

> `●` u ROLE-01 = přístup ke kartě mise jen pro vlastní MV (zdroj UC-14). ROLE-01 u UC033
> (CIS matice, XLSX) `—`: UC-14 zmiňuje výslovně jen PDF report. ROLE-05/ROLE-06 čtou mise
> dle §5 (řádek „Jiné MV (mise) – čtení", resp. karta ROLE-06 „MV a mise") a generují
> reporty misí dle §3 (ROLE-05 „všechny reporty", ROLE-06 „reporty MV a misí").

#### RQU004 – Model SVŘ – doménové entity (R7, R8 = bez přístupu k modelu)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC035 Otevřít přehled prvků stereotypu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC036 Otevřít přehled prvků Katalogu služeb | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC037 Globální vyhledání v modelu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC038 Vytvořit nový prvek modelu | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| UC039 Duplikovat existující prvek | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| UC040 Upravit překlady prvku | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| UC041 Navrhnout změnu vztahů (Patch Request) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| UC042 Prohlížet patch requesty | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| UC043 Rozhodnout o patch requestu | — | — | — | — | ✔ | — | — | — |
| UC044 Otevřít sousedství prvku v ArchiRepo | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC045 Zobrazit relevantní MV pro MCA schopnost | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC046 Otevřít referenční metamodel | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

> UC042: ROLE-05 vidí všechny patch requesty, ROLE-01/02/04 jen vlastní (zdroj UC-42
> RQU004 — rozsah dle role). UC043 (schválení) = pouze ROLE-05 (zdroj §4 „Schvalovat
> prvky modelu").

#### RQU005 – Katalog služeb (C3 Taxonomy)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC047 Otevřít přehled katalogu služeb | ? | ? | ? | ? | ? | ? | — | — |
| UC048 Zobrazit a vyhledat prvky kategorie | ? | ? | ? | ? | ? | ? | — | — |
| UC049 Vytvořit CIS prvek | ? | ? | ? | ? | ? | ? | — | — |

> `?` dle rozhodnutí zadání — zdroj katalog služeb samostatně neřeší. Pozn.: §3 zmiňuje
> „Správa katalogu služeb" u ROLE-01/02/05; čtení katalogu je v RQU004 UC036 součástí
> čtení modelu (R1–R6). Pravděpodobné mapování viz Otevřená otázka O-3.

#### RQU006 – Společné a bojové funkce + PI (R7, R8 = bez přístupu k modelu)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC050 Zobrazit přehled společných funkcí | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC051 Zobrazit přehled bojových funkcí | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC052 Orientovat se ve vazbě funkcí na FMN PI | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

> Všechny tři UC jsou čtecí/referenční → klasifikováno jako „Číst model SVŘ" (§4: R1–R6 ✔).

#### RQU007 – C3 schopnosti + Požadavky a omezení (R7, R8 = bez přístupu k modelu)

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC053 Stáhnout poster taxonomie C3 schopností | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC054 Zobrazit referenční seznam požadavků na MV | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| UC055 Zobrazit referenční seznam omezení MV | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

> Čtecí/referenční přehledy → „Číst model SVŘ" (§4: R1–R6 ✔).

#### RQU008 – Provozní formuláře a referenční dokumenty

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC007 Zobrazit panel novinek | ? | ? | ? | ? | ? | ? | — | ? |
| UC056 Označit novinku jako přečtenou | ? | ? | ? | ? | ? | ? | — | ? |
| UC057 Vytvořit novinku | ? | ? | ? | ? | ? | ? | — | ? |
| UC058 Upravit novinku | ? | ? | ? | ? | ? | ? | — | ? |
| UC059 Smazat novinku | ? | ? | ? | ? | ? | ? | — | ? |
| UC060 Stáhnout návod / manuál | ? | ? | ? | ? | ? | ? | — | ? |

> `?` dle rozhodnutí zadání. UC057–UC059 mají v RQU008 aktéra **«Správce novinek»** —
> role, která **není** mezi 8 rolemi zdroje (Otevřená otázka O-6). UC007/UC056/UC060
> jsou generické (zobrazení/stažení) — pravděpodobně všichni přihlášení uživatelé.

#### RQU009 – Evidence osob na MV a v misích

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC061 Zobrazit a vyhledat osoby | ? | ? | ? | ? | ? | ? | — | — |
| UC062 Vytvořit / upravit osobu | ? | ? | ? | ? | ? | ? | — | — |
| UC063 Obsadit pozici na MV osobou | ? | ? | ? | ? | ? | ? | — | — |
| UC064 Zapojit osobu do mise | ? | ? | ? | ? | ? | ? | — | — |

> `?` dle rozhodnutí zadání — evidence osob ve zdroji není řešena (O-5). Pozn.: UC063
> (obsazení pozice) věcně souvisí s UC014 Správa struktury velení (RQU002).

#### RQU010 – Číselníky požadavků a omezení MV

| UC | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| UC065 Otevřít číselník | ? | ? | ? | ? | ? | ? | — | — |
| UC066 Vyhledat v seznamu položek číselníku | ? | ? | ? | ? | ? | ? | — | — |
| UC067 Přepnout zobrazení zrušených položek | ? | ? | ? | ? | ? | ? | — | — |
| UC068 Aktivovat zrušenou položku | ? | ? | ? | ? | ? | ? | — | — |
| UC069 Zrušit položku (deaktivace) | ? | ? | ? | ? | ? | ? | — | — |
| UC070 Trvale smazat nepoužitou položku | ? | ? | ? | ? | ? | ? | — | — |
| UC071 Zobrazit MV používající položku | ? | ? | ? | ? | ? | ? | — | — |

> `?` dle rozhodnutí zadání — správa číselníků ve zdroji není řešena (O-5).

**Souhrn 8c:** z 74 jemných UC je **50 odvozeno** ze zdroje (RQU001 obecné, RQU002–004,
RQU006, RQU007) a **24 označeno `?`** (RQU001 UC006–009, RQU005, RQU008, RQU009, RQU010).

### 9. Matice Aktér × GUI (odvozená)

🟦 **DERIVACE** — všechny dílčí tabulky níže odvozeny z „Uses" vazeb UC; sloupce rolí jsou 🟩 ze zdroje.

Odvozeno z vazeb **„Uses"** v krocích jemných UC: `Aktér×GUI[role][G]` = sjednocení
(`OR`) přístupů role ke všem UC, které danou GUI třídu používají. Sloupce R1–R8 jako v 8c.
Celkem **103 unikátních GUI tříd** (110 výskytů; 7 tříd je sdíleno dvěma analýzami).

#### RQU001 – Souhrn aplikace

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G001 «Form» Nástěnka | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G002 «Form area» Panel novinek †sdíleno RQU008 | ? | ? | ? | ? | ? | ? | — | ? |
| G003 «Form area» Panel Formuláře SVŘ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G004 «Form area» Panel Ostatní dokumenty | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G005 «Form multi area» Dlaždice modulu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G006 «Form area» Hlavní menu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G007 «Form multi area» Uživatelské menu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G008 «Form multi area» Panel notifikací | ? | ? | ? | ? | ? | ? | — | ? |
| G009 «Form modal» Uživatelský profil | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| G010 «Form modal» Změna hesla | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | ✔ |

> G003/G004 nejsou v „Uses" žádného UC — jsou to subpanely nástěnky (G001), přebírají
> její přístup. G002/G008 používá jen `?` UC (UC006/UC007) → `?`.

#### RQU002 – Karty míst velení (R7, R8 = —)

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G011 «Form» Karty míst velení | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G011b «Form grid area» Tabulkové zobrazení karet MV | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G012 «Form multi area» Karta místa velení (dlaždice) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G013 «Form» Detail karty místa velení | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G014 «Form area» Sekce specifikace | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G015 «Form modal» Specifikace MV | ✔ | ✔ | — | — | ● | — | — | — |
| G016 «Form grid area» Podřízená místa velení | ✔ | ✔ | — | — | ● | — | — | — |
| G017 «Form modal» Strukturu velení | ✔ | ✔ | — | — | ● | — | — | — |
| G018 «Form grid area» Pozice MV (strom) | ✔ | ✔ | — | — | ● | — | — | — |
| G019 «Form modal» Formulář schopností | ✔ | ✔ | — | — | ● | — | — | — |
| G020 «Form grid area» Schopnosti MV – MCA tree | ✔ | ✔ | — | — | ● | — | — | — |
| G021 «Form area» Informační toky a produkty | ✔ | ✔ | — | — | ● | — | — | — |
| G022 «Form multi area» Pohled přes IER | ✔ | ✔ | — | — | ● | — | — | — |
| G023 «Form multi area» Pohled přes IP | ✔ | ✔ | — | — | ● | — | — | — |
| G024 «Form area» FMN instrukce | ✔ | ✔ | — | — | ● | — | — | — |
| G025 «Form area» Karty MV ke stažení | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G026 «Form multi area» FMN dlaždice | ✔ | ✔ | — | — | ● | — | — | — |
| G027 «Form multi area» Základní karta velení | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G028 «Form multi area» Rozšířená karta velení | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G029 «Form multi area» CIS matice | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G030 «Form modal» Vytvoření MV | ✔ | — | — | — | ● | — | — | — |
| G031 «Form modal» Interakce s MV | ✔ | ✔ | — | — | ● | — | — | — |
| G031a «Form grid area» Grid interakcí | ✔ | ✔ | — | — | ● | — | — | — |
| G032 «Form modal» Výběr IER †sdíleno RQU003 | ✔ | ✔ | ✔ | — | ● | — | — | — |
| G033 «Form modal» Výběr IP | ✔ | ✔ | — | — | ● | — | — | — |
| G034 «Form modal» Import interakcí z jiného MV | ✔ | ✔ | — | — | ● | — | — | — |
| G035 «Form modal» Výběr procedurální instrukce | ✔ | ✔ | — | — | ● | — | — | — |
| G036 «Form modal» Možnosti reportu MV | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G037 «Form modal» Možnosti CIS matice | ✔ | ✔ | ✔ | — | ✔ | ✔ | — | — |
| G038 «Form modal» Přidat / Upravit pozici | ✔ | ✔ | — | — | ● | — | — | — |
| G038a «Form grid area» Grid rolí | ✔ | ✔ | — | — | ● | — | — | — |

> Bez „Uses" vazby (přebírají přístup nadřazené obrazovky): G014 (subsekce detailu G013),
> G022/G023 (subsekce editoru toků G021), G025 (oblast reportů na detailu), G028
> (varianta karty jako G027), G030 (modal vytvoření MV — kontext UC018), G038/G038a
> (sub-modal struktury velení G017). G032 je sdílen s RQU003 (UC030) → zahrnuje i ROLE-03.

#### RQU003 – Mise, operace, cvičení (R2, R4, R7, R8 = —)

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G039 «Form» Mise (přehled) | ● | — | ✔ | — | ✔ | ✔ | — | — |
| G040 «Form multi area» Dlaždice mise | ● | — | ✔ | — | ✔ | ✔ | — | — |
| G041 «Form modal» Vytvoření mise | — | — | ✔ | — | — | — | — | — |
| G042 «Form modal» Detail mise | — | — | ✔ | — | — | — | — | — |
| G043 «Form area» Záložka Interakce | — | — | ✔ | — | — | — | — | — |
| G044 «Form grid area» Plánovací grid interakcí | — | — | ✔ | — | ✔ | ✔ | — | — |
| G045 «Form area» Záložka Velení a řízení | — | — | ✔ | — | — | — | — | — |
| G046 «Form grid area» Grid C2 vazeb | — | — | ✔ | — | — | — | — | — |
| G047 «Form modal» Editace detailu mise | — | — | ✔ | — | — | — | — | — |
| G048 «Form modal» Duplikace mise | — | — | ✔ | — | — | — | — | — |
| G049 «Form modal» Potvrzení zneplatnění mise | — | — | ✔ | — | — | — | — | — |
| G050 «Form modal» Vytvoření C2 vazby | — | — | ✔ | — | — | — | — | — |
| G051 «Form modal» Graf mise | ● | — | ✔ | — | ✔ | ✔ | — | — |
| G052 «Form modal» CIS matice mise | — | — | ✔ | — | ✔ | ✔ | — | — |
| G053 «Form modal» Možnosti reportu mise | ● | — | ✔ | — | ✔ | ✔ | — | — |
| G054 «Form modal» Konfigurace interakcí MV | — | — | ✔ | — | — | — | — | — |
| G055 «Form grid area» Grid interakcí MV | — | — | ✔ | — | — | — | — | — |

> G044/G052: ROLE-05/ROLE-06 k nim přistupují pouze pro generování reportu/CIS matice
> mise (UC033) — read-only průchod; odvozeno z §3 (ROLE-05 „všechny reporty", ROLE-06
> „reporty MV a misí"). G032 (Výběr IER) viz tabulka RQU002.

#### RQU004 – Model SVŘ – doménové entity (R7, R8 = —)

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G056 «Form» Model (rozcestník) †sdíleno RQU010 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G057 «Form multi area» Dlaždice stereotypu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G058 «Form» Přehled prvků stereotypu †sdíleno RQU010 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G059 «Form grid area» Tabulka prvků †sdíleno RQU010 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G060 «Form» Všechny prvky modelu | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G061 «Form modal» Vytvoření prvku †sdíleno RQU010 | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G071 «Form area» Obsah prvku | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G062 «Form modal» Editace překladů prvku †sdíleno RQU010 | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G063 «Form modal» Vztahy prvku | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G063a «Form grid area» Panel vztahů prvku | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G064 «Form modal» Vytvoření vztahu | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G070 «Form modal» Souhrn plánovaných změn | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G065 «Form modal» Duplikace prvku | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G066 «Form modal» Relevantní MV pro MCA schopnost | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G066a «Form grid area» Tabulka relevantních MV | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G067 «Form» Patch Requesty (přehled) | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G067a «Form grid area» Tabulka patch requestů | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G068 «Form modal» Detail patch requestu | ✔ | ✔ | — | ✔ | ✔ | — | — | — |
| G069 «Form» Metamodel (referenční dokumentace) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

> G068 (Detail patch requestu): ROLE-01/02/04 jen náhled vlastních, akce POTVRDIT/ZAMÍTNOUT
> jen ROLE-05 (viz 8c UC042/UC043). Sdílené G056/G058/G059/G061/G062 mají hodnotu dle
> RQU004 (kde je užívají i editační UC) — v RQU010 je užívají jen `?` UC.

#### RQU005 – Katalog služeb

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G072 «Form area» Panel Katalog služeb | ? | ? | ? | ? | ? | ? | — | — |
| G073 «Form multi area» Dlaždice kategorie služeb | ? | ? | ? | ? | ? | ? | — | — |
| G074 «Form» Přehled prvků kategorie | ? | ? | ? | ? | ? | ? | — | — |
| G075 «Form grid area» Tabulka prvků katalogu | ? | ? | ? | ? | ? | ? | — | — |

#### RQU006 – Společné a bojové funkce (R7, R8 = —)

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G076 «Form» Funkce SVŘ (referenční stránka) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G077 «Form grid area» Tabulka společných funkcí | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G078 «Form grid area» Tabulka bojových funkcí | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

#### RQU007 – C3 schopnosti + Požadavky a omezení (R7, R8 = —)

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G079 «Form» Požadavky a omezení (referenční stránka) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G080 «Form grid area» Tabulka požadavků | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G081 «Form grid area» Tabulka omezení | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| G082 «Form multi area» Dlaždice C3 schopnosti (na nástěnce) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |

#### RQU008 – Provozní formuláře

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G083 «Form multi area» Položka novinky | ? | ? | ? | ? | ? | ? | — | ? |
| G084 «Form» Administrace novinek | ? | ? | ? | ? | ? | ? | — | ? |
| G085 «Form grid area» Grid novinek | ? | ? | ? | ? | ? | ? | — | ? |
| G086 «Form modal» Vytvoření novinky | ? | ? | ? | ? | ? | ? | — | ? |
| G087 «Form modal» Úprava novinky | ? | ? | ? | ? | ? | ? | — | ? |
| G088 «Form» Návody a manuály | ? | ? | ? | ? | ? | ? | — | ? |
| G089 «Form multi area» Karta ke stažení | ? | ? | ? | ? | ? | ? | — | ? |

> G002 (Panel novinek) viz tabulka RQU001.

#### RQU009 – Evidence osob

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G090 «Form» Seznam osob | ? | ? | ? | ? | ? | ? | — | — |
| G091 «Form grid area» Tabulka osob | ? | ? | ? | ? | ? | ? | — | — |
| G092 «Form modal» Detail osoby | ? | ? | ? | ? | ? | ? | — | — |
| G093 «Form modal» Obsazení pozice | ? | ? | ? | ? | ? | ? | — | — |
| G094 «Form modal» Zapojení do mise | ? | ? | ? | ? | ? | ? | — | — |

#### RQU010 – Číselníky požadavků a omezení

| GUI třída | Vedoucí OC | Vš. plánovač | Správce mise | Garant PI | Architekt | Čtenář | Spr. infra | Prov. admin |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| G095 «Form multi area» Dlaždice číselníku | ? | ? | ? | ? | ? | ? | — | — |
| G096 «Form modal» Dialog potvrzení zrušení/výmazu | ? | ? | ? | ? | ? | ? | — | — |
| G097 «Form modal» Dialog MV používajících prvek | ? | ? | ? | ? | ? | ? | — | — |

> Sdílené GUI G056/G058/G059/G061/G062 viz tabulka RQU004.

## 10. Dotčené RQU a prvky

🟦 **DERIVACE** — dopad na existující analýzy odvozený z matic 8c / 9.

Tento návrh **needituje** existující analýzy. Po schválení se v dotčených RQU provede
následující. Hlavní průřezová změna: pole **Aktér** každého jemného UC, které dnes nese
generickou hodnotu „Uživatel"/„Administrátor", se **upřesní** na konkrétní role dle
matice 8c.

> **Charakter změny.** C3HUB (rozsah RQU001–RQU008, RQU010) je **implementovaná
> aplikace** — zavedení RBAC je **retrofit do běžícího systému**, ne změna pouhé analýzy
> (rozpracovaná je jen RQU009). Aplikace přitom **už dnes obsahuje dílčí řízení
> přístupu**: ACL pole v DTO (`canUpdate`, `canGenerateReport`, `canCreate`) a roli
> „administrátor" (RQU004 UC042/UC043 rozsah dle `isAdmin`; RQU001 UC006/UC008 jen pro
> administrátory). RBAC tyto existující primitivy **formalizuje a rozšiřuje**, nestaví od
> nuly. Nízkonákladové zůstává jen upřesnění **analytických artefaktů** (RQU jsou „k
> revizi", ne finální) — pole Aktér, číselník rolí; samotná implementace je zásah do
> existujícího kódu (viz kap. 12 a Otevřená otázka O-8).

| RQU | Typ změny | Popis |
|---|---|---|
| [RQU001](../../RQU001%20-%20Souhrn%20aplikace/analyza-md/) | upřesnění Aktér + návaznost | UC001–UC005: Aktér → všichni přihlášení (ROLE-01–06, ROLE-08). UC006/UC008/UC007/UC009: Aktér zůstává otevřený (O-4). UC-11 (přihlášení) → nový modul IAM. |
| [RQU002](../../RQU002%20-%20Karty%20mist%20veleni/analyza-md/) | upřesnění Aktér | 16 UC: pole Aktér dle matice 8c (RQU002). Zvážit přidání číselníku rolí do LM, pokud bude třeba (O-1). |
| [RQU003](../../RQU003%20-%20Mise%20operace%20cviceni/analyza-md/) | upřesnění Aktér | 11 UC dle matice 8c (RQU003). UC024/032/034: doplnit poznámku o omezeném přístupu ROLE-01 (vlastní MV, UC-14). |
| [RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/) | upřesnění Aktér | 12 UC dle matice 8c (RQU004). UC042/UC043: aktér „Schvalovatel modelu" = ROLE-05. |
| [RQU005](../../RQU005%20-%20Katalog%20sluzeb/analyza-md/) | otevřené | Aktér UC047–UC049 nelze ze zdroje odvodit (O-3). |
| [RQU006](../../RQU006%20-%20Spolecne%20a%20bojove%20funkce/analyza-md/) | upřesnění Aktér | UC050–UC052: Aktér → ROLE-01–06 (čtení modelu). |
| [RQU007](../../RQU007%20-%20C3%20schopnosti%20a%20pozadavky/analyza-md/) | upřesnění Aktér | UC053–UC055: Aktér → ROLE-01–06 (čtení modelu). |
| [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/) | otevřené | UC056–UC059 aktér „Správce novinek" — role mimo 8 rolí zdroje (O-6). |
| [RQU009](../../RQU009%20-%20Řešení%20evidence%20osob%20na%20MV%20a%20v%20misích/analyza-md/) | otevřené | Aktér UC061–UC064 nelze ze zdroje odvodit (O-5). |
| [RQU010](../../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/analyza-md/) | otevřené | Aktér UC065–UC071 nelze ze zdroje odvodit (O-5). |
| **Nová RQU – modul Administrace/IAM** | nová `complete` analýza | UC-08 (konfigurace AD), UC-09 (přiřazení role), UC-11 (přihlášení), UC-12 (org. zařazení), UC-13 (delegace – odloženo). Tyto UC popisují **novou funkcionalitu**, kterou žádná RQU001–010 neobsahuje — viz O-1, kap. 11–12. |

## 11. Návrh cílové struktury RBAC

### 11a. Datový / logický model

🟧 **NÁVRH** — cílová struktura RBAC; sloupec „Zdroj" v tabulce cituje oporu ve zdroji.

RBAC subsystém zavádí tyto prvky (cílový stav; detailně se zpracuje v nové `complete`
analýze modulu Administrace/IAM):

| Prvek | Typ | Popis | Zdroj |
|---|---|---|---|
| **Uživatel** | existující (z AD) | Identita; C3HUB ji nespravuje, jen přijímá z AD. | UC-08, UC-11 |
| **Role** | nový číselník | 8 aplikačních rolí (ROLE-01…ROLE-08): kód, název, popis. | §3 |
| **Oprávnění** | nový číselník | Aplikační oprávnění: kód, název, modul, skupina. 14 skupinových + jemná (kap. 5). | §4, 5c |
| **RoleOprávnění** | nová vazba M:N | Přidělení oprávnění rolím; atribut *přístup* (plný / podmíněný). = matice 6a/6b. | §4 |
| **UživatelskáRole** | nová vazba M:N | Přiřazení uživatele k roli (UC-09); platnost od–do. | UC-09 |
| **OrganizačníZařazení** | nový | Velitelská úroveň (strategická/operační/taktická), přiřazená MV, doména *(odloženo)*. Určuje datový rozsah. | §8 |
| **ChráněnáMVGrant** | nový | Explicitní přístup uživatele ke konkrétní chráněné MV (mimo hierarchii). | §8, 7b |
| **Delegace** | nový *(odloženo)* | Delegant, delegát, typ oprávnění, datový rozsah, platnost od–do, stav, schvalovatel. | UC-13, §6.4 |
| **AuditníZáznam** | nový | Čas, uživatel, akce, cílové MV — podklad pro bezpečnostní alerting. | §6.2, §9.2 |

```plantuml file=diagrams/lm_navrh_rbac.puml
```

📄 Zdroj diagramu: [lm_navrh_rbac.puml](diagrams/lm_navrh_rbac.puml)

### 11b. Architektura autorizace

Dvouvrstvé vyhodnocení **při každém požadavku** (zdroj §1):

1. **Vrstva aplikačních oprávnění:** má některá z rolí uživatele požadované oprávnění
   (přes `UživatelskáRole` → `Role` → `RoleOprávnění` → `Oprávnění`)? Pokud ne → zamítnuto.
2. **Vrstva datového rozsahu:** je cílové MV / data v datovém rozsahu uživatele?
   Rozsah se odvodí z `OrganizačníZařazení` (velitelská úroveň + hierarchie nadřízenosti/
   podřízenosti). Chráněné MV vyžaduje záznam v `ChránenáMVGrant`.

Obě vrstvy musí projít. Výsledek se v UI promítá skrytím/zakázáním akcí (vzor: stávající
ACL pole v DTO, např. `canUpdate`, `canGenerateReport` — viz UC013, UC021).

### 11c. Rozšiřující návrh nad rámec zdroje — kompartmenty a pracovní skupiny

🟧 **NÁVRH** — všechny tabulky v této podkapitole jsou nad rámec zdroje v3.4 (viz O-9, O-10).

> Tato podkapitola vychází z konzultace a jde **nad rámec zdrojového dokumentu v3.4**.
> Je vyznačena samostatně, aby zůstala oddělená od částí věrných zdroji. Vyžaduje
> potvrzení — Otevřené otázky O-9 a O-10.

#### Tři významy „role" — terminologické vymezení

Návrh pracuje se třemi nezávislými kategoriemi „role"; je nutné je nezaměňovat:

| Kategorie | Co to je | Kde |
|---|---|---|
| **Aplikační role** | 8 rolí RBAC (ROLE-01…ROLE-08) | tento návrh |
| **Role v modelu SVŘ** | doménový prvek FMN | RQU004 |
| **Pracovní role** | role na pozici MV / role osoby v misi, obsazovaná konkrétní osobou | RQU002 UC014, RQU009 UC063/UC064 |

(Zdroj ř. 472 přejmenování „aplikační role" kvůli kolizi s rolemi FMN sám avizuje — O-2.)

#### Doména jako kompartment s režimem

Místo samostatné kategorie „chráněnka" se zavádí entita **Doména** s atributem `režim`:

| Režim | Chování |
|---|---|
| `OTEVŘENÁ` | jen logické seskupení; přístup neovlivňuje |
| `OMEZENÁ` | přístup = průnik s hierarchií (koaliční / organizační kompartment) |
| `CHRÁNĚNÁ` | deny-by-default; přístup jen přes explicitní grant; anonymizace v tocích |

Chráněné MV (kap. 7b) = MV v doméně režimu `CHRÁNĚNÁ`; entita `ChránenáMVGrant` z kap. 11a
se zobecní na **doménový grant**. V 1. implementaci se realizuje **pouze režim
`CHRÁNĚNÁ`** (priorita zdroje §8); ostatní režimy jsou připravený, ale neaktivní slot.

#### Objektově vázaná pracovní skupina (Mise i Místo velení)

Mise i Místo velení mají **pracovní skupinu** — roster osob v *pracovních rolích* vázaný
na konkrétní objekt. Strukturální vzor je u obou totožný: *(objekt) ↔ (osoba) ↔ (pracovní
role) ↔ (platnost)*.

| Objekt | Pracovní skupina v existujících analýzách |
|---|---|
| **Mise** | RQU009 UC064 „Zapojit osobu do mise" (osoba + popis pracovní role v misi + platnost) |
| **Místo velení** | RQU002 UC014 „Spravovat strukturu velení" (pozice / pracovní role) + RQU009 UC063 „Obsadit pozici na MV osobou" |

**Nejde to proti zdroji.** Obě věci jsou už zanalyzované v RQU002/RQU009; zdrojový
dokument rolí a oprávnění je pouze neřeší. Zahrnutí faktu do tohoto návrhu zdroji
neodporuje — jen propojuje existující model s RBAC.

#### Explicitní granty — společná vyhodnocovací vrstva, dva druhy

Chráněnka i pracovní skupina jsou „explicitní grant měnící výchozí hierarchický rozsah".
Sdílejí vyhodnocovací krok, ale jsou to **dva druhy s opačnou algebrou**:

| | Doménový grant (chráněnka) | Objektový grant (pracovní skupina) |
|---|---|---|
| Tvar | uživatel ↔ doména (N objektů) | uživatel ↔ 1 objekt (mise / MV) |
| Algebra | **restriktivní** (deny / veto) | **aditivní** (rozšíření práv) |
| Životnost | trvalá, znovupoužitelná | per objekt, efemérní |

Objektový grant lze realizovat jako **objektově omezené přiřazení role** — rozšíření
entity `UživatelskáRole` (kap. 11a) o atribut `rozsah` (`globální | mise:X | MV:X`) —
nebo jako samostatnou členskou vazbu objekt ↔ osoba ↔ pracovní role.

```plantuml file=diagrams/lm_navrh_rbac_rozsireni.puml
```

📄 Zdroj diagramu: [lm_navrh_rbac_rozsireni.puml](diagrams/lm_navrh_rbac_rozsireni.puml) — diagram zahrnuje i kontextové třídy hlavního modelu (`package` „okolí problémové oblasti"), aby bylo zřejmé napojení domén a pracovních skupin na Místo velení, Misi a Osobu.

#### Autorizační důsledek — rozdíl Mise vs. MV (k potvrzení)

- **Mise:** vazba pracovní skupina → editační grant je podložená zdrojem §6.3 (ROLE-03
  rozšiřuje práva k misi pracovnímu týmu).
- **Místo velení:** zdroj autorizační důsledek obsazení pozice **neuvádí** — přístup k MV
  řídí hierarchie a aplikační role (§5, §8). Zda obsazení pozice na MV zakládá MV-scoped
  grant (a zda je obsazení pozice zdrojem pro atribut „přiřazená MV" org. zařazení, §8),
  je třeba rozhodnout — viz Otevřená otázka **O-10**.

## 12. Rozsah zadání pro vývoj

Fázování vychází z priorit uvedených ve zdroji (§8 chráněné MV = priorita č. 1 příští
iterace; §9.3 delegace a doménové filtrování = odloženo). Implementace je **retrofit do
běžící aplikace** — navazuje na existující ACL primitivy (pole DTO `canUpdate`/
`canGenerateReport`/`canCreate`, role „administrátor"), které Fáze 1 nahrazuje
plnohodnotným RBAC; pouze RQU009 (evidence osob) zatím implementována není.

### Fáze 1 — Základ RBAC (aplikační oprávnění)

- Persistování `Role`, `Oprávnění`, `RoleOprávnění` (naplnit dle matice 6a/6b).
- `UživatelskáRole` + obrazovka **přiřazení uživatele k roli** (UC-09).
- Přihlášení přes **Active Directory** (UC-08, UC-11): příjem identity, role a org.
  zařazení; mapování role → aplikační oprávnění.
- **Autorizační vrstva** pro aplikační oprávnění (1. vrstva dle 11b); promítnutí do UI
  (skrytí/zákaz akcí).

### Fáze 2 — Datový rozsah

- `OrganizačníZařazení` + obrazovka **správy org. zařazení** (UC-12): velitelská úroveň,
  přiřazená MV.
- **Resolver datového rozsahu** z velitelské hierarchie (2. vrstva dle 11b).
- **Auditní stopa** přístupů k MV + **bezpečnostní alerting** při nadměrném přístupu
  mimo kontext mise (zdroj §6.2, náhrada zamítnutého UC-10).

### Fáze 3 — Chráněná místa velení

- `ChránenáMVGrant`: explicitní přidělení práv ke konkrétní chráněnce.
- **Anonymizace** chráněného MV v datových tocích a v misi (zdroj §7b, §8).
- Zdroj značí jako prioritu č. 1 příští iterace — pořadí Fáze 2/3 viz Otevřená otázka O-7.
- Realizace dle rozšiřujícího návrhu: chráněnka = doména režimu `CHRÁNĚNÁ` (kap. 11c).
  Objektově vázané pracovní skupiny (mise i MV) jsou samostatný přírůstek navazující na
  RQU002/RQU009 — viz kap. 11c a Otevřená otázka O-10.

### Odloženo (mimo rozsah první implementace)

- **Delegace oprávnění** (UC-13, `Delegace`) — zdroj §9.3: vysoká složitost; zatím
  manuální přeřazení role správcem (ROLE-08).
- **Doménové filtrování** datového rozsahu — zdroj §9.3: datový rozsah zatím řízen jen
  hierarchií; atribut *Doména* v modelu navržen, neaktivní.

## 13. Závislosti a předpoklady

- **Active Directory** — dostupnost a dohoda na předávaných atributech (role, org.
  zařazení). Bez AD nelze realizovat UC-08/UC-11 (Fáze 1).
- **Zdroj pravdy org. struktury** — velitelská hierarchie (nadřízenost/podřízenost MV)
  musí být v C3HUB k dispozici pro resolver datového rozsahu (Fáze 2). Výhledově napojení
  na externí org chart (zdroj §8).
- **Statická tabulka PI → osoba** (zdroj §7) — v 1. iteraci spravovaná ROLE-05 mimo
  aplikaci; ovlivňuje rozsah odpovědnosti ROLE-04.
- **Schválení a finalizace zdroje** — zdroj je verze *3.4 wip*; před implementací je
  třeba potvrdit finální znění (zejména terminologii, viz O-2).

## 14. Otevřené otázky

| ID | Otázka |
|---|---|
| **O-1** | UC-08, UC-09, UC-11, UC-12, UC-13 popisují **novou funkcionalitu** (přihlášení, správa rolí a org. zařazení, delegace), kterou žádná RQU001–010 neobsahuje. Návrh doporučuje pro ni založit samostatnou `complete` analýzu „Modul Administrace/IAM". Potvrdit. |
| **O-2** | Terminologie: zdroj (ř. 472) uvádí, že „aplikační role" bude přejmenována kvůli kolizi s rolemi v modelu SVŘ (FMN). Finální název je třeba doplnit před implementací. Dále drobné rozpory §2 ↔ §3 ↔ §4 (ROLE-04/UC-07; ROLE-03/UC-14) — návrh řeší ve prospěch matice §4. |
| **O-3** | Oprávnění zmíněná jen v kartách rolí §3, ne v matici §4: „Správa katalogu služeb" (ROLE-01/02/05), „Konfigurovat mapování oprávnění" (ROLE-05). Doplnit do matice §4, nebo potvrdit jako nezáměrná? Souvisí s přidělením UC RQU005 (`?` v 8c). |
| **O-4** | RQU001 UC006 (notifikace patch requestů), UC007 (novinky), UC008 (ArchiRepo), UC009 (podnět) — zdroj je nemapuje. UC006/UC008 jsou vázány na aktéra «Administrátor» (pravděpodobně ROLE-05). Potvrdit přidělení. |
| **O-5** | Moduly **Katalog služeb** (RQU005), **Novinky/dokumenty** (RQU008), **Osoby** (RQU009), **Číselníky** (RQU010) zdroj vůbec neřeší — v maticích 8c/9 označeno `?`. Je třeba doplnit přidělení rolí (čtení vs. správa) pro 24 UC a ~22 GUI tříd. |
| **O-6** | RQU008 UC057–UC059 mají aktéra **«Správce novinek»** — role mimo 8 rolí zdroje. Je to nová role, nebo se mapuje na ROLE-08 (Provozní administrátor)? |
| **O-7** | Pořadí Fáze 2 (datový rozsah) vs. Fáze 3 (chráněná MV): zdroj značí chráněná MV jako prioritu č. 1, ale logicky závisí na vrstvě datového rozsahu. Potvrdit pořadí. Souvisí i otázka, zda při SSO/AD zůstává UC003 „Změnit heslo". |
| **O-8** | Interní metodika nemá formální prvek „role", „oprávnění" ani „matice" a předpokládá *jednoho* primárního aktéra na UC. Matice 8c přiřazuje UC více rolí. Zvolit: (a) pole „Aktér" ponese množinu rolí, (b) UC se rozdělí dle rolí, (c) matice zůstane samostatným artefaktem mimo formální UC model. Návrh doporučuje (c) — matice jako overlay. |
| **O-9** | Rozšiřující návrh (kap. 11c): zavést entitu **Doména** s režimy (`OTEVŘENÁ` / `OMEZENÁ` / `CHRÁNĚNÁ`) místo samostatné chráněnky? Potvrdit algebru vůči hierarchii (průnik vs. veto), multiplicitu (prvek/uživatel ve více doménách — `ANY`/`ALL`) a to, že v 1. fázi se implementuje jen režim `CHRÁNĚNÁ`. |
| **O-10** | Pracovní skupina **MV**: zakládá obsazení pozice na MV (RQU009 UC063) **autorizační** MV-scoped grant — obdobně jako pracovní skupina mise dle §6.3 — nebo zůstává jen evidencí a přístup k MV řídí výhradně hierarchie + aplikační role? Souvisí: je obsazení pozice zdrojem pro atribut „přiřazená MV" org. zařazení (§8)? |

## 15. Verifikace

Po schválení návrhu a implementaci RBAC subsystému:

1. **Datová úroveň:** v C3HUB existuje 8 rolí a katalog oprávnění; matice `RoleOprávnění`
   odpovídá tabulce 6a (namátkově: ROLE-06 má jen čtecí oprávnění a `REPORT_*`).
2. **Aplikační oprávnění (smoke test):** uživatel s ROLE-06 (Čtenář) otevře detail MV
   (UC012) — vidí data; akce UPRAVIT (UC013) je skrytá/zakázaná. Uživatel s ROLE-01
   tytéž akce má dostupné.
3. **Dvouvrstvost:** uživatel s ROLE-01 a org. zařazením na taktické úrovni vidí vlastní
   a podřízená MV; nadřízené MV +2 úrovně nevidí (na rozdíl od ROLE-02) — ověřuje
   nezávislost dimenzí (§5).
4. **Chráněná MV:** uživatel bez `ChránenáMVGrant` chráněnku nevidí ani při hierarchické
   nadřízenosti; v datovém toku se zobrazí jen anonymizovaná reference.
5. **Auditní stopa:** přístup ROLE-03 k nadměrnému počtu MV mimo kontext mise vygeneruje
   bezpečnostní alert (§6.2).
6. **Konzistence s maticemi:** pro vzorek UC z 8c ověřit, že UI dostupnost akcí odpovídá
   matici; pro vzorek GUI z kap. 9 ověřit dosažitelnost obrazovky dle role.

## 16. Reference

- **Zdrojový dokument:** `src/C3HUB/Role a práva/C3HUB_UseCases_Role_Opravneni.docx (1).md`
  — „C3HUB – Use Cases, Role a Oprávnění", verze 3.4 wip, 14. 5. 2026 (interní pracovní dokument).
- **Dotčené analýzy:** RQU001–RQU010 projektu C3HUB (jemné UC a GUI modely — vstup pro matice 8c, 9).
- **Návaznost:** NRQ001 — Kompatibilita IP s TIN, APP a DEV (vzor proposalu C3HUB).
- **Metodika:** `metodika/metodika-zapisu.md` kap. 7.0.2 (úroveň `proposal`), kap. 2 (Use Case model, aktéři).
