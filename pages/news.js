import { Col, Empty, Row, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { news } from '../lib/api';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import NewsCard, { PartnerNewsCard } from '../src/components/newsCard/newsCard';
import MyPagination from '../src/components/pagination';
import SearchField from '../src/components/searchField/searchField';
import NewsFilter from '../src/components/SideFilter/newsFilter';
import { useThemeContext } from '../src/context/themeContext';
import { listServerProps, useListQuery } from '../src/hooks/useListQuery';
import styles from '../styles/news.module.less';

import i18n from '../utils/i18n-init';
const PAGE_SIZE = 10;
const options = { filters: { category: ['category', 'string'] }, pageSize: PAGE_SIZE };

/**
 * Column span of the i-th tile. On wide screens rows alternate "wide + narrow"
 * and "three narrow" so the page reads like a magazine; narrower screens use
 * one or two columns.
 */
function tileSpan(index, breakpoint) {
  if (breakpoint === 'xs') return 24;
  if (breakpoint === 'sm' || breakpoint === 'md') return index % 3 ? 12 : 24;
  // A wide tile opens every group of 5: positions 0, 5, 10, …
  return index % 5 === 0 ? 16 : 8;
}

export default function News({ serverData, categories = [], partnerNews = [] }) {
  const theme = useThemeContext();
  const { data, isLoading, page, params } = useListQuery('news', news.list, {
    ...options,
    serverData,
  });
  const { data: partner = partnerNews } = useQuery({
    queryKey: ['news', 'partner'],
    queryFn: () => news.list({ partner: true, pageSize: 5 }).then((res) => res.items),
    initialData: partnerNews,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const gutter = theme?.gutters?.gorizontal?.[theme?.id] ?? 20;
  const pad = `${gutter}px`;
  const blockPad = theme.isDesktop ? pad : '20px';
  const items = data?.items ?? [];
  const pagination = (
    <MyPagination
      page={page}
      total={data?.total ?? 0}
      pageSize={PAGE_SIZE}
      setPage={() => undefined}
    />
  );

  return (
    <>
      <PageHeader
        title={i18n.t('pages.news.novosti')}
        seo={{
          description: i18n.t('pages.news.novostiPravaIRazboryIzmeneniy'),
        }}
      />
      <PageContainer>
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <SearchField
            style={{ width: '100%', marginTop: '0px', borderRadius: '10px', marginBottom: pad }}
            placeholder={i18n.t('pages.news.vvediteStrokuDlyaPoiska')}
          />
          {!theme.isDesktop && <NewsFilter categories={categories} />}
          {pagination}
          {isLoading && (
            <div style={{ textAlign: 'center', margin: '60px 0' }}>
              <Spin size="large" />
            </div>
          )}
          {!isLoading && items.length === 0 && (
            <Empty
              description={i18n.t('pages.news.novosteyNeNaydeno')}
              style={{ margin: '60px 0' }}
            />
          )}
          <Row
            gutter={[gutter, gutter]}
            style={{ marginBottom: `${gutter / 2}px`, marginTop: `${gutter / 2}px` }}
          >
            {items.map((article, i) => (
              <NewsCard
                key={article.id}
                article={article}
                cnt={tileSpan(i, theme?.id)}
                showCatg={!params.category}
              />
            ))}
          </Row>
          {pagination}
        </Col>

        <Col xs={0} sm={0} md={8} lg={7} xl={6}>
          <NewsFilter categories={categories} />
          {partner.length > 0 && (
            <div
              className={styles.specBlock}
              style={{ paddingTop: blockPad, paddingBottom: blockPad, marginBottom: pad }}
            >
              <div
                className={styles.specBlockHeader}
                style={{ marginLeft: blockPad, marginBottom: blockPad }}
              >
                {i18n.t('pages.news.novostiPartnerov')}
              </div>
              {partner.map((article) => (
                <PartnerNewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </Col>
      </PageContainer>
    </>
  );
}

export const getServerSideProps = listServerProps(news.list, {
  ...options,
  extra: async (http) => {
    const [categories, partner] = await Promise.all([
      news.categories(http),
      news.list({ partner: true, pageSize: 5 }, http),
    ]);
    return { categories, partnerNews: partner.items };
  },
});
