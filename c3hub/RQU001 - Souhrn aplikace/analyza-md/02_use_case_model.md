# Use Case model

## Přehled UC

| ID | Název | Zdrojový FR | Vztah |
|---|---|---|---|
| UC001 | Navigovat z nástěnky na modul | [FR01](01_model_pozadavku.md#fr-FR01) | — |
| UC002 | Zobrazit uživatelský profil | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC003 | Změnit heslo | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC004 | Odhlásit se | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC005 | Přepnout jazyk rozhraní | [FR02](01_model_pozadavku.md#fr-FR02) | — |
| UC006 | Zobrazit notifikace patch requestů | [FR03](01_model_pozadavku.md#fr-FR03) | — |
| UC007 | Zobrazit panel novinek | [FR04](01_model_pozadavku.md#fr-FR04) | — |
| UC008 | Otevřít ArchiRepo | [FR05](01_model_pozadavku.md#fr-FR05) | — |
| UC009 | Nahlásit podnět do externího trackeru | [FR05](01_model_pozadavku.md#fr-FR05) | — |

UC diagram: [diagrams/uc_diagram.puml](diagrams/uc_diagram.puml)

---

<a id="uc-UC001"></a>
## UC001 – Navigovat z nástěnky na modul

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se z nástěnky dostane do požadovaného modulu aplikace. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR01](01_model_pozadavku.md#fr-FR01) |

**Vstupní podmínky:** Uživatel je přihlášen a je na nástěnce (`/web`).

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel vidí dva panely dlaždic (Formuláře SVŘ, Ostatní dokumenty). | [G001](03_gui_model.md#gui-G001) |
| 2 | Uživatel klikne na dlaždici modulu (nebo tlačítko ZOBRAZIT). | [G005](03_gui_model.md#gui-G005) |
| 3 | Systém naviguje na cílovou routu modulu (např. `/command-posts`). | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 2a | Dlaždice „C3 schopnosti" | Místo navigace stáhne PDF poster. |
| 2b | Dlaždice „Požadavky, chyby, náměty" | Otevře externí tracker (viz UC009). |

**Koncové podmínky:** Uživatel je v cílovém modulu.

---

<a id="uc-UC002"></a>
## UC002 – Zobrazit uživatelský profil

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel zobrazí informace o svém účtu. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na ikonu účtu v hlavním menu. | [G006](03_gui_model.md#gui-G006) |
| 2 | Systém otevře uživatelské menu. | [G007](03_gui_model.md#gui-G007) |
| 3 | Uživatel klikne **Profil**. | [G007](03_gui_model.md#gui-G007) |
| 4 | Systém zobrazí dialog s loginem, celým jménem a rolemi. | [G009](03_gui_model.md#gui-G009) |

**Koncové podmínky:** Profil je zobrazen.

---

<a id="uc-UC003"></a>
## UC003 – Změnit heslo

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel si změní přihlašovací heslo. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v uživatelském menu klikne **Změna hesla**. | [G007](03_gui_model.md#gui-G007) |
| 2 | Systém otevře dialog Změna hesla. | [G010](03_gui_model.md#gui-G010) |
| 3 | Uživatel vyplní stávající heslo, nové heslo a potvrzení. | [G010](03_gui_model.md#gui-G010) |
| 4 | Uživatel klikne **ULOŽIT**. | [G010](03_gui_model.md#gui-G010) |
| 5 | Systém změní heslo. | — |

### Alternativní scénáře

| ID | Podmínka | Reakce |
|---|---|---|
| 4a | Nové heslo a potvrzení se neshodují | Inline chyba, heslo se nezmění. |

**Koncové podmínky:** Heslo je změněno.

---

<a id="uc-UC004"></a>
## UC004 – Odhlásit se

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel ukončí svou relaci v aplikaci. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel v uživatelském menu klikne **Odhlášení**. | [G007](03_gui_model.md#gui-G007) |
| 2 | Systém zavolá `authClient.logout()` a ukončí relaci. | — |

**Koncové podmínky:** Uživatel je odhlášen.

---

<a id="uc-UC005"></a>
## UC005 – Přepnout jazyk rozhraní

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel změní jazyk uživatelského rozhraní (CZ / EN). |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR02](01_model_pozadavku.md#fr-FR02) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na ikonu jazyka v hlavním menu. | [G006](03_gui_model.md#gui-G006) |
| 2 | Systém zobrazí menu jazyků. | — |
| 3 | Uživatel zvolí jazyk (čeština / angličtina). | — |
| 4 | Systém přepne lokalizaci rozhraní. | — |

**Koncové podmínky:** Rozhraní je v novém jazyce.

---

<a id="uc-UC006"></a>
## UC006 – Zobrazit notifikace patch requestů

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Administrátor zjistí, kolik patch requestů modelu čeká na schválení. |
| **Aktér** | Administrátor |
| **Zdrojový požadavek** | [FR03](01_model_pozadavku.md#fr-FR03) |

**Vstupní podmínky:** Aktér má administrátorskou roli.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém v hlavním menu zobrazí ikonu notifikací s počtem čekajících patch requestů (`countRelationshipPatchRequests({state: REQUESTED})`). | [G006](03_gui_model.md#gui-G006) |
| 2 | Administrátor klikne na ikonu notifikací. | [G006](03_gui_model.md#gui-G006) |
| 3 | Systém otevře panel notifikací. | [G008](03_gui_model.md#gui-G008) |
| 4 | Administrátor klikne na notifikaci a systém naviguje na `/model/patch-requests`. | [G008](03_gui_model.md#gui-G008) |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC006-1 | Ikona notifikací je viditelná pouze pro administrátory. | 1 |

**Koncové podmínky:** Administrátor je na stránce patch requestů ([RQU004](../../RQU004%20-%20Model%20SVR%20domenove%20entity/analyza-md/03_gui_model.md#gui-G012)).

---

<a id="uc-UC007"></a>
## UC007 – Zobrazit panel novinek

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel se informuje o aktuálním dění v aplikaci. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR04](01_model_pozadavku.md#fr-FR04) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Systém na nástěnce zobrazí panel novinek s lokací `DASHBOARD`. | [G002](03_gui_model.md#gui-G002) |
| 2 | Uživatel si přečte novinky. | — |

**Koncové podmínky:** Uživatel je informován. Správa novinek viz [RQU008](../../RQU008%20-%20Provozni%20formulare/analyza-md/README.md).

---

<a id="uc-UC008"></a>
## UC008 – Otevřít ArchiRepo

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Administrátor otevře externí repozitář modelu ArchiRepo. |
| **Aktér** | Administrátor |
| **Zdrojový požadavek** | [FR05](01_model_pozadavku.md#fr-FR05) |

**Vstupní podmínky:** Aktér má administrátorskou roli.

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Administrátor klikne na ikonu ArchiRepo v hlavním menu. | [G006](03_gui_model.md#gui-G006) |
| 2 | Systém zavolá `archiRepoUrlResolver.resolveMainPageUrl()` a otevře ArchiRepo v novém okně. | — |

**Koncové podmínky:** ArchiRepo je otevřeno.

---

<a id="uc-UC009"></a>
## UC009 – Nahlásit podnět do externího trackeru

| Vlastnost | Hodnota |
|---|---|
| **Cíl** | Uživatel nahlásí požadavek, chybu nebo námět přes externí tracker. |
| **Aktér** | Uživatel |
| **Zdrojový požadavek** | [FR05](01_model_pozadavku.md#fr-FR05) |

### Hlavní scénář

| # | Krok | Uses |
|---|---|---|
| 1 | Uživatel klikne na dlaždici **„Požadavky, chyby, náměty"** na nástěnce (akce NOVÝ). | [G005](03_gui_model.md#gui-G005) |
| 2 | Systém zavolá `trackerUrlResolver.resolveAddSupportTaskUrl()` a otevře v novém okně externí formulář trackeru (projekt `SUPPORT`, typ úkolu `SUPPORT`). | — |

### Pravidla (Constraints)

| ID | Pravidlo | Krok |
|---|---|---|
| P-UC009-1 | COCO otevírá vždy jeden pevný formulář externího trackeru. Rozlišení typu podnětu (požadavek / chyba / námět) probíhá až uvnitř trackeru, mimo rozsah COCO – proto jde o jediný Use Case, ne kombinovaný. | 2 |

**Koncové podmínky:** Externí formulář pro hlášení je otevřen.

> **Verze: RQU001** – UC009 přejmenován z „Nahlásit požadavek / chybu / námět" na „Nahlásit podnět do externího trackeru". Audit `AUDIT-uc-split-2026-05-19.md` označil UC za kandidáta na rozdělení na UC009a/b/c kvůli „/" v názvu; ověření proti zdroji COCO (`DashboardPage.openRequirementUrlPage()`, `TrackerUrlResolver.resolveAddSupportTaskUrl()`) ale prokázalo jediný atomický tok – jedna funkce, jedna pevná URL (`newtask/?projectIdent=SUPPORT&taskTypeIdent=SUPPORT`), žádné větvení podle typu. Split-signál byl heuristický false positive; místo rozdělení odstraněno kombinatorické „/" z názvu. Anchor ID `uc-UC009` zachováno (metodika kap. 6.1). Doplněno pravidlo P-UC009-1.
