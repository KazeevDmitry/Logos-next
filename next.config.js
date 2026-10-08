const withAntdLess = require('next-plugin-antd-less');

/** Where the NestJS API listens, as seen from this server (not from the browser). */
const API = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';

/** @type {import('next').NextConfig} */
module.exports = withAntdLess({
  lessVarsFilePath: './styles/antdVariables.less',
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},

  reactStrictMode: true,
  swcMinify: true,

  i18n: {
    locales: ['ru'],
    defaultLocale: 'ru',
  },

  // The browser talks to the API through this site's own origin, so the
  // session cookies are first-party and no CORS setup is needed. In
  // production the reverse proxy does the same routing before Next sees it.
  async rewrites() {
    return [
      { source: '/api/v1/:path*', destination: `${API}/api/v1/:path*`, locale: false },
      { source: '/uploads/:path*', destination: `${API}/uploads/:path*`, locale: false },
    ];
  },

  webpack(config) {
    return config;
  },
});
