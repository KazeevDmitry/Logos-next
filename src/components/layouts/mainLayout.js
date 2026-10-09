import { Layout } from 'antd';
import { useThemeContext } from '../../context/themeContext';
import AppHeader from '../app-header/app-header';
import ErrorBoundary from '../errorBoundary';
import Footer from '../footer/footer';
import styles from './mainLayout.module.scss';

import i18n from '../../../utils/i18n-init';
const { Content } = Layout;

/** Header, the page, footer. A crash inside the page leaves the header and footer usable. */
export default function MainLayout({ children, loading }) {
  const theme = useThemeContext();

  return (
    <Layout>
      <a href="#content" className="skip-link">
        {i18n.t('ui.mainLayout.pereytiKSoderzhimomu')}
      </a>
      <AppHeader loading={loading} />
      <Content
        id="content"
        className={styles.appContainer}
        style={{
          paddingLeft: theme?.appContainerPadding,
          paddingRight: theme?.appContainerPadding,
          // Keeps the footer at the bottom of a short page.
          minHeight: 'calc(100vh - 130px)',
        }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </Content>
      <Footer />
    </Layout>
  );
}
