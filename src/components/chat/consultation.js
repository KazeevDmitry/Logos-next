import { Button, Popconfirm } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { chat, consultations } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import dayjs from '../../../utils/dayjs';
import i18n from '../../../utils/i18n-init';
import { roubles } from '../../../utils/money';

/**
 * A chat with an expert is a paid consultation. Starting its payment sends
 * the customer to the payment page; they come back to /payments/<id>/return
 * and from there into the chat. `start` is for an expert's profile (the chat
 * may not exist yet), `pay` for a chat that does.
 */
export function useConsultationPayment() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async (request) => {
    setBusy(true);
    setError('');
    try {
      const { conversationId, payment } = await request();
      if (payment) {
        // Left busy on purpose: the page is going away.
        window.location.assign(payment.confirmationUrl);
        return;
      }
      // Nothing to pay: the chat is open already.
      await router.push(`/messages?chat=${conversationId}`);
    } catch (e) {
      setError(errorMessage(e, i18n.t('ui.consultation.payFailed')));
    }
    setBusy(false);
  };

  return {
    busy,
    error,
    start: (expertId) => run(() => consultations.start(expertId)),
    pay: (conversationId) =>
      run(async () => ({ conversationId, payment: await chat.pay(conversationId) })),
  };
}

const note = {
  borderTop: '1px solid #EEF0F4',
  padding: '12px 16px',
  color: '#5E6674',
  background: '#FAFBFC',
};

/**
 * What stands in place of the text box while nobody can write: why, and for
 * the customer the button that opens the chat.
 */
export function ChatGate({ conversation }) {
  const { busy, error, pay } = useConsultationPayment();
  const { status, role, consultationPrice } = conversation;
  const closed = status === 'CLOSED';
  const isCustomer = role === 'customer';
  const text = isCustomer
    ? i18n.t(closed ? 'ui.consultation.closedCustomer' : 'ui.consultation.lockedCustomer')
    : i18n.t(closed ? 'ui.consultation.closedExpert' : 'ui.consultation.lockedExpert');

  return (
    <div style={note} data-testid="chat-gate">
      <p style={{ margin: 0 }}>{text}</p>
      {isCustomer &&
        (consultationPrice === null ? (
          <p style={{ margin: '8px 0 0' }}>{i18n.t('ui.consultation.noConsultations')}</p>
        ) : (
          <Button
            type="primary"
            loading={busy}
            onClick={() => pay(conversation.id)}
            style={{ marginTop: '10px' }}
          >
            {i18n.t(closed ? 'ui.consultation.payAgain' : 'ui.consultation.pay', {
              price: roubles(consultationPrice),
            })}
          </Button>
        ))}
      {error && (
        <p role="alert" style={{ color: '#D4380D', margin: '8px 0 0' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Above the text box of an open chat: until when the expert must reply
 * (while the payment is still held), and who has asked to finish.
 */
export function ConsultationNote({ conversation }) {
  const { role, replyDueAt, price, finishedByMe, finishedByCompanion } = conversation;
  const lines = [];
  if (replyDueAt) {
    lines.push(
      i18n.t(
        role === 'customer' ? 'ui.consultation.awaitingCustomer' : 'ui.consultation.awaitingExpert',
        { price: roubles(price ?? 0), date: dayjs(replyDueAt).format('D MMMM, HH:mm') },
      ),
    );
  }
  if (finishedByMe) {
    lines.push(i18n.t('ui.consultation.finishedByMe'));
  } else if (finishedByCompanion) {
    lines.push(i18n.t('ui.consultation.finishedByCompanion'));
  }
  if (lines.length === 0) return null;
  return (
    <div style={{ ...note, fontSize: '13px' }} data-testid="consultation-note">
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

/** "Завершить" in the header of an open chat; the chat closes when both sides have pressed it. */
export function FinishButton({ conversation, onChanged }) {
  const [busy, setBusy] = useState(false);
  if (conversation.status !== 'OPEN' || conversation.finishedByMe) return null;

  const finish = async () => {
    setBusy(true);
    try {
      await chat.finish(conversation.id);
    } catch {
      // The list is refreshed either way and shows what is true.
    }
    await onChanged();
    setBusy(false);
  };

  return (
    <Popconfirm
      title={i18n.t('ui.consultation.finishConfirm')}
      okText={i18n.t('task.actions.yes')}
      cancelText={i18n.t('task.actions.no')}
      onConfirm={finish}
    >
      <Button size="small" loading={busy} style={{ marginLeft: 'auto', flexShrink: 0 }}>
        {i18n.t('ui.consultation.finish')}
      </Button>
    </Popconfirm>
  );
}
