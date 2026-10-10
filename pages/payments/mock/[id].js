import { Alert, Button, Result, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { finance } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { withAuth } from '../../../lib/withAuth';
import AuthPage, { FormError } from '../../../src/components/authPage/authPage';
import { roubles } from '../../../utils/money';

import i18n from '../../../utils/i18n-init';
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
  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => finance.payment(id),
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
      <AuthPage title={i18n.t('pages.paymentsMockId.oplata')}>
        <Spin />
      </AuthPage>
    );
  }
  if (isError || !payment) {
    return (
      <Result
        status="404"
        title={i18n.t('pages.paymentsMockId.platezhNeNayden')}
        style={{ marginTop: '120px' }}
      />
    );
  }

  return (
    <AuthPage title={i18n.t('pages.paymentsMockId.testovayaOplata')}>
      <Alert
        type="warning"
        showIcon
        title={i18n.t('pages.paymentsMockId.etoDemonstratsionnayaStranitsaOplaty')}
        description={i18n.t('pages.paymentsMockId.nastoyaschieDengiNeSpisyvayutsyaVyberite')}
      />
      <div style={{ fontSize: '32px', color: '#0066FF', margin: '24px 0 4px' }}>
        {roubles(payment.amount)}
      </div>
      {payment.conversationId ? (
        <p>{i18n.t('pages.paymentsMockId.oplataKonsultatsii')}</p>
      ) : (
        <p>
          {i18n.t('pages.paymentsMockId.oplataZadachi')}{' '}
          <Link href={`/task/${payment.taskId}`}>№ {payment.taskId}</Link>
        </p>
      )}
      {payment.status === 'PENDING' ? (
        <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
          <Button
            type="primary"
            size="large"
            loading={busy === 'succeeded'}
            disabled={busy === 'failed'}
            onClick={() => complete('succeeded')}
          >
            {i18n.t('pages.paymentsMockId.oplatit')}
          </Button>
          <Button
            size="large"
            loading={busy === 'failed'}
            disabled={busy === 'succeeded'}
            onClick={() => complete('failed')}
          >
            {i18n.t('pages.paymentsMockId.otklonitPlatezh')}
          </Button>
        </div>
      ) : (
        <Link href={`/payments/${id}/return`}>
          <Button type="primary" size="large" style={{ width: '100%', marginTop: '20px' }}>
            {i18n.t('pages.paymentsMockId.platezhUzheObrabotanPosmotretRezultat')}
          </Button>
        </Link>
      )}
      <FormError>{error}</FormError>
    </AuthPage>
  );
}

export default withAuth(MockPaymentPage);
