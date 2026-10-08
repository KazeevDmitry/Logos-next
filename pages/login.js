import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage, errorStatus } from '../lib/api/client';
import AuthPage, { emailRules, FormError } from '../src/components/authPage/authPage';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';
import styles from '../styles/auth.module.less';

/** Only same-site paths are followed after login, never an outside address. */
export function safeNext(next) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}

const LOGIN_ERRORS = {
  401: 'Неверный e-mail или пароль',
  403: 'Аккаунт заблокирован. Напишите в поддержку.',
  429: 'Слишком много попыток. Подождите минуту.',
};

export default function Login() {
  const theme = useThemeContext();
  const router = useRouter();
  const { setCurrentUser } = useUserContext();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onFinish = async (values) => {
    setBusy(true);
    setError('');
    try {
      setCurrentUser(await auth.login(values));
      router.replace(safeNext(router.query.next));
    } catch (e) {
      setError(LOGIN_ERRORS[errorStatus(e)] ?? errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <AuthPage title="Вход">
      {router.query.reset && (
        <p style={{ fontSize: '16px' }}>Пароль изменён. Войдите с новым паролем.</p>
      )}
      <Form name="login" layout="vertical" onFinish={onFinish} validateTrigger="onSubmit">
        <Form.Item name="email" rules={emailRules} style={{ marginBottom: '15px' }}>
          <Input size={theme?.size} placeholder="E-mail" autoComplete="email" onChange={() => setError('')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
          style={{ marginBottom: '10px' }}
        >
          <Input.Password
            size={theme?.size}
            placeholder="Пароль"
            autoComplete="current-password"
            onChange={() => setError('')}
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/forgot-password">Забыли пароль?</Link>
        </div>
        <FormError>{error}</FormError>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size={theme?.size}
            loading={busy}
            style={{ width: '100%', marginTop: '24px' }}
          >
            Войти
          </Button>
        </Form.Item>
        <div className={styles.register}>
          <Link href="/register" replace className={styles.registerLink}>
            {'РЕГИСТРАЦИЯ >>'}
          </Link>
        </div>
      </Form>
    </AuthPage>
  );
}
