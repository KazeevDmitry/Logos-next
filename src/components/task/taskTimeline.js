import { Steps } from 'antd';
import { useTranslation } from 'react-i18next';
import { roubles } from '../../../utils/money';

/** The path of a task that runs to the end. Titles and notes: locale `task.stages`. */
const STAGES = ['OPEN', 'ASSIGNED', 'AWAITING_PAYMENT', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];

/** Where the task's money is at each status, as { stage: [locale key, params] }. */
function moneyNotes(task) {
  if (task.agreedPrice === null || task.agreedPrice === undefined) {
    return {};
  }
  const sum = { sum: roubles(task.agreedPrice) };
  switch (task.status) {
    case 'AWAITING_PAYMENT':
      return { AWAITING_PAYMENT: ['awaiting', sum] };
    case 'IN_PROGRESS':
    case 'REVIEW':
      return { AWAITING_PAYMENT: ['held', sum] };
    case 'DISPUTED':
      return { AWAITING_PAYMENT: ['heldDispute', sum] };
    case 'COMPLETED':
      return { AWAITING_PAYMENT: ['paid', sum], COMPLETED: ['released'] };
    default:
      return {};
  }
}

/**
 * The stages a task goes through, with the current one highlighted.
 * The API keeps the status only, not its history, so a stopped task shows
 * the stages it certainly passed and then where it stopped.
 */
function timeline(task, t) {
  const notes = moneyNotes(task);
  const stage = (status) => ({
    key: status,
    title: t(`task.stages.${status}`),
    content: notes[status] ? t(`task.stages.${notes[status][0]}`, notes[status][1]) : undefined,
  });
  const stages = STAGES.map(stage);

  if (task.status === 'CANCELLED') {
    return {
      items: [stages[0], { ...stage('CANCELLED'), content: t('task.stages.cancelNote') }],
      current: 1,
      status: 'error',
    };
  }
  if (task.status === 'DISPUTED') {
    // A dispute can only be opened once the work is paid for.
    return {
      items: [
        ...stages.slice(0, 3),
        { ...stage('DISPUTED'), content: t('task.stages.disputeNote') },
        stages[5],
      ],
      current: 3,
      status: 'error',
    };
  }
  // The last stage is an outcome, not something in progress.
  return {
    items: stages,
    current: STAGES.indexOf(task.status),
    status: task.status === 'COMPLETED' ? 'finish' : 'process',
  };
}

export default function TaskTimeline({ task }) {
  const { t } = useTranslation();
  const { items, current, status } = timeline(task, t);
  return (
    <Steps orientation="vertical" size="small" current={current} status={status} items={items} />
  );
}
