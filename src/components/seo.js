import Head from 'next/head';
import { useRouter } from 'next/router';

export const SITE_NAME = 'LogosEst';
const DEFAULT_DESCRIPTION =
  'LogosEst — сервис поиска юристов, адвокатов и нотариусов: разместите задачу, сравните предложения и выберите исполнителя.';
/** Public address of the site, e.g. https://logosest.ru; needed for absolute links only. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

/** One line of at most ~160 characters for the description tag. */
export function excerpt(text, length = 160) {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > length ? `${flat.slice(0, length - 1).trimEnd()}…` : flat;
}

/**
 * Title, description and sharing tags of a page. Rendered once with the
 * site's defaults in _app; a page that renders its own replaces them
 * (next/head keeps the last tag with the same key).
 */
export default function Seo({ title, description, image, noindex = false, type = 'website' }) {
  const router = useRouter();
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — юридические услуги онлайн`;
  const text = excerpt(description) || DEFAULT_DESCRIPTION;
  // Filters and pages of a list are the same document as far as search engines go.
  const url = SITE_URL ? `${SITE_URL}${router.asPath.split(/[?#]/)[0]}` : null;

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={text} />
      <meta key="robots" name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={title ?? SITE_NAME} />
      <meta key="og:description" property="og:description" content={text} />
      <meta key="og:locale" property="og:locale" content="ru_RU" />
      {url && <meta key="og:url" property="og:url" content={url} />}
      {url && !noindex && <link key="canonical" rel="canonical" href={url} />}
      {image && (
        <meta
          key="og:image"
          property="og:image"
          content={image.startsWith('http') ? image : `${SITE_URL}${image}`}
        />
      )}
      <meta
        key="twitter:card"
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />
    </Head>
  );
}
