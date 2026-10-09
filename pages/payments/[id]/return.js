import { Button, Result, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { finance } from '../../../lib/api';
import { withAuth } from '../../../lib/withAuth';
import { roubles } from '../../../utils/money';

import i18n from '../../../utils/i18n-init';
const POLL_MS = 2000;
/** The provider confirms within seconds; after this long we stop spinning and say so. */
const GIVE_UP_MS = 60_000;

/**
 * Where the payment provider sends the customer back. The provider reports
 * the result to the API separately, so the page waits until the API knows it.
 */
function PaymentReturnPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(router.query.id);
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  const { data: payment, isError } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => finance.payment(id),
    enabled: Number.isFinite(id),
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.data?.status === 'PENDING' && !waitedTooLong ? POLL_MS : false,
  });
  const status = payment?.status;

  useEffect(() => {
    const timer = setTimeout(() => setWaitedTooLong(true), GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      // The task moved on and the money is reserved: drop what the cache knew.
      queryClient.invalidateQueries({ queryKey: ['task'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
    }
  }, [status, queryClient]);

  const toTask = payment && (
    <Link href={`/task/${payment.taskId}`} key="task">
      <Button type="primary" size="large">
        {i18n.t('pages.paymentsIdReturn.vernutsyaKZadache')}
      </Button>
    </Link>
  );

  if (isError) {
    return (
      <Result
        status="404"
        title={i18n.t('pages.paymentsIdReturn.platezhNeNayden')}
        style={{ marginTop: '120px' }}
      />
    );
  }
  if (!payment || (status === 'PENDING' && !waitedTooLong)) {
    return (
      <Result
        style={{ marginTop: '120px' }}
        icon={<Spin size="large" />}
        title={i18n.t('pages.paymentsIdReturn.proveryaemOplatu')}
        subTitle={i18n.t('pages.paymentsIdReturn.obychnoEtoZanimaetNeskolkoSekund')}
      />
    );
  }
  if (status === 'SUCCEEDED') {
    return (
      <Result
        style={{ marginTop: '120px' }}
        status="success"
        title={i18n.t('pages.paymentsIdReturn.oplataProshla', { v0: roubles(payment.amount) })}
        subTitle={i18n.t('pages.paymentsIdReturn.dengiZarezervirovanyIspolnitelPoluchitIh')}
        extra={toTask}
      />
    );
  }
  if (status === 'FAILED') {
    return (
      <Result
        style={{ marginTop: '120px' }}
        status="error"
        title={i18n.t('pages.paymentsIdReturn.platezhNeProshel')}
        subTitle={i18n.t('pages.paymentsIdReturn.dengiNeSpisanyVernitesK')}
        extra={toTask}
      />
    );
  }
  return (
    <Result
      style={{ marginTop: '120px' }}
      status="info"
      title={i18n.t('pages.paymentsIdReturn.platezhEscheObrabatyvaetsya')}
      subTitle={i18n.t('pages.paymentsIdReturn.myPrishlemUvedomlenieKogdaBank')}
      extra={toTask}
    />
  );
}

export default withAuth(PaymentReturnPage);
