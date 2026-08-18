/* EUXODES shared navigation helper.
 *
 * Navigation is ALWAYS correct without JavaScript:
 *   - EUXODES logo  ->  /          (EUXODES MAIN)
 *   - Hub           ->  /classic or /rush (the game's mode)
 *
 * This helper only enhances the experience. It reads the page's mode from the
 * `data-mode` attribute on <body> (set in the static HTML) or from a
 * `?from=classic|rush` query string, then labels the Hub links accordingly.
 * It never changes a link's href, so the static fallback is always intact.
 */
(function () {
    'use strict';

    var body = document.body;
    if (!body) return;

    var mode = body.getAttribute('data-mode') || '';

    if (!mode) {
        var params = new URLSearchParams(window.location.search);
        var from = params.get('from');
        if (from === 'classic' || from === 'rush') {
            mode = from;
            body.setAttribute('data-mode', from);
        }
    }

    if (!mode) return;

    var label = mode === 'classic' ? 'CLASSIC' : 'RUSH';
    var links = document.querySelectorAll('a[data-nav-hub]');

    Array.prototype.forEach.call(links, function (a) {
        var text = (a.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
        if (text === 'HUB') {
            a.textContent = 'HUB \u00B7 ' + label;
        }
    });
})();