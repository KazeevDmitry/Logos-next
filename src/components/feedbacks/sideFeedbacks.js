import { StarOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import Plural from '../../../utils/plural';
import { useThemeContext } from '../../context/themeContext';
import styles from './sideFeedbacks.module.scss';

/**
 * Review summary: the average, a bar per star value and the review count.
 * `distribution` maps "1".."5" to how many reviews gave that many stars.
 */
export default function SideFeedbacks({ starsAvg = 0, reviewsCount = 0, distribution = {} }) {
  const theme = useThemeContext();
  const { t } = useTranslation();
  const pad = `${theme?.gutters?.vertical?.[theme?.id] ?? 20}px`;

  return (
    <div className={styles.block} style={{ padding: pad }}>
      <div className={styles.blockHeader}>
        <span>{t('labels.feedbacks')}</span>
        <div
          className={styles.prockHeader}
          style={{ color: reviewsCount > 0 ? '#F44336' : '#CED3DB' }}
        >
          <StarOutlined /> <span>{starsAvg.toFixed(1)}</span>
        </div>
      </div>
      {[5, 4, 3, 2, 1].map((stars) => {
        const count = distribution[stars] ?? 0;
        const percent = reviewsCount > 0 ? (count * 100) / reviewsCount : 0;
        return (
          <Row
            key={stars}
            gutter={[10, 10]}
            style={{ marginTop: '15px', width: '100%' }}
            align="middle"
          >
            <Col flex="20px">{stars}</Col>
            <Col flex="auto">
              <div style={{ width: '100%', height: '3px', backgroundColor: '#EAEFF6' }}>
                <div style={{ width: `${percent}%`, height: '3px', backgroundColor: '#0066FF' }} />
              </div>
            </Col>
            <Col flex="52px" style={{ paddingRight: '0px', textAlign: 'right' }}>
              {percent.toFixed(0)}%
            </Col>
          </Row>
        );
      })}
      <span style={{ marginTop: '30px', color: reviewsCount > 0 ? '#0066FF' : '#CED3DB' }}>
        <Plural count={reviewsCount} i18nextPath="reviews.plural" />
      </span>
    </div>
  );
}
