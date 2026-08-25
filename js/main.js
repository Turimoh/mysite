/* ==========================================================================
   main.js
   Runs on every page. Loaded with `defer`, so it waits for the HTML.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Phone number assembly

   The number never appears as a whole string in the HTML. It's stored in
   pieces and joined here, which defeats the scrapers that harvest contact
   details by pattern-matching raw page source.

   This is friction, not security — a determined scraper runs JavaScript.
   But it filters out the overwhelming majority, which are dumb.

   If JavaScript fails, the fallback text in the HTML still tells the visitor
   what to do. That's progressive enhancement: working first, better second.
   -------------------------------------------------------------------------- */

(function assemblePhone() {
  var slots = document.querySelectorAll('[data-tel]');

  Array.prototype.forEach.call(slots, function (slot) {
    var parts = slot.getAttribute('data-tel').split('|');

    var link = document.createElement('a');
    link.href = 'tel:+' + parts.join('');       // +447700900123
    link.textContent = '+' + parts.join(' ');   // +44 7700 900123

    slot.replaceChildren(link);
  });
})();


/* --------------------------------------------------------------------------
   Theme toggle

   The tokens for both themes already exist in the stylesheet. All this does
   is set data-theme="light" or "dark" on <html> and remember the choice.

   The inline script in <head> does the first application, before the page
   paints — otherwise you'd see a flash of the wrong theme on every load.
   -------------------------------------------------------------------------- */

(function themeToggle() {
  var root = document.documentElement;
  var button = document.querySelector('[data-theme-toggle]');
  if (!button) return;

  function stored() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  function describe() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  describe();

  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    describe();
  });

  /* If they've never picked manually, keep following the operating system. */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
    var choice = stored();
    if (choice === 'light' || choice === 'dark') return;
    root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    describe();
  });
})();


/* --------------------------------------------------------------------------
   Scroll reveals

   IntersectionObserver tells us when an element enters the viewport. It's the
   right tool here — the old approach listened to every scroll event and ran
   your code hundreds of times a second.

   Each element is unobserved once shown, so nothing keeps running afterwards.
   -------------------------------------------------------------------------- */

(function scrollReveals() {
  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  function show(el) { el.classList.add('is-revealed'); }

  var noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reduced motion, or a browser too old for the API: show everything now. */
  if (noMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, show);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  Array.prototype.forEach.call(items, function (el) {
    /* Stagger siblings slightly so a row arrives in sequence, not as a slab. */
    var group = Array.prototype.filter.call(el.parentNode.children, function (child) {
      return child.hasAttribute('data-reveal');
    });
    el.style.transitionDelay = Math.min(group.indexOf(el), 4) * 70 + 'ms';
    observer.observe(el);
  });
})();
