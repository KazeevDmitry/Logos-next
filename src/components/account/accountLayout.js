import { Col, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../context/themeContext';
import { useUserContext } from '../../context/userContext';
import PageContainer from '../layouts/pageContainer';
import PageHeader from '../layouts/pageHeader';

/**
 * Sections of the personal account: `expert` ones for experts only,
 * `customer` ones for the rest. Labels: locale `account.menu`.
 */
const MENU = [
  { key: '/personalaccount', label: 'overview' },
  { key: '/personalaccount/profile', label: 'profile' },
  { key: '/personalaccount/expert', label: 'expert', expert: true },
  { key: '/personalaccount/services', label: 'services', expert: true },
  { key: '/personalaccount/education', label: 'education', expert: true },
  { key: '/personalaccount/verification', label: 'verification', expert: true },
  { key: '/personalaccount/expert', label: 'becomeExpert', customer: true },
  { key: '/mytasks', label: 'tasks' },
  { key: '/myresponses', label: 'responses', expert: true },
  { key: '/messages', label: 'messages' },
  { key: '/finance', label: 'finance' },
  { key: '/personalaccount/settings', label: 'settings' },
];

export const accountBlock = { background: 'white', borderRadius: '10px' };

/** The frame of every account page: title, the section menu and the page's content. */
export default function AccountLayout({ title, children }) {
  const theme = useThemeContext();
  const router = useRouter();
  const { isExpert } = useUserContext();
  const { t } = useTranslation();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const items = MENU.filter((item) => (isExpert ? !item.customer : !item.expert)).map(({ key, label }) => ({
    key,
    label: t(`account.menu.${label}`),
  }));

  return (
    <>
      <PageHeader title={title} seo={{ noindex: true }} />
      <PageContainer>
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <nav aria-label={t('account.menu.label')} style={{ ...accountBlock, padding: '10px 0', overflow: 'hidden' }}>
            <Menu
              mode={theme.isDesktop ? 'inline' : 'horizontal'}
              selectedKeys={[router.pathname]}
              items={items}
              onClick={({ key }) => router.push(key)}
              style={{ border: 'none' }}
            />
          </nav>
        </Col>
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <div style={{ ...accountBlock, padding: pad }}>{children}</div>
        </Col>
      </PageContainer>
    </>
  );
}
