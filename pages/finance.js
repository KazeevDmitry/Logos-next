import { Empty, Pagination, Spin } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { finance } from '../lib/api';
import { withAuth } from '../lib/withAuth';
import AccountLayout from '../src/components/account/accountLayout';
import { roubles } from '../utils/money';

const PAGE_SIZE = 10;

/** The API's ledger transaction types in the user's words. */
const TYPES = {
  'task.funded': 'Оплата задачи (деньги зарезервированы)',
  'task.released': 'Оплата за выполненную задачу',
  'task.refunded': 'Возврат за задачу',
  'payment.refunded': 'Возврат платежа',
  'payout.requested': 'Заявка на вывод средств',
  'payout.paid': 'Вывод средств',
  'payout.rejected': 'Заявка на вывод отклонена, деньги возвращены',
};

function Amount({ label, value, hint, accent }) {
  return (
    <div style={{ flex: '1 1 200px', padding: '18px 20px', borderRadius: '10px', background: '#F0F2F6' }}>
      <div style={{ color: '#5E6674' }}>{label}</div>
      <div style={{ fontSize: '28px', color: accent ? '#0066FF' : 'black', whiteSpace: 'nowrap' }}>{roubles(value)}</div>
      <div style={{ color: '#5E6674', fontSize: '13px' }}>{hint}</div>
    </div>
  );
}

/** What the user has, what is on hold, and every movement of their money. */
function FinancePage() {
  const [page, setPage] = useState(1);
  const { data: balance } = useQuery(['finance', 'balance'], () => finance.balance());
  const { data: history, isLoading } = useQuery(
    ['finance', 'transactions', page],
    () => finance.transactions({ page, pageSize: PAGE_SIZE }),
    { keepPreviousData: true },
  );
  const items = history?.items ?? [];

  return (
    <AccountLayout title="Финансы">
      {balance ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Amount accent label="Доступно" value={balance.available} hint="Можно вывести" />
          <Amount label="Выводится" value={balance.pendingPayouts} hint="Заявки на вывод в обработке" />
          <Amount label="Зарезервировано" value={balance.inEscrow} hint="По вашим задачам до приёмки работы" />
        </div>
      ) : (
        <Spin />
      )}

      <h2 style={{ fontSize: '20px', fontWeight: 500, marginTop: '36px' }}>История операций</h2>
      {isLoading && <Spin />}
      {!isLoading && items.length === 0 && <Empty description="Операций пока не было" style={{ margin: '30px 0' }} />}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ display: 'flex', gap: '16px', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EEF0F4' }}
          >
            <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              <div>{TYPES[item.type] ?? item.type}</div>
              {item.task && <Link href={`/task/${item.task.id}`}>{item.task.title}</Link>}
              <div style={{ color: '#9AA1AD', fontSize: '13px' }}>{moment(item.createdAt).format('DD.MM.YYYY, HH:mm')}</div>
            </div>
            <div style={{ fontSize: '18px', whiteSpace: 'nowrap', color: item.amount > 0 ? '#1FAA78' : 'black' }}>
              {item.amount > 0 ? '+' : '−'}
              {roubles(Math.abs(item.amount))}
            </div>
          </li>
        ))}
      </ul>
      {(history?.total ?? 0) > PAGE_SIZE && (
        <Pagination
          style={{ marginTop: '20px' }}
          current={page}
          pageSize={PAGE_SIZE}
          total={history.total}
          showSizeChanger={false}
          onChange={setPage}
        />
      )}
    </AccountLayout>
  );
}

export default withAuth(FinancePage);
