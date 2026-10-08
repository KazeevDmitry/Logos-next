const withAntdLess = require('next-plugin-antd-less');

/** Where the NestJS API listens, as seen from this server (not from the browser). */
const API = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

const LOCALES = ['ru'];

/** @type {import('next').NextConfig} */
module.exports = withAntdLess({
  lessVarsFilePath: './styles/antdVariables.less',
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},

  reactStrictMode: true,
  swcMinify: true,

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

  webpack(config) {
    return config;
  },
});
