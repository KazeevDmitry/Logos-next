import { Alert, Button, Result, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { finance } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { withAuth } from '../../../lib/withAuth';
import AuthPage, { FormError } from '../../../src/components/authPage/authPage';
import { roubles } from '../../../utils/money';

/**
 * Stands in for the bank's payment page while the API runs with the mock
 * payment provider (development, demos, tests). With a real provider the
 * customer is sent to the provider's own page and never sees this one.
 */
function MockPaymentPage() {
  const router = useRouter();
  const id = Number(router.query.id);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const { data: payment, isLoading, isError } = useQuery(['payment', id], () => finance.payment(id), {
    enabled: Number.isFinite(id),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const complete = async (outcome) => {
    setBusy(outcome);
    setError('');
    try {
      await finance.mockComplete(id, outcome);
      router.replace(`/payments/${id}/return`);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(null);
    }
  };

  if (isLoading || !router.isReady) {
    return (
      <AuthPage title="Оплата">
        <Spin />
      </AuthPage>
    );
  }
  if (isError || !payment) {
    return <Result status="404" title="Платёж не найден" style={{ marginTop: '120px' }} />;
  }

  return (
    <AuthPage title="Тестовая оплата">
      <Alert
        type="warning"
        showIcon
        message="Это демонстрационная страница оплаты"
        description="Настоящие деньги не списываются. Выберите, чем закончится платёж."
      />
      <div style={{ fontSize: '32px', color: '#0066FF', margin: '24px 0 4px' }}>{roubles(payment.amount)}</div>
      <p>
        Оплата задачи <Link href={`/task/${payment.taskId}`}>№ {payment.taskId}</Link>
      </p>
      {payment.status === 'PENDING' ? (
        <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
          <Button type="primary" size="large" loading={busy === 'succeeded'} disabled={busy === 'failed'} onClick={() => complete('succeeded')}>
            Оплатить
          </Button>
          <Button size="large" loading={busy === 'failed'} disabled={busy === 'succeeded'} onClick={() => complete('failed')}>
            Отклонить платёж
          </Button>
        </div>
      ) : (
        <Link href={`/payments/${id}/return`}>
          <Button type="primary" size="large" style={{ width: '100%', marginTop: '20px' }}>
            Платёж уже обработан — посмотреть результат
          </Button>
        </Link>
      )}
      <FormError>{error}</FormError>
    </AuthPage>
  );
}

export default withAuth(MockPaymentPage);
