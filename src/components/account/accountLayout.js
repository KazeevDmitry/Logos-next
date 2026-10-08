import { Col, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useThemeContext } from '../../context/themeContext';
import { useUserContext } from '../../context/userContext';
import PageContainer from '../layouts/pageContainer';
import PageHeader from '../layouts/pageHeader';

/** Sections of the personal account: `expert` ones for experts only, `customer` ones for the rest. */
const MENU = [
  { key: '/personalaccount', label: 'Обзор' },
  { key: '/personalaccount/profile', label: 'Личные данные' },
  { key: '/personalaccount/expert', label: 'Профиль эксперта', expert: true },
  { key: '/personalaccount/services', label: 'Услуги и цены', expert: true },
  { key: '/personalaccount/education', label: 'Образование', expert: true },
  { key: '/personalaccount/expert', label: 'Стать экспертом', customer: true },
  { key: '/mytasks', label: 'Мои задачи' },
  { key: '/myresponses', label: 'Мои отклики', expert: true },
];

export const accountBlock = { background: 'white', borderRadius: '10px' };

/** The frame of every account page: title, the section menu and the page's content. */
export default function AccountLayout({ title, children }) {
  const theme = useThemeContext();
  const router = useRouter();
  const { isExpert } = useUserContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;
  const items = MENU.filter((item) => (isExpert ? !item.customer : !item.expert)).map(({ key, label }) => ({ key, label }));

  return (
    <>
      <PageHeader title={title} />
      <PageContainer>
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          <nav aria-label="Разделы личного кабинета" style={{ ...accountBlock, padding: '10px 0', overflow: 'hidden' }}>
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
