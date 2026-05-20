/* ============================================================
   RQU004 – Dialogy (G006–G016)
   ============================================================
   Vystavuje window.Dialogs.* – open* funkce pro modální dialogy.
   ============================================================ */
(function (global) {
  'use strict';

  const Dialogs = {};
  const esc = function (s) { return window.C3Hub.escapeHtml(s); };
  const fa  = function (i) { return window.C3Hub.faIcon(i); };
  const t   = function (k, p) { return window.C3Hub.t(k, p); };
  const MD  = function () { return window.MockData; };
  const COUNTRIES = ['CZE', 'SVK', 'POL', 'DEU', 'USA'];

  function footer(cancelLabel, primaryLabel, primaryClass, disabled) {
    return '<button class="c3-btn c3-btn--text" data-action="cancel">' + esc(cancelLabel) + '</button>' +
           '<button class="c3-btn ' + primaryClass + '" data-action="submit"' + (disabled ? ' disabled' : '') + '>' +
             esc(primaryLabel) + '</button>';
  }
  function tsBadge(ts) {
    const v = ts === 'APPROVED' ? 'ok' : (ts === 'UPDATED' ? 'info' : 'warn');
    return window.C3Hub.renderStavBadgeHTML({ label: t('ts.' + ts), variant: v });
  }

  /* ============================================================
     G006 / G016 – Vytvoření prvku
     ============================================================ */
  Dialogs.openCreate = function (stCode) {
    const st = MD().stereotype(stCode);
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-create', title: t('dlg.create'), size: 'lg',
      bodyHTML: elementContentForm(st, null, false),
      footerHTML: footer(t('btn.cancel'), t('btn.create'), 'c3-btn--contained', true)
    }));
    wireElementForm(bd, st);
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const data = readElementForm(bd);
      const e = {
        id: MD().nextId('el'), stereotype: stCode, code: MD().nextCode(stCode),
        name: data.name, nameCz: data.nameCz || '—', ts: 'AI_TRANSLATED',
        description: data.descEn || (data.name + ' — newly proposed model element.'),
        descriptionCz: data.descCz || '', relationships: []
      };
      MD().elements.push(e);
      App.closeModal();
      App.rerender();
      App.toast(t('toast.created'));
    });
  };

  /* ============================================================
     G010 – Duplikace prvku
     ============================================================ */
  Dialogs.openDuplicate = function (elId) {
    const e = MD().findElement(elId);
    if (!e) return;
    const st = MD().stereotype(e.stereotype);
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-dup', title: t('dlg.duplicate') + ' : ' + e.name, size: 'lg',
      bodyHTML: elementContentForm(st, e, true),
      footerHTML: footer(t('btn.cancel'), t('btn.duplicate'), 'c3-btn--contained', false)
    }));
    wireElementForm(bd, st);
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const data = readElementForm(bd);
      if (!data.name) { showFieldError(bd, 'name', true); return; }
      const copy = {
        id: MD().nextId('el'), stereotype: e.stereotype, code: MD().nextCode(e.stereotype),
        name: data.name, nameCz: data.nameCz || '—', ts: 'AI_TRANSLATED',
        description: data.descEn || e.description || '',
        descriptionCz: data.descCz || e.descriptionCz || '',
        relationships: e.relationships.map(function (r) { return Object.assign({}, r); })
      };
      MD().elements.push(copy);
      App.closeModal();
      App.rerender();
      App.toast(t('toast.duplicated'));
    });
  };

  function elementContentForm(st, e, isDuplicate) {
    const isCis = st.code === 'CISAPP' || st.code === 'CISDEV';
    const idVal = e ? (isDuplicate ? MD().nextId('el') : e.id) : MD().nextId('el');
    let html =
      '<div class="md-help"><i class="' + fa('Info') + '"></i> ' + esc(t('create.help')) + '</div>' +
      '<div class="c3-form-row">' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.id')) + '</label>' +
          '<input type="text" class="c3-form-input" value="' + esc(idVal) + '" readonly>' +
        '</div>' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.stereotype')) + '</label>' +
          '<input type="text" class="c3-form-input" value="' + esc(st.code) + ' – ' + esc(App.state.locale === 'en' ? st.titleEn : st.titleCs) + '" readonly>' +
        '</div>' +
      '</div>';
    if (isCis) {
      html += '<div class="c3-form-row full"><div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.country')) + '<span class="req">*</span></label>' +
          '<select class="c3-form-select" data-field="country"><option value="">' + esc(t('select.placeholder')) + '</option>' +
            COUNTRIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('') +
          '</select>' +
          '<div class="md-field-error c3-hidden" data-err="country">' + esc(t('err.required')) + '</div>' +
        '</div></div>';
    }
    html +=
      '<div class="c3-form-row">' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.nameEn')) + '<span class="req">*</span></label>' +
          '<input type="text" class="c3-form-input" data-field="name" autocomplete="off" value="' + esc(e ? e.name : '') + '">' +
          '<div class="md-field-error c3-hidden" data-err="name">' + esc(t('err.required')) + '</div>' +
        '</div>' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.nameCz')) + '</label>' +
          '<input type="text" class="c3-form-input" data-field="nameCz" autocomplete="off" value="' + esc(e ? (e.nameCz === '—' ? '' : e.nameCz) : '') + '">' +
        '</div>' +
      '</div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.descEn')) + '</label>' +
        '<textarea class="c3-form-textarea" data-field="descEn">' + esc(e ? (e.description || '') : '') + '</textarea>' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.descCz')) + '</label>' +
        '<textarea class="c3-form-textarea" data-field="descCz">' + esc(e ? (e.descriptionCz || '') : '') + '</textarea>' +
      '</div></div>' +
      '<div class="md-rel-note"><i class="' + fa('OpenInNew') + '"></i> ' +
        esc(isDuplicate ? t('create.relNoteDup') : t('create.relNote')) + '</div>';
    return html;
  }
  function wireElementForm(bd, st) {
    const isCis = st.code === 'CISAPP' || st.code === 'CISDEV';
    const name = bd.querySelector('[data-field="name"]');
    const country = bd.querySelector('[data-field="country"]');
    const submit = bd.querySelector('[data-action="submit"]');
    function reval() {
      submit.disabled = !name.value.trim() || (isCis && country && !country.value);
    }
    name.addEventListener('input', reval);
    if (country) country.addEventListener('change', reval);
    reval();
  }
  function readElementForm(bd) {
    return {
      name: bd.querySelector('[data-field="name"]').value.trim(),
      nameCz: bd.querySelector('[data-field="nameCz"]').value.trim(),
      descEn: bd.querySelector('[data-field="descEn"]').value.trim(),
      descCz: bd.querySelector('[data-field="descCz"]').value.trim()
    };
  }
  function showFieldError(bd, name, on) {
    const errEl = bd.querySelector('[data-err="' + name + '"]');
    const inp = bd.querySelector('[data-field="' + name + '"]');
    if (errEl) errEl.classList.toggle('c3-hidden', !on);
    if (inp) inp.classList.toggle('invalid', on);
  }

  /* ============================================================
     G007 – Editace překladů prvku
     ============================================================ */
  Dialogs.openTranslate = function (elId) {
    const e = MD().findElement(elId);
    if (!e) return;
    const st = MD().stereotype(e.stereotype);
    const body =
      '<div class="md-help"><i class="' + fa('Info') + '"></i> ' + esc(t('translate.help')) + '</div>' +
      '<div class="c3-form-row">' +
        roField(t('f.code'), e.code) + roField(t('f.stereotype'), st.code) +
      '</div>' +
      '<div class="c3-form-row">' +
        roField(t('f.id'), e.id) + roField(t('col.translation'), t('ts.' + e.ts)) +
      '</div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.nameEn')) + '</label>' +
        '<input type="text" class="c3-form-input" value="' + esc(e.name) + '" readonly>' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.nameCz')) + '</label>' +
        '<input type="text" class="c3-form-input" data-field="nameCz" autocomplete="off" value="' + esc(e.nameCz === '—' ? '' : e.nameCz) + '">' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.descEn')) + '</label>' +
        '<textarea class="c3-form-textarea" data-field="descEn" style="min-height:110px;" readonly>' + esc(e.description || '') + '</textarea>' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.descCz')) + '</label>' +
        '<textarea class="c3-form-textarea" data-field="descCz" style="min-height:110px;">' + esc(e.descriptionCz || '') + '</textarea>' +
      '</div></div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-translate', title: t('dlg.translate') + ' · ' + e.name, size: 'lg',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.save'), 'c3-btn--success', false)
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const cz = bd.querySelector('[data-field="nameCz"]').value.trim();
      e.nameCz = cz || '—';
      e.descriptionCz = bd.querySelector('[data-field="descCz"]').value.trim();
      e.ts = 'UPDATED';
      App.closeModal();
      App.rerender();
      App.toast(t('toast.translated'));
    });
  };
  function roField(label, value) {
    return '<div class="c3-form-group">' +
             '<label class="c3-form-label">' + esc(label) + '</label>' +
             '<input type="text" class="c3-form-input" value="' + esc(value) + '" readonly>' +
           '</div>';
  }

  /* ============================================================
     G011 / G011a – Relevantní MV
     ============================================================ */
  Dialogs.openRelevantMv = function (elId) {
    const e = MD().findElement(elId);
    if (!e) return;
    const cps = MD().capabilityCps[elId] || [];
    let body;
    if (!cps.length) {
      body = '<div class="c3-datagrid"><div class="c3-datagrid__empty">' + esc(t('relevant.empty')) + '</div></div>';
    } else {
      body = window.C3Hub.renderDataGridHTML({
        rows: cps, getRowId: function (c) { return c.code; },
        columns: [
          { field: 'code', label: t('f.code') },
          { field: 'name', label: t('relevant.name') },
          { field: 'type', label: t('relevant.type') },
          { field: 'level', label: t('relevant.level') }
        ]
      });
    }
    App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-relevant', title: t('dlg.relevant') + ' · ' + e.name, size: 'lg',
      bodyHTML: '<p style="margin-bottom:12px;color:var(--c3-text-muted);">' + esc(t('relevant.help')) + '</p>' + body,
      footerHTML: '<button class="c3-btn c3-btn--contained" data-action="cancel">' + esc(t('btn.close')) + '</button>'
    }));
  };

  /* ============================================================
     G008 / G008a / G009 / G015 – Vztahy prvku + Patch Request
     ============================================================ */
  let relSession = null;

  Dialogs.openRelationships = function (elId) {
    const e = MD().findElement(elId);
    if (!e) return;
    const allowed = MD().allowedTargets[e.stereotype] || [];
    relSession = {
      element: e,
      allowed: allowed,
      activeTab: allowed[0] || null,
      working: e.relationships.map(function (r) { return Object.assign({}, r, { _state: 'existing' }); })
    };
    const header =
      '<div class="c3-form-row">' +
        roField(t('f.nameEn'), e.name) + roField(t('f.code'), e.code) +
      '</div>' +
      '<div class="c3-form-row">' +
        roField(t('f.stereotype'), MD().stereotype(e.stereotype).code) +
        roField(t('f.nameCz'), e.nameCz) +
      '</div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-rel', title: t('dlg.relationships') + ' · ' + e.name, size: 'xl',
      bodyHTML: header + '<div id="rel-panel"></div>',
      footerHTML: '<button class="c3-btn c3-btn--text" data-action="cancel">' + esc(t('btn.cancel')) + '</button>' +
                  '<button class="c3-btn c3-btn--contained" data-action="send">' + esc(t('btn.sendApproval')) + '</button>'
    }));
    refreshRelPanel(bd);
    bd.querySelector('[data-action="send"]').addEventListener('click', function () {
      const toAdd = relSession.working.filter(function (r) { return r._state === 'add'; });
      const toDelete = relSession.working.filter(function (r) { return r._state === 'delete'; });
      if (!toAdd.length && !toDelete.length) { App.toast(t('rel.noChanges')); return; }
      openSummary(toAdd, toDelete);
    });
  };

  function refreshRelPanel(bd) {
    const panel = bd.querySelector('#rel-panel');
    const allowed = relSession.allowed;
    if (!allowed.length) {
      panel.innerHTML = '<div class="md-help">' + esc(t('rel.noTabs')) + '</div>';
      return;
    }
    const tabs = allowed.map(function (code) {
      const count = relSession.working.filter(function (r) {
        return r.targetStereotype === code && r._state !== 'removed';
      }).length;
      return '<button class="md-rel-tab' + (code === relSession.activeTab ? ' active' : '') + '" data-tab="' + code + '">' +
               esc(code) + ' <span class="md-rel-tab__count">' + count + '</span>' +
             '</button>';
    }).join('');

    const rows = relSession.working.filter(function (r) {
      return r.targetStereotype === relSession.activeTab && r._state !== 'removed';
    });
    let table;
    if (!rows.length) {
      table = '<div class="c3-datagrid"><div class="c3-datagrid__empty">' + esc(t('rel.empty')) + '</div></div>';
    } else {
      table = '<table class="md-rel-table"><thead><tr>' +
        '<th style="width:1%;">' + esc(t('col.actions')) + '</th>' +
        '<th>' + esc(t('rel.element')) + '</th><th>' + esc(t('f.code')) + '</th>' +
        '<th>' + esc(t('rel.direction')) + '</th><th>' + esc(t('rel.type')) + '</th>' +
        '</tr></thead><tbody>' +
        rows.map(function (r, i) {
          const cls = r._state === 'add' ? ' md-rel-row--add' : (r._state === 'delete' ? ' md-rel-row--del' : '');
          let act;
          if (r._state === 'add') {
            act = '<button class="c3-icon-btn c3-icon-btn--danger" data-rel-remove="' + i + '" title="' + esc(t('rel.remove')) + '"><i class="' + fa('Close') + '"></i></button>';
          } else if (r._state === 'delete') {
            act = '<button class="c3-icon-btn" data-rel-undo="' + i + '" title="' + esc(t('rel.undo')) + '"><i class="' + fa('Refresh') + '"></i></button>';
          } else {
            act = '<button class="c3-icon-btn c3-icon-btn--danger" data-rel-del="' + i + '" title="' + esc(t('rel.markDelete')) + '"><i class="' + fa('Delete') + '"></i></button>';
          }
          const dir = r.direction === 'in'
            ? '<i class="' + fa('ChevronLeft') + '"></i> ' + esc(t('rel.in'))
            : '<i class="' + fa('ChevronRight') + '"></i> ' + esc(t('rel.out'));
          return '<tr class="' + cls + '">' +
            '<td>' + act + '</td>' +
            '<td>' + esc(r.targetName) + (r._new ? ' <span class="md-rel-new">' + esc(t('rel.newEl')) + '</span>' : '') + '</td>' +
            '<td>' + esc(r.targetCode) + '</td>' +
            '<td>' + dir + '</td>' +
            '<td><span class="md-rel-type">' + esc(r.type) + '</span></td>' +
          '</tr>';
        }).join('') +
        '</tbody></table>';
    }
    panel.innerHTML =
      '<div class="md-rel-tabs">' + tabs + '</div>' +
      '<div class="md-rel-toolbar">' +
        '<button class="c3-btn c3-btn--contained c3-btn--sm" data-action="add-rel">' +
          '<i class="' + fa('Add') + '"></i> ' + esc(t('rel.add')) + '</button>' +
      '</div>' +
      table;

    // bind
    panel.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () { relSession.activeTab = b.dataset.tab; refreshRelPanel(bd); });
    });
    const addBtn = panel.querySelector('[data-action="add-rel"]');
    if (addBtn) addBtn.addEventListener('click', function () { openCreateRelationship(bd); });
    // řádkové akce – index v rámci filtrovaných rows; mapuj zpět na working
    panel.querySelectorAll('[data-rel-del]').forEach(function (b) {
      b.addEventListener('click', function () { rowAction(bd, rows[+b.dataset.relDel], 'delete'); });
    });
    panel.querySelectorAll('[data-rel-undo]').forEach(function (b) {
      b.addEventListener('click', function () { rowAction(bd, rows[+b.dataset.relUndo], 'undo'); });
    });
    panel.querySelectorAll('[data-rel-remove]').forEach(function (b) {
      b.addEventListener('click', function () { rowAction(bd, rows[+b.dataset.relRemove], 'remove'); });
    });
  }
  function rowAction(bd, relObj, action) {
    if (!relObj) return;
    if (action === 'delete') relObj._state = 'delete';
    else if (action === 'undo') relObj._state = 'existing';
    else if (action === 'remove') {
      relSession.working = relSession.working.filter(function (r) { return r !== relObj; });
    }
    refreshRelPanel(bd);
  }

  /* G009 – Vytvoření vztahu */
  function openCreateRelationship(parentBd) {
    const targetSt = relSession.activeTab;
    const existing = MD().elementsByStereotype(targetSt);
    const body =
      '<div class="md-help"><i class="' + fa('Info') + '"></i> ' +
        esc(t('relcreate.help', { st: targetSt })) + '</div>' +
      '<div class="md-radio-group">' +
        '<label class="md-radio"><input type="radio" name="relmode" value="existing" checked> ' + esc(t('relcreate.existing')) + '</label>' +
        '<label class="md-radio"><input type="radio" name="relmode" value="new"> ' + esc(t('relcreate.new')) + '</label>' +
      '</div>' +
      '<div data-mode="existing">' +
        '<div class="c3-form-row full"><div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('relcreate.pickEl')) + '<span class="req">*</span></label>' +
          '<select class="c3-form-select" data-field="existing">' +
            '<option value="">' + esc(t('select.placeholder')) + '</option>' +
            existing.map(function (e) { return '<option value="' + esc(e.id) + '">' + esc(e.code + ' – ' + e.name) + '</option>'; }).join('') +
          '</select>' +
        '</div></div>' +
      '</div>' +
      '<div data-mode="new" class="c3-hidden">' +
        '<div class="c3-form-row full"><div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('relcreate.newName')) + '<span class="req">*</span></label>' +
          '<input type="text" class="c3-form-input" data-field="newName" autocomplete="off">' +
        '</div></div>' +
        '<div class="c3-form-row full"><div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.descEn')) + '</label>' +
          '<textarea class="c3-form-textarea" data-field="newDesc"></textarea>' +
        '</div></div>' +
      '</div>' +
      '<div class="c3-form-row">' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('rel.type')) + '</label>' +
          '<select class="c3-form-select" data-field="type">' +
            MD().relationshipTypes.map(function (rt) { return '<option value="' + rt + '">' + rt + '</option>'; }).join('') +
          '</select>' +
        '</div>' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('rel.direction')) + '</label>' +
          '<select class="c3-form-select" data-field="direction">' +
            '<option value="out">' + esc(t('rel.out')) + '</option>' +
            '<option value="in">' + esc(t('rel.in')) + '</option>' +
          '</select>' +
        '</div>' +
      '</div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-relcreate', title: t('dlg.relCreate'), size: 'md',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.create'), 'c3-btn--contained', false)
    }));
    bd.querySelectorAll('input[name="relmode"]').forEach(function (r) {
      r.addEventListener('change', function () {
        bd.querySelector('[data-mode="existing"]').classList.toggle('c3-hidden', r.value !== 'existing');
        bd.querySelector('[data-mode="new"]').classList.toggle('c3-hidden', r.value === 'existing');
      });
    });
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const mode = bd.querySelector('input[name="relmode"]:checked').value;
      const type = bd.querySelector('[data-field="type"]').value;
      const direction = bd.querySelector('[data-field="direction"]').value;
      let entry;
      if (mode === 'existing') {
        const id = bd.querySelector('[data-field="existing"]').value;
        if (!id) { App.toast(t('err.pickEl')); return; }
        const target = MD().findElement(id);
        entry = { id: MD().nextId('rel'), targetId: id, targetName: target.name, targetCode: target.code,
                  targetStereotype: targetSt, type: type, direction: direction, _state: 'add', _new: false };
      } else {
        const nm = bd.querySelector('[data-field="newName"]').value.trim();
        if (!nm) { App.toast(t('err.required')); return; }
        entry = { id: MD().nextId('rel'), targetId: MD().nextId('el'), targetName: nm,
                  targetCode: MD().nextCode(targetSt), targetStereotype: targetSt,
                  type: type, direction: direction, _state: 'add', _new: true };
      }
      relSession.working.push(entry);
      App.closeModal(bd);
      refreshRelPanel(parentBd);
    });
  }

  /* G015 – Souhrn plánovaných změn */
  function openSummary(toAdd, toDelete) {
    function relTable(list, cls) {
      if (!list.length) return '<div class="md-summary-empty">' + esc(t('summary.none')) + '</div>';
      return '<table class="md-rel-table ' + cls + '"><thead><tr>' +
        '<th>' + esc(t('rel.element')) + '</th><th>' + esc(t('f.code')) + '</th>' +
        '<th>' + esc(t('rel.direction')) + '</th><th>' + esc(t('rel.type')) + '</th>' +
        '</tr></thead><tbody>' +
        list.map(function (r) {
          return '<tr><td>' + esc(r.targetName) + '</td><td>' + esc(r.targetCode) + '</td>' +
                 '<td>' + esc(t('rel.' + (r.direction || 'out'))) + '</td>' +
                 '<td>' + esc(r.type) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }
    const body =
      '<h4 class="md-summary-h md-summary-h--add">' + esc(t('summary.toAdd')) + '</h4>' +
      relTable(toAdd, 'md-rel-table--add') +
      '<h4 class="md-summary-h md-summary-h--del">' + esc(t('summary.toDelete')) + '</h4>' +
      relTable(toDelete, 'md-rel-table--del');
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-summary', title: t('dlg.summary'), size: 'lg',
      bodyHTML: body,
      footerHTML: '<button class="c3-btn c3-btn--text" data-action="cancel">' + esc(t('btn.backToEdit')) + '</button>' +
                  '<button class="c3-btn c3-btn--contained" data-action="submit">' + esc(t('btn.sendApproval')) + '</button>'
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const e = relSession.element;
      MD().patchRequests.unshift({
        id: 'PR-' + (2050 + MD().patchRequests.length),
        requestedBy: window.C3Hub.formatLoginWithFullName(App.state.user),
        requestedAt: new Date().toISOString(), state: 'REQUESTED',
        elementId: e.id, elementName: e.name,
        toAdd: toAdd.map(stripRel), toDelete: toDelete.map(stripRel)
      });
      App.closeAllModals();
      App.toast(t('toast.prCreated'));
      App.rerender();
    });
  }
  function stripRel(r) {
    return { targetName: r.targetName, targetCode: r.targetCode, targetStereotype: r.targetStereotype,
             type: r.type, direction: r.direction || 'out' };
  }

  /* ============================================================
     G013 – Detail patch requestu
     ============================================================ */
  Dialogs.openPatchRequestDetail = function (prId) {
    const pr = MD().patchRequests.filter(function (x) { return x.id === prId; })[0];
    if (!pr) return;
    const isAdmin = window.C3Hub.isAdministrator(App.state.user);
    const decisive = isAdmin && pr.state === 'REQUESTED';

    function relTable(list, cls) {
      if (!list.length) return '<div class="md-summary-empty">' + esc(t('summary.none')) + '</div>';
      return '<table class="md-rel-table ' + cls + '"><thead><tr>' +
        '<th>' + esc(t('rel.element')) + '</th><th>' + esc(t('f.code')) + '</th>' +
        '<th>' + esc(t('rel.type')) + '</th></tr></thead><tbody>' +
        list.map(function (r) {
          return '<tr><td>' + esc(r.targetName) + '</td><td>' + esc(r.targetCode) + '</td><td>' + esc(r.type) + '</td></tr>';
        }).join('') + '</tbody></table>';
    }
    const stateVariant = pr.state === 'APPROVED' ? 'ok' : (pr.state === 'REJECTED' ? 'error' : 'warn');
    const body =
      '<div class="md-pr-meta">' +
        '<div><span class="md-pr-meta__l">' + esc(t('pr.requestedAt')) + '</span>' + esc(window.C3Hub.formatDateTime(pr.requestedAt)) + '</div>' +
        '<div><span class="md-pr-meta__l">' + esc(t('pr.state')) + '</span>' +
          window.C3Hub.renderStavBadgeHTML({ label: t('prstate.' + pr.state), variant: stateVariant }) + '</div>' +
        '<div><span class="md-pr-meta__l">' + esc(t('pr.requestedBy')) + '</span>' + esc(pr.requestedBy) + '</div>' +
        '<div><span class="md-pr-meta__l">' + esc(t('pr.element')) + '</span>' + esc(pr.elementName) + '</div>' +
      '</div>' +
      '<h4 class="md-summary-h md-summary-h--add">' + esc(t('summary.toAdd')) + '</h4>' +
      relTable(pr.toAdd, 'md-rel-table--add') +
      '<h4 class="md-summary-h md-summary-h--del">' + esc(t('summary.toDelete')) + '</h4>' +
      relTable(pr.toDelete, 'md-rel-table--del');

    let footerHtml;
    if (decisive) {
      footerHtml =
        '<button class="c3-btn c3-btn--danger" data-action="reject">' + esc(t('btn.reject')) + '</button>' +
        '<button class="c3-btn c3-btn--success" data-action="approve">' + esc(t('btn.approve')) + '</button>';
    } else {
      footerHtml = '<button class="c3-btn c3-btn--contained" data-action="cancel">' + esc(t('btn.close')) + '</button>';
    }
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-pr', title: t('dlg.prDetail') + ' · ' + pr.id, size: 'lg',
      bodyHTML: body, footerHTML: footerHtml
    }));
    if (decisive) {
      bd.querySelector('[data-action="approve"]').addEventListener('click', function () {
        pr.state = 'APPROVED';
        App.closeModal();
        App.rerender();
        App.toast(t('toast.prApproved'));
      });
      bd.querySelector('[data-action="reject"]').addEventListener('click', function () {
        pr.state = 'REJECTED';
        App.closeModal();
        App.rerender();
        App.toast(t('toast.prRejected'));
      });
    }
  };

  global.Dialogs = Dialogs;

})(typeof window !== 'undefined' ? window : globalThis);
