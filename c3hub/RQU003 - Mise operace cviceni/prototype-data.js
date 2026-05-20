/* ============================================================
   RQU003 – Mise, operace, cvičení – mock data + lookup helpery
   ============================================================
   Vystavuje window.MockData. Data odráží logický model RQU003
   (L001 Mise, L002 Druh mise, L003 Interakce, L004 C2 vazba)
   a číselníky E001–E004.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- Místa velení (RQU002 kontext) ---------- */
  const commandPosts = [
    { id: 'cp-joc', name: 'JOC Praha',    type: 'JOC' },
    { id: 'cp-fhq', name: 'FHQ Alpha',    type: 'FHQ' },
    { id: 'cp-csc', name: 'CSC NBC Brno', type: 'CSC' },
    { id: 'cp-toc', name: 'TOC Tábor',    type: 'TOC' },
    { id: 'cp-jfc', name: 'JFC Olomouc',  type: 'JFC' }
  ];

  /* ---------- Druhy mise (L002) ---------- */
  const missionTypes = [
    { id: 'mt-1', name: 'Joint Operation' },
    { id: 'mt-2', name: 'Crisis Response' },
    { id: 'mt-3', name: 'Peacekeeping' },
    { id: 'mt-4', name: 'Multi-Domain Operations' },
    { id: 'mt-5', name: 'Exercise' },
    { id: 'mt-6', name: 'Peacebuilding' }
  ];

  /* ---------- IER toky + jejich TIN ---------- */
  const tins = [
    { id: 'tin-1', code: 'TIN-101', name: 'Secure voice link' },
    { id: 'tin-2', code: 'TIN-102', name: 'Data replication service' },
    { id: 'tin-3', code: 'TIN-103', name: 'Logistics data feed' },
    { id: 'tin-4', code: 'TIN-104', name: 'Intelligence VTC' },
    { id: 'tin-5', code: 'TIN-105', name: 'Tactical messaging' }
  ];
  const iers = [
    { id: 'ier-1', code: 'IER-001', name: 'Operational situation report', tinIds: ['tin-1', 'tin-2'] },
    { id: 'ier-2', code: 'IER-002', name: 'Logistics status report',      tinIds: ['tin-3'] },
    { id: 'ier-3', code: 'IER-003', name: 'Intelligence summary',         tinIds: ['tin-2', 'tin-4'] },
    { id: 'ier-4', code: 'IER-004', name: 'Air tasking order',            tinIds: ['tin-5'] }
  ];

  /* ---------- Číselníky ---------- */
  const paceOptions    = ['PRIMARY', 'ALTERNATE', 'CONTINGENCY', 'EMERGENCY'];
  const c2Types        = ['FULLCOM', 'OPCOM', 'OPCON', 'TACOM', 'TACON', 'ADCON', 'LOGCON'];
  const reportVariants = ['BASIC', 'COMPLETE'];
  const classifications = ['OFFICIAL', 'RESTRICTED'];
  const graphViews     = ['C2', 'IER', 'IP', 'TIN', 'JF_WFF'];

  /* ---------- Mise (L001) ---------- */
  const missions = [
    {
      id: 'm1',
      name: 'Operace Štít 2026',
      description: 'Společná operace pozemních sil na ochranu kritické infrastruktury v rámci krizové reakce.',
      invalidated: false,
      missionTypeIds: ['mt-1', 'mt-2'],
      missionOwnerId: 'cp-joc',
      planning: {
        'cp-joc': {
          ierIds: ['ier-1', 'ier-2'],
          interactions: [
            { id: 'int-1', ierId: 'ier-1', targetMvId: 'cp-fhq', tinId: 'tin-1', consumer: true,  consumerPace: 'PRIMARY',   provider: false, providerPace: null },
            { id: 'int-2', ierId: 'ier-1', targetMvId: 'cp-fhq', tinId: 'tin-2', consumer: false, consumerPace: null,        provider: true,  providerPace: 'ALTERNATE' },
            { id: 'int-3', ierId: 'ier-2', targetMvId: 'cp-toc', tinId: 'tin-3', consumer: true,  consumerPace: 'PRIMARY',   provider: false, providerPace: null }
          ]
        }
      },
      c2: [
        { id: 'c2-1', superordinateId: 'cp-joc', subordinateId: 'cp-fhq', type: 'OPCON' },
        { id: 'c2-2', superordinateId: 'cp-joc', subordinateId: 'cp-toc', type: 'TACON' },
        { id: 'c2-3', superordinateId: 'cp-jfc', subordinateId: 'cp-joc', type: 'OPCOM' }
      ]
    },
    {
      id: 'm2',
      name: 'Cvičení FECL25',
      description: 'Velitelsko-štábní cvičení zaměřené na nácvik velení a řízení vícedoménových operací.',
      invalidated: false,
      missionTypeIds: ['mt-5'],
      missionOwnerId: 'cp-fhq',
      planning: {},
      c2: []
    },
    {
      id: 'm3',
      name: 'Mise KFOR – Podpora',
      description: 'Podpůrná mise mírového charakteru s důrazem na civilně-vojenskou spolupráci.',
      invalidated: false,
      missionTypeIds: ['mt-3', 'mt-6'],
      missionOwnerId: 'cp-jfc',
      planning: {},
      c2: []
    },
    {
      id: 'm4',
      name: 'Operace Archiv 2024',
      description: 'Ukončená operace ponechaná pro archivní účely.',
      invalidated: true,
      invalidatedBy: 'novakj (Jan Novák)',
      invalidatedAt: '2025-11-02T10:15:00',
      missionTypeIds: ['mt-1'],
      missionOwnerId: 'cp-toc',
      planning: {},
      c2: []
    }
  ];

  /* ---------- Lookup helpery ---------- */
  function byId(list, id) { return list.filter(function (x) { return x.id === id; })[0] || null; }

  const MockData = {
    commandPosts: commandPosts,
    missionTypes: missionTypes,
    iers: iers,
    tins: tins,
    paceOptions: paceOptions,
    c2Types: c2Types,
    reportVariants: reportVariants,
    classifications: classifications,
    graphViews: graphViews,
    missions: missions,

    findMission: function (id) { return byId(missions, id); },
    findCp: function (id) { return byId(commandPosts, id); },
    findIer: function (id) { return byId(iers, id); },
    findTin: function (id) { return byId(tins, id); },
    findMissionType: function (id) { return byId(missionTypes, id); },

    cpName: function (id) { const c = byId(commandPosts, id); return c ? c.name : '(neznámé MV)'; },
    cpLabel: function (id) { const c = byId(commandPosts, id); return c ? c.name + ' (' + c.type + ')' : '(neznámé MV)'; },
    ierLabel: function (id) { const i = byId(iers, id); return i ? i.code + ' – ' + i.name : id; },
    tinLabel: function (id) { const t = byId(tins, id); return t ? t.code + ' – ' + t.name : id; },
    missionTypeNames: function (ids) {
      return (ids || []).map(function (id) { const m = byId(missionTypes, id); return m ? m.name : id; }).join(', ');
    },

    /** Vrátí (a případně inicializuje) plánovací záznam mise z pohledu daného MV. */
    getPlanning: function (mission, povId) {
      if (!mission.planning[povId]) {
        mission.planning[povId] = { ierIds: [], interactions: [] };
      }
      return mission.planning[povId];
    },

    /** Generátor ID pro nově vzniklé záznamy. */
    nextId: (function () { let n = 1000; return function (prefix) { n++; return (prefix || 'id') + '-' + n; }; })()
  };

  global.MockData = MockData;

})(typeof window !== 'undefined' ? window : globalThis);
