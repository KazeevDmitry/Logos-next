import React, {useEffect, useState} from 'react';
import AppHeader from '../app-header/app-header';
import Footer from '../footer/footer';

import styles from "./mainLayout.module.less";
import {useThemeContext} from '../../context/themeContext';

import { Layout, } from 'antd';

const { Content } = Layout;

export default function MainLayout({ children, loading }) {


  const [sectionMinHeigth, setSectionMinHeigth] = useState(``); 

  const theme = useThemeContext();

  const resizeHandler = () => {

    setSectionMinHeigth(`${document.documentElement.clientHeight-130}px`);
  }

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);


  return (
    <>
    <Layout>
      <AppHeader loading={loading}/>
      <Content className={styles.appContainer} style={{paddingLeft: theme?.appContainerPadding, paddingRight: theme?.appContainerPadding, minHeight: sectionMinHeigth}}>
        {children}  
      </Content>
      
      <Footer />
    </Layout>
      
    </>
  )
}