import { Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../lib/api';
import AuthPage from '../src/components/authPage/authPage';
import { useUserContext } from '../src/context/userContext';

import i18n from '../utils/i18n-init';
/** Opened from the e-mailed link: /confirm-email?token=… */
export default function ConfirmEmail() {
  const router = useRouter();
  const { refreshUser } = useUserContext();
  // 'checking' | 'done' | 'failed'
  const [state, setState] = useState('checking');
  const { token } = router.query;

  useEffect(() => {
    if (!router.isReady || !token) {
      return;
    }
    auth
      .confirmEmail(token)
      .then(() => {
        setState('done');
        refreshUser();
      })
      .catch(() => setState('failed'));
    // The token is single-use: run once per link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, token]);

  // A link without a token cannot be confirmed; no request is made for it.
  const failed = state === 'failed' || (router.isReady && !token);

  if (state === 'checking' && !failed) {
    return (
      <AuthPage title={i18n.t('pages.confirmEmail.podtverzhdenieEMail')}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </AuthPage>
    );
  }
  if (state === 'done') {
    return (
      <AuthPage title={i18n.t('pages.confirmEmail.eMailPodtverzhden')}>
        <p>{i18n.t('pages.confirmEmail.spasiboAdresElektronnoyPochtyPodtverzhden')}</p>
        <Link href="/">{i18n.t('pages.confirmEmail.naGlavnuyu')}</Link>
      </AuthPage>
    );
  }
  return (
    <AuthPage title={i18n.t('pages.confirmEmail.ssylkaNedeystvitelna')}>
      <p>{i18n.t('pages.confirmEmail.ssylkaUzheIspolzovanaIliUstarela')}</p>
      <Link href="/">{i18n.t('pages.confirmEmail.naGlavnuyu')}</Link>
    </AuthPage>
  );
}
