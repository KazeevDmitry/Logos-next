import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage, errorStatus } from '../lib/api/client';
import AuthPage, { emailRules, FormError, passwordRules, sameAs } from '../src/components/authPage/authPage';
import { useNotifyContext } from '../src/context/notificationContext';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';
import styles from '../styles/auth.module.less';

export default function Register() {
  const theme = useThemeContext();
  const router = useRouter();
  const { setCurrentUser } = useUserContext();
  const { successNotification } = useNotifyContext();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onFinish = async ({ name, surname, email, password }) => {
    setBusy(true);
    setError('');
    try {
      setCurrentUser(await auth.register({ name, surname: surname || undefined, email, password }));
      successNotification('Вы зарегистрированы', 'Мы отправили письмо со ссылкой для подтверждения e-mail.');
      router.replace('/');
    } catch (e) {
      setError(
        errorStatus(e) === 409 ? 'Пользователь с таким e-mail уже зарегистрирован' : errorMessage(e),
      );
      setBusy(false);
    }
  };

  const item = { style: { marginBottom: '15px' } };

  return (
    <AuthPage title="Регистрация">
      <Form name="register" layout="vertical" onFinish={onFinish} validateTrigger="onSubmit" scrollToFirstError>
        <Form.Item name="name" rules={[{ required: true, whitespace: true, message: 'Введите ваше имя' }]} {...item}>
          <Input size={theme?.size} placeholder="Имя" autoComplete="given-name" maxLength={60} />
        </Form.Item>
        <Form.Item name="surname" {...item}>
          <Input size={theme?.size} placeholder="Фамилия" autoComplete="family-name" maxLength={60} />
        </Form.Item>
        <Form.Item name="email" rules={emailRules} {...item}>
          <Input size={theme?.size} placeholder="E-mail" autoComplete="email" onChange={() => setError('')} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={passwordRules}
          validateFirst
          extra="Не короче 8 символов, с буквой и цифрой"
          {...item}
        >
          <Input.Password size={theme?.size} placeholder="Пароль" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[{ required: true, message: 'Повторите пароль' }, sameAs('password')]}
          validateFirst
          {...item}
        >
          <Input.Password size={theme?.size} placeholder="Повторите пароль" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, checked) =>
                checked ? Promise.resolve() : Promise.reject(new Error('Примите условия соглашения')),
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Checkbox>Принимаю условия пользовательского соглашения</Checkbox>
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
            Зарегистрироваться
          </Button>
        </Form.Item>
        <div className={styles.register}>
          Уже есть аккаунт?{' '}
          <Link href="/login" replace className={styles.registerLink}>
            Войти
          </Link>
        </div>
      </Form>
    </AuthPage>
  );
}
