import { Col, Empty, Result, Row, Spin, Tabs } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../context/themeContext';
import { useListQuery } from '../../hooks/useListQuery';
import MyPagination from '../pagination';
import TaskCard from '../taskCard/taskCard';

const PAGE_SIZE = 5;
const FILTERS = { status: ['status', 'text'] };

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'OPEN', label: 'Принимают отклики' },
  { key: 'ASSIGNED', label: 'Ждут подтверждения' },
  { key: 'AWAITING_PAYMENT', label: 'Ждут оплаты' },
  { key: 'IN_PROGRESS', label: 'В работе' },
  { key: 'REVIEW', label: 'На проверке' },
  { key: 'COMPLETED', label: 'Выполнены' },
  { key: 'DISPUTED', label: 'Спор' },
  { key: 'CANCELLED', label: 'Отменены' },
];

/**
 * One of the signed-in user's task lists (created, performing, responded to)
 * with a tab per status. The tab and the page live in the URL, so the list
 * survives a reload and the back button. `renderNote(task)` adds a line
 * at the bottom of a card.
 */
export default function AccountTaskList({ name, fetcher, emptyText, emptyAction, renderNote }) {
  const theme = useThemeContext();
  const router = useRouter();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const { data, isLoading, isError, isFetching, page } = useListQuery(name, fetcher, {
    filters: FILTERS,
    pageSize: PAGE_SIZE,
  });
  const items = data?.items ?? [];
  const status = TABS.some((tab) => tab.key === router.query.status) ? router.query.status : 'all';

  const setStatus = (key) => {
    // A new tab starts from its first page.
    const { status: _status, page: _page, ...rest } = router.query;
    router.push({ pathname: router.pathname, query: key === 'all' ? rest : { ...rest, status: key } }, undefined, {
      shallow: true,
    });
  };

  return (
    <Col span={24}>
      <Tabs activeKey={status} onChange={setStatus} items={TABS} />

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '60px 0' }}>
          <Spin size="large" />
        </div>
      )}
      {isError && <Result status="warning" title="Не удалось загрузить список" subTitle="Обновите страницу." />}
      {!isLoading && !isError && items.length === 0 && (
        <Empty description={status === 'all' ? emptyText : 'В этом статусе задач нет'} style={{ margin: '60px 0' }}>
          {status === 'all' && emptyAction}
        </Empty>
      )}

      <Row gutter={[pad, pad]} style={{ marginBottom: '20px', opacity: isFetching && !isLoading ? 0.6 : 1 }}>
        {items.map((task) => (
          <Col key={task.id} span={24}>
            <Link href={`/task/${task.id}`} style={{ color: 'black' }}>
              <TaskCard task={task} showStatus footer={renderNote?.(task)} />
            </Link>
          </Col>
        ))}
      </Row>
      <MyPagination page={page} total={data?.total ?? 0} pageSize={PAGE_SIZE} setPage={() => undefined} />
    </Col>
  );
}
