/**
 * Structured data (schema.org) of the public pages, as plain objects for
 * <JsonLd>. Search engines read it to show an article with its date and
 * picture, a question with its answers, the path to a page instead of its
 * address. Every function describes what the visitor sees on the page.
 */
import i18n from '../../utils/i18n-init';
import { absoluteUrl, DEFAULT_DESCRIPTION, excerpt, SITE_NAME } from '../components/seo';

const ORGANIZATION_ID = absoluteUrl('/#organization');
const fullName = (user) => `${user.name} ${user.surname ?? ''}`.trim();

/** Without empty values: a property with nothing in it is an error to a validator. */
function clean(node) {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );
}

/** Several descriptions as one block. */
export function graph(...nodes) {
  const present = nodes.filter(Boolean);
  return present.length > 0 ? { '@context': 'https://schema.org', '@graph': present } : null;
}

/** The service itself; other descriptions refer to it as the publisher. */
export function organization() {
  return clean({
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: DEFAULT_DESCRIPTION,
  });
}

/** The site, with its search: the catalogue of experts searched by text. */
export function website() {
  return {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    inLanguage: 'ru',
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/experts')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * The path to a page: [{ name, path }, …] from the section down to the page
 * itself; the home page is put first.
 */
export function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: SITE_NAME, path: '/' }, ...items].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** An article. `seo` is what an administrator set for it (may be empty). */
export function article(item, seo) {
  const path = `/articles/${encodeURIComponent(item.slug)}`;
  return clean({
    '@type': 'Article',
    headline: seo?.title || item.title,
    description: seo?.description || excerpt(item.description ?? item.content),
    image: item.imageUrl ? [absoluteUrl(item.imageUrl)] : null,
    datePublished: item.publishedAt,
    articleSection: item.category?.name,
    inLanguage: 'ru',
    mainEntityOfPage: absoluteUrl(path),
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
  });
}

export function articleBreadcrumbs(item) {
  return breadcrumbs([
    { name: i18n.t('pages.news.novosti'), path: '/articles' },
    { name: item.title, path: `/articles/${encodeURIComponent(item.slug)}` },
  ]);
}

/** An expert's profile: the page is about a person. */
export function expertProfile(expert) {
  const { user } = expert;
  const path = `/expert/${expert.id}`;
  return {
    '@type': 'ProfilePage',
    url: absoluteUrl(path),
    mainEntity: clean({
      '@type': 'Person',
      name: fullName(user),
      url: absoluteUrl(path),
      image: user.avatarUrl ? absoluteUrl(user.avatarUrl) : null,
      description: excerpt(expert.description, 500),
      jobTitle: expert.specializations.map((item) => item.name).join(', '),
      knowsAbout: expert.branches.map((item) => item.name),
      address: user.city
        ? { '@type': 'PostalAddress', addressLocality: user.city.name, addressCountry: 'RU' }
        : null,
    }),
  };
}

export function expertBreadcrumbs(expert) {
  return breadcrumbs([
    { name: i18n.t('pages.experts.eksperty'), path: '/experts' },
    { name: fullName(expert.user), path: `/expert/${expert.id}` },
  ]);
}

/**
 * A question with the answers lawyers gave. Null until there is an answer:
 * a page of questions and answers without one is an error to search engines.
 */
export function questionPage(question, answers) {
  if (answers.length === 0) return null;
  return {
    '@type': 'QAPage',
    mainEntity: clean({
      '@type': 'Question',
      name: question.title,
      text: question.description,
      answerCount: answers.length,
      datePublished: question.createdAt,
      author: { '@type': 'Person', name: fullName(question.author) },
      suggestedAnswer: answers.map((answer) => ({
        '@type': 'Answer',
        text: answer.text,
        datePublished: answer.createdAt,
        author: { '@type': 'Person', name: fullName(answer.author) },
      })),
    }),
  };
}

export function questionBreadcrumbs(question) {
  return breadcrumbs([
    { name: i18n.t('pages.questions.voprosyIOtvety'), path: '/questions' },
    { name: question.title, path: `/question/${question.id}` },
  ]);
}

export function taskBreadcrumbs(task) {
  return breadcrumbs([
    { name: i18n.t('pages.tasks.zadachi'), path: '/tasks' },
    { name: task.title, path: `/task/${task.id}` },
  ]);
}
