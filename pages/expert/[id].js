import {
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Col, Result, Row, Space, Tabs, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { chat, experts } from '../../lib/api';
import { createApi } from '../../lib/api/client';
import Feedbacks from '../../src/components/feedbacks/feedbacks';
import SideFeedbacks from '../../src/components/feedbacks/sideFeedbacks';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import Seo from '../../src/components/seo';
import UserImage from '../../src/components/userImage/userImage';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import styles from './expertInfo.module.less';

import i18n from '../../utils/i18n-init';
const plural = (n, one, few, many) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

export default function ExpertPage({ serverExpert }) {
  const { t } = useTranslation();
  const theme = useThemeContext();
  const router = useRouter();
  const { currentUser } = useUserContext();
  const expertId = Number(router.query.id);

  const { data: expert } = useQuery(['expert', expertId], () => experts.get(expertId), {
    initialData: serverExpert ?? undefined,
    enabled: Number.isFinite(expertId),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  // Only the star distribution is needed here; the list itself is loaded by <Feedbacks>.
  const { data: reviews } = useQuery(
    ['feedbacks', expertId, 'summary'],
    () => experts.feedbacks(expertId, { pageSize: 1 }),
    { enabled: Boolean(expert), refetchOnWindowFocus: false },
  );

  // A chat exists per offer, so writing to an expert is possible once they
  // have responded to one of the visitor's tasks. Newest chat first.
  const { data: conversations = [] } = useQuery(
    ['chat', 'conversations'],
    () => chat.conversations(),
    {
      enabled: Boolean(currentUser) && Boolean(expert),
      refetchOnWindowFocus: false,
    },
  );
  const conversation = conversations.find((item) => item.companion.id === expert?.user.id);
  const isSelf = currentUser?.id === expert?.user.id;

  if (!expert) {
    return (
      <Result
        status="404"
        title={i18n.t('pages.expertId.ekspertNeNayden')}
        style={{ marginTop: '120px' }}
      />
    );
  }

  const { user } = expert;
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const avatar = theme.isDesktop ? 200 : 110;

  const title = (
    <Space align="center" size="large">
      <UserImage image={user.avatarUrl ?? ''} width={avatar} />
      <div>
        <div>
          {user.name} {user.surname ?? ''}
          {expert.verified && (
            <Tooltip title={i18n.t('pages.expertId.dokumentyProvereny')}>
              <SafetyCertificateOutlined
                style={{ color: '#32D69B', marginLeft: '12px', fontSize: '0.7em' }}
              />
            </Tooltip>
          )}
        </div>
        {user.city && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '10px',
              color: 'grey',
              fontSize: '22px',
            }}
          >
            <EnvironmentOutlined style={{ fontSize: '24px' }} />
            <span style={{ marginLeft: '10px' }}>{user.city.name}</span>
          </div>
        )}
      </div>
    </Space>
  );

  return (
    <>
      {/* The heading is a block with the photo, so the tab title is set here. */}
      <Seo
        title={`${user.name} ${user.surname ?? ''}`.trim()}
        description={expert.description}
        image={user.avatarUrl}
        type="profile"
      />
      <PageHeader title={title} />
      <PageContainer>
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <Tabs
            defaultActiveKey="info"
            items={[
              { key: 'info', label: t('labels.information'), children: <Info expert={expert} /> },
              {
                key: 'feedbacks',
                label: `${t('labels.feedbacks')} (${expert.reviewsCount})`,
                children: <Feedbacks expertId={expert.id} />,
              },
            ]}
          />
        </Col>

        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Row gutter={[pad, pad]} style={{ marginTop: theme.isDesktop ? '66px' : 0 }}>
            <div
              className={styles.ratingCup}
              style={{ padding: `0px 0px 0px ${pad}`, overflow: 'hidden' }}
            >
              <div className={styles.firstContainer} style={{ marginLeft: '0px' }}>
                <h3 className={styles.title}>{i18n.t('pages.expertId.reyting')}</h3>
                <div className={styles.subrow}>
                  <TrophyOutlined style={{ color: '#F4B336', fontSize: '24px' }} />
                  <span className={styles.cupNum}>{expert.rating}</span>
                </div>
              </div>
              <TrophyOutlined
                style={{ color: '#F4B336', marginRight: '-50px', fontSize: '150px', opacity: 0.2 }}
              />
            </div>
            <SideFeedbacks
              starsAvg={expert.starsAvg}
              reviewsCount={expert.reviewsCount}
              distribution={reviews?.distribution}
            />
            {!isSelf && (
              <div
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: pad,
                  width: '100%',
                  marginTop: pad,
                }}
              >
                {conversation ? (
                  <Link href={`/messages?chat=${conversation.id}`}>
                    <Button type="primary" size={theme?.size} style={{ width: '100%' }}>
                      {i18n.t('pages.expertId.napisatEkspertu')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <p style={{ color: '#5E6674' }}>
                      {i18n.t('pages.expertId.chatSEkspertomOtkroetsyaKogda')}
                    </p>
                    <Link href="/task/new">
                      <Button type="primary" size={theme?.size} style={{ width: '100%' }}>
                        {i18n.t('pages.expertId.sozdatZadachu')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </Row>
        </Col>
      </PageContainer>
    </>
  );
}

function Info({ expert }) {
  const theme = useThemeContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const years = expert.experience;

  return (
    <div className={styles.blockMain}>
      <Row gutter={[pad, pad]} style={{ width: '100%' }}>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <p className={styles.title}>{i18n.t('pages.expertId.spetsializatsiya')}</p>
          <span className={styles.occupation}>
            {expert.specializations.map((spec) => spec.name).join(', ') ||
              i18n.t('pages.expertId.neUkazana')}
          </span>
          <div className={styles.subrow} style={{ marginLeft: '-20px' }}>
            <span
              className={styles.comment}
              style={{ marginLeft: '20px', marginTop: '10px', color: 'darkgrey' }}
            >
              {i18n.t('pages.expertId.stazh')}
            </span>
            <span className={styles.experience} style={{ marginTop: '10px' }}>
              {years === null
                ? i18n.t('pages.expertId.neUkazan')
                : `${years} ${plural(years, i18n.t('pages.expertId.god'), i18n.t('pages.expertId.goda'), i18n.t('pages.expertId.let'))}`}
            </span>
            <div style={{ display: 'flex', marginLeft: '20px', marginTop: '10px' }}>
              <UserOutlined style={{ color: 'darkgrey' }} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <div className={styles.category}>
            <p className={styles.title}>{i18n.t('pages.expertId.kategoriiPrava')}</p>
            <div className={styles.subrow}>
              {expert.branches.map((branch) => (
                <span key={branch.id} className={styles.lawType} style={{ fontSize: '14px' }}>
                  {branch.name}
                </span>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {expert.description && (
        <div className={styles.row2} style={{ width: '100%' }}>
          <h3 className={styles.title}>{i18n.t('pages.expertId.lichnayaInformatsiya')}</h3>
          <h4 className={styles.comment2}>{i18n.t('pages.expertId.oSebe')}</h4>
          <div className={styles.personalInfo}>
            <span className={styles.personalText} style={{ whiteSpace: 'pre-wrap' }}>
              {expert.description}
            </span>
          </div>
        </div>
      )}

      {expert.services.length > 0 && (
        <div className={styles.row4}>
          <h3 className={styles.title}>{i18n.t('pages.expertId.uslugiITseny')}</h3>
          {expert.services.map((service) => (
            <div
              key={service.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px',
                padding: '8px 0',
                borderBottom: '1px solid #EAEFF6',
              }}
            >
              <span>{service.title}</span>
              <span style={{ whiteSpace: 'nowrap', color: '#0066FF' }}>
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          ))}
        </div>
      )}

      {expert.educations.length > 0 && (
        <div className={styles.row4}>
          <h3 className={styles.title}>{i18n.t('pages.expertId.obrazovanie')}</h3>
          <Row style={{ width: '100%' }} gutter={[pad, pad]}>
            {expert.educations.map((education) => (
              <Col key={education.id} xs={24} sm={24} md={12} lg={12} xl={12}>
                <div className={styles.education}>
                  <h4 className={styles.subtitle}>
                    <span className={styles.univercity1}>{education.university}</span>
                    {education.hasDiploma && (
                      <Tooltip title={i18n.t('pages.expertId.diplomZagruzhen')}>
                        <SafetyCertificateOutlined
                          style={{ color: '#32D69B', marginLeft: '8px' }}
                        />
                      </Tooltip>
                    )}
                  </h4>
                  <div className={styles.subrow1}>
                    <span className={styles.univercitySpec2}>{education.speciality}</span>
                    <div className={styles.circleDivider}></div>
                    <span className={styles.year}>{education.year}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    return { props: { serverExpert: await experts.get(context.query.id, createApi(context)) } };
  } catch {
    return { props: { serverExpert: null } };
  }
}
