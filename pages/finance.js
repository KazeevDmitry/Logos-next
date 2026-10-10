import { Empty, Pagination, Spin } from 'antd';
import dayjs from '../utils/dayjs';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { finance } from '../lib/api';
import { withAuth } from '../lib/withAuth';
import AccountLayout from '../src/components/account/accountLayout';
import Payouts from '../src/components/finance/payouts';
import { roubles } from '../utils/money';

const PAGE_SIZE = 10;

/** The API's ledger transaction types → keys of locale `finance.types`. */
const TYPES = {
  'task.funded': 'taskFunded',
  'task.released': 'taskReleased',
  'task.refunded': 'taskRefunded',
  'payment.refunded': 'paymentRefunded',
  'consultation.released': 'consultationReleased',
  'payout.requested': 'payoutRequested',
  'payout.paid': 'payoutPaid',
  'payout.rejected': 'payoutRejected',
};

function Amount({ label, value, hint, accent }) {
  return (
    <div
      style={{
        flex: '1 1 200px',
        padding: '18px 20px',
        borderRadius: '10px',
        background: '#F0F2F6',
      }}
    >
      <div style={{ color: '#5E6674' }}>{label}</div>
      <div style={{ fontSize: '28px', color: accent ? '#0066FF' : 'black', whiteSpace: 'nowrap' }}>
        {roubles(value)}
      </div>
      <div style={{ color: '#5E6674', fontSize: '13px' }}>{hint}</div>
    </div>
  );
}

/** What the user has, what is on hold, and every movement of their money. */
function FinancePage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { data: balance } = useQuery({
    queryKey: ['finance', 'balance'],
    queryFn: () => finance.balance(),
  });
  const { data: history, isLoading } = useQuery({
    queryKey: ['finance', 'transactions', page],
    queryFn: () => finance.transactions({ page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });
  const items = history?.items ?? [];

  return (
    <AccountLayout title={t('account.menu.finance')}>
      {balance ? (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Amount
            accent
            label={t('finance.available')}
            value={balance.available}
            hint={t('finance.availableHint')}
          />
          <Amount
            label={t('finance.pending')}
            value={balance.pendingPayouts}
            hint={t('finance.pendingHint')}
          />
          <Amount
            label={t('finance.escrow')}
            value={balance.inEscrow}
            hint={t('finance.escrowHint')}
          />
        </div>
      ) : (
        <Spin />
      )}
      {balance && <Payouts available={balance.available} />}

      <h2 style={{ fontSize: '20px', fontWeight: 500, marginTop: '36px' }}>
        {t('finance.history')}
      </h2>
      {isLoading && <Spin />}
      {!isLoading && items.length === 0 && (
        <Empty description={t('finance.noHistory')} style={{ margin: '30px 0' }} />
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #EEF0F4',
            }}
          >
            <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              <div>{TYPES[item.type] ? t(`finance.types.${TYPES[item.type]}`) : item.type}</div>
              {item.task && <Link href={`/task/${item.task.id}`}>{item.task.title}</Link>}
              <div style={{ color: '#9AA1AD', fontSize: '13px' }}>
                {dayjs(item.createdAt).format('DD.MM.YYYY, HH:mm')}
              </div>
            </div>
            <div
              style={{
                fontSize: '18px',
                whiteSpace: 'nowrap',
                color: item.amount > 0 ? '#1FAA78' : 'black',
              }}
            >
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
