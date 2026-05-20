/* ============================================================
   RQU002 – Views: list (G001/G001b/G002) + detail (G003+G004/G011/G014/G015)
   ============================================================
   Vystavuje window.Views.{renderList, renderDetail, bindList, bindDetail}.

   Pokrytí UC: UC001 (search), UC002 (toggle view), UC003 (open detail),
   UC008 (stub download tiles).
   ============================================================ */
(function (global) {
  'use strict';

  const Views = {};

  const esc = function (s) { return window.C3Hub.escapeHtml(s); };
  const t   = function (k) { return window.C3Hub.t(k); };
  const label = window.MockData ? window.MockData.lookupLabel : function (c, code) { return code; };

  // ============================================================
  // LIST view (G001 + G001b + G002)
  // ============================================================
  Views.renderList = function (state) {
    const cps = filterCps(window.MockData.commandPosts, state.searchQuery);

    const toolbar = '' +
      '<div class="cp-list-toolbar">' +
        '<input type="text" class="c3-form-input cp-search" ' +
               'placeholder="' + esc(t('search.commandPosts')) + '" ' +
               'value="' + esc(state.searchQuery || '') + '" autocomplete="off">' +
        '<div class="cp-view-toggle">' +
          '<button class="c3-btn c3-btn--sm ' + (state.viewMode === 'tile' ? 'c3-btn--contained' : 'c3-btn--outlined') + '" data-action="view-tile">' +
            '<i class="' + window.C3Hub.faIcon('MoreVert') + '"></i> ' + esc(t('view.tile')) +
          '</button>' +
          '<button class="c3-btn c3-btn--sm ' + (state.viewMode === 'table' ? 'c3-btn--contained' : 'c3-btn--outlined') + '" data-action="view-table">' +
            '<i class="' + window.C3Hub.faIcon('FilterAlt') + '"></i> ' + esc(t('view.table')) +
          '</button>' +
        '</div>' +
        '<button class="c3-btn c3-btn--contained" data-action="add-cp">' +
          esc(t('btn.add')) +
        '</button>' +
      '</div>';

    let body;
    if (state.viewMode === 'tile') {
      body = renderTileList(cps);
    } else {
      body = renderTableList(cps);
    }

    return '<section class="cp-list">' +
              '<h1 class="cp-list-heading">' + esc(t('module.commandPosts')) + '</h1>' +
              toolbar +
              body +
           '</section>';
  };

  function filterCps(cps, q) {
    if (!q) return cps;
    const norm = function (s) {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    };
    const nq = norm(q);
    return cps.filter(function (cp) {
      return norm(cp.nazev).indexOf(nq) !== -1 ||
             norm(cp.popis).indexOf(nq) !== -1 ||
             norm(cp.kod).indexOf(nq) !== -1;
    });
  }

  function renderTileList(cps) {
    if (!cps.length) {
      return '<div class="cp-empty">' + esc(t('noResults')) + '</div>';
    }
    const cards = cps.map(function (cp) {
      return renderCpCard(cp);
    }).join('');
    return '<div class="c3-card-grid">' + cards + '</div>';
  }

  // G002 – kartička s vlajkou, obrázkem, taktickou značkou, popisem
  function renderCpCard(cp) {
    const flag = window.MockData.lookupCatalog('vlajka', cp.vlajka);
    const sym  = window.MockData.lookupCatalog('taktickaZnacka', cp.taktickaZnacka);
    const img  = window.MockData.lookupCatalog('obrazek', cp.obrazek);
    const flagEmoji = flag ? flag.emoji : '🏳️';
    const symStr    = sym ? sym.sym : '◇';
    const imgStr    = img ? img.img : '🏛️';

    // Color block z taktické značky / typu (fallback violet)
    const colorMap = { JOC:'violet', TOC:'orange', FHQ:'teal', JFC:'blue', CSC:'red-light-dark', MCC:'turquoise' };
    const colorCls = window.C3Hub.cardColorClass(colorMap[cp.typ] || 'blue-gray');

    return '<div class="c3-simple-card cp-card" data-cp-id="' + esc(cp.id) + '">' +
              '<div class="c3-simple-card__header">' +
                '<div class="c3-simple-card__title" title="' + esc(cp.nazev) + '">' + esc(cp.nazev) + '</div>' +
              '</div>' +
              '<div class="c3-simple-card__color-block ' + colorCls + '">' +
                '<div class="cp-card__visuals">' +
                  '<span class="cp-card__img" title="' + esc(img ? img.label_cs : '') + '">' + imgStr + '</span>' +
                  '<span class="cp-card__flag" title="' + esc(flag ? flag.label_cs : '') + '">' + flagEmoji + '</span>' +
                  '<span class="cp-card__sym" title="' + esc(sym ? sym.label_cs : '') + '">' + symStr + '</span>' +
                '</div>' +
                '<span class="label">' + esc(cp.nazev) + '</span>' +
              '</div>' +
              '<div class="c3-simple-card__content">' +
                '<div class="c3-simple-card__description" title="' + esc(cp.popis) + '">' + esc(cp.popis) + '</div>' +
              '</div>' +
              '<div class="c3-simple-card__actions">' +
                '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="cp-report" data-cp-id="' + esc(cp.id) + '">' +
                  '<i class="' + window.C3Hub.faIcon('Feed') + '"></i> ' + esc(t('btn.report')) +
                '</button>' +
                '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="cp-view" data-cp-id="' + esc(cp.id) + '">' +
                  esc(t('btn.show')) +
                '</button>' +
              '</div>' +
           '</div>';
  }

  // G001b – tabulkové zobrazení s Akce sloupcem první
  function renderTableList(cps) {
    return window.C3Hub.renderDataGridHTML({
      rows: cps,
      getRowId: function (cp) { return cp.id; },
      emptyText: t('noResults'),
      columns: [
        {
          field: 'actions', label: t('col.actions'),
          class: 'col-actions',
          render: function (cp) {
            return window.C3Hub.actionButtonsHTML([
              { icon: 'Pageview', tooltip: t('btn.show'),   action: 'cp-view-' + cp.id },
              { icon: 'Feed',     tooltip: t('btn.report'), action: 'cp-report-' + cp.id }
            ]);
          }
        },
        { field: 'kod',          label: t('col.code') },
        { field: 'nazev',        label: t('col.name') },
        { field: 'popis',        label: t('col.description'),
          render: function (cp) { return esc(window.C3Hub.truncate(cp.popis, 80)); } },
        { field: 'lastModified', label: t('col.lastModified'), format: 'datetime' },
        { field: 'zodpovedna',   label: t('col.responsible') }
      ]
    });
  }

  Views.bindList = function (root) {
    // Search input
    const search = root.querySelector('.cp-search');
    if (search) {
      search.addEventListener('input', function (ev) {
        App.state.searchQuery = ev.target.value;
        // Optimalizace: aktualizujeme jen tělo listu, ne header
        const listSection = root.querySelector('.cp-list');
        if (listSection) {
          const cps = filterCps(window.MockData.commandPosts, App.state.searchQuery);
          const body = App.state.viewMode === 'tile' ? renderTileList(cps) : renderTableList(cps);
          // Replace last child (the body) – toolbar zůstane
          const old = listSection.querySelector('.c3-card-grid, .c3-datagrid, .cp-empty');
          if (old) {
            const wrap = document.createElement('div');
            wrap.innerHTML = body;
            old.parentNode.replaceChild(wrap.firstChild, old);
            bindListBody(root);
          }
        }
      });
    }

    // View toggle
    const btnTile  = root.querySelector('[data-action="view-tile"]');
    const btnTable = root.querySelector('[data-action="view-table"]');
    if (btnTile)  btnTile.addEventListener('click',  function () { App.state.viewMode = 'tile';  App.rerender(); });
    if (btnTable) btnTable.addEventListener('click', function () { App.state.viewMode = 'table'; App.rerender(); });

    // Add CP
    const addBtn = root.querySelector('[data-action="add-cp"]');
    if (addBtn) addBtn.addEventListener('click', function () {
      window.Dialogs.openCreateCp();
    });

    bindListBody(root);
  };

  function bindListBody(root) {
    // Klik na celou kartu = otevřít detail
    root.querySelectorAll('.cp-card').forEach(function (card) {
      card.addEventListener('click', function (ev) {
        // Pokud klik šel přes button uvnitř karty, button si zařídí akci sám.
        if (ev.target.closest('[data-action]')) return;
        App.navigateToDetail(card.dataset.cpId);
      });
    });
    // Tlačítka Zobrazit/Report na kartě
    root.querySelectorAll('[data-action="cp-view"]').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        App.navigateToDetail(btn.dataset.cpId);
      });
    });
    root.querySelectorAll('[data-action="cp-report"]').forEach(function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        window.Dialogs.openReportOptions(btn.dataset.cpId);
      });
    });

    // Tabulkové akce (pattern cp-view-CP001)
    root.querySelectorAll('.c3-datagrid [data-action^="cp-view-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const id = b.dataset.action.replace('cp-view-', '');
        App.navigateToDetail(id);
      });
    });
    root.querySelectorAll('.c3-datagrid [data-action^="cp-report-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const id = b.dataset.action.replace('cp-report-', '');
        window.Dialogs.openReportOptions(id);
      });
    });
    // Klik na řádek = otevřít detail
    window.C3Hub.bindDataGridRowClick(root, function (rowId) {
      App.navigateToDetail(rowId);
    });
  }

  // ============================================================
  // DETAIL view (G003 + 4 sekce: G004, G011, G014, G015)
  // ============================================================
  Views.renderDetail = function (state) {
    const cp = window.MockData.findCpById(state.selectedId);
    if (!cp) {
      return '<div class="c3-news-panel"><div class="c3-news-panel__body">' +
             '<strong>Karta MV neexistuje.</strong> ' +
             '<a href="#/list">Zpět na seznam</a></div></div>';
    }

    return '<section class="cp-detail">' +
              '<h1 class="cp-detail-heading">' + esc(cp.nazev) + '</h1>' +
              renderSectionSpec(cp) +
              renderSectionFlows(cp) +
              renderSectionFmn(cp) +
              renderSectionDownload(cp) +
           '</section>';
  };

  // G004 – Sekce specifikace (3 dlaždice)
  function renderSectionSpec(cp) {
    const tiles =
      simpleTile('spec',          t('tile.spec'),         'violet', describeSpec(cp),         { label: t('btn.edit'), action: 'edit-spec' }) +
      simpleTile('capabilities',  t('tile.capabilities'), 'orange', describeCapabilities(cp), { label: t('btn.edit'), action: 'edit-capabilities' }) +
      simpleTile('structure',     t('tile.structure'),    'teal',   describeStructure(cp),    { label: t('btn.edit'), action: 'edit-structure' });
    return window.C3Hub.renderCardPanelHTML({
      title: t('section.spec'),
      initiallyExpanded: true,
      bodyHTML: '<div class="c3-card-grid">' + tiles + '</div>'
    });
  }

  // G011 – Sekce IER/IP (2 dlaždice + tlačítka +Přidat podle IER/IP)
  function renderSectionFlows(cp) {
    const ier = cp.interactions.ier.length;
    const ip  = cp.interactions.ip.length;
    const tiles =
      simpleTile('ier', t('tile.ier'), 'blue',
                 'Přiřazeno ' + ier + ' požadavků na výměnu informací (IER).',
                 { label: t('btn.edit'), action: 'edit-ier' }) +
      simpleTile('ip',  t('tile.ip'),  'orange-light',
                 'Přiřazeno ' + ip + ' informačních produktů (IP).',
                 { label: t('btn.edit'), action: 'edit-ip' });
    const actionsHtml = ''+
      '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="add-ier"><i class="' + window.C3Hub.faIcon('Add') + '"></i> PŘIDAT PODLE IER</button>' +
      '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="add-ip"><i class="' + window.C3Hub.faIcon('Add') + '"></i> PŘIDAT PODLE IP</button>';
    return '<section class="c3-card-panel">' +
              '<header class="c3-card-panel__header">' +
                '<h2 class="c3-card-panel__title">' + esc(t('section.flows')) + '</h2>' +
                '<div class="c3-card-panel__actions">' + actionsHtml +
                  '<button class="c3-card-panel__toggle" data-action="toggle" aria-label="Sbalit / rozbalit">' +
                    '<i class="' + window.C3Hub.faIcon('ExpandLess') + '"></i>' +
                  '</button>' +
                '</div>' +
              '</header>' +
              '<div class="c3-card-panel__body">' +
                '<div class="c3-card-grid">' + tiles + '</div>' +
              '</div>' +
           '</section>';
  }

  // G014 – Sekce FMN instrukcí (13 dlaždic)
  function renderSectionFmn(cp) {
    const fmnList = window.MockData.catalogs.fmnInstrukce;
    const colors = ['blue','teal','violet','turquoise','orange','green','red-light-dark','amber','cyan','blue-gray','purple','pink','slate-gray'];
    const tiles = fmnList.map(function (fmn, i) {
      const assigned = (cp.fmnInstructions || []).indexOf(fmn.code) !== -1;
      return simpleTile(
        'fmn-' + fmn.code,
        fmn.label_cs,
        colors[i % colors.length],
        assigned ? 'Přiřazeno k tomuto MV. Klikněte pro úpravu.' : 'Není přiřazeno k tomuto MV.',
        { label: t('btn.edit'), action: 'edit-fmn-' + fmn.code },
        !assigned // disabled = neassigned (vizuálně grayscale)
      );
    }).join('');
    const actionsHtml = '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="add-fmn"><i class="' + window.C3Hub.faIcon('Add') + '"></i> PŘIDAT PODLE FMN INSTRUKCE</button>';
    return '<section class="c3-card-panel collapsed">' +
              '<header class="c3-card-panel__header">' +
                '<h2 class="c3-card-panel__title">' + esc(t('section.fmn')) + '</h2>' +
                '<div class="c3-card-panel__actions">' + actionsHtml +
                  '<button class="c3-card-panel__toggle" data-action="toggle" aria-label="Sbalit / rozbalit">' +
                    '<i class="' + window.C3Hub.faIcon('ExpandLess') + '"></i>' +
                  '</button>' +
                '</div>' +
              '</header>' +
              '<div class="c3-card-panel__body">' +
                '<div class="c3-card-grid">' + tiles + '</div>' +
              '</div>' +
           '</section>';
  }

  // G015 – Sekce ke stažení (3 dlaždice)
  function renderSectionDownload(cp) {
    const tiles =
      simpleTile('dl-basic',    t('tile.basicCard'),    'slate-gray', 'PDF základní karty MV (jednoduchá šablona).',
                 { label: t('btn.download_pdf'), action: 'dl-basic', variant: 'outlined' }) +
      simpleTile('dl-extended', t('tile.extendedCard'), 'turquoise',  'PDF rozšířené karty MV (komplet specifikace).',
                 { label: t('btn.download_pdf'), action: 'dl-extended', variant: 'outlined' }) +
      simpleTile('dl-cis',      t('tile.cisMatrix'),    'purple',     'XLSX CIS matice (přehled informačních toků v tabulce).',
                 { label: t('btn.download_xlsx'), action: 'dl-cis', variant: 'outlined' });
    return window.C3Hub.renderCardPanelHTML({
      title: t('section.download'),
      initiallyExpanded: true,
      bodyHTML: '<div class="c3-card-grid">' + tiles + '</div>'
    });
  }

  // Pomocná dlaždice
  function simpleTile(key, title, color, desc, action, disabled) {
    const variant = action && action.variant === 'outlined' ? 'c3-btn--outlined' : 'c3-btn--contained';
    const colorCls = window.C3Hub.cardColorClass(color);
    const disabledCls = disabled ? ' disabled' : '';
    let actionHtml = '';
    if (action) {
      actionHtml =
        '<div class="c3-simple-card__actions">' +
          '<button class="c3-btn ' + variant + ' c3-btn--sm" data-action="' + esc(action.action) + '">' +
            esc(action.label) +
          '</button>' +
        '</div>';
    }
    return '<div class="c3-simple-card' + disabledCls + '" data-tile-key="' + esc(key) + '">' +
              '<div class="c3-simple-card__header">' +
                '<div class="c3-simple-card__title">' + esc(title) + '</div>' +
              '</div>' +
              '<div class="c3-simple-card__color-block ' + colorCls + '">' +
                '<span class="label">' + esc(title) + '</span>' +
              '</div>' +
              '<div class="c3-simple-card__content">' +
                '<div class="c3-simple-card__description">' + esc(desc) + '</div>' +
              '</div>' +
              actionHtml +
           '</div>';
  }

  // Popisy do dlaždic
  function describeSpec(cp) {
    const parts = [];
    parts.push('Typ: ' + label('typMV', cp.typ));
    parts.push('Úroveň: ' + label('urovenMV', cp.level));
    parts.push('Mobilita: ' + label('mobilita', cp.mobilityType));
    if (cp.zodpovedna) parts.push('Zodp.: ' + cp.zodpovedna);
    return parts.join(' · ');
  }
  function describeCapabilities(cp) {
    const missions = (cp.capabilities.missions || []).map(function (m) { return label('druhMise', m); }).join(', ');
    const mcaCount = Object.keys(cp.capabilities.mca || {}).filter(function (k) { return cp.capabilities.mca[k]; }).length;
    return 'Druhy misí: ' + (missions || '—') + '. Podporovaných MCA subkategorií: ' + mcaCount + '.';
  }
  function describeStructure(cp) {
    const posCount = (cp.structure.positions || []).length;
    const noPos    = (cp.structure.rolesWithoutPosition || []).length;
    return 'Pozic: ' + posCount + ', rolí bez pozice: ' + noPos + '. Rozpad: ' +
           (cp.structure.breakdowns || []).join(', ') + '.';
  }

  Views.bindDetail = function (root) {
    const cpId = App.state.selectedId;
    // Edit akce v sekcích
    const map = {
      'edit-spec':         function () { window.Dialogs.openSpecification(cpId); },
      'edit-capabilities': function () { window.Dialogs.openCapabilities(cpId); },
      'edit-structure':    function () { window.Dialogs.openStructure(cpId); },
      'edit-ier':          function () { window.Dialogs.openInteractions(cpId, 'ier'); },
      'edit-ip':           function () { window.Dialogs.openInteractions(cpId, 'ip'); },
      'add-ier':           function () { window.Dialogs.openIerSelection(cpId); },
      'add-ip':            function () { window.Dialogs.openIpSelection(cpId); },
      'add-fmn':           function () { window.Dialogs.openFmnSelection(cpId); },
      'dl-basic':          function () { stubDownload('CP_' + cpId + '_basic_card.pdf', { type: 'basic' }); },
      'dl-extended':       function () { window.Dialogs.openReportOptions(cpId); },
      'dl-cis':            function () { window.Dialogs.openCisMatrixOptions(cpId); }
    };
    Object.keys(map).forEach(function (action) {
      root.querySelectorAll('[data-action="' + action + '"]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          map[action]();
        });
      });
    });
    // FMN per-instrukce edit
    root.querySelectorAll('[data-action^="edit-fmn-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const fmnCode = b.dataset.action.replace('edit-fmn-', '');
        alert('STUB: Otevřít editor FMN instrukce „' + fmnCode + '" pro MV ' + cpId +
              '.\nReálně by se zde otevřel dialog editoru interakcí (G021) filtrovaný na FMN.');
      });
    });
  };

  function stubDownload(filename, opts) {
    alert('STUB: stažení souboru\n\n' +
          'Soubor: ' + filename + '\n' +
          'Parametry: ' + JSON.stringify(opts, null, 2) +
          '\n\nV reálu by se nyní stáhl soubor z backendu.');
  }
  Views.stubDownload = stubDownload;

  global.Views = Views;

})(typeof window !== 'undefined' ? window : globalThis);
