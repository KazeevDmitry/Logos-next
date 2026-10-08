import {
  CheckOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import styles from './taskCard.module.less';

const tone = (rgb) => ({ color: `rgb(${rgb})`, backgroundColor: `rgba(${rgb}, 0.15)` });
const VIOLET = '63, 68, 201';
const AMBER = '201, 138, 11';
const BLUE = '0, 102, 255';
const GREEN = '31, 170, 120';
const RED = '244, 67, 54';
const GREY = '94, 102, 116';

/** How the caller relates to a task: the API's `viewerStatus`. */
const VIEWER = {
  youAuthor: { text: 'Вы автор', style: tone(VIOLET), icon: <EditOutlined /> },
  youChosen: { text: 'Подтвердите участие', style: tone(AMBER), icon: <ClockCircleOutlined /> },
  youPerformer: { text: 'Вы исполнитель', style: tone(BLUE), icon: <CheckOutlined /> },
  hasPerformer: { text: 'Выбран исполнитель', style: tone(BLUE), icon: <CheckOutlined /> },
  youRespond: { text: 'Вы откликнулись', style: tone(GREEN), icon: <CheckOutlined /> },
};

/** Where the task is in its lifecycle: the API's `status`. */
export const TASK_STATUS = {
  OPEN: { text: 'Принимает отклики', style: tone(GREEN) },
  ASSIGNED: { text: 'Ждёт подтверждения исполнителя', style: tone(AMBER) },
  AWAITING_PAYMENT: { text: 'Ждёт оплаты', style: tone(AMBER) },
  IN_PROGRESS: { text: 'В работе', style: tone(BLUE) },
  REVIEW: { text: 'На проверке', style: tone(VIOLET) },
  COMPLETED: { text: 'Выполнена', style: tone(GREEN) },
  CANCELLED: { text: 'Отменена', style: tone(GREY) },
  DISPUTED: { text: 'Спор', style: tone(RED), icon: <ExclamationCircleOutlined /> },
};

function Pill({ item }) {
  if (!item) {
    return null;
  }
  return (
    <div
      className={styles.branchLabel}
      style={{ ...item.style, textTransform: 'none', marginLeft: 0, marginTop: 0, gap: '8px', whiteSpace: 'nowrap' }}
    >
      {item.icon}
      <span>{item.text}</span>
    </div>
  );
}

export const ViewerStatusPill = ({ viewerStatus }) => <Pill item={VIEWER[viewerStatus]} />;
export const TaskStatusPill = ({ status }) => <Pill item={TASK_STATUS[status]} />;

/** "45 000 ₽" or "По договоренности". Shows the agreed price once there is one. */
export function taskPrice(task) {
  const amount = task.agreedPrice ?? task.budget;
  return amount === null || amount === undefined ? 'По договоренности' : `${amount.toLocaleString('ru-RU')} ₽`;
}
