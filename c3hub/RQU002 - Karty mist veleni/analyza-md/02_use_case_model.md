# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC010 | Vyhledat místo velení | [FR006](01_model_pozadavku.md#fr-FR006) | — |
| UC011 | Přepnout zobrazení (grid / list) | [FR006](01_model_pozadavku.md#fr-FR006) | — |
| UC012 | Otevřít detail karty MV | [FR007](01_model_pozadavku.md#fr-FR007) | — |
| UC013 | Editovat specifikaci MV | [FR008](01_model_pozadavku.md#fr-FR008) | include UC012 |
| UC014 | Spravovat strukturu velení (pozice/role) | [FR009](01_model_pozadavku.md#fr-FR009) | — |
| UC015 | Editovat formulář schopností MV | [FR010](01_model_pozadavku.md#fr-FR010) | — |
| UC016 | Spravovat informační toky (IER/IP) a FMN instrukce | [FR011](01_model_pozadavku.md#fr-FR011) | — |
| UC017 | Stáhnout export karty MV (PDF / XLSX) | [FR012](01_model_pozadavku.md#fr-FR012) | — |
| UC018 | Přidat nové místo velení | [FR008](01_model_pozadavku.md#fr-FR008) | — |
| UC019 | Spravovat podřízená místa velení | [FR009](01_model_pozadavku.md#fr-FR009) | extend UC013 |
| UC020a | Přidat IER do MV | [FR011](01_model_pozadavku.md#fr-FR011) | extend UC016 |
| UC020b | Přidat IP do MV | [FR011](01_model_pozadavku.md#fr-FR011) | extend UC016 |
| UC020c | Přidat FMN instrukci do MV | [FR011](01_model_pozadavku.md#fr-FR011) | extend UC016 |
| UC021 | Generovat report karty MV | [FR006](01_model_pozadavku.md#fr-FR006) | — |
| UC022 | Generovat CIS matici (XLSX) | [FR012](01_model_pozadavku.md#fr-FR012) | — |
| UC023 | Importovat interakce z jiného MV | [FR011](01_model_pozadavku.md#fr-FR011) | extend UC016 |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

> **Verze: RQU002** – UC020 „Přidat IER / IP / FMN instrukci" rozdělen na tři samostatné Use Case **UC020a** (IER), **UC020b** (IP), **UC020c** (FMN instrukce). Split odhalen při tvorbě prototypu: scénáře pro IER vs. IP vs. FMN se zásadně liší – rozdílné výběrové dialogy (G032/G033/G035), rozdílné backend lookupy (IP a FMN provádějí dohledání souvisejících IER), rozdílné alternativní scénáře (IP/FMN mají větev „nenalezeny IER") a rozdílná hloubka stromu v cílovém G031a (IER = 2 úrovně, IP/FMN = 3 úrovně). Původní `UC020` je vyřazen (`«zrušeno-RQU002»`), anchor ID nástupců jsou stabilní dle metodiky kap. 6.1. Viz též audit `src/C3HUB/AUDIT-uc-split-2026-05-19.md`.

---

<a id="uc-UC010"></a>
## UC010 – Vyhledat místo velení

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel najde konkrétní MV v gridu kart podle názvu nebo popisu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR006](01_model_pozadavku.md#fr-FR006) |

**Vstupní podmínky:** Uživatel je v modulu Karty míst velení.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne do vyhledávacího pole. | [KartyMístVelení](03_gui_model.md#gui-G011) |
| 2 | Uživatel zadá hledaný řetězec. | [KartyMístVelení](03_gui_model.md#gui-G011) |
| 3 | Uživatel klikne **VYHLEDAT** (nebo Enter). | [KartyMístVelení](03_gui_model.md#gui-G011) |
| 4 | Systém filtruje karty MV (full-text v názvu a popisu) a překreslí grid. | [KartyMístVelení](03_gui_model.md#gui-G011) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Žádná karta neodpovídá | Systém zobrazí prázdný stav „Nebyla nalezena žádná místa velení". |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC010-1 | Vyhledávání není case-sensitive a podporuje českou diakritiku. | 4 |

**Koncové podmínky:** Filtrované karty jsou zobrazeny.

---

<a id="uc-UC011"></a>
## UC011 – Přepnout zobrazení (grid / list)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zvolí mezi karetní mřížkou (grid) a seznamovým zobrazením (list). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR006](01_model_pozadavku.md#fr-FR006) |

**Vstupní podmínky:** Uživatel je v Kartách MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na ikonu **grid** nebo **list** vpravo nahoře. | [KartyMístVelení](03_gui_model.md#gui-G011) |
| 2 | Systém přepne layout a uloží volbu do uživatelského profilu. | — |

**Koncové podmínky:** Layout je přepnut.

---

<a id="uc-UC012"></a>
## UC012 – Otevřít detail karty MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá detail konkrétního MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR007](01_model_pozadavku.md#fr-FR007) |

**Vstupní podmínky:** Uživatel vidí kartu MV v gridu.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne tlačítko **ZOBRAZIT** na kartě MV. | [KartaMístaVelení](03_gui_model.md#gui-G012) |
| 2 | Systém přesměruje na URL `/web/command-posts/<id>`. | — |
| 3 | Systém načte detail MV a zobrazí 4 tematické sekce. | [DetailKartyMV](03_gui_model.md#gui-G013) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | MV neexistuje (deeplink na neplatné ID) | Systém zobrazí chybu „Místo velení nenalezeno". |

**Koncové podmínky:** Uživatel je na detailu MV.

---

<a id="uc-UC013"></a>
## UC013 – Editovat specifikaci MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel upraví základní specifikaci MV a podřízená MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR008](01_model_pozadavku.md#fr-FR008) |

**Vstupní podmínky:** Uživatel je na detailu MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **UPRAVIT** na dlaždici „Specifikace místa velení". | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 2 | Systém otevře `«Form modal» SpecifikaceMV` s pre-vyplněnými hodnotami. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 3 | Uživatel v sekci **Místo velení** vyplní/upraví: Typ MV (povinné), Název, Zodpovědná osoba, Taktická značka, Kód jednotky, Vlajka, Obrázek, Cílový stav. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 4 | Uživatel v sekci **Podřízená místa velení** spravuje grid podřízených MV (UC019). | [PodřízenáMV](03_gui_model.md#gui-G016) |
| 5 | Uživatel v sekci **Funkce a úroveň** zvolí Společné funkce, Bojové funkce a Úroveň MV. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 6 | Uživatel v sekci **Kontinuita** zvolí Trvalé / Dočasné (radio). | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 7 | Uživatel v sekci **Mobilita** zvolí Stacionární / Mobilní (radio); pro Mobilní vyplní Druh pohyblivosti. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 8 | (Jen pro Mobilní) Uživatel v sekci **Balistická ochrana** zvolí Kinetickou a Minovou ochranu. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 9 | Uživatel v sekci **Zabezpečení ochrany dle RMO č.49/2017** zvolí Zabezpečení ochrany, Odolnost, Soběstačnost. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 10 | Uživatel v sekci **Omezení, požadavky a další** vyplní Omezení, Požadavky, Funkci MV, P. č. dle VODOS. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 11 | Uživatel v sekci **Lokace** vyplní Šířku a Délku (GPS). | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 12 | Uživatel klikne **ULOŽIT**. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 13 | Systém validuje povinné pole (Typ MV) a párovost GPS, uloží změny přes `PUT /command-posts/{id}/specification` a zavře dialog. | — |
| 14 | Systém aktualizuje detail MV. | [DetailKartyMV](03_gui_model.md#gui-G013) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 12a | Uživatel klikne **ZRUŠIT** | Systém zavře dialog (s confirm při neuložených změnách). |
| 13a | Není vyplněn povinný Typ MV | Systém zobrazí inline chybu u pole, neuloží. |
| 13b | Šířka GPS vyplněna bez délky (nebo opačně) | Systém zobrazí inline chybu („Šířka/Délka je povinná, pokud je zadána délka/šířka") a neuloží. |
| 13c | Uživatel nemá oprávnění `canUpdate` | Tlačítko Uložit není dostupné (ACL z DTO). |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC013-1 | Typ místa velení je povinný (UI `*`). | 13 |
| P-UC013-2 | Šířka a Délka GPS musí být vyplněny společně. | 13 |
| P-UC013-3 | Cyklické podřízenosti jsou zakázány. | 13 |
| P-UC013-4 | Akci povoluje pouze ACL `canUpdate` (DTO `CommandPostAclDto`). | 1 |

**Koncové podmínky:** Specifikace MV je uložena.

> **Verze: RQU002** – scénář rozšířen z 7 na 14 kroků odpovídajících 10 sekcím dialogu (Místo velení, Podřízená MV, Funkce a úroveň, Kontinuita, Mobilita, Balistická ochrana, Zabezpečení ochrany, Omezení/požadavky, Lokace). Doplněna validace GPS párovosti a ACL kontrola.

---

<a id="uc-UC014"></a>
## UC014 – Spravovat strukturu velení (pozice/role)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel spravuje rozpad MV na pozice a jejich přiřazení rolím. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR009](01_model_pozadavku.md#fr-FR009) |

**Vstupní podmínky:** Uživatel je na detailu MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **UPRAVIT** na dlaždici „Strukturu velení". | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 2 | Systém otevře `«Form modal» StrukturuVelení`. | [StrukturuVelení](03_gui_model.md#gui-G017) |
| 3 | Uživatel zvolí **Rozpad Místa Velení** (multi-tag, např. „H4"). | [StrukturuVelení](03_gui_model.md#gui-G017) |
| 4 | Uživatel vidí stromovou tabulku pozic. | [PoziceMV](03_gui_model.md#gui-G018) |
| 5 | Uživatel může vyhledat pozici. | [StrukturuVelení](03_gui_model.md#gui-G017) |
| 6 | Uživatel může rozbalit pozici (`>`) a zobrazit podpozice. | [PoziceMV](03_gui_model.md#gui-G018) |
| 7 | Uživatel přidá podpozici tlačítkem **+**. | [PoziceMV](03_gui_model.md#gui-G018) |
| 8 | Uživatel smaže pozici ikonou koše. | [PoziceMV](03_gui_model.md#gui-G018) |
| 9 | Dole vidí seznam **Role bez přiřazené pozice**. | [StrukturuVelení](03_gui_model.md#gui-G017) |
| 10 | Uživatel klikne **ULOŽIT**. | [StrukturuVelení](03_gui_model.md#gui-G017) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 10a | Uživatel klikne **ZRUŠIT** | Systém zavře dialog bez uložení. |
| 8a | Pozice obsahuje podpozice/role | Systém zobrazí potvrzení smazání podstromu. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC014-1 | Hierarchie pozic nesmí obsahovat cykly. | 7 |

**Koncové podmínky:** Strukturu velení je uložena.

---

<a id="uc-UC015"></a>
## UC015 – Editovat formulář schopností MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel specifikuje, které schopnosti MV podporuje. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR010](01_model_pozadavku.md#fr-FR010) |

**Vstupní podmínky:** Uživatel je na detailu MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **UPRAVIT** na dlaždici „Formulář schopností". | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 2 | Systém otevře `«Form modal» FormulářSchopností`, načte specifikaci schopností MV (`GET /command-posts/{id}/capability-spec`) a katalog druhů misí. | [FormulářSchopností](03_gui_model.md#gui-G019) |
| 3 | Uživatel zvolí **Druhy operace/mise** (multi-select entit z RQU003). | [FormulářSchopností](03_gui_model.md#gui-G019) |
| 4 | Systém zobrazí stromový grid MCA schopností: root řádky = MCA schopnosti, child řádky = subkategorie. | [SchopnostiMV](03_gui_model.md#gui-G020) |
| 5 | Uživatel rozbalí MCA schopnost a v sloupci **Podporováno** zaškrtne podporované subkategorie. | [SchopnostiMV](03_gui_model.md#gui-G020) |
| 6 | Uživatel klikne **ULOŽIT**. | [FormulářSchopností](03_gui_model.md#gui-G019) |
| 7 | Systém uloží přes `PUT /command-posts/{id}/capability-spec` a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | Načítání modelu trvá déle | Systém zobrazí spinner + text „Probíhá iniciální načtení modelu schopností (může trvat déle)" (i18n `commandPost:loadingCapabilityModel`). |
| 6a | Některá MCA schopnost je v gridu označená, ale bez zvolených subkategorií | Systém otevře confirmation dialog s textem „Některé schopnosti nemají zvoleno »Podporováno« – nedojde k jejich uložení" (i18n `mission:abilitiesDoNotHaveSelectedSubcategory`). Uživatel může pokračovat (uložit částečně) nebo se vrátit. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC015-1 | Druhy misí jsou povinné (`required`). | 6 |
| P-UC015-2 | MCA schopnost se subkategoriemi je definována 1 záznamem; subkategorie jsou child řádky. | 4 |

**Koncové podmínky:** Schopnosti MV jsou uloženy.

> **Verze: RQU002** – krok 4 (přepínač Kódy/Hierarchie) byl chybný – v source kódu **neexistuje**. Místo toho je grid vždy stromový (MCA schopnosti → subkategorie). Doplněn alternativní scénář 6a (confirm při prázdných subkategoriích). „Druhy misí" jsou entity z RQU003, ne enum.

---

<a id="uc-UC016"></a>
## UC016 – Spravovat informační toky a FMN instrukce

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel pracuje s IER, IP a FMN instrukcemi MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR011](01_model_pozadavku.md#fr-FR011) |

**Vstupní podmínky:** Uživatel je na detailu MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na sekci **Informační toky a produkty na místě velení**. | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 2 | Uživatel vidí dvě dlaždice **Pohled přes IER** a **Pohled přes IP**. | [InformačníToky](03_gui_model.md#gui-G021) |
| 3 | Uživatel klikne **UPRAVIT** → otevře se editor pohledu. | [InformačníToky](03_gui_model.md#gui-G021) |
| 4 | Uživatel skroluje na sekci **FMN instrukce** se 13 dlaždicemi. | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 5 | Uživatel klikne **UPRAVIT** na konkrétní FMN instrukci. | [FMNDlazdice](03_gui_model.md#gui-G026) |
| 6 | Systém otevře editační dialog instrukce. | [FMNDlazdice](03_gui_model.md#gui-G026) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC016-1 | Detail editace IER/IP/FMN je rozpracován v RQU004/RQU006. | — |

**Koncové podmínky:** Toky / instrukce jsou aktualizovány.

---

<a id="uc-UC017"></a>
## UC017 – Stáhnout export karty MV (PDF / XLSX)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá tisknutelný export karty MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR012](01_model_pozadavku.md#fr-FR012) |

**Vstupní podmínky:** Uživatel je na detailu MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel skroluje na sekci **Karty MV ke stažení**. | [DetailKartyMV](03_gui_model.md#gui-G013) |
| 2 | Uživatel klikne **STÁHNOUT PDF / XLSX** na dlaždici. | [ZákladníKarta](03_gui_model.md#gui-G027) |
| 3 | Systém vygeneruje export a vrátí binární soubor. | — |
| 4 | Prohlížeč iniciuje stažení. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 3a | Generování selže | Systém zobrazí chybovou notifikaci. |

**Koncové podmínky:** Soubor je stažen.

---

<a id="uc-UC018"></a>
## UC018 – Přidat nové místo velení

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel založí novou kartu místa velení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR008](01_model_pozadavku.md#fr-FR008) |

**Vstupní podmínky:** Uživatel je v Kartách MV.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ PŘIDAT** v záhlaví. | [KartyMístVelení](03_gui_model.md#gui-G011) |
| 2 | Systém otevře `«Form modal» SpecifikaceMV` v režimu „nový". | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 3 | Uživatel vyplní povinné a volitelné atributy (UC013 kroky 3–10). | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 4 | Uživatel klikne **ULOŽIT**. | [SpecifikaceMV](03_gui_model.md#gui-G015) |
| 5 | Systém vytvoří záznam a redirektne na detail nové karty MV. | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC018-1 | Stejná pravidla validace jako UC013. | 5 |

**Koncové podmínky:** Nová karta MV je v evidenci.

---

<a id="uc-UC019"></a>
## UC019 – Spravovat podřízená místa velení

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přidá nebo odebere podřízené MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR009](01_model_pozadavku.md#fr-FR009) |

**Vstupní podmínky:** Uživatel je v dialogu Specifikace MV v sekci „Podřízená MV".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí tabulku **Podřízená MV** se sloupci Akce / Název. | [PodřízenáMV](03_gui_model.md#gui-G016) |
| 2 | Uživatel může smazat řádek ikonou koše. | [PodřízenáMV](03_gui_model.md#gui-G016) |
| 3 | Uživatel může přidat nové podřízené MV ikonou ≡+. | [PodřízenáMV](03_gui_model.md#gui-G016) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC019-1 | Podřízené MV nesmí být totéž MV ani jeho nadřízený. | 3 |

**Koncové podmínky:** Tabulka podřízených MV je aktualizována.

---

<a id="uc-UC020a"></a>
## UC020a – Přidat IER do MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přidá k místu velení nový požadavek na výměnu informací (IER) z modelu SVŘ. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR011](01_model_pozadavku.md#fr-FR011) |

**Vstupní podmínky:** Uživatel je na detailu MV v sekci „Informační toky a produkty".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ PŘIDAT PODLE IER**. | [Informační toky a produkty](03_gui_model.md#gui-G021) |
| 2 | Systém otevře dialog výběru IER s LOV existujících IER z modelu SVŘ; již přiřazené IER jsou vyloučeny. | [Výběr IER](03_gui_model.md#gui-G032) |
| 3 | Uživatel zvolí jeden nebo více IER a potvrdí. | [Výběr IER](03_gui_model.md#gui-G032) |
| 4 | Systém otevře dialog Interakce s MV v režimu `isIer=true, fetchInteractions=true` – grid interakcí zobrazí strom **IER → TIN**. | [Interakce s MV](03_gui_model.md#gui-G031) |
| 5 | Uživatel nastaví u nově přidaných IER stavy interakce (Req / Konzument / Poskytovatel). | [Grid interakcí](03_gui_model.md#gui-G031a) |
| 6 | Uživatel klikne **ULOŽIT** – systém uloží interakce (`PATCH /command-posts/{id}/interactions`). | [Interakce s MV](03_gui_model.md#gui-G031) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| A-UC020a-1 | V kroku 2 nejsou žádné nepřiřazené IER (všechny už jsou na MV). | Systém zobrazí informaci „Všechny IER jsou již přiřazeny" a dialog výběru se neotevře. |
| A-UC020a-2 | Uživatel v kroku 6 zavře dialog bez uložení. | Systém zobrazí potvrzení neuložených změn; po potvrzení nově přidané IER nezůstávají. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC020a-1 | LOV v dialogu výběru IER vylučuje IER již přiřazené k tomuto MV. | 2 |
| P-UC020a-2 | Strom v gridu interakcí má pro IER pohled 2 úrovně: IER (root) → TIN (list). | 4 |

**Koncové podmínky:** Vybrané IER jsou přiřazeny k MV s nastavenými stavy interakce.

Sekvenční diagram: [diagrams/sd_uc020a.puml](diagrams/sd_uc020a.puml)

---

<a id="uc-UC020b"></a>
## UC020b – Přidat IP do MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přidá k místu velení informační produkt (IP); systém k němu dohledá související IER. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR011](01_model_pozadavku.md#fr-FR011) |

**Vstupní podmínky:** Uživatel je na detailu MV v sekci „Informační toky a produkty".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ PŘIDAT PODLE IP**. | [Informační toky a produkty](03_gui_model.md#gui-G021) |
| 2 | Systém otevře dialog výběru IP s LOV existujících IP z modelu SVŘ. | [Výběr IP](03_gui_model.md#gui-G033) |
| 3 | Uživatel zvolí jeden nebo více IP a potvrdí. | [Výběr IP](03_gui_model.md#gui-G033) |
| 4 | Systém pro zvolené IP dohledá související IER (`POST /model/information-products/{ipId}:search-information-exchange-requirements`). | — |
| 5 | Systém otevře dialog Interakce s MV v režimu `isIer=true, showAlsoUnassigned=true, initExpandDataGridTree=true` – **IER-rooted strom** s nalezenými IER (`IER → TIN`; filtry BA/BP a IP jsou v tomto toku předzapnuté). | [Interakce s MV](03_gui_model.md#gui-G031) |
| 6 | Uživatel nastaví u IER (a TIN) stavy interakce (Req / Konzument / Poskytovatel). | [Grid interakcí](03_gui_model.md#gui-G031a) |
| 7 | Uživatel klikne **ULOŽIT** – systém uloží interakce (`PATCH /command-posts/{id}/interactions`). | [Interakce s MV](03_gui_model.md#gui-G031) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| A-UC020b-1 | Krok 4 – pro zvolené IP nebyly nalezeny žádné IER. | Systém zobrazí informaci „Pro vybrané IP nebyly nalezeny žádné IER" a dialog Interakce s MV se neotevře. (= [A-G033-1](03_gui_model.md#gui-G033)) |
| A-UC020b-2 | Uživatel v kroku 7 zavře dialog bez uložení. | Systém zobrazí potvrzení neuložených změn. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC020b-1 | Cílový dialog „Přidat podle IP" běží v režimu `isIer=true` → strom je **IER-rooted** (`IER → TIN`, volitelně BA/BP/IP/CIS), **ne** IP-rooted. Ověřeno v `CommandPostInteractionsCardPanel.tsx` (instance `interactionsAddIp` má `isIer=true`). | 5 |
| P-UC020b-2 | `showAlsoUnassigned=true` zpřístupní editaci stavů i pro IER, které dosud nemají vazbu na MV. | 5–6 |

> **Verze: RQU002** – krok 5 a pravidla opraveny: cílový dialog „Přidat podle IP" je IER-rooted (`isIer=true`), ne 3-úrovňový strom „IP→IER→TIN". Původní popis vznikl z agentského souhrnu bez ověření zdroje; opraveno přímým čtením `CommandPostInteractionsCardPanel.tsx` a `InteractionGraphTransformer.ts`.

**Koncové podmínky:** Zvolené IP a jejich IER jsou přiřazeny k MV s nastavenými stavy interakce.

Sekvenční diagram: [diagrams/sd_uc020b.puml](diagrams/sd_uc020b.puml)

---

<a id="uc-UC020c"></a>
## UC020c – Přidat FMN instrukci do MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přidá k místu velení FMN procedurální instrukci; systém k ní dohledá související IER. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR011](01_model_pozadavku.md#fr-FR011) |

**Vstupní podmínky:** Uživatel je na detailu MV v sekci „FMN instrukce".

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ PŘIDAT PODLE FMN INSTRUKCE**. | [FMN instrukce](03_gui_model.md#gui-G024) |
| 2 | Systém otevře dialog výběru procedurální instrukce s LOV FMN instrukcí. | [Výběr procedurální instrukce](03_gui_model.md#gui-G035) |
| 3 | Uživatel zvolí FMN procedurální instrukci a potvrdí. | [Výběr procedurální instrukce](03_gui_model.md#gui-G035) |
| 4 | Systém pro zvolenou instrukci dohledá související IER (`POST /model/procedural-instructions/{piId}:iers`). | — |
| 5 | Systém otevře dialog Interakce s MV v režimu `isIer=true, showAlsoUnassigned=true` – grid interakcí zobrazí strom **FMN instrukce → IER → TIN**. | [Interakce s MV](03_gui_model.md#gui-G031) |
| 6 | Uživatel nastaví u IER stavy interakce (Req / Konzument / Poskytovatel). | [Grid interakcí](03_gui_model.md#gui-G031a) |
| 7 | Uživatel klikne **ULOŽIT** – systém uloží interakce (`PATCH /command-posts/{id}/interactions`). | [Interakce s MV](03_gui_model.md#gui-G031) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| A-UC020c-1 | Krok 4 – pro zvolenou FMN instrukci nebyly nalezeny žádné IER. | Systém zobrazí informaci „Pro vybranou instrukci nebyly nalezeny IER" a dialog Interakce s MV se neotevře. (= [A-G035-1](03_gui_model.md#gui-G035)) |
| A-UC020c-2 | Uživatel v kroku 7 zavře dialog bez uložení. | Systém zobrazí potvrzení neuložených změn. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC020c-1 | FMN procedurální instrukce má vazbu 1:N na IER – výsledný strom má pod jednou FMN root více IER. | 4–5 |
| P-UC020c-2 | Strom v gridu interakcí má pro FMN pohled 3 úrovně: FMN instrukce (root) → IER → TIN (list). | 5 |

**Koncové podmínky:** Zvolená FMN instrukce a její IER jsou přiřazeny k MV s nastavenými stavy interakce.

Sekvenční diagram: [diagrams/sd_uc020c.puml](diagrams/sd_uc020c.puml)

---

<a id="uc-UC021"></a>
## UC021 – Generovat report karty MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá generovaný report (souhrnný PDF) konkrétní karty MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR006](01_model_pozadavku.md#fr-FR006) |

**Vstupní podmínky:** Uživatel je v Kartách MV (přehledový grid nebo detail MV). Aktér má v ACL `canGenerateReport = true`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne tlačítko **REPORT** na kartě MV nebo v gridu tabulky. | [KartaMístaVelení](03_gui_model.md#gui-G012), [TabulkaKartyMV](03_gui_model.md#gui-G011b) |
| 2 | Systém otevře dialog `«Form modal» MožnostiReportuMV`. | [MožnostiReportu](03_gui_model.md#gui-G036) |
| 3 | Uživatel zvolí Jazyk, Variantu (BASIC / COMPLETE) a Klasifikaci (OFFICIAL / RESTRICTED). | [MožnostiReportu](03_gui_model.md#gui-G036) |
| 4 | Uživatel klikne **Stáhnout PDF**. | [MožnostiReportu](03_gui_model.md#gui-G036) |
| 5 | Systém zobrazí snackbar „Generování reportu bylo zahájeno, může trvat déle" a volá `POST /command-posts/{id}:generate-command-post-report`. | — |
| 6 | Server vrátí PDF (blob); prohlížeč zahájí stažení s názvem `{id}-Report.pdf`. | — |
| 7 | Systém zobrazí snackbar „Report stažen". | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Generování selže | Snackbar „Došlo k neočekávané chybě". |
| 1a | Aktér nemá `canGenerateReport` | Tlačítko Report není dostupné. |

**Koncové podmínky:** Report PDF je stažen.

> **Verze: RQU002** – mezistup dialogu možností (UC krok 2–4) doplněn dle source; v původní analýze chyběl. Varianta `BASIC` ↔ `COMPLETE` mapuje na atribut `Varianta reportu` třídy [L011](04_logicky_model.md#lm-L011).

---

<a id="uc-UC022"></a>
## UC022 – Generovat CIS matici (XLSX)

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá CIS matici (matici minimálních požadavků na KIP) konkrétní karty MV jako XLSX. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR012](01_model_pozadavku.md#fr-FR012) |

**Vstupní podmínky:** Uživatel je na detailu MV nebo v přehledu. ACL `canGenerateReport = true`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne dlaždici **CIS matice** v sekci „Karty MV ke stažení" (na detailu) nebo split-akci „Report CIS matice" v dlaždici karty (na přehledu). | [CIS matice](03_gui_model.md#gui-G029), [KartaMístaVelení](03_gui_model.md#gui-G012) |
| 2 | Systém otevře dialog `«Form modal» MožnostiCISMatice`. | [MožnostiCISMatice](03_gui_model.md#gui-G037) |
| 3 | Uživatel zvolí Jazyk a Klasifikaci. | [MožnostiCISMatice](03_gui_model.md#gui-G037) |
| 4 | Uživatel klikne **Stáhnout XLSX**. | [MožnostiCISMatice](03_gui_model.md#gui-G037) |
| 5 | Systém volá `POST /command-posts/{id}:generate-cis-matrix`. | — |
| 6 | Server vrátí XLSX; prohlížeč zahájí stažení s názvem `{id}-CIS-MATRIX.xlsx`. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Generování selže | Snackbar „Došlo k neočekávané chybě". |

**Koncové podmínky:** XLSX je stažen.

> **Verze: RQU002** – nový UC. V původní analýze byl UC017 generický pro „PDF/XLSX"; rozdělen na UC017 (PDF), UC021 (PDF z přehledu) a UC022 (CIS XLSX) podle skutečných endpointů.

---

<a id="uc-UC023"></a>
## UC023 – Importovat interakce z jiného MV

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zrychlí konfiguraci interakcí na MV načtením interakcí z jiného (referenčního) MV jako šablony. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR011](01_model_pozadavku.md#fr-FR011) |
| **Vztah** | `extend` [UC016](#uc-UC016) – v rámci editace IER lze importovat ze šablony |

**Vstupní podmínky:** Uživatel je v dialogu `«Form modal» InterakceMV` v režimu editace IER ([G031](03_gui_model.md#gui-G031)).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne ikonu **Načíst data** (`FileOpenOutlined`). | [InterakceMV](03_gui_model.md#gui-G031) |
| 2 | Systém otevře `«Form modal» ImportInterakcíZJinéhoMV`. | [ImportInterakcí](03_gui_model.md#gui-G034) |
| 3 | Uživatel zvolí zdrojové MV z dropdownu. | [ImportInterakcí](03_gui_model.md#gui-G034) |
| 4 | Uživatel klikne **Načíst data**. | [ImportInterakcí](03_gui_model.md#gui-G034) |
| 5 | Systém načte graf interakcí zdrojového MV a sloučí (`CommandPostInteractionMergeTool.mergeInteractions`) s aktuálními interakcemi v gridu [G031a](03_gui_model.md#gui-G031a). | — |
| 6 | Uživatel reviduje sloučené interakce a klikne **ULOŽIT** v [G031](03_gui_model.md#gui-G031). | [InterakceMV](03_gui_model.md#gui-G031) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Zdrojové MV nemá žádné interakce | Snackbar „Zvolené místo velení nemá nastavené žádné interakce. Pro import tedy nejsou k dispozici žádná data." |

**Koncové podmínky:** Interakce zdrojového MV jsou sloučeny s aktuálními (nepřepisují, ale doplňují).

> **Verze: RQU002** – nový UC. V source je významná funkcionalita šablon přes `CommandPostInteractionsImportDialog`, kterou původní analýza nemapovala.
