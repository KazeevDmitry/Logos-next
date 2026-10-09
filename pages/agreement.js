import { createApi } from '../lib/api/client';
import { pageSeo } from '../lib/pageSeo';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import { AGREEMENT, AGREEMENT_UPDATED } from '../src/content/agreement';
import dayjs from '../utils/dayjs';
import i18n from '../utils/i18n-init';

/** The user agreement that the registration form asks visitors to accept. */
export default function Agreement() {
  return (
    <>
      <PageHeader
        title={i18n.t('pages.agreement.title')}
        seo={{ description: i18n.t('pages.agreement.description') }}
      />
      <PageContainer>
        <article
          lang="ru"
          style={{
            background: 'white',
            borderRadius: '10px',
            padding: 'clamp(20px, 5vw, 60px)',
            maxWidth: '900px',
            fontSize: '16px',
            lineHeight: 1.6,
          }}
        >
          <p style={{ color: '#5E6674' }}>
            {i18n.t('pages.agreement.updated', {
              date: dayjs(AGREEMENT_UPDATED).format('D MMMM YYYY'),
            })}
          </p>
          {AGREEMENT.map((section) => (
            <section key={section.title}>
              <h2 style={{ fontSize: '22px', fontWeight: 500, margin: '32px 0 12px' }}>
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </PageContainer>
    </>
  );
}

// The text is fixed; the server is asked only for what an administrator set for search engines.
export async function getServerSideProps(context) {
  return { props: { seo: await pageSeo('/agreement', createApi(context)) } };
}
