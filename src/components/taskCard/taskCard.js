import { EnvironmentOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import Plural from '../../../utils/plural';
import { useThemeContext } from '../../context/themeContext';
import PublishedDate from '../publishedDate/publishedDate';
import styles from './taskCard.module.scss';
import { taskPrice, TaskStatusPill, ViewerStatusPill } from './taskStatus';

/**
 * One task in a list. `task` is the API's TaskDto. With `showStatus` the
 * lifecycle status is shown too (used in "my tasks", where tasks are not all open).
 */
export default function TaskCard({ task, showStatus = false, footer }) {
  const theme = useThemeContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const negotiable = task.agreedPrice === null && task.budget === null;

  return (
    <div className={styles.card} style={{ padding: pad }}>
      <div className={styles.titleBlock}>
        <div className={styles.questionBody}>
          <span style={{ fontSize: theme.isDesktop ? '28px' : '22px', fontWeight: '450' }}>
            {task.title}
          </span>
          <span
            style={{
              fontSize: negotiable ? '18px' : '24px',
              marginLeft: '20px',
              color: '#0066FF',
              whiteSpace: 'nowrap',
            }}
          >
            {taskPrice(task)}
          </span>
        </div>
        <div className={styles.specBlock} style={{ marginLeft: '-20px' }}>
          {task.specialization && (
            <div className={styles.specLabel}>{task.specialization.name}</div>
          )}
          {task.branches.map((branch) => (
            <div key={branch.id} className={styles.branchLabel}>
              {branch.name}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.descriptionBlock}>
        <Divider />
        <Typography.Paragraph
          style={{ fontSize: '16px', lineHeight: '24px', marginBottom: 0 }}
          ellipsis={{ rows: 2 }}
        >
          {task.text}
        </Typography.Paragraph>
        <Divider />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px 20px',
            color: '#5E6674',
          }}
        >
          {task.city && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <EnvironmentOutlined style={{ fontSize: '22px' }} />
              {task.city.name}
            </span>
          )}
          <PublishedDate currDate={new Date(task.createdAt)} textColor="#5E6674" />
          <span style={{ color: task.responsesCount > 0 ? '#32D69B' : '#CED3DB' }}>
            <Plural count={task.responsesCount} i18nextPath="responses.plural" />
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {showStatus && <TaskStatusPill status={task.status} />}
            <ViewerStatusPill viewerStatus={task.viewerStatus} />
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
