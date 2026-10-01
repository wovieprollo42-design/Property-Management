/* Property Management Professionals · motion (shared by every page and every GHL snippet)
   - Reveals content as it scrolls into view, with one IntersectionObserver (no scroll math).
   - Arms only elements below the first screen, so nothing the visitor already sees flickers.
   - Pauses the gold ribbon while it is off screen; rotates the hero's "help with" words.
   - Does nothing at all when the visitor has asked for reduced motion.
   - Safe to include more than once (each GHL snippet carries it): later copies only pick up
     new sections. It touches nothing outside elements with the "pmp" class. */
(function () {
  var w = window;
  var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in w;

  /* What gets revealed, and how. Elements inside an already armed element are skipped,
     so a card animates as one piece instead of line by line. */
  var RULES = [
    ['[data-pmp-reveal]', null],
    ['.pmp-shot', 'photo'],
    ['.pmp-pcard, .pmp-card, article, figure, .pmp-slot, .pmp-faq__item, details', 'up'],
    ['li', 'up'],
    ['h2, h3, .pmp-eyebrow, .pmp-ribbon, .pmp-lead, .pmp-btns, blockquote', 'up'],
    ['p', 'fade']
  ];
  var SKIP = '.pmp-hero, .pmp-header, [data-pmp-static], .pmp-marquee, .pmp-faq__a, nav';

  var io = null;
  var queue = [];
  var flushTimer = null;

  function reveal(el) {
    el.classList.add('pmp-in');
    var delay = parseFloat(el.style.getPropertyValue('--pmp-d')) || 0;
    var settle = el.getAttribute('data-pmp-armed') === 'photo' ? 1700 : el.getAttribute('data-pmp-armed') === 'line' ? 1500 : 1000;
    setTimeout(function () {
      el.removeAttribute('data-pmp-armed');
      el.classList.remove('pmp-in');
      el.style.removeProperty('--pmp-d');
    }, delay + settle);
  }

  /* Elements that arrive together play in document order, 90 ms apart (max 540 ms). */
  function flush() {
    flushTimer = null;
    queue.sort(function (a, b) {
      return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    });
    for (var i = 0; i < queue.length; i++) {
      queue[i].style.setProperty('--pmp-d', Math.min(i * 90, 540) + 'ms');
      reveal(queue[i]);
    }
    queue = [];
  }

  function onIntersect(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (!entries[i].isIntersecting) continue;
      io.unobserve(entries[i].target);
      queue.push(entries[i].target);
    }
    if (queue.length && !flushTimer) flushTimer = setTimeout(flush, 30);
  }

  /* Reads first, writes after, so arming costs one layout pass however many elements match. */
  var seen = typeof WeakSet === 'function' ? new WeakSet() : null;
  function arm(scope) {
    if (reduce || !canObserve || !seen) return;
    if (!io) io = new IntersectionObserver(onIntersect, { rootMargin: '0px', threshold: 0.08 });
    var fold = (w.innerHeight || 800) * 0.95;
    var picked = [];
    var pickedSet = new WeakSet();
    for (var r = 0; r < RULES.length; r++) {
      var list = scope.querySelectorAll(RULES[r][0]);
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (seen.has(el)) continue;
        seen.add(el);
        if (el.closest(SKIP)) continue;
        var p = el.parentElement;
        while (p && p !== scope && !pickedSet.has(p)) p = p.parentElement;
        if (p && p !== scope) continue; /* inside something that already animates */
        var kind = RULES[r][1] || el.getAttribute('data-pmp-reveal') || 'up';
        if (kind !== 'line' && el.offsetParent === null) continue; /* hidden right now */
        if (el.getBoundingClientRect().top < fold) continue; /* already on screen: leave it alone */
        picked.push([el, kind]);
        pickedSet.add(el);
      }
    }
    for (var k = 0; k < picked.length; k++) {
      picked[k][0].setAttribute('data-pmp-armed', picked[k][1]);
      io.observe(picked[k][0]);
    }
  }

  /* Looping effects (the gold ribbon, a turning badge, floating tags) only run while visible:
     the element gets .is-paused when it leaves the screen. */
  var loopIo = null;
  function loops(scope) {
    var list = scope.matches('[data-pmp-loop]') ? [scope] : [];
    var inner = scope.querySelectorAll('.pmp-marquee, [data-pmp-loop]');
    for (var n = 0; n < inner.length; n++) list.push(inner[n]);
    if (!canObserve) return;
    if (!loopIo) loopIo = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) entries[j].target.classList.toggle('is-paused', !entries[j].isIntersecting);
    });
    for (var i = 0; i < list.length; i++) {
      if (list[i].hasAttribute('data-pmp-live')) continue;
      list[i].setAttribute('data-pmp-live', '');
      loopIo.observe(list[i]);
    }
  }

  /* "Help with ..." words: one word at a time, every 2.4 s, only while on screen. */
  function rotators(scope) {
    var list = scope.querySelectorAll('.pmp-rotator:not(.is-live)');
    for (var i = 0; i < list.length; i++) (function (box) {
      var words = box.querySelectorAll('.pmp-rotator__word');
      if (reduce || words.length < 2) return;
      box.classList.add('is-live');
      var at = 0;
      var visible = true;
      words[0].classList.add('is-on');
      if (canObserve) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(box);
      setInterval(function () {
        if (!visible || document.hidden) return;
        var prev = words[at];
        at = (at + 1) % words.length;
        prev.classList.remove('is-on');
        prev.classList.add('is-off');
        words[at].classList.remove('is-off');
        words[at].classList.add('is-on');
        setTimeout(function () { prev.classList.remove('is-off'); }, 700);
      }, 2400);
    })(list[i]);
  }

  function run() {
    var roots = document.querySelectorAll('.pmp');
    for (var i = 0; i < roots.length; i++) {
      arm(roots[i]);
      loops(roots[i]);
      rotators(roots[i]);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  /* GHL can mount custom code a moment after the page loads; pick up late sections too. */
  w.addEventListener('load', run);
})();
