import { Button, Form, Input, InputNumber, Modal, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { finance } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { roubles } from '../../../utils/money';
import { useNotifyContext } from '../../context/notificationContext';
import { FormError } from '../authPage/authPage';

import i18n from '../../../utils/i18n-init';
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
    <Modal
      open={open}
      destroyOnClose
      title={i18n.t('ui.payouts.vyvodSredstv')}
      onCancel={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        preserve={false}
        onFinish={send}
        initialValues={{ amount: available }}
      >
        <Form.Item
          name="amount"
          label={i18n.t('ui.payouts.summa')}
          extra={i18n.t('ui.payouts.dostupnoMinimum', {
            v0: roubles(available),
            v1: roubles(MIN_PAYOUT),
          })}
          rules={[
            { required: true, message: i18n.t('ui.payouts.ukazhiteSummu') },
            {
              type: 'number',
              min: MIN_PAYOUT,
              message: i18n.t('ui.payouts.neMenshe', { v0: roubles(MIN_PAYOUT) }),
            },
            { type: 'number', max: available, message: i18n.t('ui.payouts.bolsheChemDostupno') },
          ]}
        >
          <InputNumber min={0} precision={0} addonAfter="₽" style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item
          name="details"
          label={i18n.t('ui.payouts.kudaPerevesti')}
          extra={i18n.t('ui.payouts.nomerKartyIliBankovskieRekvizity')}
          rules={[
            { required: true, whitespace: true, message: i18n.t('ui.payouts.ukazhiteRekvizity') },
            { min: 5, message: i18n.t('ui.payouts.slishkomKorotko') },
          ]}
        >
          <Input.TextArea rows={3} maxLength={500} showCount />
        </Form.Item>
        <FormError>{error}</FormError>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}
        >
          <Button onClick={onClose}>{i18n.t('ui.payouts.otmena')}</Button>
          <Button type="primary" htmlType="submit" loading={busy}>
            {i18n.t('ui.payouts.otpravitZayavku')}
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
  const { data: payouts = [] } = useQuery({
    queryKey: ['finance', 'payouts'],
    queryFn: () => finance.payouts(),
  });

  return (
    <>
      <PayoutModal
        open={open}
        available={available}
        onClose={() => setOpen(false)}
        onDone={() => {
          setOpen(false);
          successNotification(
            i18n.t('ui.payouts.zayavkaOtpravlena'),
            i18n.t('ui.payouts.summaZarezervirovanaMySoobschimKogda'),
          );
          queryClient.invalidateQueries({ queryKey: ['finance'] });
        }}
      />
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}
      >
        <Button type="primary" disabled={available < MIN_PAYOUT} onClick={() => setOpen(true)}>
          {i18n.t('ui.payouts.vyvestiSredstva')}
        </Button>
        {available < MIN_PAYOUT && (
          <span style={{ color: '#5E6674' }}>
            {i18n.t('ui.payouts.vyvodDostupenOt')} {roubles(MIN_PAYOUT)}{' '}
            {i18n.t('ui.payouts.naBalanse')}
          </span>
        )}
      </div>

      {payouts.length > 0 && (
        <>
          <h2 style={{ fontSize: '20px', fontWeight: 500, marginTop: '36px' }}>
            {i18n.t('ui.payouts.zayavkiNaVyvod')}
          </h2>
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
                  <Tag color={STATUS_COLOR[payout.status]}>
                    {t(`finance.payoutStatus.${payout.status}`)}
                  </Tag>
                  <span style={{ color: '#9AA1AD', fontSize: '13px' }}>
                    {moment(payout.createdAt).format('DD.MM.YYYY, HH:mm')}
                  </span>
                  <div style={{ color: '#5E6674' }}>{payout.details}</div>
                  {payout.comment && (
                    <div>
                      {i18n.t('ui.payouts.kommentariyAdministratora')} {payout.comment}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '18px', whiteSpace: 'nowrap' }}>
                  {roubles(payout.amount)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
