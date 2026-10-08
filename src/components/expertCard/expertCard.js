import { EnvironmentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Typography } from 'antd';
import { useThemeContext } from '../../context/themeContext';
import RatingBar from '../ratingbar/ratingbar';
import UserImage from '../userImage/userImage';
import styles from './expertCard.module.less';

/** One expert in the catalogue. `expert` is the API's ExpertDto. */
export default function ExpertCard({ expert }) {
  const theme = useThemeContext();
  const { user } = expert;
  const avatarSize = theme?.id === 'xxl' || theme?.id === 'xl' ? 150 : theme?.id === 'xs' ? 80 : 110;

  return (
    <div className={`${styles.card} ${styles.hoverable ?? ''}`}>
      <Row gutter={[20, 40]} justify="center" align="middle" wrap={false} style={{ width: '100%', height: '100%' }}>
        <Col flex={`${avatarSize}px`} style={{ paddingLeft: '0px' }}>
          <UserImage image={user.avatarUrl ?? ''} width={avatarSize} />
        </Col>

        <Col flex="auto" style={{ height: '100%' }}>
          <div className={styles.inCardBlock}>
            <div className={`${styles.wrapBlock} ${styles.branchWrap}`} style={{ marginBottom: '15px' }}>
              <div className={styles.specname} style={{ marginRight: '20px', marginBottom: '10px' }}>
                {user.name} {user.surname ?? ''}
                {expert.verified && (
                  <Tooltip title="Документы проверены">
                    <SafetyCertificateOutlined style={{ color: '#32D69B', marginLeft: '8px' }} />
                  </Tooltip>
                )}
              </div>
              <div className={styles.special} style={{ fontSize: '16px' }}>
                {expert.specializations.map((spec) => spec.name).join(', ')}
              </div>
            </div>

            {theme.isDesktop && (
              <div className={styles.wrapBlock}>
                {expert.branches.map((branch) => (
                  <div key={branch.id} className={styles.branch}>
                    {branch.name.toUpperCase()}
                  </div>
                ))}
              </div>
            )}

            {expert.description && theme.isDesktop && (
              <Typography.Paragraph style={{ marginBottom: '0px' }} ellipsis={{ rows: 2, tooltip: false }}>
                {expert.description}
              </Typography.Paragraph>
            )}

            <div className={styles.wrapBlock} style={{ justifyContent: 'space-between' }}>
              <div className={styles.cityBlock} style={{ marginTop: '10px' }}>
                {user.city && (
                  <>
                    <EnvironmentOutlined style={{ fontSize: '19px', fontWeight: '600' }} />
                    <div className={styles.occupation} style={{ marginLeft: '10px', fontSize: '15px' }}>
                      {user.city.name}
                    </div>
                  </>
                )}
              </div>
              <div style={{ width: '100%', maxWidth: '200px', marginTop: '10px' }}>
                <RatingBar stars={expert.starsAvg} cups={expert.rating} reviews={expert.reviewsCount} fontSize={15} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
