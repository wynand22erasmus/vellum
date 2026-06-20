/**
 * Sync TypeDoc theme with Vellum SPA (`vellum-theme` in localStorage).
 */
(function () {
  var STORAGE_KEY = 'vellum-theme';

  function resolveTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {
      // ignore
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme() {
    document.documentElement.dataset.theme = resolveTheme();
  }

  applyTheme();

  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) {
      applyTheme();
    }
  });

  function addBackLink() {
    var toolbar = document.querySelector('.tsd-toolbar');
    if (!toolbar || document.getElementById('vellum-back-link')) {
      return;
    }
    var link = document.createElement('a');
    link.id = 'vellum-back-link';
    link.href = '/';
    link.textContent = 'Back to app';
    toolbar.appendChild(link);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addBackLink);
  } else {
    addBackLink();
  }
})();
