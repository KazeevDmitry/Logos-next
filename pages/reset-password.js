import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage, errorStatus } from '../lib/api/client';
import AuthPage, { FormError, passwordRules, sameAs } from '../src/components/authPage/authPage';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';

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
          ? 'Ссылка недействительна или устарела. Запросите новую.'
          : errorMessage(e),
      );
      setBusy(false);
    }
  };

  if (router.isReady && !token) {
    return (
      <AuthPage title="Ссылка недействительна">
        <p>В ссылке нет кода восстановления.</p>
        <Link href="/forgot-password">Запросить новую ссылку</Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage title="Новый пароль">
      <Form name="reset" layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
        <Form.Item
          name="password"
          rules={passwordRules}
          validateFirst
          extra="Не короче 8 символов, с буквой и цифрой"
          style={{ marginBottom: '15px' }}
        >
          <Input.Password size={theme?.size} placeholder="Новый пароль" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[{ required: true, message: 'Повторите пароль' }, sameAs('password')]}
          validateFirst
          style={{ marginBottom: 0 }}
        >
          <Input.Password size={theme?.size} placeholder="Повторите пароль" autoComplete="new-password" />
        </Form.Item>
        <FormError>{error}</FormError>
        {error && <Link href="/forgot-password">Запросить новую ссылку</Link>}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size={theme?.size}
            loading={busy}
            style={{ width: '100%', marginTop: '24px' }}
          >
            Сохранить пароль
          </Button>
        </Form.Item>
      </Form>
    </AuthPage>
  );
}
