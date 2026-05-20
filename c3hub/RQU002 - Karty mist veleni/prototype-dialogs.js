/* ============================================================
   RQU002 – Dialogs: 11 modal dialogů G005..G028 + validace
   ============================================================
   Pokrytí UC: UC004 (G005 spec), UC005 (G007+G028 structure),
   UC006 (G009 capabilities), UC007 (G021 interactions),
   UC008 (download stubs přes G026/G027), UC009 (G020 create),
   UC010 (G005 subordinates + cycle check), UC011 (G022/G023/G025 LOV),
   UC012 (G026 report PDF), UC013 (G027 CIS XLSX), UC014 (G024 import).

   Modaly se appendují just-in-time na document.body a po close se
   po krátkém timeoutu odstraní. Sdílíme infrastrukturu C3Hub.renderModalHTML.
   ============================================================ */
(function (global) {
  'use strict';

  const Dialogs = {};
  const esc = function (s) { return window.C3Hub.escapeHtml(s); };
  const t   = function (k) { return window.C3Hub.t(k); };
  const label = function (cat, code) { return window.MockData.lookupLabel(cat, code); };

  let _modalCounter = 0;
  function nextModalId(prefix) { return (prefix || 'dlg') + '-' + (++_modalCounter); }

  // ============================================================
  // Pomocné rendery
  // ============================================================
  function renderTextField(props) {
    const id = props.id || ('fld-' + Math.random().toString(36).slice(2, 8));
    const reqMark = props.required ? '<span class="req">*</span>' : '';
    const helperHtml = props.helper ? '<div class="c3-form-hint">' + esc(props.helper) + '</div>' : '';
    return '<div class="c3-form-group">' +
              '<label class="c3-form-label" for="' + id + '">' + esc(props.label || '') + reqMark + '</label>' +
              '<input id="' + id + '" type="' + (props.type || 'text') + '" class="c3-form-input" ' +
                    'data-field="' + esc(props.field) + '" ' +
                    'value="' + esc(props.value != null ? props.value : '') + '" ' +
                    (props.readonly ? 'readonly' : '') + '>' +
              helperHtml +
              '<div class="cp-field-error" data-error-for="' + esc(props.field) + '" style="display:none;"></div>' +
           '</div>';
  }

  function renderTextarea(props) {
    return '<div class="c3-form-group">' +
              '<label class="c3-form-label">' + esc(props.label || '') + '</label>' +
              '<textarea class="c3-form-textarea" data-field="' + esc(props.field) + '" rows="' + (props.rows || 4) + '">' +
                esc(props.value || '') +
              '</textarea>' +
              '<div class="cp-field-error" data-error-for="' + esc(props.field) + '" style="display:none;"></div>' +
           '</div>';
  }

  function renderSelect(props) {
    const reqMark = props.required ? '<span class="req">*</span>' : '';
    const opts = (props.options || []).map(function (o) {
      const sel = (o.code === props.value) ? ' selected' : '';
      return '<option value="' + esc(o.code) + '"' + sel + '>' + esc(o.label_cs || o.label || o.code) + '</option>';
    }).join('');
    const blankFirst = props.placeholder ? '<option value="">' + esc(props.placeholder) + '</option>' : '';
    return '<div class="c3-form-group">' +
              '<label class="c3-form-label">' + esc(props.label || '') + reqMark + '</label>' +
              '<select class="c3-form-select" data-field="' + esc(props.field) + '">' +
                blankFirst + opts +
              '</select>' +
              '<div class="cp-field-error" data-error-for="' + esc(props.field) + '" style="display:none;"></div>' +
           '</div>';
  }

  function renderRadio(props) {
    const opts = (props.options || []).map(function (o) {
      const checked = (o.code === props.value) ? ' checked' : '';
      return '<label><input type="radio" name="' + esc(props.field) + '" value="' + esc(o.code) + '"' + checked + '> ' + esc(o.label_cs || o.label) + '</label>';
    }).join('');
    return '<div class="c3-form-group">' +
              '<label class="c3-form-label">' + esc(props.label || '') + '</label>' +
              '<div class="cp-radio-group" data-field="' + esc(props.field) + '">' + opts + '</div>' +
           '</div>';
  }

  function renderChips(props) {
    const isFreeText = !!props.freeText;
    const items = (props.value || []).map(function (code) {
      const lab = isFreeText ? code :
          (window.MockData.lookupCatalog(props.catalog, code) ? label(props.catalog, code) : code);
      return '<span class="cp-chip" data-code="' + esc(code) + '">' +
                esc(lab) +
                (props.readonly ? '' : '<button type="button" class="remove" data-action="chip-remove" data-code="' + esc(code) + '">×</button>') +
             '</span>';
    }).join('');
    const addBtn = props.readonly ? '' :
      '<button type="button" class="cp-chip-add" data-action="chip-add">+</button>';
    const handlerAttr = isFreeText ? ' data-handler="free-text"' : '';
    return '<div class="c3-form-group">' +
              '<label class="c3-form-label">' + esc(props.label || '') + '</label>' +
              '<div class="cp-chips ' + (props.readonly ? 'cp-chips-readonly' : '') + '" ' +
                   'data-field="' + esc(props.field) + '" ' +
                   'data-catalog="' + esc(props.catalog || '') + '"' + handlerAttr + '>' +
                items + addBtn +
              '</div>' +
           '</div>';
  }

  // Refresh chips s volným textem (G007 breakdowns)
  function refreshFreeTextChips(container, values) {
    const items = (values || []).map(function (code) {
      return '<span class="cp-chip" data-code="' + esc(code) + '">' + esc(code) +
                '<button type="button" class="remove" data-action="chip-remove" data-code="' + esc(code) + '">×</button>' +
             '</span>';
    }).join('');
    container.innerHTML = items + '<button type="button" class="cp-chip-add" data-action="chip-add">+</button>';
  }

  // Delegovaný event handler pro chips – jednou na modal, přežije rerendery
  function bindChips(modalEl, getDraft) {
    if (modalEl.__chipsDelegated) return;
    modalEl.__chipsDelegated = true;
    modalEl.addEventListener('click', function (ev) {
      const removeBtn = ev.target.closest('[data-action="chip-remove"]');
      if (removeBtn) {
        ev.stopPropagation();
        const container = removeBtn.closest('.cp-chips');
        if (!container || !modalEl.contains(container)) return;
        const field   = container.dataset.field;
        const catalog = container.dataset.catalog;
        const draft = getDraft();
        if (!draft || !Array.isArray(draft[field])) return;
        const code = removeBtn.dataset.code;
        draft[field] = draft[field].filter(function (c) { return c !== code; });
        refreshChips(container, draft[field], catalog);
        return;
      }
      const addBtn = ev.target.closest('[data-action="chip-add"]');
      if (addBtn) {
        ev.stopPropagation();
        const container = addBtn.closest('.cp-chips');
        if (!container || !modalEl.contains(container)) return;
        // Pokud field je override-nut (breakdowns v G007) – data-handler-override
        if (container.dataset.handler === 'free-text') return; // řeší si dialog sám
        const field   = container.dataset.field;
        const catalog = container.dataset.catalog;
        const draft = getDraft();
        if (!draft) return;
        const all = (window.MockData.catalogs[catalog] || []).filter(function (item) {
          return (draft[field] || []).indexOf(item.code) === -1;
        });
        if (!all.length) { alert('Všechny položky katalogu „' + catalog + '" už jsou přidány.'); return; }
        openLovPicker(catalog, all, function (selectedCodes) {
          if (!Array.isArray(draft[field])) draft[field] = [];
          selectedCodes.forEach(function (c) {
            if (draft[field].indexOf(c) === -1) draft[field].push(c);
          });
          refreshChips(container, draft[field], catalog);
        });
      }
    });
  }

  function refreshChips(container, values, catalog) {
    const items = (values || []).map(function (code) {
      const lab = label(catalog, code);
      return '<span class="cp-chip" data-code="' + esc(code) + '">' +
                esc(lab) +
                '<button type="button" class="remove" data-action="chip-remove" data-code="' + esc(code) + '">×</button>' +
             '</span>';
    }).join('');
    container.innerHTML = items + '<button type="button" class="cp-chip-add" data-action="chip-add">+</button>';
  }

  // Generic LOV picker (jednoduchý modal s checkboxy)
  function openLovPicker(catalog, items, onConfirm) {
    const id = nextModalId('lov');
    const rows = items.map(function (item) {
      return '<label style="display:flex; gap:8px; align-items:center; padding:6px 0; border-bottom: 1px solid #f0f0f0;">' +
                '<input type="checkbox" value="' + esc(item.code) + '"> ' +
                '<span><strong>' + esc(item.code) + '</strong> – ' + esc(item.label_cs || item.label || '') + '</span>' +
             '</label>';
    }).join('') || '<div style="padding:16px; font-style:italic; color: var(--c3-text-muted);">Žádné dostupné položky.</div>';

    const html = window.C3Hub.renderModalHTML({
      id: id,
      title: 'Výběr – ' + catalog,
      size: 'sm',
      bodyHTML: '<div style="max-height:50vh; overflow:auto;">' + rows + '</div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="confirm">OK</button>'
    });

    const wrap = appendModal(html, id, true);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-action="confirm"]').addEventListener('click', function () {
      const selected = Array.from(wrap.querySelectorAll('input[type="checkbox"]:checked')).map(function (cb) { return cb.value; });
      if (onConfirm) onConfirm(selected);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  }

  function appendModal(html, id, nested) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const node = wrap.firstChild;
    if (nested) node.classList.add('nested');
    document.body.appendChild(node);
    return node;
  }

  function closeAndRemove(id) {
    window.C3Hub.closeModal(id);
    setTimeout(function () {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 250);
  }

  function showFieldError(modalEl, field, message) {
    const errEl = modalEl.querySelector('[data-error-for="' + field + '"]');
    const inputEl = modalEl.querySelector('[data-field="' + field + '"]');
    if (errEl) {
      errEl.textContent = message || '';
      errEl.style.display = message ? 'block' : 'none';
    }
    if (inputEl) inputEl.classList.toggle('invalid', !!message);
  }

  function clearAllErrors(modalEl) {
    modalEl.querySelectorAll('.cp-field-error').forEach(function (e) { e.style.display = 'none'; e.textContent = ''; });
    modalEl.querySelectorAll('.invalid').forEach(function (e) { e.classList.remove('invalid'); });
  }

  function readInputs(modalEl, draft) {
    modalEl.querySelectorAll('[data-field]').forEach(function (input) {
      const f = input.dataset.field;
      if (input.tagName === 'INPUT' && input.type === 'checkbox') {
        draft[f] = input.checked;
      } else if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
        draft[f] = input.value;
      }
      // chips field je řízen jen přes bindChips (draft[f] už je pole)
    });
    // Radio buttons
    modalEl.querySelectorAll('.cp-radio-group').forEach(function (rg) {
      const f = rg.dataset.field;
      const checked = rg.querySelector('input[type="radio"]:checked');
      if (checked) draft[f] = checked.value;
    });
  }

  // ============================================================
  // G020 – Vytvoření MV (UC009)
  // ============================================================
  Dialogs.openCreateCp = function () {
    const id = nextModalId('create');
    const draft = { typ: '', nazev: '', popis: '' };

    const body =
      '<div class="cp-help">Vyplňte typ a název nové karty MV. Specifikaci doplníte na detailu.</div>' +
      renderSelect({ field: 'typ', label: 'Typ místa velení', required: true, options: window.MockData.catalogs.typMV, value: draft.typ, placeholder: '— Vyberte typ —' }) +
      renderTextField({ field: 'nazev', label: 'Název', required: true, value: draft.nazev }) +
      renderTextarea({ field: 'popis', label: 'Popis', value: draft.popis, rows: 4 });

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Vytvořit místo velení', size: 'sm', bodyHTML: body,
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="create">' + esc(t('btn.create')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-action="create"]').addEventListener('click', function () {
      readInputs(wrap, draft);
      clearAllErrors(wrap);
      let ok = true;
      if (!draft.typ)   { showFieldError(wrap, 'typ', 'Typ místa velení je povinný.'); ok = false; }
      if (!draft.nazev || !draft.nazev.trim()) { showFieldError(wrap, 'nazev', 'Název nesmí být prázdný.'); ok = false; }
      if (!ok) return;

      const newId = window.MockData.generateId();
      const newCp = {
        id: newId, kod: 'NEW-' + newId, nazev: draft.nazev.trim(),
        popis: draft.popis || '', typ: draft.typ, zodpovedna: App.state.user.fullName,
        vlajka: 'CZ', taktickaZnacka: 'NATO-COMMAND', obrazek: 'CP_001.png',
        unitCode: '', jointFunctions: [], combatFunctions: [],
        level: 'TACTICAL', continuityCode: 'TEMPORARY',
        mobilityType: 'STATIONARY', mobilitySpec: [],
        balisticProtectionKinetic: null, balisticProtectionMine: null,
        securityProtection: '', resilience: '', selfSustainment: '',
        constraints: [], functionDescription: '', requirements: [],
        vodosNumber: '', gpsLat: null, gpsLon: null,
        subordinates: [], lastModified: new Date().toISOString(),
        structure: { breakdowns: [], positions: [], rolesWithoutPosition: [] },
        capabilities: { missions: [], mca: {} },
        interactions: { ier: [], ip: [] },
        fmnInstructions: []
      };
      window.MockData.commandPosts.push(newCp);
      closeAndRemove(id);
      App.navigateToDetail(newId);
    });

    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  // ============================================================
  // G005 – Specifikace MV (UC004 + UC010 subordinates)
  // ============================================================
  Dialogs.openSpecification = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const id = nextModalId('spec');
    // Kopie do draftu (commit až na Uložit)
    const draft = JSON.parse(JSON.stringify(cp));

    const sec1 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Místo velení</div>' +
        '<div class="c3-form-row">' +
          renderSelect({ field: 'typ', label: 'Typ místa velení', required: true,
                         options: window.MockData.catalogs.typMV, value: draft.typ,
                         placeholder: '— Vyberte typ —' }) +
          renderTextField({ field: 'nazev', label: 'Název', value: draft.nazev }) +
        '</div>' +
        '<div class="c3-form-row">' +
          renderTextField({ field: 'zodpovedna', label: 'Zodpovědná osoba', value: draft.zodpovedna }) +
          renderSelect({ field: 'taktickaZnacka', label: 'Taktická značka',
                         options: window.MockData.catalogs.taktickaZnacka, value: draft.taktickaZnacka,
                         placeholder: '—' }) +
        '</div>' +
        '<div class="c3-form-row">' +
          renderTextField({ field: 'unitCode', label: 'Kód jednotky', value: draft.unitCode,
                            helper: '„Unit code" – kód útvaru, nikoli vazba na entitu Schopnost.' }) +
          renderSelect({ field: 'vlajka', label: 'Vlajka',
                         options: window.MockData.catalogs.vlajka, value: draft.vlajka, placeholder: '—' }) +
        '</div>' +
        '<div class="c3-form-row">' +
          renderSelect({ field: 'obrazek', label: 'Obrázek',
                         options: window.MockData.catalogs.obrazek, value: draft.obrazek, placeholder: '—' }) +
          '<div></div>' +
        '</div>' +
        '<div class="c3-form-row full">' +
          renderTextarea({ field: 'popis', label: 'Cílový stav (v gridu „Popis")', value: draft.popis, rows: 3 }) +
        '</div>' +
      '</div>';

    const sec2 = '<div class="cp-form-section" data-section="subordinates">' +
        '<div class="cp-form-section__title">Podřízená místa velení</div>' +
        '<div data-subordinates-grid>' + renderSubordinatesGrid(draft) + '</div>' +
        '<button type="button" class="c3-btn c3-btn--outlined c3-btn--sm" data-action="add-subordinate" style="margin-top:8px;">+ Přidat podřízené MV</button>' +
      '</div>';

    const sec3 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Funkce a úroveň</div>' +
        renderChips({ field: 'jointFunctions', catalog: 'spolecnaFunkce', label: 'Společné funkce', value: draft.jointFunctions }) +
        renderChips({ field: 'combatFunctions', catalog: 'bojovaFunkce', label: 'Bojové funkce', value: draft.combatFunctions }) +
        renderSelect({ field: 'level', label: 'Úroveň', options: window.MockData.catalogs.urovenMV, value: draft.level, placeholder: '—' }) +
      '</div>';

    const sec4 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Trvalost</div>' +
        renderRadio({ field: 'continuityCode', label: 'Kontinuita', value: draft.continuityCode,
                      options: window.MockData.catalogs.kontinuita }) +
      '</div>';

    const sec5 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Pohyblivost</div>' +
        renderRadio({ field: 'mobilityType', label: 'Mobilita', value: draft.mobilityType,
                      options: window.MockData.catalogs.mobilita }) +
        '<div data-mobility-extra style="' + (draft.mobilityType === 'MOBILE' ? '' : 'display:none;') + '">' +
          renderChips({ field: 'mobilitySpec', catalog: 'druhMobility', label: 'Druh pohyblivosti', value: draft.mobilitySpec }) +
        '</div>' +
      '</div>';

    const sec6 =
      '<div class="cp-form-section" data-balistic style="' + (draft.mobilityType === 'MOBILE' ? '' : 'display:none;') + '">' +
        '<div class="cp-form-section__title">Stupeň balistické ochrany vozidel</div>' +
        '<div class="c3-form-row">' +
          renderSelect({ field: 'balisticProtectionKinetic', label: 'Kinetická',
                         options: window.MockData.catalogs.kinetickaOchrana, value: draft.balisticProtectionKinetic, placeholder: '—' }) +
          renderSelect({ field: 'balisticProtectionMine', label: 'Minová',
                         options: window.MockData.catalogs.minovaOchrana, value: draft.balisticProtectionMine, placeholder: '—' }) +
        '</div>' +
      '</div>';

    const sec7 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Zabezpečení ochrany dle RMO č.49/2017</div>' +
        '<div class="c3-form-row">' +
          renderSelect({ field: 'securityProtection', label: 'Zabezpečení ochrany',
                         options: window.MockData.catalogs.zabezpeceniOchrany, value: draft.securityProtection, placeholder: '—' }) +
          renderSelect({ field: 'resilience', label: 'Odolnost',
                         options: window.MockData.catalogs.odolnost, value: draft.resilience, placeholder: '—' }) +
        '</div>' +
        renderSelect({ field: 'selfSustainment', label: 'Soběstačnost',
                       options: window.MockData.catalogs.sobestacnost, value: draft.selfSustainment, placeholder: '—' }) +
      '</div>';

    const sec8 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Omezení, požadavky a další</div>' +
        renderChips({ field: 'constraints', catalog: 'omezeni', label: 'Omezení', value: draft.constraints }) +
        renderTextarea({ field: 'functionDescription', label: 'Funkce místa velení', value: draft.functionDescription, rows: 3 }) +
        renderChips({ field: 'requirements', catalog: 'pozadavek', label: 'Požadavky', value: draft.requirements }) +
        renderTextField({ field: 'vodosNumber', label: 'P. č. dle VODOS', value: draft.vodosNumber }) +
      '</div>';

    const sec9 =
      '<div class="cp-form-section">' +
        '<div class="cp-form-section__title">Lokace (GPS)</div>' +
        '<div class="c3-form-row">' +
          renderTextField({ field: 'gpsLat', label: 'Šířka', value: draft.gpsLat,
                            helper: 'Šířka je povinná, pokud je zadána délka.' }) +
          renderTextField({ field: 'gpsLon', label: 'Délka', value: draft.gpsLon,
                            helper: 'Délka je povinná, pokud je zadána šířka.' }) +
        '</div>' +
      '</div>';

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Specifikace místa velení', size: 'xl',
      bodyHTML: sec1 + sec2 + sec3 + sec4 + sec5 + sec6 + sec7 + sec8 + sec9,
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="save">' + esc(t('btn.save')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    // Mobilita radio → toggle sekcí
    wrap.querySelector('[data-field="mobilityType"]').addEventListener('change', function () {
      readInputs(wrap, draft);
      const mob = draft.mobilityType === 'MOBILE';
      wrap.querySelector('[data-mobility-extra]').style.display = mob ? '' : 'none';
      wrap.querySelector('[data-balistic]').style.display = mob ? '' : 'none';
    });

    // Chips
    bindChips(wrap, function () { return draft; });

    // Subordinates – přidat
    wrap.querySelector('[data-action="add-subordinate"]').addEventListener('click', function () {
      const others = window.MockData.commandPosts.filter(function (other) {
        if (other.id === cp.id) return false;
        if ((draft.subordinates || []).indexOf(other.id) !== -1) return false;
        return true;
      });
      if (!others.length) {
        alert('Žádné dostupné MV k přidání (všechny jsou již podřízené nebo vyloučené).');
        return;
      }
      openSubordinatePicker(cp.id, others, function (selectedId) {
        // Cyklus check
        if (window.MockData.wouldCreateCycle(cp.id, selectedId)) {
          alert('Nelze přidat MV „' + selectedId + '" jako podřízené – vznikla by cyklická závislost.\n' +
                '(MV „' + cp.id + '" je již předkem MV „' + selectedId + '").');
          return;
        }
        if (!Array.isArray(draft.subordinates)) draft.subordinates = [];
        draft.subordinates.push(selectedId);
        const grid = wrap.querySelector('[data-subordinates-grid]');
        if (grid) grid.innerHTML = renderSubordinatesGrid(draft);
        rebindSubordinateRemove(wrap, draft);
      });
    });
    rebindSubordinateRemove(wrap, draft);

    // Uložit / Zrušit
    wrap.querySelector('[data-action="save"]').addEventListener('click', function () {
      readInputs(wrap, draft);
      clearAllErrors(wrap);
      let ok = true;
      if (!draft.typ) { showFieldError(wrap, 'typ', 'Typ místa velení je povinný (V-G005-3).'); ok = false; }
      const lat = (draft.gpsLat || '').toString().trim();
      const lon = (draft.gpsLon || '').toString().trim();
      if (lat && !lon) { showFieldError(wrap, 'gpsLon', 'Délka je povinná, pokud je zadána šířka (V-G005-2).'); ok = false; }
      if (lon && !lat) { showFieldError(wrap, 'gpsLat', 'Šířka je povinná, pokud je zadána délka (V-G005-1).'); ok = false; }
      if (!ok) return;

      // Commit
      Object.assign(cp, draft);
      window.MockData.markModified(cp);
      closeAndRemove(id);
      App.rerender();
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  function renderSubordinatesGrid(draft) {
    const rows = (draft.subordinates || []).map(function (subId) {
      const sub = window.MockData.findCpById(subId);
      return {
        id: subId,
        name: sub ? sub.nazev : '(neznámé MV ' + subId + ')'
      };
    });
    return window.C3Hub.renderDataGridHTML({
      rows: rows,
      emptyText: 'Žádná podřízená místa velení.',
      columns: [
        { field: 'actions', label: 'Akce', class: 'col-actions',
          render: function (row) {
            return window.C3Hub.actionButtonsHTML([{ icon: 'Delete', tooltip: 'Smazat', action: 'sub-remove-' + row.id, danger: true }]);
          }},
        { field: 'name', label: 'Název' }
      ]
    });
  }

  function rebindSubordinateRemove(wrap, draft) {
    wrap.querySelectorAll('[data-action^="sub-remove-"]').forEach(function (b) {
      b.addEventListener('click', function () {
        const sid = b.dataset.action.replace('sub-remove-', '');
        draft.subordinates = (draft.subordinates || []).filter(function (x) { return x !== sid; });
        const grid = wrap.querySelector('[data-subordinates-grid]');
        if (grid) grid.innerHTML = renderSubordinatesGrid(draft);
        rebindSubordinateRemove(wrap, draft);
      });
    });
  }

  function openSubordinatePicker(currentCpId, candidates, onSelect) {
    const id = nextModalId('sub-pick');
    const rows = candidates.map(function (cp) {
      const wouldCycle = window.MockData.wouldCreateCycle(currentCpId, cp.id);
      return '<label style="display:flex; gap:8px; padding:8px; border-bottom: 1px solid #f0f0f0;' +
                  (wouldCycle ? ' opacity:0.5; cursor:not-allowed;' : ' cursor:pointer;') + '">' +
                '<input type="radio" name="sub-pick" value="' + esc(cp.id) + '"' +
                  (wouldCycle ? ' disabled' : '') + '>' +
                '<span><strong>' + esc(cp.kod) + '</strong> – ' + esc(cp.nazev) +
                  (wouldCycle ? ' <span style="color:var(--c3-error)">(by vznikl cyklus)</span>' : '') +
                '</span>' +
             '</label>';
    }).join('');
    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Vyberte podřízené místo velení', size: 'sm',
      bodyHTML: '<div style="max-height:50vh; overflow:auto;">' + rows + '</div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="confirm">' + esc(t('btn.add'))  + '</button>'
    });
    const wrap = appendModal(html, id, true);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);
    wrap.querySelector('[data-action="confirm"]').addEventListener('click', function () {
      const r = wrap.querySelector('input[name="sub-pick"]:checked');
      if (!r) { alert('Vyberte MV.'); return; }
      onSelect(r.value);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  }

  // ============================================================
  // G007 + G028 – Strukturu velení (UC005)
  // ============================================================
  Dialogs.openStructure = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const id = nextModalId('struct');
    const draft = JSON.parse(JSON.stringify(cp.structure));

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Strukturu velení – ' + cp.nazev, size: 'lg',
      bodyHTML:
        renderChips({ field: 'breakdowns', freeText: true,
                      label: 'Rozpad místa velení (multi-tag, např. „H1", „H2", „H3")',
                      value: draft.breakdowns }) +
        '<div style="margin-top:16px; font-size:0.875rem; color:var(--c3-text-muted);">' +
          'Pozice na MV (strom). Smažete ikonou koše, ikona tužky otevře editaci.</div>' +
        '<div data-positions-grid>' + renderPositionsGrid(draft) + '</div>' +
        '<button type="button" class="c3-btn c3-btn--outlined c3-btn--sm" style="margin-top:8px;" data-action="add-position">+ Přidat pozici</button>' +
        '<div style="margin-top:16px;"><strong>Role bez přiřazené pozice:</strong> ' +
          ((draft.rolesWithoutPosition || []).map(function (r) { return label('role', r); }).join(', ') || '<em>—</em>') +
        '</div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="save">' + esc(t('btn.save')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    // Breakdowns (free-text multi-tag) – delegovaný handler na modalu
    wrap.addEventListener('click', function (ev) {
      const addBtn = ev.target.closest('[data-action="chip-add"]');
      if (!addBtn) return;
      const container = addBtn.closest('.cp-chips[data-handler="free-text"]');
      if (!container || !wrap.contains(container) || container.dataset.field !== 'breakdowns') return;
      ev.stopPropagation();
      const tag = prompt('Zadejte nový rozpad MV (např. „H4"):');
      if (!tag) return;
      const t = tag.trim();
      if (!t) return;
      if (!Array.isArray(draft.breakdowns)) draft.breakdowns = [];
      if (draft.breakdowns.indexOf(t) === -1) draft.breakdowns.push(t);
      refreshFreeTextChips(container, draft.breakdowns);
    });
    wrap.addEventListener('click', function (ev) {
      const rmBtn = ev.target.closest('[data-action="chip-remove"]');
      if (!rmBtn) return;
      const container = rmBtn.closest('.cp-chips[data-handler="free-text"]');
      if (!container || container.dataset.field !== 'breakdowns') return;
      ev.stopPropagation();
      const code = rmBtn.dataset.code;
      draft.breakdowns = (draft.breakdowns || []).filter(function (c) { return c !== code; });
      refreshFreeTextChips(container, draft.breakdowns);
    });

    // Pozice CRUD + tree binding
    window.C3Hub.bindTreeToggle(wrap);
    bindPositionRows(wrap, draft);
    wrap.querySelector('[data-action="add-position"]').addEventListener('click', function () {
      Dialogs.openPositionEdit(cpId, null, function (newPos) {
        if (!draft.positions) draft.positions = [];
        newPos.id = window.MockData.generatePositionId();
        draft.positions.push(newPos);
        const grid = wrap.querySelector('[data-positions-grid]');
        if (grid) grid.innerHTML = renderPositionsGrid(draft);
        bindPositionRows(wrap, draft);
      });
    });

    // Save
    wrap.querySelector('[data-action="save"]').addEventListener('click', function () {
      cp.structure = draft;
      window.MockData.markModified(cp);
      closeAndRemove(id);
      App.rerender();
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  function renderPositionsGrid(draft) {
    const positions = draft.positions || [];
    // Spočítej počet dětí každého řádku
    const childrenByParent = {};
    positions.forEach(function (p) {
      if (p.parentId) {
        childrenByParent[p.parentId] = (childrenByParent[p.parentId] || 0) + 1;
      }
    });
    if (!positions.length) {
      return '<div class="c3-datagrid c3-tree-grid"><div class="c3-datagrid__empty">Žádné pozice. Přidejte první pozici tlačítkem níže.</div></div>';
    }
    const toolbar = window.C3Hub.renderTreeToolbarHTML({
      expandLabel:   'Rozbalit všechny řádky',
      collapseLabel: 'Zabalit všechny řádky'
    });
    return window.C3Hub.renderTreeGridHTML({
      toolbarHTML: toolbar,
      rows: positions,
      getRowId:    function (p) { return p.id; },
      getParentId: function (p) { return p.parentId || null; },
      getLabel:    function (p) {
        return p.name + (p.roles && p.roles.length ? ' [' + p.roles.length + ' rolí]' : '');
      },
      childCount: function (p) { return childrenByParent[p.id] || 0; },
      defaultExpanded: true,
      actionsRender: function (p) {
        return window.C3Hub.actionButtonsHTML([
          { icon: 'Edit',   tooltip: 'Upravit pozici', action: 'pos-edit-' + p.id },
          { icon: 'Delete', tooltip: 'Smazat pozici',  action: 'pos-del-'  + p.id, danger: true }
        ]);
      },
      columns: [
        { field: '__actions',    label: 'Akce',         class: 'col-actions' },
        { field: '__tree-label', label: 'Pozice (strom)' },
        { field: 'personName',   label: 'Osoba' }
      ]
    });
  }

  function bindPositionRows(wrap, draft) {
    window.C3Hub.bindTreeToggle(wrap);
    wrap.querySelectorAll('[data-action^="pos-edit-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const pid = b.dataset.action.replace('pos-edit-', '');
        const pos = (draft.positions || []).find(function (p) { return p.id === pid; });
        if (!pos) return;
        Dialogs.openPositionEdit(null, pos, function (edited) {
          Object.assign(pos, edited);
          const grid = wrap.querySelector('[data-positions-grid]');
          if (grid) grid.innerHTML = renderPositionsGrid(draft);
          bindPositionRows(wrap, draft);
        });
      });
    });
    wrap.querySelectorAll('[data-action^="pos-del-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const pid = b.dataset.action.replace('pos-del-', '');
        if (!confirm('Smazat tuto pozici?')) return;
        draft.positions = (draft.positions || []).filter(function (p) { return p.id !== pid && p.parentId !== pid; });
        const grid = wrap.querySelector('[data-positions-grid]');
        if (grid) grid.innerHTML = renderPositionsGrid(draft);
        bindPositionRows(wrap, draft);
      });
    });
  }

  // G028 – Přidat/Upravit pozici
  Dialogs.openPositionEdit = function (cpId, existingPos, onSave) {
    const id = nextModalId('pos');
    const isNew = !existingPos;
    const draft = isNew
        ? { name: '', personName: '', roles: [], roleDataMode: 'represented' }
        : { name: existingPos.name, personName: existingPos.personName || '', roles: (existingPos.roles || []).slice(), roleDataMode: 'represented' };

    const roleRows = window.MockData.catalogs.role.map(function (r) {
      const checked = draft.roles.indexOf(r.code) !== -1 ? ' checked' : '';
      return '<label style="display:flex; gap:8px; padding:6px 0; border-bottom: 1px solid #f0f0f0;">' +
              '<input type="checkbox" data-role-code="' + esc(r.code) + '"' + checked + '> ' +
              '<span><strong>' + esc(r.code) + '</strong> – ' + esc(r.label_cs) + '</span>' +
            '</label>';
    }).join('');

    const html = window.C3Hub.renderModalHTML({
      id: id, title: isNew ? 'Přidat pozici' : 'Upravit pozici', size: 'lg',
      bodyHTML:
        '<div class="c3-form-row">' +
          renderTextField({ field: 'name', label: 'Název pozice', required: true, value: draft.name }) +
          renderTextField({ field: 'personName', label: 'Osoba', value: draft.personName }) +
        '</div>' +
        renderRadio({ field: 'roleDataMode', label: 'Režim rolí', value: draft.roleDataMode,
                      options: [
                        { code: 'represented',     label_cs: 'Role reprezentované na MV' },
                        { code: 'withoutPosition', label_cs: 'Role bez přiřazené pozice' },
                        { code: 'all',             label_cs: 'Všechny role' }
                      ] }) +
        '<div class="cp-form-section__title">Role</div>' +
        '<div data-role-grid style="max-height: 240px; overflow:auto; border:1px solid var(--c3-border); border-radius: var(--c3-radius-sm); padding: 8px;">' + roleRows + '</div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="save-pos">' + (isNew ? 'PŘIDAT' : 'UPRAVIT') + '</button>'
    });
    const wrap = appendModal(html, id, true);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-action="save-pos"]').addEventListener('click', function () {
      readInputs(wrap, draft);
      clearAllErrors(wrap);
      // V-G028-1
      if (!draft.name || !draft.name.trim()) {
        showFieldError(wrap, 'name', 'Název pozice je povinný (V-G028-1).');
        return;
      }
      // V-G028-3 – role
      draft.roles = Array.from(wrap.querySelectorAll('[data-role-code]:checked')).map(function (cb) { return cb.dataset.roleCode; });
      if (!draft.roles.length) {
        alert('Musí být zvolena aspoň jedna role (V-G028-3).');
        return;
      }
      onSave(draft);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  // ============================================================
  // G009 + G010 – Formulář schopností (UC006)
  // ============================================================
  Dialogs.openCapabilities = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const id = nextModalId('cap');
    const draft = {
      missions: (cp.capabilities.missions || []).slice(),
      mca: Object.assign({}, cp.capabilities.mca || {})
    };

    // Postavíme flat řádky: root MCA + sub
    const mcaRows = [];
    const childrenCount = {};
    window.MockData.catalogs.mcaCapability.forEach(function (mca) {
      mcaRows.push({
        id: mca.code, parentId: null,
        label: mca.label_cs, isRoot: true
      });
      (mca.sub || []).forEach(function (s) {
        mcaRows.push({
          id: s.code, parentId: mca.code,
          label: s.label_cs, isRoot: false
        });
        childrenCount[mca.code] = (childrenCount[mca.code] || 0) + 1;
      });
    });

    const treeHtml = window.C3Hub.renderTreeGridHTML({
      rows: mcaRows,
      getRowId:    function (r) { return r.id; },
      getParentId: function (r) { return r.parentId; },
      getLabel:    function (r) { return r.label; },
      childCount:  function (r) { return childrenCount[r.id] || null; },
      defaultExpanded: true,
      actionsRender: function (r) {
        return window.C3Hub.actionButtonsHTML([
          { icon: 'Pageview', tooltip: 'Detail prvku', action: 'mca-detail-' + r.id }
        ]);
      },
      columns: [
        { field: '__actions',    label: 'Akce',                   class: 'col-actions', width: '1%' },
        { field: '__tree-label', label: 'Schopnost / Subkategorie' },
        { field: 'support',      label: 'Podporováno', width: '120px',
          render: function (r) {
            if (r.isRoot) return '';
            const checked = draft.mca[r.id] ? ' checked' : '';
            return '<input type="checkbox" data-mca-code="' + esc(r.id) + '"' + checked + '>';
          }
        }
      ]
    });

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Formulář schopností – ' + cp.nazev, size: 'xl',
      bodyHTML:
        '<div class="cp-form-section">' +
          '<div class="cp-form-section__title">Druhy misí <span style="color:var(--c3-error)">*</span></div>' +
          renderChips({ field: 'missions', catalog: 'druhMise', label: '', value: draft.missions }) +
          '<div class="cp-field-error" data-error-for="missions" style="display:none;"></div>' +
        '</div>' +
        '<div class="cp-form-section">' +
          '<div class="cp-form-section__title">MCA schopnosti (strom)</div>' +
          treeHtml +
        '</div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="save-cap">' + esc(t('btn.save')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);
    window.C3Hub.bindTreeToggle(wrap);
    bindChips(wrap, function () { return draft; });

    // Detail per řádek MCA – stub
    wrap.querySelectorAll('[data-action^="mca-detail-"]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        const code = b.dataset.action.replace('mca-detail-', '');
        const item = window.MockData.lookupCatalog('mcaCapability', code);
        alert('STUB: Detail prvku MCA „' + code + '"\n\n' +
              'Název: ' + (item ? item.label_cs : '?') + '\n\n' +
              'V reálné aplikaci se zde otevírá ElementDialog z modulu RQU007 (C3 schopnosti)\n' +
              'pro editaci překladů a vlastností MCA prvku.');
      });
    });

    wrap.querySelector('[data-action="save-cap"]').addEventListener('click', function () {
      clearAllErrors(wrap);
      // V-G009-1
      if (!draft.missions.length) {
        showFieldError(wrap, 'missions', 'Druhy misí jsou povinné (V-G009-1).');
        return;
      }
      // MCA stav
      draft.mca = {};
      wrap.querySelectorAll('[data-mca-code]').forEach(function (cb) {
        draft.mca[cb.dataset.mcaCode] = cb.checked;
      });
      // V-G009-2 – MCA bez subkategorie? Pro simulaci jen warning.
      // Pokud root má všechny sub:false, je to MCA bez vybrané subkategorie.
      const orphanRoots = [];
      window.MockData.catalogs.mcaCapability.forEach(function (mca) {
        const anySubChecked = (mca.sub || []).some(function (s) { return draft.mca[s.code]; });
        if (!anySubChecked && (mca.sub || []).length) {
          orphanRoots.push(mca.label_cs);
        }
      });
      if (orphanRoots.length) {
        // V tomto případě by reálně přišel confirm dialog, simulace přes confirm()
        const ok = confirm('Některé MCA schopnosti nemají vybranou subkategorii (' + orphanRoots.join(', ') + '). Pokračovat v uložení? (V-G009-2)');
        if (!ok) return;
      }
      cp.capabilities = draft;
      window.MockData.markModified(cp);
      closeAndRemove(id);
      App.rerender();
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  // ============================================================
  // G021 + G021a – Interakce s MV (UC007 + UC011a/b/c + UC014)
  // ============================================================
  // Ověřeno proti zdroji COCO: CommandPostInteractionDataGrid.tsx,
  // InteractionGraphTransformer.ts, CommandPostInteractionsUpdateDialog.tsx.
  //   mode    – 'ier' = IER-rooted strom, editovatelný (toolbar: filtry+search)
  //             'ip'  = IP→IER (2 úrovně), read-only pohled, bez toolbaru
  //   options – { focusIers: ['IER001'], initFiltersOn: true }
  //     - focusIers: nově přidaná IER (UC011a/b/c) – zvýrazní + předvyplní Req=true
  //     - initFiltersOn: zapne filtry BA/BP + IP (tok „Přidat podle IP/IER")
  Dialogs.openInteractions = function (cpId, mode, options) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    options = options || {};
    const id = nextModalId('iact');
    const draft = JSON.parse(JSON.stringify(cp.interactions));
    let currentMode = mode || 'ier';  // 'ier' | 'ip'

    // Rám gridu (G021) – filtrační checkboxy + vyhledávání. V reálné aplikaci
    // obaleno `{isIer && ...}` => zobrazují se POUZE v IER pohledu.
    const filters = {
      showBusinessElements:    !!options.initFiltersOn,
      showInformationProducts: !!options.initFiltersOn,
      showAppsAndDevices:      false
    };
    let searchQuery = '';
    let lastRootCount = 0;

    // Stavy interakce (req/consumer/provider) na TIN řádcích – klíč 'ierCode/tinCode'.
    // V reálu má TIN stav z relace IER_GROUPING→TIN; v prototypu lazy mock.
    const tinStates = {};
    function getTinState(key) {
      if (!tinStates[key]) tinStates[key] = { req: false, consumer: false, provider: false };
      return tinStates[key];
    }

    function normSearch(s) {
      return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    // kind → katalog (pro Detail/Graf akce a názvy)
    const kindToCatalog = {
      ier: 'ierKatalog', tin: 'tinKatalog', ip: 'ipKatalog',
      ba: 'baKatalog', bp: 'bpKatalog', cisapp: 'cisAppKatalog', cisdevice: 'cisDeviceKatalog'
    };

    // Pre-vyplnění z UC011a/b/c (focusIers) – ensure IER existují v draftu
    if (options.focusIers && options.focusIers.length) {
      const usedIers = draft.ier.map(function (r) { return r.ierCode; });
      options.focusIers.forEach(function (ierCode) {
        if (usedIers.indexOf(ierCode) === -1) {
          draft.ier.push({ ierCode: ierCode, req: true, consumer: false, provider: false });
        }
      });
    }

    const isEditable = (currentMode === 'ier');  // IP pohled je read-only

    // ---- Stavba flat řádků stromu ----
    function buildRows() {
      const rows = [];
      if (currentMode === 'ier') {
        // IER-rooted: IER → [BA→BP], [IP], [TIN→CIS app/device]
        draft.ier.forEach(function (entry, idx) {
          const ierItem = window.MockData.lookupCatalog('ierKatalog', entry.ierCode);
          const isFocus = options.focusIers && options.focusIers.indexOf(entry.ierCode) !== -1;
          const rid = 'ier-' + idx;
          rows.push({
            _id: rid, _parent: null, _root: rid, _level: 0, _kind: 'ier',
            _idx: idx, _code: entry.ierCode, _entry: entry,
            _codeLabel: entry.ierCode + (isFocus ? '  •nový' : ''),
            _name: ierItem ? ierItem.label_cs : '?'
          });
          // BA → BP (jen showBusinessElements)
          if (filters.showBusinessElements) {
            (ierItem && ierItem.businessActivities || []).forEach(function (ba) {
              const baItem = window.MockData.lookupCatalog('baKatalog', ba.code);
              const relSuffix = ba.rel === 'consumer' ? ' [Konzument]'
                              : (ba.rel === 'provider' ? ' [Poskytovatel]' : '');
              const baRid = rid + '-ba-' + ba.code + '-' + ba.rel;
              rows.push({
                _id: baRid, _parent: rid, _root: rid, _level: 1, _kind: 'ba',
                _code: ba.code, _codeLabel: ba.code + relSuffix,
                _name: baItem ? baItem.label_cs : '?'
              });
              (baItem && baItem.businessProcesses || []).forEach(function (bpCode) {
                const bpItem = window.MockData.lookupCatalog('bpKatalog', bpCode);
                rows.push({
                  _id: baRid + '-bp-' + bpCode, _parent: baRid, _root: rid, _level: 2, _kind: 'bp',
                  _code: bpCode, _codeLabel: bpCode, _name: bpItem ? bpItem.label_cs : '?'
                });
              });
            });
          }
          // IP (jen showInformationProducts) – přímo pod IER
          if (filters.showInformationProducts) {
            (ierItem && ierItem.ips || []).forEach(function (ipCode) {
              const ipItem = window.MockData.lookupCatalog('ipKatalog', ipCode);
              rows.push({
                _id: rid + '-ip-' + ipCode, _parent: rid, _root: rid, _level: 1, _kind: 'ip',
                _code: ipCode, _codeLabel: ipCode, _name: ipItem ? ipItem.label_cs : '?'
              });
            });
          }
          // TIN (vždy) → CIS app/device (jen showAppsAndDevices)
          (ierItem && ierItem.tins || []).forEach(function (tinCode) {
            const tinItem = window.MockData.lookupCatalog('tinKatalog', tinCode);
            const tinRid = rid + '-tin-' + tinCode;
            rows.push({
              _id: tinRid, _parent: rid, _root: rid, _level: 1, _kind: 'tin',
              _code: tinCode, _codeLabel: tinCode, _name: tinItem ? tinItem.label_cs : '?',
              _tinKey: entry.ierCode + '/' + tinCode
            });
            if (filters.showAppsAndDevices) {
              (tinItem && tinItem.cisApps || []).forEach(function (caCode) {
                const caItem = window.MockData.lookupCatalog('cisAppKatalog', caCode);
                rows.push({
                  _id: tinRid + '-ca-' + caCode, _parent: tinRid, _root: rid, _level: 2, _kind: 'cisapp',
                  _code: caCode, _codeLabel: caCode, _name: caItem ? caItem.label_cs : '?'
                });
              });
              (tinItem && tinItem.cisDevices || []).forEach(function (cdCode) {
                const cdItem = window.MockData.lookupCatalog('cisDeviceKatalog', cdCode);
                rows.push({
                  _id: tinRid + '-cd-' + cdCode, _parent: tinRid, _root: rid, _level: 2, _kind: 'cisdevice',
                  _code: cdCode, _codeLabel: cdCode, _name: cdItem ? cdItem.label_cs : '?'
                });
              });
            }
          });
        });
      } else {
        // IP pohled: IP → IER (2 úrovně, read-only). Bez TIN, bez filtrů.
        draft.ip.forEach(function (entry, idx) {
          const ipItem = window.MockData.lookupCatalog('ipKatalog', entry.ipCode);
          const rid = 'ip-' + idx;
          rows.push({
            _id: rid, _parent: null, _root: rid, _level: 0, _kind: 'ip',
            _idx: idx, _code: entry.ipCode, _codeLabel: entry.ipCode,
            _name: ipItem ? ipItem.label_cs : '?'
          });
          (ipItem && ipItem.iers || []).forEach(function (ierCode) {
            const ierItem = window.MockData.lookupCatalog('ierKatalog', ierCode);
            // stav IER z draft.ier (pokud je IER přiřazený k MV)
            let ierEntry = null;
            for (let i = 0; i < draft.ier.length; i++) {
              if (draft.ier[i].ierCode === ierCode) { ierEntry = draft.ier[i]; break; }
            }
            rows.push({
              _id: rid + '-ier-' + ierCode, _parent: rid, _root: rid, _level: 1, _kind: 'ier',
              _code: ierCode, _codeLabel: ierCode, _name: ierItem ? ierItem.label_cs : '?',
              _entry: ierEntry
            });
          });
        });
      }
      return rows;
    }

    // Search filtr – ponechá celý root-subtree, pokud kterýkoli uzel matchuje (1:1 dle InteractionSearchFilter.ts).
    function applySearch(rows) {
      if (!searchQuery.trim()) return rows;
      const q = normSearch(searchQuery);
      const matchedRoots = {};
      rows.forEach(function (r) {
        if (normSearch(r._codeLabel + ' ' + r._name).indexOf(q) !== -1) matchedRoots[r._root] = true;
      });
      return rows.filter(function (r) { return matchedRoots[r._root]; });
    }

    function renderTree() {
      let rows = applySearch(buildRows());
      lastRootCount = rows.filter(function (r) { return r._level === 0; }).length;

      if (!rows.length) {
        return '<div class="c3-datagrid c3-tree-grid"><div class="c3-datagrid__empty">' +
                  (searchQuery.trim()
                    ? 'Vyhledávání „' + esc(searchQuery) + '" nevrátilo žádné záznamy.'
                    : 'Žádné interakce.' + (currentMode === 'ier' ? ' Použijte „Přidat IER" výše.' : '')) +
               '</div></div>';
      }
      const childrenCount = {};
      rows.forEach(function (r) { if (r._parent) childrenCount[r._parent] = (childrenCount[r._parent] || 0) + 1; });

      // Stavový checkbox – jen na IER a TIN řádcích (shouldShowControls v source).
      // V IP pohledu disabled (read-only).
      function stateCell(r, field) {
        const dis = isEditable ? '' : ' disabled';
        if (r._kind === 'ier' && r._entry) {
          return '<input type="checkbox" data-state="' + field + '" data-kind="ier" data-code="' + esc(r._code) + '"' +
                 (r._entry[field] ? ' checked' : '') + dis + '>';
        }
        if (r._kind === 'tin') {
          const st = getTinState(r._tinKey);
          return '<input type="checkbox" data-state="' + field + '" data-kind="tin" data-tinkey="' + esc(r._tinKey) + '"' +
                 (st[field] ? ' checked' : '') + dis + '>';
        }
        return '';
      }

      return window.C3Hub.renderTreeGridHTML({
        rows: rows,
        getRowId:    function (r) { return r._id; },
        getParentId: function (r) { return r._parent; },
        getLabel:    function (r) { return r._codeLabel; },
        childCount:  function (r) { return childrenCount[r._id] || null; },
        defaultExpanded: true,
        actionsRender: function (r) {
          const btns = [];
          if (currentMode === 'ier') {
            btns.push({ icon: 'Pageview', tooltip: 'Detail prvku (editor překladů)', action: 'iact-detail-' + r._kind + '-' + r._code });
          } else if (r._kind === 'ier') {
            btns.push({ icon: 'Edit', tooltip: 'Upravit interakce tohoto IER', action: 'iact-editier-' + r._code });
          }
          btns.push({ icon: 'OpenInNew', tooltip: 'Otevřít graf sousedství v Archirepo', action: 'iact-graph-' + r._kind + '-' + r._code });
          return window.C3Hub.actionButtonsHTML(btns);
        },
        columns: [
          { field: '__actions',    label: 'Akce', class: 'col-actions', width: '90px' },
          { field: '__tree-label', label: 'Kód' },
          { field: 'nazev',    label: 'Název', render: function (r) { return esc(r._name); } },
          { field: 'req',      label: 'Req', width: '60px',  render: function (r) { return stateCell(r, 'req'); } },
          { field: 'consumer', label: 'Konzument', width: '90px',  render: function (r) { return stateCell(r, 'consumer'); } },
          { field: 'provider', label: 'Poskytovatel', width: '100px', render: function (r) { return stateCell(r, 'provider'); } }
        ]
      });
    }

    function recordCountHtml() {
      return '<span data-record-count>' +
                (currentMode === 'ier' ? 'IER' : 'IP') + ' (' + lastRootCount + ' záznamů)' +
             '</span>';
    }

    function bodyHtml() {
      // Banner – nově přidané IER (UC011a/b/c)
      let banner = '';
      if (options.focusIers && options.focusIers.length) {
        banner = '<div class="cp-help" style="background:#fff8e1; border-left-color: var(--c3-warning);">' +
                   '<strong>Nově přidané IER:</strong> ' + options.focusIers.map(esc).join(', ') +
                   ' (předvyplněno Req=true; doplňte Konzument/Poskytovatel a uložte)' +
                 '</div>';
      }
      const modeSwitch =
              '<div style="margin-left:auto; display:flex; gap:8px;">' +
                '<button class="c3-btn c3-btn--sm ' + (currentMode === 'ier' ? 'c3-btn--contained' : 'c3-btn--outlined') + '" data-action="mode-ier">IER pohled</button>' +
                '<button class="c3-btn c3-btn--sm ' + (currentMode === 'ip' ? 'c3-btn--contained' : 'c3-btn--outlined') + '" data-action="mode-ip">IP pohled</button>' +
              '</div>';

      // Rám gridu – počet záznamů + (jen IER pohled) 3 filtrační checkboxy + search
      let frame =
        '<div style="display:flex; align-items:center; gap:16px; margin:8px 0; flex-wrap:wrap;">' +
          '<strong class="c3-tree-record-count">' + recordCountHtml() + '</strong>';
      if (currentMode === 'ier') {
        frame +=
          '<label class="cp-filter-chk"><input type="checkbox" data-filter="showBusinessElements"' +
            (filters.showBusinessElements ? ' checked' : '') + '> Zobrazit Aktivity a Procesy</label>' +
          '<label class="cp-filter-chk"><input type="checkbox" data-filter="showInformationProducts"' +
            (filters.showInformationProducts ? ' checked' : '') + '> Zobrazit Produkty</label>' +
          '<label class="cp-filter-chk"><input type="checkbox" data-filter="showAppsAndDevices"' +
            (filters.showAppsAndDevices ? ' checked' : '') + '> Zobrazit zařízení a aplikace</label>' +
          '<input type="text" class="c3-form-input cp-iact-search" placeholder="Vyhledat v prvcích…" ' +
            'value="' + esc(searchQuery) + '" style="flex:1; min-width:200px;">';
      }
      frame += '</div>';

      // Akce nad gridem (Přidat / Načíst data) – jen IER pohled (v source actions={isIer ? ... : []})
      const gridActions = (currentMode === 'ier'
        ? '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="iact-add"><i class="' + window.C3Hub.faIcon('Add') + '"></i> Přidat IER</button>' +
          '<button class="c3-btn c3-btn--outlined c3-btn--sm" data-action="iact-import"><i class="' + window.C3Hub.faIcon('Download') + '"></i> Načíst data z jiného MV</button>'
        : '');

      return '<div style="display:flex; gap:12px; align-items:center; margin-bottom:8px;">' +
                '<strong>Místo velení:</strong> ' + esc(cp.nazev) +
                modeSwitch +
              '</div>' +
              banner +
              '<div class="cp-help">' +
                (currentMode === 'ier'
                  ? 'IER-rooted strom: <strong>IER → TIN</strong>, volitelně <strong>BA→BP</strong>, <strong>IP</strong> a <strong>CIS</strong> přes filtry výše. Stavy Req/Konzument/Poskytovatel se nastavují na IER a TIN řádcích.'
                  : 'IP pohled (read-only): <strong>IP → IER</strong>. Stavy interakce jsou jen ke čtení – editují se v IER pohledu.') +
              '</div>' +
              frame +
              '<div style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">' +
                gridActions +
                window.C3Hub.renderTreeToolbarHTML({}) +
              '</div>' +
              '<div data-iact-grid data-tree-scope>' + renderTree() + '</div>';
    }

    // IP pohled je read-only → bez tlačítka Uložit
    const footerHtml = '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.close')) + '</button>' +
        (currentMode === 'ier'
          ? '<button class="c3-btn c3-btn--contained" data-action="save-iact">' + esc(t('btn.save')) + '</button>'
          : '');

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Formulář na správu informačních toků – interakce na MV ' + cp.nazev, size: 'xl',
      bodyHTML: bodyHtml(),
      footerHTML: footerHtml
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);
    bindToolbar();
    bindGrid();

    // Přebuduje celé tělo dialogu (mode switch – mění footer i toolbar)
    function rebuildBody() {
      const mb = wrap.querySelector('.c3-modal__body');
      mb.innerHTML = bodyHtml();
      // footer (Uložit jen v IER) – přebuduj
      const footer = wrap.querySelector('.c3-modal__footer');
      if (footer) {
        footer.innerHTML = '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.close')) + '</button>' +
          (currentMode === 'ier'
            ? '<button class="c3-btn c3-btn--contained" data-action="save-iact">' + esc(t('btn.save')) + '</button>'
            : '');
        bindSave();
      }
      bindToolbar();
      bindGrid();
    }

    // Překreslí jen tělo gridu + počet záznamů (toolbar/search zůstává → search drží focus)
    function refreshGrid() {
      const gridEl = wrap.querySelector('[data-iact-grid]');
      gridEl.innerHTML = renderTree();
      const cnt = wrap.querySelector('[data-record-count]');
      if (cnt) cnt.textContent = (currentMode === 'ier' ? 'IER' : 'IP') + ' (' + lastRootCount + ' záznamů)';
      bindGrid();
    }

    // Toolbar handlery (mode switch, filtry, search, add, import) – jednou na build těla
    function bindToolbar() {
      wrap.querySelectorAll('[data-action="mode-ier"], [data-action="mode-ip"]').forEach(function (b) {
        b.addEventListener('click', function () {
          const next = (b.dataset.action === 'mode-ier') ? 'ier' : 'ip';
          if (next === currentMode) return;
          currentMode = next;
          rebuildBody();
        });
      });
      // Filtrační checkboxy (jen IER pohled)
      wrap.querySelectorAll('[data-filter]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          filters[cb.dataset.filter] = cb.checked;
          refreshGrid();
        });
      });
      // Search
      const search = wrap.querySelector('.cp-iact-search');
      if (search) {
        search.addEventListener('input', function () {
          searchQuery = search.value;
          refreshGrid();
        });
      }
      // Add IER
      wrap.querySelectorAll('[data-action="iact-add"]').forEach(function (b) {
        b.addEventListener('click', function () {
          const usedCodes = draft.ier.map(function (r) { return r.ierCode; });
          const items = window.MockData.catalogs.ierKatalog.filter(function (it) { return usedCodes.indexOf(it.code) === -1; });
          if (!items.length) return alert('Žádné dostupné IER k přidání.');
          openLovPicker('ierKatalog', items, function (codes) {
            codes.forEach(function (c) {
              draft.ier.push({ ierCode: c, req: false, consumer: false, provider: false });
            });
            refreshGrid();
          });
        });
      });
      // Import
      wrap.querySelectorAll('[data-action="iact-import"]').forEach(function (b) {
        b.addEventListener('click', function () {
          openImportDialog(cpId, 'ier', function (mergedItems) {
            mergedItems.forEach(function (it) {
              const exists = draft.ier.some(function (r) { return r.ierCode === it.ierCode; });
              if (!exists) draft.ier.push(JSON.parse(JSON.stringify(it)));
            });
            refreshGrid();
          });
        });
      });
    }

    // Grid handlery (tree toggle, stavy, detail, graf, editier) – po každém refreshi gridu
    function bindGrid() {
      window.C3Hub.bindTreeToggle(wrap);

      // Detail prvku (jen IER pohled) – stub ElementDialog
      wrap.querySelectorAll('[data-action^="iact-detail-"]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const parts = b.dataset.action.replace('iact-detail-', '').split('-');
          const kind = parts.shift();
          const code = parts.join('-');
          const item = window.MockData.lookupCatalog(kindToCatalog[kind] || 'ierKatalog', code);
          alert('STUB: Detail prvku „' + code + '" (typ ' + kind.toUpperCase() + ')\n\n' +
                'Název: ' + (item ? item.label_cs : '?') + '\n\n' +
                'V reálné aplikaci se zde otevírá ElementDialog z modulu RQU004 (Model SVŘ)\n' +
                'pro editaci překladů (CS/EN) a vlastností prvku.');
        });
      });
      // Upravit interakce IER (jen IP pohled, na IER řádcích) – otevře vnořený IER dialog
      wrap.querySelectorAll('[data-action^="iact-editier-"]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const code = b.dataset.action.replace('iact-editier-', '');
          Dialogs.openInteractions(cpId, 'ier', { focusIers: [code] });
        });
      });
      // Graf sousedství v Archirepo – stub
      wrap.querySelectorAll('[data-action^="iact-graph-"]').forEach(function (b) {
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          const parts = b.dataset.action.replace('iact-graph-', '').split('-');
          const kind = parts.shift();
          const code = parts.join('-');
          const url = 'https://archirepo.example/graph?type=' + encodeURIComponent(kind) + '&element=' + encodeURIComponent(code);
          if (window.confirm('Otevřít graf sousedství prvku „' + code + '" v Archirepo?\n\nURL: ' + url + '\n\n(STUB: v prototypu se neotvírá nové okno)')) {
            console.log('[STUB] window.open:', url);
          }
        });
      });
      // Stavové checkboxy req/consumer/provider (na IER a TIN řádcích)
      wrap.querySelectorAll('[data-state]').forEach(function (cb) {
        cb.addEventListener('change', function () {
          const field = cb.dataset.state;
          let st;
          if (cb.dataset.kind === 'ier') {
            for (let i = 0; i < draft.ier.length; i++) {
              if (draft.ier[i].ierCode === cb.dataset.code) { st = draft.ier[i]; break; }
            }
          } else {
            st = getTinState(cb.dataset.tinkey);
          }
          if (!st) return;
          st[field] = cb.checked;
          // Vzájemná výlučnost (dle source): Req ⊻ (Konzument/Poskytovatel)
          if (cb.checked) {
            if (field === 'req') { st.consumer = false; st.provider = false; }
            else { st.req = false; }
          }
          refreshGrid();
        });
      });
    }

    function bindSave() {
      const saveBtn = wrap.querySelector('[data-action="save-iact"]');
      if (saveBtn) saveBtn.addEventListener('click', function () {
        cp.interactions = draft;
        window.MockData.markModified(cp);
        closeAndRemove(id);
        App.rerender();
      });
    }
    bindSave();

    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  // ============================================================
  // G022 – Výběr IER (UC011a)
  // Flow: G022 LOV → potvrdit → otevři G021 (IER mode) s focusem na nově přidaná IER
  // ============================================================
  Dialogs.openIerSelection = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const used = cp.interactions.ier.map(function (r) { return r.ierCode; });
    const avail = window.MockData.catalogs.ierKatalog.filter(function (it) { return used.indexOf(it.code) === -1; });
    // Alt A-UC011a-1: žádné IER k přidání
    if (!avail.length) {
      alert('Všechny IER z modelu SVŘ jsou již přiřazeny k tomuto MV. (A-UC011a-1)');
      return;
    }
    openLovPicker('ierKatalog', avail, function (codes) {
      if (!codes.length) return;
      // UC011a: přidání IER + req=true (autocheck) + otevření G021 s focusem
      codes.forEach(function (c) {
        cp.interactions.ier.push({ ierCode: c, req: true, consumer: false, provider: false });
      });
      window.MockData.markModified(cp);
      // Otevřít G021 v IER pohledu s focusem na nově přidané IER (initFiltersOn dle source – initExpandDataGridTree)
      Dialogs.openInteractions(cpId, 'ier', { focusIers: codes, initFiltersOn: true });
    });
  };

  // ============================================================
  // G023 – Výběr IP (UC011b)
  // Flow: G023 LOV → potvrdit → backend lookup IP→IER → pokud prázdné: A-UC011b-1 snackbar;
  // jinak otevři G021 v IER pohledu (isIer=true, showAlsoUnassigned=true) s nalezenými IER.
  // POZN.: cílový dialog „Přidat podle IP" je IER-rooted, ne IP→IER→TIN
  // (ověřeno v CommandPostInteractionsCardPanel.tsx – instance interactionsAddIp má isIer=true).
  // ============================================================
  Dialogs.openIpSelection = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const used = cp.interactions.ip.map(function (r) { return r.ipCode; });
    const avail = window.MockData.catalogs.ipKatalog.filter(function (it) { return used.indexOf(it.code) === -1; });
    if (!avail.length) {
      alert('Všechny IP z modelu SVŘ jsou již přiřazeny k tomuto MV.');
      return;
    }
    openLovPicker('ipKatalog', avail, function (codes) {
      if (!codes.length) return;
      // Simulace backend lookupu IP → IER (mock: ipKatalog[].iers)
      const foundIers = [];
      codes.forEach(function (ipCode) {
        const ip = window.MockData.lookupCatalog('ipKatalog', ipCode);
        (ip && ip.iers || []).forEach(function (ierCode) {
          if (foundIers.indexOf(ierCode) === -1) foundIers.push(ierCode);
        });
      });
      // Alt A-UC011b-1: lookup vrátil prázdné IER
      if (!foundIers.length) {
        alert('Pro vybrané IP nebyly nalezeny žádné IER. (A-UC011b-1 / A-G023-1)\n\n' +
              'Zvolené IP: ' + codes.join(', ') + '\n' +
              'IP nemají v modelu SVŘ navázané žádné IER, takže nelze pokračovat.');
        return;
      }
      // Hlavní: zvolené IP zviditelnit v IP pohledu + nalezená IER přidat do interakcí
      codes.forEach(function (c) {
        if (!cp.interactions.ip.some(function (r) { return r.ipCode === c; })) {
          cp.interactions.ip.push({ ipCode: c, req: false, consumer: false, provider: false });
        }
      });
      const usedIers = cp.interactions.ier.map(function (r) { return r.ierCode; });
      foundIers.forEach(function (ierCode) {
        if (usedIers.indexOf(ierCode) === -1) {
          cp.interactions.ier.push({ ierCode: ierCode, req: true, consumer: false, provider: false });
        }
      });
      window.MockData.markModified(cp);
      // Cílový dialog je IER-rooted (isIer=true) s nalezenými IER ve focusu a předzapnutými filtry.
      Dialogs.openInteractions(cpId, 'ier', { focusIers: foundIers, initFiltersOn: true });
    });
  };

  // ============================================================
  // G025 – Výběr procedurální (FMN) instrukce (UC011c)
  // Flow: G025 LOV → potvrdit → backend lookup PI→IER → pokud prázdné: A-UC011c-1 snackbar;
  // jinak otevři G021 v IER mode s focusem na nalezená IER (předvyplněné Req=true)
  // ============================================================
  Dialogs.openFmnSelection = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const used = cp.fmnInstructions || [];
    const avail = window.MockData.catalogs.fmnInstrukce.filter(function (it) { return used.indexOf(it.code) === -1; });
    if (!avail.length) {
      alert('Všechny FMN instrukce jsou již přiřazeny k tomuto MV.');
      return;
    }
    openLovPicker('fmnInstrukce', avail, function (codes) {
      if (!codes.length) return;
      // Simulace backend lookupu PI → IER (mock: fmnInstrukce[].iers)
      const foundIers = [];
      codes.forEach(function (piCode) {
        const pi = window.MockData.lookupCatalog('fmnInstrukce', piCode);
        (pi && pi.iers || []).forEach(function (ierCode) {
          if (foundIers.indexOf(ierCode) === -1) foundIers.push(ierCode);
        });
      });
      // Alt A-UC011c-1: PI nemá žádné IER
      if (!foundIers.length) {
        alert('Pro vybranou FMN instrukci nebyly nalezeny IER. (A-UC011c-1 / A-G025-1)\n\n' +
              'Zvolené PI: ' + codes.join(', ') + '\n' +
              'V modelu SVŘ na tyto procedurální instrukce nejsou navázány žádné IER.');
        return;
      }
      // Přidat FMN do cp.fmnInstructions
      if (!cp.fmnInstructions) cp.fmnInstructions = [];
      codes.forEach(function (c) { if (cp.fmnInstructions.indexOf(c) === -1) cp.fmnInstructions.push(c); });
      window.MockData.markModified(cp);
      // Otevřít G021 v IER pohledu s focusem na nalezená IER
      Dialogs.openInteractions(cpId, 'ier', { focusIers: foundIers, initFiltersOn: true });
    });
  };

  // ============================================================
  // G024 – Import interakcí z jiného MV (UC014)
  // ============================================================
  function openImportDialog(cpId, mode, onMerge) {
    const id = nextModalId('imp');
    const otherCps = window.MockData.commandPosts.filter(function (cp) { return cp.id !== cpId; });
    const opts = otherCps.map(function (cp) {
      return { code: cp.id, label_cs: cp.kod + ' – ' + cp.nazev };
    });

    let chosenId = null;

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Načíst data z jiného místa velení', size: 'md',
      bodyHTML:
        '<div class="cp-help">Vyberte zdrojové MV. Načteme jeho ' + (mode === 'ier' ? 'IER' : 'IP') + ' interakce a sloučíme s aktuálními (existující řádky zůstanou nezměněné, nové se přidají).</div>' +
        renderSelect({ field: 'sourceCp', label: 'Zdrojové MV', options: opts, value: '', placeholder: '— Vyberte —' }) +
        '<div data-preview style="margin-top:16px;"></div>',
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="do-import">Načíst data</button>'
    });
    const wrap = appendModal(html, id, true);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-field="sourceCp"]').addEventListener('change', function (ev) {
      chosenId = ev.target.value;
      const src = window.MockData.findCpById(chosenId);
      const preview = wrap.querySelector('[data-preview]');
      if (!src || !chosenId) { preview.innerHTML = ''; return; }
      const list = mode === 'ier' ? src.interactions.ier : src.interactions.ip;
      const codeKey = mode === 'ier' ? 'ierCode' : 'ipCode';
      if (!list.length) {
        preview.innerHTML = '<div class="cp-help" style="background:#fff8e1; border-left-color: var(--c3-warning);">' +
          'Zvolené místo velení nemá nastavené žádné ' + (mode === 'ier' ? 'IER' : 'IP') + ' interakce. Pro import tedy nejsou k dispozici žádná data.' +
          '</div>';
        return;
      }
      const rows = list.map(function (r) { return '<li><strong>' + esc(r[codeKey]) + '</strong></li>'; }).join('');
      preview.innerHTML = '<div><strong>Položky k importu (' + list.length + '):</strong><ul style="margin-top:4px; padding-left:24px;">' + rows + '</ul></div>';
    });

    wrap.querySelector('[data-action="do-import"]').addEventListener('click', function () {
      if (!chosenId) { alert('Vyberte zdrojové MV.'); return; }
      const src = window.MockData.findCpById(chosenId);
      const list = mode === 'ier' ? src.interactions.ier : src.interactions.ip;
      if (!list.length) { alert('Zdrojové MV nemá co importovat.'); return; }
      onMerge(list);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  }

  // ============================================================
  // G026 – Možnosti reportu MV (UC012)
  // ============================================================
  Dialogs.openReportOptions = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const id = nextModalId('rep');
    const draft = { language: 'cs', reportVariant: 'BASIC', reportClassification: 'OFFICIAL' };

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Možnosti reportu MV', size: 'sm',
      bodyHTML:
        renderSelect({ field: 'language', label: 'Jazyk', options: window.MockData.catalogs.jazyk, value: draft.language }) +
        renderSelect({ field: 'reportVariant', label: 'Varianta', options: window.MockData.catalogs.variantaReportu, value: draft.reportVariant }) +
        renderSelect({ field: 'reportClassification', label: 'Klasifikace', options: window.MockData.catalogs.klasifikace, value: draft.reportClassification }),
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="generate">' + esc(t('btn.download_pdf')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-action="generate"]').addEventListener('click', function () {
      readInputs(wrap, draft);
      window.Views.stubDownload('CP_' + cp.id + '_' + draft.reportVariant + '_' + draft.reportClassification + '.pdf', draft);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  // ============================================================
  // G027 – Možnosti CIS matice (UC013)
  // ============================================================
  Dialogs.openCisMatrixOptions = function (cpId) {
    const cp = window.MockData.findCpById(cpId);
    if (!cp) return;
    const id = nextModalId('cis');
    const draft = { language: 'cs', reportClassification: 'OFFICIAL' };

    const html = window.C3Hub.renderModalHTML({
      id: id, title: 'Možnosti reportu CIS matice', size: 'sm',
      bodyHTML:
        renderSelect({ field: 'language', label: 'Jazyk', options: window.MockData.catalogs.jazyk, value: draft.language }) +
        renderSelect({ field: 'reportClassification', label: 'Klasifikace', options: window.MockData.catalogs.klasifikace, value: draft.reportClassification }),
      footerHTML:
        '<button class="c3-btn c3-btn--outlined" data-action="close">' + esc(t('btn.cancel')) + '</button>' +
        '<button class="c3-btn c3-btn--contained" data-action="generate">' + esc(t('btn.download_xlsx')) + '</button>'
    });
    const wrap = appendModal(html, id);
    window.C3Hub.openModal(id);
    window.C3Hub.bindModalClose(wrap);

    wrap.querySelector('[data-action="generate"]').addEventListener('click', function () {
      readInputs(wrap, draft);
      window.Views.stubDownload('CP_' + cp.id + '_cis_matrix_' + draft.reportClassification + '.xlsx', draft);
      closeAndRemove(id);
    });
    wrap.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-action="close"]')) closeAndRemove(id);
    });
  };

  global.Dialogs = Dialogs;

})(typeof window !== 'undefined' ? window : globalThis);
