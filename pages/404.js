import { Button, Result } from 'antd';
import Link from 'next/link';
import Seo from '../src/components/seo';

import i18n from '../utils/i18n-init';
export default function NotFoundPage() {
  return (
    <>
      <Seo title={i18n.t('pages.404.stranitsaNeNaydena')} noindex />
      <Result
        style={{ marginTop: '120px' }}
        status="404"
        title={i18n.t('pages.404.stranitsaNeNaydena')}
        subTitle={i18n.t('pages.404.vozmozhnoSsylkaUstarelaIliV')}
        extra={[
          <Link key="home" href="/">
            <Button type="primary">{i18n.t('pages.404.naGlavnuyu')}</Button>
          </Link>,
          <Link key="tasks" href="/tasks">
            <Button>{i18n.t('pages.404.kZadacham')}</Button>
          </Link>,
        ]}
      />
    </>
  );
}
