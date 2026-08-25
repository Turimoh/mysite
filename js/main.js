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
