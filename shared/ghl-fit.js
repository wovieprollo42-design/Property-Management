/* GHL fit · only in the full-page GHL exports (exports/ghl-pages/).
   A GHL "Custom JS/HTML" element sits inside a section, a row and a column, each with its own
   padding and a maximum width. This removes that spacing on the wrappers that hold THIS code
   only, so the design runs edge to edge, and turns "overflow: hidden" into "overflow: clip" on
   them (hidden would stop the header from staying pinned while scrolling). It stops at the GHL
   section, so other sections on the page are never touched. */
(function () {
  var page = document.getElementById('pmp-page');
  if (!page || page.getAttribute('data-pmp-fit')) return;
  page.setAttribute('data-pmp-fit', 'true');

  function important(el, prop, value) {
    el.style.setProperty(prop, value, 'important');
  }

  function unclip(el) {
    var cs = window.getComputedStyle(el);
    if (cs.overflowX === 'hidden') important(el, 'overflow-x', 'clip');
    if (cs.overflowY === 'hidden') important(el, 'overflow-y', 'clip');
  }

  function fit() {
    var el = page.parentElement;
    for (var depth = 0; el && el !== document.body && depth < 12; depth++) {
      important(el, 'padding', '0');
      important(el, 'margin', '0');
      important(el, 'max-width', 'none');
      important(el, 'border-width', '0');
      important(el, 'width', '100%');
      unclip(el);
      var cls = typeof el.className === 'string' ? el.className : '';
      if (/(^|\s)c-section(\s|$)/.test(cls) || /^section-/.test(el.id || '')) break;
      el = el.parentElement;
    }
    /* Page level: a horizontal "hidden" on body or the app wrapper also unpins the header. */
    for (var n = el ? el.parentElement : null; n && n !== document.documentElement; n = n.parentElement) unclip(n);
  }

  fit();
  window.addEventListener('load', fit);
})();
