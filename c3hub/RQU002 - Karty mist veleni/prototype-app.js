/* ============================================================
   RQU002 – Karty míst velení – router, state, bootstrap
   ============================================================
   Hash routing: #/list ↔ #/detail/<cpId>
   State držený v App.state, render přes innerHTML do #app-root.
   ============================================================ */
(function (global) {
  'use strict';

  const App = {
    state: {
      locale: 'cs',
      user: {
        login: 'novakj',
        fullName: 'Jan Novák',
        validRoles: ['ADMINISTRATOR','EDITOR']
      },
      view: 'list',          // 'list' | 'detail'
      viewMode: 'tile',      // 'tile' | 'table'
      searchQuery: '',
      selectedId: null,
      activePopup: null      // 'lang' | 'notif' | null
    },

    init: function () {
      window.addEventListener('hashchange', App.route);
      // Klik mimo popup zavře popup
      document.addEventListener('click', function (ev) {
        if (App.state.activePopup && !ev.target.closest('.c3-popup') && !ev.target.closest('[data-action="language"], [data-action="notifications"]')) {
          App.state.activePopup = null;
          App.rerender();
        }
      });
      App.route();
    },

    route: function () {
      const hash = location.hash || '#/list';
      const m = hash.match(/^#\/detail\/(.+)$/);
      if (m) {
        App.state.view = 'detail';
        App.state.selectedId = decodeURIComponent(m[1]);
      } else {
        App.state.view = 'list';
        App.state.selectedId = null;
      }
      App.render();
    },

    navigateToList: function () {
      location.hash = '#/list';
    },

    navigateToDetail: function (cpId) {
      location.hash = '#/detail/' + encodeURIComponent(cpId);
    },

    setLocale: function (locale) {
      window.C3Hub.setLocale(locale);
      App.state.locale = window.C3Hub.locale;
      App.state.activePopup = null;
      App.rerender();
    },

    render: function () {
      const root = document.getElementById('app-root');
      if (!root) return;
      const html =
          renderHeader() +
          renderBreadcrumbs() +
          renderPopups() +
          '<main class="c3-page__content">' +
              (App.state.view === 'list' ? Views.renderList(App.state) : Views.renderDetail(App.state)) +
          '</main>';
      root.innerHTML = html;
      // Bind handlery
      window.C3Hub.bindAll(root);
      bindHeader(root);
      if (App.state.view === 'list') Views.bindList(root);
      else Views.bindDetail(root);
    },

    rerender: function () { App.render(); }
  };

  function t(key) { return window.C3Hub.t(key); }

  function renderHeader() {
    return window.C3Hub.renderMainHeaderHTML({
      appTitle: t('app.title'),
      user: App.state.user,
      showArchiRepo: window.C3Hub.isAdministrator(App.state.user),
      notificationCount: window.C3Hub.isAdministrator(App.state.user) ? 2 : null,
      currentLang: App.state.locale
    });
  }

  function renderBreadcrumbs() {
    const items = [
      { icon: 'Home', href: '../RQU001%20-%20Souhrn%20aplikace/prototype-dashboard.html', title: t('dashboard') }
    ];
    if (App.state.view === 'list') {
      items.push({ title: t('module.commandPosts'), href: '#/list', active: true });
    } else if (App.state.view === 'detail') {
      items.push({ title: t('module.commandPosts'), href: '#/list' });
      const cp = window.MockData.findCpById(App.state.selectedId);
      items.push({ title: cp ? cp.nazev : '(neznámé)', href: '', active: true });
    }
    return '<div style="padding: 0 30px; max-width: var(--c3-content-max-width); margin: 0 auto;">' +
              window.C3Hub.renderBreadcrumbsHTML(items) +
           '</div>';
  }

  function renderPopups() {
    if (App.state.activePopup === 'lang') {
      return '<div class="c3-popup-anchor" style="position:absolute; right: 60px; top: 56px;">' +
                 window.C3Hub.renderLanguageMenuHTML({ current: App.state.locale }) +
             '</div>';
    }
    if (App.state.activePopup === 'notif') {
      return '<div class="c3-popup-anchor" style="position:absolute; right: 110px; top: 56px;">' +
                 window.C3Hub.renderNotifPanelHTML({
                   title: 'Notifikace',
                   items: [
                     { title: 'Žádost o schválení MV „CSC NBC Brno"',  meta: 'Před 12 min', key: 'r1' },
                     { title: 'Změna specifikace MV „FHQ Alpha"',      meta: 'Před 1 h',    key: 'r2' }
                   ]
                 }) +
             '</div>';
    }
    return '';
  }

  function bindHeader(root) {
    // Language switch
    const langBtn = root.querySelector('[data-action="language"]');
    if (langBtn) langBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      App.state.activePopup = (App.state.activePopup === 'lang') ? null : 'lang';
      App.rerender();
    });
    // Notif
    const notifBtn = root.querySelector('[data-action="notifications"]');
    if (notifBtn) notifBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      App.state.activePopup = (App.state.activePopup === 'notif') ? null : 'notif';
      App.rerender();
    });
    // Archi repo
    const archiBtn = root.querySelector('[data-action="archi-repo"]');
    if (archiBtn) archiBtn.addEventListener('click', function () {
      alert('STUB: otevření ArchiRepo (https://archirepo.example/)');
    });
    // User menu
    const userBtn = root.querySelector('[data-action="user-menu"]');
    if (userBtn) userBtn.addEventListener('click', function () {
      alert('Uživatelské menu (stub): Profil, Změna hesla, Odhlášení');
    });
    // Language menu items
    root.querySelectorAll('.c3-lang-menu-item').forEach(function (it) {
      it.addEventListener('click', function () {
        App.setLocale(it.dataset.lang);
      });
    });
    // Notif item klik
    root.querySelectorAll('.c3-popup__item').forEach(function (it) {
      it.addEventListener('click', function () {
        alert('STUB: navigate na žádost ' + it.dataset.key);
        App.state.activePopup = null;
        App.rerender();
      });
    });
  }

  // Bootstrap
  global.App = App;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }

})(typeof window !== 'undefined' ? window : globalThis);
