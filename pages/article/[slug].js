import { Col, Result, Row } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import gfm from 'remark-gfm';
import { news } from '../../lib/api';
import { createApi } from '../../lib/api/client';
import Comments from '../../src/components/comments/comments';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import NewsCard from '../../src/components/newsCard/newsCard';
import PublishedDate from '../../src/components/publishedDate/publishedDate';
import { useThemeContext } from '../../src/context/themeContext';
import stylesArt from './article.module.less';

export default function ArticlePage({ serverArticle, serverSimilar = [] }) {
  const { t } = useTranslation();
  const theme = useThemeContext();
  const { slug } = useRouter().query;

  const { data: article } = useQuery(['article', slug], () => news.get(slug), {
    initialData: serverArticle ?? undefined,
    enabled: Boolean(slug),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  const { data: similar = [] } = useQuery(['article', slug, 'similar'], () => news.similar(slug, 2), {
    initialData: serverSimilar,
    enabled: Boolean(article),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  if (!article) {
    return <Result status="404" title="Статья не найдена" style={{ marginTop: '120px' }} />;
  }

  const gutter = theme?.gutters?.gorizontal?.[theme?.id] ?? 20;
  const pad = `${gutter}px`;
  const similarTiles = similar.map((item) => <NewsCard key={item.id} article={item} cnt={24} />);

  return (
    <>
      <PageHeader
        title={article.title}
        seo={{ description: article.description ?? article.content, image: article.imageUrl, type: 'article' }}
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt=""
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: '10px 10px 0px 0px' }}
              />
            )}
            <div className={stylesArt.articleBlock} style={{ paddingRight: pad, paddingLeft: pad, marginTop: pad }}>
              {article.description && <p style={{ fontSize: '20px', fontWeight: 500 }}>{article.description}</p>}
              {/* Markdown is rendered without raw HTML, so article text cannot inject scripts. */}
              <ReactMarkdown remarkPlugins={[gfm]}>{article.content}</ReactMarkdown>
            </div>
          </article>

          <div className={stylesArt.commentsBlock} style={{ padding: pad }}>
            <div className={stylesArt.commentsHeader} style={{ marginBottom: pad }}>
              <span style={{ lineHeight: '32px' }}>
                {t('headers.comments')}
                {article.commentsCount > 0 ? ` (${article.commentsCount})` : ''}
              </span>
            </div>
            <Comments articleId={article.id} />
          </div>

          {!theme?.isDesktop && similarTiles.length > 0 && (
            <div className={stylesArt.commentsBlock} style={{ padding: pad }}>
              <div className={stylesArt.commentsHeader}>{t('headers.similarnews')}</div>
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
    return { props: { serverArticle, serverSimilar } };
  } catch {
    context.res.statusCode = 404;
    return { props: { serverArticle: null, serverSimilar: [] } };
  }
}
