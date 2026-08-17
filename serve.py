#!/usr/bin/env python3
"""
EUXODES local development server.

Keeps the plain Python http.server architecture used by run-local.bat while
adding clean-URL support so routes like /void-dash and /about resolve to
void-dash.html and about.html (matching the site's Vercel cleanUrls config).

Usage: python serve.py [port]
"""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class EuxodesHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Resolve the real file first (assets, css, js, index.html, etc.).
        translated = super().translate_path(path)
        if os.path.isfile(translated):
            return translated
        # Clean URL fallback: /void-dash -> void-dash.html
        candidate = translated + '.html'
        if os.path.isfile(candidate):
            return candidate
        return translated

    def end_headers(self):
        # Avoid stale assets during local development.
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):
        sys.stdout.write('  %s\n' % (format % args))


def main(port):
    root = os.path.dirname(os.path.abspath(__file__))
    handler = partial(EuxodesHandler, directory=root)
    server = ThreadingHTTPServer(('', port), handler)
    print('EUXODES local server running at http://localhost:%d' % port)
    print('Press Ctrl+C to stop.')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nShutting down.')


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    main(port)