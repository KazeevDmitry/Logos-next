import { Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { useNotifyContext } from '../../context/notificationContext';
import { taskPrice } from '../taskCard/taskStatus';

const DISPUTE = { action: 'dispute', confirm: 'dispute', danger: true };
const CANCEL = { action: 'cancel', confirm: 'cancel', danger: true };

/**
 * What each side may do in each status. Mirrors the API's transition table
 * (task-transitions.ts); the API still decides, this only picks the buttons.
 *
 * `confirm` is a key of locale `task.confirm` and makes the button ask
 * first; `primary` marks the expected next step. Labels: `task.actions`.
 */
const ACTIONS = {
  youAuthor: {
    OPEN: [{ ...CANCEL, confirm: 'cancelOpen' }],
    ASSIGNED: [{ action: 'unassign', confirm: 'unassign' }, CANCEL],
    AWAITING_PAYMENT: [CANCEL],
    IN_PROGRESS: [DISPUTE],
    REVIEW: [{ action: 'accept', confirm: 'accept', primary: true }, { action: 'request-changes' }, DISPUTE],
  },
  youChosen: {
    ASSIGNED: [{ action: 'confirm', primary: true }, { action: 'decline', confirm: 'decline' }],
  },
  youPerformer: {
    IN_PROGRESS: [{ action: 'submit', confirm: 'submit', primary: true }, DISPUTE],
    REVIEW: [DISPUTE],
  },
};

/** The caller's role → the group of hints in locale `task.hints`. */
const HINT_GROUP = { youAuthor: 'author', youChosen: 'chosen', youPerformer: 'performer' };
const HINTS = {
  author: ['ASSIGNED', 'AWAITING_PAYMENT', 'IN_PROGRESS', 'REVIEW', 'DISPUTED'],
  chosen: ['ASSIGNED'],
  performer: ['AWAITING_PAYMENT', 'IN_PROGRESS', 'REVIEW', 'DISPUTED'],
};

/** "request-changes" → "requestChanges": the action's key in the locale files. */
const localeKey = (action) => action.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());

/** Runs a lifecycle step and reports the result; shared by the buttons here and on offers. */
export function useTaskAction(taskId, refresh) {
  const { t } = useTranslation();
  const { successNotification, infoNotification } = useNotifyContext();
  const [running, setRunning] = useState(null);

  const run = async (action, body) => {
    setRunning(action);
    try {
      await tasks.act(taskId, action, body);
      successNotification(t(`task.done.${localeKey(action)}`, t('task.done.fallback')), '');
    } catch (e) {
      // 409: somebody else changed the task meanwhile; show its current state.
      infoNotification(t('task.done.failed'), errorMessage(e));
    } finally {
      setRunning(null);
      refresh();
    }
  };
  return { run, running };
}

/** Starts the payment for a task and sends the author to the provider's payment page. */
function PayButton({ task, size }) {
  const { t } = useTranslation();
  const { infoNotification } = useNotifyContext();
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const payment = await tasks.fund(task.id);
      // Leaving the site: the provider returns the customer to /payments/<id>/return.
      window.location.assign(payment.confirmationUrl);
    } catch (e) {
      infoNotification(t('task.done.payFailed'), errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Button type="primary" size={size} loading={busy} onClick={pay} style={{ width: '100%' }}>
      {t('task.actions.pay', { sum: taskPrice(task) })}
    </Button>
  );
}

/** The buttons and the hint for the caller's role in the task's current status. */
export default function TaskActions({ task, refresh, size, children }) {
  const { t } = useTranslation();
  const { run, running } = useTaskAction(task.id, refresh);
  const actions = ACTIONS[task.viewerStatus]?.[task.status] ?? [];
  const group = HINT_GROUP[task.viewerStatus];
  const hint = group && HINTS[group].includes(task.status) ? t(`task.hints.${group}.${task.status}`) : null;
  const canPay = task.viewerStatus === 'youAuthor' && task.status === 'AWAITING_PAYMENT';

  if (actions.length === 0 && !hint && !children && !canPay) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {hint && <div style={{ color: '#5E6674' }}>{hint}</div>}
      {children}
      {canPay && <PayButton task={task} size={size} />}
      {actions.map(({ action, confirm, danger, primary }) => {
        const button = (
          <Button
            key={action}
            type={primary ? 'primary' : 'default'}
            danger={danger}
            size={size}
            loading={running === action}
            disabled={running !== null && running !== action}
            onClick={confirm ? undefined : () => run(action)}
            style={{ width: '100%' }}
          >
            {t(`task.actions.${localeKey(action)}`)}
          </Button>
        );
        return confirm ? (
          <Popconfirm
            key={action}
            title={t(`task.confirm.${confirm}`)}
            okText={t('task.actions.yes')}
            cancelText={t('task.actions.no')}
            onConfirm={() => run(action)}
          >
            {button}
          </Popconfirm>
        ) : (
          button
        );
      })}
    </div>
  );
}
