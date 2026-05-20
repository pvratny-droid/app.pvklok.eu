/* ============================================================
   RQU002 – Karty míst velení – mock data + helpers
   ============================================================
   Vystavuje window.MockData s 6 MV, 19 číselníky + pomocné,
   plus helpers: lookupCatalog, lookupLabel, generateId,
   wouldCreateCycle (validace UC010), findCpById.

   Použito v prototype-app.js, prototype-views.js, prototype-dialogs.js.
   ============================================================ */
(function (global) {
  'use strict';

  // ---------- Číselníky (19 + pomocné) ----------
  const catalogs = {
    typMV: [
      { code: 'JOC', label_cs: 'Operační stanoviště (JOC)', label_en: 'Joint Operations Centre' },
      { code: 'TOC', label_cs: 'Taktické stanoviště (TOC)', label_en: 'Tactical Operations Centre' },
      { code: 'FHQ', label_cs: 'Předsunuté velitelství (FHQ)', label_en: 'Forward HQ' },
      { code: 'JFC', label_cs: 'Spojené velitelství (JFC)', label_en: 'Joint Force Command' },
      { code: 'MCC', label_cs: 'Velitelství pozemních sil', label_en: 'Maritime Component Cmd' },
      { code: 'CSC', label_cs: 'Specializované stanoviště', label_en: 'Combat Support Centre' }
    ],
    vlajka: [
      { code: 'CZ',   label_cs: 'Česká republika', label_en: 'Czech Republic', emoji: '🇨🇿' },
      { code: 'NATO', label_cs: 'NATO',            label_en: 'NATO',           emoji: '🛡️' },
      { code: 'EU',   label_cs: 'Evropská unie',   label_en: 'European Union', emoji: '🇪🇺' },
      { code: 'SK',   label_cs: 'Slovensko',       label_en: 'Slovakia',       emoji: '🇸🇰' },
      { code: 'PL',   label_cs: 'Polsko',          label_en: 'Poland',         emoji: '🇵🇱' },
      { code: 'DE',   label_cs: 'Německo',         label_en: 'Germany',        emoji: '🇩🇪' }
    ],
    taktickaZnacka: [
      { code: 'NATO-JOC',     label_cs: 'NATO JOC',           label_en: 'NATO JOC',         sym: '◆' },
      { code: 'NATO-FHQ',     label_cs: 'NATO FHQ',           label_en: 'NATO FHQ',         sym: '▲' },
      { code: 'NATO-TOC',     label_cs: 'NATO TOC',           label_en: 'NATO TOC',         sym: '■' },
      { code: 'NATO-COMMAND', label_cs: 'Spojené velení',     label_en: 'Joint Command',    sym: '⬢' },
      { code: 'NATO-DEPLOY',  label_cs: 'Nasazené velitelství', label_en: 'Deployed HQ',    sym: '◇' }
    ],
    obrazek: [
      { code: 'CP_001.png', label_cs: 'Polní stanoviště',   label_en: 'Field post',   img: '🏕️' },
      { code: 'CP_002.png', label_cs: 'Operační centrum',   label_en: 'Op. centre',   img: '🏢' },
      { code: 'CP_003.png', label_cs: 'Mobilní velitelství', label_en: 'Mobile HQ',   img: '🚛' },
      { code: 'CP_004.png', label_cs: 'Bunkr',              label_en: 'Bunker',       img: '⛺' },
      { code: 'CP_005.png', label_cs: 'Velitelská tank',    label_en: 'Command tank', img: '🛡️' }
    ],
    spolecnaFunkce: [
      { code: 'C2',     label_cs: 'C2 – Velení a řízení',  label_en: 'Command & Control' },
      { code: 'INTEL',  label_cs: 'Zpravodajství',         label_en: 'Intelligence' },
      { code: 'COMMS',  label_cs: 'Komunikace',            label_en: 'Communications' },
      { code: 'PROT',   label_cs: 'Ochrana',               label_en: 'Force Protection' },
      { code: 'SUSTAIN',label_cs: 'Udržitelnost',          label_en: 'Sustainment' }
    ],
    bojovaFunkce: [
      { code: 'FIRES',     label_cs: 'Palby',           label_en: 'Fires' },
      { code: 'MANEUVER',  label_cs: 'Manévr',          label_en: 'Maneuver' },
      { code: 'MOVEMENT',  label_cs: 'Pohyb',           label_en: 'Movement' },
      { code: 'INFO_OPS',  label_cs: 'Informační ops.', label_en: 'Information Ops.' }
    ],
    urovenMV: [
      { code: 'STRATEGIC',   label_cs: 'Strategická',   label_en: 'Strategic' },
      { code: 'OPERATIONAL', label_cs: 'Operační',      label_en: 'Operational' },
      { code: 'TACTICAL',    label_cs: 'Taktická',      label_en: 'Tactical' }
    ],
    kontinuita: [
      { code: 'PERMANENT', label_cs: 'Trvalé',  label_en: 'Permanent' },
      { code: 'TEMPORARY', label_cs: 'Dočasné', label_en: 'Temporary' }
    ],
    mobilita: [
      { code: 'STATIONARY', label_cs: 'Stacionární', label_en: 'Stationary' },
      { code: 'MOBILE',     label_cs: 'Mobilní',     label_en: 'Mobile' }
    ],
    druhMobility: [
      { code: 'VEHICLE',  label_cs: 'Vozidlo',     label_en: 'Vehicle' },
      { code: 'AIRBORNE', label_cs: 'Vzdušné',     label_en: 'Airborne' },
      { code: 'MARITIME', label_cs: 'Námořní',     label_en: 'Maritime' },
      { code: 'PORTABLE', label_cs: 'Přenosné',    label_en: 'Portable' }
    ],
    zabezpeceniOchrany: [
      { code: 'SP_LOW',  label_cs: 'Nízké',  label_en: 'Low',  desc: 'Základní ochrana objektu' },
      { code: 'SP_MED',  label_cs: 'Střední', label_en: 'Medium', desc: 'Vyšší úroveň fyzické ochrany' },
      { code: 'SP_HIGH', label_cs: 'Vysoké', label_en: 'High', desc: 'Komplexní ochrana objektu dle RMO 49/2017' }
    ],
    odolnost: [
      { code: 'RES_1', label_cs: 'Stupeň 1', label_en: 'Level 1', desc: 'Minimální odolnost' },
      { code: 'RES_2', label_cs: 'Stupeň 2', label_en: 'Level 2', desc: 'Zvýšená odolnost' },
      { code: 'RES_3', label_cs: 'Stupeň 3', label_en: 'Level 3', desc: 'Vysoká odolnost' }
    ],
    sobestacnost: [
      { code: 'SS_24H', label_cs: '24 hodin', label_en: '24 hours' },
      { code: 'SS_48H', label_cs: '48 hodin', label_en: '48 hours' },
      { code: 'SS_72H', label_cs: '72 hodin', label_en: '72 hours' },
      { code: 'SS_7D',  label_cs: '7 dnů',    label_en: '7 days' }
    ],
    kinetickaOchrana: [
      { code: 'KP_1', label_cs: 'KP_1' }, { code: 'KP_2', label_cs: 'KP_2' },
      { code: 'KP_3', label_cs: 'KP_3' }, { code: 'KP_4', label_cs: 'KP_4' },
      { code: 'KP_5', label_cs: 'KP_5' }, { code: 'KP_6', label_cs: 'KP_6' }
    ],
    minovaOchrana: [
      { code: 'MP_1', label_cs: 'MP_1' }, { code: 'MP_2', label_cs: 'MP_2' },
      { code: 'MP_3', label_cs: 'MP_3' }, { code: 'MP_4', label_cs: 'MP_4' }
    ],
    omezeni: [
      { code: 'CON_AD',    label_cs: 'Vyžaduje protivzdušnou obranu',    label_en: 'Requires air defense' },
      { code: 'CON_POWER', label_cs: 'Dvojité napájení',                  label_en: 'Dual power supply' },
      { code: 'CON_TERR',  label_cs: 'Maskování v terénu',                label_en: 'Terrain masking' },
      { code: 'CON_NBC',   label_cs: 'NBC ochrana',                        label_en: 'NBC protection' }
    ],
    pozadavek: [
      { code: 'REQ_POWER_2X', label_cs: 'Dvojité napájení 230V', label_en: 'Dual 230V power' },
      { code: 'REQ_HVAC',     label_cs: 'Klimatizace',           label_en: 'HVAC system' },
      { code: 'REQ_SATCOM',   label_cs: 'SATCOM',                label_en: 'SATCOM' },
      { code: 'REQ_SHELTER',  label_cs: 'Krytí',                 label_en: 'Shelter' }
    ],
    druhMise: [
      { code: 'DEFENSE',    label_cs: 'Obrana',                  label_en: 'Defense' },
      { code: 'OFFENSIVE',  label_cs: 'Útočná operace',          label_en: 'Offensive' },
      { code: 'STABILITY',  label_cs: 'Stabilizace',             label_en: 'Stability' },
      { code: 'HUMANITARIAN', label_cs: 'Humanitární',           label_en: 'Humanitarian' },
      { code: 'TRAINING',   label_cs: 'Cvičení',                 label_en: 'Training' }
    ],
    fmnInstrukce: [
      { code: 'FMN_FIRE',    label_cs: 'Fire Support',           iers: ['IER002','IER005'] },
      { code: 'FMN_AIR',     label_cs: 'C2 of Air Operations',   iers: ['IER004'] },
      { code: 'FMN_CIMIC',   label_cs: 'CIMIC',                   iers: [] },
      { code: 'FMN_COMMS',   label_cs: 'Communications',          iers: ['IER004','IER005'] },
      { code: 'FMN_LOG',     label_cs: 'Logistics',               iers: ['IER003'] },
      { code: 'FMN_INTEL',   label_cs: 'Intelligence',            iers: ['IER001','IER005'] },
      { code: 'FMN_PROT',    label_cs: 'Force Protection',        iers: ['IER001'] },
      { code: 'FMN_MED',     label_cs: 'Medical Support',         iers: ['IER006'] },
      { code: 'FMN_ENG',     label_cs: 'Engineering',             iers: [] },
      { code: 'FMN_INFO_OPS',label_cs: 'Information Operations',  iers: ['IER001','IER005'] },
      { code: 'FMN_TRANSP',  label_cs: 'Transport & Movement',    iers: ['IER003'] },
      { code: 'FMN_TARGET',  label_cs: 'Targeting',               iers: ['IER002'] },
      { code: 'FMN_LIAISON', label_cs: 'Liaison',                 iers: ['IER004'] }
    ],
    // MCA schopnosti s subkategoriemi (stromová struktura)
    mcaCapability: [
      {
        code: 'MCA-PREPARE', label_cs: 'Příprava operace',
        sub: [
          { code: 'MCA-PREPARE-PLAN', label_cs: 'Plánování' },
          { code: 'MCA-PREPARE-ASSESS', label_cs: 'Hodnocení rizik' },
          { code: 'MCA-PREPARE-RECON', label_cs: 'Rekognoskace' }
        ]
      },
      {
        code: 'MCA-COMMAND', label_cs: 'Velení a řízení',
        sub: [
          { code: 'MCA-COMMAND-C2', label_cs: 'C2 funkce' },
          { code: 'MCA-COMMAND-COORD', label_cs: 'Koordinace s vyšším velitelstvím' }
        ]
      },
      {
        code: 'MCA-PROJECT', label_cs: 'Projekce síly',
        sub: [
          { code: 'MCA-PROJECT-MOVE', label_cs: 'Přesun jednotek' },
          { code: 'MCA-PROJECT-FIRE', label_cs: 'Palebná podpora' }
        ]
      },
      {
        code: 'MCA-SUSTAIN', label_cs: 'Udržitelnost',
        sub: [
          { code: 'MCA-SUSTAIN-LOG', label_cs: 'Logistika' },
          { code: 'MCA-SUSTAIN-MED', label_cs: 'Zdravotní podpora' }
        ]
      }
    ],
    // TIN – Technology Interaction Need; cisApps/cisDevices = potomci pod TIN
    tinKatalog: [
      { code: 'TIN001', label_cs: 'Pozice vlastních jednotek',      label_en: 'Friendly forces position', cisApps: ['CISAPP001'],            cisDevices: ['CISDEV001'] },
      { code: 'TIN002', label_cs: 'Pozice nepřítele',                label_en: 'Enemy position',           cisApps: ['CISAPP001','CISAPP002'], cisDevices: ['CISDEV002'] },
      { code: 'TIN003', label_cs: 'Bojový stav jednotky',            label_en: 'Unit combat status',       cisApps: ['CISAPP002'],            cisDevices: [] },
      { code: 'TIN004', label_cs: 'Situace zásob',                   label_en: 'Supply status',            cisApps: ['CISAPP003'],            cisDevices: ['CISDEV003'] },
      { code: 'TIN005', label_cs: 'Souřadnice palebné podpory',      label_en: 'Fire support coordinates', cisApps: ['CISAPP004'],            cisDevices: ['CISDEV004'] },
      { code: 'TIN006', label_cs: 'Vyžádaný typ palby',              label_en: 'Requested fire type',      cisApps: ['CISAPP004'],            cisDevices: [] },
      { code: 'TIN007', label_cs: 'Stav komunikací',                 label_en: 'Comms status',             cisApps: [],                       cisDevices: ['CISDEV001','CISDEV004'] },
      { code: 'TIN008', label_cs: 'Místo zranění',                   label_en: 'Casualty location',        cisApps: ['CISAPP003'],            cisDevices: [] }
    ],
    // IER – Information Exchange Requirement; tins/businessActivities/ips = potomci pod IER.
    // businessActivities: {code, rel} – rel 'consumer'/'provider' = vztah BA k IER (label [Konzument]/[Poskytovatel]).
    ierKatalog: [
      { code: 'IER001', label_cs: 'Hlášení o nepříteli',         label_en: 'Enemy SITREP',           tins: ['TIN001','TIN002'],          businessActivities: [{code:'BA001',rel:'provider'},{code:'BA002',rel:'consumer'}], ips: ['IP002'] },
      { code: 'IER002', label_cs: 'Žádost o palebnou podporu',   label_en: 'Fire support request',   tins: ['TIN005','TIN006'],          businessActivities: [{code:'BA003',rel:'provider'}],                              ips: [] },
      { code: 'IER003', label_cs: 'Logistický stav',             label_en: 'Logistics status',       tins: ['TIN003','TIN004'],          businessActivities: [{code:'BA004',rel:'consumer'}],                              ips: ['IP003'] },
      { code: 'IER004', label_cs: 'Operační rozkaz',             label_en: 'Operations order',       tins: ['TIN001','TIN003','TIN007'], businessActivities: [{code:'BA002',rel:'provider'},{code:'BA005',rel:'consumer'}], ips: ['IP001'] },
      { code: 'IER005', label_cs: 'Situační hlášení',            label_en: 'SITREP',                 tins: ['TIN001','TIN002','TIN003'], businessActivities: [{code:'BA001',rel:'consumer'}],                              ips: ['IP001','IP002'] },
      { code: 'IER006', label_cs: 'Žádost o evakuaci',           label_en: 'Evacuation request',     tins: ['TIN008'],                   businessActivities: [],                                                           ips: ['IP004'] }
    ],
    ipKatalog: [
      { code: 'IP001', label_cs: 'OPORD',             label_en: 'OPORD',          iers: ['IER004','IER005'] },
      { code: 'IP002', label_cs: 'INTREP',            label_en: 'INTREP',         iers: ['IER001','IER005'] },
      { code: 'IP003', label_cs: 'LOGREP',            label_en: 'LOGREP',         iers: ['IER003'] },
      { code: 'IP004', label_cs: 'MEDEVAC NINELINE',  label_en: 'MEDEVAC 9-Line', iers: ['IER006'] },
      { code: 'IP005', label_cs: 'FRAGO',             label_en: 'FRAGO',          iers: [] }
    ],
    // BA – Business Activity; businessProcesses = potomci BP pod BA
    baKatalog: [
      { code: 'BA001', label_cs: 'Vyhodnocení zpravodajské situace', label_en: 'Intelligence assessment',  businessProcesses: ['BP001','BP002'] },
      { code: 'BA002', label_cs: 'Plánování operace',                label_en: 'Operation planning',        businessProcesses: ['BP003'] },
      { code: 'BA003', label_cs: 'Koordinace palebné podpory',       label_en: 'Fire support coordination', businessProcesses: ['BP004'] },
      { code: 'BA004', label_cs: 'Řízení zásobování',                label_en: 'Supply management',         businessProcesses: ['BP005'] },
      { code: 'BA005', label_cs: 'Vydání rozkazu',                   label_en: 'Order issuance',            businessProcesses: ['BP003','BP006'] }
    ],
    // BP – Business Process
    bpKatalog: [
      { code: 'BP001', label_cs: 'Sběr zpravodajských dat',      label_en: 'Intelligence collection' },
      { code: 'BP002', label_cs: 'Analýza nepřítele',            label_en: 'Enemy analysis' },
      { code: 'BP003', label_cs: 'Tvorba operačního plánu',      label_en: 'Operation plan development' },
      { code: 'BP004', label_cs: 'Schválení a uvolnění palby',   label_en: 'Fire approval & release' },
      { code: 'BP005', label_cs: 'Distribuce materiálu',         label_en: 'Material distribution' },
      { code: 'BP006', label_cs: 'Šíření rozkazu jednotkám',     label_en: 'Order dissemination' }
    ],
    // CIS aplikace – potomci pod TIN
    cisAppKatalog: [
      { code: 'CISAPP001', label_cs: 'COP Viewer',          label_en: 'COP Viewer' },
      { code: 'CISAPP002', label_cs: 'Battle Management System', label_en: 'Battle Management System' },
      { code: 'CISAPP003', label_cs: 'Logistický portál',   label_en: 'Logistics portal' },
      { code: 'CISAPP004', label_cs: 'Fires Control App',   label_en: 'Fires Control App' }
    ],
    // CIS zařízení – potomci pod TIN
    cisDeviceKatalog: [
      { code: 'CISDEV001', label_cs: 'Taktická radiostanice', label_en: 'Tactical radio' },
      { code: 'CISDEV002', label_cs: 'Pozemní senzor',        label_en: 'Ground sensor' },
      { code: 'CISDEV003', label_cs: 'Datový server',         label_en: 'Data server' },
      { code: 'CISDEV004', label_cs: 'SATCOM terminál',       label_en: 'SATCOM terminal' }
    ],
    role: [
      { code: 'R_CMD',   label_cs: 'Velitel' },
      { code: 'R_OPS',   label_cs: 'Důstojník operací (J3)' },
      { code: 'R_INT',   label_cs: 'Zpravodajec (J2)' },
      { code: 'R_LOG',   label_cs: 'Logistik (J4)' },
      { code: 'R_COMMS', label_cs: 'Spojař (J6)' },
      { code: 'R_FIRE',  label_cs: 'Důstojník palby' },
      { code: 'R_MEDIC', label_cs: 'Zdravotnický důstojník' },
      { code: 'R_LIAISON', label_cs: 'Styčný důstojník' }
    ],
    jazyk: [
      { code: 'cs', label_cs: 'Čeština',  label_en: 'Czech' },
      { code: 'en', label_cs: 'Angličtina', label_en: 'English' }
    ],
    variantaReportu: [
      { code: 'BASIC',    label_cs: 'Základní',  label_en: 'Basic' },
      { code: 'COMPLETE', label_cs: 'Kompletní', label_en: 'Complete' }
    ],
    klasifikace: [
      { code: 'OFFICIAL',   label_cs: 'Pro služební potřebu', label_en: 'Official Use' },
      { code: 'RESTRICTED', label_cs: 'Vyhrazené',            label_en: 'Restricted' }
    ]
  };

  // ---------- 6 mock MV ----------
  const commandPosts = [
    {
      id: 'CP001', kod: 'JOC-NATO-01', nazev: 'JOC NATO Praha',
      popis: 'Společné operační stanoviště NATO mise EFP – velitelský prvek na strategické úrovni s celodenním provozem a redundantním spojením.',
      typ: 'JOC', zodpovedna: 'Plk. Jan Novák',
      vlajka: 'NATO', taktickaZnacka: 'NATO-JOC', obrazek: 'CP_002.png',
      unitCode: 'EFP-PRG-01',
      jointFunctions: ['C2','INTEL','COMMS'],
      combatFunctions: ['INFO_OPS'],
      level: 'STRATEGIC',
      continuityCode: 'PERMANENT',
      mobilityType: 'STATIONARY',
      mobilitySpec: [],
      balisticProtectionKinetic: null, balisticProtectionMine: null,
      securityProtection: 'SP_HIGH', resilience: 'RES_3', selfSustainment: 'SS_7D',
      constraints: ['CON_NBC','CON_POWER'],
      functionDescription: 'Velení a koordinace operací EFP. Příjem a šíření zpravodajských produktů. Koordinace s národními velitelstvími aliance.',
      requirements: ['REQ_POWER_2X','REQ_HVAC','REQ_SATCOM'],
      vodosNumber: 'VODOS-2023-0142',
      gpsLat: 50.0875, gpsLon: 14.4213,
      subordinates: ['CP002','CP003'],
      lastModified: '2026-05-12T10:22:00',
      structure: {
        breakdowns: ['H1','H2','H3'],
        positions: [
          { id: 'P001', name: 'Velitel JOC',           personName: 'Plk. Novák',  roles: ['R_CMD'], parentId: null },
          { id: 'P002', name: 'Operační sekce J3',     personName: 'Mjr. Dvořák', roles: ['R_OPS','R_FIRE'], parentId: 'P001' },
          { id: 'P003', name: 'Zpravodajská sekce J2', personName: 'Mjr. Svoboda', roles: ['R_INT'], parentId: 'P001' }
        ],
        rolesWithoutPosition: ['R_LIAISON']
      },
      capabilities: {
        missions: ['DEFENSE','STABILITY'],
        mca: {
          'MCA-PREPARE-PLAN': true, 'MCA-PREPARE-ASSESS': true, 'MCA-PREPARE-RECON': false,
          'MCA-COMMAND-C2': true, 'MCA-COMMAND-COORD': true,
          'MCA-PROJECT-MOVE': false, 'MCA-PROJECT-FIRE': false,
          'MCA-SUSTAIN-LOG': true, 'MCA-SUSTAIN-MED': true
        }
      },
      interactions: {
        ier: [
          { ierCode: 'IER001', req: true,  consumer: true,  provider: false },
          { ierCode: 'IER004', req: true,  consumer: false, provider: true },
          { ierCode: 'IER005', req: false, consumer: true,  provider: true }
        ],
        ip: [
          { ipCode: 'IP001', req: true,  consumer: false, provider: true },
          { ipCode: 'IP002', req: true,  consumer: true,  provider: false }
        ]
      },
      fmnInstructions: ['FMN_FIRE','FMN_INTEL','FMN_COMMS','FMN_LOG']
    },
    {
      id: 'CP002', kod: 'FHQ-ALPHA', nazev: 'FHQ Alpha',
      popis: 'Předsunuté velitelství úrovně brigády – mobilní platforma, krátkodobé nasazení do 72 h.',
      typ: 'FHQ', zodpovedna: 'Pplk. Petra Horáková',
      vlajka: 'CZ', taktickaZnacka: 'NATO-FHQ', obrazek: 'CP_003.png',
      unitCode: '4BR-FHQ',
      jointFunctions: ['C2','COMMS'],
      combatFunctions: ['FIRES','MANEUVER'],
      level: 'OPERATIONAL',
      continuityCode: 'TEMPORARY',
      mobilityType: 'MOBILE',
      mobilitySpec: ['VEHICLE','PORTABLE'],
      balisticProtectionKinetic: 'KP_3', balisticProtectionMine: 'MP_2',
      securityProtection: 'SP_MED', resilience: 'RES_2', selfSustainment: 'SS_72H',
      constraints: ['CON_AD','CON_TERR'],
      functionDescription: 'Operační velení podřízeným jednotkám v poli, koordinace palebné podpory.',
      requirements: ['REQ_POWER_2X','REQ_SATCOM','REQ_SHELTER'],
      vodosNumber: 'VODOS-2024-0207',
      gpsLat: 49.8000, gpsLon: 14.1000,
      subordinates: ['CP003','CP004'],
      lastModified: '2026-04-29T14:48:00',
      structure: {
        breakdowns: ['H2','H3'],
        positions: [
          { id: 'P010', name: 'Velitel brigády',  personName: 'Pplk. Horáková', roles: ['R_CMD'], parentId: null },
          { id: 'P011', name: 'Štáb',             personName: '',               roles: ['R_OPS','R_LOG','R_COMMS'], parentId: 'P010' }
        ],
        rolesWithoutPosition: []
      },
      capabilities: {
        missions: ['OFFENSIVE','DEFENSE'],
        mca: {
          'MCA-COMMAND-C2': true,
          'MCA-PROJECT-MOVE': true, 'MCA-PROJECT-FIRE': true,
          'MCA-SUSTAIN-LOG': true
        }
      },
      interactions: {
        ier: [
          { ierCode: 'IER002', req: true,  consumer: true,  provider: false },
          { ierCode: 'IER003', req: true,  consumer: true,  provider: true }
        ],
        ip: [ { ipCode: 'IP003', req: true, consumer: true, provider: false } ]
      },
      fmnInstructions: ['FMN_FIRE','FMN_LOG']
    },
    {
      id: 'CP003', kod: 'TOC-BRAVO', nazev: 'TOC Bravo',
      popis: 'Taktické stanoviště úrovně praporu, mobilní s vozidlovou platformou.',
      typ: 'TOC', zodpovedna: 'Kpt. Tomáš Veselý',
      vlajka: 'CZ', taktickaZnacka: 'NATO-TOC', obrazek: 'CP_003.png',
      unitCode: '41M-TOC',
      jointFunctions: ['C2'],
      combatFunctions: ['MANEUVER','MOVEMENT'],
      level: 'TACTICAL',
      continuityCode: 'TEMPORARY',
      mobilityType: 'MOBILE',
      mobilitySpec: ['VEHICLE'],
      balisticProtectionKinetic: 'KP_2', balisticProtectionMine: 'MP_1',
      securityProtection: 'SP_LOW', resilience: 'RES_1', selfSustainment: 'SS_48H',
      constraints: ['CON_TERR'],
      functionDescription: 'Velení a řízení mechanizovaného praporu v poli.',
      requirements: ['REQ_POWER_2X','REQ_SHELTER'],
      vodosNumber: 'VODOS-2024-0308',
      gpsLat: 49.6500, gpsLon: 14.0500,
      subordinates: [],
      lastModified: '2026-05-02T08:11:00',
      structure: {
        breakdowns: ['H3'],
        positions: [
          { id: 'P020', name: 'Velitel praporu', personName: 'Kpt. Veselý', roles: ['R_CMD','R_OPS'], parentId: null }
        ],
        rolesWithoutPosition: ['R_MEDIC']
      },
      capabilities: {
        missions: ['DEFENSE'],
        mca: { 'MCA-COMMAND-C2': true, 'MCA-PROJECT-MOVE': true }
      },
      interactions: { ier: [], ip: [] },
      fmnInstructions: []
    },
    {
      id: 'CP004', kod: 'CSC-NBC-01', nazev: 'CSC NBC Brno',
      popis: 'Specializované stanoviště – ochrana proti zbraním hromadného ničení.',
      typ: 'CSC', zodpovedna: 'Mjr. Hana Černá',
      vlajka: 'CZ', taktickaZnacka: 'NATO-COMMAND', obrazek: 'CP_001.png',
      unitCode: 'NBC-BRN',
      jointFunctions: ['PROT','INTEL'],
      combatFunctions: [],
      level: 'OPERATIONAL',
      continuityCode: 'PERMANENT',
      mobilityType: 'STATIONARY',
      mobilitySpec: [],
      balisticProtectionKinetic: null, balisticProtectionMine: null,
      securityProtection: 'SP_HIGH', resilience: 'RES_3', selfSustainment: 'SS_72H',
      constraints: ['CON_NBC'],
      functionDescription: 'Specializované velitelské pracoviště pro NBC operace.',
      requirements: ['REQ_POWER_2X','REQ_HVAC','REQ_SHELTER'],
      vodosNumber: 'VODOS-2023-0099',
      gpsLat: 49.1951, gpsLon: 16.6068,
      subordinates: [],
      lastModified: '2026-03-15T16:30:00',
      structure: {
        breakdowns: ['H1','H2'],
        positions: [
          { id: 'P030', name: 'Vedoucí NBC',     personName: 'Mjr. Černá',   roles: ['R_CMD','R_INT'], parentId: null },
          { id: 'P031', name: 'Asistent',        personName: 'Por. Novotný', roles: ['R_OPS'],          parentId: 'P030' }
        ],
        rolesWithoutPosition: []
      },
      capabilities: {
        missions: ['DEFENSE','HUMANITARIAN'],
        mca: { 'MCA-PREPARE-ASSESS': true, 'MCA-COMMAND-C2': true }
      },
      interactions: { ier: [ { ierCode: 'IER005', req: true, consumer: true, provider: false } ], ip: [] },
      fmnInstructions: ['FMN_PROT','FMN_MED']
    },
    {
      id: 'CP005', kod: 'JFC-PRG', nazev: 'JFC Praha',
      popis: 'Spojené velitelství dvou domén – pozemní a vzdušná složka, stálé pracoviště.',
      typ: 'JFC', zodpovedna: 'Gen. Bc. Karel Mareš',
      vlajka: 'CZ', taktickaZnacka: 'NATO-COMMAND', obrazek: 'CP_002.png',
      unitCode: 'JFC-PRG',
      jointFunctions: ['C2','INTEL','COMMS','SUSTAIN'],
      combatFunctions: ['FIRES','MANEUVER','INFO_OPS'],
      level: 'STRATEGIC',
      continuityCode: 'PERMANENT',
      mobilityType: 'STATIONARY',
      mobilitySpec: [],
      balisticProtectionKinetic: null, balisticProtectionMine: null,
      securityProtection: 'SP_HIGH', resilience: 'RES_3', selfSustainment: 'SS_7D',
      constraints: ['CON_NBC','CON_POWER'],
      functionDescription: 'Strategické velení společným silám České republiky.',
      requirements: ['REQ_POWER_2X','REQ_HVAC','REQ_SATCOM','REQ_SHELTER'],
      vodosNumber: 'VODOS-2022-0010',
      gpsLat: 50.0700, gpsLon: 14.4400,
      subordinates: ['CP001','CP002'],
      lastModified: '2026-05-15T07:00:00',
      structure: {
        breakdowns: ['H1'],
        positions: [
          { id: 'P040', name: 'Náčelník štábu', personName: 'Gen. Mareš', roles: ['R_CMD'], parentId: null }
        ],
        rolesWithoutPosition: ['R_LIAISON','R_COMMS']
      },
      capabilities: {
        missions: ['DEFENSE','OFFENSIVE','STABILITY','TRAINING'],
        mca: {
          'MCA-PREPARE-PLAN': true, 'MCA-PREPARE-ASSESS': true,
          'MCA-COMMAND-C2': true, 'MCA-COMMAND-COORD': true,
          'MCA-PROJECT-MOVE': true, 'MCA-PROJECT-FIRE': true,
          'MCA-SUSTAIN-LOG': true, 'MCA-SUSTAIN-MED': true
        }
      },
      interactions: {
        ier: [ { ierCode: 'IER004', req: true, consumer: false, provider: true } ],
        ip:  [ { ipCode: 'IP001', req: true, consumer: false, provider: true } ]
      },
      fmnInstructions: ['FMN_FIRE','FMN_AIR','FMN_INTEL','FMN_COMMS','FMN_LOG','FMN_TARGET']
    },
    {
      id: 'CP006', kod: 'MCC-TRN', nazev: 'MCC Training Olomouc',
      popis: 'Cvičné velitelské pracoviště – školní centrum pro nácvik štábní práce.',
      typ: 'MCC', zodpovedna: 'Pplk. Eva Procházková',
      vlajka: 'EU', taktickaZnacka: 'NATO-DEPLOY', obrazek: 'CP_004.png',
      unitCode: 'TRN-OL',
      jointFunctions: ['C2','INTEL'],
      combatFunctions: ['MANEUVER'],
      level: 'TACTICAL',
      continuityCode: 'PERMANENT',
      mobilityType: 'STATIONARY',
      mobilitySpec: [],
      balisticProtectionKinetic: null, balisticProtectionMine: null,
      securityProtection: 'SP_LOW', resilience: 'RES_1', selfSustainment: 'SS_24H',
      constraints: [],
      functionDescription: 'Tréninkové stanoviště pro výuku štábní práce a procedur NATO.',
      requirements: ['REQ_HVAC'],
      vodosNumber: '',
      gpsLat: null, gpsLon: null,
      subordinates: [],
      lastModified: '2026-02-28T11:00:00',
      structure: {
        breakdowns: ['H4'],
        positions: [],
        rolesWithoutPosition: []
      },
      capabilities: { missions: ['TRAINING'], mca: { 'MCA-PREPARE-PLAN': true } },
      interactions: { ier: [], ip: [] },
      fmnInstructions: []
    }
  ];

  // ---------- Helpers ----------

  /** Lookup položky v číselníku podle code. */
  function lookupCatalog(catalogName, code) {
    const cat = catalogs[catalogName];
    if (!cat || !code) return null;
    for (let i = 0; i < cat.length; i++) {
      if (cat[i].code === code) return cat[i];
    }
    // u mcaCapability hledej i v sub
    if (catalogName === 'mcaCapability') {
      for (let i = 0; i < cat.length; i++) {
        if (cat[i].sub) for (let j = 0; j < cat[i].sub.length; j++) {
          if (cat[i].sub[j].code === code) return cat[i].sub[j];
        }
      }
    }
    return null;
  }

  /** Vrátí label podle aktuálního locale (cs/en). Fallback na cs. */
  function lookupLabel(catalogName, code) {
    const item = lookupCatalog(catalogName, code);
    if (!item) return code || '';
    const locale = (window.C3Hub && window.C3Hub.locale) || 'cs';
    return item['label_' + locale] || item.label_cs || item.code;
  }

  /** Najde MV podle ID. */
  function findCpById(id) {
    for (let i = 0; i < commandPosts.length; i++) {
      if (commandPosts[i].id === id) return commandPosts[i];
    }
    return null;
  }

  /** Generuje nové ID pro nové MV. */
  let _nextId = 7;
  function generateId() {
    return 'CP' + String(_nextId++).padStart(3, '0');
  }
  function generatePositionId() {
    return 'P' + String(Date.now()).slice(-6);
  }

  /**
   * Kontrola cyklu při přidání podřízeného (UC010).
   * Vrací true pokud by candidate byl v transitive ancestors of parent, nebo candidate == parent.
   */
  function wouldCreateCycle(parentId, candidateId) {
    if (!parentId || !candidateId) return false;
    if (parentId === candidateId) return true;
    // Existuje cesta z candidate do parent přes subordinates?
    const visited = {};
    function descendsTo(fromId, targetId) {
      if (fromId === targetId) return true;
      if (visited[fromId]) return false;
      visited[fromId] = true;
      const cp = findCpById(fromId);
      if (!cp || !cp.subordinates) return false;
      for (let i = 0; i < cp.subordinates.length; i++) {
        if (descendsTo(cp.subordinates[i], targetId)) return true;
      }
      return false;
    }
    // Cyklus = parent je již descendant of candidate
    return descendsTo(candidateId, parentId);
  }

  /** Označí MV jako právě upravené (lastModified = now). */
  function markModified(cp) {
    cp.lastModified = new Date().toISOString();
  }

  // ---------- i18n strings (UI šablony, ne data) ----------
  if (window.C3Hub) {
    Object.assign(window.C3Hub.translations.cs, {
      'app.title':            'C3 HUB',
      'module.commandPosts':  'Karty míst velení',
      'dashboard':            'Plocha',
      'search.commandPosts':  'Vyhledat místa velení podle jména nebo popisu',
      'view.tile':            'Dlaždice',
      'view.table':           'Tabulka',
      'btn.add':              '+ Přidat',
      'btn.show':             'Zobrazit',
      'btn.report':           'Report',
      'btn.edit':             'Upravit',
      'btn.save':             'Uložit',
      'btn.cancel':           'Zrušit',
      'btn.create':           'Vytvořit',
      'btn.download_pdf':     'Stáhnout PDF',
      'btn.download_xlsx':    'Stáhnout XLSX',
      'btn.delete':           'Smazat',
      'btn.close':            'Zavřít',
      'col.actions':          'Akce',
      'col.code':             'Kód',
      'col.name':             'Název',
      'col.description':      'Popis',
      'col.lastModified':     'Naposledy změněno',
      'col.responsible':      'Zodpovědná osoba',
      'section.spec':         'Specifikace, schopnosti a velitelská struktura',
      'section.flows':        'Informační toky a produkty na místě velení',
      'section.fmn':          'FMN instrukce',
      'section.download':     'Karty míst velení ke stažení',
      'tile.spec':            'Specifikace MV',
      'tile.capabilities':    'Formulář schopností',
      'tile.structure':       'Strukturu velení',
      'tile.ier':             'Pohled přes IER',
      'tile.ip':              'Pohled přes IP',
      'tile.basicCard':       'Základní karta velení',
      'tile.extendedCard':    'Rozšířená karta velení',
      'tile.cisMatrix':       'CIS matice',
      'noResults':            'Žádné záznamy',
      'requiredField':        '* povinné pole'
    });
    Object.assign(window.C3Hub.translations.en, {
      'app.title':            'C3 HUB',
      'module.commandPosts':  'Command Post Cards',
      'dashboard':            'Dashboard',
      'search.commandPosts':  'Search command posts by name or description',
      'view.tile':            'Tile',
      'view.table':           'Table',
      'btn.add':              '+ Add',
      'btn.show':             'View',
      'btn.report':           'Report',
      'btn.edit':             'Edit',
      'btn.save':             'Save',
      'btn.cancel':           'Cancel',
      'btn.create':           'Create',
      'btn.download_pdf':     'Download PDF',
      'btn.download_xlsx':    'Download XLSX',
      'btn.delete':           'Delete',
      'btn.close':            'Close',
      'col.actions':          'Actions',
      'col.code':             'Code',
      'col.name':             'Name',
      'col.description':      'Description',
      'col.lastModified':     'Last modified',
      'col.responsible':      'Responsible person',
      'section.spec':         'Specification, capabilities and command structure',
      'section.flows':        'Information flows and products at command post',
      'section.fmn':          'FMN instructions',
      'section.download':     'Command Post Cards to download',
      'tile.spec':            'CP Specification',
      'tile.capabilities':    'Capabilities form',
      'tile.structure':       'Command Structure',
      'tile.ier':             'View through IER',
      'tile.ip':              'View through IP',
      'tile.basicCard':       'Basic Command Card',
      'tile.extendedCard':    'Extended Command Card',
      'tile.cisMatrix':       'CIS Matrix',
      'noResults':            'No records',
      'requiredField':        '* required field'
    });
  }

  // ---------- Export ----------
  global.MockData = {
    catalogs: catalogs,
    commandPosts: commandPosts,
    lookupCatalog: lookupCatalog,
    lookupLabel: lookupLabel,
    findCpById: findCpById,
    generateId: generateId,
    generatePositionId: generatePositionId,
    wouldCreateCycle: wouldCreateCycle,
    markModified: markModified
  };

})(typeof window !== 'undefined' ? window : globalThis);
