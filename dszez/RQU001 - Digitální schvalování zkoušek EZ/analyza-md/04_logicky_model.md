# Logický model

## Konvence

- Názvy tříd a atributů jsou v **„lidské češtině"**; systémový název pro DB je ve sloupci **Alias** v konvenci **camelCase**
- Postfix datového typu: **_T** = běžný atribut, **_E** = číselníkový, **_C** = komplexní
- Asociace se zapisují v sekci **### Asociace**; marker *(kompozice)* / *(nadřazený)* označuje kompoziční vazbu (part-of)

## Mapovací tabulka tříd

| ID | Název | Alias | Typ |
|---|---|---|---|
| L0001 | Žádost o zkoušku | zadostOZkousku | Třída |
| L0002 | Schvalovací workflow | schvalovaciWorkflow | Třída |
| L0003 | Posouzení schvalovatele | posouzeniSchvalovatele | Třída |
| L0004 | Delegace vyjádření | delegaceVyjadreni | Třída |
| L0005 | Komentář | komentar | Třída |
| L0006 | Příloha | priloha | Třída |
| L0007 | Vyhodnocení zkoušky | vyhodnoceniZkousky | Třída |
| L0008 | Účastník workflow | ucastnikWorkflow | Třída |
| L0009 | Uživatel | uzivatel | Třída |
| L0010 | Pravidlo určení schvalovatelů | pravidloUrceni | Třída |
| L0011 | Zastupitelnost | zastupitelnost | Třída |
| E0001 | typZkousky_E | typZkousky | Číselník |
| E0002 | stavZadosti_E | stavZadosti | Číselník |
| E0003 | vysledekPosouzeni_E | vysledekPosouzeni | Číselník |
| E0004 | stavDelegace_E | stavDelegace | Číselník |
| E0005 | typUcastnika_E | typUcastnika | Číselník |
| E0006 | citlivostDat_E | citlivostDat | Číselník |

```plantuml file=diagrams/lm_class_diagram.puml
```

---

<a id="~DSZEZ-lm-L0001"></a>
## Třída: Žádost o zkoušku

Ústřední entita systému – žádost o provedení zkoušky elektroenergetického zařízení. Nese veškeré údaje zadané žadatelem, je primárním zdrojem pravdy vůči ČEPS a prochází životním cyklem od rozpracování přes schvalování a provedení zkoušky až po archivaci. Životní cyklus popisuje [stavový diagram SM-L0001](06_stavove_diagramy.md#DSZEZ-sm-L0001).

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID žádosti |
| 2 | Číslo žádosti | cisloZadosti | kod_T | Ano | Veřejné číslo žádosti, přiděleno při podání |
| 3 | Název | nazev | text256_T | Ne | Uživatelský název rozpracované žádosti |
| 4 | Typ zkoušky | typZkousky | typZkousky_E | Ano | Určuje skladbu formuláře a okruh schvalovatelů |
| 5 | Stav | stav | stavZadosti_E | Ano | Aktuální stav životního cyklu žádosti |
| 6 | Žadatel – název subjektu | zadatelNazev | text256_T | Ano | Subjekt provádějící zkoušku |
| 7 | Kontaktní osoba | kontaktniOsoba | text256_T | Ano | Osoba odpovědná za žádost |
| 8 | Kontaktní e-mail | kontaktniEmail | text256_T | Ano | E-mail kontaktní osoby |
| 9 | Zkoušené zařízení EZ | zarizeniEz | text256_T | Ano | Identifikace zařízení (z číselníku zařízení AŘP) |
| 10 | Lokalita / rozvodna | lokalita | text256_T | Ne | Umístění zkoušeného zařízení |
| 11 | Termín zkoušky od | terminOd | datumCas_T | Ano | Začátek zkoušky |
| 12 | Termín zkoušky do | terminDo | datumCas_T | Ano | Konec zkoušky |
| 13 | Program zkoušky | programZkousky | text2000/CLOB_T | Ano | Podrobný program s časovým určením kroků |
| 14 | Vyžaduje součinnost ČEPS | vyzadujeSoucinnost | anoNe_T | Ano | Vstup do určení schvalovatelů |
| 15 | Popis součinnosti ČEPS | popisSoucinnosti | text2000/CLOB_T | Ne | Podrobný popis požadované součinnosti |
| 16 | Vyžaduje manipulace v rozvodnách | vyzadujeManipulace | anoNe_T | Ne | Vstup do určení schvalovatelů |
| 17 | Citlivost dat | citlivostDat | citlivostDat_E | Ano | Klasifikace žádosti (výchozí Interní) |
| 18 | Souhlas s podmínkami | souhlasPodminky | anoNe_T | Ano | Potvrzení souhlasu žadatele |
| 19 | Datum podání | datumPodani | datumCas_T | Ne | Prázdné u rozpracované žádosti |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| typZkousky | [typZkousky_E](#~DSZEZ-lm-E0001) | 1 | Typ zkoušky |
| stav | [stavZadosti_E](#~DSZEZ-lm-E0002) | 1 | Aktuální stav žádosti |
| citlivostDat | [citlivostDat_E](#~DSZEZ-lm-E0006) | 1 | Klasifikace citlivosti dat |
| zalozilUzivatel | [Uživatel](#~DSZEZ-lm-L0009) | 1 | Žadatel, který žádost vytvořil |
| *(kompozice)* | [Schvalovací workflow](#~DSZEZ-lm-L0002) | 0..* | Běhy schvalovacího workflow žádosti |
| *(kompozice)* | [Příloha](#~DSZEZ-lm-L0006) | 0..* | Přílohy žádosti |
| *(kompozice)* | [Vyhodnocení zkoušky](#~DSZEZ-lm-L0007) | 0..1 | Vyhodnocení provedené zkoušky |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Žádost lze podat pouze s vyplněnými povinnými poli dle typu zkoušky a s potvrzeným souhlasem s podmínkami. |
| IR-2 | Termín zkoušky „do" musí být ≥ termín zkoušky „od". |
| IR-3 | Při rozporu termínu uvedeného ve formuláři žádosti a v přílohách je závazný termín ve formuláři. |
| IR-4 | Změna žádosti je nevratná – ruší aktivní workflow a zakládá nový běh. |

---

<a id="~DSZEZ-lm-L0002"></a>
## Třída: Schvalovací workflow

Instance schvalovacího procesu jedné žádosti. Při změně žádosti vzniká nový běh workflow; předchozí běhy zůstávají uloženy jako neaktivní kontext.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID workflow |
| 2 | Pořadové číslo běhu | poradoveCislo | cisloCele_T | Ano | Pořadí běhu pro žádost (změna žádosti = nový běh) |
| 3 | Stav workflow | stav | obecny_T | Ano | Probíhající / dokončené / zrušené |
| 4 | Datum spuštění | datumSpusteni | datumCas_T | Ano | Spuštění workflow |
| 5 | Datum dokončení | datumDokonceni | datumCas_T | Ne | Vyplněno po vypořádání všech posouzení |
| 6 | Aktivní | aktivni | anoNe_T | Ano | Zda je běh aktuálně platný |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Žádost o zkoušku](#~DSZEZ-lm-L0001) | 1 | Žádost, ke které workflow patří |
| *(kompozice)* | [Posouzení schvalovatele](#~DSZEZ-lm-L0003) | 1..* | Posouzení jednotlivých schvalovatelů |
| *(kompozice)* | [Komentář](#~DSZEZ-lm-L0005) | 0..* | Komentáře vlákna workflow |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | K jedné žádosti je aktivní nejvýše jeden běh workflow; předchozí běhy zůstávají uloženy jako neaktivní. |
| IR-2 | Workflow je dokončené (žádost schválená) tehdy, když je každé Posouzení schvalovatele vypořádáno výsledkem „Schváleno". |
| IR-3 | Workflow je zamítnuté, jakmile kterékoli Posouzení skončí výsledkem „Zamítnuto". |

---

<a id="~DSZEZ-lm-L0003"></a>
## Třída: Posouzení schvalovatele

Část schvalovacího workflow příslušná jednomu schvalovateli – jeho rozhodnutí o žádosti (schválení nebo zamítnutí) včetně odůvodnění a případných dodatečných podmínek.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID posouzení |
| 2 | Výsledek | vysledek | vysledekPosouzeni_E | Ano | Čeká / schváleno / zamítnuto |
| 3 | Odůvodnění | oduvodneni | text2000/CLOB_T | Ne | Povinné při zamítnutí, volitelné při schválení |
| 4 | Dodatečné podmínky realizace | dodatecnePodminky | text2000/CLOB_T | Ne | Podmínky, za nichž je zkouška realizovatelná |
| 5 | Lhůta pro posouzení | lhuta | datum_T | Ne | Termín pro vyjádření schvalovatele |
| 6 | Datum rozhodnutí | datumRozhodnuti | datumCas_T | Ne | Vyplněno po rozhodnutí |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Schvalovací workflow](#~DSZEZ-lm-L0002) | 1 | Workflow, jehož je posouzení součástí |
| vysledek | [vysledekPosouzeni_E](#~DSZEZ-lm-E0003) | 1 | Výsledek posouzení |
| schvalovatel | [Účastník workflow](#~DSZEZ-lm-L0008) | 1 | Schvalovatel odpovědný za posouzení |
| *(kompozice)* | [Delegace vyjádření](#~DSZEZ-lm-L0004) | 0..* | Delegace na podpůrné útvary |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Při výsledku „Zamítnuto" je odůvodnění povinné. |
| IR-2 | Schvalovatel provádí posouzení pro danou žádost pouze jednou (rychlé i věcné posouzení tvoří jeden záznam). |

---

<a id="~DSZEZ-lm-L0004"></a>
## Třída: Delegace vyjádření

Delegace dílčího posouzení žádosti schvalovatelem na podpůrný útvar včetně pokynu, lhůty a získaného vyjádření.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID delegace |
| 2 | Pokyn | pokyn | text2000/CLOB_T | Ano | Co a proč je po podpůrném útvaru požadováno |
| 3 | Lhůta pro vyjádření | lhuta | datum_T | Ano | Termín pro vyjádření podpůrného útvaru |
| 4 | Stav | stav | stavDelegace_E | Ano | Čeká na vyjádření / vyjádřeno |
| 5 | Vyjádření | vyjadreni | text2000/CLOB_T | Ne | Odpověď podpůrného útvaru |
| 6 | Datum vyjádření | datumVyjadreni | datumCas_T | Ne | Vyplněno po vyjádření |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Posouzení schvalovatele](#~DSZEZ-lm-L0003) | 1 | Posouzení, v jehož rámci delegace vznikla |
| stav | [stavDelegace_E](#~DSZEZ-lm-E0004) | 1 | Stav delegace |
| podpurnyUtvar | [Účastník workflow](#~DSZEZ-lm-L0008) | 1 | Podpůrný útvar pověřený vyjádřením |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | V rámci jednoho Posouzení schvalovatele lze delegaci vytvořit opakovaně, i na tentýž podpůrný útvar. |
| IR-2 | Odpovědnost za vypořádání žádosti zůstává na schvalovateli, ne na podpůrném útvaru. |

---

<a id="~DSZEZ-lm-L0005"></a>
## Třída: Komentář

Příspěvek v komunikačním vlákně žádosti – komentář schvalovatele, případně doprovodný text rozhodnutí.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID komentáře |
| 2 | Text | text | text2000/CLOB_T | Ano | Obsah komentáře |
| 3 | Datum a čas | datumCas | datumCas_T | Ano | Čas vložení |
| 4 | Náleží zrušenému workflow | zrusenyWorkflow | anoNe_T | Ano | Příznak kontextu z předchozího (zrušeného) běhu |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Schvalovací workflow](#~DSZEZ-lm-L0002) | 1 | Workflow, k němuž komentář patří |
| autor | [Účastník workflow](#~DSZEZ-lm-L0008) | 1 | Autor komentáře |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Komentáře z předchozích (zrušených) workflow zůstávají uloženy a jsou označeny příznakem „Náleží zrušenému workflow". |

---

<a id="~DSZEZ-lm-L0006"></a>
## Třída: Příloha

Soubor přiložený k žádosti o zkoušku jako podpůrný podklad.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID přílohy |
| 2 | Název souboru | nazevSouboru | text256_T | Ano | Původní název souboru |
| 3 | Obsah | obsah | binarni_T | Ano | Binární obsah souboru |
| 4 | Velikost | velikost | cisloCele_T | Ne | Velikost souboru v bajtech |
| 5 | Datum nahrání | datumNahrani | datumCas_T | Ano | Čas nahrání přílohy |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Žádost o zkoušku](#~DSZEZ-lm-L0001) | 1 | Žádost, ke které příloha patří |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | U vybraných typů zkoušek je vyžadována alespoň jedna povinná příloha. |
| IR-2 | Přílohy jsou pouze podpůrným podkladem; primárním zdrojem pravdy je formulář žádosti. |

---

<a id="~DSZEZ-lm-L0007"></a>
## Třída: Vyhodnocení zkoušky

Písemné vyhodnocení provedené zkoušky vytvořené subjektem zkoušky a kontrolované zástupci ČEPS.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID vyhodnocení |
| 2 | Text vyhodnocení | textVyhodnoceni | text2000/CLOB_T | Ano | Písemné vyhodnocení subjektu zkoušky |
| 3 | Výhrady ČEPS | vyhradyCeps | text2000/CLOB_T | Ne | Výhrady zástupců ČEPS k vyhodnocení |
| 4 | Stav | stav | obecny_T | Ano | Rozpracované / ke kontrole / přijaté |
| 5 | Datum vytvoření | datumVytvoreni | datumCas_T | Ano | Čas vytvoření vyhodnocení |
| 6 | Datum přijetí | datumPrijeti | datumCas_T | Ne | Čas schválení přijetí vyhodnocení |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| *(nadřazený)* | [Žádost o zkoušku](#~DSZEZ-lm-L0001) | 1 | Žádost (zkouška), ke které vyhodnocení patří |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Vyhodnocení je přijato až po vypořádání všech výhrad ČEPS; teprve poté se objekt zkoušky archivuje. |

---

<a id="~DSZEZ-lm-L0008"></a>
## Třída: Účastník workflow

Organizační útvar, role nebo osoba ČEPS vystupující ve schvalovacím workflow jako schvalovatel nebo podpůrný útvar.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID účastníka |
| 2 | Název | nazev | text256_T | Ano | Název útvaru / role / osoby |
| 3 | Organizační útvar | organizacniUtvar | text256_T | Ne | Kód a název útvaru (např. 14630 Příprava provozu) |
| 4 | Typ účastníka | typUcastnika | typUcastnika_E | Ano | Žadatel / schvalovatel / podpůrný útvar |
| 5 | E-mail | email | text256_T | Ne | Kontaktní e-mail pro notifikace |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| typUcastnika | [typUcastnika_E](#~DSZEZ-lm-E0005) | 1 | Typ účastníka workflow |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Schvalovatelem se rozumí organizační útvar nebo role; není rozhodující, kdo konkrétně v rámci role jedná. |

---

<a id="~DSZEZ-lm-L0009"></a>
## Třída: Uživatel

Uživatelský účet osoby pracující s aplikací – interního pracovníka ČEPS nebo externího subjektu.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID uživatele |
| 2 | Jméno | jmeno | text256_T | Ano | Jméno uživatele |
| 3 | E-mail | email | text256_T | Ano | Ověřená identita (interní nebo externí) |
| 4 | Interní uživatel | interni | anoNe_T | Ano | Interní pracovník ČEPS vs. externí subjekt |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| ucastnik | [Účastník workflow](#~DSZEZ-lm-L0008) | 0..1 | Role uživatele ve schvalovacím workflow |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Proces zřizování a správy uživatelských účtů (kdo zřizuje, jak se žádá) není v zadání řešen – viz Otevřené otázky. |

---

<a id="~DSZEZ-lm-L0010"></a>
## Třída: Pravidlo určení schvalovatelů

Předdefinované pravidlo, podle kterého aplikace automaticky určuje okruh schvalovatelů a parametry workflow na základě typu zkoušky a údajů zadaných žadatelem.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID pravidla |
| 2 | Název pravidla | nazev | text256_T | Ano | Popisný název pravidla |
| 3 | Typ zkoušky | typZkousky | typZkousky_E | Ne | Typ zkoušky, pro který pravidlo platí |
| 4 | Podmínka | podminka | text2000/CLOB_T | Ano | Podmínka uplatnění (např. „vyžaduje součinnost ČEPS") |
| 5 | Pořadí | poradi | cisloCele_T | Ne | Pořadí určeného schvalovatele ve workflow |
| 6 | Lhůta | lhuta | cisloCele_T | Ne | Lhůta pro vyjádření (počet dní) |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| typZkousky | [typZkousky_E](#~DSZEZ-lm-E0001) | 0..1 | Typ zkoušky, pro který pravidlo platí |
| urcujeUcastnika | [Účastník workflow](#~DSZEZ-lm-L0008) | 1 | Schvalovatel určený pravidlem |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Konkrétní sada pravidel (skladba, pořadí schvalovatelů, lhůty) není v zadání specifikována – viz Otevřené otázky. |

---

<a id="~DSZEZ-lm-L0011"></a>
## Třída: Zastupitelnost

Nastavení zástupce schvalovatele pro období jeho pracovní nepřítomnosti.

| # | Název | Alias | Datový typ | Povinný | Poznámka |
|---|---|---|---|---|---|
| 1 | Identifikátor | id | identifikator_T | Ano | Unikátní ID zastupitelnosti |
| 2 | Platnost od | platnostOd | datum_T | Ano | Začátek období zastupitelnosti |
| 3 | Platnost do | platnostDo | datum_T | Ano | Konec období zastupitelnosti |

### Asociace

| Zdrojový atribut | Cílová třída | Kardinalita | Popis |
|---|---|---|---|
| zastoupeny | [Uživatel](#~DSZEZ-lm-L0009) | 1 | Zastupovaný schvalovatel |
| zastupce | [Uživatel](#~DSZEZ-lm-L0009) | 1 | Uživatel přebírající úkoly |

### Integritní pravidla

| # | Pravidlo |
|---|---|
| IR-1 | Platnost „do" musí být ≥ platnost „od". |
| IR-2 | Zastupitelnost platí pouze pro procesy v rámci aplikace DSZEZ, ne pro celou organizaci. |

---

## Číselníky (Enumerace)

<a id="~DSZEZ-lm-E0001"></a>
### typZkousky_E

Typy zkoušek EZ nabízené žadateli. Pracovní množina dle požadavku REQ_WF_002; rozpor v počtu a názvech typů napříč zdroji je popsán v sekci **Otevřené otázky** v souboru `README.md`.

| Hodnota | Popis |
|---|---|
| PROVOZNI | Provozní zkouška |
| CERTIFIKACNI | Certifikační zkouška |
| RIZIKOVA | Riziková zkouška |
| PREDKOMPLEXNI | Předkomplexní zkouška |
| KOMPLEXNI | Komplexní zkouška |
| PERIODICKA | Periodická zkouška |

---

<a id="~DSZEZ-lm-E0002"></a>
### stavZadosti_E

Stavy životního cyklu žádosti o zkoušku. Hodnoty odpovídají [stavovému diagramu SM-L0001](06_stavove_diagramy.md#DSZEZ-sm-L0001).

| Hodnota | Popis |
|---|---|
| ROZPRACOVANA | Rozpracovaná – žádost se vyplňuje, dosud nebyla podána |
| VE_SCHVALOVANI | Ve schvalování – běží schvalovací workflow |
| SCHVALENA | Schválená – workflow dokončeno schválením všemi schvalovateli |
| ZAMITNUTA | Zamítnutá – workflow ukončeno zamítnutím |
| ZKOUSKA_PROVEDENA | Zkouška provedena – schválená zkouška byla fyzicky uskutečněna |
| VYHODNOCENA | Vyhodnocená – vyhodnocení provedené zkoušky bylo přijato ČEPS |
| ARCHIVOVANA | Archivovaná – objekt zkoušky je uzavřen a archivován |

---

<a id="~DSZEZ-lm-E0003"></a>
### vysledekPosouzeni_E

Výsledek posouzení žádosti jedním schvalovatelem.

| Hodnota | Popis |
|---|---|
| CEKA | Čeká na posouzení |
| SCHVALENO | Schváleno |
| ZAMITNUTO | Zamítnuto |

---

<a id="~DSZEZ-lm-E0004"></a>
### stavDelegace_E

Stav delegace dílčího posouzení na podpůrný útvar.

| Hodnota | Popis |
|---|---|
| CEKA | Čeká na vyjádření podpůrného útvaru |
| VYJADRENO | Vyjádření podpůrného útvaru bylo zapsáno |

---

<a id="~DSZEZ-lm-E0005"></a>
### typUcastnika_E

Typ účastníka schvalovacího workflow.

| Hodnota | Popis |
|---|---|
| ZADATEL | Žadatel o zkoušku |
| SCHVALOVATEL | Schvalovatel |
| PODPURNY_UTVAR | Podpůrný útvar |

---

<a id="~DSZEZ-lm-E0006"></a>
### citlivostDat_E

Klasifikace citlivosti dat žádosti. Dle zadání jsou žádosti o zkoušky klasifikovány jako „Interní".

| Hodnota | Popis |
|---|---|
| VEREJNE | Veřejné |
| INTERNI | Interní |
| CITLIVE_INTERNI | Citlivé interní |
