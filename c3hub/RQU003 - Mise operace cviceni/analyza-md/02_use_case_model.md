# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Zobrazit přehled misí | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Vytvořit novou misi | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Editovat detail mise | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC004 | Duplikovat misi | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC005 | Zneplatnit misi | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC006 | Obnovit zneplatněnou misi | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC008 | Plánovat informační interakce mise | [FR05](01_model_pozadavku.md#fr-FR05) | — |
| UC009 | Spravovat velitelské vazby C2 | [FR06](01_model_pozadavku.md#fr-FR06) | — |
| UC010 | Zobrazit graf mise | [FR07](01_model_pozadavku.md#fr-FR07) | — |
| UC011 | Generovat CIS matici mise | [FR08](01_model_pozadavku.md#fr-FR08) | — |
| UC012 | Generovat report mise | [FR09](01_model_pozadavku.md#fr-FR09) | — |

> **Verze: RQU003** – UC007 „Smazat misi" zrušen (revize proti zdroji COCO). Endpoint `DELETE /missions/{id}` i ACL `canDelete` v API existují, ale **žádné UI je nevyvolává** – mazání mise není v aplikaci dostupné. Číslování zbývajících UC zachováno (UC008–UC012) kvůli stabilitě anchor ID. Viz `README.md` → Otevřené otázky.

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Zobrazit přehled misí

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá přehled všech misí rozdělených na aktivní a zneplatněné. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je v modulu Mise (`/web/missions`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém načte všechny mise (`findAll`). | — |
| 2 | Systém rozdělí mise na aktivní (`invalidated = false`) a zneplatněné a seřadí je. | — |
| 3 | Systém zobrazí panel „Mise" (aktivní) a – existují-li – panel „Zneplatněné mise". | [G001](03_gui_model.md#gui-G001) |
| 4 | Každá mise je dlaždice s názvem, popisem a akcemi. | [G002](03_gui_model.md#gui-G002) |

**Koncové podmínky:** Přehled misí je zobrazen.

---

<a id="uc-UC002"></a>
## UC002 – Vytvořit novou misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel založí novou misi / operaci / cvičení. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **+ Přidat** v záhlaví panelu „Mise". | [G001](03_gui_model.md#gui-G001) |
| 2 | Systém otevře dialog Vytvoření mise. | [G003](03_gui_model.md#gui-G003) |
| 3 | Uživatel vyplní Název, Vlastnické MV a Druhy mise (multi-select), volitelně Popis. | [G003](03_gui_model.md#gui-G003) |
| 4 | Uživatel klikne **VYTVOŘIT**. | [G003](03_gui_model.md#gui-G003) |
| 5 | Systém validuje povinná pole, volá `POST /missions` a zavře dialog. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Uživatel zavře dialog (křížek) | Systém zavře dialog bez uložení. |
| 5a | Chybí povinné pole | Inline chyba „Pole je povinné". |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC002-1 | Povinné: Název, Vlastnické MV, alespoň jeden Druh mise. | 5 |

**Koncové podmínky:** Nová mise je v evidenci (aktivní).

---

<a id="uc-UC003"></a>
## UC003 – Editovat detail mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel upraví základní údaje existující mise. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

**Vstupní podmínky:** Mise existuje, aktér má ACL `canUpdate`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel otevře detail mise (klik na dlaždici nebo tlačítko UPRAVIT). | [G002](03_gui_model.md#gui-G002), [G004](03_gui_model.md#gui-G004) |
| 2 | Uživatel klikne ikonu tužky v sekci Detaily. | [G004](03_gui_model.md#gui-G004) |
| 3 | Systém otevře dialog Editace detailu mise s předvyplněnými hodnotami. | [G009](03_gui_model.md#gui-G009) |
| 4 | Uživatel upraví Název / Vlastnické MV / Druhy mise / Popis. | [G009](03_gui_model.md#gui-G009) |
| 5 | Uživatel klikne **ULOŽIT**. | [G009](03_gui_model.md#gui-G009) |
| 6 | Systém validuje a volá `PUT /missions/{id}`. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 6a | Chybí povinné pole | Inline chyba u pole. |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC003-1 | Povinné: Název, Vlastnické MV, alespoň jeden Druh mise. | 6 |

**Koncové podmínky:** Mise je aktualizována.

---

<a id="uc-UC004"></a>
## UC004 – Duplikovat misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel rychle vytvoří kopii mise jako šablonu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Uživatel má otevřený detail mise.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **DUPLIKOVAT** v patičce detailu mise. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře dialog Duplikace mise. | [G010](03_gui_model.md#gui-G010) |
| 3 | Uživatel zadá Název nové mise. | [G010](03_gui_model.md#gui-G010) |
| 4 | Uživatel klikne **DUPLIKOVAT**. | [G010](03_gui_model.md#gui-G010) |
| 5 | Systém volá `POST /missions/{id}:duplicate` a vytvoří kopii. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Název nové mise je shodný s originálem | Inline chyba „Název se musí lišit od originálu". |

**Koncové podmínky:** Kopie mise je v evidenci.

---

<a id="uc-UC005"></a>
## UC005 – Zneplatnit misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel přesune misi mezi zneplatněné (zachová data). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Mise je aktivní, aktér má ACL `canInvalidate`, má otevřený detail mise.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **ZNEPLATNIT** v patičce detailu mise. | [G004](03_gui_model.md#gui-G004) |
| 2 | Systém otevře potvrzovací dialog. | [G011](03_gui_model.md#gui-G011) |
| 3 | Uživatel potvrdí. | [G011](03_gui_model.md#gui-G011) |
| 4 | Systém volá `POST /missions/{id}:invalidate`, zaznamená `invalidatedBy`/`invalidatedAt`, zavře detail. | — |
| 5 | Mise se přesune do panelu „Zneplatněné mise". | [G001](03_gui_model.md#gui-G001) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 3a | Uživatel klikne STORNO | Systém zavře potvrzovací dialog bez akce. |

**Koncové podmínky:** Mise je zneplatněná.

---

<a id="uc-UC006"></a>
## UC006 – Obnovit zneplatněnou misi

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel vrátí zneplatněnou misi mezi aktivní. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

**Vstupní podmínky:** Mise je zneplatněná, aktér má ACL `canRestore`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **OBNOVIT** na dlaždici zneplatněné mise. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém zobrazí potvrzení obnovení. | — |
| 3 | Uživatel potvrdí. | — |
| 4 | Systém volá `POST /missions/{id}:restore`, zaznamená `restoredBy`/`restoredAt`. | — |
| 5 | Mise se přesune do panelu „Mise" (aktivní). | [G001](03_gui_model.md#gui-G001) |

**Koncové podmínky:** Mise je aktivní.

---

<a id="uc-UC008"></a>
## UC008 – Plánovat informační interakce mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel definuje informační interakce mezi MV v rámci mise – které IER/TIN toky probíhají mezi kterými MV a s jakým operačním tempem (PACE). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR05](01_model_pozadavku.md#fr-FR05) |

**Vstupní podmínky:** Uživatel je v detailu mise, zvolil **Z pohledu MV** a je na záložce Interakce.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí stromový plánovací grid interakcí z pohledu zvoleného MV. | [G005](03_gui_model.md#gui-G005), [G006](03_gui_model.md#gui-G006) |
| 2 | Uživatel klikne **Přidat IER** v toolbaru gridu. | [G006](03_gui_model.md#gui-G006) |
| 3 | Systém otevře dialog Výběr IER; uživatel vybere jeden či více IER a potvrdí. | [G016](03_gui_model.md#gui-G016) |
| 4 | Vybrané IER se zobrazí jako kořenové uzly stromu. | [G006](03_gui_model.md#gui-G006) |
| 5 | Uživatel na IER uzlu zvolí **Přidat interakce MV**. | [G006](03_gui_model.md#gui-G006) |
| 6 | Systém otevře dialog Konfigurace interakcí MV. | [G017](03_gui_model.md#gui-G017) |
| 7 | Uživatel zvolí cílové MV a u TIN řádků zaškrtá role Konzument / Poskytovatel a nastaví operační tempo (PACE). | [G017](03_gui_model.md#gui-G017), [G018](03_gui_model.md#gui-G018) |
| 8 | Uživatel klikne **ULOŽIT**. | [G017](03_gui_model.md#gui-G017) |
| 9 | Pod IER se zobrazí uzel cílového MV a pod ním TIN uzly; systém promítne změny – `POST` přibylých a `DELETE` odebraných interakcí. | [G006](03_gui_model.md#gui-G006) |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 5a | Uživatel na MV uzlu zvolí **Upravit interakce MV** | Systém otevře [G017](03_gui_model.md#gui-G017) s předvyplněnou konfigurací; cílové MV je read-only. |
| 5b | Uživatel na IER uzlu zvolí **Smazat** | Po potvrzení systém odebere IER i všechny jeho interakce. |
| 5c | Uživatel na MV uzlu zvolí **Smazat** | Po potvrzení systém odebere interakce daného cílového MV. |
| 5d | Uživatel na uzlu zvolí **Graf sousedství** | Systém otevře graf sousedství prvku v ArchiRepo na nové záložce. |
| 7a | Není zaškrtnuta žádná role | Chybová hláška „Vyber alespoň jednu interakci". |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC008-1 | Plánuje se vždy z pohledu jednoho zvoleného MV (`pointOfViewCommandPost`). | 1 |
| P-UC008-2 | Mód plánování `COMMAND_POSTS` je v UI nedostupný (`disabled`); plánuje se v módu `CAPABILITIES`. | 1 |
| P-UC008-3 | Operační tempo (PACE) se nastavuje v dialogu [G017](03_gui_model.md#gui-G017); v plánovacím gridu [G006](03_gui_model.md#gui-G006) je jen pro čtení. | 7 |

**Koncové podmínky:** Interakce mise jsou aktualizovány.

---

<a id="uc-UC009"></a>
## UC009 – Spravovat velitelské vazby C2

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel definuje velitelské vazby mezi MV v misi dle NATO typologie. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR06](01_model_pozadavku.md#fr-FR06) |

**Vstupní podmínky:** Uživatel je v detailu mise, zvolil **Z pohledu MV** a je na záložce Velení a řízení.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém zobrazí dva gridy: **Nadřízená MV** a **Podřízená MV** (vazby z pohledu zvoleného MV). | [G007](03_gui_model.md#gui-G007), [G008](03_gui_model.md#gui-G008) |
| 2 | Uživatel klikne **+** v toolbaru příslušného gridu. | [G008](03_gui_model.md#gui-G008) |
| 3 | Systém otevře dialog Nové vazby velení a řízení. | [G012](03_gui_model.md#gui-G012) |
| 4 | Uživatel zvolí jedno či více protějších MV a Typ vazby (FULLCOM/OPCOM/OPCON/TACOM/TACON/ADCON/LOGCON). | [G012](03_gui_model.md#gui-G012) |
| 5 | Uživatel klikne **VYTVOŘIT**. | [G012](03_gui_model.md#gui-G012) |
| 6 | Systém vytvoří C2 vazby – jednu na každé vybrané protější MV. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 1a | Uživatel klikne **Smazat** na řádku vazby | Po potvrzení systém smaže C2 vazbu (`DELETE`). |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC009-1 | Nadřízené ≠ Podřízené MV; cyklické vazby zakázány. | 6 |
| P-UC009-2 | Jednou stranou každé vazby je vždy MV pohledu (`pointOfViewCommandPost`); v dialogu je read-only. | 4 |

> Úprava typu existující vazby není v UI dostupná – C2 grid nabízí jen *Přidat* a *Smazat*. Endpoint `PATCH /missions/{id}/c2-relationships/{id}` v API existuje, ale žádná komponenta ho nevolá.

**Koncové podmínky:** C2 vazby mise jsou aktualizovány.

---

<a id="uc-UC010"></a>
## UC010 – Zobrazit graf mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá grafickou vizualizaci mise s uložitelným rozložením. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR07](01_model_pozadavku.md#fr-FR07) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **GRAF** na dlaždici aktivní mise. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém otevře graf mise. | [G013](03_gui_model.md#gui-G013) |
| 3 | Uživatel přepíná mezi pohledy: C2 / IER / IP / TIN / Společné a bojové funkce. | [G013](03_gui_model.md#gui-G013) |
| 4 | Volitelně zvýrazní prvky filtrem „Zvýraznit v grafu". | [G013](03_gui_model.md#gui-G013) |
| 5 | Uživatel přesouvá uzly grafu; systém ukládá rozložení automaticky (`PUT` layout). | — |

**Koncové podmínky:** Rozložení grafu je uloženo.

---

<a id="uc-UC011"></a>
## UC011 – Generovat CIS matici mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá CIS matici (matici minimálních požadavků na KIP) z pohledu zvoleného MV. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR08](01_model_pozadavku.md#fr-FR08) |

**Vstupní podmínky:** Uživatel je v plánovacím gridu interakcí (detail mise, záložka Interakce, zvolené MV pohledu).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **CIS matice** v toolbaru plánovacího gridu. | [G006](03_gui_model.md#gui-G006) |
| 2 | Systém otevře dialog CIS matice pro aktuální MV (pohled). | [G014](03_gui_model.md#gui-G014) |
| 3 | Systém zobrazí interaktivní matici. | [G014](03_gui_model.md#gui-G014) |
| 4 | Uživatel klikne **Stáhnout CIS matici**. | [G014](03_gui_model.md#gui-G014) |
| 5 | Systém volá `generateCisMatrixReport(missionId, commandPostId)` a vrátí XLSX. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 1a | Uživatel klikne **Stáhnout CIS matici** přímo v toolbaru gridu | Systém vygeneruje a stáhne XLSX bez otevření dialogu. |

**Koncové podmínky:** CIS matice je stažena.

---

<a id="uc-UC012"></a>
## UC012 – Generovat report mise

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel získá souhrnný report mise (PDF). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR09](01_model_pozadavku.md#fr-FR09) |

**Vstupní podmínky:** Aktér má ACL `canGenerateReport`.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne **REPORT** na dlaždici aktivní mise. | [G002](03_gui_model.md#gui-G002) |
| 2 | Systém otevře dialog Možnosti reportu mise. | [G015](03_gui_model.md#gui-G015) |
| 3 | Uživatel zvolí Variantu (BASIC/COMPLETE) a Klasifikaci (OFFICIAL/RESTRICTED). | [G015](03_gui_model.md#gui-G015) |
| 4 | Uživatel klikne **STÁHNOUT**. | [G015](03_gui_model.md#gui-G015) |
| 5 | Systém volá `generateMissionReport(id, options)` (jazyk dle jazyka aplikace) a vrátí PDF. | — |

**Koncové podmínky:** Report mise je stažen.
