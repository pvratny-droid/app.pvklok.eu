# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC024 | Zobrazit přehled misí | [FR013](01_model_pozadavku.md#fr-FR013) | — |
| UC025 | Vytvořit novou misi | [FR014](01_model_pozadavku.md#fr-FR014) | — |
| UC026 | Editovat detail mise | [FR014](01_model_pozadavku.md#fr-FR014) | — |
| UC027 | Duplikovat misi | [FR015](01_model_pozadavku.md#fr-FR015) | — |
| UC028 | Zneplatnit misi | [FR016](01_model_pozadavku.md#fr-FR016) | — |
| UC029 | Obnovit zneplatněnou misi | [FR016](01_model_pozadavku.md#fr-FR016) | — |
| UC030 | Plánovat informační interakce mise | [FR017](01_model_pozadavku.md#fr-FR017) | — |
| UC031 | Spravovat velitelské vazby C2 | [FR018](01_model_pozadavku.md#fr-FR018) | — |
| UC032 | Zobrazit graf mise | [FR019](01_model_pozadavku.md#fr-FR019) | — |
| UC033 | Generovat CIS matici mise | [FR020](01_model_pozadavku.md#fr-FR020) | — |
| UC034 | Generovat report mise | [FR021](01_model_pozadavku.md#fr-FR021) | — |

> **Verze: RQU003** – UC007 „Smazat misi" zrušen (revize proti zdroji COCO). Endpoint `DELETE /missions/{id}` i ACL `canDelete` v API existují, ale **žádné UI je nevyvolává** – mazání mise není v aplikaci dostupné. Číslování zbývajících UC zachováno (UC030–UC034) kvůli stabilitě anchor ID. Viz `README.md` → Otevřené otázky.

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC024"></a>
## UC024 – Zobrazit přehled misí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled všech misí rozdělených na aktivní a zneplatněné. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR013](01_model_pozadavku.md#fr-FR013) |

**Vstupní podmínky:** Uživatel je v modulu Mise (`/web/missions`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém načte všechny mise (`findAll`). | — |
| 2 | Systém rozdělí mise na aktivní (`invalidated = false`) a zneplatněné a seřadí je. | — |
| 3 | Systém zobrazí panel „Mise" (aktivní) a – existují-li – panel „Zneplatněné mise". | [G039](03_gui_model.md#gui-G039) |
| 4 | Každá mise je dlaždice s názvem, popisem a akcemi. | [G040](03_gui_model.md#gui-G040) |

**Koncové podmínky:** Přehled misí je zobrazen.

---

<a id="uc-UC025"></a>
## UC025 – Vytvořit novou misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel založí novou misi / operaci / cvičení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR014](01_model_pozadavku.md#fr-FR014) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** v záhlaví panelu „Mise". | [G039](03_gui_model.md#gui-G039) |
| 2 | Systém otevře dialog Vytvoření mise. | [G041](03_gui_model.md#gui-G041) |
| 3 | Uživatel vyplní Název, Vlastnické MV a Druhy mise (multi-select), volitelně Popis. | [G041](03_gui_model.md#gui-G041) |
| 4 | Uživatel klikne **VYTVOŘIT**. | [G041](03_gui_model.md#gui-G041) |
| 5 | Systém validuje povinná pole, volá `POST /missions` a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Uživatel zavře dialog (křížek) | Systém zavře dialog bez uložení. |
| 5a | Chybí povinné pole | Inline chyba „Pole je povinné". |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC025-1 | Povinné: Název, Vlastnické MV, alespoň jeden Druh mise. | 5 |

**Koncové podmínky:** Nová mise je v evidenci (aktivní).

---

<a id="uc-UC026"></a>
## UC026 – Editovat detail mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel upraví základní údaje existující mise. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR014](01_model_pozadavku.md#fr-FR014) |

**Vstupní podmínky:** Mise existuje, aktér má ACL `canUpdate`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel otevře detail mise (klik na dlaždici nebo tlačítko UPRAVIT). | [G040](03_gui_model.md#gui-G040), [G042](03_gui_model.md#gui-G042) |
| 2 | Uživatel klikne ikonu tužky v sekci Detaily. | [G042](03_gui_model.md#gui-G042) |
| 3 | Systém otevře dialog Editace detailu mise s předvyplněnými hodnotami. | [G047](03_gui_model.md#gui-G047) |
| 4 | Uživatel upraví Název / Vlastnické MV / Druhy mise / Popis. | [G047](03_gui_model.md#gui-G047) |
| 5 | Uživatel klikne **ULOŽIT**. | [G047](03_gui_model.md#gui-G047) |
| 6 | Systém validuje a volá `PUT /missions/{id}`. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 6a | Chybí povinné pole | Inline chyba u pole. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC026-1 | Povinné: Název, Vlastnické MV, alespoň jeden Druh mise. | 6 |

**Koncové podmínky:** Mise je aktualizována.

---

<a id="uc-UC027"></a>
## UC027 – Duplikovat misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel rychle vytvoří kopii mise jako šablonu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR015](01_model_pozadavku.md#fr-FR015) |

**Vstupní podmínky:** Uživatel má otevřený detail mise.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **DUPLIKOVAT** v patičce detailu mise. | [G042](03_gui_model.md#gui-G042) |
| 2 | Systém otevře dialog Duplikace mise. | [G048](03_gui_model.md#gui-G048) |
| 3 | Uživatel zadá Název nové mise. | [G048](03_gui_model.md#gui-G048) |
| 4 | Uživatel klikne **DUPLIKOVAT**. | [G048](03_gui_model.md#gui-G048) |
| 5 | Systém volá `POST /missions/{id}:duplicate` a vytvoří kopii. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Název nové mise je shodný s originálem | Inline chyba „Název se musí lišit od originálu". |

**Koncové podmínky:** Kopie mise je v evidenci.

---

<a id="uc-UC028"></a>
## UC028 – Zneplatnit misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přesune misi mezi zneplatněné (zachová data). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR016](01_model_pozadavku.md#fr-FR016) |

**Vstupní podmínky:** Mise je aktivní, aktér má ACL `canInvalidate`, má otevřený detail mise.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **ZNEPLATNIT** v patičce detailu mise. | [G042](03_gui_model.md#gui-G042) |
| 2 | Systém otevře potvrzovací dialog. | [G049](03_gui_model.md#gui-G049) |
| 3 | Uživatel potvrdí. | [G049](03_gui_model.md#gui-G049) |
| 4 | Systém volá `POST /missions/{id}:invalidate`, zaznamená `invalidatedBy`/`invalidatedAt`, zavře detail. | — |
| 5 | Mise se přesune do panelu „Zneplatněné mise". | [G039](03_gui_model.md#gui-G039) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 3a | Uživatel klikne STORNO | Systém zavře potvrzovací dialog bez akce. |

**Koncové podmínky:** Mise je zneplatněná.

---

<a id="uc-UC029"></a>
## UC029 – Obnovit zneplatněnou misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel vrátí zneplatněnou misi mezi aktivní. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR016](01_model_pozadavku.md#fr-FR016) |

**Vstupní podmínky:** Mise je zneplatněná, aktér má ACL `canRestore`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **OBNOVIT** na dlaždici zneplatněné mise. | [G040](03_gui_model.md#gui-G040) |
| 2 | Systém zobrazí potvrzení obnovení. | — |
| 3 | Uživatel potvrdí. | — |
| 4 | Systém volá `POST /missions/{id}:restore`, zaznamená `restoredBy`/`restoredAt`. | — |
| 5 | Mise se přesune do panelu „Mise" (aktivní). | [G039](03_gui_model.md#gui-G039) |

**Koncové podmínky:** Mise je aktivní.

---

<a id="uc-UC030"></a>
## UC030 – Plánovat informační interakce mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel definuje informační interakce mezi MV v rámci mise – které IER/TIN toky probíhají mezi kterými MV a s jakým operačním tempem (PACE). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR017](01_model_pozadavku.md#fr-FR017) |

**Vstupní podmínky:** Uživatel je v detailu mise, zvolil **Z pohledu MV** a je na záložce Interakce.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí stromový plánovací grid interakcí z pohledu zvoleného MV. | [G043](03_gui_model.md#gui-G043), [G044](03_gui_model.md#gui-G044) |
| 2 | Uživatel klikne **Přidat IER** v toolbaru gridu. | [G044](03_gui_model.md#gui-G044) |
| 3 | Systém otevře dialog Výběr IER; uživatel vybere jeden či více IER a potvrdí. | [G032](03_gui_model.md#gui-G032) |
| 4 | Vybrané IER se zobrazí jako kořenové uzly stromu. | [G044](03_gui_model.md#gui-G044) |
| 5 | Uživatel na IER uzlu zvolí **Přidat interakce MV**. | [G044](03_gui_model.md#gui-G044) |
| 6 | Systém otevře dialog Konfigurace interakcí MV. | [G054](03_gui_model.md#gui-G054) |
| 7 | Uživatel zvolí cílové MV a u TIN řádků zaškrtá role Konzument / Poskytovatel a nastaví operační tempo (PACE). | [G054](03_gui_model.md#gui-G054), [G055](03_gui_model.md#gui-G055) |
| 8 | Uživatel klikne **ULOŽIT**. | [G054](03_gui_model.md#gui-G054) |
| 9 | Pod IER se zobrazí uzel cílového MV a pod ním TIN uzly; systém promítne změny – `POST` přibylých a `DELETE` odebraných interakcí. | [G044](03_gui_model.md#gui-G044) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Uživatel na MV uzlu zvolí **Upravit interakce MV** | Systém otevře [G054](03_gui_model.md#gui-G054) s předvyplněnou konfigurací; cílové MV je read-only. |
| 5b | Uživatel na IER uzlu zvolí **Smazat** | Po potvrzení systém odebere IER i všechny jeho interakce. |
| 5c | Uživatel na MV uzlu zvolí **Smazat** | Po potvrzení systém odebere interakce daného cílového MV. |
| 5d | Uživatel na uzlu zvolí **Graf sousedství** | Systém otevře graf sousedství prvku v ArchiRepo na nové záložce. |
| 7a | Není zaškrtnuta žádná role | Chybová hláška „Vyber alespoň jednu interakci". |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC030-1 | Plánuje se vždy z pohledu jednoho zvoleného MV (`pointOfViewCommandPost`). | 1 |
| P-UC030-2 | Mód plánování `COMMAND_POSTS` je v UI nedostupný (`disabled`); plánuje se v módu `CAPABILITIES`. | 1 |
| P-UC030-3 | Operační tempo (PACE) se nastavuje v dialogu [G054](03_gui_model.md#gui-G054); v plánovacím gridu [G044](03_gui_model.md#gui-G044) je jen pro čtení. | 7 |

**Koncové podmínky:** Interakce mise jsou aktualizovány.

---

<a id="uc-UC031"></a>
## UC031 – Spravovat velitelské vazby C2

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel definuje velitelské vazby mezi MV v misi dle NATO typologie. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR018](01_model_pozadavku.md#fr-FR018) |

**Vstupní podmínky:** Uživatel je v detailu mise, zvolil **Z pohledu MV** a je na záložce Velení a řízení.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí dva gridy: **Nadřízená MV** a **Podřízená MV** (vazby z pohledu zvoleného MV). | [G045](03_gui_model.md#gui-G045), [G046](03_gui_model.md#gui-G046) |
| 2 | Uživatel klikne **+** v toolbaru příslušného gridu. | [G046](03_gui_model.md#gui-G046) |
| 3 | Systém otevře dialog Nové vazby velení a řízení. | [G050](03_gui_model.md#gui-G050) |
| 4 | Uživatel zvolí jedno či více protějších MV a Typ vazby (FULLCOM/OPCOM/OPCON/TACOM/TACON/ADCON/LOGCON). | [G050](03_gui_model.md#gui-G050) |
| 5 | Uživatel klikne **VYTVOŘIT**. | [G050](03_gui_model.md#gui-G050) |
| 6 | Systém vytvoří C2 vazby – jednu na každé vybrané protější MV. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 1a | Uživatel klikne **Smazat** na řádku vazby | Po potvrzení systém smaže C2 vazbu (`DELETE`). |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC031-1 | Nadřízené ≠ Podřízené MV; cyklické vazby zakázány. | 6 |
| P-UC031-2 | Jednou stranou každé vazby je vždy MV pohledu (`pointOfViewCommandPost`); v dialogu je read-only. | 4 |

> Úprava typu existující vazby není v UI dostupná – C2 grid nabízí jen *Přidat* a *Smazat*. Endpoint `PATCH /missions/{id}/c2-relationships/{id}` v API existuje, ale žádná komponenta ho nevolá.

**Koncové podmínky:** C2 vazby mise jsou aktualizovány.

---

<a id="uc-UC032"></a>
## UC032 – Zobrazit graf mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá grafickou vizualizaci mise s uložitelným rozložením. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR019](01_model_pozadavku.md#fr-FR019) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **GRAF** na dlaždici aktivní mise. | [G040](03_gui_model.md#gui-G040) |
| 2 | Systém otevře graf mise. | [G051](03_gui_model.md#gui-G051) |
| 3 | Uživatel přepíná mezi pohledy: C2 / IER / IP / TIN / Společné a bojové funkce. | [G051](03_gui_model.md#gui-G051) |
| 4 | Volitelně zvýrazní prvky filtrem „Zvýraznit v grafu". | [G051](03_gui_model.md#gui-G051) |
| 5 | Uživatel přesouvá uzly grafu; systém ukládá rozložení automaticky (`PUT` layout). | — |

**Koncové podmínky:** Rozložení grafu je uloženo.

---

<a id="uc-UC033"></a>
## UC033 – Generovat CIS matici mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá CIS matici (matici minimálních požadavků na KIP) z pohledu zvoleného MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR020](01_model_pozadavku.md#fr-FR020) |

**Vstupní podmínky:** Uživatel je v plánovacím gridu interakcí (detail mise, záložka Interakce, zvolené MV pohledu).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **CIS matice** v toolbaru plánovacího gridu. | [G044](03_gui_model.md#gui-G044) |
| 2 | Systém otevře dialog CIS matice pro aktuální MV (pohled). | [G052](03_gui_model.md#gui-G052) |
| 3 | Systém zobrazí interaktivní matici. | [G052](03_gui_model.md#gui-G052) |
| 4 | Uživatel klikne **Stáhnout CIS matici**. | [G052](03_gui_model.md#gui-G052) |
| 5 | Systém volá `generateCisMatrixReport(missionId, commandPostId)` a vrátí XLSX. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 1a | Uživatel klikne **Stáhnout CIS matici** přímo v toolbaru gridu | Systém vygeneruje a stáhne XLSX bez otevření dialogu. |

**Koncové podmínky:** CIS matice je stažena.

---

<a id="uc-UC034"></a>
## UC034 – Generovat report mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá souhrnný report mise (PDF). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR021](01_model_pozadavku.md#fr-FR021) |

**Vstupní podmínky:** Aktér má ACL `canGenerateReport`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **REPORT** na dlaždici aktivní mise. | [G040](03_gui_model.md#gui-G040) |
| 2 | Systém otevře dialog Možnosti reportu mise. | [G053](03_gui_model.md#gui-G053) |
| 3 | Uživatel zvolí Variantu (BASIC/COMPLETE) a Klasifikaci (OFFICIAL/RESTRICTED). | [G053](03_gui_model.md#gui-G053) |
| 4 | Uživatel klikne **STÁHNOUT**. | [G053](03_gui_model.md#gui-G053) |
| 5 | Systém volá `generateMissionReport(id, options)` (jazyk dle jazyka aplikace) a vrátí PDF. | — |

**Koncové podmínky:** Report mise je stažen.
