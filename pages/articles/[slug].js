import Image from 'next/image';
import { Col, Result, Row } from 'antd';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useQuery } from '@tanstack/react-query';
import gfm from 'remark-gfm';
import { news } from '../../lib/api';
import { createApi } from '../../lib/api/client';
import { articleSeo } from '../../lib/pageSeo';
import JsonLd from '../../src/components/jsonLd';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import NewsCard from '../../src/components/newsCard/newsCard';
import PublishedDate from '../../src/components/publishedDate/publishedDate';
import { SeoOverride } from '../../src/components/seo';
import { useThemeContext } from '../../src/context/themeContext';
import { article as articleSchema, articleBreadcrumbs, graph } from '../../src/seo/schema';
import stylesArt from './article.module.scss';

import i18n from '../../utils/i18n-init';
export default function ArticlePage({ serverArticle, serverSimilar = [] }) {
  const { t } = useTranslation();
  const theme = useThemeContext();
  const { slug } = useRouter().query;
  const seo = useContext(SeoOverride);

  const { data: article } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => news.get(slug),
    initialData: serverArticle ?? undefined,
    enabled: Boolean(slug),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  const { data: similar = [] } = useQuery({
    queryKey: ['article', slug, 'similar'],
    queryFn: () => news.similar(slug, 2),
    initialData: serverSimilar,
    enabled: Boolean(article),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  if (!article) {
    return (
      <Result
        status="404"
        title={i18n.t('pages.articleSlug.statyaNeNaydena')}
        style={{ marginTop: '120px' }}
      />
    );
  }

  const gutter = theme?.gutters?.gorizontal?.[theme?.id] ?? 20;
  const pad = `${gutter}px`;
  const similarTiles = similar.map((item) => <NewsCard key={item.id} article={item} cnt={24} />);

  return (
    <>
      <JsonLd id="page" data={graph(articleSchema(article, seo), articleBreadcrumbs(article))} />
      <PageHeader
        title={article.title}
        seo={{
          description: article.description ?? article.content,
          image: article.imageUrl,
          type: 'article',
        }}
      >
        {article.publishedAt && (
          <PublishedDate
            style={{ marginTop: '20px', fontSize: '16px' }}
            currDate={new Date(article.publishedAt)}
            textColor="#262626"
            imageStyle={{ fontSize: '24px', fontWeight: '600' }}
          />
        )}
      </PageHeader>

      <PageContainer>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <article className={stylesArt.articleStyle} style={{ paddingBottom: pad }}>
            {article.imageUrl && (
              // The cover is the largest thing on the page: sized by the layout, loaded first.
              <Image
                src={article.imageUrl}
                alt=""
                width={1200}
                height={480}
                priority
                sizes="(max-width: 992px) 100vw, 75vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '480px',
                  objectFit: 'cover',
                  borderRadius: '10px 10px 0px 0px',
                }}
              />
            )}
            <div
              className={stylesArt.articleBlock}
              style={{ paddingRight: pad, paddingLeft: pad, marginTop: pad }}
            >
              {article.description && (
                <p style={{ fontSize: '20px', fontWeight: 500 }}>{article.description}</p>
              )}
              {/* Markdown is rendered without raw HTML, so article text cannot inject scripts. */}
              <ReactMarkdown remarkPlugins={[gfm]}>{article.content}</ReactMarkdown>
            </div>
          </article>

          {!theme?.isDesktop && similarTiles.length > 0 && (
            <div className={stylesArt.similarBlock} style={{ padding: pad }}>
              <div className={stylesArt.similarHeader}>{t('headers.similarnews')}</div>
              <Row gutter={[gutter, gutter]} style={{ marginTop: '20px' }}>
                {similarTiles}
              </Row>
            </div>
          )}
        </Col>

        <Col xs={0} sm={0} md={0} lg={6} xl={6}>
          {similarTiles.length > 0 && (
            <>
              <div className={stylesArt.lastNews}>{t('headers.similarnews')}</div>
              <Row gutter={[gutter, gutter]}>{similarTiles}</Row>
            </>
          )}
        </Col>
      </PageContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  const http = createApi(context);
  try {
    const serverArticle = await news.get(context.query.slug, http);
    const serverSimilar = await news.similar(context.query.slug, 2, http).catch(() => []);
    return { props: { serverArticle, serverSimilar, seo: articleSeo(serverArticle) } };
  } catch {
    context.res.statusCode = 404;
    return { props: { serverArticle: null, serverSimilar: [] } };
  }
}
