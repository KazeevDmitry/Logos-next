import { Col, Empty, Result, Row, Spin } from 'antd';
import Plural from '../../../utils/plural';
import { useThemeContext } from '../../context/themeContext';
import PageContainer from '../layouts/pageContainer';
import PageHeader from '../layouts/pageHeader';
import MyPagination from '../pagination';
import SearchField from '../searchField/searchField';
import SideFilter from '../SideFilter/sideFilter';

/**
 * The frame shared by every catalogue page: title, search field, the list
 * with pagination above and below, and the filter column on the right
 * (inline on phones). The page supplies the data and how to draw one item.
 */
export default function ListPage({
  title,
  headerChildren,
  searchPlaceholder,
  filter,
  query,
  pageSize,
  pluralPath,
  renderItem,
  emptyText = 'Ничего не найдено',
  sideExtra,
}) {
  const theme = useThemeContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const { data, isLoading, isError, isFetching, page } = query;
  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  const pagination = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: theme.isDesktop ? '0px' : '10px',
      }}
    >
      <MyPagination page={page} total={total} pageSize={pageSize} setPage={() => undefined} />
      {total > pageSize && pluralPath && (
        <p>
          <Plural count={total} i18nextPath={pluralPath} />
        </p>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title={title}>{headerChildren}</PageHeader>
      <PageContainer>
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <SearchField
            style={{ width: '100%', marginTop: '0px', borderRadius: '10px', marginBottom: pad }}
            placeholder={searchPlaceholder}
          />
          {!theme.isDesktop && filter && <SideFilter show={{ ...filter, showreset: false }} />}
          {pagination}

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0' }}>
              <Spin size="large" />
            </div>
          )}
          {isError && <Result status="warning" title="Не удалось загрузить список" subTitle="Обновите страницу." />}
          {!isLoading && !isError && items.length === 0 && <Empty description={emptyText} style={{ margin: '60px 0' }} />}

          <Row gutter={[pad, pad]} style={{ marginBottom: '20px', opacity: isFetching && !isLoading ? 0.6 : 1 }}>
            {items.map((item) => (
              <Col key={item.id} span={24}>
                {renderItem(item)}
              </Col>
            ))}
          </Row>
          {pagination}
        </Col>
        <Col xs={0} sm={0} md={8} lg={7} xl={6}>
          {filter && <SideFilter show={{ showreset: true, ...filter }} />}
          {sideExtra}
        </Col>
      </PageContainer>
    </>
  );
}
