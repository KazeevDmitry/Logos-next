import { CloseOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../context/themeContext';
import Seo from '../seo';
import styles from './pageHeader.module.less';

/**
 * The page's h1 with an optional block to its right (`children`) or a
 * close button. The same title goes to the browser tab; `seo` adds the
 * rest of the page's meta ({ description, image, noindex, type }).
 */
export default function PageHeader({
  children,
  xs = 0,
  sm = 0,
  md = 8,
  lg = 7,
  xl = 6,
  title,
  maxWidth = '1400px',
  closeBtn = false,
  seo,
}) {
  const theme = useThemeContext();
  const router = useRouter();
  const gut = theme?.gutters?.gorizontal[theme?.id] ?? 20;

  return (
    <div
      style={{
        width: '100%',
        marginTop: '100px',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth,
      }}
    >
      {typeof title === 'string' && <Seo title={title} {...seo} />}
      <Row gutter={[gut, gut]}>
        <Col xs={24 - xs} sm={24 - sm} md={24 - md} lg={24 - lg} xl={24 - xl}>
          <div className={styles.flexContainer}>
            <h1 lang="ru" className={styles.headText}>
              {title}
            </h1>
          </div>
        </Col>
        <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          {!closeBtn && children}
          {closeBtn && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <button
                type="button"
                aria-label="Закрыть"
                className={styles.closeBtn}
                style={{
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  border: 'none',
                  padding: 0,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => router.back()}
              >
                <CloseOutlined />
              </button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
