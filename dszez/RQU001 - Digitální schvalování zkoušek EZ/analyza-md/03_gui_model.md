# GUI model

## Konvence

- **Stereotyp** určuje charakter GUI prvku (Form, Form area, Form grid area, Form multi area, Form modal)
- **Prefix atributu (Kat.):** H = hlavička, E = editovatelné, R = needitovatelné (read-only)
- **Podtržení** názvu = atribut je v editaci **povinný**
- **`/` (lomítko)** na začátku = **vypočítávaná hodnota** (nepersistuje se)
- **Alias** = zkrácený zobrazovací label (jen pokud se liší od plného názvu)
- Atributy a operace třídy se stereotypem «Form grid area» / «Form multi area» odpovídají **jednomu záznamu** seznamu

> **Poznámka k rozsahu:** Úplná skladba polí formulářů žádosti je závislá na typu zkoušky a v zadání
> není kompletně specifikována (šablony formulářů teprve vzniknou, vzorový formulář nebyl součástí
> podkladů). Modelovány jsou oblasti formuláře a pole s oporou v textovém popisu TO-BE procesů –
> viz sekce **Otevřené otázky** v souboru `README.md`.

---

## Mapovací tabulka GUI tříd

| ID | Název | Alias | Stereotyp |
|---|---|---|---|
| G0001 | Portál žadatele | portalZadatele | «Form» |
| └ G0002 | Přehled mých žádostí | prehledMychZadosti | «Form grid area» |
| G0003 | Žádost o zkoušku | zadostOZkousku | «Form» |
| └ G0004 | Základní údaje žádosti | zakladniUdaje | «Form area» |
| └ G0005 | Termín a program zkoušky | terminProgram | «Form area» |
| └ G0006 | Požadovaná součinnost ČEPS | soucinnostCeps | «Form area» |
| └ G0007 | Přílohy žádosti | prilohyZadosti | «Form area» |
| └ G0008 | Souhlas s podmínkami | souhlasPodminky | «Form area» |
| G0009 | Pracovní plocha schvalovatele | plochaSchvalovatele | «Form» |
| └ G0010 | Přehled žádostí ke schválení | prehledKeSchvaleni | «Form grid area» |
| G0011 | Detail žádosti | detailZadosti | «Form» |
| └ G0012 | Souhrn žádosti | souhrnZadosti | «Form area» |
| └ G0013 | Komentáře a vyjádření | komentareVyjadreni | «Form multi area» |
| └ G0014 | Auditní stopa workflow | auditniStopa | «Form multi area» |
| └ G0015 | Vyhodnocení provedené zkoušky | vyhodnoceniZkousky | «Form area» |
| G0016 | Výběr typu zkoušky | vyberTypuZkousky | «Form modal» |
| G0017 | Delegace na podpůrný útvar | delegaceUtvar | «Form modal» |
| G0018 | Rozhodnutí o žádosti | rozhodnutiZadost | «Form modal» |
| G0019 | Nastavení zastupitelnosti | nastaveniZastupitelnosti | «Form modal» |

## Hierarchie GUI tříd

```
«Form» Portál žadatele
└── «Form grid area» Přehled mých žádostí

«Form» Žádost o zkoušku
├── «Form area» Základní údaje žádosti
├── «Form area» Termín a program zkoušky
├── «Form area» Požadovaná součinnost ČEPS
├── «Form area» Přílohy žádosti
└── «Form area» Souhlas s podmínkami

«Form» Pracovní plocha schvalovatele
└── «Form grid area» Přehled žádostí ke schválení

«Form» Detail žádosti
├── «Form area» Souhrn žádosti
├── «Form multi area» Komentáře a vyjádření
├── «Form multi area» Auditní stopa workflow
└── «Form area» Vyhodnocení provedené zkoušky

«Form modal» Výběr typu zkoušky      (otevírán z Portálu žadatele)
«Form modal» Delegace na podpůrný útvar   (otevírán z Detailu žádosti)
«Form modal» Rozhodnutí o žádosti    (otevírán z Detailu žádosti)
«Form modal» Nastavení zastupitelnosti   (otevírán z Pracovní plochy schvalovatele)
```

```plantuml file=diagrams/gui_class_diagram.puml
```

---

<a id="~DSZEZ-gui-G0001"></a>
## «Form» Portál žadatele

Vstupní obrazovka žadatele o zkoušku. Zobrazuje přehled vlastních žádostí a umožňuje zahájit podání nové žádosti.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Portál žadatele o zkoušky EZ | — | Nadpis stránky |
| 2 | H | RText | Přihlášený uživatel | — | Jméno žadatele |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Nová žádost | — | Zahájí podání nové žádosti o zkoušku | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [Přehled mých žádostí](#~DSZEZ-gui-G0002) | Tabulkový přehled žádostí žadatele |
| opens | [Výběr typu zkoušky](#~DSZEZ-gui-G0016) | Dialog výběru typu zkoušky |

---

<a id="~DSZEZ-gui-G0002"></a>
## «Form grid area» Přehled mých žádostí

Tabulkový přehled žádostí žadatele; jeden řádek = jedna žádost (rozpracovaná, podaná i vyřízená). Rám gridu obsahuje vyhledávání, filtr stavu a počet záznamů.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RKod | Číslo žádosti | — | Identifikátor žádosti |
| 2 | R | RText | Název žádosti | — | U rozpracovaných žádostí uživatelský název |
| 3 | R | RLOV | Typ zkoušky | — | Z číselníku typZkousky_E |
| 4 | R | RBarvaLOV | Stav žádosti | — | Z číselníku stavZadosti_E, barevně odlišeno |
| 5 | R | RDatumCas | Datum podání | — | Prázdné u rozpracovaných |
| 6 | R | RText | Aktuální krok workflow | — | Stručný popis fáze schvalování |
| 7 | R | RAkce | Akce | — | Akce řádku – viz Operace |
| 8 | H | EText | Vyhledávání | — | Rám gridu – fulltext nad žádostmi |
| 9 | H | ELOV | Filtr dle stavu | — | Rám gridu – omezuje zobrazené žádosti dle stavu |
| 10 | H | RText | Počet záznamů | — | Rám gridu – „Mé žádosti (N)" |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Otevřít detail | — | Zobrazí detail žádosti a stav workflow | [UC0009](02_use_case_model.md#~DSZEZ-uc-UC0009) |
| 2 | Upravit žádost | — | Otevře žádost k úpravě | [UC0008](02_use_case_model.md#~DSZEZ-uc-UC0008) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat přehledu |
| opens | [Detail žádosti](#~DSZEZ-gui-G0011) | Otevření detailu žádosti |
| opens | [Žádost o zkoušku](#~DSZEZ-gui-G0003) | Otevření žádosti k úpravě |

---

<a id="~DSZEZ-gui-G0003"></a>
## «Form» Žádost o zkoušku

Formulář žádosti o zkoušku EZ. Skladba a povinnost polí se řídí zvoleným typem zkoušky. Formulář se člení na tematické oblasti.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Žádost o zkoušku EZ | — | Nadpis formuláře |
| 2 | H | RLOV | Typ zkoušky | — | Zvolený typ, needitovatelné |
| 3 | H | RKod | Číslo žádosti | — | Přiděleno po podání |
| 4 | H | RBarvaLOV | Stav žádosti | — | Z číselníku stavZadosti_E |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Podat žádost | — | Spustí kontrolu a podání žádosti | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) |
| 2 | Uložit rozpracované | — | Uloží žádost jako rozpracovanou pro pozdější dokončení | [UC0002](02_use_case_model.md#~DSZEZ-uc-UC0002) |
| 3 | Uložit změny | — | Uloží změny existující žádosti a znovu spustí workflow | [UC0008](02_use_case_model.md#~DSZEZ-uc-UC0008) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [Základní údaje žádosti](#~DSZEZ-gui-G0004) | Oblast základních údajů |
| contains | [Termín a program zkoušky](#~DSZEZ-gui-G0005) | Oblast termínu a programu |
| contains | [Požadovaná součinnost ČEPS](#~DSZEZ-gui-G0006) | Oblast součinnosti ČEPS |
| contains | [Přílohy žádosti](#~DSZEZ-gui-G0007) | Oblast příloh |
| contains | [Souhlas s podmínkami](#~DSZEZ-gui-G0008) | Oblast souhlasu s podmínkami |
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat formuláře |

---

<a id="~DSZEZ-gui-G0004"></a>
## «Form area» Základní údaje žádosti

Oblast formuláře se základními údaji o žadateli a o zkoušeném zařízení.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EText | <u>Žadatel</u> | — | Název subjektu provádějícího zkoušku |
| 2 | E | EText | <u>Kontaktní osoba</u> | — | Osoba odpovědná za žádost |
| 3 | E | EText | <u>Kontaktní e-mail</u> | — | E-mail kontaktní osoby |
| 4 | E | ELOV | <u>Zkoušené zařízení EZ</u> | — | Z číselníku zařízení synchronizovaného z AŘP |
| 5 | E | EText | Lokalita / rozvodna | — | Umístění zkoušeného zařízení |
| 6 | E | ELOV | Citlivost dat | — | Klasifikace žádosti, z číselníku citlivostDat_E (výchozí Interní) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat oblasti |

---

<a id="~DSZEZ-gui-G0005"></a>
## «Form area» Termín a program zkoušky

Oblast formuláře pro termín zkoušky a podrobný program zkoušky.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EDatumCas | <u>Termín zkoušky – od</u> | — | Začátek zkoušky |
| 2 | E | EDatumCas | <u>Termín zkoušky – do</u> | — | Konec zkoušky |
| 3 | E | EDlouhyText | <u>Program zkoušky</u> | — | Podrobný přehled činností a manipulací s časovým určením jednotlivých kroků (dle Kodexu PS) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat oblasti |

---

<a id="~DSZEZ-gui-G0006"></a>
## «Form area» Požadovaná součinnost ČEPS

Oblast formuláře pro popis součinnosti požadované od ČEPS. Údaje této oblasti vstupují do automatického určení schvalovatelů.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EAnoNe | <u>Vyžaduje součinnost ČEPS</u> | — | Řídí rozsah workflow |
| 2 | E | EDlouhyText | Popis požadované součinnosti ČEPS | — | Podrobně, včetně požadovaných manipulací |
| 3 | E | EAnoNe | Vyžaduje manipulace v rozvodnách | — | Vstupuje do určení schvalovatelů (odpojení ochran) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat oblasti |

---

<a id="~DSZEZ-gui-G0007"></a>
## «Form area» Přílohy žádosti

Oblast pro nahrání příloh žádosti. U některých typů zkoušek mohou být přílohy povinné.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EDragDrop | Nahrání příloh | — | Nahrání souborů přetažením |
| 2 | R | RList | Nahrané přílohy | — | Seznam nahraných souborů s možností odebrání |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Příloha](04_logicky_model.md#~DSZEZ-lm-L0006) | Zdroj dat oblasti |

---

<a id="~DSZEZ-gui-G0008"></a>
## «Form area» Souhlas s podmínkami

Oblast pro potvrzení souhlasu žadatele s podmínkami žádosti – zejména s odpovědností za správnost informací a za popis součinnosti s ČEPS.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | ECheck | <u>Souhlas s podmínkami žádosti</u> | — | Podmínka podání žádosti |
| 2 | R | RDlouhyText | Text podmínek žádosti | — | Znění podmínek (odpovědnost žadatele, součinnost s ČEPS) |

---

<a id="~DSZEZ-gui-G0009"></a>
## «Form» Pracovní plocha schvalovatele

Vstupní obrazovka schvalovatele a podpůrného útvaru. Zobrazuje přehled žádostí k posouzení a umožňuje nastavit zastupitelnost.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Pracovní plocha schvalovatele | — | Nadpis stránky |
| 2 | H | RText | Přihlášený schvalovatel | — | Jméno / útvar schvalovatele |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Nastavit zastupitelnost | — | Otevře dialog nastavení zastupitelnosti | [UC0013](02_use_case_model.md#~DSZEZ-uc-UC0013) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [Přehled žádostí ke schválení](#~DSZEZ-gui-G0010) | Tabulkový přehled žádostí k posouzení |
| opens | [Nastavení zastupitelnosti](#~DSZEZ-gui-G0019) | Dialog nastavení zastupitelnosti |

---

<a id="~DSZEZ-gui-G0010"></a>
## «Form grid area» Přehled žádostí ke schválení

Tabulkový přehled žádostí, které má přihlášený uživatel posoudit jako schvalovatel nebo podpůrný útvar. Jeden řádek = jedna žádost. Rám gridu obsahuje vyhledávání, filtr role/stavu a počet záznamů.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RKod | Číslo žádosti | — | Identifikátor žádosti |
| 2 | R | RText | Žadatel | — | Subjekt provádějící zkoušku |
| 3 | R | RLOV | Typ zkoušky | — | Z číselníku typZkousky_E |
| 4 | R | RDatumCas | Termín zkoušky | — | Plánovaný termín |
| 5 | R | RBarvaLOV | Stav žádosti | — | Z číselníku stavZadosti_E |
| 6 | R | RLOV | Moje role | — | Schvalovatel / podpůrný útvar |
| 7 | R | RDatum | Lhůta pro vyjádření | — | Termín pro posouzení / vyjádření |
| 8 | R | RPriznak | Blížící se termín | — | Příznak upozornění na blížící se lhůtu |
| 9 | R | RAkce | Akce | — | Akce řádku – viz Operace |
| 10 | H | EText | Vyhledávání | — | Rám gridu – fulltext nad žádostmi |
| 11 | H | ELOV | Filtr role / stavu | — | Rám gridu – omezuje zobrazené žádosti |
| 12 | H | RText | Počet záznamů | — | Rám gridu – „Žádosti ke schválení (N)" |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Otevřít detail | — | Zobrazí detail žádosti k posouzení | [UC0003](02_use_case_model.md#~DSZEZ-uc-UC0003) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Schvalovací workflow](04_logicky_model.md#~DSZEZ-lm-L0002) | Zdroj dat přehledu (úkoly workflow) |
| opens | [Detail žádosti](#~DSZEZ-gui-G0011) | Otevření detailu žádosti |

---

<a id="~DSZEZ-gui-G0011"></a>
## «Form» Detail žádosti

Detailní obrazovka žádosti o zkoušku. Slouží schvalovateli a podpůrnému útvaru k posouzení a žadateli ke sledování stavu. Sdružuje souhrn žádosti, vlákno komentářů, auditní stopu a oblast vyhodnocení.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | H | HText | Detail žádosti o zkoušku | — | Nadpis stránky |
| 2 | H | RKod | Číslo žádosti | — | Identifikátor žádosti |
| 3 | H | RBarvaLOV | Stav žádosti | — | Z číselníku stavZadosti_E |
| 4 | H | RText | Žadatel | — | Subjekt provádějící zkoušku |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Rozhodnout o žádosti | — | Otevře dialog schválení / zamítnutí | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) |
| 2 | Delegovat posouzení | — | Otevře dialog delegace na podpůrný útvar | [UC0005](02_use_case_model.md#~DSZEZ-uc-UC0005) |
| 3 | Vytvořit vyhodnocení | — | Zpřístupní oblast vyhodnocení provedené zkoušky | [UC0010](02_use_case_model.md#~DSZEZ-uc-UC0010) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| contains | [Souhrn žádosti](#~DSZEZ-gui-G0012) | Read-only souhrn údajů žádosti |
| contains | [Komentáře a vyjádření](#~DSZEZ-gui-G0013) | Vlákno komentářů a vyjádření |
| contains | [Auditní stopa workflow](#~DSZEZ-gui-G0014) | Přehled událostí workflow |
| contains | [Vyhodnocení provedené zkoušky](#~DSZEZ-gui-G0015) | Oblast vyhodnocení zkoušky |
| opens | [Delegace na podpůrný útvar](#~DSZEZ-gui-G0017) | Dialog delegace |
| opens | [Rozhodnutí o žádosti](#~DSZEZ-gui-G0018) | Dialog rozhodnutí |
| dataSource | [Schvalovací workflow](04_logicky_model.md#~DSZEZ-lm-L0002) | Zdroj dat detailu |

---

<a id="~DSZEZ-gui-G0012"></a>
## «Form area» Souhrn žádosti

Read-only souhrn všech údajů podané žádosti pro potřeby posouzení.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RLOV | Typ zkoušky | — | Z číselníku typZkousky_E |
| 2 | R | RDatumCas | Termín zkoušky | — | Plánovaný termín |
| 3 | R | RDlouhyText | Program zkoušky | — | Podrobný program s časovým určením |
| 4 | R | RAnoNe | Vyžaduje součinnost ČEPS | — | Příznak požadované součinnosti |
| 5 | R | RDlouhyText | Popis požadované součinnosti ČEPS | — | Klíčový podklad rychlého posouzení |
| 6 | R | RList | Přílohy žádosti | — | Seznam příloh ke stažení |
| 7 | R | RPriznak | Vyznačení změn | — | U upravené žádosti zvýrazňuje pole změněná oproti původní žádosti |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Žádost o zkoušku](04_logicky_model.md#~DSZEZ-lm-L0001) | Zdroj dat souhrnu |

---

<a id="~DSZEZ-gui-G0013"></a>
## «Form multi area» Komentáře a vyjádření

Chronologické vlákno komentářů schvalovatelů, pokynů delegace a vyjádření podpůrných útvarů. Jeden záznam = jeden příspěvek vlákna.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RText | Autor | — | Schvalovatel / podpůrný útvar / žadatel |
| 2 | R | RLOV | Typ záznamu | — | Komentář / pokyn delegace / vyjádření |
| 3 | R | RDatumCas | Datum a čas | — | Čas vložení záznamu |
| 4 | R | RDlouhyText | Text | — | Obsah komentáře / vyjádření |
| 5 | R | RPriznak | Záznam zrušeného workflow | — | Označuje příspěvky náležející k předchozímu (zrušenému) workflow |
| 6 | E | EDlouhyText | Nový komentář / vyjádření | — | Vstup pro nový příspěvek |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Zapsat komentář | — | Přidá komentář k žádosti | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) |
| 2 | Zapsat vyjádření | — | Uloží vyjádření podpůrného útvaru jako odpověď na pokyn | [UC0006](02_use_case_model.md#~DSZEZ-uc-UC0006) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Komentář](04_logicky_model.md#~DSZEZ-lm-L0005) | Zdroj dat vlákna |
| dataSource | [Delegace vyjádření](04_logicky_model.md#~DSZEZ-lm-L0004) | Pokyny delegace a vyjádření |

---

<a id="~DSZEZ-gui-G0014"></a>
## «Form multi area» Auditní stopa workflow

Read-only chronologický přehled událostí schvalovacího workflow pro účely auditovatelnosti. Jeden záznam = jedna událost.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | R | RDatumCas | Datum a čas | — | Čas události |
| 2 | R | RText | Účastník | — | Aktér / komponenta, která událost vyvolala |
| 3 | R | RText | Událost | — | Popis události workflow |
| 4 | R | RLOV | Výsledek | — | U rozhodovacích událostí (schváleno / zamítnuto) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Schvalovací workflow](04_logicky_model.md#~DSZEZ-lm-L0002) | Zdroj dat auditní stopy |

---

<a id="~DSZEZ-gui-G0015"></a>
## «Form area» Vyhodnocení provedené zkoušky

Oblast pro písemné vyhodnocení provedené zkoušky vytvářené subjektem zkoušky a jeho kontrolu ze strany ČEPS.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EDlouhyText | Vyhodnocení zkoušky | — | Písemné vyhodnocení subjektu zkoušky |
| 2 | E | EDragDrop | Podklady vyhodnocení | — | Doplňující podklady k vyhodnocení |
| 3 | E | EDlouhyText | Výhrady ČEPS | — | Výhrady zástupců ČEPS k vyhodnocení |
| 4 | R | RLOV | Stav vyhodnocení | — | Rozpracované / ke kontrole / přijaté |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Odeslat vyhodnocení | — | Odešle vyhodnocení ČEPS ke kontrole | [UC0010](02_use_case_model.md#~DSZEZ-uc-UC0010) |
| 2 | Zapsat výhrady | — | Zapíše výhrady ČEPS k vyhodnocení | [UC0011](02_use_case_model.md#~DSZEZ-uc-UC0011) |
| 3 | Schválit vyhodnocení | — | Schválí přijetí řádného vyhodnocení a archivuje zkoušku | [UC0011](02_use_case_model.md#~DSZEZ-uc-UC0011) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Vyhodnocení zkoušky](04_logicky_model.md#~DSZEZ-lm-L0007) | Zdroj dat oblasti |

---

<a id="~DSZEZ-gui-G0016"></a>
## «Form modal» Výběr typu zkoušky

Modální dialog pro volbu typu zkoušky před zahájením vyplňování žádosti.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EPrepinac | <u>Typ zkoušky</u> | — | Provozní / certifikační / riziková / předkomplexní / komplexní / periodická |
| 2 | R | RText | Popis zvoleného typu | — | Krátká nápověda k vybranému typu zkoušky |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Pokračovat | — | Připraví formulář žádosti dle zvoleného typu | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) |
| 2 | Zrušit | — | Zavře dialog bez založení žádosti | [UC0001](02_use_case_model.md#~DSZEZ-uc-UC0001) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| opens | [Žádost o zkoušku](#~DSZEZ-gui-G0003) | Otevření formuláře žádosti dle typu |

---

<a id="~DSZEZ-gui-G0017"></a>
## «Form modal» Delegace na podpůrný útvar

Modální dialog, kterým schvalovatel deleguje dílčí posouzení na podpůrný útvar.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | ELOV | <u>Podpůrný útvar / osoba</u> | — | Útvar nebo osoba ČEPS k vyjádření |
| 2 | E | EDlouhyText | <u>Pokyn</u> | — | Co a proč je po podpůrném útvaru požadováno |
| 3 | E | EDatum | <u>Lhůta pro vyjádření</u> | — | Termín, do kdy se má útvar vyjádřit |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Delegovat | — | Vytvoří delegaci a notifikuje podpůrný útvar | [UC0005](02_use_case_model.md#~DSZEZ-uc-UC0005) |
| 2 | Zrušit | — | Zavře dialog bez vytvoření delegace | [UC0005](02_use_case_model.md#~DSZEZ-uc-UC0005) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Delegace vyjádření](04_logicky_model.md#~DSZEZ-lm-L0004) | Cílová entita delegace |

---

<a id="~DSZEZ-gui-G0018"></a>
## «Form modal» Rozhodnutí o žádosti

Modální dialog, kterým schvalovatel schválí nebo zamítne svou část schvalovacího workflow.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | EPrepinac | <u>Výsledek</u> | — | Schváleno / zamítnuto |
| 2 | E | EDlouhyText | Odůvodnění | — | Povinné při zamítnutí, volitelné při schválení |
| 3 | E | EDlouhyText | Dodatečné podmínky realizace | — | Volitelné při schválení – podmínky, za kterých je zkouška realizovatelná |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Schválit | — | Zaznamená schválení části workflow | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) |
| 2 | Zamítnout | — | Zaznamená zamítnutí zkoušky s povinným odůvodněním | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) |
| 3 | Zrušit | — | Zavře dialog bez rozhodnutí | [UC0004](02_use_case_model.md#~DSZEZ-uc-UC0004) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Posouzení schvalovatele](04_logicky_model.md#~DSZEZ-lm-L0003) | Cílová entita rozhodnutí |

---

<a id="~DSZEZ-gui-G0019"></a>
## «Form modal» Nastavení zastupitelnosti

Modální dialog pro nastavení zástupce schvalovatele po dobu jeho nepřítomnosti.

### Atributy

| # | Kat. | GUI typ | Název | Alias | Poznámka |
|---|---|---|---|---|---|
| 1 | E | ELOV | <u>Zástupce</u> | — | Uživatel přebírající úkoly po dobu nepřítomnosti |
| 2 | E | EDatum | <u>Platnost od</u> | — | Začátek období zastupitelnosti |
| 3 | E | EDatum | <u>Platnost do</u> | — | Konec období zastupitelnosti |

### Operace

| # | Název | Alias | Popis | Vazba na UC |
|---|---|---|---|---|
| 1 | Uložit | — | Uloží nastavení zastupitelnosti | [UC0013](02_use_case_model.md#~DSZEZ-uc-UC0013) |
| 2 | Zrušit | — | Zavře dialog bez uložení | [UC0013](02_use_case_model.md#~DSZEZ-uc-UC0013) |

### Relace

| Typ | Cíl | Popis |
|---|---|---|
| dataSource | [Zastupitelnost](04_logicky_model.md#~DSZEZ-lm-L0011) | Cílová entita zastupitelnosti |
