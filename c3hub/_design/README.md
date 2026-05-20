# C3HUB – Designový předpis projektu

Sdílený design layer pro všechny prototypy projektu **C3 HUB / COCO** (`src/C3HUB/`). Každý nový prototyp v C3HUB (`RQU###/prototype-*.html`, případně `NRQ###/...`) tento předpis přebírá a tvoří v souladu s ním.

> **AI agent / Claude Code:** Před tvorbou *nebo* úpravou HTML prototypu v `src/C3HUB/` si tento dokument **vždy** přečti a postupuj podle něj. Pravidlo je zakotveno v rootu projektu v `CLAUDE.md`, sekce `<rules>` bod 7 a `<workflow>` krok 2.

> **Zdroj pravdy:** Tokeny, barvy a komponenty jsou odvozeny **reverse-engineeringem** z reálné aplikace COCO (`d:\OneDrive - Petr Vratný\GitClone\C3HUB\coco\web-app\`) – viz `App.css` (CSS proměnné `--coco-color-*`), `src/theme/CocoTheme.ts` (MUI palette), `src/theme/Colors.ts` (akcentové barvy pro kartičky), `src/common/page/Page.tsx` (typografie, layout) a komponenty v `src/component/card`, `src/component/table`, `src/common/dialog`. Aplikace je React + MUI + Roboto.

## Co je v adresáři

| Soubor | Účel |
|---|---|
| `c3hub-styles.css` | Design tokeny (`--coco-color-*` + sjednocené `--c3-*` aliasy), typografie Roboto, komponenty (page header / breadcrumbs, card-panel se sbalitelnou modrou hlavičkou, simple-card s barevným blokem, button, datagrid se zebrou, dialog, language switch, notif-panel). |
| `c3hub-utils.js` | Čisté utility funkce (`formatDate`, `escapeHtml`, `formatLoginWithFullName`, `cardColorMap`, `initials`, …). |
| `c3hub-renderers.js` | DOM renderery komponent (simple-card, card-panel, datagrid řádek, breadcrumb, notif-item, language-menu). |

## Jak prototyp napojit

Z `src/C3HUB/<RQU###>/prototype-*.html` (o úroveň níž) přidej do `<head>` a před vlastní `<script>` blok:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="../_design/c3hub-styles.css">
<script src="../_design/c3hub-utils.js"></script>
<script src="../_design/c3hub-renderers.js"></script>
```

## Designové konvence (závazné)

Tyto konvence jsou psané jako **obecná designová pravidla** sdílená napříč prototypy projektu – záměrně popisují *principy a vzory*, ne konkrétní artefakty.

### Barevná paleta a tokeny

**Princip:** Barvy se používají *vždy* přes CSS proměnné, nikdy inline hex. Paleta vychází z GOV design systému (modrá `#2362a2` jako primary, šedé tóny, signální zelená/žlutá/červená).

- **Primary**: `--coco-color-blue` `#2362a2` – odkazy, hlavičky panelů, aktivní stav v breadcrumb, primární tlačítka.
- **Page background**: `--coco-color-grey-bg` `#f5f5f5`.
- **Text**: `--coco-color-grey-dark` `#3b3b3b` (primární) / `--coco-color-grey-mid` `#686868` (sekundární).
- **Card akcent barvy** (pro `simple-card` s barevným blokem): jména přes `Colors.ts` (VIOLET, ORANGE, TEAL, YELLOW, RED_LIGHT_DARK, TURQUOISE, …). Karta s `color="orange"` apod. – mapování je v `c3hub-utils.js` (`cardColorMap`).
- **Signální**: `--coco-color-success` `#6fbd2c`, `--coco-color-error` `#c52a3a`, `--coco-color-yellow` `#ecae1a`.

### Typografie

**Princip:** Celá aplikace běží na **Roboto** (Google Fonts) s fallbackem `Helvetica, Arial, sans-serif`. Základní velikost `0.9375rem` (15px), `letter-spacing: 0.0125em`, `font-weight: 400`. Tučné texty `font-weight: 700`. Jiné fonty (Red Hat Display z RIV apod.) se v C3HUB **nepoužívají**.

### Layout stránky

**Princip:** Stránka má fixní horní `MainHeader` (modrý AppBar) + breadcrumbs + obsah na šedém pozadí. Postraní menu se v COCO standardně **nepoužívá** – navigace je přes dashboard tiles a breadcrumbs.

- Page container: `padding: 0 30px`, `background: var(--coco-color-grey-bg)`, font 0.9375rem.
- Header (`MainHeader`): tmavě modrá lišta `var(--coco-color-blue)`, výška ~56px, vpravo: ArchiRepo ikona (jen admin), notifikační ikona s badge (jen admin), jazyk (CZ/EN), uživatel + AccountCircle.
- Pod header je sekce `breadcrumbs` (Home ikona vlevo, separátor „/"), aktivní položka má bílý text na modrém pozadí (chip-style).

### Card panel se sbalitelnou hlavičkou

**Princip:** Hlavní seskupení obsahu na dashboardu i v detailech je **`card-panel`** – `Paper` se zvýrazněnou modrou hlavičkou a sbalitelným tělem. V hlavičce je tučný titulek (`h6`) a vpravo `chevron` pro toggle expand/collapse.

- Header background: `var(--coco-color-blue)`, text bílý, padding `12px 24px`.
- Body: bílé pozadí, `padding: 24px`, mezera mezi panely `margin-bottom: 32px`.
- Sbalovací logika: třída `.c3-card-panel.collapsed > .c3-card-panel-body { display:none; }`, chevron rotuje.

### Simple-card (kartička s barevným blokem)

**Princip:** Dlaždice na dashboardu mají **vlevo/nahoře titul**, pod ním **barevný blok s velkým textem** (label karty, opacity 0.7, dekorativní kruhy), pak **popis (max 4 řádky s ellipsis)**, dole **action area** s primárním tlačítkem („Zobrazit", „Stáhnout PDF", …).

- Border-radius `8px` (2× theme.shape.borderRadius), shadow `theme.shadows[6]`, hover: `translateY(-4px) + shadows[12]`.
- 4 karty na řádek na desktopu (`CARDS_PER_ROW = 4`), responsive grid.
- Barva bloku jde z `color="violet|orange|teal|yellow|red-light-dark|turquoise|..."` přes mapování v `c3hub-utils.js`.
- Disabled stav: 2px dashed outline, grayscale filter.

### Tree grid (RTree / TREE_DATA_GROUP_FIELD)

**Princip:** Tabulka se stromovou hierarchií. Sloupec typu „tree-label" zobrazuje chevron + textový label + volitelně počet potomků v závorce. Klik na chevron rozbalí/sbalí potomky.

- Renderer: `C3Hub.renderTreeGridHTML(props)` (v `c3hub-renderers.js`). Datové řádky jsou flat-pole; hierarchie odvozena z `getParentId(row)`. Renderer si dopočítá `data-tree-level` na řádek a vykreslí chevron jen u uzlů s potomky.
- Toolbar: `C3Hub.renderTreeToolbarHTML({expandLabel, collapseLabel})` – nad gridem vytvoří tlačítka „Rozbalit všechny řádky" / „Zabalit všechny řádky" (i18n `expandAllRows` / `collapseAllRows`).
- Binder: `C3Hub.bindTreeToggle(root)` – zapojuje chevron + toolbar Expand/Collapse. Idempotentní (`__c3Bound` flag), volá se automaticky z `C3Hub.bindAll(root)`.
- Indentace: per úroveň `padding-left: 24/48/72/96 px` (CSS `[data-tree-level]` selektory).
- Sloupec Akce, je-li potřeba, je vždy první (přes `actionsRender(row) => HTML` v props).

**Anti-pattern:** Stromová struktura simulovaná jen textovým prefixem (`└ `, `└─ `) v ploché tabulce, bez expand/collapse. Není to RTree (viz `metodika/metodika-zapisu.md` kap. 3.4).

### Datagrid / tabulky

**Princip:** Tabulky jsou MUI X DataGrid se **stylem zebra** (každý druhý řádek `#fafafa`) a šedou hlavičkou. Klikání na řádek otevírá detail; ikonová tlačítka v sloupci „Akce" mají vlastní handlery se `stopPropagation`.

- **Sloupec „Akce" je VŽDY první** v gridu (shoduje se s RIV konvencí). Hlavička `t(CommonTranslKey.ACTIONS)`. Obsahuje ikonová `IconButton` v modré (`var(--coco-color-blue)`) s tooltipem.
- Hlavička: `background: #e0e0e0`, text `#333333`, tučné.
- Řádky: hover `rgba(0,0,0,0.04)`, kurzor `pointer`, sudé `#fafafa`.
- Sloupce mají `min-width: 160px`, hlavní sloupec `flex: 1`.
- CSS hook pro stylování řádku: třída `commandpost-page-table-row` (přejmenovaná dle entity).

### Tlačítka

**Princip:** Tlačítka jsou MUI Button s **`borderRadius: 8px`** (2× theme.shape.borderRadius), `font-weight: bold`, `letter-spacing: 0.5px`. Hover lehce zvedá tlačítko (`translateY(-2px)`) – jemný 3D efekt.

- `contained primary`: pozadí `--coco-color-blue`, bílý text – hlavní akce.
- `outlined primary`: rámeček modrý, text modrý, pozadí bílé – sekundární akce, „Stáhnout PDF".
- `contained success`: zelená `--coco-color-success`, bílý text – potvrzení uloženo, schválit.
- `IconButton` v gridu: modrá (`--coco-color-blue`), velikost `small`, vždy v tooltipu.

### Dialogy

**Princip:** Modal dialog (MUI `Dialog` přes `@dain/mui-components`) s **modrou hlavičkou** (`DialogTitle` na primary background, bílý text + zavírací křížek) a obsahem na bílém pozadí. Šířka přes `maxWidth: 'xs'|'sm'|'md'|'lg'|'xl'`, vždy `fullWidth: true`.

- Footer (volitelný): zarovnán doprava, primary button vpravo, cancel vlevo od něj.
- Slide-panely (jako v RIV) se v C3HUB **nepoužívají** – pro detail entit jsou samostatné full-page detaily přes `react-router`.

### Breadcrumbs

**Princip:** Pod header, vlevo ikona Home (klik = `/`), položky odděleny šedým „/". Aktivní (cílová) položka má **bílý text na modrém pozadí** (chip-style, `border-radius: 4px`, padding `0 0.5em`). Nečinné položky modré, hover s podtržením.

### Notifikace

**Princip:** Notifikační ikona v header (jen pro admina) se badge počtem nevyřízených requestů. Klik otevře **popup panel** (anchorEl pod ikonou, ne plný drawer) s krátkým seznamem položek; klik na položku naviguje a panel zavírá.

### Language switch (CZ/EN)

**Princip:** Vlajka aktuálního jazyka v header (AppBarIconButton), klik otevře `Menu` s alternativním jazykem. C3HUB má **vždy** dvojici cs/en a oba musí být v lokalizačních klíčích.

### Ikony

- **Font Awesome 6** (`solid` pro filled, `regular` pro outline) – sdílíme přes CDN.
- Aplikace v reálu používá MUI Icons (`@mui/icons-material`); pro HTML prototypy mapujeme na FA ekvivalenty (`fa-house` ≈ Home, `fa-circle-user` ≈ AccountCircle, `fa-bell` ≈ NotificationsActive, `fa-chevron-down`/`fa-chevron-up` ≈ ExpandMore/Less, `fa-eye` ≈ Pageview, `fa-file-lines` ≈ Feed).
- **Jedna ikona = jeden význam** v rámci projektu.

### Layout, mezery, rádiusy

- Spacing přes 8px grid (MUI default): 4 / 8 / 16 / 24 / 32 px. Nepoužívej hodnoty mimo tuto škálu, pokud nemáš důvod.
- Border-radius: `4px` (drobné chipy), `8px` (karty, panely, tlačítka), `16px` (modal/dialog – přes MUI default).
- Shadow: `theme.shadows[3]` pro panely, `theme.shadows[6]` pro karty, `theme.shadows[12]` pro hover.

## Verzování a odchylky

- Tento předpis je závazný pro **nové prototypy**. Existující prototypy, které se neaktualizují, zůstávají v původním stavu (analýzy jsou archivní artefakty).
- Per-RQU odchylky řeš lokálním CSS uvnitř prototypu, nikoli forkem `_design/`. Pokud odchylka vznikne 3× a víc, povýšit do `_design/` jako novou variantu komponenty.
- Při zásadní změně tokenu / komponenty bumpni verzi souboru (`c3hub-styles.v2.css`) a starou verzi ponech.

## Doplňování konvencí

Když při tvorbě prototypu zjistíš novou opakovaně použitelnou konvenci, **doplň ji sem do *Designové konvence (závazné)*** ve vhodné podsekci. Konvence musí být:

- **Obecná** – formulace „princip" + krátké odůvodnění; ne konkrétní artefakty.
- **Doložená** – odkaz na minimálně jeden prototyp nebo místo v COCO source, kde se uplatňuje.
- **Závazná** – pokud je „doporučení", patří spíš do diskuze v PR, ne sem.
