import { EnvironmentOutlined, MessageOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import Plural from '../../../utils/plural';
import { useThemeContext } from '../../context/themeContext';
import PublishedDate from '../publishedDate/publishedDate';
import styles from '../taskCard/taskCard.module.less';
import UserImage from '../userImage/userImage';

/** Who wrote something and where they are from. `user` is the API's public user object. */
export function AuthorLine({ user, size = 40 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
      <UserImage image={user.avatarUrl ?? ''} width={size} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 500 }}>
          {user.name} {user.surname ?? ''}
        </div>
        {user.city && (
          <div style={{ color: '#5E6674', fontSize: '14px' }}>
            <EnvironmentOutlined /> {user.city.name}
          </div>
        )}
      </div>
    </div>
  );
}

/** Branch and sub-branch of law as pills. */
export function BranchPills({ branch, subbranch, branches = [] }) {
  const pills = [...(branch ? [branch] : []), ...(subbranch ? [subbranch] : []), ...branches];
  return (
    <div className={styles.specBlock} style={{ marginLeft: '-20px' }}>
      {pills.map((pill) => (
        <div key={`${pill.id}-${pill.name}`} className={styles.branchLabel}>
          {pill.name}
        </div>
      ))}
    </div>
  );
}

/**
 * One question in the list (text clipped to two lines) or on its own page
 * (`expanded`). `question` is the API's QuestionDto.
 */
export default function QuestionCard({ question, expanded = false }) {
  const theme = useThemeContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  return (
    <div className={styles.card} style={{ padding: pad }}>
      <div className={styles.titleBlock}>
        {!expanded && (
          <div className={styles.questionBody}>
            <span style={{ fontSize: theme.isDesktop ? '28px' : '22px', fontWeight: '450' }}>{question.title}</span>
          </div>
        )}
        <BranchPills branch={question.branch} subbranch={question.subbranch} />
      </div>
      <div className={styles.descriptionBlock}>
        <Divider />
        <Typography.Paragraph
          style={{ fontSize: '16px', lineHeight: '24px', whiteSpace: 'pre-wrap', marginBottom: 0 }}
          ellipsis={expanded ? false : { rows: 2 }}
        >
          {question.description}
        </Typography.Paragraph>
        {expanded && question.attachments.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
            {question.attachments.map((file) => (
              <a key={file.id} href={file.url} target="_blank" rel="noreferrer">
                {file.name}
              </a>
            ))}
          </div>
        )}
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <AuthorLine user={question.author} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#5E6674' }}>
            <PublishedDate currDate={new Date(question.createdAt)} textColor="#5E6674" />
            <span style={{ color: question.answersCount > 0 ? '#32D69B' : '#CED3DB', whiteSpace: 'nowrap' }}>
              <MessageOutlined /> <Plural count={question.answersCount} i18nextPath="answers.plural" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
