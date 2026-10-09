import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage, errorStatus } from '../lib/api/client';
import AuthPage, { FormError, passwordRules, sameAs } from '../src/components/authPage/authPage';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';

import i18n from '../utils/i18n-init';
/** Opened from the e-mailed link: /reset-password?token=… */
export default function ResetPassword() {
  const theme = useThemeContext();
  const router = useRouter();
  const { setCurrentUser } = useUserContext();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { token } = router.query;

  const onFinish = async ({ password }) => {
    setBusy(true);
    setError('');
    try {
      await auth.resetPassword(token, password);
      // The API ended every session of this account, including this browser's.
      setCurrentUser(null);
      router.replace('/login?reset=1');
    } catch (e) {
      setError(
        errorStatus(e) === 400
          ? i18n.t('pages.resetPassword.ssylkaNedeystvitelnaIliUstarelaZaprosite')
          : errorMessage(e),
      );
      setBusy(false);
    }
  };

  if (router.isReady && !token) {
    return (
      <AuthPage title={i18n.t('pages.resetPassword.ssylkaNedeystvitelna')}>
        <p>{i18n.t('pages.resetPassword.vSsylkeNetKodaVosstanovleniya')}</p>
        <Link href="/forgot-password">{i18n.t('pages.resetPassword.zaprositNovuyuSsylku')}</Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage title={i18n.t('pages.resetPassword.novyyParol')}>
      <Form name="reset" layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
        <Form.Item
          name="password"
          rules={passwordRules}
          validateFirst
          extra={i18n.t('pages.resetPassword.neKoroche8SimvolovS')}
          style={{ marginBottom: '15px' }}
        >
          <Input.Password
            size={theme?.size}
            placeholder={i18n.t('pages.resetPassword.novyyParol')}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: i18n.t('pages.resetPassword.povtoriteParol') },
            sameAs('password'),
          ]}
          validateFirst
          style={{ marginBottom: 0 }}
        >
          <Input.Password
            size={theme?.size}
            placeholder={i18n.t('pages.resetPassword.povtoriteParol')}
            autoComplete="new-password"
          />
        </Form.Item>
        <FormError>{error}</FormError>
        {error && (
          <Link href="/forgot-password">{i18n.t('pages.resetPassword.zaprositNovuyuSsylku')}</Link>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size={theme?.size}
            loading={busy}
            style={{ width: '100%', marginTop: '24px' }}
          >
            {i18n.t('pages.resetPassword.sohranitParol')}
          </Button>
        </Form.Item>
      </Form>
    </AuthPage>
  );
}
