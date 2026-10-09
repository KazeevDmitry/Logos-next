import Head from 'next/head';

/**
 * JSON as it can stand inside a <script> tag: no "<", so nothing in the
 * data (a title typed by a user, say) can close the tag or open another.
 */
export function toScriptJson(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * A block of structured data (schema.org, JSON-LD) in the page's head, for
 * search engines. `id` tells the blocks of one page apart. Build `data`
 * with src/seo/schema.js; nothing is rendered for an empty one.
 */
export default function JsonLd({ id, data }) {
  if (!data) return null;
  return (
    <Head>
      <script
        key={`json-ld-${id}`}
        type="application/ld+json"
        data-json-ld={id}
        dangerouslySetInnerHTML={{ __html: toScriptJson(data) }}
      />
    </Head>
  );
}
