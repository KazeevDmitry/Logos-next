import { Steps } from 'antd';
import { roubles } from '../../../utils/money';

const STAGES = [
  { status: 'OPEN', title: 'Сбор откликов' },
  { status: 'ASSIGNED', title: 'Подтверждение исполнителя' },
  { status: 'AWAITING_PAYMENT', title: 'Оплата' },
  { status: 'IN_PROGRESS', title: 'Работа' },
  { status: 'REVIEW', title: 'Проверка' },
  { status: 'COMPLETED', title: 'Выполнена' },
];

/** Where the task's money is at each status; shown under the stage it belongs to. */
function moneyNote(task) {
  if (task.agreedPrice === null || task.agreedPrice === undefined) {
    return {};
  }
  const sum = roubles(task.agreedPrice);
  switch (task.status) {
    case 'AWAITING_PAYMENT':
      return { AWAITING_PAYMENT: `Ждём оплату ${sum} от заказчика` };
    case 'IN_PROGRESS':
    case 'REVIEW':
      return { AWAITING_PAYMENT: `${sum} оплачены и зарезервированы до приёмки работы` };
    case 'DISPUTED':
      return { AWAITING_PAYMENT: `${sum} зарезервированы до решения спора` };
    case 'COMPLETED':
      return {
        AWAITING_PAYMENT: `${sum} оплачены`,
        COMPLETED: 'Деньги переведены исполнителю за вычетом комиссии сервиса',
      };
    default:
      return {};
  }
}

/**
 * The stages a task goes through, with the current one highlighted.
 * The API keeps the status only, not its history, so a stopped task shows
 * the stages it certainly passed and then where it stopped.
 */
function timeline(task) {
  const notes = moneyNote(task);
  const stages = STAGES.map((stage) => ({ ...stage, description: notes[stage.status] }));

  if (task.status === 'CANCELLED') {
    return {
      items: [stages[0], { title: 'Отменена', description: 'Если задача была оплачена, деньги возвращены заказчику' }],
      current: 1,
      status: 'error',
    };
  }
  if (task.status === 'DISPUTED') {
    // A dispute can only be opened once the work is paid for.
    return {
      items: [...stages.slice(0, 3), { title: 'Спор', description: 'Рассматривает администратор' }, stages[5]],
      current: 3,
      status: 'error',
    };
  }
  const current = STAGES.findIndex((stage) => stage.status === task.status);
  // The last stage is an outcome, not something in progress.
  return { items: stages, current, status: task.status === 'COMPLETED' ? 'finish' : 'process' };
}

export default function TaskTimeline({ task }) {
  const { items, current, status } = timeline(task);
  return (
    <Steps direction="vertical" size="small" current={current} status={status}>
      {items.map((item) => (
        <Steps.Step key={item.title} title={item.title} description={item.description} />
      ))}
    </Steps>
  );
}
