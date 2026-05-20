/* ============================================================
   RQU003 – Mise, operace, cvičení – router, state, bootstrap
   ============================================================
   Hash routing: #/list ↔ #/detail/<missionId>
   State v App.state, render přes innerHTML do #app-root.
   Dialogy se renderují do #modal-host.
   ============================================================ */
(function (global) {
  'use strict';

  const App = {
    state: {
      locale: 'cs',
      user: { login: 'novakj', fullName: 'Jan Novák', validRoles: ['ADMINISTRATOR', 'EDITOR'] },
      view: 'list',          // 'list' | 'detail'
      selectedId: null,
      pov: null,             // zvolené „Z pohledu MV" v detailu
      detailTab: 'interactions',
      activePopup: null      // 'lang' | 'notif' | null
    },

    init: function () {
      window.addEventListener('hashchange', App.route);
      document.addEventListener('click', function (ev) {
        if (App.state.activePopup && !ev.target.closest('.c3-popup') &&
            !ev.target.closest('[data-action="language"], [data-action="notifications"]')) {
          App.state.activePopup = null;
          App.render();
        }
      });
      App.route();
    },

    route: function () {
      const hash = location.hash || '#/list';
      const m = hash.match(/^#\/detail\/(.+)$/);
      if (m && window.MockData.findMission(decodeURIComponent(m[1]))) {
        App.state.view = 'detail';
        App.state.selectedId = decodeURIComponent(m[1]);
      } else {
        App.state.view = 'list';
        App.state.selectedId = null;
        App.state.pov = null;
        App.state.detailTab = 'interactions';
      }
      App.render();
    },

    navigateToList:   function () { location.hash = '#/list'; },
    navigateToDetail: function (id) { location.hash = '#/detail/' + encodeURIComponent(id); },

    setLocale: function (locale) {
      window.C3Hub.setLocale(locale);
      App.state.locale = window.C3Hub.locale;
      App.state.activePopup = null;
      App.render();
    },

    render: function () {
      const root = document.getElementById('app-root');
      if (!root) return;
      root.innerHTML =
        renderHeader() +
        renderBreadcrumbs() +
        renderPopups() +
        '<main class="c3-page__content mi-content">' +
          (App.state.view === 'list'
            ? window.Views.renderList(App.state)
            : window.Views.renderDetail(App.state)) +
        '</main>';
      bindHeader(root);
      if (App.state.view === 'list') window.Views.bindList(root);
      else window.Views.bindDetail(root);
      window.C3Hub.bindAll(root);
    },
    rerender: function () { App.render(); },

    /* ---------- Modal helpery ---------- */
    showModal: function (html) {
      const host = document.getElementById('modal-host');
      host.innerHTML = html;
      const bd = host.querySelector('.c3-modal-backdrop');
      bd.addEventListener('click', function (ev) {
        const inDialog = ev.target.closest('.c3-modal');
        if (!inDialog || ev.target.closest('[data-action="close"]') || ev.target.closest('[data-action="cancel"]')) {
          App.closeModal();
        }
      });
      requestAnimationFrame(function () { bd.classList.add('open'); });
      return bd;
    },
    closeModal: function () { document.getElementById('modal-host').innerHTML = ''; },
    toast: function (msg) { alert(msg); },
    stubDownload: function (filename, opts) {
      alert('STUB: stažení souboru\n\nSoubor: ' + filename +
            (opts ? '\nParametry: ' + JSON.stringify(opts, null, 2) : '') +
            '\n\nV reálu by se nyní stáhl soubor z backendu.');
    }
  };

  function t(k, p) { return window.C3Hub.t(k, p); }

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
      { icon: 'Home', title: t('dashboard'), href: '../RQU001%20-%20Souhrn%20aplikace/prototype-dashboard.html' }
    ];
    if (App.state.view === 'list') {
      items.push({ title: t('module.missions'), href: '#/list', active: true });
    } else {
      items.push({ title: t('module.missions'), href: '#/list' });
      const m = window.MockData.findMission(App.state.selectedId);
      items.push({ title: m ? m.name : '(neznámá mise)', href: '#', active: true });
    }
    return '<div class="c3-page__content" style="padding-bottom:0;">' +
              window.C3Hub.renderBreadcrumbsHTML(items) +
           '</div>';
  }

  function renderPopups() {
    if (App.state.activePopup === 'lang') {
      return '<div class="c3-popup-anchor" style="position:absolute; right:60px; top:56px;">' +
                window.C3Hub.renderLanguageMenuHTML({ current: App.state.locale }) +
             '</div>';
    }
    if (App.state.activePopup === 'notif') {
      return '<div class="c3-popup-anchor" style="position:absolute; right:110px; top:56px;">' +
                window.C3Hub.renderNotifPanelHTML({
                  title: 'Notifikace',
                  items: [
                    { title: 'Mise „Operace Štít 2026" – nová C2 vazba', meta: 'Před 20 min', key: 'r1' },
                    { title: 'Report mise „Cvičení FECL25" je připraven', meta: 'Před 2 h',   key: 'r2' }
                  ]
                }) +
             '</div>';
    }
    return '';
  }

  function bindHeader(root) {
    const langBtn = root.querySelector('[data-action="language"]');
    if (langBtn) langBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      App.state.activePopup = (App.state.activePopup === 'lang') ? null : 'lang';
      App.rerender();
    });
    const notifBtn = root.querySelector('[data-action="notifications"]');
    if (notifBtn) notifBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      App.state.activePopup = (App.state.activePopup === 'notif') ? null : 'notif';
      App.rerender();
    });
    const archiBtn = root.querySelector('[data-action="archi-repo"]');
    if (archiBtn) archiBtn.addEventListener('click', function () {
      alert('STUB: otevření ArchiRepo (https://archirepo.example/)');
    });
    const userBtn = root.querySelector('[data-action="user-menu"]');
    if (userBtn) userBtn.addEventListener('click', function () {
      alert('Uživatelské menu (stub): Profil, Změna hesla, Odhlášení');
    });
    root.querySelectorAll('.c3-lang-menu-item').forEach(function (it) {
      it.addEventListener('click', function () { App.setLocale(it.dataset.lang); });
    });
    root.querySelectorAll('.c3-popup__item').forEach(function (it) {
      it.addEventListener('click', function () {
        alert('STUB: navigace na notifikaci ' + it.dataset.key);
        App.state.activePopup = null;
        App.rerender();
      });
    });
  }

  global.App = App;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }

})(typeof window !== 'undefined' ? window : globalThis);
