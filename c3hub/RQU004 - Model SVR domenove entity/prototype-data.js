/* ============================================================
   RQU004 – Model SVŘ doménové entity – mock data + helpery
   ============================================================
   Vystavuje window.MockData. Odráží logický model RQU004
   (L021 Element, stereotypy E028, vztahy E030, Patch Request).
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- Stereotypy (E028) ---------- */
  // editable = lze +Přidat / Duplikovat; editRel = lze editovat vztahy; relevantMv = akce Relevantní MV
  const STEREOTYPES = [
    { code: 'CAP',    group: 'main', color: 'violet',         titleCs: 'MCA Schopnost',            titleEn: 'MCA Capability',
      descCs: 'Položky MCA modelu schopností.',               descEn: 'Items of the MCA capability model.',
      editable: true,  editRel: false, relevantMv: true,  readOnly: false },
    { code: 'IER',    group: 'main', color: 'orange',         titleCs: 'Informační tok IER',        titleEn: 'Information Exchange (IER)',
      descCs: 'Požadavky na výměnu informací mezi rolemi a místy velení.', descEn: 'Information exchange requirements between roles and command posts.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'IP',     group: 'main', color: 'cyan',           titleCs: 'Informační produkt IP',     titleEn: 'Information Product (IP)',
      descCs: 'Informační produkty nesené informačními toky.', descEn: 'Information products carried by information flows.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'TIN',    group: 'main', color: 'teal',           titleCs: 'Technologická interakce TIN', titleEn: 'Technology Interaction (TIN)',
      descCs: 'Technologické interakce realizující informační toky.', descEn: 'Technology interactions realising information flows.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'ROLE',   group: 'main', color: 'blue',           titleCs: 'Role',                      titleEn: 'Role',
      descCs: 'Doménové role v organizační struktuře SVŘ.',   descEn: 'Domain roles in the SVŘ organisational structure.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'BP',     group: 'main', color: 'green',          titleCs: 'Proces',                    titleEn: 'Business Process',
      descCs: 'Obchodní procesy SVŘ.',                        descEn: 'SVŘ business processes.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'BA',     group: 'main', color: 'green-light',    titleCs: 'Aktivita',                  titleEn: 'Business Activity',
      descCs: 'Obchodní aktivity tvořící procesy.',           descEn: 'Business activities forming processes.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'PI',     group: 'main', color: 'amber',          titleCs: 'Procedurální instrukce',    titleEn: 'Procedural Instruction',
      descCs: 'FMN procedurální instrukce.',                  descEn: 'FMN procedural instructions.',
      editable: true,  editRel: false, relevantMv: false, readOnly: false },
    { code: 'ORG',    group: 'main', color: 'slate-gray',     titleCs: 'Organizace',                titleEn: 'Organisation',
      descCs: 'Organizace a organizační jednotky.',           descEn: 'Organisations and organisational units.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'SRV',    group: 'catalog', color: 'turquoise',   titleCs: 'Infrastrukturní služby',    titleEn: 'Infrastructure Services',
      descCs: 'Systémově spravované infrastrukturní služby (read-only).', descEn: 'System-managed infrastructure services (read-only).',
      editable: false, editRel: false, relevantMv: false, readOnly: true },
    { code: 'APL',    group: 'catalog', color: 'purple',      titleCs: 'Aplikační služby',          titleEn: 'Application Services',
      descCs: 'Systémově spravované aplikační služby (read-only).', descEn: 'System-managed application services (read-only).',
      editable: false, editRel: false, relevantMv: false, readOnly: true },
    { code: 'CISAPP', group: 'catalog', color: 'orange-deep', titleCs: 'CIS Aplikace',              titleEn: 'CIS Applications',
      descCs: 'Uživatelsky spravované CIS aplikace.',         descEn: 'User-managed CIS applications.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false },
    { code: 'CISDEV', group: 'catalog', color: 'red-light-dark', titleCs: 'CIS Zařízení',           titleEn: 'CIS Devices',
      descCs: 'Uživatelsky spravovaná CIS zařízení.',         descEn: 'User-managed CIS devices.',
      editable: true,  editRel: true,  relevantMv: false, readOnly: false }
  ];

  // Povolené cílové stereotypy vztahů (záložky panelu vztahů G063a)
  const ALLOWED_TARGETS = {
    IER:    ['ROLE', 'IP', 'TIN'],
    IP:     ['IER', 'BA'],
    TIN:    ['IER', 'CISAPP', 'CISDEV'],
    ROLE:   ['ORG', 'BA'],
    BP:     ['BA', 'ROLE'],
    BA:     ['ROLE', 'IP'],
    ORG:    ['ROLE'],
    CISAPP: ['APL', 'TIN'],
    CISDEV: ['SRV', 'TIN']
  };

  /* ---------- Číselníky ---------- */
  const relationshipTypes = ['ACCESS', 'AGGREGATION', 'ASSIGNMENT', 'ASSOCIATION', 'COMPOSITION', 'FLOW', 'REALIZATION', 'SERVING', 'TRIGGERING'];
  const translationStatuses = ['AI_TRANSLATED', 'UPDATED', 'APPROVED'];
  const patchStates = ['REQUESTED', 'APPROVED', 'REJECTED'];

  /* ---------- Mock prvky ---------- */
  const SEED = {
    CAP:    [['Joint situational awareness', 'Společné situační povědomí'], ['Operational planning', 'Operační plánování'], ['Cyber defence', 'Kybernetická obrana'], ['Joint fires coordination', 'Koordinace společných paleb']],
    IER:    [['Operational situation report', 'Operační hlášení situace'], ['Logistics status report', 'Hlášení stavu logistiky'], ['Intelligence summary', 'Zpravodajský souhrn'], ['Air tasking order', 'Letecký úkolovací rozkaz']],
    IP:     [['Common operational picture', 'Společný operační obraz'], ['Logistics dashboard', 'Logistický přehled'], ['Threat assessment', 'Hodnocení hrozeb']],
    TIN:    [['Secure voice link', 'Zabezpečené hlasové spojení'], ['Data replication service', 'Služba replikace dat'], ['Tactical messaging', 'Taktické zasílání zpráv']],
    ROLE:  [['Operations officer', 'Operační důstojník'], ['Intelligence officer', 'Zpravodajský důstojník'], ['Logistics officer', 'Logistický důstojník']],
    BP:     [['Operational planning process', 'Proces operačního plánování'], ['Battle rhythm', 'Bojový rytmus'], ['Targeting process', 'Proces určování cílů']],
    BA:     [['Collect intelligence', 'Sběr zpravodajských informací'], ['Assess situation', 'Vyhodnocení situace'], ['Issue orders', 'Vydání rozkazů']],
    PI:     [['Battlespace management', 'Řízení bojového prostoru'], ['Friendly force tracking', 'Sledování vlastních sil'], ['Joint dynamic targeting', 'Společné dynamické určování cílů']],
    ORG:    [['Joint Force Command', 'Velitelství společných sil'], ['Land Forces Command', 'Velitelství pozemních sil'], ['CBRN Command', 'Velitelství CBRN']],
    SRV:    [['Network transport service', 'Služba síťového přenosu'], ['Directory service', 'Adresářová služba'], ['Time synchronisation service', 'Služba synchronizace času']],
    APL:    [['Messaging service', 'Služba zasílání zpráv'], ['VTC service', 'Služba videokonference'], ['Situational awareness service', 'Služba situačního přehledu']],
    CISAPP: [['COP Viewer', 'Prohlížeč COP'], ['Tactical messaging client', 'Klient taktických zpráv'], ['Mission planner', 'Plánovač misí']],
    CISDEV: [['Tactical radio RF-300', 'Taktická radiostanice RF-300'], ['Field server FS-12', 'Polní server FS-12'], ['Satellite terminal ST-9', 'Satelitní terminál ST-9']]
  };

  let elements = [];
  STEREOTYPES.forEach(function (st, sidx) {
    (SEED[st.code] || []).forEach(function (pair, i) {
      const ts = translationStatuses[(i + sidx) % 3];
      elements.push({
        id: 'el-' + st.code.toLowerCase() + '-' + (i + 1),
        stereotype: st.code,
        code: st.code + '-' + String(i + 1).padStart(3, '0'),
        name: pair[0],
        nameCz: pair[1],
        ts: ts,
        // Popis EN je vždy vyplněn (zdroj pro překlad); Popis CZ chybí u AI_TRANSLATED
        description: pair[0] + ' is a ' + st.titleEn + ' element within the joint ' +
                     'command-and-control (SVŘ) domain model.',
        descriptionCz: ts === 'AI_TRANSLATED' ? '' :
                     pair[1] + ' je prvek typu „' + st.titleCs + '“ v doménovém modelu ' +
                     'společného a velitelského řízení (SVŘ).',
        relationships: []
      });
    });
  });

  function el(idLike) {
    return elements.filter(function (e) { return e.id === idLike; })[0];
  }
  /* Seed vztahů – uloženo na zdrojovém prvku */
  function seedRel(fromId, toId, type) {
    const from = el(fromId), to = el(toId);
    if (!from || !to) return;
    from.relationships.push({
      id: 'rel-' + fromId + '-' + toId,
      targetId: toId, targetName: to.name, targetCode: to.code,
      targetStereotype: to.stereotype, type: type, direction: 'out'
    });
  }
  seedRel('el-ier-1', 'el-role-1', 'ASSIGNMENT');
  seedRel('el-ier-1', 'el-ip-1', 'FLOW');
  seedRel('el-ier-1', 'el-tin-1', 'REALIZATION');
  seedRel('el-ier-2', 'el-tin-2', 'REALIZATION');
  seedRel('el-ier-3', 'el-ip-3', 'FLOW');
  seedRel('el-role-1', 'el-org-2', 'ASSIGNMENT');
  seedRel('el-role-1', 'el-ba-3', 'ASSIGNMENT');
  seedRel('el-bp-1', 'el-ba-1', 'COMPOSITION');
  seedRel('el-bp-1', 'el-ba-2', 'COMPOSITION');
  seedRel('el-tin-1', 'el-cisapp-1', 'SERVING');
  seedRel('el-cisapp-1', 'el-apl-1', 'SERVING');
  seedRel('el-cisdev-1', 'el-srv-1', 'SERVING');

  /* ---------- Místa velení (pro G066 Relevantní MV) ---------- */
  const commandPosts = [
    { code: 'CP-001', name: 'JOC Praha',    type: 'JOC', level: 'Operační' },
    { code: 'CP-014', name: 'FHQ Alpha',    type: 'FHQ', level: 'Operační' },
    { code: 'CP-022', name: 'CSC NBC Brno', type: 'CSC', level: 'Taktická' },
    { code: 'CP-030', name: 'TOC Tábor',    type: 'TOC', level: 'Taktická' }
  ];
  // Které MV deklarují kterou MCA schopnost
  const capabilityCps = {
    'el-cap-1': [commandPosts[0], commandPosts[1], commandPosts[2]],
    'el-cap-2': [commandPosts[0], commandPosts[1]],
    'el-cap-3': [commandPosts[1]],
    'el-cap-4': [commandPosts[0], commandPosts[3]]
  };

  /* ---------- Patch Requesty ---------- */
  let patchRequests = [
    { id: 'PR-2041', requestedBy: 'novakj (Jan Novák)', requestedAt: '2026-05-18T09:30:00', state: 'REQUESTED',
      elementId: 'el-ier-1', elementName: 'Operational situation report',
      toAdd: [{ targetName: 'Threat assessment', targetCode: 'IP-003', targetStereotype: 'IP', type: 'FLOW', direction: 'out' }],
      toDelete: [] },
    { id: 'PR-2038', requestedBy: 'svobodam (Marie Svobodová)', requestedAt: '2026-05-15T14:05:00', state: 'REQUESTED',
      elementId: 'el-role-2', elementName: 'Intelligence officer',
      toAdd: [{ targetName: 'Assess situation', targetCode: 'BA-002', targetStereotype: 'BA', type: 'ASSIGNMENT', direction: 'out' }],
      toDelete: [{ targetName: 'CBRN Command', targetCode: 'ORG-003', targetStereotype: 'ORG', type: 'ASSIGNMENT', direction: 'out' }] },
    { id: 'PR-2030', requestedBy: 'novakj (Jan Novák)', requestedAt: '2026-05-09T11:20:00', state: 'APPROVED',
      elementId: 'el-tin-2', elementName: 'Data replication service',
      toAdd: [{ targetName: 'COP Viewer', targetCode: 'CISAPP-001', targetStereotype: 'CISAPP', type: 'SERVING', direction: 'out' }],
      toDelete: [] },
    { id: 'PR-2025', requestedBy: 'svobodam (Marie Svobodová)', requestedAt: '2026-05-02T08:45:00', state: 'REJECTED',
      elementId: 'el-bp-1', elementName: 'Operational planning process',
      toAdd: [], toDelete: [{ targetName: 'Issue orders', targetCode: 'BA-003', targetStereotype: 'BA', type: 'COMPOSITION', direction: 'out' }] }
  ];

  /* ---------- Helpery ---------- */
  function byCode(code) { return STEREOTYPES.filter(function (s) { return s.code === code; })[0] || null; }

  const MockData = {
    stereotypes: STEREOTYPES,
    allowedTargets: ALLOWED_TARGETS,
    relationshipTypes: relationshipTypes,
    translationStatuses: translationStatuses,
    patchStates: patchStates,
    elements: elements,
    commandPosts: commandPosts,
    capabilityCps: capabilityCps,
    patchRequests: patchRequests,

    stereotype: byCode,
    findElement: function (id) { return el(id); },
    elementsByStereotype: function (code) {
      return elements.filter(function (e) { return e.stereotype === code; });
    },
    nextId: (function () { let n = 5000; return function (p) { n++; return (p || 'id') + '-' + n; }; })(),
    nextCode: function (stCode) {
      const existing = elements.filter(function (e) { return e.stereotype === stCode; });
      let max = 0;
      existing.forEach(function (e) { const n = parseInt(e.code.split('-')[1], 10); if (n > max) max = n; });
      return stCode + '-' + String(max + 1).padStart(3, '0');
    }
  };

  global.MockData = MockData;

})(typeof window !== 'undefined' ? window : globalThis);
