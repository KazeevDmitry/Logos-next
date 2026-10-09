/** Where the NestJS API listens, as seen from this server (not from the browser). */
const API = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const LOCALES = ['ru'];

/** @type {import('next').NextConfig} */
// Ant Design and the packages it is built from ship ES modules that Node
// cannot load directly during server rendering; let the bundler handle them.
const fs = require('fs');
const scoped = (scope) =>
  fs.existsSync(`node_modules/${scope}`)
    ? fs.readdirSync(`node_modules/${scope}`).map((name) => `${scope}/${name}`)
    : [];
const ANTD_PACKAGES = [
  'antd',
  ...scoped('@ant-design'),
  ...scoped('@rc-component'),
  ...fs.readdirSync('node_modules').filter((name) => name.startsWith('rc-')),
];

// What a page of the site may load and where it may send data: this origin
// only. Inline styles and scripts stay allowed: Ant Design writes its CSS
// into the page, and Next starts every page with a small inline script
// (a nonce is not possible while some pages are prerendered). So the policy
// does not stop an injected inline script by itself; it stops loading code
// from another site and sending data to one. `next dev` also needs eval.
const DEV = process.env.NODE_ENV !== 'production';
// The chat socket goes to the API's own origin when it differs from the site's.
const WS = process.env.NEXT_PUBLIC_WS_URL;
const SOCKET_SOURCES = WS ? [WS, WS.replace(/^http/, 'ws')] : [];
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${DEV ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  ["connect-src 'self'", ...SOCKET_SOURCES, ...(DEV ? ['ws:'] : [])].join(' '),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');
const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

module.exports = {
  // Next's own "X-Powered-By" tells visitors nothing they need.
  poweredByHeader: false,

  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },

  transpilePackages: ANTD_PACKAGES,
  reactStrictMode: true,

  // `make build` checks the production build while `make up` is running;
  // a separate output folder keeps it from overwriting the dev server's files.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',

  i18n: {
    locales: LOCALES,
    defaultLocale: 'ru',
  },

  // The browser talks to the API through this site's own origin, so the
  // session cookies are first-party and no CORS setup is needed. In
  // production the reverse proxy does the same routing before Next sees it.
  async rewrites() {
    // With i18n enabled Next matches paths with the locale in front
    // ("/ru/api/v1/…" for a request to "/api/v1/…"). `locale: false` stops it
    // from adding the locale to the destination, so the source spells it out.
    return LOCALES.flatMap((locale) => [
      { source: `/${locale}/api/v1/:path*`, destination: `${API}/api/v1/:path*`, locale: false },
      { source: `/${locale}/uploads/:path*`, destination: `${API}/uploads/:path*`, locale: false },
    ]);
  },
};
