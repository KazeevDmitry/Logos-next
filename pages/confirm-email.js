import { Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '../lib/api';
import AuthPage from '../src/components/authPage/authPage';
import { useUserContext } from '../src/context/userContext';

/** Opened from the e-mailed link: /confirm-email?token=… */
export default function ConfirmEmail() {
  const router = useRouter();
  const { refreshUser } = useUserContext();
  // 'checking' | 'done' | 'failed'
  const [state, setState] = useState('checking');
  const { token } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (!token) {
      setState('failed');
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

  if (state === 'checking') {
    return (
      <AuthPage title="Подтверждение e-mail">
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </AuthPage>
    );
  }
  if (state === 'done') {
    return (
      <AuthPage title="E-mail подтверждён">
        <p>Спасибо! Адрес электронной почты подтверждён.</p>
        <Link href="/">На главную</Link>
      </AuthPage>
    );
  }
  return (
    <AuthPage title="Ссылка недействительна">
      <p>Ссылка уже использована или устарела. Новую можно запросить в личном кабинете.</p>
      <Link href="/">На главную</Link>
    </AuthPage>
  );
}
