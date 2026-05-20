/* ============================================================
   RQU003 – Dialogy (G003, G009–G018)
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

  /* ---------- společné pomocné prvky ---------- */
  function footer(cancelLabel, primaryLabel, primaryClass, primaryAction) {
    return '<button class="c3-btn c3-btn--text" data-action="cancel">' + esc(cancelLabel) + '</button>' +
           '<button class="c3-btn ' + primaryClass + '" data-action="' + primaryAction + '">' + esc(primaryLabel) + '</button>';
  }
  function fieldError(name) {
    return '<div class="mi-field-error c3-hidden" data-err="' + name + '">' + esc(t('err.required')) + '</div>';
  }
  function showError(bd, name, on) {
    const errEl = bd.querySelector('[data-err="' + name + '"]');
    const input = bd.querySelector('[data-field="' + name + '"]');
    if (errEl) errEl.classList.toggle('c3-hidden', !on);
    if (input) input.classList.toggle('invalid', on);
  }
  function cpSelectOptions(selected) {
    return MD().commandPosts.map(function (cp) {
      return '<option value="' + esc(cp.id) + '"' + (cp.id === selected ? ' selected' : '') + '>' +
               esc(cp.name + ' (' + cp.type + ')') + '</option>';
    }).join('');
  }
  function checkboxList(name, options) {
    return '<div class="mi-chk-list" data-chklist="' + name + '">' +
      options.map(function (o) {
        return '<label class="mi-chk"><input type="checkbox" value="' + esc(o.value) + '"' +
               (o.checked ? ' checked' : '') + '> ' + esc(o.label) + '</label>';
      }).join('') + '</div>';
  }
  function chkValues(bd, name) {
    return Array.prototype.slice.call(
      bd.querySelectorAll('[data-chklist="' + name + '"] input:checked')
    ).map(function (i) { return i.value; });
  }

  /* ============================================================
     G003 – Vytvoření mise
     ============================================================ */
  Dialogs.openCreateMission = function () {
    const body = missionForm(null);
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-create', title: t('dlg.createMission'), size: 'md',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.create'), 'c3-btn--contained', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const data = readMissionForm(bd);
      if (!validateMissionForm(bd, data)) return;
      const m = {
        id: MD().nextId('m'), name: data.name, description: data.description,
        invalidated: false, missionTypeIds: data.types, missionOwnerId: data.owner,
        planning: {}, c2: []
      };
      MD().missions.push(m);
      App.closeModal();
      App.toast(t('toast.missionCreated'));
      App.navigateToDetail(m.id);
    });
  };

  /* ============================================================
     G009 – Editace detailu mise
     ============================================================ */
  Dialogs.openEditDetail = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-edit', title: t('dlg.editMission'), size: 'md',
      bodyHTML: missionForm(m), footerHTML: footer(t('btn.cancel'), t('btn.save'), 'c3-btn--success', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const data = readMissionForm(bd);
      if (!validateMissionForm(bd, data)) return;
      m.name = data.name; m.description = data.description;
      m.missionTypeIds = data.types; m.missionOwnerId = data.owner;
      App.closeModal();
      App.rerender();
      App.toast(t('toast.missionSaved'));
    });
  };

  function missionForm(m) {
    return '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.name')) + '<span class="req">*</span></label>' +
        '<input type="text" class="c3-form-input" data-field="name" autocomplete="off" value="' + esc(m ? m.name : '') + '">' +
        fieldError('name') +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.owner')) + '<span class="req">*</span></label>' +
        '<select class="c3-form-select" data-field="owner">' +
          '<option value="">' + esc(t('select.placeholder')) + '</option>' +
          cpSelectOptions(m ? m.missionOwnerId : '') +
        '</select>' + fieldError('owner') +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.types')) + '<span class="req">*</span></label>' +
        checkboxList('types', MD().missionTypes.map(function (mt) {
          return { value: mt.id, label: mt.name, checked: m ? m.missionTypeIds.indexOf(mt.id) !== -1 : false };
        })) + fieldError('types') +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.description')) + '</label>' +
        '<textarea class="c3-form-textarea" data-field="description">' + esc(m ? (m.description || '') : '') + '</textarea>' +
      '</div></div>';
  }
  function readMissionForm(bd) {
    return {
      name: bd.querySelector('[data-field="name"]').value.trim(),
      owner: bd.querySelector('[data-field="owner"]').value,
      types: chkValues(bd, 'types'),
      description: bd.querySelector('[data-field="description"]').value.trim()
    };
  }
  function validateMissionForm(bd, data) {
    let ok = true;
    showError(bd, 'name', !data.name);  if (!data.name) ok = false;
    showError(bd, 'owner', !data.owner); if (!data.owner) ok = false;
    const noType = data.types.length === 0;
    const typesErr = bd.querySelector('[data-err="types"]');
    if (typesErr) typesErr.classList.toggle('c3-hidden', !noType);
    if (noType) ok = false;
    return ok;
  }

  /* ============================================================
     G010 – Duplikace mise
     ============================================================ */
  Dialogs.openDuplicate = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const body =
      '<div class="mi-help"><i class="' + fa('Info') + '"></i> ' + esc(t('dup.help')) + '</div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('f.newName')) + '<span class="req">*</span></label>' +
        '<input type="text" class="c3-form-input" data-field="name" autocomplete="off" value="' + esc(m.name + ' (kopie)') + '">' +
        '<div class="mi-field-error c3-hidden" data-err="name"></div>' +
      '</div></div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-dup', title: t('dlg.duplicate'), size: 'sm',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.duplicate'), 'c3-btn--contained', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const name = bd.querySelector('[data-field="name"]').value.trim();
      const errEl = bd.querySelector('[data-err="name"]');
      const input = bd.querySelector('[data-field="name"]');
      if (!name) { errEl.textContent = t('err.required'); errEl.classList.remove('c3-hidden'); input.classList.add('invalid'); return; }
      if (name === m.name) { errEl.textContent = t('err.sameName'); errEl.classList.remove('c3-hidden'); input.classList.add('invalid'); return; }
      const copy = {
        id: MD().nextId('m'), name: name, description: m.description, invalidated: false,
        missionTypeIds: m.missionTypeIds.slice(), missionOwnerId: m.missionOwnerId,
        planning: JSON.parse(JSON.stringify(m.planning)), c2: JSON.parse(JSON.stringify(m.c2))
      };
      MD().missions.push(copy);
      App.closeModal();
      App.toast(t('toast.duplicated'));
      App.navigateToDetail(copy.id);
    });
  };

  /* ============================================================
     G011 – Potvrzení zneplatnění mise
     ============================================================ */
  Dialogs.openInvalidateConfirm = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const body = '<p style="margin-bottom:8px;"><strong>' + esc(m.name) + '</strong></p>' +
                 '<p>' + esc(t('inv.warning')) + '</p>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-inv', title: t('dlg.invalidate'), size: 'xs',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.invalidate'), 'c3-btn--danger', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      m.invalidated = true;
      m.invalidatedBy = window.C3Hub.formatLoginWithFullName(App.state.user);
      m.invalidatedAt = new Date().toISOString();
      App.closeModal();
      App.toast(t('toast.invalidated'));
      App.navigateToList();
    });
  };

  /* ---------- Obnovení mise (generický confirm) ---------- */
  Dialogs.openRestoreConfirm = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const body = '<p style="margin-bottom:8px;"><strong>' + esc(m.name) + '</strong></p>' +
                 '<p>' + esc(t('restore.warning')) + '</p>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-restore', title: t('dlg.restore'), size: 'xs',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.restore'), 'c3-btn--success', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      m.invalidated = false;
      m.restoredBy = window.C3Hub.formatLoginWithFullName(App.state.user);
      m.restoredAt = new Date().toISOString();
      App.closeModal();
      App.toast(t('toast.restored'));
      App.rerender();
    });
  };

  /* ============================================================
     G012 – Vytvoření C2 vazby (směrová)
     ============================================================ */
  Dialogs.openC2Create = function (missionId, pov, direction) {
    const m = MD().findMission(missionId);
    if (!m) return;
    // direction 'superior': pov je podřízený, vybíráme nadřízené MV
    // direction 'subordinate': pov je nadřízený, vybíráme podřízené MV
    const povLabel   = direction === 'superior' ? t('c2.colSubordinate') : t('c2.colSuperior');
    const otherLabel = direction === 'superior' ? t('c2.colSuperior')   : t('c2.colSubordinate');
    const others = MD().commandPosts.filter(function (cp) { return cp.id !== pov; });

    const body =
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(povLabel) + '</label>' +
        '<input type="text" class="c3-form-input" value="' + esc(MD().cpLabel(pov)) + '" readonly>' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(otherLabel) + '<span class="req">*</span></label>' +
        checkboxList('others', others.map(function (cp) { return { value: cp.id, label: cp.name + ' (' + cp.type + ')' }; })) +
        '<div class="mi-field-error c3-hidden" data-err="others">' + esc(t('err.pickMv')) + '</div>' +
      '</div></div>' +
      '<div class="c3-form-row full"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('c2.colType')) + '<span class="req">*</span></label>' +
        '<select class="c3-form-select" data-field="type">' +
          MD().c2Types.map(function (ty) { return '<option value="' + ty + '">' + ty + ' – ' + esc(t('c2type.' + ty)) + '</option>'; }).join('') +
        '</select>' +
      '</div></div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-c2', title: t('dlg.c2Create'), size: 'sm',
      bodyHTML: body, footerHTML: footer(t('btn.cancel'), t('btn.create'), 'c3-btn--contained', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const picked = chkValues(bd, 'others');
      const errEl = bd.querySelector('[data-err="others"]');
      if (!picked.length) { errEl.classList.remove('c3-hidden'); return; }
      errEl.classList.add('c3-hidden');
      const type = bd.querySelector('[data-field="type"]').value;
      picked.forEach(function (otherId) {
        m.c2.push({
          id: MD().nextId('c2'),
          superordinateId: direction === 'superior' ? otherId : pov,
          subordinateId:   direction === 'superior' ? pov : otherId,
          type: type
        });
      });
      App.closeModal();
      App.rerender();
      App.toast(t('toast.c2Created', { n: picked.length }));
    });
  };

  Dialogs.confirmDeleteC2 = function (missionId, c2Id) {
    const m = MD().findMission(missionId);
    if (!m) return;
    confirmDialog(t('dlg.delC2'), t('del.c2'), 'c3-btn--danger', t('btn.delete'), function () {
      m.c2 = m.c2.filter(function (c) { return c.id !== c2Id; });
      App.closeModal();
      App.rerender();
    });
  };

  /* ============================================================
     G016 – Výběr IER
     ============================================================ */
  Dialogs.openIerSelection = function (missionId, pov) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const planning = MD().getPlanning(m, pov);
    const available = MD().iers.filter(function (ier) { return planning.ierIds.indexOf(ier.id) === -1; });
    let body;
    if (!available.length) {
      body = '<div class="mi-help"><i class="' + fa('Info') + '"></i> ' + esc(t('ier.allAdded')) + '</div>';
    } else {
      body =
        '<div class="mi-help"><i class="' + fa('Info') + '"></i> ' + esc(t('ier.help')) + '</div>' +
        '<div class="c3-form-group">' +
          '<label class="c3-form-label">' + esc(t('f.ier')) + '<span class="req">*</span></label>' +
          checkboxList('iers', available.map(function (ier) {
            return { value: ier.id, label: ier.code + ' – ' + ier.name };
          })) +
          '<div class="mi-field-error c3-hidden" data-err="iers">' + esc(t('err.pickIer')) + '</div>' +
        '</div>';
    }
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-ier', title: t('dlg.ierSelect'), size: 'sm',
      bodyHTML: body,
      footerHTML: available.length
        ? footer(t('btn.cancel'), t('btn.add'), 'c3-btn--contained', 'submit')
        : '<button class="c3-btn c3-btn--contained" data-action="cancel">OK</button>'
    }));
    const submit = bd.querySelector('[data-action="submit"]');
    if (submit) submit.addEventListener('click', function () {
      const picked = chkValues(bd, 'iers');
      const errEl = bd.querySelector('[data-err="iers"]');
      if (!picked.length) { errEl.classList.remove('c3-hidden'); return; }
      picked.forEach(function (id) { planning.ierIds.push(id); });
      App.closeModal();
      App.rerender();
      App.toast(t('toast.ierAdded', { n: picked.length }));
    });
  };

  Dialogs.confirmDeleteIer = function (missionId, pov, ierId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const planning = MD().getPlanning(m, pov);
    confirmDialog(t('dlg.delIer'), t('del.ier', { ier: MD().ierLabel(ierId) }), 'c3-btn--danger', t('btn.delete'), function () {
      planning.ierIds = planning.ierIds.filter(function (id) { return id !== ierId; });
      planning.interactions = planning.interactions.filter(function (it) { return it.ierId !== ierId; });
      App.closeModal();
      App.rerender();
    });
  };

  Dialogs.confirmDeleteMv = function (missionId, pov, ierId, mvId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const planning = MD().getPlanning(m, pov);
    confirmDialog(t('dlg.delMv'), t('del.mv', { mv: MD().cpName(mvId) }), 'c3-btn--danger', t('btn.delete'), function () {
      planning.interactions = planning.interactions.filter(function (it) {
        return !(it.ierId === ierId && it.targetMvId === mvId);
      });
      App.closeModal();
      App.rerender();
    });
  };

  /* ============================================================
     G017 + G018 – Konfigurace interakcí MV
     ============================================================ */
  Dialogs.openCpInteraction = function (missionId, pov, ierId, editMvId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const planning = MD().getPlanning(m, pov);
    const ier = MD().findIer(ierId);
    const editing = !!editMvId;

    // Cílové MV: select (přidání) nebo readonly (úprava)
    const others = MD().commandPosts.filter(function (cp) { return cp.id !== pov; });
    const targetField = editing
      ? '<input type="text" class="c3-form-input" value="' + esc(MD().cpLabel(editMvId)) + '" readonly>'
      : '<select class="c3-form-select" data-field="target">' +
          '<option value="">' + esc(t('select.placeholder')) + '</option>' +
          others.map(function (cp) { return '<option value="' + esc(cp.id) + '">' + esc(cp.name + ' (' + cp.type + ')') + '</option>'; }).join('') +
        '</select>';

    // G018 – stromový grid IER → TIN
    const existing = {};
    if (editing) {
      planning.interactions.forEach(function (it) {
        if (it.ierId === ierId && it.targetMvId === editMvId) existing[it.tinId] = it;
      });
    }
    const tinRows = ier.tinIds.map(function (tinId) {
      const tin = MD().findTin(tinId);
      const ex = existing[tinId];
      return '<tr data-tin="' + esc(tinId) + '">' +
               '<td class="mi-g018-tinid">' + esc(tin.code) + '</td>' +
               '<td>' + esc(tin.name) + '</td>' +
               '<td>' + roleCellEditor('consumer', ex ? ex.consumer : false, ex ? ex.consumerPace : null) + '</td>' +
               '<td>' + roleCellEditor('provider', ex ? ex.provider : false, ex ? ex.providerPace : null) + '</td>' +
             '</tr>';
    }).join('');
    const grid =
      '<table class="mi-g018">' +
        '<thead><tr>' +
          '<th>' + esc(t('col.treeId')) + '</th><th>' + esc(t('col.nameEn')) + '</th>' +
          '<th>' + esc(t('col.consumer')) + '</th><th>' + esc(t('col.provider')) + '</th>' +
        '</tr></thead>' +
        '<tbody>' +
          '<tr class="mi-g018-ier"><td colspan="4"><i class="' + fa('ChevronRight') + '" style="transform:rotate(90deg);"></i> ' +
            esc(ier.code + ' – ' + ier.name) + '</td></tr>' +
          tinRows +
        '</tbody>' +
      '</table>';

    const body =
      '<div class="c3-form-row"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('cpi.source')) + '</label>' +
        '<input type="text" class="c3-form-input" value="' + esc(MD().cpLabel(pov)) + '" readonly>' +
      '</div><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('cpi.target')) + '<span class="req">*</span></label>' +
        targetField + '<div class="mi-field-error c3-hidden" data-err="target">' + esc(t('err.required')) + '</div>' +
      '</div></div>' +
      '<div class="mi-g018-wrap">' + grid + '</div>' +
      '<div class="mi-field-error c3-hidden" data-err="role" style="margin-top:8px;">' + esc(t('err.pickRole')) + '</div>';

    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-cpi',
      title: (editing ? t('dlg.cpiEdit') : t('dlg.cpiAdd')) + ' · ' + ier.code,
      size: 'md', bodyHTML: body,
      footerHTML: footer(t('btn.cancel'), t('btn.save'), 'c3-btn--success', 'submit')
    }));

    // PACE select aktivní jen při zaškrtnuté roli
    bd.querySelectorAll('.mi-role-editor').forEach(function (cell) {
      const chk = cell.querySelector('input[type="checkbox"]');
      const sel = cell.querySelector('select');
      function sync() { sel.disabled = !chk.checked; }
      chk.addEventListener('change', sync);
      sync();
    });

    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const targetMv = editing ? editMvId : bd.querySelector('[data-field="target"]').value;
      if (!targetMv) { showError(bd, 'target', true); return; }
      showError(bd, 'target', false);

      const newInteractions = [];
      bd.querySelectorAll('tr[data-tin]').forEach(function (tr) {
        const tinId = tr.dataset.tin;
        const cCell = tr.querySelector('.mi-role-editor[data-role="consumer"]');
        const pCell = tr.querySelector('.mi-role-editor[data-role="provider"]');
        const consumer = cCell.querySelector('input').checked;
        const provider = pCell.querySelector('input').checked;
        if (consumer || provider) {
          newInteractions.push({
            id: MD().nextId('int'), ierId: ierId, targetMvId: targetMv, tinId: tinId,
            consumer: consumer, consumerPace: consumer ? cCell.querySelector('select').value : null,
            provider: provider, providerPace: provider ? pCell.querySelector('select').value : null
          });
        }
      });
      if (!newInteractions.length) {
        bd.querySelector('[data-err="role"]').classList.remove('c3-hidden');
        return;
      }
      // diff – odeber staré interakce (ier, targetMv), přidej nové
      planning.interactions = planning.interactions.filter(function (it) {
        return !(it.ierId === ierId && it.targetMvId === targetMv);
      });
      newInteractions.forEach(function (it) { planning.interactions.push(it); });
      App.closeModal();
      App.rerender();
      App.toast(t('toast.cpiSaved'));
    });
  };

  function roleCellEditor(role, checked, pace) {
    return '<div class="mi-role-editor" data-role="' + role + '">' +
             '<label class="mi-chk"><input type="checkbox"' + (checked ? ' checked' : '') + '></label>' +
             '<select class="c3-form-select mi-pace-select">' +
               MD().paceOptions.map(function (p) {
                 return '<option value="' + p + '"' + (p === pace ? ' selected' : '') + '>' + esc(t('pace.' + p)) + '</option>';
               }).join('') +
             '</select>' +
           '</div>';
  }

  /* ============================================================
     G014 – CIS matice mise
     ============================================================ */
  Dialogs.openCisMatrix = function (missionId, pov) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const planning = MD().getPlanning(m, pov);
    // dynamické TIN sloupce z interakcí
    const tinIds = [];
    planning.interactions.forEach(function (it) { if (tinIds.indexOf(it.tinId) === -1) tinIds.push(it.tinId); });
    const positions = [
      { pos: 'Velitel',             role: 'Konzument' },
      { pos: 'Zástupce velitele',   role: 'Poskytovatel' },
      { pos: 'Operační důstojník',  role: 'Konzument' },
      { pos: 'Spojovací důstojník', role: 'Poskytovatel' }
    ];
    let head = '<tr><th>' + esc(t('cis.position')) + '</th><th>' + esc(t('cis.role')) + '</th>';
    tinIds.forEach(function (id) { head += '<th>' + esc(MD().findTin(id).code) + '</th>'; });
    head += '</tr>';
    let bodyRows = positions.map(function (p, idx) {
      let cells = '<td>' + esc(p.pos) + '</td><td>' + esc(p.role) + '</td>';
      tinIds.forEach(function (id, ci) {
        const on = (idx + ci) % 2 === 0;
        cells += '<td style="text-align:center;">' +
          '<input type="checkbox" disabled' + (on ? ' checked' : '') + '></td>';
      });
      return '<tr>' + cells + '</tr>';
    }).join('');
    const matrix = tinIds.length
      ? '<table class="mi-cis"><thead>' + head + '</thead><tbody>' + bodyRows + '</tbody></table>'
      : '<div class="mi-empty">' + esc(t('cis.empty')) + '</div>';
    const body =
      '<div class="mi-help"><i class="' + fa('Info') + '"></i> ' + esc(t('cis.help', { cp: MD().cpName(pov) })) + '</div>' +
      '<div class="mi-cis-wrap">' + matrix + '</div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-cis', title: t('dlg.cisMatrix'), size: 'lg',
      bodyHTML: body,
      footerHTML: '<button class="c3-btn c3-btn--text" data-action="cancel">' + esc(t('btn.close')) + '</button>' +
                  '<button class="c3-btn c3-btn--contained" data-action="download">' +
                    '<i class="' + fa('Download') + '"></i> ' + esc(t('cis.download')) + '</button>'
    }));
    bd.querySelector('[data-action="download"]').addEventListener('click', function () {
      App.stubDownload('CIS_matice_' + missionId + '_' + pov + '.xlsx', { mission: missionId, cp: pov });
    });
  };

  /* ============================================================
     G015 – Možnosti reportu mise
     ============================================================ */
  Dialogs.openReportOptions = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const body =
      '<div class="c3-form-row"><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('report.variant')) + '</label>' +
        '<select class="c3-form-select" data-field="variant">' +
          MD().reportVariants.map(function (v) { return '<option value="' + v + '">' + esc(t('variant.' + v)) + '</option>'; }).join('') +
        '</select>' +
      '</div><div class="c3-form-group">' +
        '<label class="c3-form-label">' + esc(t('report.classification')) + '</label>' +
        '<select class="c3-form-select" data-field="classification">' +
          MD().classifications.map(function (c) { return '<option value="' + c + '">' + esc(t('class.' + c)) + '</option>'; }).join('') +
        '</select>' +
      '</div></div>' +
      '<div class="c3-form-hint">' + esc(t('report.langHint')) + '</div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-report', title: t('dlg.report'), size: 'sm',
      bodyHTML: body,
      footerHTML: footer(t('btn.cancel'), t('btn.download'), 'c3-btn--contained', 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', function () {
      const variant = bd.querySelector('[data-field="variant"]').value;
      const classification = bd.querySelector('[data-field="classification"]').value;
      App.closeModal();
      App.stubDownload('Report_' + m.name.replace(/\s+/g, '_') + '.pdf',
        { variant: variant, classification: classification, language: App.state.locale });
    });
  };

  /* ============================================================
     G013 – Graf mise (zjednodušená vizualizace)
     ============================================================ */
  Dialogs.openGraph = function (missionId) {
    const m = MD().findMission(missionId);
    if (!m) return;
    const views = MD().graphViews;
    const radio = views.map(function (v, i) {
      return '<label class="mi-radio"><input type="radio" name="graphview" value="' + v + '"' +
             (i === 0 ? ' checked' : '') + '> ' + esc(t('graphview.' + v)) + '</label>';
    }).join('');
    const body =
      '<div class="mi-graph-controls">' +
        '<span class="c3-form-label" style="margin:0 4px 0 0;">' + esc(t('graph.viewBy')) + '</span>' + radio +
      '</div>' +
      '<div class="mi-graph-canvas" id="mi-graph-canvas">' +
        '<svg class="mi-graph-svg" id="mi-graph-svg"></svg>' +
      '</div>' +
      '<div class="c3-form-hint">' + esc(t('graph.hint')) + '</div>';
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-graph', title: t('dlg.graph'), size: 'xl',
      bodyHTML: body,
      footerHTML: '<button class="c3-btn c3-btn--contained" data-action="cancel">' + esc(t('btn.close')) + '</button>'
    }));
    setupGraph(bd, m);
  };

  function graphModel(m, view) {
    // vrátí {nodes:[{id,label,x,y,kind}], edges:[{from,to,label}]}
    const W = 820, H = 380;
    function ring(items, mapper) {
      const n = items.length || 1;
      return items.map(function (it, i) {
        const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
        return mapper(it, 420 + Math.cos(ang) * 240, 190 + Math.sin(ang) * 130, i);
      });
    }
    if (view === 'C2') {
      const ids = {};
      m.c2.forEach(function (c) { ids[c.superordinateId] = true; ids[c.subordinateId] = true; });
      const cpIds = Object.keys(ids);
      const nodes = ring(cpIds, function (id, x, y) { return { id: id, label: MD().cpName(id), x: x, y: y, kind: 'cp' }; });
      const edges = m.c2.map(function (c) { return { from: c.superordinateId, to: c.subordinateId, label: c.type }; });
      return { nodes: nodes, edges: edges, w: W, h: H };
    }
    let items, prefix, labelFn, kind;
    if (view === 'IER')  { items = MD().iers;  prefix = 'g-ier-'; labelFn = function (x) { return x.code; }; kind = 'ier'; }
    else if (view === 'TIN') { items = MD().tins; prefix = 'g-tin-'; labelFn = function (x) { return x.code; }; kind = 'tin'; }
    else if (view === 'IP')  {
      items = [{ id: 'ip1', code: 'IP-01' }, { id: 'ip2', code: 'IP-02' }, { id: 'ip3', code: 'IP-03' }, { id: 'ip4', code: 'IP-04' }];
      prefix = 'g-'; labelFn = function (x) { return x.code; }; kind = 'ip';
    } else { // JF_WFF
      items = [
        { id: 'jf1', code: 'C2' }, { id: 'jf2', code: 'Fires' }, { id: 'jf3', code: 'Intel' },
        { id: 'jf4', code: 'Manoeuvre' }, { id: 'jf5', code: 'Sustain' }, { id: 'jf6', code: 'Protect' }
      ];
      prefix = 'g-'; labelFn = function (x) { return x.code; }; kind = 'jf';
    }
    const hub = { id: 'g-hub', label: m.name, x: 420, y: 190, kind: 'hub' };
    const nodes = [hub].concat(ring(items, function (it, x, y) {
      return { id: prefix + it.id, label: labelFn(it), x: x, y: y, kind: kind };
    }));
    const edges = nodes.slice(1).map(function (nd) { return { from: 'g-hub', to: nd.id, label: '' }; });
    return { nodes: nodes, edges: edges, w: W, h: H };
  }

  function setupGraph(bd, m) {
    const canvas = bd.querySelector('#mi-graph-canvas');
    let model;

    function draw(view) {
      model = graphModel(m, view);
      canvas.querySelectorAll('.mi-graph-node').forEach(function (n) { n.remove(); });
      const svg = bd.querySelector('#mi-graph-svg');
      svg.innerHTML = '';
      // hrany
      model.edges.forEach(function (e) {
        const a = nodeById(e.from), b = nodeById(e.to);
        if (!a || !b) return;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
        line.setAttribute('class', 'mi-graph-edge');
        line.dataset.from = e.from; line.dataset.to = e.to;
        svg.appendChild(line);
        if (e.label) {
          const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          txt.setAttribute('x', (a.x + b.x) / 2); txt.setAttribute('y', (a.y + b.y) / 2 - 4);
          txt.setAttribute('class', 'mi-graph-edge-label');
          txt.dataset.from = e.from; txt.dataset.to = e.to;
          txt.textContent = e.label;
          svg.appendChild(txt);
        }
      });
      // uzly
      model.nodes.forEach(function (nd) {
        const el = document.createElement('div');
        el.className = 'mi-graph-node mi-graph-node--' + nd.kind;
        el.style.left = nd.x + 'px';
        el.style.top = nd.y + 'px';
        el.textContent = nd.label;
        el.dataset.nodeId = nd.id;
        canvas.appendChild(el);
        makeDraggable(el, nd);
      });
    }
    function nodeById(id) { return model.nodes.filter(function (n) { return n.id === id; })[0]; }

    function makeDraggable(el, nd) {
      el.addEventListener('mousedown', function (ev) {
        ev.preventDefault();
        const startX = ev.clientX, startY = ev.clientY, ox = nd.x, oy = nd.y;
        function move(e) {
          nd.x = ox + (e.clientX - startX);
          nd.y = oy + (e.clientY - startY);
          el.style.left = nd.x + 'px';
          el.style.top = nd.y + 'px';
          updateEdges(nd.id);
        }
        function up() {
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
      });
    }
    function updateEdges(nodeId) {
      const svg = bd.querySelector('#mi-graph-svg');
      const nd = nodeById(nodeId);
      svg.querySelectorAll('line').forEach(function (line) {
        if (line.dataset.from === nodeId) { line.setAttribute('x1', nd.x); line.setAttribute('y1', nd.y); }
        if (line.dataset.to === nodeId)   { line.setAttribute('x2', nd.x); line.setAttribute('y2', nd.y); }
      });
      svg.querySelectorAll('text').forEach(function (txt) {
        if (txt.dataset.from === nodeId || txt.dataset.to === nodeId) {
          const a = nodeById(txt.dataset.from), b = nodeById(txt.dataset.to);
          txt.setAttribute('x', (a.x + b.x) / 2); txt.setAttribute('y', (a.y + b.y) / 2 - 4);
        }
      });
    }

    bd.querySelectorAll('input[name="graphview"]').forEach(function (r) {
      r.addEventListener('change', function () { if (r.checked) draw(r.value); });
    });
    draw('C2');
  }

  /* ---------- generický potvrzovací dialog ---------- */
  function confirmDialog(title, message, primaryClass, primaryLabel, onConfirm) {
    const bd = App.showModal(window.C3Hub.renderModalHTML({
      id: 'modal-confirm', title: title, size: 'xs',
      bodyHTML: '<p>' + esc(message) + '</p>',
      footerHTML: footer(t('btn.cancel'), primaryLabel, primaryClass, 'submit')
    }));
    bd.querySelector('[data-action="submit"]').addEventListener('click', onConfirm);
  }

  global.Dialogs = Dialogs;

})(typeof window !== 'undefined' ? window : globalThis);
