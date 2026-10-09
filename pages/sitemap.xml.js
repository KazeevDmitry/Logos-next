import { experts, news, questions, tasks } from '../lib/api';
import { createApi } from '../lib/api/client';
import { siteUrl } from './robots.txt';

const PAGE_SIZE = 100;
/** Newest entries per section; enough for a young site and bounded for the API. */
const MAX_PAGES = 20;

/** Every item of a paginated list, up to MAX_PAGES pages. An API failure yields what was read. */
async function all(fetcher, http, params = {}) {
  const items = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const data = await fetcher({ ...params, page, pageSize: PAGE_SIZE }, http);
      items.push(...data.items);
      if (items.length >= data.total || data.items.length === 0) break;
    }
  } catch {
    // A partial sitemap is better than none.
  }
  return items;
}

const escapeXml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function getServerSideProps(context) {
  const http = createApi();
  const base = siteUrl(context.req);
  const [expertList, articleList, questionList, taskList] = await Promise.all([
    all(experts.list, http),
    all(news.list, http),
    all(questions.list, http),
    all(tasks.list, http),
  ]);

  const urls = [
    ...['/', '/tasks', '/experts', '/articles', '/questions', '/agreement'].map((path) => ({
      path,
    })),
    ...expertList.map((expert) => ({ path: `/expert/${expert.id}` })),
    ...articleList.map((article) => ({
      path: `/articles/${encodeURIComponent(article.slug)}`,
      date: article.publishedAt,
    })),
    ...questionList.map((question) => ({
      path: `/question/${question.id}`,
      date: question.createdAt,
    })),
    ...taskList.map((task) => ({ path: `/task/${task.id}`, date: task.createdAt })),
  ];
  const body = urls
    .map(({ path, date }) => {
      const lastmod = date ? `<lastmod>${new Date(date).toISOString().slice(0, 10)}</lastmod>` : '';
      return `<url><loc>${escapeXml(base + path)}</loc>${lastmod}</url>`;
    })
    .join('');

  context.res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  context.res.setHeader('Cache-Control', 'public, max-age=3600');
  context.res.write(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,
  );
  context.res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
