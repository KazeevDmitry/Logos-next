import { Button, Checkbox, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { auth } from '../lib/api';
import { errorMessage, errorStatus } from '../lib/api/client';
import OAuthButtons from '../src/components/authPage/oauthButtons';
import AuthPage, {
  emailRules,
  FormError,
  passwordRules,
  sameAs,
} from '../src/components/authPage/authPage';
import { useNotifyContext } from '../src/context/notificationContext';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';
import styles from '../styles/auth.module.scss';

import i18n from '../utils/i18n-init';
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
      successNotification(
        i18n.t('pages.register.vyZaregistrirovany'),
        i18n.t('pages.register.myOtpraviliPismoSoSsylkoy'),
      );
      router.replace('/');
    } catch (e) {
      setError(
        errorStatus(e) === 409 ? i18n.t('pages.register.polzovatelSTakimEMail') : errorMessage(e),
      );
      setBusy(false);
    }
  };

  const item = { style: { marginBottom: '15px' } };

  return (
    <AuthPage title={i18n.t('pages.register.registratsiya')}>
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        validateTrigger="onSubmit"
        scrollToFirstError
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: i18n.t('pages.register.vvediteVasheImya'),
            },
          ]}
          {...item}
        >
          <Input
            size={theme?.size}
            placeholder={i18n.t('pages.register.imya')}
            autoComplete="given-name"
            maxLength={60}
          />
        </Form.Item>
        <Form.Item name="surname" {...item}>
          <Input
            size={theme?.size}
            placeholder={i18n.t('pages.register.familiya')}
            autoComplete="family-name"
            maxLength={60}
          />
        </Form.Item>
        <Form.Item name="email" rules={emailRules} {...item}>
          <Input
            size={theme?.size}
            placeholder="E-mail"
            autoComplete="email"
            onChange={() => setError('')}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={passwordRules}
          validateFirst
          extra={i18n.t('pages.register.neKoroche8SimvolovS')}
          {...item}
        >
          <Input.Password
            size={theme?.size}
            placeholder={i18n.t('pages.register.parol')}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: i18n.t('pages.register.povtoriteParol') },
            sameAs('password'),
          ]}
          validateFirst
          {...item}
        >
          <Input.Password
            size={theme?.size}
            placeholder={i18n.t('pages.register.povtoriteParol')}
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, checked) =>
                checked
                  ? Promise.resolve()
                  : Promise.reject(new Error(i18n.t('pages.register.primiteUsloviyaSoglasheniya'))),
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Checkbox>
            {i18n.t('pages.register.prinimayuUsloviya')}{' '}
            {/* Opens beside the form, so what has been typed is not lost. */}
            <Link href="/agreement" target="_blank" rel="noopener">
              {i18n.t('pages.register.polzovatelskogoSoglasheniya')}
            </Link>
          </Checkbox>
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
            {i18n.t('pages.register.zaregistrirovatsya')}
          </Button>
        </Form.Item>
        <OAuthButtons />
        <div className={styles.register}>
          {i18n.t('pages.register.uzheEstAkkaunt')}{' '}
          <Link href="/login" replace className={styles.registerLink}>
            {i18n.t('pages.register.voyti')}
          </Link>
        </div>
      </Form>
    </AuthPage>
  );
}
