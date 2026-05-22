/* =============================================================================
   DSZEZ – Designový předpis projektu · render funkce komponent
   -----------------------------------------------------------------------------
   Funkce `render*` vrací HTML string složený z tříd `.inw-*` z dszez-styles.css.
   Funkce `bind*` / `bindAll` navazují chování (collapse, modály, záložky).
   Vyžaduje dszez-utils.js (objekt `DSZEZ`).
   ========================================================================== */
(function (global) {
  'use strict';

  var D = global.DSZEZ || {};
  var esc = function (s) { return D.escapeHtml(s); };

  /* ----- Topbar a navigace ----------------------------------------------- */
  /** props: { app, module, nav:[{id,label,badge,active}], user:{name,role} } */
  D.renderTopbar = function (props) {
    props = props || {};
    var nav = (props.nav || []).map(function (n) {
      return '<button data-nav="' + esc(n.id) + '"' +
        (n.active ? ' class="inw-nav-active"' : '') + '>' + esc(n.label) +
        (n.badge ? ' <span class="inw-nav-badge">' + esc(n.badge) + '</span>' : '') +
        '</button>';
    }).join('');
    var u = props.user || {};
    return '' +
      '<header class="inw-topbar">' +
        '<div class="inw-topbar-brand">' +
          '<div class="inw-topbar-title"><strong>' + esc(props.app || 'CEPS DSZ-EZ') + '</strong>' +
          '<span>' + esc(props.module || 'Schvalování zkoušek EZ') + '</span></div>' +
        '</div>' +
        '<nav class="inw-nav">' + nav + '</nav>' +
        '<div class="inw-row" style="gap:8px">' +
          (props.user ? '<button class="inw-user-chip"><span class="inw-user-avatar">' +
            esc(D.initials(u.name)) + '</span><span class="inw-user-meta"><strong>' +
            esc(u.name || '') + '</strong><span>' + esc(u.role || '') + '</span></span></button>' +
            '<button class="inw-btn inw-btn--ghost inw-btn--sm">' +
            D.iconHTML('logout') + ' Odhlásit</button>' : '') +
        '</div>' +
      '</header>';
  };

  /* ----- Hlavička stránky ------------------------------------------------ */
  /** props: { title, subtitle, crumbs:[{label,active}], actions: html } */
  D.renderPageHeader = function (props) {
    props = props || {};
    var crumbs = (props.crumbs || []).map(function (c) {
      return '<button class="inw-crumb' + (c.active ? ' inw-crumb--active' : '') + '">' +
        esc(c.label) + '</button>';
    }).join('<span>/</span>');
    return '' +
      '<div class="inw-page-header">' +
        '<div class="inw-page-header-main">' +
          (crumbs ? '<div class="inw-page-header-crumbs">' + crumbs + '</div>' : '') +
          '<h1>' + esc(props.title || '') + '</h1>' +
          (props.subtitle ? '<p class="inw-page-header-subtitle">' + esc(props.subtitle) + '</p>' : '') +
        '</div>' +
        (props.actions ? '<div class="inw-page-header-actions">' + props.actions + '</div>' : '') +
      '</div>';
  };

  /* ----- Tlačítko -------------------------------------------------------- */
  /** props: { label, variant, size, icon, attrs } – variant: primary|secondary|
      accent|ghost|success|danger|outline-primary|outline-danger */
  D.button = function (props) {
    props = props || {};
    var cls = ['inw-btn', 'inw-btn--' + (props.variant || 'primary')];
    if (props.size) cls.push('inw-btn--' + props.size);
    return '<button class="' + cls.join(' ') + '"' + (props.attrs || '') + '>' +
      (props.icon ? D.iconHTML(props.icon) + ' ' : '') + esc(props.label || '') + '</button>';
  };

  /* ----- Formulářové pole ------------------------------------------------ */
  /** props: { label, name, type, value, required, full, hint, invalid,
      options:[{value,label}] (pro select) } */
  D.renderField = function (props) {
    props = props || {};
    var cls = 'inw-field' + (props.full ? ' inw-field-full' : '') +
      (props.invalid ? ' inw-field--invalid' : '');
    var control;
    if (props.type === 'select') {
      control = '<select name="' + esc(props.name || '') + '">' +
        (props.options || []).map(function (o) {
          return '<option value="' + esc(o.value) + '"' +
            (o.value === props.value ? ' selected' : '') + '>' + esc(o.label) + '</option>';
        }).join('') + '</select>';
    } else if (props.type === 'textarea') {
      control = '<textarea name="' + esc(props.name || '') + '">' + esc(props.value || '') + '</textarea>';
    } else if (props.type === 'checkbox') {
      return '<label class="inw-checkbox"><input type="checkbox" name="' + esc(props.name || '') +
        '"' + (props.value ? ' checked' : '') + '> ' + esc(props.label || '') + '</label>';
    } else {
      control = '<input type="' + esc(props.type || 'text') + '" name="' + esc(props.name || '') +
        '" value="' + esc(props.value || '') + '">';
    }
    return '<div class="' + cls + '">' +
      '<label>' + esc(props.label || '') +
        (props.required ? ' <span class="inw-req">povinné</span>' : '') + '</label>' +
      control +
      (props.hint ? '<span class="inw-hint">' + esc(props.hint) + '</span>' : '') +
      '</div>';
  };

  /* ----- Karta / panel --------------------------------------------------- */
  /** props: { title, subtitle, body: html, footer: html, actions: html,
      collapsible, collapsed } */
  D.renderCard = function (props) {
    props = props || {};
    var head = '';
    if (props.title) {
      head = '<div class="inw-card-header">' +
        '<div><h3 class="inw-card-title">' +
          (props.collapsible ? '<button class="inw-card-toggle" type="button">▾</button> ' : '') +
          esc(props.title) + '</h3>' +
          (props.subtitle ? '<div class="inw-card-subtitle">' + esc(props.subtitle) + '</div>' : '') +
        '</div>' +
        (props.actions ? '<div class="inw-row" style="gap:8px">' + props.actions + '</div>' : '') +
      '</div>';
    }
    return '<section class="inw-card' + (props.collapsed ? ' collapsed' : '') + '">' +
      head +
      '<div class="inw-card-body">' + (props.body || '') + '</div>' +
      (props.footer ? '<div class="inw-card-footer">' + props.footer + '</div>' : '') +
      '</section>';
  };

  /* ----- Datová tabulka (sloupec Akce vždy první) ------------------------ */
  /** props: { columns:[{key,label,align}], rows:[obj], rowActions:[{icon,title,attrs}],
      count, emptyText } */
  D.renderDataGrid = function (props) {
    props = props || {};
    var cols = props.columns || [];
    var hasActions = !!props.rowActions;
    var thead = '<thead><tr>' +
      (hasActions ? '<th class="inw-th-actions">Akce</th>' : '') +
      cols.map(function (c) {
        return '<th' + (c.align ? ' style="text-align:' + c.align + '"' : '') + '>' + esc(c.label) + '</th>';
      }).join('') + '</tr></thead>';
    var body;
    if (!props.rows || !props.rows.length) {
      body = '<tbody><tr><td colspan="' + (cols.length + (hasActions ? 1 : 0)) +
        '"><div class="inw-state">' + esc(props.emptyText || 'Žádné záznamy') + '</div></td></tr></tbody>';
    } else {
      body = '<tbody>' + props.rows.map(function (row) {
        var actions = hasActions ? '<td class="inw-td-actions">' +
          props.rowActions.map(function (a) {
            return '<button class="inw-btn inw-btn--ghost inw-btn--sm" title="' +
              esc(a.title || '') + '"' + (a.attrs || '') + '>' + D.iconHTML(a.icon) + '</button>';
          }).join('') + '</td>' : '';
        return '<tr>' + actions + cols.map(function (c) {
          return '<td' + (c.align ? ' style="text-align:' + c.align + '"' : '') + '>' +
            (row[c.key] == null ? '' : (c.html ? row[c.key] : esc(row[c.key]))) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody>';
    }
    var count = (props.count != null)
      ? '<div class="inw-pagination">' + esc(props.count) + ' záznamů</div>' : '';
    return '<div class="inw-table-wrap"><table class="inw-table">' + thead + body + '</table>' + count + '</div>';
  };

  /* ----- Modální dialog -------------------------------------------------- */
  /** props: { id, title, body: html, footer: html, size } */
  D.renderModal = function (props) {
    props = props || {};
    var sizeCls = props.size ? ' inw-modal--' + props.size : '';
    return '<div class="inw-modal-backdrop" data-modal="' + esc(props.id || '') + '" hidden>' +
      '<div class="inw-modal' + sizeCls + '" role="dialog" aria-modal="true">' +
        '<div class="inw-modal-head"><h3>' + esc(props.title || '') + '</h3>' +
          '<button class="inw-modal-close" type="button" aria-label="Zavřít">' +
          D.iconHTML('close') + '</button></div>' +
        '<div class="inw-modal-body">' + (props.body || '') + '</div>' +
        (props.footer ? '<div class="inw-modal-footer">' + props.footer + '</div>' : '') +
      '</div></div>';
  };

  D.openModal = function (id) {
    var m = D.$('[data-modal="' + id + '"]');
    if (m) m.hidden = false;
  };
  D.closeModal = function (id) {
    var m = D.$('[data-modal="' + id + '"]');
    if (m) m.hidden = true;
  };

  /* ----- Odznaky a stavy ------------------------------------------------- */
  /** props: { label, variant } – variant: ok|warn|error|info|muted|external|internal */
  D.renderBadge = function (props) {
    props = props || {};
    return '<span class="inw-badge' + (props.variant ? ' inw-badge--' + props.variant : '') +
      '">' + esc(props.label || '') + '</span>';
  };

  /** props: { status (klíč STATUS_MAP), label } */
  D.renderStatus = function (props) {
    props = props || {};
    var cls = D.statusClass(props.status);
    return '<span class="inw-status inw-status--' + cls + '">' +
      esc(props.label || D.statusLabel(props.status)) + '</span>';
  };

  /* ----- Záložky --------------------------------------------------------- */
  /** props: { tabs:[{id,label}], active } – panely mají atribut data-tab-panel="id" */
  D.renderTabs = function (props) {
    props = props || {};
    var active = props.active || (props.tabs && props.tabs[0] && props.tabs[0].id);
    return '<div class="inw-tabs">' + (props.tabs || []).map(function (t) {
      return '<button class="inw-tab' + (t.id === active ? ' inw-tab-active' : '') +
        '" data-tab="' + esc(t.id) + '">' + esc(t.label) + '</button>';
    }).join('') + '</div>';
  };

  /* ----- KV seznam ------------------------------------------------------- */
  /** props: { items:[{label,value}] } */
  D.renderKv = function (props) {
    props = props || {};
    return '<dl class="inw-kv">' + (props.items || []).map(function (it) {
      return '<dt>' + esc(it.label) + '</dt><dd>' +
        (it.html ? it.value : esc(it.value)) + '</dd>';
    }).join('') + '</dl>';
  };

  /* ----- Timeline schvalovacího workflow --------------------------------- */
  /** props: { steps:[{title,role,meta,status,comment,
      delegations:[{label,meta,body}]}] } */
  D.renderTimeline = function (props) {
    props = props || {};
    return '<div class="inw-timeline">' + (props.steps || []).map(function (s) {
      var deleg = (s.delegations || []).map(function (d) {
        return '<div class="inw-timeline-delegation">' +
          '<div class="inw-timeline-delegation-head">' +
            '<span class="inw-timeline-delegation-label">' + esc(d.label || 'Delegace') + '</span>' +
            (d.meta ? '<span>' + esc(d.meta) + '</span>' : '') + '</div>' +
          '<div class="inw-timeline-delegation-body">' + D.nl2br(d.body || '') + '</div>' +
        '</div>';
      }).join('');
      return '<div class="inw-timeline-step inw-timeline-step--' + D.statusClass(s.status) + '">' +
        '<span class="inw-timeline-dot"></span>' +
        '<div class="inw-timeline-body">' +
          '<div class="inw-timeline-head">' +
            '<span class="inw-timeline-title">' + esc(s.title || '') + '</span>' +
            (s.role ? '<span class="inw-timeline-role">' + esc(s.role) + '</span>' : '') +
          '</div>' +
          (s.meta ? '<div class="inw-timeline-meta">' + esc(s.meta) + '</div>' : '') +
          (s.comment ? '<div class="inw-timeline-comment">' + D.nl2br(s.comment) + '</div>' : '') +
          deleg +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  };

  /* ----- Hlášky ---------------------------------------------------------- */
  D.renderError = function (msg) { return '<div class="inw-error">' + esc(msg) + '</div>'; };
  D.renderSuccess = function (msg) { return '<div class="inw-success">' + esc(msg) + '</div>'; };
  D.renderState = function (msg) { return '<div class="inw-state">' + esc(msg) + '</div>'; };

  /* ----- Navázání chování ------------------------------------------------ */
  D.bindCardToggles = function (root) {
    D.$$('.inw-card-toggle', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.inw-card');
        if (card) card.classList.toggle('collapsed');
      });
    });
  };

  D.bindModals = function (root) {
    D.$$('.inw-modal-backdrop', root).forEach(function (bd) {
      bd.addEventListener('click', function (e) {
        if (e.target === bd || e.target.closest('.inw-modal-close')) bd.hidden = true;
      });
    });
  };

  D.bindTabs = function (root) {
    D.$$('.inw-tabs', root).forEach(function (tabs) {
      tabs.addEventListener('click', function (e) {
        var btn = e.target.closest('.inw-tab');
        if (!btn) return;
        D.$$('.inw-tab', tabs).forEach(function (t) { t.classList.remove('inw-tab-active'); });
        btn.classList.add('inw-tab-active');
        var id = btn.getAttribute('data-tab');
        D.$$('[data-tab-panel]', root).forEach(function (p) {
          p.hidden = p.getAttribute('data-tab-panel') !== id;
        });
      });
    });
  };

  /** Navázání veškerého chování komponent v daném kořeni (výchozí document). */
  D.bindAll = function (root) {
    root = root || document;
    D.bindCardToggles(root);
    D.bindModals(root);
    D.bindTabs(root);
  };

  global.DSZEZ = D;
})(window);
