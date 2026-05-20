/* ============================================================
   RQU004 – Views: ModelPage, ElementsPage, AllElements,
            PatchRequests, Metamodel
   ============================================================ */
(function (global) {
  'use strict';

  const Views = {};
  const esc = function (s) { return window.C3Hub.escapeHtml(s); };
  const fa  = function (i) { return window.C3Hub.faIcon(i); };
  const t   = function (k, p) { return window.C3Hub.t(k, p); };
  const MD  = function () { return window.MockData; };

  function stTitle(st) { return App.state.locale === 'en' ? st.titleEn : st.titleCs; }
  function stDesc(st)  { return App.state.locale === 'en' ? st.descEn : st.descCs; }

  /* ============================================================
     Dispatcher
     ============================================================ */
  Views.renderCurrent = function (state) {
    if (state.view === 'elements')        return renderElements(state);
    if (state.view === 'all')             return renderAllElements(state);
    if (state.view === 'patch-requests')  return renderPatchRequests();
    if (state.view === 'metamodel')       return renderMetamodel();
    return renderModel();
  };
  Views.bindCurrent = function (root) {
    if (App.state.view === 'model')             bindModel(root);
    else if (App.state.view === 'elements')     bindElements(root);
    else if (App.state.view === 'all')          bindAllElements(root);
    else if (App.state.view === 'patch-requests') bindPatchRequests(root);
  };

  /* ============================================================
     G001 – ModelPage (rozcestník)
     ============================================================ */
  function tileCard(st) {
    return '<a class="c3-simple-card" href="#/elements/' + st.code + '" data-st="' + st.code + '">' +
             '<div class="c3-simple-card__header"><div class="c3-simple-card__title">' + esc(stTitle(st)) + '</div></div>' +
             '<div class="c3-simple-card__color-block ' + window.C3Hub.cardColorClass(st.color) + '">' +
               '<span class="label">' + esc(st.code) + '</span>' +
             '</div>' +
             '<div class="c3-simple-card__content">' +
               '<div class="c3-simple-card__description">' + esc(stDesc(st)) + '</div>' +
             '</div>' +
             '<div class="c3-simple-card__actions">' +
               '<span class="c3-btn c3-btn--contained c3-btn--sm">' + esc(t('btn.show')) + '</span>' +
             '</div>' +
           '</a>';
  }
  function linkCard(href, title, desc, color, icon, external) {
    return '<a class="c3-simple-card" href="' + esc(href) + '"' + (external ? '' : '') + '>' +
             '<div class="c3-simple-card__header"><div class="c3-simple-card__title">' + esc(title) + '</div></div>' +
             '<div class="c3-simple-card__color-block ' + window.C3Hub.cardColorClass(color) + '">' +
               '<i class="' + fa(icon) + '" style="font-size:2.4rem;color:#fff;opacity:0.8;"></i>' +
             '</div>' +
             '<div class="c3-simple-card__content"><div class="c3-simple-card__description">' + esc(desc) + '</div></div>' +
             '<div class="c3-simple-card__actions">' +
               '<span class="c3-btn c3-btn--contained c3-btn--sm">' + esc(t('btn.open')) + '</span>' +
             '</div>' +
           '</a>';
  }

  function renderModel() {
    const main = MD().stereotypes.filter(function (s) { return s.group === 'main'; });
    const catalog = MD().stereotypes.filter(function (s) { return s.group === 'catalog'; });

    // Panel Hlavní modely – s akcí Vyhledat
    const mainPanel =
      '<section class="c3-card-panel">' +
        '<header class="c3-card-panel__header">' +
          '<h2 class="c3-card-panel__title">' + esc(t('panel.main')) + '</h2>' +
          '<div class="c3-card-panel__actions">' +
            '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="search-all">' +
              '<i class="' + fa('Search') + '"></i> ' + esc(t('btn.search')) + '</button>' +
            '<button class="c3-card-panel__toggle" data-action="toggle"><i class="' + fa('ExpandLess') + '"></i></button>' +
          '</div>' +
        '</header>' +
        '<div class="c3-card-panel__body"><div class="c3-card-grid">' +
          main.map(tileCard).join('') +
        '</div></div>' +
      '</section>';

    const catalogPanel = window.C3Hub.renderCardPanelHTML({
      title: t('panel.catalog'), initiallyExpanded: true,
      bodyHTML: '<div class="c3-card-grid">' + catalog.map(tileCard).join('') + '</div>'
    });

    const catalogsPanel = window.C3Hub.renderCardPanelHTML({
      title: t('panel.catalogs'), initiallyExpanded: true,
      bodyHTML: '<div class="c3-card-grid">' +
        linkCard('../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/prototype-catalogs.html#/requirement',
                 t('tile.requirements'), t('tile.requirements.d'), 'yellow', 'Feed', true) +
        linkCard('../RQU010%20-%20Číselníky%20pozadavku%20a%20omezeni/prototype-catalogs.html#/constraint',
                 t('tile.constraints'), t('tile.constraints.d'), 'red-light-dark', 'Warning', true) +
      '</div>'
    });

    const otherPanel = window.C3Hub.renderCardPanelHTML({
      title: t('panel.other'), initiallyExpanded: true,
      bodyHTML: '<div class="c3-card-grid">' +
        linkCard('#/metamodel', t('module.metamodel'), t('tile.metamodel.d'), 'blue-gray', 'Feed', false) +
        linkCard('#/patch-requests', t('module.patchRequests'), t('tile.patch.d'), 'orange-deep', 'OpenInNew', false) +
      '</div>'
    });

    return '<section>' +
             '<h1 class="md-heading">' + esc(t('module.model')) + '</h1>' +
             '<div class="md-subheading">' + esc(t('model.subtitle')) + '</div>' +
             mainPanel + catalogPanel + catalogsPanel + otherPanel +
           '</section>';
  }
  function bindModel(root) {
    const searchBtn = root.querySelector('[data-action="search-all"]');
    if (searchBtn) searchBtn.addEventListener('click', function () { App.go('#/all'); });
  }

  /* ============================================================
     G004 – tabulka prvků (sdílená)
     ============================================================ */
  function tsBadge(ts) {
    const variant = ts === 'APPROVED' ? 'ok' : (ts === 'UPDATED' ? 'info' : 'warn');
    return window.C3Hub.renderStavBadgeHTML({ label: t('ts.' + ts), variant: variant });
  }
  function elementColumns(showStereotype) {
    const cols = [
      { field: 'actions', label: t('col.actions'), class: 'col-actions', render: function (e) {
          const st = MD().stereotype(e.stereotype);
          const btns = [{ icon: 'Edit', tooltip: t('act.translate'), action: 'translate-' + e.id }];
          if (st.editRel)     btns.push({ icon: 'OpenInNew', tooltip: t('act.relations'), action: 'relations-' + e.id });
          btns.push({ icon: 'ChevronRight', tooltip: t('act.archirepo'), action: 'archirepo-' + e.id });
          if (st.relevantMv)  btns.push({ icon: 'Home', tooltip: t('act.relevantMv'), action: 'relevant-' + e.id });
          if (st.editable && !st.readOnly) btns.push({ icon: 'Add', tooltip: t('act.duplicate'), action: 'duplicate-' + e.id });
          return window.C3Hub.actionButtonsHTML(btns);
        } }
    ];
    if (showStereotype) {
      cols.push({ field: 'stereotype', label: t('col.stereotype'), render: function (e) {
        return '<span class="md-st-chip">' + esc(e.stereotype) + '</span>';
      } });
    }
    cols.push({ field: 'code', label: t('col.code') });
    cols.push({ field: 'name', label: t('col.nameEn') });
    cols.push({ field: 'nameCz', label: t('col.nameCz') });
    cols.push({ field: 'ts', label: t('col.translation'), render: function (e) { return tsBadge(e.ts); } });
    return cols;
  }
  function filterElements(list, q) {
    if (!q) return list;
    const norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    const nq = norm(q);
    return list.filter(function (e) {
      return norm(e.name).indexOf(nq) !== -1 || norm(e.nameCz).indexOf(nq) !== -1 ||
             norm(e.code).indexOf(nq) !== -1;
    });
  }

  /* ============================================================
     G003 – ElementsPage
     ============================================================ */
  function renderElements(state) {
    const st = MD().stereotype(state.stereotype);
    const all = MD().elementsByStereotype(state.stereotype);
    const rows = filterElements(all, state.searchQuery);
    const addBtn = (st.editable && !st.readOnly)
      ? '<button class="c3-btn c3-btn--contained" data-action="add-element">' +
          '<i class="' + fa('Add') + '"></i> ' + esc(t('btn.add')) + '</button>'
      : '';
    const roNote = st.readOnly
      ? '<div class="md-ro-note"><i class="' + fa('Info') + '"></i> ' + esc(t('elements.roNote')) + '</div>' : '';
    return '<section>' +
             '<h1 class="md-heading">' + esc(stTitle(st)) + '</h1>' +
             '<div class="md-subheading">' + esc(stDesc(st)) + '</div>' +
             roNote +
             '<div class="md-toolbar">' +
               '<input type="text" class="c3-form-input md-search" placeholder="' + esc(t('search.ph')) + '" ' +
                      'value="' + esc(state.searchQuery) + '" autocomplete="off">' +
               '<div class="c3-spacer"></div>' + addBtn +
             '</div>' +
             '<div class="md-count">' + esc(t('count', { n: rows.length })) + '</div>' +
             window.C3Hub.renderDataGridHTML({ rows: rows, getRowId: function (e) { return e.id; },
               emptyText: t('noResults'), columns: elementColumns(false) }) +
           '</section>';
  }
  function bindElements(root) {
    bindElementSearch(root, false);
    const addBtn = root.querySelector('[data-action="add-element"]');
    if (addBtn) addBtn.addEventListener('click', function () { window.Dialogs.openCreate(App.state.stereotype); });
    bindElementRowActions(root);
  }

  /* ============================================================
     G005 – AllModelElementsPage
     ============================================================ */
  function renderAllElements(state) {
    const rows = filterElements(MD().elements, state.searchQuery);
    return '<section>' +
             '<h1 class="md-heading">' + esc(t('search.title')) + '</h1>' +
             '<div class="md-subheading">' + esc(t('search.subtitle')) + '</div>' +
             '<div class="md-toolbar">' +
               '<input type="text" class="c3-form-input md-search" placeholder="' + esc(t('search.ph')) + '" ' +
                      'value="' + esc(state.searchQuery) + '" autocomplete="off">' +
             '</div>' +
             '<div class="md-count">' + esc(t('count', { n: rows.length })) + '</div>' +
             window.C3Hub.renderDataGridHTML({ rows: rows, getRowId: function (e) { return e.id; },
               emptyText: t('noResults'), columns: elementColumns(true) }) +
           '</section>';
  }
  function bindAllElements(root) {
    bindElementSearch(root, true);
    bindElementRowActions(root);
  }

  function bindElementSearch(root, showStereotype) {
    const search = root.querySelector('.md-search');
    if (!search) return;
    search.addEventListener('input', function (ev) {
      App.state.searchQuery = ev.target.value;
      const sec = root.querySelector('main');
      const base = App.state.view === 'all' ? MD().elements : MD().elementsByStereotype(App.state.stereotype);
      const rows = filterElements(base, App.state.searchQuery);
      const count = sec.querySelector('.md-count');
      if (count) count.textContent = t('count', { n: rows.length });
      const oldGrid = sec.querySelector('.c3-datagrid');
      if (oldGrid) {
        const wrap = document.createElement('div');
        wrap.innerHTML = window.C3Hub.renderDataGridHTML({ rows: rows, getRowId: function (e) { return e.id; },
          emptyText: t('noResults'), columns: elementColumns(showStereotype) });
        oldGrid.parentNode.replaceChild(wrap.firstChild, oldGrid);
        bindElementRowActions(root);
      }
    });
  }
  function bindElementRowActions(root) {
    root.querySelectorAll('.c3-datagrid [data-action^="translate-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openTranslate(b.dataset.action.replace('translate-', '')); });
    });
    root.querySelectorAll('.c3-datagrid [data-action^="relations-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openRelationships(b.dataset.action.replace('relations-', '')); });
    });
    root.querySelectorAll('.c3-datagrid [data-action^="archirepo-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        alert('STUB: otevření grafu sousedství prvku v ArchiRepo na nové záložce.');
      });
    });
    root.querySelectorAll('.c3-datagrid [data-action^="relevant-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openRelevantMv(b.dataset.action.replace('relevant-', '')); });
    });
    root.querySelectorAll('.c3-datagrid [data-action^="duplicate-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openDuplicate(b.dataset.action.replace('duplicate-', '')); });
    });
    window.C3Hub.bindDataGridRowClick(root, function (rowId) { window.Dialogs.openTranslate(rowId); });
  }

  /* ============================================================
     G012 – Patch Requests
     ============================================================ */
  function renderPatchRequests() {
    const isAdmin = window.C3Hub.isAdministrator(App.state.user);
    const rows = MD().patchRequests.slice().sort(function (a, b) { return a.requestedAt < b.requestedAt ? 1 : -1; });
    const cols = [
      { field: 'actions', label: t('col.actions'), class: 'col-actions', render: function (p) {
          if (isAdmin && p.state === 'REQUESTED') {
            return window.C3Hub.actionButtonsHTML([{ icon: 'Feed', tooltip: t('act.detail'), action: 'pr-' + p.id }]);
          }
          return '<span class="c3-text-muted" style="font-size:0.8125rem;">—</span>';
        } }
    ];
    if (isAdmin) cols.push({ field: 'requestedBy', label: t('pr.requestedBy') });
    cols.push({ field: 'requestedAt', label: t('pr.requestedAt'), format: 'datetime' });
    cols.push({ field: 'element', label: t('pr.element'), render: function (p) { return esc(p.elementName); } });
    cols.push({ field: 'state', label: t('pr.state'), render: function (p) {
      const variant = p.state === 'APPROVED' ? 'ok' : (p.state === 'REJECTED' ? 'error' : 'warn');
      return window.C3Hub.renderStavBadgeHTML({ label: t('prstate.' + p.state), variant: variant });
    } });
    return '<section>' +
             '<h1 class="md-heading">' + esc(t('module.patchRequests')) + '</h1>' +
             '<div class="md-subheading">' + esc(t('pr.subtitle')) + '</div>' +
             window.C3Hub.renderCardPanelHTML({
               title: t('module.patchRequests'), initiallyExpanded: true,
               bodyHTML: window.C3Hub.renderDataGridHTML({ rows: rows, getRowId: function (p) { return p.id; }, columns: cols })
             }) +
           '</section>';
  }
  function bindPatchRequests(root) {
    root.querySelectorAll('.c3-datagrid [data-action^="pr-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openPatchRequestDetail(b.dataset.action.replace('pr-', '')); });
    });
    window.C3Hub.bindDataGridRowClick(root, function (rowId) {
      const p = MD().patchRequests.filter(function (x) { return x.id === rowId; })[0];
      if (p && p.state === 'REQUESTED' && window.C3Hub.isAdministrator(App.state.user)) {
        window.Dialogs.openPatchRequestDetail(rowId);
      }
    });
  }

  /* ============================================================
     G014 – Metamodel
     ============================================================ */
  function renderMetamodel() {
    function imgPanel(titleKey, descKey, fileName, expanded) {
      const body =
        '<p class="md-mm-desc">' + esc(t(descKey)) + '</p>' +
        '<div class="md-mm-image">' +
          '<i class="' + fa('Feed') + '"></i>' +
          '<div class="md-mm-image__name">' + esc(fileName) + '</div>' +
          '<div class="md-mm-image__hint">' + esc(t('mm.placeholder')) + '</div>' +
        '</div>';
      return window.C3Hub.renderCardPanelHTML({ title: t(titleKey), initiallyExpanded: expanded, bodyHTML: body });
    }
    return '<section>' +
             '<h1 class="md-heading">' + esc(t('module.metamodel')) + '</h1>' +
             '<div class="md-subheading">' + esc(t('mm.subtitle')) + '</div>' +
             imgPanel('mm.domain', 'mm.domain.d', 'metamodel.jpg', true) +
             imgPanel('mm.fmn', 'mm.fmn.d', 'metamodelFMN.jpeg', false) +
           '</section>';
  }

  global.Views = Views;

})(typeof window !== 'undefined' ? window : globalThis);
