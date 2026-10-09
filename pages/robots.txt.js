/** robots.txt: public catalogue pages are open, everything personal is closed. */
const PRIVATE = [
  '/api/',
  '/personalaccount',
  '/mytasks',
  '/myresponses',
  '/messages',
  '/finance',
  '/payments/',
  '/task/new',
  '/addquestion',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
];

export function siteUrl(req) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  const proto = String(req.headers['x-forwarded-proto'] ?? 'http').split(',')[0];
  return `${proto}://${req.headers.host}`;
}

export async function getServerSideProps({ req, res }) {
  const lines = ['User-agent: *', ...PRIVATE.map((path) => `Disallow: ${path}`), '', `Sitemap: ${siteUrl(req)}/sitemap.xml`];
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(`${lines.join('\n')}\n`);
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
