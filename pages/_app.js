import '../styles/globals.css'
import React, { useEffect, useState } from 'react';

import "../styles/antdVariables.less";
import { ThemeProvider } from '../src/context/themeContext';
import {UserProvider} from '../src/context/userContext';
import '../utils/i18n-init';
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/router';
import { ConfigProvider} from 'antd';
import ru from 'antd/lib/locale/ru_RU';
import en from 'antd/lib/locale/en_US';


import moment from 'moment';
import 'moment/locale/ru';
import MainLayout from '../src/components/layouts/mainLayout';
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";

moment.locale('ru')


export default function MyApp({ Component, pageProps }) {

  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const changeLanguage = (language) => {
      i18n.changeLanguage(language);
      
      moment.locale(i18n.language);
  };


  const antdLocales = (lang = 'ru') => {
      const covab = { ru, en };
      return covab[lang];
    }

   // const [queryClient] = useState(() => new QueryClient());

   const queryClient = new QueryClient();

   const router = useRouter();

  useEffect(() => {
    // Обработка начала загрузки
    router.events.on("routeChangeStart", () => {
      setLoading(true);
      
    });

    // Обработка окончания загрузки
    router.events.on("routeChangeComplete", () => {
      setLoading(false);
      
    });
    router.events.on('routeChangeError', () => {
      setLoading(false);
    });
  }, []);

  return (  
    <>

          <ThemeProvider>
           <UserProvider>
           <QueryClientProvider client={queryClient}>
              <ConfigProvider locale={antdLocales(i18n.language)}>
                <MainLayout loading={loading}>
                  <Component {...pageProps} /> 
                </MainLayout>
              </ConfigProvider>  
              </QueryClientProvider>
            </UserProvider>
          </ThemeProvider> 
          </>      

            )
}


