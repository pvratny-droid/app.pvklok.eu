# DSZEZ – Designový předpis projektu

Sdílená designová vrstva pro **všechny HTML prototypy projektu DSZEZ** (Digitální schvalování
zkoušek EZ). Předpis vznikl **reverse-engineeringem reálné aplikace** CEPS DSZ-EZ – produkční
React SPA běžící na `http://localhost:8080/`. Komponentní třídy `.inw-*` jsou převzaty 1:1
z designového systému aplikace (zbavené hashů CSS Modules); barvy a rozměry jsou vytaženy ze
zkompilovaného CSS aplikace a převedeny na tokeny `--dsz-*`.

Cíl: každý prototyp k analýzám DSZEZ vypadá jako skutečná aplikace.

> **Závaznost:** Před tvorbou nebo úpravou jakéhokoli prototypu DSZEZ si přečti tento soubor
> a prototyp tvoř striktně podle něj – používej existující tokeny, komponenty a render utility,
> ne vlastní. Viz `CLAUDE.md` `<rules>` bod 7.

---

## Co je v adresáři

| Soubor | Obsah |
|---|---|
| `dszez-styles.css` | Design tokeny (`:root` → `--dsz-*`), reset, typografie a komponentní třídy `.inw-*` (topbar, navigace, hlavička stránky, tlačítka, formuláře, tabulky, karty, modály, odznaky, stavy, záložky, timeline, hlášky). |
| `dszez-utils.js` | Čisté utility funkce na objektu `DSZEZ` – formátování data/času (česky), `escapeHtml`, `nl2br`, `slugify`, `truncate`, `initials`, `faIcon` (mapování ikon), `statusClass`, DOM helpery `$`/`$$`/`el`. |
| `dszez-renderers.js` | Render funkce komponent na objektu `DSZEZ` (vrací HTML string) – `renderTopbar`, `renderPageHeader`, `button`, `renderField`, `renderCard`, `renderDataGrid`, `renderModal`, `renderBadge`, `renderStatus`, `renderTabs`, `renderKv`, `renderTimeline` + `bindAll`. |
| `fonts/` | Self-hostovaný firemní font **Frutiger** (`Light` 300, `Roman` 400, `Bold` 700) převzatý z aplikace. |

---

## Jak prototyp napojit

Prototyp je `src/DSZEZ/<RQU### – …>/prototype-*.html` (vedle adresáře `analyza-md/`).
Do `<head>` vlož:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="../_design/dszez-styles.css">
<script src="../_design/dszez-utils.js"></script>
<script src="../_design/dszez-renderers.js"></script>
```

- Font **Frutiger** se načítá automaticky z `_design/fonts/` přes `@font-face` v `dszez-styles.css`
  – prototyp je tak offline a věrný aplikaci. Bez Frutigeru se použije fallback
  `Segoe UI, Helvetica Neue, Arial, sans-serif`.
- Ikony: **Font Awesome 6** z CDN. Aplikace používá inline SVG; prototypy standardizují na FA6.
- Po vykreslení komponent zavolej `DSZEZ.bindAll()` – naváže collapse karet, zavírání modálů
  a přepínání záložek.

---

## Designové konvence (závazné)

### a) Barevná paleta a tokeny

Barvy se používají **vždy přes CSS proměnné `--dsz-*`**, nikdy inline hex.

- **Primární barva** `--dsz-primary` `#bf2a34` (ČEPS červená) – hlavní akce, aktivní stavy,
  akcenty, focus ring. Hover `--dsz-primary-hover` `#9a1d26`, tmavá `--dsz-primary-dark` `#7d1820`.
- **Pozadí stránky** `--dsz-bg` `#f8f9fa`, povrch komponent `--dsz-surface` `#fff`,
  jemné podklady `--dsz-bg-soft` `#f2f4f5`.
- **Text** `--dsz-text` `#212529`, sekundární `--dsz-text-muted` `#6c757d`.
- **Ohraničení** `--dsz-border` `#dee2e6`, silnější `--dsz-border-strong` `#adb5bd`.
- **Semantické**: `--dsz-success` `#198754`, `--dsz-danger` `#b91c1c`, `--dsz-warning` `#b5691c`,
  každá s odpovídajícím tintem.

> **Pozn.:** favicon aplikace je fialový (placeholder z Vite šablony). Závazná primární barva
> projektu je červená `#bf2a34` – dominantní barva ve zkompilovaném CSS aplikace.

### b) Typografie

Celá aplikace běží na **Frutiger** (`--dsz-font`), základní velikost **14 px**, řádkování 1.5.
Nadpisy `font-weight: 600`. Sekundární a popisné texty 12–13 px, barva `--dsz-text-muted`.
Monospace (`--dsz-font-mono`, Consolas) jen pro kódy a technické identifikátory.

### c) Layout stránky

- **Aplikační shell**: sticky topbar (`.inw-topbar`, výška 64 px, bílá, červený náznak stínu)
  s brandem, pilulkovou navigací (`.inw-nav`) a uživatelským chipem (`.inw-user-chip`);
  obsah v `.inw-content` na šedém pozadí.
- **Stránka**: `.inw-page` (sloupec, `max-width` 1200–1280 px, centrovaná, padding 24 px).
- **Hlavička stránky** `.inw-page-header` – drobečky (`.inw-page-header-crumbs`), `h1` 28 px,
  podtitulek, akce vpravo; pod hlavičkou **červený akcentový pruh** (`::after`, 56×3 px).

### d) Tlačítka

Jedno tlačítko = `.inw-btn` + varianta. Hover u plných variant lehce nadzdvihne (`translateY(-1px)`).

| Varianta | Použití |
|---|---|
| `inw-btn--primary` / `--accent` | Hlavní akce (Podat žádost, Uložit) |
| `inw-btn--secondary` | Vedlejší akce (bílé, šedý okraj) |
| `inw-btn--outline-primary` | Vedlejší akce s důrazem (orámované) |
| `inw-btn--ghost` | Nenápadná akce, akce v řádku gridu |
| `inw-btn--success` | Potvrzení (Schválit) |
| `inw-btn--danger` / `--outline-danger` | Destruktivní / zamítavá akce (Zamítnout) |

Velikosti: `inw-btn--sm`, výchozí, `inw-btn--lg`.

### e) Formulářová pole

`.inw-form` / `.inw-form-grid` je mřížka 1fr 1fr; `.inw-field` je sloupec label + vstup,
`.inw-field-full` zabírá celou šířku. Vstupy mají `--dsz-border`, na `:focus` červený okraj
a focus ring `--dsz-focus-ring`. Povinné pole: badge `.inw-req`. Chybný stav: `.inw-field--invalid`.
Hint pod polem: `.inw-hint`. Checkbox: `.inw-checkbox`.

### f) Tabulky a grid

`.inw-table` v obalu `.inw-table-wrap`; hlavička `thead` velkými písmeny na `--dsz-bg-thead`,
řádky s hover. **Sloupec „Akce" je v gridu VŽDY první** (`.inw-th-actions` / `.inw-td-actions`)
– shodně s konvencí projektů RIV a C3HUB. Akce v řádku jsou `inw-btn inw-btn--ghost inw-btn--sm`.
Nad gridem **rám**: `.inw-toolbar` (filtry, vyhledávání), pod ním `.inw-pagination` (počet záznamů).
Prázdný stav: `.inw-state`.

### g) Karty a sekce

- `.inw-section` – jednoduchý bílý ohraničený box (mapuje «Form area»).
- `.inw-card` s `.inw-card-header` (gradient) / `.inw-card-body` / `.inw-card-footer` –
  panel s titulkem; volitelně **sbalitelný** (`.inw-card-toggle`, třída `.collapsed`).
- `.inw-record-card` – záznamová karta s červeným levým pruhem (položka v seznamu).

### h) Modály

`.inw-modal-backdrop` (tmavé překrytí) → `.inw-modal` (`--sm` / výchozí / `--lg`) se strukturou
`.inw-modal-head` (gradient, titulek, `.inw-modal-close`) / `.inw-modal-body` / `.inw-modal-footer`.
Otevírání/zavírání přes `DSZEZ.openModal(id)` / `closeModal(id)`; klik mimo dialog zavírá.

### i) Odznaky a stavy

- `.inw-badge` – obecný štítek (pilulka), varianty `--ok` / `--warn` / `--error` / `--info` /
  `--muted` / `--external` / `--internal`.
- `.inw-status` – **stavový chip workflow** s barevnou tečkou; varianty `--pending`, `--progress`,
  `--waiting`, `--approved`, `--rejected`, `--skipped`. Klíče stavů a popisky viz `DSZEZ.STATUS_MAP`.

### j) Timeline schvalovacího workflow

`.inw-timeline` je signaturní komponenta DSZEZ – svislá osa kroků schvalování. Každý krok
(`.inw-timeline-step--<stav>`) má barevnou tečku dle stavu, titulek, roli, meta a komentář;
delegace na podpůrný útvar se zobrazují jako vnořený box s jantarovým pruhem
(`.inw-timeline-delegation`). Render: `DSZEZ.renderTimeline({ steps:[…] })`.

### k) Ikony

Font Awesome 6 (`solid`). Ikony se získávají přes `DSZEZ.faIcon(name)` / `DSZEZ.iconHTML(name)` –
mapování sémantických názvů je v `DSZEZ.icons`. **Jedna ikona = jeden význam** napříč projektem
(`add` = přidat, `delegate` = delegovat, `approve` = schválit, `reject` = zamítnout …).

### l) Layout, mezery, rádiusy, stíny

- **Spacing** na 4px gridu: `--dsz-space-1..6` (4 / 8 / 12 / 16 / 24 / 32 px).
- **Rádius**: `--dsz-radius` 4 px (tlačítka, pole, drobné prvky), `--dsz-radius-lg` 8 px
  (karty, panely, modály), `--dsz-radius-pill` 999 px (odznaky, chipy).
- **Stíny**: `--dsz-shadow-sm` / `-card` / `-pop` / `-modal`; focus `--dsz-focus-ring`.
- **Přechody**: `--dsz-transition` (.14 s ease).

---

## Verzování a odchylky

- Předpis je závazný pro **nově vznikající a upravované** prototypy; již archivované zůstávají beze změny.
- Odchylku potřebnou jen pro jednu RQU řeš **lokálním `<style>`** přímo v prototypu, ne forkem `_design/`.
- Pokud se stejná odchylka objeví u 3+ prototypů, povýši ji na variantu komponenty v `_design/`.
- Při zásadní změně tokenů/komponent verzuj soubor (`dszez-styles.v2.css`) a starou verzi ponech.

## Doplňování konvencí

Když při tvorbě prototypu zjistíš novou opakovaně použitelnou konvenci, **doplň ji sem** do
sekce *Designové konvence (závazné)*. Konvence musí být obecná (princip + důvod), doložená
(odkaz na prototyp nebo zdroj v aplikaci) a závazná (ne doporučení).
