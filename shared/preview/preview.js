/* PREVIEW ONLY · not part of the GHL exports.
   "Show photo slot details" switches every sample photo back to its slot details
   (INSERT PHOTO, what belongs there, source size, ratio and crop), and remembers the choice. */
(function () {
  var button = document.querySelector('.pmp-preview-toggle');
  if (!button) return;
  var root = document.documentElement;
  function set(on) {
    root.classList.toggle('pmp-show-slots', on);
    button.setAttribute('aria-pressed', on ? 'true' : 'false');
    button.textContent = on ? 'Show sample photos' : 'Show photo slot details';
    try { localStorage.setItem('pmp-show-slots', on ? '1' : '0'); } catch (e) {}
  }
  var saved = false;
  try { saved = localStorage.getItem('pmp-show-slots') === '1'; } catch (e) {}
  set(saved);
  button.addEventListener('click', function () { set(!root.classList.contains('pmp-show-slots')); });
})();
