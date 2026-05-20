/* ============================================================
   C3HUB / COCO – Sdílené utility funkce
   ============================================================
   Čisté pomocné funkce sdílené napříč prototypy projektu C3HUB
   (`src/C3HUB/<RQU###>/prototype-*.html`).

   Vyhněte se DOM manipulaci v tomto souboru – DOM renderery
   patří do `c3hub-renderers.js`. Tady jsou:
   - formátovače (datum, čísla, jména)
   - normalizace (escape HTML, slugify)
   - mapování (card barvy z Colors.ts, FA ikony z MUI ikon)
   - jednoduché výpočty (iniciály z full name)

   Načítání v prototypu:
     <script src="../_design/c3hub-utils.js"></script>

   Vše visí na globálním objektu `C3Hub` (jmenný prostor).
   ============================================================ */

(function (global) {
  'use strict';

  const C3Hub = global.C3Hub || (global.C3Hub = {});

  /* ============================================================
     Konstanty
     ============================================================ */

  // Mapování názvů barev karet (Colors.ts) na CSS třídu
  C3Hub.cardColorClassMap = {
    'violet':         'c3-color-violet',
    'orange':         'c3-color-orange',
    'orange-deep':    'c3-color-orange-deep',
    'orange-light':   'c3-color-orange-light',
    'teal':           'c3-color-teal',
    'yellow':         'c3-color-yellow',
    'amber':          'c3-color-amber',
    'red':            'c3-color-red',
    'red-light':      'c3-color-red-light',
    'red-light-dark': 'c3-color-red-light-dark',
    'red-dark':       'c3-color-red-dark',
    'turquoise':      'c3-color-turquoise',
    'cyan':           'c3-color-cyan',
    'green':          'c3-color-green',
    'green-light':    'c3-color-green-light',
    'blue':           'c3-color-blue',
    'blue-gray':      'c3-color-blue-gray',
    'slate-gray':     'c3-color-slate-gray',
    'pink':           'c3-color-pink',
    'purple':         'c3-color-purple',
    'brown':          'c3-color-brown',
    'lime':           'c3-color-lime'
  };

  // Mapování MUI ikon (jména z @mui/icons-material) na Font Awesome
  // Slouží jen pro HTML prototypy; reálná aplikace používá MUI Icons.
  C3Hub.muiIconToFa = {
    'Home':                'fa-house',
    'AccountCircle':       'fa-circle-user',
    'Logout':              'fa-right-from-bracket',
    'VpnKey':              'fa-key',
    'Announcement':        'fa-bullhorn',
    'ExpandMore':          'fa-chevron-down',
    'ExpandLess':          'fa-chevron-up',
    'Pageview':            'fa-eye',
    'Feed':                'fa-file-lines',
    'NotificationsActive': 'fa-bell',
    'Settings':            'fa-gear',
    'Edit':                'fa-pen',
    'Delete':              'fa-trash',
    'Add':                 'fa-plus',
    'Save':                'fa-floppy-disk',
    'Close':               'fa-xmark',
    'Search':              'fa-magnifying-glass',
    'FilterAlt':           'fa-filter',
    'Download':            'fa-download',
    'Upload':              'fa-upload',
    'Info':                'fa-circle-info',
    'Warning':             'fa-triangle-exclamation',
    'Error':               'fa-circle-exclamation',
    'CheckCircle':         'fa-circle-check',
    'OpenInNew':           'fa-arrow-up-right-from-square',
    'ChevronRight':        'fa-chevron-right',
    'ChevronLeft':         'fa-chevron-left',
    'Refresh':             'fa-arrows-rotate',
    'MoreVert':            'fa-ellipsis-vertical'
  };

  /* ============================================================
     Formátovače
     ============================================================ */

  /**
   * Vrátí Font Awesome třídu pro MUI ikonu (nebo fa-question pokud neznámá).
   * @param {string} muiIconName – např. "Home", "AccountCircle"
   * @returns {string} – např. "fa-solid fa-house"
   */
  C3Hub.faIcon = function (muiIconName, style) {
    style = style || 'solid';
    const fa = C3Hub.muiIconToFa[muiIconName] || 'fa-circle-question';
    return 'fa-' + style + ' ' + fa;
  };

  /**
   * Formátuje login s plným jménem podle COCO konvence:
   *   "novakj (Jan Novák)" – pokud je full name k dispozici
   *   "novakj"             – jen login
   * @param {{login?:string, firstName?:string, lastName?:string, fullName?:string}} user
   * @returns {string}
   */
  C3Hub.formatLoginWithFullName = function (user) {
    if (!user) return '';
    const login = user.login || '';
    const fullName = user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(' ');
    if (!fullName) return login;
    if (!login) return fullName;
    return login + ' (' + fullName + ')';
  };

  /**
   * Vrátí iniciály z full name. „Jan Novák" → „JN".
   * @param {string} fullName
   * @param {number} [maxChars=2]
   * @returns {string}
   */
  C3Hub.initials = function (fullName, maxChars) {
    maxChars = maxChars || 2;
    if (!fullName) return '';
    const parts = String(fullName).trim().split(/\s+/);
    return parts
        .slice(0, maxChars)
        .map(function (p) { return p.charAt(0).toUpperCase(); })
        .join('');
  };

  /**
   * Formát datumu na "DD.MM.YYYY" (cs).
   * @param {Date|string|number} input
   * @returns {string}
   */
  C3Hub.formatDate = function (input) {
    if (input == null || input === '') return '';
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
  };

  /**
   * Formát data + času "DD.MM.YYYY HH:mm".
   */
  C3Hub.formatDateTime = function (input) {
    if (input == null || input === '') return '';
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return C3Hub.formatDate(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  };

  /**
   * "Před X" relativní čas (cs). Pro short notification feed.
   */
  C3Hub.formatRelative = function (input) {
    if (input == null || input === '') return '';
    const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return '';
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60)        return 'právě teď';
    if (diffSec < 3600)      return 'před ' + Math.floor(diffSec / 60) + ' min';
    if (diffSec < 86400)     return 'před ' + Math.floor(diffSec / 3600) + ' h';
    if (diffSec < 86400 * 7) return 'před ' + Math.floor(diffSec / 86400) + ' dny';
    return C3Hub.formatDate(d);
  };

  /* ============================================================
     Normalizace / bezpečnost
     ============================================================ */

  /**
   * Escapuje text pro vložení do innerHTML.
   */
  C3Hub.escapeHtml = function (text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
  };

  /**
   * Atomická náhrada zalomení řádků na <br>.
   */
  C3Hub.nl2br = function (text) {
    return C3Hub.escapeHtml(text).replace(/\n/g, '<br>');
  };

  /**
   * Slugify pro anchor ID (a-z 0-9 -).
   */
  C3Hub.slugify = function (text) {
    if (!text) return '';
    return String(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
  };

  /**
   * Zkrátí text na n znaků s ellipsis.
   */
  C3Hub.truncate = function (text, n) {
    if (!text) return '';
    n = n || 80;
    return text.length > n ? text.slice(0, n - 1).trim() + '…' : text;
  };

  /* ============================================================
     Mapování domén
     ============================================================ */

  /**
   * Vrátí CSS třídu pro barvu karty.
   * @param {string} colorKey – např. "orange", "violet", "teal"
   * @returns {string}
   */
  C3Hub.cardColorClass = function (colorKey) {
    if (!colorKey) return 'c3-color-blue-gray';
    const key = String(colorKey).toLowerCase().replace(/_/g, '-');
    return C3Hub.cardColorClassMap[key] || 'c3-color-blue-gray';
  };

  /**
   * Permission helper – has user roles X?
   */
  C3Hub.hasRole = function (user, role) {
    if (!user || !user.validRoles) return false;
    return user.validRoles.indexOf(role) !== -1;
  };

  C3Hub.isAdministrator = function (user) {
    return C3Hub.hasRole(user, 'ADMINISTRATOR') ||
           C3Hub.hasRole(user, 'admin');
  };

  /* ============================================================
     I18n helper – jednoduchá náhrada za i18next pro prototypy
     ============================================================ */

  // C3Hub.t(key, params, fallback) – hledá v C3Hub.translations[locale][key]
  C3Hub.translations = {
    cs: {},
    en: {}
  };
  C3Hub.locale = 'cs';

  C3Hub.setLocale = function (locale) {
    C3Hub.locale = locale === 'en' ? 'en' : 'cs';
  };

  C3Hub.t = function (key, params, fallback) {
    const dict = C3Hub.translations[C3Hub.locale] || {};
    let out = (key in dict) ? dict[key] : (fallback != null ? fallback : key);
    if (params && typeof out === 'string') {
      Object.keys(params).forEach(function (k) {
        out = out.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), params[k]);
      });
    }
    return out;
  };

  /* ============================================================
     DOM helpers – povinný minimální základ pro renderers.js
     ============================================================ */

  /**
   * Najde element selektorem (zkratka).
   */
  C3Hub.$ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  C3Hub.$$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /**
   * Vytvoří element s atributy a children. Pomocník pro renderers.
   *   el('div', {class:'x'}, ['hello']);
   */
  C3Hub.el = function (tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'dataset') Object.assign(node.dataset, attrs[k]);
        else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        } else if (attrs[k] != null) {
          node.setAttribute(k, attrs[k]);
        }
      });
    }
    if (children != null) {
      const arr = Array.isArray(children) ? children : [children];
      arr.forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  };

})(typeof window !== 'undefined' ? window : globalThis);
