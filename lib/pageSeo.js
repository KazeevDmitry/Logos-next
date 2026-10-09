import { seo } from './api';

/**
 * What an administrator set for search engines on the fixed page at `path`
 * ("/", "/experts", …): { title, description, image, noindex, jsonLd }, with
 * null where nothing was set. For getServerSideProps: return it as the `seo`
 * prop and _app hands it to <Seo>. Null when the API cannot be reached; the
 * page then keeps the title and description it makes up itself.
 */
export async function pageSeo(path, http) {
  try {
    const page = (await seo.pages(http)).find((item) => item.path === path);
    return page ? toSeo(page) : null;
  } catch {
    return null;
  }
}

/** The same for an article, from the article itself; its sharing image is its cover. */
export function articleSeo(article) {
  return toSeo({
    title: article.seoTitle,
    description: article.seoDescription,
    noindex: article.noindex,
    jsonLd: article.jsonLd,
  });
}

// Props of a page must be JSON: null, never undefined.
function toSeo({ title, description, imageUrl, noindex, jsonLd }) {
  return {
    title: title ?? null,
    description: description ?? null,
    image: imageUrl ?? null,
    noindex: Boolean(noindex),
    jsonLd: jsonLd ?? null,
  };
}
