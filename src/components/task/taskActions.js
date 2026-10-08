import { Button, Popconfirm } from 'antd';
import { useState } from 'react';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { taskPrice } from '../taskCard/taskStatus';
import { useNotifyContext } from '../../context/notificationContext';

/**
 * What each side may do in each status. Mirrors the API's transition table
 * (task-transitions.ts); the API still decides, this only picks the buttons.
 *
 * `confirm` asks before running; `primary` marks the expected next step.
 */
const ACTIONS = {
  youAuthor: {
    OPEN: [{ action: 'cancel', label: 'Отменить задачу', confirm: 'Отменить задачу? Отклики будут закрыты.', danger: true }],
    ASSIGNED: [
      { action: 'unassign', label: 'Выбрать другого исполнителя', confirm: 'Отменить выбор исполнителя?' },
      { action: 'cancel', label: 'Отменить задачу', confirm: 'Отменить задачу?', danger: true },
    ],
    AWAITING_PAYMENT: [{ action: 'cancel', label: 'Отменить задачу', confirm: 'Отменить задачу?', danger: true }],
    IN_PROGRESS: [{ action: 'dispute', label: 'Открыть спор', confirm: 'Открыть спор? Его рассмотрит администратор.', danger: true }],
    REVIEW: [
      { action: 'accept', label: 'Принять работу', confirm: 'Принять работу? Деньги будут переведены исполнителю.', primary: true },
      { action: 'request-changes', label: 'Вернуть на доработку' },
      { action: 'dispute', label: 'Открыть спор', confirm: 'Открыть спор? Его рассмотрит администратор.', danger: true },
    ],
  },
  youChosen: {
    ASSIGNED: [
      { action: 'confirm', label: 'Подтвердить участие', primary: true },
      { action: 'decline', label: 'Отказаться', confirm: 'Отказаться от задачи?' },
    ],
  },
  youPerformer: {
    IN_PROGRESS: [
      { action: 'submit', label: 'Сдать работу', confirm: 'Сдать работу на проверку заказчику?', primary: true },
      { action: 'dispute', label: 'Открыть спор', confirm: 'Открыть спор? Его рассмотрит администратор.', danger: true },
    ],
    REVIEW: [{ action: 'dispute', label: 'Открыть спор', confirm: 'Открыть спор? Его рассмотрит администратор.', danger: true }],
  },
};

const DONE = {
  cancel: 'Задача отменена',
  unassign: 'Выбор отменён, задача снова принимает отклики',
  accept: 'Работа принята',
  'request-changes': 'Задача возвращена на доработку',
  dispute: 'Спор открыт',
  confirm: 'Участие подтверждено',
  decline: 'Вы отказались от задачи',
  submit: 'Работа сдана на проверку',
  choose: 'Исполнитель выбран. Ждём его подтверждения.',
};

/** What the person should know or do next, in one sentence. */
const HINTS = {
  youAuthor: {
    ASSIGNED: 'Ждём, пока исполнитель подтвердит участие.',
    AWAITING_PAYMENT:
      'Исполнитель подтвердил участие. Оплатите задачу, чтобы он приступил к работе: деньги будут зарезервированы и перейдут исполнителю после приёмки.',
    IN_PROGRESS: 'Исполнитель работает над задачей.',
    REVIEW: 'Исполнитель сдал работу. Примите её или верните на доработку.',
    DISPUTED: 'Спор рассматривает администратор.',
  },
  youChosen: { ASSIGNED: 'Заказчик выбрал вас. Подтвердите участие или откажитесь.' },
  youPerformer: {
    AWAITING_PAYMENT: 'Ждём оплаты от заказчика. После неё можно приступать.',
    IN_PROGRESS: 'Задача оплачена. Когда закончите, сдайте работу.',
    REVIEW: 'Работа на проверке у заказчика.',
    DISPUTED: 'Спор рассматривает администратор.',
  },
};

/** Runs a lifecycle step and reports the result; shared by the buttons here and on offers. */
export function useTaskAction(taskId, refresh) {
  const { successNotification, infoNotification } = useNotifyContext();
  const [running, setRunning] = useState(null);

  const run = async (action, body) => {
    setRunning(action);
    try {
      await tasks.act(taskId, action, body);
      successNotification(DONE[action] ?? 'Готово', '');
    } catch (e) {
      // 409: somebody else changed the task meanwhile; show its current state.
      infoNotification('Не получилось', errorMessage(e));
    } finally {
      setRunning(null);
      refresh();
    }
  };
  return { run, running };
}

/** Starts the payment for a task and sends the author to the provider's payment page. */
function PayButton({ task, size }) {
  const { infoNotification } = useNotifyContext();
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const payment = await tasks.fund(task.id);
      // Leaving the site: the provider returns the customer to /payments/<id>/return.
      window.location.assign(payment.confirmationUrl);
    } catch (e) {
      infoNotification('Не получилось начать оплату', errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Button type="primary" size={size} loading={busy} onClick={pay} style={{ width: '100%' }}>
      Оплатить {taskPrice(task)}
    </Button>
  );
}

/** The buttons and the hint for the caller's role in the task's current status. */
export default function TaskActions({ task, refresh, size, children }) {
  const { run, running } = useTaskAction(task.id, refresh);
  const actions = ACTIONS[task.viewerStatus]?.[task.status] ?? [];
  const hint = HINTS[task.viewerStatus]?.[task.status];

  if (actions.length === 0 && !hint && !children) {
    return null;
  }

  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {hint && <div style={{ color: '#5E6674' }}>{hint}</div>}
      {children}
      {task.viewerStatus === 'youAuthor' && task.status === 'AWAITING_PAYMENT' && <PayButton task={task} size={size} />}
      {actions.map(({ action, label, confirm, danger, primary }) => {
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
            {label}
          </Button>
        );
        return confirm ? (
          <Popconfirm key={action} title={confirm} okText="Да" cancelText="Нет" onConfirm={() => run(action)}>
            {button}
          </Popconfirm>
        ) : (
          button
        );
      })}
    </div>
  );
}
