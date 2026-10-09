import { Button, Col, Form, Row } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { experts as expertsApi } from '../lib/api';
import { createApi } from '../lib/api/client';
import { pageSeo } from '../lib/pageSeo';
import CityInput from '../src/components/cityInput/cityInput';
import InputSlider from '../src/components/input-slider/input-slider';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import RatingBar from '../src/components/ratingbar/ratingbar';
import UserCard from '../src/components/userCard/userCard';
import UserImage from '../src/components/userImage/userImage';
import { useThemeContext } from '../src/context/themeContext';
import styles from '../styles/mainPage.module.scss';

import i18n from '../utils/i18n-init';
/** Shown in the promo text until the platform has a real figure worth quoting. */
const USERS_COUNT = 1000;
const CIRCLES = 6;
const BEST_COUNT = 9;

/** Where each of the six floating avatars sits in the hero, and its size class. */
const CIRCLE_SLOTS = [
  { top: '44%', right: '16%', size: 'big', tooltipAbove: true },
  { top: '21.8%', right: '6%', size: 'big' },
  { top: '9%', right: '16.5%', size: 'mid' },
  { top: '27%', right: '26%', size: 'mid' },
  { top: '12%', right: '33.5%', size: 'small' },
  { top: '42%', right: '38%', size: 'small' },
];

const specOf = (expert) => expert.specializations[0]?.name ?? '';

export default function Home({ topExperts }) {
  const theme = useThemeContext();
  const { t } = useTranslation();
  // The card of the expert under the pointer. It stays mounted after the
  // pointer leaves, only hidden, so it can fade out as well as in.
  const [hovered, setHovered] = useState(null);
  const [cardShown, setCardShown] = useState(false);

  const compact = theme.size === 'middle';
  const sizes = {
    big: compact ? 100 : theme.id === 'xl' ? 130 : 150,
    mid: compact ? 80 : theme.id === 'xl' ? 100 : 120,
    small: compact ? 60 : theme.id === 'xl' ? 80 : 100,
  };

  const onMouseEnter = (expert, tooltipAbove) => (e) => {
    const box = e.target.getBoundingClientRect();
    const left = Math.round(box.left - 300 + box.width * 0.2 + window.pageXOffset);
    const top = tooltipAbove
      ? Math.round(box.top - 160 + window.pageYOffset + box.height * 0.2)
      : Math.round(box.bottom - 60 + window.pageYOffset - box.height * 0.2);
    setHovered({ expert, left, top });
    setCardShown(true);
  };

  const bleed = `-${theme?.appContainerPadding}px`;
  const bestExperts = topExperts.slice(0, BEST_COUNT);

  return (
    <>
      {!theme.isDesktop && (
        <>
          <PageHeader title={t('main.promo.title')}>
            <div className={styles.promoLabel}>
              <p>{t('main.promo.subtitle', { count: USERS_COUNT })}</p>
            </div>
          </PageHeader>
          <MainTabs />
        </>
      )}

      {theme.isDesktop && (
        <div
          className={styles.sectionPromo}
          style={{
            marginLeft: bleed,
            marginRight: bleed,
            padding: `0px ${theme?.appContainerPadding}px`,
          }}
        >
          <div className={styles.txtWrapper} style={{ height: '100%' }}>
            <h1 className={styles.promoHeader}>{t('main.promo.title')}</h1>
            <div className={styles.promoLabel}>
              <p>{t('main.promo.subtitle', { count: USERS_COUNT })}</p>
            </div>
          </div>

          {topExperts.slice(0, CIRCLES).map((expert, i) => {
            const slot = CIRCLE_SLOTS[i];
            return (
              <div
                key={expert.id}
                style={{ position: 'absolute', top: slot.top, right: slot.right }}
              >
                <Link
                  href={`/expert/${expert.id}`}
                  aria-label={`${expert.user.name} ${expert.user.surname ?? ''}`}
                >
                  <UserImage
                    image={expert.user.avatarUrl ?? ''}
                    width={sizes[slot.size]}
                    onMouseEnter={onMouseEnter(expert, slot.tooltipAbove)}
                    onMouseLeave={() => setCardShown(false)}
                    style={{ cursor: 'pointer' }}
                  />
                </Link>
              </div>
            );
          })}

          {hovered && (
            <LittleCard
              expert={hovered.expert}
              top={hovered.top}
              left={hovered.left}
              shown={cardShown}
            />
          )}
          <MainTabs />
        </div>
      )}

      <div className={styles.contSection}>
        {theme.isDesktop && <div style={{ width: '100%', height: '105px' }} />}
        {bestExperts.length > 0 && (
          <InfoBlock title={t('main.top.title')} linkTo="/experts" linkText={t('links.allExperts')}>
            {bestExperts.map((expert) => (
              <Col key={expert.id} xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
                <Link href={`/expert/${expert.id}`} style={{ color: 'black' }}>
                  <UserCard
                    username={expert.user.name}
                    surname={expert.user.surname ?? ''}
                    stars={expert.starsAvg}
                    reviews={expert.reviewsCount}
                    cups={expert.rating}
                    spec={specOf(expert)}
                    image={expert.user.avatarUrl ?? ''}
                    cityName={expert.user.city?.name ?? ''}
                  />
                </Link>
              </Col>
            ))}
          </InfoBlock>
        )}
      </div>
    </>
  );
}

/** The small card that follows the pointer over a hero avatar. */
function LittleCard({ expert, top, left, shown }) {
  return (
    <div
      className={shown ? `${styles.littleCard} ${styles.littleCardShown}` : styles.littleCard}
      style={{ left: `${left}px`, top: `${top}px` }}
      aria-hidden={!shown}
    >
      <div className={styles.gridElement} style={{ fontSize: '18px', fontWeight: '600' }}>
        {expert.user.name} {expert.user.surname ?? ''}
      </div>
      <div
        className={styles.gridElement}
        style={{ fontSize: '16px', fontWeight: '250', marginTop: '10px', marginBottom: '10px' }}
      >
        {specOf(expert)}
      </div>
      <div style={{ width: '100%' }}>
        <RatingBar stars={expert.starsAvg} cups={expert.rating} reviews={expert.reviewsCount} />
      </div>
    </div>
  );
}

/**
 * The search box that overlaps the hero: "looking for an expert" (first,
 * and open by default: most visitors are customers) / "looking for a task".
 */
function MainTabs() {
  const theme = useThemeContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const lookingForTask = activeTab === 2;

  /** Opens the task or expert list with the chosen filters in the URL, where SideFilter reads them. */
  const onFinish = ({ city, spec, budget, branch }) => {
    const query = {};
    if (city) query.city = city;
    if (spec) query.specialization = spec;
    if (lookingForTask && budget) {
      query.budgetmin = budget.inp1;
      query.budgetmax = budget.inp2;
    }
    if (!lookingForTask && branch) query.branch = branch;
    router.push({ pathname: lookingForTask ? '/tasks' : '/experts', query });
  };

  const tabClass = (tab, base) => (activeTab === tab ? `${base} ${styles.activeTab}` : base);

  return (
    <div className={styles.tabBox} role="tablist" aria-label={i18n.t('pages.index.chtoVyIschete')}>
      {[
        {
          tab: 1,
          cls: styles.tabCls1,
          wide: i18n.t('pages.index.ischuEksperta'),
          narrow: i18n.t('pages.index.eksperty'),
        },
        {
          tab: 2,
          cls: styles.tabCls2,
          wide: i18n.t('pages.index.ischuZadachu'),
          narrow: i18n.t('pages.index.zadachi'),
        },
      ].map(({ tab, cls, wide, narrow }) => (
        <div
          key={tab}
          role="tab"
          tabIndex={0}
          aria-selected={activeTab === tab}
          className={tabClass(tab, cls)}
          onClick={() => setActiveTab(tab)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setActiveTab(tab);
            }
          }}
        >
          <span className={tabClass(tab, styles.tabText)}>{theme?.isDesktop ? wide : narrow}</span>
        </div>
      ))}
      <Form
        name="tabcontent"
        layout="vertical"
        style={{ width: '100%' }}
        onFinish={onFinish}
        initialValues={{ budget: { inp1: 1000, inp2: 500000 } }}
      >
        <Row
          gutter={[
            { xs: 10, sm: 10, md: 15, lg: 20, xl: 30, xxl: 40 },
            { xs: 10, sm: 10, md: 15, lg: 20, xl: 30, xxl: 40 },
          ]}
          className={styles.tabContentBox}
          style={{
            // The panel is a box of its own, not a row inside a padded container.
            marginInline: 0,
            paddingBottom: lookingForTask ? '35px' : '50px',
          }}
        >
          <TabCol>
            <Form.Item
              name="city"
              label={i18n.t('pages.index.gorod')}
              style={{ marginBottom: '0px', width: '100%' }}
            >
              <CityInput />
            </Form.Item>
          </TabCol>
          <TabCol>
            <Form.Item
              name="spec"
              label={i18n.t('pages.index.spetsializatsiya')}
              style={{ marginBottom: '0px', width: '100%' }}
            >
              <CityInput marker="spec" />
            </Form.Item>
          </TabCol>
          <TabCol>
            {lookingForTask ? (
              <Form.Item
                name="budget"
                label={i18n.t('pages.index.byudzhet')}
                style={{ marginBottom: '0px' }}
              >
                <InputSlider maxValues={[1000, 500000]} step={1000} />
              </Form.Item>
            ) : (
              <Form.Item
                name="branch"
                label={i18n.t('pages.index.otraslPrava')}
                style={{ marginBottom: '25px', width: '100%' }}
              >
                <CityInput marker="catg" />
              </Form.Item>
            )}
          </TabCol>
          <TabCol>
            <Button
              size={theme?.size}
              style={{ width: '100%', marginTop: '33px' }}
              type="primary"
              htmlType="submit"
            >
              {lookingForTask
                ? i18n.t('pages.index.naytiZadachu')
                : i18n.t('pages.index.naytiIspolnitelya')}
            </Button>
          </TabCol>
        </Row>
      </Form>
    </div>
  );
}

function TabCol({ children }) {
  return (
    <Col xs={24} sm={12} md={6} lg={6} xl={6}>
      <div className={styles.inTabBox}>{children}</div>
    </Col>
  );
}

function InfoBlock({ title, linkTo, linkText, children }) {
  const theme = useThemeContext();
  const headerStyle = theme?.isDesktop
    ? { paddingLeft: '0px', paddingRight: '0px', marginTop: '70px', fontSize: '44px' }
    : { paddingLeft: '10px', paddingRight: '10px', marginTop: '50px', fontSize: '32px' };

  return (
    <>
      <div className={styles.headerContainer} style={headerStyle}>
        <div className={styles.headText}>{title}</div>
        {theme?.isDesktop && (
          <Link href={linkTo} className={styles.headLink}>
            {linkText}
          </Link>
        )}
      </div>
      <PageContainer>
        {children}
        {!theme?.isDesktop && (
          <Link
            href={linkTo}
            className={styles.headLink}
            style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '20px' }}
          >
            {linkText}
          </Link>
        )}
      </PageContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  const http = createApi(context);
  const [topExperts, seo] = await Promise.all([
    // The page still renders its static parts if the API is unreachable.
    expertsApi.top(Math.max(CIRCLES, BEST_COUNT), http).catch(() => []),
    pageSeo('/', http),
  ]);
  return { props: { topExperts, seo } };
}
