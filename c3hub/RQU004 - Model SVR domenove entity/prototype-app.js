/* ============================================================
   RQU004 – Model SVŘ – router, state, bootstrap
   ============================================================
   Hash routing:
     #/model                – rozcestník (G056)
     #/elements/<stereotype> – přehled prvků stereotypu (G058)
     #/all                  – všechny prvky modelu (G060)
     #/patch-requests       – přehled patch requestů (G067)
     #/metamodel            – referenční dokumentace (G069)
   ============================================================ */
(function (global) {
  'use strict';

  const App = {
    state: {
      locale: 'cs',
      user: { login: 'novakj', fullName: 'Jan Novák', validRoles: ['ADMINISTRATOR'] },
      view: 'model',          // 'model' | 'elements' | 'all' | 'patch-requests' | 'metamodel'
      stereotype: null,
      searchQuery: '',
      activePopup: null
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
      const hash = location.hash || '#/model';
      const mEl = hash.match(/^#\/elements\/([A-Z]+)$/);
      App.state.searchQuery = '';
      if (mEl && window.MockData.stereotype(mEl[1])) {
        App.state.view = 'elements';
        App.state.stereotype = mEl[1];
      } else if (hash.indexOf('#/all') === 0) {
        App.state.view = 'all';
        App.state.stereotype = null;
      } else if (hash.indexOf('#/patch-requests') === 0) {
        App.state.view = 'patch-requests';
      } else if (hash.indexOf('#/metamodel') === 0) {
        App.state.view = 'metamodel';
      } else {
        App.state.view = 'model';
        App.state.stereotype = null;
      }
      App.render();
    },

    go: function (hash) { location.hash = hash; },

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
        renderHeader() + renderBreadcrumbs() + renderPopups() +
        '<main class="c3-page__content md-content">' + window.Views.renderCurrent(App.state) + '</main>';
      bindHeader(root);
      window.Views.bindCurrent(root);
      window.C3Hub.bindAll(root);
    },
    rerender: function () { App.render(); },

    // Modální stack – umožňuje vnořené dialogy (G064/G070 nad G063)
    showModal: function (html) {
      const host = document.getElementById('modal-host');
      host.insertAdjacentHTML('beforeend', html);
      const bd = host.lastElementChild;
      if (host.children.length > 1) bd.classList.add('nested');
      bd.addEventListener('click', function (ev) {
        const inDialog = ev.target.closest('.c3-modal');
        if (!inDialog || ev.target.closest('[data-action="close"]') || ev.target.closest('[data-action="cancel"]')) {
          if (bd.parentNode) bd.parentNode.removeChild(bd);
        }
      });
      requestAnimationFrame(function () { bd.classList.add('open'); });
      return bd;
    },
    closeModal: function (bd) {
      const host = document.getElementById('modal-host');
      const target = bd || host.lastElementChild;
      if (target && target.parentNode === host) host.removeChild(target);
    },
    closeAllModals: function () { document.getElementById('modal-host').innerHTML = ''; },
    toast: function (msg) { alert(msg); }
  };

  function t(k, p) { return window.C3Hub.t(k, p); }

  function renderHeader() {
    return window.C3Hub.renderMainHeaderHTML({
      appTitle: t('app.title'),
      user: App.state.user,
      showArchiRepo: window.C3Hub.isAdministrator(App.state.user),
      notificationCount: window.C3Hub.isAdministrator(App.state.user)
        ? window.MockData.patchRequests.filter(function (p) { return p.state === 'REQUESTED'; }).length
        : null,
      currentLang: App.state.locale
    });
  }

  function renderBreadcrumbs() {
    const items = [
      { icon: 'Home', title: t('dashboard'), href: '../RQU001%20-%20Souhrn%20aplikace/prototype-dashboard.html' }
    ];
    if (App.state.view === 'model') {
      items.push({ title: t('module.model'), href: '#/model', active: true });
    } else {
      items.push({ title: t('module.model'), href: '#/model' });
      let leaf = '';
      if (App.state.view === 'elements') {
        const st = window.MockData.stereotype(App.state.stereotype);
        leaf = App.state.locale === 'en' ? st.titleEn : st.titleCs;
      } else if (App.state.view === 'all') leaf = t('search.title');
      else if (App.state.view === 'patch-requests') leaf = t('module.patchRequests');
      else if (App.state.view === 'metamodel') leaf = t('module.metamodel');
      items.push({ title: leaf, href: '#', active: true });
    }
    return '<div class="c3-page__content" style="padding-bottom:0;">' +
              window.C3Hub.renderBreadcrumbsHTML(items) + '</div>';
  }

  function renderPopups() {
    if (App.state.activePopup === 'lang') {
      return '<div class="c3-popup-anchor" style="position:absolute; right:60px; top:56px;">' +
                window.C3Hub.renderLanguageMenuHTML({ current: App.state.locale }) + '</div>';
    }
    if (App.state.activePopup === 'notif') {
      const items = window.MockData.patchRequests
        .filter(function (p) { return p.state === 'REQUESTED'; })
        .map(function (p) { return { title: 'Patch Request ' + p.id + ' – ' + p.elementName, meta: p.requestedBy, key: p.id }; });
      return '<div class="c3-popup-anchor" style="position:absolute; right:110px; top:56px;">' +
                window.C3Hub.renderNotifPanelHTML({ title: 'Notifikace – patch requesty', items: items }) + '</div>';
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
        App.state.activePopup = null;
        location.hash = '#/patch-requests';
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
