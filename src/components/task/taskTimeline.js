import { Steps } from 'antd';

const STAGES = [
  { status: 'OPEN', title: 'Сбор откликов' },
  { status: 'ASSIGNED', title: 'Подтверждение исполнителя' },
  { status: 'AWAITING_PAYMENT', title: 'Оплата' },
  { status: 'IN_PROGRESS', title: 'Работа' },
  { status: 'REVIEW', title: 'Проверка' },
  { status: 'COMPLETED', title: 'Выполнена' },
];

/**
 * The stages a task goes through, with the current one highlighted.
 * The API keeps the status only, not its history, so a stopped task shows
 * the stages it certainly passed and then where it stopped.
 */
function timeline(task) {
  if (task.status === 'CANCELLED') {
    return { items: [STAGES[0], { title: 'Отменена' }], current: 1, status: 'error' };
  }
  if (task.status === 'DISPUTED') {
    // A dispute can only be opened once the work is paid for.
    return {
      items: [...STAGES.slice(0, 3), { title: 'Спор', description: 'Рассматривает администратор' }, STAGES[5]],
      current: 3,
      status: 'error',
    };
  }
  const current = STAGES.findIndex((stage) => stage.status === task.status);
  // The last stage is an outcome, not something in progress.
  return { items: STAGES, current, status: task.status === 'COMPLETED' ? 'finish' : 'process' };
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
