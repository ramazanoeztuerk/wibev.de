/**
 * Bewegung: Seitenübergänge und Tipp-Feedback
 * Wird synchron im <head> geladen, damit die Richtung des Übergangs
 * feststeht, bevor die neue Seite das erste Mal gezeichnet wird.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'vt-dir';
  var NAV_LINKS = '.nav-link, .sidebar-link';

  // :active greift auf iOS nur, wenn es irgendwo einen Touch-Listener gibt
  document.addEventListener('touchstart', function () {}, { passive: true });

  if (reduceMotion) return;

  // Browser mit Übergängen zwischen Dokumenten (Chrome 126+, Safari 18.2+)
  var crossDocument = 'CSSViewTransitionRule' in window;
  if (!crossDocument) root.classList.add('page-fade');

  var store = {
    get: function () { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} },
    clear: function () { try { sessionStorage.removeItem(KEY); } catch (e) {} }
  };

  var fileOf = function (url) {
    return url.pathname.split('/').pop() || 'index.html';
  };
  var langOf = function (url) {
    return /\/tr\//.test(url.pathname) ? 'tr' : 'de';
  };

  // Richtung aus der Reihenfolge im Menü: weiter rechts/unten = vorwärts
  function directionTo(target) {
    var here = new URL(location.href);
    if (langOf(target) !== langOf(here)) return 'lang';
    var order = Array.prototype.map.call(document.querySelectorAll(NAV_LINKS), function (a) {
      return fileOf(new URL(a.href, location.href));
    });
    var rank = function (file) {
      var i = order.indexOf(file);
      return i === -1 ? order.length : i;
    };
    var from = rank(fileOf(here));
    var to = rank(fileOf(target));
    return to > from ? 'forward' : to < from ? 'back' : 'fade';
  }

  function internalPageLink(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return null;
    if (url.pathname === location.pathname && url.hash) return null;
    return url;
  }

  document.addEventListener('click', function (e) {
    var url = internalPageLink(e);
    if (!url) return;
    store.set(directionTo(url));

    // Ohne View Transitions: Inhalt kurz ausblenden, dann wechseln
    if (!crossDocument && url.href !== location.href) {
      e.preventDefault();
      root.classList.add('page-leaving');
      setTimeout(function () { location.href = url.href; }, 170);
    }
  });

  // Sprachumschalter ist ein Button mit onclick, kein Link
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.lang-toggle')) store.set('lang');
  }, true);

  window.addEventListener('pagereveal', function (e) {
    var dir = store.get();
    store.clear();
    if (!e.viewTransition || !e.viewTransition.types) return;

    // Zurück/Vorwärts im Browser
    var nav = window.navigation;
    if (nav && nav.activation && nav.activation.navigationType === 'traverse' && nav.activation.from) {
      dir = nav.activation.from.index > nav.currentEntry.index ? 'back' : 'forward';
    }
    if (dir) e.viewTransition.types.add(dir);
  });

  // Seite aus dem Back-Forward-Cache: ausgeblendeten Zustand zurücknehmen
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) root.classList.remove('page-leaving');
  });
})();
