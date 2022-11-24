
import AppHeader from '../app-header/app-header';
import Footer from '../footer/footer';

import styles from "./mainLayout.module.less";
import {useThemeContext} from '../../context/themeContext';

import { Layout, } from 'antd';

const { Content } = Layout;

export default function MainLayout({ children }) {

  const theme = useThemeContext();

  return (
    <>
    <Layout>
      <AppHeader />
      <Content className={styles.appContainer} style={{paddingLeft: theme?.appContainerPadding, paddingRight: theme?.appContainerPadding}}>
        {children}  
      </Content>
      
      <Footer />
    </Layout>
      
    </>
  )
}