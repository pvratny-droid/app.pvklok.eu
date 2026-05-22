# Předběžný návrh změny — Vypořádání otevřených otázek RQU001

> **Status:** `proposal` · **Datum:** 2026-05-22 · **Autor:** Petr Vratný
> **Dotčené RQU:** RQU001 — Digitální schvalování zkoušek EZ

---

## 1. Cíl změny

Analýza **RQU001 – Digitální schvalování zkoušek EZ** je cílovým business konceptem nového
systému DSZEZ, vznikla však z vědomě neúplných podkladů a v sekci *Otevřené otázky* svého
`README.md` eviduje **16 nekonzistencí, mezer a domněnek**. Tento návrh každou otevřenou
otázku **vypořádá konkrétním rozhodnutím** a vymezí jeho dopad do prvků RQU001.

Cílovým stavem je **rozhodnutý a vnitřně konzistentní cílový koncept**, z něhož lze založit
realizační (`complete`) analýzu nebo přímo editovat dotčené prvky RQU001. Návrh zároveň
slouží jako **rozhodovací podklad pro zadavatele (ČEPS)** u otázek, které vyžadují business
potvrzení (označeny ★). Návrh **needituje RQU001** – pouze mapuje, co a kde se má změnit.

## 2. Motivace

Otevřené otázky brání posunu RQU001 do realizace: nejistý je rozsah schvalovacího workflow,
datový model, počet a aktéři Use Case i rozsah integrací. Příčinou je neúplnost vstupů –
katalog `Byznys požadavky.xlsx` má prázdné položky REQ_WF_015–021, hlavní BA dokument má
kapitoly Funkční požadavky a Use Cases vyplněny placeholdery.

K RQU001 byl současně vytvořen **funkční prototyp** (`prototype.html`), který všechny mezery
zaplnil konkrétními – vizuálně značenými – pracovními rozhodnutími a ověřil je v interakci.
Tento návrh tato rozhodnutí **formalizuje a předkládá ke schválení**; prototyp slouží jako
jejich názorný důkaz proveditelnosti. Vypořádání se opírá o závazné předpisy a podklady:
**Kodex přenosové soustavy, část VI**, **Pracovní postup PP/86/2025** a doporučení
**Quick IT analýzy M3P** (varianta MS Office 365).

## 3. Dotčené RQU a prvky

### RQU001 — Digitální schvalování zkoušek EZ

**Cesta:** `src/DSZEZ/RQU001 - Digitální schvalování zkoušek EZ/analyza-md/`
([otevřít](../../RQU001%20-%20Digitální%20schvalování%20zkoušek%20EZ/analyza-md/index.html))

Návrh se dotýká následujících prvků RQU001 (anchor ID dle cílové analýzy). Žádný prvek se
tímto návrhem neruší; jde o **upřesnění a doplnění** v rámci budoucí realizační analýzy.

| Prvek (anchor) | Typ změny | Popis změny | Otázka |
|---|---|---|---|
| `~DSZEZ-fr-FR0001` | upřesnění rozsahu | Závazný počet typů zkoušek (6), skladba polí formuláře dle typu | #3, #14 |
| `~DSZEZ-fr-FR0003` | upřesnění logiky | Paralelní určení schvalovatelů, volitelné pořadí | #4 |
| `~DSZEZ-fr-FR0004` | doplnění pravidel | Formalizace běhu workflow, lhůty, gremiálka | #1, #2, #11 |
| `~DSZEZ-fr-FR0006` | upřesnění návrhu | Kanál notifikací: in-app + e-mail | #5 |
| `~DSZEZ-fr-FR0007` | upřesnění rozsahu | Vyznačení změn na úrovni polí (IT2) | #13 |
| `~DSZEZ-fr-FR0010` | potvrzení rozsahu | Evidence vyhodnocení potvrzena jako IT2 | #10 |
| `~DSZEZ-fr-FR0011` | upřesnění rozsahu | Integrace AŘP jako výhledový IT2, PoVyk mimo rozsah | #12 |
| `~DSZEZ-uc-UC0003`, `~DSZEZ-uc-UC0004` | doplnění scénáře | Pravidla běhu workflow, gremiálka, lhůty | #1, #2, #11 |
| `~DSZEZ-uc-UC0007` | upřesnění | Kanál notifikací | #5 |
| `~DSZEZ-uc-UC0008` | upřesnění | Mechanismus vyznačení změn | #13 |
| `~DSZEZ-uc-UC0010`, `~DSZEZ-uc-UC0011` | potvrzení rozsahu | Evidence provedené zkoušky | #10 |
| `~DSZEZ-uc-UC0012` | upřesnění rozsahu | Integrace AŘP | #12 |
| `~DSZEZ-gui-G0016` | upřesnění | 6 typů zkoušek v dialogu výběru | #3 |
| `~DSZEZ-gui-G0003`–`G0008` | doplnění polí | Skladba polí formuláře dle typu zkoušky | #14 |
| `~DSZEZ-gui-G0011` | doplnění operace | Akce „Označit zkoušku jako provedenou" | #16 |
| `~DSZEZ-gui-G0012` | upřesnění | Vyznačení změn (porovnání polí) | #13 |
| `~DSZEZ-lm-E0001` | potvrzení hodnot | `typZkousky_E` – závazně 6 hodnot | #3 |
| `~DSZEZ-lm-L0001` | doplnění atributů | Pole specifická pro typ; datum provedení zkoušky | #14, #16 |
| `~DSZEZ-lm-L0002`, `~DSZEZ-lm-L0003` | doplnění pravidel | Paralelní běh, lhůty posouzení | #2, #4 |
| `~DSZEZ-lm-L0009` | upřesnění | Účet uživatele – vazba na Entra ID, RBAC | #9 |
| `~DSZEZ-lm-L0010` | doplnění pravidel | Konkrétní sada routovacích pravidel, atribut Pořadí, gremiálka | #1, #4, #11 |
| `DSZEZ-sm-L0001` | upřesnění přechodu | Trigger „Schválená → Zkouška provedena" = ruční označení | #16 |
| aktér *Správce workflow* | upřesnění | Role v rámci RBAC; správa účtů jako samostatná agenda | #9 |

### Nové prvky (mimo RQU001)

| Navrhovaný prvek | Typ | Patří do | Stručný popis |
|---|---|---|---|
| RQU „Správa uživatelů a oprávnění" | nová RQU | DSZEZ | Proces zřizování účtů, autentizace (Entra ID), RBAC – dnes neřešeno (otázka #9) |

> Katalogové položky `REQ_WF_004`, `REQ_WF_005/006/010`, list „Požadavky" a prázdné
> `REQ_WF_015–021` nejsou model-prvky RQU001 – jejich úprava (otázky #1, #7, #8, #15) je
> redakční údržbou dokumentu `Byznys požadavky.xlsx`, ne změnou analýzy.

## 4. Návrh řešení

Jádrem návrhu je **vypořádání všech 16 otevřených otázek**. Tabulka uvádí u každé otázky
navržené rozhodnutí, dotčené prvky a — jako zpětnou kontrolu — stav v prototypu.

| # | Otevřená otázka | Navržené řešení | Dotčené prvky | Stav v prototypu / soulad |
|---|---|---|---|---|
| 1 ★ | Prázdné `REQ_WF_015–021` (proces „Běh workflow" nemá závazné požadavky v katalogu) | Doplnit katalog formálním zněním 7 požadavků odvozeným z procesní prózy BA dok. kap. 5.2 a z rozhodnutí otázek #2/#4/#5/#11 | FR0004, UC0003/4, katalog | Workflow plně implementován → návrh = konkretizace. **Soulad.** |
| 2 ★ | Proces „Běh schvalovacího workflow" není popsán | Formalizovat: po podání automatické určení schvalovatelů → **paralelní** posouzení (každý jednou) → zamítnutí kýmkoli ukončuje celé workflow → notifikace všem → lhůty per posouzení → gremiálka jako krok u rizikové skupiny | FR0004, UC0003/4, L0002, L0003 | Implementováno (timeline, přepočet stavu, paralelní posouzení). **Soulad.** |
| 3 | Rozpor v počtu typů zkoušek (4 / 6 / 7 s „Black startovými") | Závazně **6 typů** dle REQ_WF_002 (provozní, certifikační, riziková, předkomplexní, komplexní, periodická). „Black startové" vést jako organizační variantu rizikové skupiny, ne 7. hodnotu — *k potvrzení ČEPS* | E0001, G0016, FR0001 | 6 typů; „Black startové" uvedeno jako značená poznámka. **Soulad.** |
| 4 ★ | Sekvenční vs. paralelní schvalování | **Paralelní** schvalování jako výchozí; pro výjimky zachovat volitelný atribut *Pořadí* v pravidle L0010. Opora: list „Dotaz" č. 1 („nemusí být první") | FR0003, L0010, L0002 | Paralelní implementováno. Volitelné pořadí prototyp nepředvádí. **Soulad (odchylka: viz pozn.).** |
| 5 ★ | Kanál notifikací (e-mail / JIRA / aplikace) | **In-app notifikace** (záznam + zobrazení v GUI) jako primární kanál + **e-mail** doplňkově (zejm. externí žadatelé). Bez JIRA — dle doporučení M3P (MS Office 365) | FR0006, UC0007, G0011 | In-app zvonek + panel, e-mail indikován. **Soulad.** |
| 6 | Hlavní BA dokument má placeholdery | Bez akce — vyřešeno volbou závazných zdrojů (procesní próza + katalog REQ_WF) | — | n/a |
| 7 | `REQ_WF_004` možná duplicita `REQ_WF_003` | Sloučit `REQ_WF_004` do `REQ_WF_003` (dle poznámky v katalogu). Bez dopadu do modelu — obojí pokrývá FR0001 | katalog, FR0001 | n/a (redakční úklid katalogu) |
| 8 | `REQ_WF_005/006/010` odkazují na neexistující `REQ_WF_XXX/YYY` | Opravit křížové odkazy v katalogu — doplnit konkrétní ID (povinné přílohy, podmínky žádosti) | katalog | n/a (redakční úklid katalogu) |
| 9 ★ | Uživatelské účty a autentizace nejsou řešeny | Autentizace přes **MS Entra ID** (ověřená identita, NREQ_007), externí subjekty přes guest účty / OTP; přístup řízen **RBAC** (role žadatel / schvalovatel / podpůrný útvar / správce). Proces zřizování a správy účtů řešit **samostatnou RQU** | L0009, aktér Správce workflow, nová RQU | Přihlášení nahrazeno přepínačem role (značeno). **Soulad** — účty mimo rozsah prototypu. |
| 10 ★ | „Evidence provedené zkoušky" nemá protějšek v katalogu REQ_WF | Ponechat v rozsahu jako **přírůstek IT2** (FR0010, UC0010/11) kvůli auditovatelnosti (cíl C04) — *k potvrzení ČEPS, zda do první verze* | FR0010, UC0010/11, G0015, L0007 | Vyhodnocení plně implementováno (oblast G0015). **Soulad.** |
| 11 | Gremiální porada není zpracována | Zařadit **„Projednání na gremiální poradě"** jako krok workflow u rizikové / předkomplexní / komplexní skupiny (útvar 13350). Opora: BA dok. kap. 5.2.3, list „Dotaz" č. 6 (gremiálka min. 2 roky) | FR0004, UC0004, L0010 | Gremiálka je krokem timeline u rizikové skupiny (značeno). **Soulad.** |
| 12 | Rozsah integrací (AŘP, PoVyk) | Integrace **AŘP** (FR0011) = výhledový **přírůstek IT2**, realizovat až bude AŘP k dispozici; do té doby ruční evidence. **PoVyk mimo rozsah** (dle M3P). Synchronizace číselníku zařízení z AŘP — předpoklad, do té doby ruční správa | FR0011, UC0012, NREQ_012 | AŘP jen jako záznam v auditní stopě; číselník zařízení lokální. **Soulad.** |
| 13 | Heuristické vyznačení změn upravené žádosti | Vyznačení změněných polí řešit **porovnáním na úrovni polí** (které pole se změnilo), ne plně heuristicky. Opora: M3P („umožní jen identifikovat změněná pole"). Přírůstek IT2 | FR0007, G0012, UC0008 | Porovnání polí + zvýraznění (`zmeneno`, `.dsz-changed`). **Soulad.** |
| 14 | Skladba polí formuláře dle typu zkoušky není známá | Vypracovat **šablony formulářů pro 6 typů** — oblasti G0004–G0008 + pole specifická pro typ (certifikační: typ zdroje/SVR, certifikace; riziková skupina: vedoucí zkoušky, program zablokování ochran, dotčené ochrany) dle Kodexu PS VI a PP/86 — *finálně potvrdit s businessem* | G0003–G0008, FR0001, L0001 | Pole specifická pro typ implementována a značena. **Soulad.** |
| 15 | List „Požadavky" – neformální duplicitní soupis | Sladit s formálním katalogem REQ_WF — položky bez ID přiřadit existujícímu požadavku nebo doplnit jako nové | katalog | n/a (redakční úklid katalogu) |
| 16 | Trigger „Schválená → Zkouška provedena" není určen | Provedení zkoušky **ručně označí subjekt zkoušky** (žadatel) akcí v detailu žádosti; doplnit atribut *datum provedení*. Výhledově automatizovat přes AŘP | SM-L0001, L0001, G0011, UC0010 | Ruční akce „Označit zkoušku jako provedenou" (značeno). **Soulad.** |

★ = významná otázka doporučená k potvrzení zadavatelem (ČEPS) před realizací.

**Pozn. k otázce #4:** Prototyp předvádí doporučené výchozí chování (plně paralelní
schvalování). Volitelné *pořadí* schvalovatelů (atribut `Pořadí` v L0010) je v návrhu
zachováno pro budoucí výjimky, ale prototyp je nepředvádí. Nejde o rozpor — prototyp
implementuje doporučenou výchozí variantu; sekvenční řazení je rozšíření nad jeho rámec.

### Fázování realizace

Vypořádání kopíruje přírůstky definované v RQU001:

- **IT1 (první nasazení):** otázky #1–#9, #11, #14, #16 — jádro workflow, formuláře pro
  provozní / certifikační / periodické zkoušky, notifikace, zastupitelnost, ruční evidence
  provedení zkoušky.
- **IT2 (následný přírůstek):** #10 (evidence vyhodnocení), #12 (integrace AŘP),
  #13 (vyznačení obsahových změn), náročnější workflow rizikové skupiny.
- **Redakční (mimo iterace):** #6, #7, #8, #15 — úprava katalogu `Byznys požadavky.xlsx`.

## 5. Závislosti a předpoklady

- **Potvrzení zadavatele (ČEPS)** u otázek ★ — zejména: zařazení „Black startových" zkoušek
  (#3), výchozí paralelní schvalování (#4), kanál notifikací (#5), zařazení evidence
  vyhodnocení do první verze (#10).
- **Doplnění katalogu** `Byznys požadavky.xlsx` o `REQ_WF_015–021` (#1) — bez něj nemá
  workflow závaznou oporu na úrovni katalogu.
- **Dodání šablon formulářů** dle typu zkoušky (#14) — připraví business (Kamila), finální
  skladba a povinnost polí musí být odsouhlasena.
- **Samostatná RQU pro správu uživatelů a oprávnění** (#9) — předpoklad pro produkční provoz;
  bez ní nelze nasadit RBAC ani externí přístup.
- **Dostupnost cílového systému AŘP** (#12) — podmínka realizace FR0011; do té doby integrace
  zůstává výhledová.

## 6. Otevřené otázky

Po vypořádání zůstávají k rozhodnutí zadavatele (ČEPS):

- **OQ-A:** Mají „Black startové" zkoušky být 7. hodnotou číselníku `typZkousky_E`, nebo
  organizační variantou rizikové skupiny? (souvisí s #3)
- **OQ-B:** Patří evidence provedené zkoušky (vyhodnocení) do první verze, nebo až do IT2?
  M3P výslovně uvádí, že výsledky zkoušek se nearchivují. (souvisí s #10)
- **OQ-C:** Jaká je závazná skladba a povinnost polí formulářů pro jednotlivé typy zkoušek?
  (souvisí s #14 — čeká na šablony od businessu)
- **OQ-D:** Spadá správa uživatelských účtů do projektu DSZEZ, nebo je řešena centrálně na
  úrovni ČEPS? (souvisí s #9)
- **OQ-E:** Konkrétní lhůty pro posouzení a vyjádření per typ zkoušky (návrh: 14 dní pro
  útvar 14630 při manipulacích — dle požadavku p. Aberta; ostatní 7–10 dní). (souvisí s #2)

Kontakt pro rozhodnutí: vlastník procesu / zadavatel ČEPS (úsek 13000, odbor 14630).

## 7. Verifikace

Po implementaci vypořádaných otázek se ověří:

- **Úplnost katalogu:** `Byznys požadavky.xlsx` neobsahuje prázdné ani neplatně odkazované
  položky REQ_WF (#1, #7, #8, #15).
- **Konzistence modelu:** realizační analýza má 6 hodnot `typZkousky_E`, FR0004 popisuje
  běh workflow vč. lhůt a gremiálky, SM-L0001 má určený trigger provedení zkoušky.
- **End-to-end scénář:** podání žádosti → paralelní posouzení → zamítnutí/schválení →
  (rizikové) gremiálka → provedení → vyhodnocení → archivace proběhne bez nejasností.

### Souhrn zpětné kontroly konzistence s prototypem

Každé navržené řešení bylo porovnáno s funkčním prototypem (`prototype.html`).
**Výsledek: prototyp je s návrhem konzistentní** — všech 11 otázek s dopadem do aplikace
(#2, #3, #5, #9, #10, #11, #12, #13, #14, #16 a workflow z #1) je v prototypu implementováno
přesně ve směru tohoto návrhu; prototyp tak slouží jako názorný důkaz proveditelnosti
navrženého vypořádání. Otázky #6, #7, #8, #15 jsou redakční údržbou katalogu bez dopadu do
aplikace. **Jediná uváděná odchylka** je u #4: prototyp předvádí doporučené výchozí
(paralelní) schvalování, volitelné pořadí schvalovatelů je nad jeho rámec — nejde o rozpor,
prototyp implementuje doporučenou variantu. Žádná úprava prototypu z tohoto návrhu nevyplývá.

## 8. Reference

- **RQU001 – Digitální schvalování zkoušek EZ** — cílová analýza
  ([README s otevřenými otázkami](../../RQU001%20-%20Digitální%20schvalování%20zkoušek%20EZ/analyza-md/README.md)).
- **Funkční prototyp** `src/DSZEZ/RQU001 - …/prototype.html` — proof-of-concept vypořádání.
- **Kodex přenosové soustavy, část VI**, kap. 2.4 — Povolování zkoušek EZ.
- **Pracovní postup PP/86/2025**, příloha č. 3 — Schvalovací postup rizikových zkoušek.
- **ČEPS Quick IT analýza M3P, v1.1** — varianty řešení, doporučení MS Office 365.
- Zdrojové podklady RQU001: `Byznys požadavky.xlsx` (katalog REQ_WF / NREQ),
  `Identifikace účastníků workflow.xlsx`, `Digitální schvalování zkoušek EZ.docx` (BA dokument).
