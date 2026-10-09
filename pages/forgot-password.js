import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage } from '../lib/api/client';
import AuthPage, { emailRules, FormError } from '../src/components/authPage/authPage';
import { useThemeContext } from '../src/context/themeContext';

import i18n from '../utils/i18n-init';
export default function ForgotPassword() {
  const theme = useThemeContext();
  const [sentTo, setSentTo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onFinish = async ({ email }) => {
    setBusy(true);
    setError('');
    try {
      await auth.forgotPassword(email);
      setSentTo(email);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (sentTo) {
    return (
      <AuthPage title={i18n.t('pages.forgotPassword.provertePochtu')}>
        <p>
          {i18n.t('pages.forgotPassword.esliAdres')} <b>{sentTo}</b>{' '}
          {i18n.t('pages.forgotPassword.zaregistrirovanMyOtpraviliNaNego')}
        </p>
        <Link href="/login">{i18n.t('pages.forgotPassword.vernutsyaKoVhodu')}</Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage title={i18n.t('pages.forgotPassword.vosstanovlenieParolya')}>
      <p style={{ fontSize: '16px' }}>{i18n.t('pages.forgotPassword.naVashEMailBudet')}</p>
      <Form name="forgot" layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
        <Form.Item name="email" rules={emailRules} style={{ marginBottom: 0 }}>
          <Input size={theme?.size} placeholder="E-mail" autoComplete="email" />
        </Form.Item>
        <FormError>{error}</FormError>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size={theme?.size}
            loading={busy}
            style={{ width: '100%', marginTop: '24px' }}
          >
            {i18n.t('pages.forgotPassword.otpravitSsylku')}
          </Button>
        </Form.Item>
      </Form>
    </AuthPage>
  );
}
