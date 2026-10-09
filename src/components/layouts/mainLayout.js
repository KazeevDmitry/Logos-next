import { Layout } from 'antd';
import { useThemeContext } from '../../context/themeContext';
import AppHeader from '../app-header/app-header';
import ErrorBoundary from '../errorBoundary';
import Footer from '../footer/footer';
import styles from './mainLayout.module.less';

const { Content } = Layout;

/** Header, the page, footer. A crash inside the page leaves the header and footer usable. */
export default function MainLayout({ children, loading }) {
  const theme = useThemeContext();

  return (
    <Layout>
      <AppHeader loading={loading} />
      <Content
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
