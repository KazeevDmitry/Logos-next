import '../styles/globals.css'

import "../styles/antdVariables.less";
import { ThemeProvider } from '../src/context/themeContext';
import {UserProvider} from '../src/context/userContext';
import '../utils/i18n-init';
import { useTranslation } from "react-i18next";

import { ConfigProvider} from 'antd';
import ru from 'antd/lib/locale/ru_RU';
import en from 'antd/lib/locale/en_US';


import moment from 'moment';
import 'moment/locale/ru';
import MainLayout from '../src/components/layouts/mainLayout';

import { SessionProvider } from 'next-auth/react';

moment.locale('ru')


function MyApp({ Component, pageProps }) {

  const { t, i18n } = useTranslation();
  const changeLanguage = (language) => {
      i18n.changeLanguage(language);
      
      moment.locale(i18n.language);
  };

  const antdLocales = (lang = 'ru') => {
      const covab = { ru, en };
      return covab[lang];
    }



  return (  
          <ThemeProvider>
           <UserProvider>
            <SessionProvider session={pageProps.session}>
              <ConfigProvider locale={antdLocales(i18n.language)}>
                <MainLayout>
                  <Component {...pageProps} /> 
                </MainLayout>
              </ConfigProvider>  
            /</SessionProvider>  
            </UserProvider>
          </ThemeProvider>    
            )
}

export default MyApp
