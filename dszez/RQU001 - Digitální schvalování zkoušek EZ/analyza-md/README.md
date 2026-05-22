# UML Analýza – Digitální schvalování zkoušek EZ (DSZEZ)

Kompletní UML analýza **cílového business konceptu** nového systému **DSZEZ** – webové aplikace
ČEPS, a.s. pro digitalizaci agendy podávání a schvalování žádostí o zkoušky elektroenergetických
zařízení (EZ). Systém nahrazuje stávající e-mailovou a PDF agendu jednotnou aplikací, která řídí
schvalovací workflow a přenáší odpovědnost za správnost žádosti na žadatele.

Analýza je zpracována dle [metodiky zápisu analýzy Intelis](../../../metodika/metodika-zapisu.md).

**Datum:** 2026-05-22
**Systém:** DSZEZ – Digitální schvalování zkoušek EZ (ČEPS, a.s.)
**Úroveň analýzy:** complete

---

## Zdroje analýzy

| Zdroj | Role |
|---|---|
| `Digitální schvalování zkoušek EZ.docx` | BA dokument – AS-IS/TO-BE procesy (závazný textový popis procesů) |
| `Byznys požadavky.xlsx` | Katalog požadavků REQ_WF_001–036 a nefunkčních NREQ_001–013 |
| `Identifikace účastníků workflow.xlsx` | Účastníci workflow dle typu zkoušky, list otevřených dotazů |
| `ČEPS_Quick_IT_Analýza_M3P_v1.1.docx` | Quick IT analýza variant řešení – architektonický kontext |
| `Workflow - možné podobné procesy.docx` | Brainstorming podobných procesů – mimo rozsah |

> Kapitoly „Funkční požadavky" a „Use Cases" hlavního BA dokumentu obsahují pouze placeholdery
> (Lorem ipsum / XXX). Závazným zdrojem požadavků je textový popis TO-BE procesů a katalog
> `Byznys požadavky.xlsx`.

---

## Rozsah

| Oblast | Obsah | Počet |
|---|---|---|
| Aktéři | Žadatel o zkoušku, Schvalovatel, Podpůrný útvar, Správce workflow, AŘP | 5 |
| Cíle | C01–C05 | 5 |
| Funkční požadavky | FR0001–FR0012 (+ business požadavky BR01–BR03, nefunkční NREQ_001–013) | 12 |
| Use Cases | UC0001–UC0013 | 13 |
| GUI třídy | «Form» (4), «Form area» (8), «Form grid area» (2), «Form multi area» (2), «Form modal» (4) – G0001–G0019 | 19 |
| Logický model – třídy | L0001–L0011 | 11 |
| Logický model – číselníky | E0001–E0006 | 6 |
| Sekvenční diagramy | UC0001, UC0003, UC0004, UC0005, UC0008 | 5 |
| Stavové diagramy | Žádost o zkoušku (SM-L0001) | 1 |

---

## Navigace v souborech

| Soubor | Popis |
|---|---|
| [01_model_pozadavku.md](01_model_pozadavku.md) | Model požadavků – cíle, funkční, business a nefunkční požadavky |
| [02_use_case_model.md](02_use_case_model.md) | Use Case model se scénáři |
| [03_gui_model.md](03_gui_model.md) | GUI třídy se stereotypy, atributy a operacemi |
| [04_logicky_model.md](04_logicky_model.md) | Doménové třídy, číselníky a asociace |
| [05_sekvencni_diagramy.md](05_sekvencni_diagramy.md) | Sekvenční diagramy klíčových UC |
| [06_stavove_diagramy.md](06_stavove_diagramy.md) | Stavový diagram životního cyklu žádosti |

### PlantUML diagramy

| Soubor | Popis |
|---|---|
| [diagrams/fr_realizace.puml](diagrams/fr_realizace.puml) | Realizace cílů funkčními požadavky |
| [diagrams/fr_realizace_uc.puml](diagrams/fr_realizace_uc.puml) | Realizace požadavků Use Casy |
| diagrams/fr_realizace_fr0001–fr0012.puml | Vícevrstvá realizace každého funkčního požadavku (FR → UC → GUI → LM) |
| [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml) | Use Case diagram |
| [diagrams/gui_class_diagram.puml](diagrams/gui_class_diagram.puml) | GUI model – diagram tříd |
| [diagrams/lm_class_diagram.puml](diagrams/lm_class_diagram.puml) | Logický model – diagram tříd |
| diagrams/sd_uc0001/0003/0004/0005/0008.puml | Sekvenční diagramy |
| [diagrams/sm_l0001.puml](diagrams/sm_l0001.puml) | Stavový diagram žádosti o zkoušku |

---

## Otevřené otázky

Tato sekce shrnuje nekonzistence zadání, mezery a domněnky bez přímé opory v podkladech
a z nich plynoucí rizika (viz `metodika-zapisu.md` kap. 0.2–0.3). Položky označené **★** jsou
významné rozpory doporučené k potvrzení zadavatelem před dokončením realizace.

| # | Otázka / nekonzistence | Riziko / dopad | Stav |
|---|---|---|---|
| 1 ★ | Katalog `Byznys požadavky.xlsx` má položky **REQ_WF_015–REQ_WF_021** prázdné (jen ID, proces „Běh schvalovacího workflow", bez popisu). | Jádro schvalování nemá závazné požadavky na úrovni katalogu; FR0004 a UC0003/UC0004 se opírají pouze o procesní prózu BA dokumentu. Při doplnění katalogu se může rozsah workflow změnit. | Otevřená |
| 2 ★ | Proces **„Běh schvalovacího workflow"** není v BA dokumentu popsán (dokument výslovně uvádí „Tento proces zatím není popsán") – chybí pravidla notifikací, lhůty, chování při zamítnutí, sekvenční/paralelní pořadí. | Nejistý počet a pořadí kroků workflow, datový model `Schvalovací workflow` a `Posouzení schvalovatele`, obsah notifikací (FR0006). | Otevřená |
| 3 | **Rozpor v seznamu typů zkoušek:** BA próza uvádí 4 typy (provozní/certifikační/riziková/(před)komplexní), REQ_WF_002 uvádí 6 typů, list „Identifikace účastníků" navíc zmiňuje „Black startové" zkoušky. | Počet a skladba formulářů žádosti, hodnoty číselníku `typZkousky_E` (E0001), rozsah analýzy. Pracovní množina = 6 typů dle REQ_WF_002 (nejexplicitnější strukturovaný požadavek). | Otevřená |
| 4 | **Sekvenční vs. paralelní schvalování:** list „Dotaz" č. 1 nejprve uvádí „pan Abert podepisuje jako první", odpověď pak „Nemusí"; REQ_WF_011 zmiňuje „pořadí … případně všichni pokud není pořadí". | Logika běhu workflow, sekvenční diagramy, atribut „Pořadí" v třídě `Pravidlo určení schvalovatelů` (L0010). Analýza předpokládá převážně paralelní schvalování s volitelným pořadím. | Otevřená |
| 5 | **Kanál notifikací** není rozhodnut – REQ_WF_014/025/026 uvádí „e-mail / JIRA ticket / aplikace, bude upřesněno". M3P přitom doporučuje variantu MS Office 365 bez nástroje JIRA. | Návrh GUI a integrací pro FR0006; rozsah implementace notifikací. | Otevřená |
| 6 | Hlavní BA dokument má **Manažerské shrnutí a kapitoly Funkční požadavky / Use Cases vyplněny placeholdery** (Lorem ipsum, XXX, šablona UC_001). | Hlavní dokument nelze použít jako zdroj FR/UC – analýza vychází z procesní prózy a katalogu REQ_WF. | Zodpovězená – řešeno volbou zdrojů |
| 7 | **REQ_WF_004** je v katalogu označen jako možná duplicita REQ_WF_003 („Duplicita ke smazání? … bude sloučeno s 5 nebo smazáno"). | Drobné – obě položky jsou pokryty požadavkem FR0001 (výběr typu zkoušky a příprava formuláře). | Otevřená |
| 8 | **REQ_WF_005, 006, 010** odkazují na neexistující identifikátory „REQ_WF_XXX" / „REQ_WF_YYY" (nedoplněné placeholdery). | Drobné – nelze ověřit zamýšlené křížové vazby mezi požadavky katalogu. | Otevřená |
| 9 ★ | **Uživatelské účty a autentizace nejsou řešeny** – BA dokument: „Uživatelské účty prozatím nejsou řešeny (kdo zřizuje, jak se žádá)"; M3P uvádí jako riziko, že BA neřeší zakládání a správu uživatelů. Přitom REQ_WF_013/033 účet vyžadují a NREQ_007 předpokládá ověřené uživatele (Entra ID) a RBAC. | Chybí proces a aktér správy účtů, UC registrace, definice oprávnění. Aktér „Správce workflow" a třída `Uživatel` (L0009) jsou modelovány s omezenou oporou. | Otevřená |
| 10 ★ | **Proces „Evidence provedené zkoušky" (vyhodnocení)** je popsán v BA dokumentu (kap. 5.5), ale **nemá protějšek v katalogu REQ_WF**; list „Dotaz" i M3P naznačují, že výsledky zkoušek se nearchivují a není jasné, kdo s nimi pracuje. | Rozsah analýzy. Dle rozhodnutí zadavatele zahrnuto do modelu (FR0010, UC0010/UC0011, GUI G0015, LM L0007) s tímto upozorněním; je třeba potvrdit, zda proces do první verze patří. | Otevřená |
| 11 | **Projednání zkoušky na gremiální poradě** je v BA dokumentu „prozatím nezpracováno", v katalogu REQ_WF chybí; list „Dotaz" č. 6 přitom uvádí, že gremiálka zůstane min. 2 roky. | Chybějící krok workflow / UC pro projednání na gremiální poradě; možný dopad do FR0004 a stavového modelu. | Otevřená |
| 12 | **Rozsah integrací:** REQ_WF_036 a NREQ_012 požadují integraci na AŘP; M3P uvádí integraci na IS PoVyk jako „výhledový požadavek, není nutné realizovat k prvnímu nasazení"; AŘP je zmiňováno jako budoucí systém („až bude systém AŘP"). | Realizovatelnost FR0011 a UC0012 závisí na existenci a stavu cílového systému AŘP. Integrace na PoVyk není v analýze modelována (mimo první nasazení). | Otevřená |
| 13 | **Heuristické vyznačení změn** v upravené žádosti (REQ_WF_032) – M3P uvádí, že doporučená varianta řešení (MS Office 365) tuto funkci „nepokryje 100 %", umožní jen identifikovat změněná pole. | Požadovaný rozsah FR0007 (vyznačení změn) je technicky nejistý; v analýze zařazen do přírůstku IT2. | Otevřená |
| 14 | **Chybějící vstup:** formulář „Žádost o povolení zkoušek (1).doc" je v M3P uveden jako příloha, ale nebyl součástí podkladů. REQ_WF_003 skladbu polí formulářů nedefinuje („Kamila připraví šablony"). | Úplná skladba polí formulářů žádosti dle typu zkoušky není známá; GUI oblasti G0004–G0008 modelují pouze pole s oporou v procesní próze. | Otevřená |
| 15 | List **„Požadavky"** v `Identifikace účastníků workflow.xlsx` je neformální duplicitní soupis požadavků bez identifikátorů, částečně překrývající katalog REQ_WF. | Drobné – riziko nejednoznačnosti; analýza vychází z formálního katalogu REQ_WF, neformální list slouží jen jako doplňkový kontext. | Otevřená |
| 16 | Přechod žádosti ze stavu **Schválená → Zkouška provedena** – mechanismus, jak aplikace zjistí fyzické provedení zkoušky (manuální označení, datum, integrace), není v zadání určen. | Chybí trigger přechodu ve stavovém modelu SM-L0001; dopad do UC0010 (vstupní podmínka „Zkouška provedena"). | Otevřená |
