/* ============================================================
   RQU003 – Views: list (G001/G002) + detail (G004/G005-G008)
   ============================================================
   Vystavuje window.Views.{renderList, renderDetail, bindList, bindDetail}.
   ============================================================ */
(function (global) {
  'use strict';

  const Views = {};
  const esc = function (s) { return window.C3Hub.escapeHtml(s); };
  const fa  = function (i) { return window.C3Hub.faIcon(i); };
  const t   = function (k, p) { return window.C3Hub.t(k, p); };
  const MD  = function () { return window.MockData; };

  /* ============================================================
     LIST (G001 + G002)
     ============================================================ */
  Views.renderList = function () {
    const all = MD().missions;
    const active = all.filter(function (m) { return !m.invalidated; });
    const invalidated = all.filter(function (m) { return m.invalidated; });

    let html = '<h1 class="mi-page-heading">' + esc(t('module.missions')) + '</h1>';

    // Panel aktivních misí s akcí + Přidat
    html += renderPanelWithAction(t('panel.missions'), 'add-mission', t('btn.add'),
      active.length
        ? '<div class="c3-card-grid">' + active.map(function (m) { return missionCard(m, false); }).join('') + '</div>'
        : '<div class="mi-empty">' + esc(t('list.noActive')) + '</div>');

    // Panel zneplatněných misí – jen pokud existují
    if (invalidated.length) {
      html += window.C3Hub.renderCardPanelHTML({
        title: t('panel.invalidated'),
        initiallyExpanded: true,
        bodyHTML: '<div class="c3-card-grid">' + invalidated.map(function (m) { return missionCard(m, true); }).join('') + '</div>'
      });
    }
    return '<section>' + html + '</section>';
  };

  function renderPanelWithAction(title, actionKey, actionLabel, bodyHTML) {
    return '<section class="c3-card-panel">' +
              '<header class="c3-card-panel__header">' +
                '<h2 class="c3-card-panel__title">' + esc(title) + '</h2>' +
                '<div class="c3-card-panel__actions">' +
                  '<button class="c3-btn c3-btn--text c3-btn--sm" style="color:#fff;" data-action="' + esc(actionKey) + '">' +
                    '<i class="' + fa('Add') + '"></i> ' + esc(actionLabel) +
                  '</button>' +
                  '<button class="c3-card-panel__toggle" data-action="toggle" aria-label="Sbalit / rozbalit">' +
                    '<i class="' + fa('ExpandLess') + '"></i>' +
                  '</button>' +
                '</div>' +
              '</header>' +
              '<div class="c3-card-panel__body">' + bodyHTML + '</div>' +
           '</section>';
  }

  // G002 – dlaždice mise
  function missionCard(m, invalidated) {
    const colorMap = { 'mt-1': 'violet', 'mt-2': 'orange', 'mt-3': 'teal', 'mt-4': 'blue', 'mt-5': 'turquoise', 'mt-6': 'green' };
    const colorCls = window.C3Hub.cardColorClass(invalidated ? 'blue-gray' : (colorMap[m.missionTypeIds[0]] || 'blue-gray'));
    const typeNames = MD().missionTypeNames(m.missionTypeIds);

    let actions;
    if (invalidated) {
      actions = '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="restore-' + esc(m.id) + '">' +
                  '<i class="' + fa('Refresh') + '"></i> ' + esc(t('btn.restore')) +
                '</button>';
    } else {
      actions =
        '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="report-' + esc(m.id) + '">' +
          '<i class="' + fa('Feed') + '"></i> ' + esc(t('btn.report')) +
        '</button>' +
        '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="graph-' + esc(m.id) + '">' +
          esc(t('btn.graph')) +
        '</button>' +
        '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="open-' + esc(m.id) + '">' +
          esc(t('btn.edit')) +
        '</button>';
    }
    return '<div class="c3-simple-card mi-card' + (invalidated ? ' disabled' : '') + '" data-mission-id="' + esc(m.id) + '">' +
              '<div class="c3-simple-card__header">' +
                '<div class="c3-simple-card__title" title="' + esc(m.name) + '">' + esc(m.name) + '</div>' +
              '</div>' +
              '<div class="c3-simple-card__color-block ' + colorCls + '">' +
                '<span class="label">' + esc(m.name) + '</span>' +
              '</div>' +
              '<div class="c3-simple-card__content">' +
                '<div class="mi-card-types">' + esc(typeNames) + '</div>' +
                '<div class="c3-simple-card__description" title="' + esc(m.description || '') + '">' + esc(m.description || '') + '</div>' +
              '</div>' +
              '<div class="c3-simple-card__actions">' + actions + '</div>' +
           '</div>';
  }

  Views.bindList = function (root) {
    // + Přidat misi
    const addBtn = root.querySelector('[data-action="add-mission"]');
    if (addBtn) addBtn.addEventListener('click', function () { window.Dialogs.openCreateMission(); });

    // Klik na kartu = detail
    root.querySelectorAll('.mi-card:not(.disabled)').forEach(function (card) {
      card.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-action]')) return;
        App.navigateToDetail(card.dataset.missionId);
      });
    });
    // Akce na kartách
    root.querySelectorAll('[data-action^="open-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); App.navigateToDetail(b.dataset.action.replace('open-', '')); });
    });
    root.querySelectorAll('[data-action^="report-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openReportOptions(b.dataset.action.replace('report-', '')); });
    });
    root.querySelectorAll('[data-action^="graph-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openGraph(b.dataset.action.replace('graph-', '')); });
    });
    root.querySelectorAll('[data-action^="restore-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); window.Dialogs.openRestoreConfirm(b.dataset.action.replace('restore-', '')); });
    });
  };

  /* ============================================================
     DETAIL (G004)
     ============================================================ */
  Views.renderDetail = function (state) {
    const m = MD().findMission(state.selectedId);
    if (!m) {
      return '<div class="c3-news-panel"><div class="c3-news-panel__body">' +
             '<strong>Mise neexistuje.</strong> <a href="#/list">Zpět na seznam</a></div></div>';
    }
    return '<section class="mi-detail">' +
              '<h1 class="mi-page-heading">' + esc(m.name) + '</h1>' +
              renderDetailsSection(m) +
              renderPlanningSection(m, state) +
              renderDetailFooter(m) +
           '</section>';
  };

  // Sekce Detaily (read-only + ikona tužky)
  function renderDetailsSection(m) {
    const field = function (label, value) {
      return '<div class="mi-detail-field">' +
               '<div class="mi-detail-field__label">' + esc(label) + '</div>' +
               '<div class="mi-detail-field__value">' + esc(value || '—') + '</div>' +
             '</div>';
    };
    const body =
      '<div class="mi-detail-grid">' +
        field(t('f.name'), m.name) +
        field(t('f.owner'), MD().cpLabel(m.missionOwnerId)) +
        field(t('f.types'), MD().missionTypeNames(m.missionTypeIds)) +
      '</div>' +
      '<div class="mi-detail-field" style="margin-top:14px;">' +
        '<div class="mi-detail-field__label">' + esc(t('f.description')) + '</div>' +
        '<div class="mi-detail-field__value">' + esc(m.description || '—') + '</div>' +
      '</div>';
    return renderPanelWithIconAction(t('section.details'), 'edit-detail', 'Edit', body);
  }

  function renderPanelWithIconAction(title, actionKey, icon, bodyHTML) {
    return '<section class="c3-card-panel">' +
              '<header class="c3-card-panel__header">' +
                '<h2 class="c3-card-panel__title">' + esc(title) + '</h2>' +
                '<div class="c3-card-panel__actions">' +
                  '<button class="c3-icon-btn" style="color:#fff;" data-action="' + esc(actionKey) + '" title="' + esc(t('btn.edit')) + '">' +
                    '<i class="' + fa(icon) + '"></i>' +
                  '</button>' +
                  '<button class="c3-card-panel__toggle" data-action="toggle" aria-label="Sbalit / rozbalit">' +
                    '<i class="' + fa('ExpandLess') + '"></i>' +
                  '</button>' +
                '</div>' +
              '</header>' +
              '<div class="c3-card-panel__body">' + bodyHTML + '</div>' +
           '</section>';
  }

  // Sekce Plánování – výběr POV MV + záložky
  function renderPlanningSection(m, state) {
    const povOptions = '<option value="">' + esc(t('pov.placeholder')) + '</option>' +
      MD().commandPosts.map(function (cp) {
        return '<option value="' + esc(cp.id) + '"' + (state.pov === cp.id ? ' selected' : '') + '>' +
                 esc(cp.name + ' (' + cp.type + ')') + '</option>';
      }).join('');

    let body =
      '<div class="mi-pov-row">' +
        '<label class="c3-form-label">' + esc(t('f.pov')) + '<span class="req">*</span></label>' +
        '<select class="c3-form-select mi-pov-select" data-action="pov-select" style="max-width:420px;">' + povOptions + '</select>' +
      '</div>';

    if (!state.pov) {
      body += '<div class="mi-pov-hint"><i class="' + fa('Info') + '"></i> ' + esc(t('pov.hint')) + '</div>';
    } else {
      const tabBar =
        '<div class="mi-tabs">' +
          '<button class="mi-tab' + (state.detailTab === 'interactions' ? ' active' : '') + '" data-action="tab-interactions">' +
            esc(t('tab.interactions')) + '</button>' +
          '<button class="mi-tab' + (state.detailTab === 'c2' ? ' active' : '') + '" data-action="tab-c2">' +
            esc(t('tab.c2')) + '</button>' +
        '</div>';
      const tabBody = state.detailTab === 'interactions'
        ? renderInteractionsTab(m, state.pov)
        : renderC2Tab(m, state.pov);
      body += tabBar + '<div class="mi-tab-body">' + tabBody + '</div>';
    }
    return window.C3Hub.renderCardPanelHTML({ title: t('section.planning'), initiallyExpanded: true, bodyHTML: body });
  }

  // G005/G006 – záložka Interakce
  function renderInteractionsTab(m, pov) {
    const modeRadio =
      '<div class="mi-mode-row">' +
        '<span class="c3-form-label" style="margin:0 8px 0 0;">' + esc(t('planning.mode')) + '</span>' +
        '<label class="mi-radio"><input type="radio" name="planmode" checked> ' + esc(t('mode.capabilities')) + '</label>' +
        '<label class="mi-radio mi-radio--disabled"><input type="radio" name="planmode" disabled> ' +
          esc(t('mode.commandPosts')) + ' <span class="mi-disabled-tag">' + esc(t('disabled')) + '</span></label>' +
      '</div>';
    return modeRadio + renderPlanningGrid(m, pov);
  }

  // G006 – stromový plánovací grid IER → MV → TIN
  function renderPlanningGrid(m, pov) {
    const planning = MD().getPlanning(m, pov);
    const rows = buildPlanningRows(planning);

    const toolbar =
      '<div class="mi-grid-toolbar">' +
        '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="add-ier">' +
          '<i class="' + fa('Add') + '"></i> ' + esc(t('grid.addIer')) + '</button>' +
        '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="cis-matrix">' +
          '<i class="' + fa('Feed') + '"></i> ' + esc(t('grid.cisMatrix')) + '</button>' +
        '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="cis-download">' +
          '<i class="' + fa('Download') + '"></i> ' + esc(t('grid.cisDownload')) + '</button>' +
        '<div class="c3-spacer"></div>' +
        window.C3Hub.renderTreeToolbarHTML({ expandLabel: t('tree.expandAll'), collapseLabel: t('tree.collapseAll') }) +
      '</div>';

    if (!rows.length) {
      return toolbar + '<div class="mi-empty">' + esc(t('grid.empty')) + '</div>';
    }

    return window.C3Hub.renderTreeGridHTML({
      toolbarHTML: toolbar,
      rows: rows,
      getRowId: function (r) { return r.id; },
      getParentId: function (r) { return r.parentId; },
      getLabel: function (r) { return r.label; },
      childCount: function (r) {
        return rows.filter(function (x) { return x.parentId === r.id; }).length || null;
      },
      columns: [
        { field: '__actions', label: t('col.actions'), class: 'col-actions' },
        { field: '__tree-label', label: t('col.treeId') },
        { field: 'name', label: t('col.nameEn'), render: function (r) {
            if (r.type === 'ier') return esc(r.ier.name);
            if (r.type === 'tin') return esc(r.tin.name);
            return '';
          } },
        { field: 'consumer', label: t('col.consumer'), render: function (r) { return roleCell(r, 'consumer'); } },
        { field: 'provider', label: t('col.provider'), render: function (r) { return roleCell(r, 'provider'); } }
      ],
      actionsRender: function (r) { return planningRowActions(r); }
    });
  }

  function buildPlanningRows(planning) {
    const rows = [];
    planning.ierIds.forEach(function (ierId) {
      const ier = MD().findIer(ierId);
      rows.push({ id: 'n-ier-' + ierId, parentId: '', type: 'ier', ierId: ierId, ier: ier,
                  label: ier.code });
      // distinct target MV pro tento IER
      const mvIds = [];
      planning.interactions.forEach(function (it) {
        if (it.ierId === ierId && mvIds.indexOf(it.targetMvId) === -1) mvIds.push(it.targetMvId);
      });
      mvIds.forEach(function (mvId) {
        const mvRowId = 'n-mv-' + ierId + '-' + mvId;
        rows.push({ id: mvRowId, parentId: 'n-ier-' + ierId, type: 'mv', ierId: ierId, mvId: mvId,
                    label: MD().cpName(mvId) });
        planning.interactions.forEach(function (it) {
          if (it.ierId === ierId && it.targetMvId === mvId) {
            rows.push({ id: 'n-tin-' + it.id, parentId: mvRowId, type: 'tin',
                        interaction: it, tin: MD().findTin(it.tinId),
                        label: MD().findTin(it.tinId).code });
          }
        });
      });
    });
    return rows;
  }

  function roleCell(r, role) {
    if (r.type !== 'tin') return '';
    const it = r.interaction;
    const on = role === 'consumer' ? it.consumer : it.provider;
    const pace = role === 'consumer' ? it.consumerPace : it.providerPace;
    if (!on) return '<span class="mi-role-off">—</span>';
    return '<span class="mi-role-on"><i class="' + fa('CheckCircle') + '"></i></span>' +
           (pace ? ' <span class="mi-pace-badge">' + esc(t('pace.' + pace)) + '</span>' : '');
  }

  function planningRowActions(r) {
    if (r.type === 'ier') {
      return window.C3Hub.actionButtonsHTML([
        { icon: 'Add',          tooltip: t('act.addCpi'),  action: 'addcpi-' + r.ierId },
        { icon: 'Delete',       tooltip: t('act.delIer'),  action: 'delier-' + r.ierId, danger: true },
        { icon: 'OpenInNew',    tooltip: t('act.graphNb'), action: 'graphnb' }
      ]);
    }
    if (r.type === 'mv') {
      return window.C3Hub.actionButtonsHTML([
        { icon: 'Edit',      tooltip: t('act.editCpi'), action: 'editcpi-' + r.ierId + '~' + r.mvId },
        { icon: 'Delete',    tooltip: t('act.delMv'),   action: 'delmv-' + r.ierId + '~' + r.mvId, danger: true },
        { icon: 'OpenInNew', tooltip: t('act.graphNb'), action: 'graphnb' }
      ]);
    }
    return window.C3Hub.actionButtonsHTML([
      { icon: 'OpenInNew', tooltip: t('act.graphNb'), action: 'graphnb' }
    ]);
  }

  // G007/G008 – záložka Velení a řízení (2 gridy)
  function renderC2Tab(m, pov) {
    return '<div class="mi-c2-group">' +
              '<h3 class="mi-c2-heading">' + esc(t('c2.superior')) + '</h3>' +
              renderC2Grid(m, pov, 'superior') +
           '</div>' +
           '<div class="mi-c2-group">' +
              '<h3 class="mi-c2-heading">' + esc(t('c2.subordinate')) + '</h3>' +
              renderC2Grid(m, pov, 'subordinate') +
           '</div>';
  }

  function renderC2Grid(m, pov, direction) {
    // superior grid: vazby kde pov je podřízený → zobraz nadřízené MV
    // subordinate grid: vazby kde pov je nadřízený → zobraz podřízené MV
    const rows = m.c2.filter(function (c) {
      return direction === 'superior' ? c.subordinateId === pov : c.superordinateId === pov;
    });
    const otherLabel = direction === 'superior' ? t('c2.colSuperior') : t('c2.colSubordinate');
    const toolbar =
      '<div class="mi-grid-toolbar">' +
        '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="add-c2-' + direction + '">' +
          '<i class="' + fa('Add') + '"></i> ' + esc(t('c2.add')) + '</button>' +
      '</div>';
    const grid = window.C3Hub.renderDataGridHTML({
      rows: rows,
      getRowId: function (c) { return c.id; },
      emptyText: t('c2.empty'),
      columns: [
        { field: 'actions', label: t('col.actions'), class: 'col-actions', render: function (c) {
            return window.C3Hub.actionButtonsHTML([
              { icon: 'Delete', tooltip: t('c2.del'), action: 'delc2-' + c.id, danger: true }
            ]);
          } },
        { field: 'other', label: otherLabel, render: function (c) {
            return esc(MD().cpLabel(direction === 'superior' ? c.superordinateId : c.subordinateId));
          } },
        { field: 'type', label: t('c2.colType'), render: function (c) {
            return '<span class="mi-c2-type">' + esc(c.type) + '</span> ' +
                   '<span class="c3-text-muted" style="font-size:0.8125rem;">' + esc(t('c2type.' + c.type)) + '</span>';
          } }
      ]
    });
    return toolbar + grid;
  }

  // Patička detailu – Zneplatnit / Duplikovat
  function renderDetailFooter(m) {
    let btns = '';
    if (!m.invalidated) {
      btns += '<button class="c3-btn c3-btn--danger" data-action="invalidate-mission">' +
                '<i class="' + fa('Warning') + '"></i> ' + esc(t('btn.invalidate')) + '</button>';
    }
    btns += '<button class="c3-btn c3-btn--outlined" data-action="duplicate-mission">' +
              '<i class="' + fa('Add') + '"></i> ' + esc(t('btn.duplicate')) + '</button>';
    return '<div class="mi-detail-footer">' + btns + '</div>';
  }

  /* ============================================================
     bindDetail
     ============================================================ */
  Views.bindDetail = function (root) {
    const m = MD().findMission(App.state.selectedId);
    if (!m) return;

    // Editace detailu
    const editBtn = root.querySelector('[data-action="edit-detail"]');
    if (editBtn) editBtn.addEventListener('click', function () { window.Dialogs.openEditDetail(m.id); });

    // POV select
    const povSel = root.querySelector('[data-action="pov-select"]');
    if (povSel) povSel.addEventListener('change', function () {
      App.state.pov = povSel.value || null;
      App.state.detailTab = 'interactions';
      App.rerender();
    });

    // Záložky
    const tabI = root.querySelector('[data-action="tab-interactions"]');
    if (tabI) tabI.addEventListener('click', function () { App.state.detailTab = 'interactions'; App.rerender(); });
    const tabC = root.querySelector('[data-action="tab-c2"]');
    if (tabC) tabC.addEventListener('click', function () { App.state.detailTab = 'c2'; App.rerender(); });

    // Patička
    const invBtn = root.querySelector('[data-action="invalidate-mission"]');
    if (invBtn) invBtn.addEventListener('click', function () { window.Dialogs.openInvalidateConfirm(m.id); });
    const dupBtn = root.querySelector('[data-action="duplicate-mission"]');
    if (dupBtn) dupBtn.addEventListener('click', function () { window.Dialogs.openDuplicate(m.id); });

    // Planning grid toolbar
    bindIfPresent(root, 'add-ier',      function () { window.Dialogs.openIerSelection(m.id, App.state.pov); });
    bindIfPresent(root, 'cis-matrix',   function () { window.Dialogs.openCisMatrix(m.id, App.state.pov); });
    bindIfPresent(root, 'cis-download', function () { App.stubDownload('CIS_matice_' + m.id + '.xlsx', { mission: m.id, cp: App.state.pov }); });

    // Planning grid řádkové akce
    root.querySelectorAll('[data-action^="addcpi-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        window.Dialogs.openCpInteraction(m.id, App.state.pov, b.dataset.action.replace('addcpi-', ''), null);
      });
    });
    root.querySelectorAll('[data-action^="editcpi-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const parts = b.dataset.action.replace('editcpi-', '').split('~');
        window.Dialogs.openCpInteraction(m.id, App.state.pov, parts[0], parts[1]);
      });
    });
    root.querySelectorAll('[data-action^="delier-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        window.Dialogs.confirmDeleteIer(m.id, App.state.pov, b.dataset.action.replace('delier-', ''));
      });
    });
    root.querySelectorAll('[data-action^="delmv-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const parts = b.dataset.action.replace('delmv-', '').split('~');
        window.Dialogs.confirmDeleteMv(m.id, App.state.pov, parts[0], parts[1]);
      });
    });
    root.querySelectorAll('[data-action="graphnb"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        alert('STUB: otevření grafu sousedství prvku v ArchiRepo na nové záložce.');
      });
    });

    // C2 grid akce
    bindIfPresent(root, 'add-c2-superior',    function () { window.Dialogs.openC2Create(m.id, App.state.pov, 'superior'); });
    bindIfPresent(root, 'add-c2-subordinate', function () { window.Dialogs.openC2Create(m.id, App.state.pov, 'subordinate'); });
    root.querySelectorAll('[data-action^="delc2-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        window.Dialogs.confirmDeleteC2(m.id, b.dataset.action.replace('delc2-', ''));
      });
    });
  };

  function bindIfPresent(root, action, handler) {
    const el = root.querySelector('[data-action="' + action + '"]');
    if (el) el.addEventListener('click', function (ev) { ev.stopPropagation(); handler(); });
  }

  global.Views = Views;

})(typeof window !== 'undefined' ? window : globalThis);
