/* =============================================================================
   DSZEZ – Designový předpis projektu · utility funkce
   -----------------------------------------------------------------------------
   Čisté pomocné funkce (bez DOM renderování) na globálním objektu `DSZEZ`.
   Renderovací funkce komponent jsou v dszez-renderers.js.
   ========================================================================== */
(function (global) {
  'use strict';

  var DSZEZ = global.DSZEZ || {};

  /* ----- Mapování ikon: sémantický název → Font Awesome 6 ----------------- */
  /* Reálná aplikace používá inline SVG; prototypy standardizují na FA6 CDN.
     Jedna ikona = jeden význam napříč všemi prototypy projektu. */
  DSZEZ.icons = {
    home: 'fa-house', back: 'fa-arrow-left', search: 'fa-magnifying-glass',
    filter: 'fa-filter', add: 'fa-plus', edit: 'fa-pen', delete: 'fa-trash',
    view: 'fa-eye', detail: 'fa-eye', download: 'fa-download', upload: 'fa-upload',
    attach: 'fa-paperclip', check: 'fa-check', close: 'fa-xmark',
    chevronDown: 'fa-chevron-down', chevronUp: 'fa-chevron-up',
    chevronRight: 'fa-chevron-right', user: 'fa-circle-user', users: 'fa-users',
    bell: 'fa-bell', logout: 'fa-right-from-bracket', comment: 'fa-comment',
    send: 'fa-paper-plane', delegate: 'fa-share-nodes', approve: 'fa-circle-check',
    reject: 'fa-circle-xmark', warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info', calendar: 'fa-calendar-day', clock: 'fa-clock',
    file: 'fa-file-lines', settings: 'fa-gear', save: 'fa-floppy-disk',
    test: 'fa-flask', workflow: 'fa-diagram-project'
  };

  /** Vrátí FA třídu pro daný sémantický název ikony. */
  DSZEZ.faIcon = function (name, style) {
    var cls = DSZEZ.icons[name] || 'fa-' + String(name || '').replace(/[^a-z0-9-]/gi, '');
    return 'fa-' + (style || 'solid') + ' ' + cls;
  };

  /** HTML `<i>` element s ikonou. */
  DSZEZ.iconHTML = function (name, style) {
    return '<i class="' + DSZEZ.faIcon(name, style) + '" aria-hidden="true"></i>';
  };

  /* ----- Escapování a normalizace textu ---------------------------------- */
  DSZEZ.escapeHtml = function (text) {
    if (text == null) return '';
    return String(text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };

  DSZEZ.nl2br = function (text) {
    return DSZEZ.escapeHtml(text).replace(/\n/g, '<br>');
  };

  DSZEZ.truncate = function (text, max) {
    text = String(text == null ? '' : text);
    max = max || 80;
    return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
  };

  /** Bezdiakritický kebab-case identifikátor pro anchor / id. */
  DSZEZ.slugify = function (text) {
    return String(text == null ? '' : text)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  /** Iniciály z celého jména: „Jan Novák" → „JN". */
  DSZEZ.initials = function (fullName, maxChars) {
    var parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    return parts.slice(0, maxChars || 2).map(function (p) {
      return p.charAt(0).toUpperCase();
    }).join('');
  };

  /* ----- Formátování data a času (česky) --------------------------------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toDate(input) {
    if (input instanceof Date) return input;
    if (input == null || input === '') return null;
    var d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  DSZEZ.formatDate = function (input) {
    var d = toDate(input);
    return d ? pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear() : '';
  };

  DSZEZ.formatDateTime = function (input) {
    var d = toDate(input);
    return d ? DSZEZ.formatDate(d) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : '';
  };

  DSZEZ.formatRelative = function (input) {
    var d = toDate(input);
    if (!d) return '';
    var diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return 'právě teď';
    if (diff < 3600) return 'před ' + Math.floor(diff / 60) + ' min';
    if (diff < 86400) return 'před ' + Math.floor(diff / 3600) + ' h';
    if (diff < 604800) return 'před ' + Math.floor(diff / 86400) + ' dny';
    return DSZEZ.formatDate(d);
  };

  /* ----- Mapování stavů na CSS třídy ------------------------------------- */
  /* Stav workflow / posouzení → modifikátor .inw-status--* a .inw-timeline-step--* */
  DSZEZ.STATUS_MAP = {
    pending:   { cls: 'pending',  label: 'Čeká' },
    progress:  { cls: 'progress', label: 'Ve schvalování' },
    waiting:   { cls: 'waiting',  label: 'Čeká na vyjádření' },
    approved:  { cls: 'approved', label: 'Schváleno' },
    rejected:  { cls: 'rejected', label: 'Zamítnuto' },
    skipped:   { cls: 'skipped',  label: 'Přeskočeno' }
  };

  /** Vrátí modifikátor pro `.inw-status` / `.inw-timeline-step` dle klíče stavu. */
  DSZEZ.statusClass = function (key) {
    var s = DSZEZ.STATUS_MAP[key];
    return s ? s.cls : 'pending';
  };

  /** Vrátí výchozí český popisek stavu. */
  DSZEZ.statusLabel = function (key) {
    var s = DSZEZ.STATUS_MAP[key];
    return s ? s.label : String(key || '');
  };

  /* ----- DOM helpery ----------------------------------------------------- */
  DSZEZ.$ = function (selector, root) { return (root || document).querySelector(selector); };
  DSZEZ.$$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /** Vytvoří DOM element: el('div', {class:'x'}, [childNode | 'text']). */
  DSZEZ.el = function (tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (ch) {
      node.appendChild(typeof ch === 'string' ? document.createTextNode(ch) : ch);
    });
    return node;
  };

  global.DSZEZ = DSZEZ;
})(window);
