import { Col, Divider, Rate, Typography } from 'antd';
import Link from 'next/link';
import PublishedDate from '../publishedDate/publishedDate';
import UserImage from '../userImage/userImage';
import styles from './feedbacks.module.less';

const more = <span style={{ color: '#0066FF', fontWeight: '600' }}>{'>>>>'}</span>;

/** One customer review. `feedback` is the API's FeedbackDto. */
export default function FeedbackCard({ feedback }) {
  const { author } = feedback;
  const username = `${author.name} ${author.surname ?? ''}`.trim();

  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
      <div className={styles.smallCard}>
        <div className={styles.subrow}>
          <UserImage image={author.avatarUrl ?? ''} width={45} />
          <span className={styles.someName}>{username}</span>
        </div>
        <div className={styles.rowStars}>
          <Rate disabled style={{ color: 'red' }} value={feedback.stars} />
          <PublishedDate
            currDate={new Date(feedback.createdAt)}
            textColor="#5E6674"
            format="DD MMM YYYY"
            imageStyle={{ fontSize: '18px', fontWeight: '600' }}
          />
        </div>
        <h4 className={styles.subtitleCard}>
          <Link href={`/task/${feedback.task.id}`}>{feedback.task.title}</Link>
        </h4>
        <Divider />
        <Typography.Paragraph
          style={{ fontWeight: '400', fontSize: '14px' }}
          ellipsis={{ rows: 3, expandable: true, symbol: more }}
        >
          {feedback.text}
        </Typography.Paragraph>
      </div>
    </Col>
  );
}
