import 'antd/dist/reset.css';
import '../styles/globals.css';
import '../utils/i18n-init';
import '../utils/dayjs';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ru from 'antd/locale/ru_RU';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainLayout from '../src/components/layouts/mainLayout';
import Seo, { SeoOverride } from '../src/components/seo';
import { NoteProvider } from '../src/context/notificationContext';
import { SocketProvider } from '../src/context/socketContext';
import { ThemeProvider } from '../src/context/themeContext';
import { UserProvider } from '../src/context/userContext';
import theme from '../src/theme';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // The thin progress line under the header while the next page loads.
  const [loading, setLoading] = useState(false);
  // One client for the app's lifetime; a new one per render would drop the cache.
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const start = () => setLoading(true);
    const stop = () => setLoading(false);
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', stop);
    router.events.on('routeChangeError', stop);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', stop);
      router.events.off('routeChangeError', stop);
    };
  }, [router.events]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ru} theme={theme}>
        <ThemeProvider>
          <UserProvider>
            <SocketProvider>
              <NoteProvider>
                {/* What an administrator set for this page; pages pass it as the `seo` prop. */}
                <SeoOverride.Provider value={pageProps.seo ?? null}>
                  <Seo />
                  <MainLayout loading={loading}>
                    <Component {...pageProps} />
                  </MainLayout>
                </SeoOverride.Provider>
              </NoteProvider>
            </SocketProvider>
          </UserProvider>
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
