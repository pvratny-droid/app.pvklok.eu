# Use Case model

Use Case model popisuje typové úlohy aplikace DSZEZ. Každý UC pokrývá **jeden scénář**;
sdílené kroky jsou zachyceny jako pravidla `P-UC…`. Cross-linky vedou na realizované funkční
požadavky, dotčené GUI prvky a sekvenční diagramy.

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC0001 | Podat žádost o zkoušku | [FR0001](01_model_pozadavku.md#~DSZEZ-fr-FR0001), [FR0003](01_model_pozadavku.md#~DSZEZ-fr-FR0003) | «include» UC0007 |
| UC0002 | Uložit rozpracovanou žádost | [FR0002](01_model_pozadavku.md#~DSZEZ-fr-FR0002) | — |
| UC0003 | Rychle posoudit žádost | [FR0004](01_model_pozadavku.md#~DSZEZ-fr-FR0004) | předchází UC0004 |
| UC0004 | Věcně posoudit žádost | [FR0004](01_model_pozadavku.md#~DSZEZ-fr-FR0004) | «include» UC0007; «extend» UC0005 |
| UC0005 | Delegovat posouzení na podpůrný útvar | [FR0005](01_model_pozadavku.md#~DSZEZ-fr-FR0005) | «include» UC0007 |
| UC0006 | Vyjádřit se k delegované žádosti | [FR0005](01_model_pozadavku.md#~DSZEZ-fr-FR0005) | «include» UC0007 |
| UC0007 | Notifikovat účastníka workflow | [FR0006](01_model_pozadavku.md#~DSZEZ-fr-FR0006) | systémový – «include» z UC0001/0004/0005/0006/0008/0010 |
| UC0008 | Změnit žádost o zkoušku | [FR0007](01_model_pozadavku.md#~DSZEZ-fr-FR0007) | «include» UC0007 |
| UC0009 | Sledovat stav žádosti | [FR0008](01_model_pozadavku.md#~DSZEZ-fr-FR0008), [FR0009](01_model_pozadavku.md#~DSZEZ-fr-FR0009) | — |
| UC0010 | Vytvořit vyhodnocení provedené zkoušky | [FR0010](01_model_pozadavku.md#~DSZEZ-fr-FR0010) | «include» UC0007 |
| UC0011 | Posoudit vyhodnocení zkoušky | [FR0010](01_model_pozadavku.md#~DSZEZ-fr-FR0010), [FR0009](01_model_pozadavku.md#~DSZEZ-fr-FR0009) | — |
| UC0012 | Předat schválenou zkoušku do AŘP | [FR0011](01_model_pozadavku.md#~DSZEZ-fr-FR0011) | systémový – vedlejší aktér AŘP |
| UC0013 | Nastavit zastupitelnost | [FR0012](01_model_pozadavku.md#~DSZEZ-fr-FR0012) | — |

```plantuml file=diagrams/uc_diagram.puml
```

---

<a id="~DSZEZ-uc-UC0001"></a>
## UC0001 – Podat žádost o zkoušku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Žadatel podá novou žádost o zkoušku EZ tak, aby byla zkontrolována a předána do schvalovacího workflow. |
| **Aktér** | Žadatel o zkoušku |
| **Zdrojový požadavek** | [FR0001](01_model_pozadavku.md#~DSZEZ-fr-FR0001), [FR0003](01_model_pozadavku.md#~DSZEZ-fr-FR0003) |
| **Sekvenční diagram** | [SD-UC0001](05_sekvencni_diagramy.md#DSZEZ-sd-UC0001) |

**Vstupní podmínky:** Žadatel má přístup do aplikace a je přihlášen ke svému účtu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Žadatel na portálu žadatele zvolí „Nová žádost". | [Portál žadatele](03_gui_model.md#~DSZEZ-gui-G0001) / NováŽádost() |
| 2 | Aplikace zobrazí dialog výběru typu zkoušky. | [Výběr typu zkoušky](03_gui_model.md#~DSZEZ-gui-G0016) |
| 3 | Žadatel zvolí typ zkoušky a potvrdí. | [Výběr typu zkoušky](03_gui_model.md#~DSZEZ-gui-G0016) / Pokračovat() |
| 4 | Aplikace připraví a zobrazí formulář žádosti s předdefinovanou skladbou a vyznačením povinných polí dle typu zkoušky. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 5 | Žadatel vyplní základní údaje o zkoušce. | [Základní údaje žádosti](03_gui_model.md#~DSZEZ-gui-G0004) |
| 6 | Žadatel vyplní termín a program zkoušky (časové určení jednotlivých kroků). | [Termín a program zkoušky](03_gui_model.md#~DSZEZ-gui-G0005) |
| 7 | Žadatel popíše požadovanou součinnost ČEPS. | [Požadovaná součinnost ČEPS](03_gui_model.md#~DSZEZ-gui-G0006) |
| 8 | Žadatel nahraje přílohy žádosti. | [Přílohy žádosti](03_gui_model.md#~DSZEZ-gui-G0007) |
| 9 | Žadatel potvrdí souhlas s podmínkami žádosti. | [Souhlas s podmínkami](03_gui_model.md#~DSZEZ-gui-G0008) |
| 10 | Žadatel zvolí „Podat žádost". | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) / PodatŽádost() |
| 11 | Aplikace uloží formulář a zkontroluje vyplnění a formát povinných polí i nahrání povinných příloh. | — |
| 12 | Aplikace dle pravidel a zadaných údajů určí okruh schvalovatelů a parametry workflow. | — |
| 13 | Aplikace založí záznam o zkoušce a spustí na něm schvalovací workflow. | — |
| 14 | Aplikace notifikuje určené schvalovatele o žádosti k posouzení («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |
| 15 | Aplikace zobrazí žadateli potvrzení o podání a žádost zařadí do jeho účtu. | [Portál žadatele](03_gui_model.md#~DSZEZ-gui-G0001) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 3a | Žadatel dialog výběru typu zavře / zvolí „Zrušit". | Aplikace se vrátí na portál žadatele bez založení žádosti. | [Výběr typu zkoušky](03_gui_model.md#~DSZEZ-gui-G0016) |
| 9a | Žadatel nevyplnil některá nepovinná pole. | Po stisku „Podat žádost" aplikace zobrazí pop-up upozornění s doporučením pole doplnit; žadatel může pokračovat v podání, nebo se vrátit k doplnění. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 10a | Žadatel místo podání zvolí „Uložit rozpracované". | Pokračuje [UC0002](#~DSZEZ-uc-UC0002). | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 11a | Povinné pole není vyplněno nebo má chybný formát, případně chybí povinná příloha. | Aplikace zobrazí chybovou hlášku s důvodem, zvýrazní chybná pole a vrátí formulář k opravě (návrat na krok 5). | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0001-1 | Žádost nelze podat, dokud nejsou vyplněna všechna povinná pole ve správném formátu a nahrány povinné přílohy. | 11 → alt 11a |
| P-UC0001-2 | Skladba polí formuláře a jejich povinnost se řídí zvoleným typem zkoušky. | 4 |
| P-UC0001-3 | Okruh schvalovatelů a parametry workflow (pořadí, lhůty) se určují dle předdefinované sady pravidel a údajů zadaných žadatelem (zejm. požadovaná součinnost ČEPS). | 12 |
| P-UC0001-4 | Potvrzení souhlasu s podmínkami žádosti je podmínkou podání. | 9, 10 |

**Koncové podmínky:** Je založen záznam o zkoušce ve stavu „Ve schvalování", běží schvalovací workflow, schvalovatelé jsou notifikováni, žádost je v účtu žadatele.

---

<a id="~DSZEZ-uc-UC0002"></a>
## UC0002 – Uložit rozpracovanou žádost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Žadatel uloží rozpracovanou žádost, aby v jejím vyplňování mohl pokračovat později. |
| **Aktér** | Žadatel o zkoušku |
| **Zdrojový požadavek** | [FR0002](01_model_pozadavku.md#~DSZEZ-fr-FR0002) |

**Vstupní podmínky:** Žadatel má otevřený formulář žádosti o zkoušku.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Žadatel ve formuláři žádosti zvolí „Uložit rozpracované". | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) / UložitRozpracované() |
| 2 | Aplikace vyzve žadatele k pojmenování rozpracované žádosti. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 3 | Žadatel zadá název a potvrdí. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 4 | Aplikace uloží rozpracovanou žádost do účtu žadatele bez spuštění kontroly a workflow. | — |
| 5 | Aplikace zobrazí rozpracovanou žádost v přehledu žádostí na portálu žadatele. | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 1a | Žadatel chce pokračovat v dříve uložené rozpracované žádosti. | Otevře ji z přehledu na portálu; aplikace zobrazí formulář s uloženými hodnotami (pokračuje [UC0001](#~DSZEZ-uc-UC0001) od kroku 5). | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) |
| 3a | Žadatel zruší pojmenování. | Žádost se neuloží, formulář zůstává otevřen. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0002-1 | Žadatel může mít současně uloženo více rozpracovaných žádostí. | 4 |
| P-UC0002-2 | Rozpracovaná žádost se ukládá v rámci jediného účtu, nesdílí se napříč účty. | 4 |

**Koncové podmínky:** Rozpracovaná žádost je uložena v účtu žadatele ve stavu „Rozpracovaná".

---

<a id="~DSZEZ-uc-UC0003"></a>
## UC0003 – Rychle posoudit žádost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel rychlým posouzením ověří, zda je žádost srozumitelná a obsahuje dostatečně popsanou požadovanou součinnost ČEPS. |
| **Aktér** | Schvalovatel |
| **Zdrojový požadavek** | [FR0004](01_model_pozadavku.md#~DSZEZ-fr-FR0004) |
| **Sekvenční diagram** | [SD-UC0003](05_sekvencni_diagramy.md#DSZEZ-sd-UC0003) |

**Vstupní podmínky:** Schvalovatel byl notifikován o žádosti k posouzení; žádost je ve stavu „Ve schvalování".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel na pracovní ploše schvalovatele otevře žádost z přehledu žádostí ke schválení. | [Přehled žádostí ke schválení](03_gui_model.md#~DSZEZ-gui-G0010) / OtevřítDetail() |
| 2 | Aplikace zobrazí detail žádosti se souhrnem údajů. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011), [Souhrn žádosti](03_gui_model.md#~DSZEZ-gui-G0012) |
| 3 | Schvalovatel zkontroluje, zda je správně a srozumitelně popsána požadovaná součinnost ČEPS (metoda „kouknu a vidím"). | [Souhrn žádosti](03_gui_model.md#~DSZEZ-gui-G0012) |
| 4 | Schvalovatel vyhodnotí, že žádost je srozumitelná a součinnost je popsána dostatečně (nebo že součinnost ČEPS není požadována). | — |
| 5 | Schvalovatel přistoupí k věcnému posouzení žádosti (pokračuje [UC0004](#~DSZEZ-uc-UC0004)). | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 4a | Žádost na první pohled neobsahuje dostatek informací nebo informace nejsou srozumitelné/přesné. | Schvalovatel žádost ve své kompetenci zamítne a zapíše důvod zamítnutí (pokračuje rozhodnutím dle [UC0004](#~DSZEZ-uc-UC0004), alt. 6a). | [Rozhodnutí o žádosti](03_gui_model.md#~DSZEZ-gui-G0018) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0003-1 | Schvalovatel není povinen prohledávat průvodní dokumentaci, aby žádost posoudil; za srozumitelné a úplné informace odpovídá žadatel. | 3 |
| P-UC0003-2 | Rychlé a věcné posouzení tvoří jediný běh workflow pro daného schvalovatele – schválení/zamítnutí se v aplikaci provádí pouze jednou. | 5 |

**Koncové podmínky:** Schvalovatel pokračuje věcným posouzením, nebo žádost zamítl s uvedeným důvodem.

---

<a id="~DSZEZ-uc-UC0004"></a>
## UC0004 – Věcně posoudit žádost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel odborně posoudí proveditelnost zkoušky a svou část workflow schválí nebo zamítne. |
| **Aktér** | Schvalovatel |
| **Zdrojový požadavek** | [FR0004](01_model_pozadavku.md#~DSZEZ-fr-FR0004) |
| **Sekvenční diagram** | [SD-UC0004](05_sekvencni_diagramy.md#DSZEZ-sd-UC0004) |

**Vstupní podmínky:** Žádost prošla rychlým posouzením ([UC0003](#~DSZEZ-uc-UC0003)); schvalovatel má otevřen detail žádosti.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel posoudí proveditelnost zkoušky z informací uvedených v žádosti dle své kompetence. | [Souhrn žádosti](03_gui_model.md#~DSZEZ-gui-G0012) |
| 2 | Schvalovatel zváží, zda potřebuje vyjádření jiného útvaru ČEPS. | — |
| 3 | Schvalovatel vyhodnotí, že má dostatek podkladů pro rozhodnutí. | [Komentáře a vyjádření](03_gui_model.md#~DSZEZ-gui-G0013) |
| 4 | Schvalovatel zvolí „Rozhodnout o žádosti". | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) / Rozhodnout() |
| 5 | Aplikace zobrazí dialog rozhodnutí. | [Rozhodnutí o žádosti](03_gui_model.md#~DSZEZ-gui-G0018) |
| 6 | Schvalovatel zvolí výsledek „Schváleno", volitelně zapíše odůvodnění a dodatečné podmínky realizace zkoušky a potvrdí. | [Rozhodnutí o žádosti](03_gui_model.md#~DSZEZ-gui-G0018) / Schválit() |
| 7 | Aplikace zaznamená schválení části workflow daným schvalovatelem. | — |
| 8 | Aplikace vyhodnotí stav workflow – jsou-li vypořádáni všichni schvalovatelé, nastaví žádost do stavu „Schválená". | — |
| 9 | Aplikace notifikuje žadatele a ostatní schvalovatele o výsledku («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 2a | Schvalovatel potřebuje asistenci jiného útvaru ČEPS. | Deleguje dílčí posouzení («extend» [UC0005](#~DSZEZ-uc-UC0005)); po získání vyjádření se vrací na krok 1. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |
| 6a | Schvalovatel zvolí výsledek „Zamítnuto". | Schvalovatel je povinen zapsat důvod zamítnutí; aplikace zamítne celou zkoušku, nastaví žádost do stavu „Zamítnutá" a notifikuje žadatele i ostatní schvalovatele. | [Rozhodnutí o žádosti](03_gui_model.md#~DSZEZ-gui-G0018) / Zamítnout() |
| 6b | Schvalovatel zavře dialog rozhodnutí bez potvrzení. | Žádost zůstává schvalovateli k posouzení beze změny. | [Rozhodnutí o žádosti](03_gui_model.md#~DSZEZ-gui-G0018) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0004-1 | Při zamítnutí je schvalovatel povinen uvést důvod; při schválení je odůvodnění volitelné. | 6 → alt 6a |
| P-UC0004-2 | Zamítnutí kteroukoli částí workflow znamená zamítnutí celé zkoušky. | alt 6a |
| P-UC0004-3 | Schvalovatel má finální odpovědnost za schválení/zamítnutí své části; podpůrné útvary se vyjadřují pouze k němu. | 1 |
| P-UC0004-4 | Při rozporu termínů ve formuláři a v přílohách platí termín uvedený ve formuláři. | 1 |

**Koncové podmínky:** Část workflow daného schvalovatele je vypořádána; po vypořádání všech schvalovatelů je žádost schválena nebo zamítnuta.

---

<a id="~DSZEZ-uc-UC0005"></a>
## UC0005 – Delegovat posouzení na podpůrný útvar

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel deleguje dílčí posouzení žádosti na podpůrný útvar a zadá, co je požadováno. |
| **Aktér** | Schvalovatel |
| **Zdrojový požadavek** | [FR0005](01_model_pozadavku.md#~DSZEZ-fr-FR0005) |
| **Sekvenční diagram** | [SD-UC0005](05_sekvencni_diagramy.md#DSZEZ-sd-UC0005) |

**Vstupní podmínky:** Schvalovatel má otevřen detail žádosti v rámci věcného posouzení ([UC0004](#~DSZEZ-uc-UC0004)).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel v detailu žádosti zvolí „Delegovat posouzení". | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) / Delegovat() |
| 2 | Aplikace zobrazí dialog delegace. | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) |
| 3 | Schvalovatel zvolí podpůrný útvar (osobu). | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) |
| 4 | Schvalovatel zapíše pokyn – co a proč je po podpůrném útvaru požadováno. | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) |
| 5 | Schvalovatel nastaví lhůtu pro vyjádření. | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) |
| 6 | Schvalovatel potvrdí delegaci. | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) / Delegovat() |
| 7 | Aplikace zaznamená delegaci k žádosti. | — |
| 8 | Aplikace notifikuje podpůrný útvar o potřebě vyjádření («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 6a | Schvalovatel zavře dialog delegace bez potvrzení. | Delegace nevznikne. | [Delegace na podpůrný útvar](03_gui_model.md#~DSZEZ-gui-G0017) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0005-1 | Schvalovatel může v rámci jednoho posouzení delegovat opakovaně (i na tentýž útvar). | 1 |
| P-UC0005-2 | Odpovědnost za vypořádání žádosti, dodržení lhůt a interpretaci vyjádření zůstává na schvalovateli. | 7 |

**Koncové podmínky:** Delegace je zaznamenána k žádosti, podpůrný útvar je notifikován.

---

<a id="~DSZEZ-uc-UC0006"></a>
## UC0006 – Vyjádřit se k delegované žádosti

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Podpůrný útvar posoudí dotazovanou skutečnost a zapíše vyjádření k žádosti. |
| **Aktér** | Podpůrný útvar |
| **Zdrojový požadavek** | [FR0005](01_model_pozadavku.md#~DSZEZ-fr-FR0005) |

**Vstupní podmínky:** Podpůrný útvar byl notifikován o delegaci s pokynem schvalovatele.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Podpůrný útvar otevře žádost s delegovaným pokynem. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |
| 2 | Aplikace zobrazí detail žádosti, pokyn schvalovatele a kontext žádosti. | [Komentáře a vyjádření](03_gui_model.md#~DSZEZ-gui-G0013) |
| 3 | Podpůrný útvar posoudí žádost v rozsahu pokynu s využitím všech informací z žádosti. | [Souhrn žádosti](03_gui_model.md#~DSZEZ-gui-G0012) |
| 4 | Podpůrný útvar zapíše vyjádření jako odpověď na pokyn schvalovatele. | [Komentáře a vyjádření](03_gui_model.md#~DSZEZ-gui-G0013) / ZapsatVyjádření() |
| 5 | Aplikace uloží vyjádření k žádosti. | — |
| 6 | Aplikace notifikuje schvalovatele o získaném vyjádření («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 3a | Blíží se termín k vyjádření. | Aplikace notifikuje podpůrný útvar o blížícím se termínu («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0006-1 | Podpůrný útvar posuzuje pouze dotazované skutečnosti v rozsahu pokynu schvalovatele; není odpovědný za schválení zkoušky. | 3 |

**Koncové podmínky:** Vyjádření podpůrného útvaru je uloženo k žádosti, schvalovatel je notifikován.

---

<a id="~DSZEZ-uc-UC0007"></a>
## UC0007 – Notifikovat účastníka workflow

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Aplikace informuje účastníka workflow o relevantní události. |
| **Aktér** | — (systémový UC, vyvoláván přes «include» z jiných UC) |
| **Zdrojový požadavek** | [FR0006](01_model_pozadavku.md#~DSZEZ-fr-FR0006) |

**Vstupní podmínky:** Ve schvalovacím workflow nastala notifikovatelná událost.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Aplikace zjistí nastalou událost workflow (přijatá žádost, potřeba vyjádření, blížící se termín, získané vyjádření, rozhodnutí, vložený komentář, změna stavu). | — |
| 2 | Aplikace určí adresáty notifikace dle typu události a parametrů workflow. | — |
| 3 | Aplikace odešle notifikaci určeným adresátům. | — |
| 4 | Aplikace zobrazí informaci o události též v GUI dotčených uživatelů. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 1a | Událostí je zamítnutí žádosti. | Adresáty jsou žadatel a všichni schvalovatelé; žadatel je informován i v GUI aplikace. | — |
| 1b | Událostí je schválení doprovázené komentářem. | Adresáty jsou všichni schvalovatelé, aby se s komentářem (např. upřesnění podmínky ovlivňující jiného schvalovatele) seznámili. | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0007-1 | Žadatel je o zamítnutí žádosti informován vždy též v GUI aplikace, nejen notifikací. | alt 1a |
| P-UC0007-2 | Kanál notifikace (e-mail / ticket / aplikace) není v zadání rozhodnut – viz Otevřené otázky. | 3 |

**Koncové podmínky:** Adresáti jsou informováni o události workflow.

---

<a id="~DSZEZ-uc-UC0008"></a>
## UC0008 – Změnit žádost o zkoušku

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Žadatel upraví existující žádost a znovu ji předá do schvalování. |
| **Aktér** | Žadatel o zkoušku |
| **Zdrojový požadavek** | [FR0007](01_model_pozadavku.md#~DSZEZ-fr-FR0007) |
| **Sekvenční diagram** | [SD-UC0008](05_sekvencni_diagramy.md#DSZEZ-sd-UC0008) |

**Vstupní podmínky:** V účtu žadatele existuje žádost ve stavu podaná, schválená, nebo zamítnutá.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Žadatel na portálu žadatele otevře existující žádost a zvolí „Upravit žádost". | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) / UpravitŽádost() |
| 2 | Aplikace zobrazí formulář žádosti předvyplněný původními hodnotami. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 3 | Žadatel provede potřebné změny v polích formuláře. | [Základní údaje žádosti](03_gui_model.md#~DSZEZ-gui-G0004), [Termín a program zkoušky](03_gui_model.md#~DSZEZ-gui-G0005), [Požadovaná součinnost ČEPS](03_gui_model.md#~DSZEZ-gui-G0006) |
| 4 | Žadatel zvolí „Uložit změny". | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) / UložitZměny() |
| 5 | Aplikace upozorní žadatele, že jde o nevratnou operaci rušící dosavadní průběh schvalování. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 6 | Žadatel potvrdí upozornění. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 7 | Aplikace provede kontrolu vyplnění a formátu a určí schvalovatele a parametry workflow. | — |
| 8 | Aplikace zruší dosavadní workflow (komentáře a vyjádření zachová jako odlišený kontext) a založí nové schvalovací workflow. | — |
| 9 | Aplikace schvalovatelům viditelně vyznačí změny provedené v upravené žádosti oproti původní. | — |
| 10 | Aplikace notifikuje schvalovatele o žádosti k posouzení («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 4a | Žadatel zahodí změny. | Žádost zůstává beze změny, dosavadní workflow pokračuje. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 6a | Žadatel upozornění nepotvrdí (vrátí se zpět). | Žádost zůstává beze změny. | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |
| 7a | Kontrola odhalí chyby ve formuláři. | Aplikace vrátí formulář k opravě se zvýrazněním chybných polí (návrat na krok 3). | [Žádost o zkoušku](03_gui_model.md#~DSZEZ-gui-G0003) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0008-1 | Změna žádosti je nevratná operace – ruší částečné i kompletní schválení. | 5, 8 |
| P-UC0008-2 | Komentáře a vyjádření z předchozího workflow zůstávají uloženy pro kontext, viditelně odlišené jako náležející k již neexistujícímu workflow. | 8 |
| P-UC0008-3 | Změna se vůči integrovaným systémům projeví jako zrušení zkoušky; schválení změny se propaguje jako nová zkouška. | 8 |
| P-UC0008-4 | Pravidlo platí pro plně schválenou, částečně schválenou i zamítnutou žádost. | 1 |

**Koncové podmínky:** Žádost je aktualizována, běží nové schvalovací workflow, schvalovatelé jsou notifikováni.

---

<a id="~DSZEZ-uc-UC0009"></a>
## UC0009 – Sledovat stav žádosti

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Žadatel sleduje aktuální stav a průběh schvalování svých žádostí. |
| **Aktér** | Žadatel o zkoušku |
| **Zdrojový požadavek** | [FR0008](01_model_pozadavku.md#~DSZEZ-fr-FR0008), [FR0009](01_model_pozadavku.md#~DSZEZ-fr-FR0009) |

**Vstupní podmínky:** Žadatel je přihlášen ke svému účtu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Žadatel otevře portál žadatele. | [Portál žadatele](03_gui_model.md#~DSZEZ-gui-G0001) |
| 2 | Aplikace zobrazí přehled žádostí žadatele – rozpracovaných, podaných i vyřízených – s aktuálním stavem. | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) |
| 3 | Žadatel vybere žádost a otevře její detail. | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) / OtevřítDetail() |
| 4 | Aplikace zobrazí detail žádosti s aktuálním stavem workflow, vyjádřeními schvalovatelů a komentáři. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011), [Komentáře a vyjádření](03_gui_model.md#~DSZEZ-gui-G0013) |
| 5 | Žadatel sleduje průběh schvalování v reálném čase. | [Auditní stopa workflow](03_gui_model.md#~DSZEZ-gui-G0014) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 2a | Žadatel filtruje přehled dle stavu žádosti. | Aplikace zobrazí jen žádosti odpovídající zvolenému stavu. | [Přehled mých žádostí](03_gui_model.md#~DSZEZ-gui-G0002) |
| 4a | Žádost je již archivovaná. | Aplikace zobrazí detail z archivu včetně celého proběhlého workflow. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0009-1 | Žadatel vidí pouze vlastní žádosti (oprávnění dle RBAC, viz NREQ_007). | 2 |

**Koncové podmínky:** Žadatel má aktuální přehled o stavu svých žádostí.

---

<a id="~DSZEZ-uc-UC0010"></a>
## UC0010 – Vytvořit vyhodnocení provedené zkoušky

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Subjekt zkoušky vytvoří po provedení zkoušky její písemné vyhodnocení. |
| **Aktér** | Žadatel o zkoušku (subjekt zkoušky) |
| **Zdrojový požadavek** | [FR0010](01_model_pozadavku.md#~DSZEZ-fr-FR0010) |

**Vstupní podmínky:** Zkouška byla schválena a provedena; žádost je ve stavu „Zkouška provedena".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Žadatel otevře detail příslušné zkoušky. | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) |
| 2 | Žadatel zvolí „Vytvořit vyhodnocení". | [Detail žádosti](03_gui_model.md#~DSZEZ-gui-G0011) / VytvořitVyhodnocení() |
| 3 | Aplikace zobrazí oblast vyhodnocení zkoušky. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) |
| 4 | Žadatel zapíše písemné vyhodnocení provedené zkoušky a volitelně nahraje podklady. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) |
| 5 | Žadatel vyhodnocení odešle ke kontrole. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) / OdeslatVyhodnocení() |
| 6 | Aplikace uloží vyhodnocení a notifikuje zástupce ČEPS («include» [UC0007](#~DSZEZ-uc-UC0007)). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 4a | Žadatel reaguje na výhrady ČEPS k vyhodnocení. | Do textového pole vyhodnocení zapíše reakci, případně nahraje doplňující podklady, a znovu odešle ke kontrole (návrat na krok 5). | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0010-1 | Vyhodnocení vytváří subjekt zkoušky (původní žadatel) přímo u příslušné zkoušky. | 1 |

**Koncové podmínky:** Vyhodnocení je uloženo a předáno ČEPS ke kontrole.

---

<a id="~DSZEZ-uc-UC0011"></a>
## UC0011 – Posoudit vyhodnocení zkoušky

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Zástupce ČEPS zkontroluje vyhodnocení provedené zkoušky a rozhodne o jeho přijetí. |
| **Aktér** | Schvalovatel (zástupce ČEPS) |
| **Zdrojový požadavek** | [FR0010](01_model_pozadavku.md#~DSZEZ-fr-FR0010), [FR0009](01_model_pozadavku.md#~DSZEZ-fr-FR0009) |

**Vstupní podmínky:** Subjekt zkoušky odeslal vyhodnocení ke kontrole.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Zástupce ČEPS otevře oblast vyhodnocení zkoušky. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) |
| 2 | Zástupce ČEPS zkontroluje vyhodnocení a nahrané podklady. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) |
| 3 | Zástupce ČEPS vyhodnotí, že vyhodnocení je v pořádku. | — |
| 4 | Zástupce ČEPS schválí přijetí řádného vyhodnocení zkoušky. | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) / SchválitVyhodnocení() |
| 5 | Aplikace celý objekt zkoušky (žádost, průběh workflow, vyhodnocení, komunikaci) uloží a archivuje. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 3a | Zástupce ČEPS má k vyhodnocení výhrady. | Zapíše je do určeného textového pole a notifikuje subjekt zkoušky (pokračuje [UC0010](#~DSZEZ-uc-UC0010), alt. 4a; po reakci se vrací na krok 1). | [Vyhodnocení provedené zkoušky](03_gui_model.md#~DSZEZ-gui-G0015) / ZapsatVýhrady() |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0011-1 | Objekt zkoušky se archivuje až po schválení přijetí řádného vyhodnocení. | 5 |

**Koncové podmínky:** Vyhodnocení je přijato, objekt zkoušky je archivován ve stavu „Archivovaná".

---

<a id="~DSZEZ-uc-UC0012"></a>
## UC0012 – Předat schválenou zkoušku do AŘP

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Aplikace předá údaje o schválené zkoušce do systému AŘP. |
| **Aktér** | — (systémový UC); vedlejší aktér: AŘP |
| **Zdrojový požadavek** | [FR0011](01_model_pozadavku.md#~DSZEZ-fr-FR0011) |

**Vstupní podmínky:** Žádost o zkoušku byla schválena všemi schvalovateli.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Aplikace zjistí, že zkouška byla schválena. | — |
| 2 | Aplikace sestaví údaje o schválené zkoušce. | — |
| 3 | Aplikace předá údaje o schválené zkoušce do systému AŘP. | — |
| 4 | Aplikace zaznamená výsledek předání u zkoušky. | [Auditní stopa workflow](03_gui_model.md#~DSZEZ-gui-G0014) |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 1a | Zkouška byla změněna nebo zrušena. | Aplikace odešle do AŘP informaci o zrušení zkoušky. | — |
| 3a | Systém AŘP není dostupný. | Aplikace zaznamená neúspěšné předání a předání později zopakuje. | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0012-1 | Změna zkoušky se vůči AŘP projeví jako zrušení; schválení změny se předává jako nová zkouška. | alt 1a |
| P-UC0012-2 | Dostupnost a stav cílového systému AŘP nejsou v zadání potvrzeny – viz Otevřené otázky. | 3 |

**Koncové podmínky:** Údaje o zkoušce jsou předány do AŘP, výsledek předání je zaznamenán.

---

<a id="~DSZEZ-uc-UC0013"></a>
## UC0013 – Nastavit zastupitelnost

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Schvalovatel nastaví zástupce pro období své nepřítomnosti. |
| **Aktér** | Schvalovatel |
| **Zdrojový požadavek** | [FR0012](01_model_pozadavku.md#~DSZEZ-fr-FR0012) |

**Vstupní podmínky:** Schvalovatel je přihlášen ke svému účtu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Schvalovatel na pracovní ploše zvolí „Nastavit zastupitelnost". | [Pracovní plocha schvalovatele](03_gui_model.md#~DSZEZ-gui-G0009) / NastavitZastupitelnost() |
| 2 | Aplikace zobrazí dialog nastavení zastupitelnosti. | [Nastavení zastupitelnosti](03_gui_model.md#~DSZEZ-gui-G0019) |
| 3 | Schvalovatel zvolí zástupce. | [Nastavení zastupitelnosti](03_gui_model.md#~DSZEZ-gui-G0019) |
| 4 | Schvalovatel zadá období platnosti zastupitelnosti. | [Nastavení zastupitelnosti](03_gui_model.md#~DSZEZ-gui-G0019) |
| 5 | Schvalovatel potvrdí nastavení. | [Nastavení zastupitelnosti](03_gui_model.md#~DSZEZ-gui-G0019) / Uložit() |
| 6 | Aplikace uloží zastupitelnost – po dobu její platnosti přebírá úkoly schvalovatele určený zástupce. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce | Uses |
|---|---|---|---|
| 5a | Schvalovatel zavře dialog bez potvrzení. | Zastupitelnost se nenastaví. | [Nastavení zastupitelnosti](03_gui_model.md#~DSZEZ-gui-G0019) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC0013-1 | Zastupitelnost se nastavuje pouze pro procesy v rámci této aplikace, ne pro celou organizaci. | 6 |

**Koncové podmínky:** Zastupitelnost je nastavena pro zadané období.
