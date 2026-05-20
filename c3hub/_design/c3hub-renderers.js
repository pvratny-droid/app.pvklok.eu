/* ============================================================
   C3HUB / COCO – Sdílené DOM renderery komponent
   ============================================================
   Funkce, které vrací HTML element nebo HTML string pro
   nejčastější komponenty C3HUB prototypů. Veškerou DOM logiku
   držíme tady, čisté formátovače jsou v `c3hub-utils.js`.

   Závisí na:
     - c3hub-utils.js (C3Hub.* helpery)
     - c3hub-styles.css (CSS třídy `.c3-*`)
     - Font Awesome 6 (CDN) – ikony
     - Google Fonts: Roboto

   Načítání:
     <script src="../_design/c3hub-utils.js"></script>
     <script src="../_design/c3hub-renderers.js"></script>

   Většina funkcí má dvě varianty:
     - `*HTML(props)`  → vrací string (pro innerHTML / template)
     - `*El(props)`    → vrací HTMLElement (pro append do DOM)
   ============================================================ */

(function (global) {
  'use strict';

  if (!global.C3Hub) {
    throw new Error('c3hub-renderers.js vyžaduje c3hub-utils.js (window.C3Hub).');
  }
  const C3Hub = global.C3Hub;
  const esc = C3Hub.escapeHtml;
  const fa  = C3Hub.faIcon;
  const t   = C3Hub.t;

  /* ============================================================
     Main header (AppBar)
     ============================================================
     props = {
       appTitle: 'C3 HUB',
       user: {login, fullName} | null,
       showArchiRepo: bool,
       notificationCount: number | null,  // null = nezobrazovat ikonu
       currentLang: 'cs' | 'en',
       onArchiRepoClick, onNotifClick, onLangClick, onUserMenuClick
     }
     ============================================================ */
  C3Hub.renderMainHeaderHTML = function (props) {
    props = props || {};
    const userLabel = props.user
        ? esc(C3Hub.formatLoginWithFullName(props.user))
        : '';
    const archi = props.showArchiRepo
        ? '<button class="c3-appbar-icon-btn" data-action="archi-repo" title="ArchiRepo">' +
              '<i class="' + fa('OpenInNew') + '"></i>' +
          '</button>'
        : '';
    const notif = (props.notificationCount != null)
        ? '<button class="c3-appbar-icon-btn" data-action="notifications" title="Notifikace">' +
              '<i class="' + fa('NotificationsActive') + '"></i>' +
              (props.notificationCount > 0
                  ? '<span class="c3-icon-badge">' + props.notificationCount + '</span>'
                  : '') +
          '</button>'
        : '';
    const langLabel = (props.currentLang || 'cs').toUpperCase();

    return '' +
      '<header class="c3-main-header">' +
        '<div class="c3-main-header__title">' +
          '<i class="' + fa('Home') + '"></i>' +
          '<span class="c3-main-header__title-app">' + esc(props.appTitle || 'C3 HUB') + '</span>' +
        '</div>' +
        '<div class="c3-main-header__actions">' +
          archi +
          notif +
          '<button class="c3-appbar-icon-btn" data-action="language" title="Jazyk">' +
            '<span class="c3-lang-flag">' + langLabel + '</span>' +
          '</button>' +
          '<button class="c3-appbar-icon-btn" data-action="user-menu" title="Uživatel">' +
            (userLabel ? '<span class="c3-user-name">' + userLabel + '</span>' : '') +
            '<i class="' + fa('AccountCircle') + '"></i>' +
          '</button>' +
        '</div>' +
      '</header>';
  };

  /* ============================================================
     Breadcrumbs
     ============================================================
     items = [{ icon?:'Home', title?:'Velitelská stanoviště', href:'/command-posts', active?:bool }, ...]
     ============================================================ */
  C3Hub.renderBreadcrumbsHTML = function (items) {
    items = items || [];
    const parts = [];
    items.forEach(function (item, idx) {
      const isActive = !!item.active;
      const cls = 'c3-breadcrumb' + (isActive ? ' active' : '');
      const icon = item.icon ? '<i class="' + fa(item.icon) + '"></i>' : '';
      const title = item.title ? '<span>' + esc(item.title) + '</span>' : '';
      parts.push('<a class="' + cls + '" href="' + esc(item.href || '#') + '">' +
                    icon + title +
                 '</a>');
      if (idx < items.length - 1) {
        parts.push('<span class="c3-breadcrumb__sep">/</span>');
      }
    });
    return '<nav class="c3-breadcrumbs">' + parts.join('') + '</nav>';
  };

  /* ============================================================
     Simple card (kartička s barevným blokem) – jako CocoSimpleCard
     ============================================================
     props = {
       title, description,
       color: 'violet' | 'orange' | 'teal' | ... ,
       href?, onClick?,           // klik na kartu jako celek
       primaryAction?: { label, href?, onClick?, variant?: 'contained'|'outlined' },
       disabled?: bool,
       showColorBlock?: bool      // default true
     }
     ============================================================ */
  C3Hub.renderSimpleCardHTML = function (props) {
    props = props || {};
    const colorCls = C3Hub.cardColorClass(props.color);
    const disabledCls = props.disabled ? ' disabled' : '';
    const showBlock = props.showColorBlock !== false;
    const block = showBlock
        ? '<div class="c3-simple-card__color-block ' + colorCls + '">' +
              '<span class="label">' + esc(props.title || '') + '</span>' +
          '</div>'
        : '';

    // Pokud je celá karta odkaz (props.href), je obal <a>. Akční tlačítko proto
    // NESMÍ být vnořený <a>/<button> – vnořené interaktivní prvky uvnitř <a> jsou
    // nevalidní HTML a prohlížeč je rozpojí (tlačítko „vypadne" z karty).
    // V tom případě vykreslíme akci jako <span> se vzhledem tlačítka; kliknutí
    // probublá na obalující <a> karty a navigace funguje.
    const cardIsLink = !!props.href;
    let actions = '';
    if (props.primaryAction) {
      const a = props.primaryAction;
      const variant = a.variant === 'outlined' ? 'c3-btn--outlined' : 'c3-btn--contained';
      const tag = cardIsLink ? 'span' : (a.href ? 'a' : 'button');
      const hrefAttr = (!cardIsLink && a.href) ? ' href="' + esc(a.href) + '"' : '';
      actions = '<div class="c3-simple-card__actions">' +
                  '<' + tag + ' class="c3-btn ' + variant + ' c3-btn--sm" data-action="card-primary"' + hrefAttr + '>' +
                    esc(a.label) +
                  '</' + tag + '>' +
                '</div>';
    }

    const wrapTag = props.href ? 'a' : 'div';
    const wrapHref = props.href ? ' href="' + esc(props.href) + '"' : '';
    return '<' + wrapTag + ' class="c3-simple-card' + disabledCls + '"' + wrapHref + ' data-card-key="' + esc(props.key || '') + '">' +
              '<div class="c3-simple-card__header">' +
                '<div class="c3-simple-card__title" title="' + esc(props.title || '') + '">' +
                  esc(props.title || '') +
                '</div>' +
              '</div>' +
              block +
              '<div class="c3-simple-card__content">' +
                (props.description
                    ? '<div class="c3-simple-card__description" title="' + esc(props.description) + '">' +
                          esc(props.description) +
                      '</div>'
                    : '') +
              '</div>' +
              actions +
           '</' + wrapTag + '>';
  };

  /* ============================================================
     Card panel (sbalitelný panel s modrou hlavičkou)
     ============================================================
     props = { title, initiallyExpanded?: bool, actions?: [{label, onClick}], bodyHTML }
     ============================================================ */
  C3Hub.renderCardPanelHTML = function (props) {
    props = props || {};
    const collapsed = props.initiallyExpanded === false ? ' collapsed' : '';
    const actionsHtml = (props.actions || []).map(function (a) {
      return '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="' + esc(a.key || a.label) + '">' +
              (a.icon ? '<i class="' + fa(a.icon) + '"></i>' : '') +
              esc(a.label) +
             '</button>';
    }).join('');

    return '<section class="c3-card-panel' + collapsed + '">' +
              '<header class="c3-card-panel__header">' +
                '<h2 class="c3-card-panel__title">' + esc(props.title || '') + '</h2>' +
                '<div class="c3-card-panel__actions">' + actionsHtml +
                  '<button class="c3-card-panel__toggle" data-action="toggle" aria-label="Sbalit / rozbalit">' +
                    '<i class="' + fa('ExpandLess') + '"></i>' +
                  '</button>' +
                '</div>' +
              '</header>' +
              '<div class="c3-card-panel__body">' + (props.bodyHTML || '') + '</div>' +
           '</section>';
  };

  /**
   * Připojí toggle handler na všechny .c3-card-panel v rootu (default document).
   * Volej jednou po vykreslení.
   */
  C3Hub.bindCardPanelToggle = function (root) {
    root = root || document;
    C3Hub.$$('.c3-card-panel', root).forEach(function (panel) {
      const btn = panel.querySelector('[data-action="toggle"]');
      if (!btn || btn.__c3Bound) return;
      btn.__c3Bound = true;
      btn.addEventListener('click', function () {
        panel.classList.toggle('collapsed');
      });
    });
  };

  /* ============================================================
     Card grid (wrapper kolem několika simple-card)
     ============================================================ */
  C3Hub.renderCardGridHTML = function (cards) {
    const html = (cards || []).map(C3Hub.renderSimpleCardHTML).join('');
    return '<div class="c3-card-grid">' + html + '</div>';
  };

  /* ============================================================
     Datagrid – tabulka s Akce v 1. sloupci
     ============================================================
     props = {
       columns: [
         { field:'actions', label:'Akce', render: (row) => HTML, width: '1%', class:'col-actions' },
         { field:'name',    label:'Název', flex:1 },
         { field:'lastModified', label:'Změna', format: 'date' },
         ...
       ],
       rows: [...],
       getRowId?: (row) => id,
       onRowClick?: (row) => void,    // přiřadí se delegovaně
       emptyText?: 'Žádné záznamy',
       loading?: bool
     }
     ============================================================ */
  C3Hub.renderDataGridHTML = function (props) {
    props = props || {};
    const cols = props.columns || [];
    const rows = props.rows || [];

    if (props.loading) {
      return '<div class="c3-datagrid"><div class="c3-datagrid__loading">' +
                '<i class="' + fa('Refresh') + '"></i> Načítám…' +
             '</div></div>';
    }
    if (!rows.length) {
      return '<div class="c3-datagrid"><div class="c3-datagrid__empty">' +
                esc(props.emptyText || 'Žádné záznamy') +
             '</div></div>';
    }

    const thead = '<thead><tr>' + cols.map(function (col) {
      const cls = col.class ? ' class="' + esc(col.class) + '"' : '';
      const w = col.width ? ' style="width:' + esc(col.width) + ';"' : '';
      return '<th' + cls + w + '>' + esc(col.label || '') + '</th>';
    }).join('') + '</tr></thead>';

    const tbody = '<tbody>' + rows.map(function (row) {
      const rowId = props.getRowId ? props.getRowId(row) : (row.id || '');
      const tds = cols.map(function (col) {
        const cls = col.class ? ' class="' + esc(col.class) + '"' : '';
        let val;
        if (typeof col.render === 'function') {
          val = col.render(row);
        } else {
          let raw = row[col.field];
          if (col.format === 'date')      raw = C3Hub.formatDate(raw);
          else if (col.format === 'datetime') raw = C3Hub.formatDateTime(raw);
          else if (col.format === 'relative') raw = C3Hub.formatRelative(raw);
          val = raw != null ? esc(raw) : '';
        }
        return '<td' + cls + '>' + val + '</td>';
      }).join('');
      return '<tr data-row-id="' + esc(rowId) + '">' + tds + '</tr>';
    }).join('') + '</tbody>';

    return '<div class="c3-datagrid"><div class="c3-datagrid__scroll">' +
              '<table>' + thead + tbody + '</table>' +
           '</div></div>';
  };

  /**
   * Připojí onRowClick na všechny řádky uvnitř c3-datagrid v rootu.
   * Ignoruje kliky na elementy s data-action (ikony v Akce sloupci).
   */
  C3Hub.bindDataGridRowClick = function (root, onRowClick) {
    root = root || document;
    C3Hub.$$('.c3-datagrid tbody tr', root).forEach(function (tr) {
      if (tr.__c3Bound) return;
      tr.__c3Bound = true;
      tr.addEventListener('click', function (ev) {
        // Pokud klik šel přes element s data-action (icon-btn v Akce), nepropaguj.
        let el = ev.target;
        while (el && el !== tr) {
          if (el.dataset && el.dataset.action) return;
          el = el.parentElement;
        }
        if (typeof onRowClick === 'function') {
          onRowClick(tr.dataset.rowId, tr);
        }
      });
    });
  };

  /**
   * Helper: vyrobí HTML pro Akce buňku z pole tlačítek.
   *   actionButtons([
   *     {icon:'Pageview', tooltip:'Zobrazit', action:'view'},
   *     {icon:'Feed', tooltip:'Report', action:'report'}
   *   ])
   */
  C3Hub.actionButtonsHTML = function (buttons) {
    return (buttons || []).map(function (b) {
      const danger = b.danger ? ' c3-icon-btn--danger' : '';
      return '<button class="c3-icon-btn' + danger + '" ' +
                  'data-action="' + esc(b.action || b.icon) + '" ' +
                  'title="' + esc(b.tooltip || '') + '">' +
                '<i class="' + fa(b.icon) + '"></i>' +
              '</button>';
    }).join('');
  };

  /* ============================================================
     Modal dialog
     ============================================================
     props = { id, title, bodyHTML, footerHTML?, size?: 'xs'|'sm'|'md'|'lg'|'xl' }
     ============================================================ */
  C3Hub.renderModalHTML = function (props) {
    props = props || {};
    const sizeCls = props.size ? ' c3-modal--' + props.size : ' c3-modal--sm';
    const id = props.id || ('c3-modal-' + Math.random().toString(36).slice(2, 9));
    return '<div class="c3-modal-backdrop" id="' + esc(id) + '" data-modal-id="' + esc(id) + '">' +
              '<div class="c3-modal' + sizeCls + '" role="dialog" aria-modal="true">' +
                '<header class="c3-modal__header">' +
                  '<h3 class="c3-modal__title">' + esc(props.title || '') + '</h3>' +
                  '<button class="c3-modal__close" data-action="close" aria-label="Zavřít">' +
                    '<i class="' + fa('Close') + '"></i>' +
                  '</button>' +
                '</header>' +
                '<div class="c3-modal__body">' + (props.bodyHTML || '') + '</div>' +
                (props.footerHTML
                    ? '<footer class="c3-modal__footer">' + props.footerHTML + '</footer>'
                    : '') +
              '</div>' +
           '</div>';
  };

  C3Hub.openModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('open');
  };
  C3Hub.closeModal = function (modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('open');
  };

  /**
   * Připojí close handlery (křížek, klik na backdrop) na všechny c3-modal-backdrop.
   */
  C3Hub.bindModalClose = function (root) {
    root = root || document;
    C3Hub.$$('.c3-modal-backdrop', root).forEach(function (bd) {
      if (bd.__c3Bound) return;
      bd.__c3Bound = true;
      bd.addEventListener('click', function (ev) {
        const inDialog = ev.target.closest('.c3-modal');
        const closeBtn = ev.target.closest('[data-action="close"]');
        if (!inDialog || closeBtn) bd.classList.remove('open');
      });
    });
  };

  /* ============================================================
     Notifikační popup panel
     ============================================================
     props = { title, items: [{title, meta?, href?, key?}] }
     ============================================================ */
  C3Hub.renderNotifPanelHTML = function (props) {
    props = props || {};
    const items = (props.items || []).map(function (it) {
      return '<div class="c3-popup__item" data-key="' + esc(it.key || '') + '">' +
                '<div class="c3-popup__item-title">' + esc(it.title || '') + '</div>' +
                (it.meta ? '<div class="c3-popup__item-meta">' + esc(it.meta) + '</div>' : '') +
             '</div>';
    }).join('') || '<div class="c3-popup__item-meta" style="padding:16px;">Žádné notifikace</div>';

    return '<div class="c3-popup" role="menu">' +
              '<div class="c3-popup__title">' + esc(props.title || 'Notifikace') + '</div>' +
              items +
           '</div>';
  };

  /* ============================================================
     Language menu (popup)
     ============================================================
     props = { current: 'cs'|'en' }
     ============================================================ */
  C3Hub.renderLanguageMenuHTML = function (props) {
    props = props || {};
    const langs = [
      { code: 'cs', label: 'Čeština', flag: 'CZ' },
      { code: 'en', label: 'English', flag: 'EN' }
    ];
    const items = langs.map(function (l) {
      const active = l.code === (props.current || 'cs') ? ' active' : '';
      return '<div class="c3-lang-menu-item' + active + '" data-lang="' + l.code + '">' +
                '<span class="c3-lang-flag">' + l.flag + '</span>' +
                '<span>' + esc(l.label) + '</span>' +
             '</div>';
    }).join('');
    return '<div class="c3-popup" role="menu">' + items + '</div>';
  };

  /* ============================================================
     Stav badge
     ============================================================
     props = { label, variant: 'ok'|'warn'|'error'|'info'|'muted' }
     ============================================================ */
  C3Hub.renderStavBadgeHTML = function (props) {
    props = props || {};
    const cls = 'c3-stav-badge c3-stav--' + (props.variant || 'muted');
    return '<span class="' + cls + '">' + esc(props.label || '') + '</span>';
  };

  /* ============================================================
     News panel (na dashboardu)
     ============================================================ */
  C3Hub.renderNewsPanelHTML = function (props) {
    props = props || {};
    return '<aside class="c3-news-panel">' +
              '<i class="c3-news-panel__icon ' + fa('Announcement') + '"></i>' +
              '<div class="c3-news-panel__body">' +
                (props.title ? '<div class="c3-news-panel__title">' + esc(props.title) + '</div>' : '') +
                '<div>' + C3Hub.nl2br(props.text || '') + '</div>' +
              '</div>' +
           '</aside>';
  };

  /* ============================================================
     Tree grid – stromový datagrid s expand/collapse
     ============================================================
     Sjednocený renderer pro typ `RTree` (TREE_DATA_GROUP_FIELD).
     Datové řádky musí být ve flat-poli; hierarchii odvozuje
     z `getParentId(row)`. Renderer si dopočítá `data-tree-level`
     a wrap chevronu před label.

     props = {
       columns: [{field, label, render?, format?, class?, width?}],
       rows:        [...],                       // flat array of all rows (root + descendants)
       getRowId:    row => string,
       getParentId: row => string | null,        // null pro root
       getLabel:    row => string,               // text label do tree-label sloupce
       labelField:  'name',                      // alternativně název field s labelem
       defaultExpanded: bool,                    // default true
       actionsRender:   row => HTML,             // ikony pro 1. sloupec (volitelné)
       childCount:      row => number | null,    // počet potomků pro „(N)"
       toolbarHTML:     string                   // volitelný toolbar nad gridem
                                                 // (např. tlačítka Rozbalit/Zabalit všechny)
     }

     Tree label sloupec se vykreslí v gridu s `class="c3-tree-label"`. Chevron
     před label se renderuje, pokud má řádek alespoň jednoho potomka.
     ============================================================ */
  C3Hub.renderTreeGridHTML = function (props) {
    props = props || {};
    const cols = props.columns || [];
    const rows = props.rows || [];
    const getRowId    = props.getRowId    || function (r) { return r.id; };
    const getParentId = props.getParentId || function () { return null; };
    const getLabel    = props.getLabel    || function (r) { return r[props.labelField || 'name']; };
    const childCount  = props.childCount  || function () { return null; };
    const defaultExpanded = props.defaultExpanded !== false;

    // Spočítej úroveň a children mapu
    const idToLevel = {};
    const idToHasChildren = {};
    rows.forEach(function (r) {
      const pid = getParentId(r);
      if (pid) idToHasChildren[pid] = true;
    });
    function computeLevel(r) {
      const id = getRowId(r);
      if (id in idToLevel) return idToLevel[id];
      const pid = getParentId(r);
      if (!pid) { idToLevel[id] = 0; return 0; }
      // Najdi parent řádek
      const parent = rows.find(function (x) { return getRowId(x) === pid; });
      const lvl = parent ? computeLevel(parent) + 1 : 0;
      idToLevel[id] = lvl;
      return lvl;
    }
    rows.forEach(computeLevel);

    if (!rows.length) {
      return (props.toolbarHTML || '') +
             '<div class="c3-datagrid c3-tree-grid"><div class="c3-datagrid__empty">' +
                esc(props.emptyText || 'Žádné záznamy') +
             '</div></div>';
    }

    const thead = '<thead><tr>' + cols.map(function (col) {
      const cls = col.class ? ' class="' + esc(col.class) + '"' : '';
      const w = col.width ? ' style="width:' + esc(col.width) + ';"' : '';
      return '<th' + cls + w + '>' + esc(col.label || '') + '</th>';
    }).join('') + '</tr></thead>';

    const tbody = '<tbody>' + rows.map(function (row) {
      const id = getRowId(row);
      const pid = getParentId(row);
      const lvl = idToLevel[id] || 0;
      const hasChildren = !!idToHasChildren[id];
      const collapsedCls = (!defaultExpanded && hasChildren) ? ' collapsed' : '';
      const hiddenCls = (!defaultExpanded && pid) ? ' c3-tree-hidden' : '';

      const tds = cols.map(function (col) {
        const cls = col.class ? ' class="' + esc(col.class) + '"' : '';
        let val;
        if (col.field === '__actions' && typeof props.actionsRender === 'function') {
          val = props.actionsRender(row) || '';
        } else if (col.field === '__tree-label') {
          // Sloupec s tree label, chevron, počet dětí
          const chevron = hasChildren
              ? '<button class="c3-tree-toggle" data-action="tree-toggle" aria-label="Rozbalit / sbalit">' +
                  '<i class="' + fa('ChevronRight') + '"></i>' +
                '</button>'
              : '<span class="c3-tree-toggle c3-tree-toggle--leaf"></span>';
          const cnt = childCount(row);
          const cntHtml = (cnt != null && cnt > 0)
              ? ' <span class="c3-tree-label__count">(' + cnt + ')</span>'
              : '';
          val = '<div class="c3-tree-label">' + chevron +
                  '<span class="c3-tree-label__text">' + esc(getLabel(row) || '') + '</span>' +
                  cntHtml +
                '</div>';
        } else if (typeof col.render === 'function') {
          val = col.render(row);
        } else {
          let raw = row[col.field];
          if (col.format === 'date')          raw = C3Hub.formatDate(raw);
          else if (col.format === 'datetime') raw = C3Hub.formatDateTime(raw);
          else if (col.format === 'relative') raw = C3Hub.formatRelative(raw);
          val = raw != null ? esc(raw) : '';
        }
        return '<td' + cls + '>' + val + '</td>';
      }).join('');

      return '<tr class="' + (hiddenCls ? hiddenCls.trim() : '') + collapsedCls + '" ' +
                'data-row-id="' + esc(id) + '" ' +
                'data-parent-id="' + esc(pid || '') + '" ' +
                'data-tree-level="' + lvl + '"' +
                (hasChildren ? ' data-tree-has-children="true"' : '') +
                '>' + tds + '</tr>';
    }).join('') + '</tbody>';

    return (props.toolbarHTML || '') +
           '<div class="c3-datagrid c3-tree-grid"><div class="c3-datagrid__scroll">' +
             '<table>' + thead + tbody + '</table>' +
           '</div></div>';
  };

  /**
   * Helper pro toolbar tree-gridu (tlačítka Rozbalit/Zabalit všechny).
   *   renderTreeToolbarHTML({expandLabel:'Rozbalit všechny', collapseLabel:'Zabalit všechny'})
   */
  C3Hub.renderTreeToolbarHTML = function (props) {
    props = props || {};
    return '<div class="c3-tree-toolbar">' +
              '<button class="c3-btn c3-btn--text c3-btn--sm" data-action="tree-expand-all">' +
                '<i class="' + fa('ChevronRight') + '"></i> ' +
                esc(props.expandLabel || 'Rozbalit všechny řádky') +
              '</button>' +
              '<button class="c3-btn c3-btn--text c3-btn--sm" data-action="tree-collapse-all">' +
                '<i class="' + fa('ChevronLeft') + '"></i> ' +
                esc(props.collapseLabel || 'Zabalit všechny řádky') +
              '</button>' +
           '</div>';
  };

  /**
   * Připojí toggle handler chevronu + Rozbalit/Zabalit všechny v rámci rootu.
   * Idempotentní (__c3Bound flag).
   */
  C3Hub.bindTreeToggle = function (root) {
    root = root || document;
    C3Hub.$$('.c3-tree-grid', root).forEach(function (grid) {
      if (grid.__c3TreeBound) return;
      grid.__c3TreeBound = true;
      grid.addEventListener('click', function (ev) {
        const toggle = ev.target.closest('[data-action="tree-toggle"]');
        if (toggle) {
          ev.stopPropagation();
          const row = toggle.closest('tr');
          if (!row) return;
          const isCollapsed = row.classList.toggle('collapsed');
          // Skryj/zobraz všechny descendanty
          const rowId = row.getAttribute('data-row-id');
          setDescendantsHidden(grid, rowId, isCollapsed);
        }
      });
    });
    // Toolbar Expand/Collapse all – vyhledej toolbar v rámci rootu
    C3Hub.$$('[data-action="tree-expand-all"]', root).forEach(function (btn) {
      if (btn.__c3Bound) return;
      btn.__c3Bound = true;
      btn.addEventListener('click', function () {
        const container = btn.closest('.c3-tree-grid, [data-tree-scope]') || root;
        const grid = container.querySelector ? (container.querySelector('.c3-tree-grid') || container) : container;
        C3Hub.$$('.c3-tree-grid tr.collapsed', container).forEach(function (tr) {
          tr.classList.remove('collapsed');
        });
        C3Hub.$$('.c3-tree-grid tr.c3-tree-hidden', container).forEach(function (tr) {
          tr.classList.remove('c3-tree-hidden');
        });
      });
    });
    C3Hub.$$('[data-action="tree-collapse-all"]', root).forEach(function (btn) {
      if (btn.__c3Bound) return;
      btn.__c3Bound = true;
      btn.addEventListener('click', function () {
        const container = btn.closest('.c3-tree-grid, [data-tree-scope]') || root;
        C3Hub.$$('.c3-tree-grid tr[data-tree-has-children="true"]', container).forEach(function (tr) {
          tr.classList.add('collapsed');
        });
        C3Hub.$$('.c3-tree-grid tr[data-parent-id]:not([data-parent-id=""])', container).forEach(function (tr) {
          tr.classList.add('c3-tree-hidden');
        });
      });
    });
  };

  // Pomocná: skryje (recursive) všechny potomky daného uzlu v dané tree-grid tabulce.
  function setDescendantsHidden(grid, parentRowId, hidden) {
    if (!parentRowId) return;
    const children = C3Hub.$$('tr[data-parent-id="' + parentRowId + '"]', grid);
    children.forEach(function (tr) {
      if (hidden) {
        tr.classList.add('c3-tree-hidden');
        // Recurse – pokud byl child sám expandovaný, jeho potomci zůstanou skryté pod jeho stavem
        setDescendantsHidden(grid, tr.getAttribute('data-row-id'), true);
      } else {
        // Pokud child sám není collapsed, ukaž ho a recurse
        tr.classList.remove('c3-tree-hidden');
        if (!tr.classList.contains('collapsed')) {
          setDescendantsHidden(grid, tr.getAttribute('data-row-id'), false);
        }
      }
    });
  }

  /* ============================================================
     Init – jednotný bootstrap pro prototyp
     ============================================================
     Po vykreslení DOM volej:
       C3Hub.bindAll();    // bind toggle, modal close, tree toggle, atd.

     Konkrétní handlery (row click, btn akce) bind sám v prototypu.
     ============================================================ */
  C3Hub.bindAll = function (root) {
    C3Hub.bindCardPanelToggle(root);
    C3Hub.bindModalClose(root);
    C3Hub.bindTreeToggle(root);
  };

})(typeof window !== 'undefined' ? window : globalThis);
