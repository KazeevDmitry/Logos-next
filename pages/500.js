import { Button, Result } from 'antd';
import Link from 'next/link';
import Seo from '../src/components/seo';

import i18n from '../utils/i18n-init';
export default function ServerErrorPage() {
  return (
    <>
      <Seo title={i18n.t('pages.500.oshibkaServera')} noindex />
      <Result
        style={{ marginTop: '120px' }}
        status="500"
        title={i18n.t('pages.500.servisVremennoNedostupen')}
        subTitle={i18n.t('pages.500.myUzheRazbiraemsyaPoprobuyteObnovit')}
        extra={
          <Link href="/">
            <Button type="primary">{i18n.t('pages.500.naGlavnuyu')}</Button>
          </Link>
        }
      />
    </>
  );
}
