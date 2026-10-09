import {
  CheckOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import i18n from '../../../utils/i18n-init';
import { roubles } from '../../../utils/money';
import styles from './taskCard.module.scss';

const tone = (rgb) => ({ color: `rgb(${rgb})`, backgroundColor: `rgba(${rgb}, 0.15)` });
const VIOLET = '63, 68, 201';
const AMBER = '201, 138, 11';
const BLUE = '0, 102, 255';
const GREEN = '31, 170, 120';
const RED = '244, 67, 54';
const GREY = '94, 102, 116';

/** How the caller relates to a task: the API's `viewerStatus`. Texts: locale `task.viewer`. */
const VIEWER = {
  youAuthor: { style: tone(VIOLET), icon: <EditOutlined /> },
  youChosen: { style: tone(AMBER), icon: <ClockCircleOutlined /> },
  youPerformer: { style: tone(BLUE), icon: <CheckOutlined /> },
  hasPerformer: { style: tone(BLUE), icon: <CheckOutlined /> },
  youRespond: { style: tone(GREEN), icon: <CheckOutlined /> },
};

/** Where the task is in its lifecycle: the API's `status`. Texts: locale `task.status`. */
export const TASK_STATUS = {
  OPEN: { style: tone(GREEN) },
  ASSIGNED: { style: tone(AMBER) },
  AWAITING_PAYMENT: { style: tone(AMBER) },
  IN_PROGRESS: { style: tone(BLUE) },
  REVIEW: { style: tone(VIOLET) },
  COMPLETED: { style: tone(GREEN) },
  CANCELLED: { style: tone(GREY) },
  DISPUTED: { style: tone(RED), icon: <ExclamationCircleOutlined /> },
};

function Pill({ item, text }) {
  if (!item) {
    return null;
  }
  return (
    <div
      className={styles.branchLabel}
      style={{
        ...item.style,
        textTransform: 'none',
        marginLeft: 0,
        marginTop: 0,
        gap: '8px',
        whiteSpace: 'nowrap',
      }}
    >
      {item.icon}
      <span>{text}</span>
    </div>
  );
}

export function ViewerStatusPill({ viewerStatus }) {
  const { t } = useTranslation();
  return <Pill item={VIEWER[viewerStatus]} text={t(`task.viewer.${viewerStatus}`)} />;
}

export function TaskStatusPill({ status }) {
  const { t } = useTranslation();
  return <Pill item={TASK_STATUS[status]} text={t(`task.status.${status}`)} />;
}

/** "45 000 ₽" or "По договоренности". Shows the agreed price once there is one. */
export function taskPrice(task) {
  const amount = task.agreedPrice ?? task.budget;
  return amount === null || amount === undefined ? i18n.t('task.negotiable') : roubles(amount);
}
