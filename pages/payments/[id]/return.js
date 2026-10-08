import { Button, Result, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { finance } from '../../../lib/api';
import { withAuth } from '../../../lib/withAuth';
import { roubles } from '../../../utils/money';

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
  const { data: payment, isError } = useQuery(['payment', id], () => finance.payment(id), {
    enabled: Number.isFinite(id),
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (current) => (current?.status === 'PENDING' && !waitedTooLong ? POLL_MS : false),
  });
  const status = payment?.status;

  useEffect(() => {
    const timer = setTimeout(() => setWaitedTooLong(true), GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      // The task moved on and the money is reserved: drop what the cache knew.
      queryClient.invalidateQueries('task');
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('finance');
    }
  }, [status, queryClient]);

  const toTask = payment && (
    <Link href={`/task/${payment.taskId}`} key="task">
      <Button type="primary" size="large">
        Вернуться к задаче
      </Button>
    </Link>
  );

  if (isError) {
    return <Result status="404" title="Платёж не найден" style={{ marginTop: '120px' }} />;
  }
  if (!payment || (status === 'PENDING' && !waitedTooLong)) {
    return (
      <Result
        style={{ marginTop: '120px' }}
        icon={<Spin size="large" />}
        title="Проверяем оплату"
        subTitle="Обычно это занимает несколько секунд. Не закрывайте страницу."
      />
    );
  }
  if (status === 'SUCCEEDED') {
    return (
      <Result
        style={{ marginTop: '120px' }}
        status="success"
        title={`Оплата ${roubles(payment.amount)} прошла`}
        subTitle="Деньги зарезервированы. Исполнитель получит их, когда вы примете работу."
        extra={toTask}
      />
    );
  }
  if (status === 'FAILED') {
    return (
      <Result
        style={{ marginTop: '120px' }}
        status="error"
        title="Платёж не прошёл"
        subTitle="Деньги не списаны. Вернитесь к задаче и попробуйте ещё раз."
        extra={toTask}
      />
    );
  }
  return (
    <Result
      style={{ marginTop: '120px' }}
      status="info"
      title="Платёж ещё обрабатывается"
      subTitle="Мы пришлём уведомление, когда банк подтвердит оплату. Статус задачи обновится сам."
      extra={toTask}
    />
  );
}

export default withAuth(PaymentReturnPage);
