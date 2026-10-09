import { Button, Form, Input, InputNumber, Modal, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { finance } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { roubles } from '../../../utils/money';
import { useNotifyContext } from '../../context/notificationContext';
import { FormError } from '../authPage/authPage';

/** The API refuses smaller requests. */
const MIN_PAYOUT = 100;

/** Tag colour per payout status; texts: locale `finance.payoutStatus`. */
const STATUS_COLOR = { REQUESTED: 'gold', PAID: 'green', REJECTED: 'red' };

function PayoutModal({ open, available, onClose, onDone }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async ({ amount, details }) => {
    setBusy(true);
    setError('');
    try {
      await finance.requestPayout({ amount, details: details.trim() });
      onDone();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} destroyOnClose title="Вывод средств" onCancel={onClose} footer={null}>
      <Form layout="vertical" preserve={false} onFinish={send} initialValues={{ amount: available }}>
        <Form.Item
          name="amount"
          label="Сумма"
          extra={`Доступно ${roubles(available)}, минимум ${roubles(MIN_PAYOUT)}`}
          rules={[
            { required: true, message: 'Укажите сумму' },
            { type: 'number', min: MIN_PAYOUT, message: `Не меньше ${roubles(MIN_PAYOUT)}` },
            { type: 'number', max: available, message: 'Больше, чем доступно' },
          ]}
        >
          <InputNumber min={0} precision={0} addonAfter="₽" style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item
          name="details"
          label="Куда перевести"
          extra="Номер карты или банковские реквизиты. Их увидит только администратор, который делает перевод."
          rules={[
            { required: true, whitespace: true, message: 'Укажите реквизиты' },
            { min: 5, message: 'Слишком коротко' },
          ]}
        >
          <Input.TextArea rows={3} maxLength={500} showCount />
        </Form.Item>
        <FormError>{error}</FormError>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={busy}>
            Отправить заявку
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

/**
 * Withdrawing money: the button to ask for a payout and the list of
 * requests. The amount is reserved at once and paid by an administrator.
 */
export default function Payouts({ available }) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { successNotification } = useNotifyContext();
  const [open, setOpen] = useState(false);
  const { data: payouts = [] } = useQuery(['finance', 'payouts'], () => finance.payouts());

  return (
    <>
      <PayoutModal
        open={open}
        available={available}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          successNotification('Заявка отправлена', 'Сумма зарезервирована. Мы сообщим, когда деньги будут переведены.');
          queryClient.invalidateQueries('finance');
        }}
      />
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
        <Button type="primary" disabled={available < MIN_PAYOUT} onClick={() => setOpen(true)}>
          Вывести средства
        </Button>
        {available < MIN_PAYOUT && (
          <span style={{ color: '#5E6674' }}>Вывод доступен от {roubles(MIN_PAYOUT)} на балансе.</span>
        )}
      </div>

      {payouts.length > 0 && (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 500, marginTop: '36px' }}>Заявки на вывод</h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {payouts.map((payout) => (
              <li
                key={payout.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: '1px solid #EEF0F4',
                }}
              >
                <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  <Tag color={STATUS_COLOR[payout.status]}>{t(`finance.payoutStatus.${payout.status}`)}</Tag>
                  <span style={{ color: '#9AA1AD', fontSize: '13px' }}>
                    {moment(payout.createdAt).format('DD.MM.YYYY, HH:mm')}
                  </span>
                  <div style={{ color: '#5E6674' }}>{payout.details}</div>
                  {payout.comment && <div>Комментарий администратора: {payout.comment}</div>}
                </div>
                <div style={{ fontSize: '18px', whiteSpace: 'nowrap' }}>{roubles(payout.amount)}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
