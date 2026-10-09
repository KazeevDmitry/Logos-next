import Head from 'next/head';
import { useRouter } from 'next/router';
import { createContext, useContext } from 'react';

import i18n from '../../utils/i18n-init';
export const SITE_NAME = 'LogosEst';
export const DEFAULT_DESCRIPTION = i18n.t('ui.seo.logosestServisPoiskaYuristovAdvokatov');
/** Public address of the site, e.g. https://logosest.ru; needed for absolute links only. */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/$/, '');

/** One line of at most ~160 characters for the description tag. */
export function excerpt(text, length = 160) {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > length ? `${flat.slice(0, length - 1).trimEnd()}…` : flat;
}

/**
 * What an administrator set for the page in the admin panel:
 * { title, description, image, noindex }, null where nothing was set.
 * _app fills it from the page's `seo` prop (see lib/pageSeo.js).
 */
export const SeoOverride = createContext(null);

/** `path` on this site as a full address; unchanged when the site's address is not configured. */
export function absoluteUrl(path) {
  return /^https?:/.test(path) ? path : `${SITE_URL}${path}`;
}

/**
 * Title, description and sharing tags of a page. Rendered once with the
 * site's defaults in _app; a page that renders its own replaces them
 * (next/head keeps the last tag with the same key). What an administrator
 * set for the page wins over both, and their title is used as it is.
 */
export default function Seo({ title, description, image, noindex = false, type = 'website' }) {
  const router = useRouter();
  const override = useContext(SeoOverride) ?? {};
  const fullTitle =
    override.title ||
    (title ? `${title} — ${SITE_NAME}` : i18n.t('ui.seo.yuridicheskieUslugiOnlayn', { SITE_NAME }));
  const shareTitle = override.title || title || SITE_NAME;
  const text = override.description || excerpt(description) || DEFAULT_DESCRIPTION;
  const picture = override.image || image;
  const hidden = noindex || Boolean(override.noindex);
  // Filters and pages of a list are the same document as far as search engines go.
  const url = SITE_URL ? `${SITE_URL}${router.asPath.split(/[?#]/)[0]}` : null;

  return (
    <Head>
      <title key="title">{fullTitle}</title>
      <meta key="description" name="description" content={text} />
      <meta key="robots" name="robots" content={hidden ? 'noindex, nofollow' : 'index, follow'} />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:title" property="og:title" content={shareTitle} />
      <meta key="og:description" property="og:description" content={text} />
      <meta key="og:locale" property="og:locale" content="ru_RU" />
      {url && <meta key="og:url" property="og:url" content={url} />}
      {url && !hidden && <link key="canonical" rel="canonical" href={url} />}
      {picture && <meta key="og:image" property="og:image" content={absoluteUrl(picture)} />}
      <meta
        key="twitter:card"
        name="twitter:card"
        content={picture ? 'summary_large_image' : 'summary'}
      />
    </Head>
  );
}
