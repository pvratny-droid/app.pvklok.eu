# Model požadavků

Analýza popisuje **cílový business koncept** nové aplikace **DSZEZ – Digitální schvalování zkoušek EZ**
pro ČEPS, a.s. Systém digitalizuje agendu podávání a schvalování žádostí o zkoušky
elektroenergetických zařízení (EZ): nahrazuje stávající e-mailovou a PDF agendu jednotnou
webovou aplikací, která řídí schvalovací workflow a přenáší odpovědnost za správnost žádosti
na žadatele.

> **Zdroje analýzy:** `Digitální schvalování zkoušek EZ.docx` (BA dokument – TO-BE procesy),
> `Byznys požadavky.xlsx` (katalog REQ_WF / NREQ), `Identifikace účastníků workflow.xlsx`,
> `ČEPS_Quick_IT_Analýza_M3P_v1.1.docx`. Kapitoly „Funkční požadavky" a „Use Cases" hlavního
> BA dokumentu obsahují pouze placeholdery (Lorem ipsum / XXX); závazným zdrojem požadavků
> je proto textový popis TO-BE procesů a katalog `Byznys požadavky.xlsx`. Nekonzistence zadání
> a z nich plynoucí rizika jsou shrnuty v sekci **Otevřené otázky** v souboru `README.md`.

---

## Aktéři

| Aktér | Popis |
|---|---|
| **Žadatel o zkoušku** | Interní (ČEPS) nebo externí subjekt (provozovatel EZ, PDS, žadatel o certifikaci), který podává žádost o zkoušku EZ, sleduje její stav, mění ji a po provedení zkoušky vytváří její vyhodnocení. Odpovídá za správnost a úplnost informací v žádosti. |
| **Schvalovatel** | Organizační útvar nebo role ČEPS posuzující a schvalující žádost ve své kompetenci. Provádí rychlé i věcné posouzení, může delegovat dílčí posouzení na podpůrný útvar; má finální odpovědnost za schválení/zamítnutí své části workflow. |
| **Podpůrný útvar** | Útvar nebo osoba ČEPS, na kterou schvalovatel deleguje dílčí vyjádření. Posuzuje pouze dotazované skutečnosti, není odpovědný za schválení zkoušky. |
| **Správce workflow** | Útvar/role ČEPS spravující systémová nastavení – pravidla určení schvalovatelů, šablony formulářů a logiku workflow. *(Existence a vymezení role nejsou v zadání jednoznačně určeny – viz Otevřené otázky.)* |
| **AŘP** | Externí systém (plán přípravy provozu) – vedlejší aktér; přijímá údaje o schválených a zrušených zkouškách a poskytuje číselníky energetických zařízení. |

---

## Cíle

| ID | Cíl |
|---|---|
| **C01** | Digitalizovat agendu žádostí o zkoušky EZ – zavést jednotný řízený kanál namísto e-mailů, PDF a sdílených adresářů. |
| **C02** | Minimalizovat administrativní zátěž pracovníků ČEPS, zejména oddělení 13232 – Vyhodnocení SyS. |
| **C03** | Přenést odpovědnost za správnost a úplnost žádosti na žadatele o zkoušku. |
| **C04** | Zajistit auditovatelnost a dohledatelnost rozhodnutí, připomínek a komunikace v celém procesu. |
| **C05** | Zefektivnit a standardizovat schvalovací proces – automatické kontroly žádosti a automatické určení schvalovatelů. |

### Realizace cílů funkčními požadavky

```plantuml file=diagrams/fr_realizace.puml
```

---

## Funkční požadavky

Funkční požadavky jsou odvozeny z TO-BE procesů BA dokumentu a z katalogu `Byznys požadavky.xlsx`
(řada REQ_WF). Každý FR uvádí v řádku *Zdroj* mapování na položky katalogu. Diagram pod každým
požadavkem zobrazuje jeho vícevrstvou realizaci (FR → UC → GUI → LM).

<a id="~DSZEZ-fr-FR0001"></a>
### FR0001 – Podání žádosti o zkoušku

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje žadateli podat žádost o zkoušku EZ. Žadatel zvolí typ zkoušky, na jehož základě aplikace připraví odpovídající formulář s předdefinovanou skladbou polí a vyznačením polí povinných. Žadatel vyplní údaje o zkoušce včetně požadované součinnosti ČEPS, nahraje přílohy, potvrdí souhlas s podmínkami žádosti a žádost podá. Aplikace při podání zkontroluje vyplnění a formát povinných polí i nahrání povinných příloh; vadnou žádost vrací k opravě se zvýrazněním chybných polí. Na nevyplněná nepovinná pole aplikace výrazně upozorňuje (pop-up) s doporučením je doplnit. |
| **Návrh řešení** | Webové formuláře specifické pro každý typ zkoušky (skladba a povinnost polí dle typu); klientská i serverová validace povinnosti a formátu; checkbox souhlasu s podmínkami žádosti jako předpoklad odeslání. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 (formuláře pro provozní, certifikační a periodické zkoušky); IT2 (náročnější workflow rizikových, předkomplexních a komplexních zkoušek) |
| **Zdroj (katalog)** | REQ_WF_002, REQ_WF_003, REQ_WF_004, REQ_WF_006, REQ_WF_007, REQ_WF_009, REQ_WF_010 |

**Realizující UC:** [UC0001 – Podat žádost o zkoušku](02_use_case_model.md#~DSZEZ-uc-UC0001)

```plantuml file=diagrams/fr_realizace_fr0001.puml
```

---

<a id="~DSZEZ-fr-FR0002"></a>
### FR0002 – Uložení a správa rozpracované žádosti

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje žadateli uložit rozpracovanou (dosud nepodanou) žádost, pojmenovat ji a později se k ní vrátit ze svého uživatelského účtu. Žadatel může mít současně rozpracováno více žádostí. Funkce podporuje scénář, kdy primární žadatel připraví žádost a sekundární (kontrolní) útvar ji v rámci téhož účtu zkontroluje a upraví před podáním. |
| **Návrh řešení** | Perzistence rozpracovaného formuláře v uživatelském účtu s uživatelským názvem; seznam rozpracovaných žádostí na portálu žadatele. Ukládání je v rámci jediného účtu – ne sdílení napříč účty. |
| **Priorita** | Střední (v katalogu označeno „nice to have") |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_005 |

**Realizující UC:** [UC0002 – Uložit rozpracovanou žádost](02_use_case_model.md#~DSZEZ-uc-UC0002)

```plantuml file=diagrams/fr_realizace_fr0002.puml
```

---

<a id="~DSZEZ-fr-FR0003"></a>
### FR0003 – Automatické určení schvalovatelů a založení workflow

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Po úspěšné kontrole podané žádosti aplikace automaticky určí okruh schvalovatelů dané zkoušky. K určení využívá předdefinovanou sadu pravidel a údaje zadané žadatelem (typ zkoušky, požadavek na součinnost ČEPS, manipulace v rozvodnách apod.). Výsledek určení zahrnuje parametry běhu workflow – pořadí schvalovatelů a lhůty pro vyjádření. Na základě určení aplikace založí schvalovací workflow a nastaví jeho parametry. |
| **Návrh řešení** | Konfigurovatelná sada pravidel „Pravidla schvalování dle typu zkoušky"; vyhodnocení pravidel jako trigger po úspěšné validaci žádosti; založení instance workflow s odvozenými parametry. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_008, REQ_WF_011, REQ_WF_012 |

**Realizující UC:** [UC0001 – Podat žádost o zkoušku](02_use_case_model.md#~DSZEZ-uc-UC0001)

```plantuml file=diagrams/fr_realizace_fr0003.puml
```

---

<a id="~DSZEZ-fr-FR0004"></a>
### FR0004 – Běh schvalovacího workflow – rychlé a věcné posouzení

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace řídí běh schvalovacího workflow. Každý schvalovatel provádí v aplikaci posouzení žádosti pouze jednou. Metodicky se posouzení dělí na *rychlé posouzení* (kontrola, zda je požadovaná součinnost ČEPS popsána srozumitelně a dostatečně) a *věcné posouzení* (odborné posouzení proveditelnosti zkoušky dle kompetence schvalovatele). Schvalovatel svou část workflow schválí nebo zamítne; při zamítnutí je povinen uvést důvod, při schválení je odůvodnění volitelné a lze připojit dodatečné podmínky realizace zkoušky. |
| **Návrh řešení** | Jednotná akce posouzení v detailu žádosti s výsledkem schváleno/zamítnuto a textovým odůvodněním; metodické rozlišení rychlé/věcné posouzení slouží k odlehčení práce schvalovatele, nikoli ke dvěma samostatným záznamům. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_022, REQ_WF_027; BA dokument kap. 5.2.1 a 5.2.2. **Pozn.:** položky katalogu REQ_WF_015–REQ_WF_021 (proces „Běh schvalovacího workflow") jsou prázdné – viz Otevřené otázky. |

**Realizující UC:** [UC0003 – Rychle posoudit žádost](02_use_case_model.md#~DSZEZ-uc-UC0003), [UC0004 – Věcně posoudit žádost](02_use_case_model.md#~DSZEZ-uc-UC0004)

```plantuml file=diagrams/fr_realizace_fr0004.puml
```

---

<a id="~DSZEZ-fr-FR0005"></a>
### FR0005 – Delegace posouzení na podpůrný útvar

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje schvalovateli částečně delegovat posouzení žádosti na podpůrný útvar nebo osobu ČEPS. Schvalovatel do delegace zapíše, co a proč je po podpůrném útvaru požadováno, a nastaví lhůtu pro vyjádření. Podpůrný útvar posoudí žádost v kontextu pokynu a zapíše vyjádření. Delegaci lze v rámci jednoho posouzení opakovat (i na tentýž útvar). Odpovědnost za vypořádání žádosti, dodržení lhůt a interpretaci vyjádření zůstává na schvalovateli. |
| **Návrh řešení** | Funkce delegace v detailu žádosti s polem pokynu a lhůtou; vyjádření podpůrného útvaru jako odpověď navázaná na delegaci; podpůrný útvar pracuje s plným kontextem žádosti. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_023, REQ_WF_024, REQ_WF_025, REQ_WF_026 |

**Realizující UC:** [UC0005 – Delegovat posouzení na podpůrný útvar](02_use_case_model.md#~DSZEZ-uc-UC0005), [UC0006 – Vyjádřit se k delegované žádosti](02_use_case_model.md#~DSZEZ-uc-UC0006)

```plantuml file=diagrams/fr_realizace_fr0005.puml
```

---

<a id="~DSZEZ-fr-FR0006"></a>
### FR0006 – Notifikace účastníků workflow

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace notifikuje účastníky o událostech schvalovacího workflow: schvalovatele o přijaté žádosti k posouzení, podpůrný útvar o potřebě vyjádření i o blížícím se termínu, schvalovatele o získaném vyjádření podpůrného útvaru, žadatele o zamítnutí žádosti a o změnách stavu, ostatní schvalovatele o vloženém komentáři či o zamítnutí zkoušky. |
| **Návrh řešení** | Notifikační služba navázaná na události workflow; kanál notifikace (e-mail / ticket / in-app) je v zadání nerozhodnut – viz Otevřené otázky. Žadatel je o zamítnutí informován vždy též v GUI aplikace. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_014, REQ_WF_025, REQ_WF_026, REQ_WF_031; BA dokument kap. 5.2 |

**Realizující UC:** [UC0007 – Notifikovat účastníka workflow](02_use_case_model.md#~DSZEZ-uc-UC0007)

```plantuml file=diagrams/fr_realizace_fr0006.puml
```

---

<a id="~DSZEZ-fr-FR0007"></a>
### FR0007 – Změna žádosti o zkoušku

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje žadateli upravit žádost – ať už podanou, schválenou, nebo zamítnutou – ve všech polích formuláře. Před potvrzením změny aplikace upozorní, že jde o nevratnou operaci, která zruší dosavadní průběh schvalování (částečné i kompletní schválení). Po potvrzení aplikace provede tytéž kontroly jako při prvním podání, určí schvalovatele a založí nové schvalovací workflow. Schvalovatelům při posuzování upravené žádosti viditelně vyznačí změny oproti původní žádosti. Komentáře a vyjádření z předchozího workflow zůstávají uloženy pro kontext, viditelně odlišené jako náležející k již neexistujícímu workflow. |
| **Návrh řešení** | Funkce „Upravit žádost" otevírající formulář předvyplněný původními hodnotami; potvrzovací dialog s upozorněním na nevratnost; znovuspuštění procesu podání; vyznačení změněných polí pro schvalovatele. |
| **Priorita** | Vysoká |
| **Přírůstek** | IT1 (úprava a znovuspuštění workflow); IT2 (heuristické vyznačení obsahových změn – viz Otevřené otázky) |
| **Zdroj (katalog)** | REQ_WF_028, REQ_WF_029, REQ_WF_030, REQ_WF_032 |

**Realizující UC:** [UC0008 – Změnit žádost o zkoušku](02_use_case_model.md#~DSZEZ-uc-UC0008)

```plantuml file=diagrams/fr_realizace_fr0007.puml
```

---

<a id="~DSZEZ-fr-FR0008"></a>
### FR0008 – Sledování stavu žádosti a uživatelský účet

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace eviduje žádosti a probíhající workflow v uživatelském účtu žadatele a umožňuje žadateli sledovat průběh schvalování v reálném čase – stav žádosti, vyjádření jednotlivých schvalovatelů a komentáře. |
| **Návrh řešení** | Portál žadatele se seznamem vlastních žádostí (rozpracovaných, podaných, vyřízených) a detailem s aktuálním stavem workflow. |
| **Priorita** | Střední |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_013 |

**Realizující UC:** [UC0009 – Sledovat stav žádosti](02_use_case_model.md#~DSZEZ-uc-UC0009)

```plantuml file=diagrams/fr_realizace_fr0008.puml
```

---

<a id="~DSZEZ-fr-FR0009"></a>
### FR0009 – Evidence a archivace proběhlých workflow

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace eviduje a archivuje všechna proběhlá schvalovací workflow se všemi informacemi o průběhu – rozhodnutí jednotlivých schvalovatelů, komentáře, vyjádření podpůrných útvarů a auditní stopu – pro potřeby ČEPS. Žadatelé se ke svým proběhlým workflow dostanou prostřednictvím svého uživatelského účtu. |
| **Návrh řešení** | Trvalé uložení objektu zkoušky (žádost + průběh workflow + vyhodnocení) s auditní stopou; archivace celého objektu po vypořádání zkoušky. |
| **Priorita** | Vysoká (auditovatelnost – cíl C04) |
| **Přírůstek** | IT1 |
| **Zdroj (katalog)** | REQ_WF_033 |

**Realizující UC:** [UC0009 – Sledovat stav žádosti](02_use_case_model.md#~DSZEZ-uc-UC0009), [UC0011 – Posoudit vyhodnocení zkoušky](02_use_case_model.md#~DSZEZ-uc-UC0011)

```plantuml file=diagrams/fr_realizace_fr0009.puml
```

---

<a id="~DSZEZ-fr-FR0010"></a>
### FR0010 – Evidence provedené zkoušky (vyhodnocení)

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje subjektu zkoušky (původnímu žadateli) vytvořit po provedení zkoušky její písemné vyhodnocení přímo u příslušné zkoušky. Zástupci ČEPS vyhodnocení kontrolují a případné výhrady zapisují do určeného textového pole. Subjekt zkoušky na výhrady písemně reaguje, případně nahrává doplňující podklady; ČEPS opět kontroluje. Po vypořádání všech výhrad zástupci ČEPS schvalují přijetí řádného vyhodnocení a aplikace celý objekt zkoušky archivuje. |
| **Návrh řešení** | Objekt vyhodnocení navázaný na zkoušku, s textovými poli pro vyhodnocení a výhrady a s možností nahrání podkladů; iterativní kontrola s auditní stopou. |
| **Priorita** | Střední |
| **Přírůstek** | IT2 |
| **Zdroj (katalog)** | BA dokument kap. 5.5 „Evidence provedené zkoušky". **Pozn.:** požadavek nemá protějšek v katalogu REQ_WF a další zdroje jeho rozsah zpochybňují – viz Otevřené otázky. |

**Realizující UC:** [UC0010 – Vytvořit vyhodnocení provedené zkoušky](02_use_case_model.md#~DSZEZ-uc-UC0010), [UC0011 – Posoudit vyhodnocení zkoušky](02_use_case_model.md#~DSZEZ-uc-UC0011)

```plantuml file=diagrams/fr_realizace_fr0010.puml
```

---

<a id="~DSZEZ-fr-FR0011"></a>
### FR0011 – Integrace na AŘP

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace automaticky komunikuje údaje o schválené zkoušce do systému AŘP (plán přípravy provozu). Při změně nebo zrušení zkoušky odesílá do AŘP informaci o zrušení zkoušky (změna zkoušky se vůči integrovaným systémům projeví jako zrušení; schválení změny se propaguje jako nová zkouška). Součástí integrace je synchronizace číselníků energetických zařízení z AŘP. |
| **Návrh řešení** | Integrační rozhraní na AŘP pro zápis schválených/zrušených zkoušek a pro synchronizaci číselníků zařízení; realizace přes integrační platformu ČEPS. |
| **Priorita** | Nízká / výhledová |
| **Přírůstek** | IT2 |
| **Zdroj (katalog)** | REQ_WF_036, NREQ_012. **Pozn.:** dostupnost a stav cílového systému AŘP nejsou potvrzeny – viz Otevřené otázky. |

**Realizující UC:** [UC0012 – Předat schválenou zkoušku do AŘP](02_use_case_model.md#~DSZEZ-uc-UC0012)

```plantuml file=diagrams/fr_realizace_fr0011.puml
```

---

<a id="~DSZEZ-fr-FR0012"></a>
### FR0012 – Systémová nastavení – zastupitelnost a správa workflow

| Vlastnost | Hodnota |
|---|---|
| **Popis** | Aplikace umožňuje schvalovateli nastavit zastupitelnost pro období dovolené nebo pracovní nepřítomnosti – po dobu platnosti zastupitelnosti přebírá úkoly schvalovatele určený zástupce. Aplikace dále umožňuje administrátorskou (interní) správu logiky workflow, pravidel určení schvalovatelů a šablon formulářů. |
| **Návrh řešení** | Nastavení zastupitelnosti v profilu schvalovatele (zástupce + období); administrátorská správa pravidel a šablon. Zastupitelnost je nastavována pouze pro procesy v rámci této aplikace. |
| **Priorita** | Střední |
| **Přírůstek** | IT1 (zastupitelnost); IT2 (administrátorská správa workflow a šablon) |
| **Zdroj (katalog)** | REQ_WF_035, NREQ_010 |

**Realizující UC:** [UC0013 – Nastavit zastupitelnost](02_use_case_model.md#~DSZEZ-uc-UC0013)

```plantuml file=diagrams/fr_realizace_fr0012.puml
```

---

## Business požadavky

Následující požadavky katalogu mají **procesní / metodickou** povahu a nejsou aplikačními
funkčními požadavky (tak je klasifikuje i katalog `Byznys požadavky.xlsx`). Jsou uvedeny pro
úplnost, protože jsou předpokladem úspěšného nasazení aplikace.

| ID | Business požadavek | Zdroj | Poznámka |
|---|---|---|---|
| **BR01** | Změna Kodexu PS, část 6 tak, aby reflektoval TO-BE stav – aplikace jako primární kanál pro podávání žádostí, formulář žádosti jako primární zdroj pravdy vůči ČEPS, odpovědnost žadatele za správnost. | REQ_WF_001 | Metodická záležitost (úprava předpisu), ne aplikační funkce. |
| **BR02** | Nastavení a proškolení dotčených útvarů ČEPS ohledně rozdělení povinností a odpovědností mezi schvalovatele a podpůrné útvary. | REQ_WF_024 | Procesní záležitost; řešeno proškolením, ne automatizací. |
| **BR03** | Zavedení jednotnosti a sladění terminologie u všech organizačních jednotek dotčených schvalovacím workflow. | REQ_WF_034 | Metodická záležitost. |

---

## Nefunkční požadavky

Převzato z katalogu `Byznys požadavky.xlsx`, list „Nefunkční požadavky" (řada NREQ).

| ID | Oblast | Požadavek |
|---|---|---|
| **NREQ_001** | Rychlost a latence | Zatížení: maximálně jednotky souběžně přijímaných žádostí; maximálně jednotky souběžně pracujících uživatelů ČEPS. |
| **NREQ_002** | Rychlost a latence | Odezva GUI v řádu sekund; přenášené objemy dat malé. Přílohy potenciálně jednotky až desítky MB. |
| **NREQ_003** | Spolehlivost a dostupnost | Nejde o kritickou službu – postačí dostupnost na úrovni 99 % (two nines). |
| **NREQ_004** | Spolehlivost a dostupnost | Zálohování: postačí provoz v cloudovém řešení bez náročných požadavků na redundanci. |
| **NREQ_005** | Spolehlivost a dostupnost | Plánované odstávky hlásit alespoň týden předem; maximálně 2 dny. |
| **NREQ_006** | Spolehlivost a dostupnost | RTO/RPO dle běžné praxe cloudového provozu. Při ztrátě dat upozornit uživatele na kontrolu vlastních dat. |
| **NREQ_007** | Bezpečnost | Data interní až citlivé interní povahy (mj. schémata rozvoden z plánování provozu PS). |
| **NREQ_008** | Použitelnost | Lokalizace ČR; maximální intuitivnost ovládání (jednoduché workflow, nahrávání příloh). |
| **NREQ_009** | Škálovatelnost | Počet uživatelů: max. nárůst až 100násobně v horizontu 10 let (best estimate řádově stovky procent). |
| **NREQ_010** | Udržovatelnost | Ideálně možnost administrátorské (interní) správy logiky workflow a formulářů – realizováno [FR0012](#~DSZEZ-fr-FR0012). |
| **NREQ_011** | Přenositelnost | Přístup k aplikaci přes standardní webové prohlížeče (všechny běžné typy). |
| **NREQ_012** | Integrace | Integrace s IS AŘP – zápis schválených zkoušek do plánu přípravy provozu, synchronizace číselníků energetických zařízení – realizováno [FR0011](#~DSZEZ-fr-FR0011). |
| **NREQ_013** | SW podpora workflow | Ideálně možnost plné interní podpory s využitím stávající aplikační podpory ČEPS. |

---

## Přehled realizace požadavků Use Casy

```plantuml file=diagrams/fr_realizace_uc.puml
```

| FR \ UC | UC0001 | UC0002 | UC0003 | UC0004 | UC0005 | UC0006 | UC0007 | UC0008 | UC0009 | UC0010 | UC0011 | UC0012 | UC0013 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **FR0001** | X | | | | | | | | | | | | |
| **FR0002** | | X | | | | | | | | | | | |
| **FR0003** | X | | | | | | | | | | | | |
| **FR0004** | | | X | X | | | | | | | | | |
| **FR0005** | | | | | X | X | | | | | | | |
| **FR0006** | | | | | | | X | | | | | | |
| **FR0007** | | | | | | | | X | | | | | |
| **FR0008** | | | | | | | | | X | | | | |
| **FR0009** | | | | | | | | | X | | X | | |
| **FR0010** | | | | | | | | | | X | X | | |
| **FR0011** | | | | | | | | | | | | X | |
| **FR0012** | | | | | | | | | | | | | X |
