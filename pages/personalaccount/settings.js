import { Button, Divider, Form, Input, Switch } from 'antd';
import { useState } from 'react';
import { auth, users } from '../../lib/api';
import { errorMessage, errorStatus } from '../../lib/api/client';
import { withAuth } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { FormError, passwordRules, sameAs } from '../../src/components/authPage/authPage';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';

const heading = { fontSize: '20px', fontWeight: 500 };

/** Whether the address is confirmed, with a way to get the letter again. */
function EmailStatus({ user }) {
  const { successNotification, infoNotification } = useNotifyContext();
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    setBusy(true);
    try {
      await auth.resendConfirmation();
      successNotification('Письмо отправлено', `Откройте ссылку из письма на ${user.email}.`);
    } catch (e) {
      infoNotification('Не получилось отправить письмо', errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={heading}>E-mail</h2>
      <p style={{ overflowWrap: 'anywhere' }}>
        {user.email} —{' '}
        {user.emailVerified ? (
          <span style={{ color: '#1FAA78' }}>подтверждён</span>
        ) : (
          <span style={{ color: '#C98A0B' }}>не подтверждён</span>
        )}
      </p>
      {!user.emailVerified && (
        <Button loading={busy} onClick={resend}>
          Отправить письмо ещё раз
        </Button>
      )}
    </>
  );
}

function EmailNotifications({ user }) {
  const { setCurrentUser } = useUserContext();
  const { infoNotification } = useNotifyContext();
  const [busy, setBusy] = useState(false);

  const toggle = async (emailNotifications) => {
    setBusy(true);
    try {
      setCurrentUser(await users.update({ emailNotifications }));
    } catch (e) {
      infoNotification('Не получилось сохранить', errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={heading}>Уведомления</h2>
      <label style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
        <Switch checked={user.emailNotifications} loading={busy} onChange={toggle} />
        <span>Присылать уведомления на e-mail</span>
      </label>
      <p style={{ color: '#5E6674', marginTop: '8px', maxWidth: '560px' }}>
        Об откликах, выборе исполнителя, оплате и новых сообщениях. На сайте уведомления показываются всегда; письма о
        входе и пароле приходят в любом случае.
      </p>
    </>
  );
}

function ChangePassword() {
  const theme = useThemeContext();
  const { successNotification } = useNotifyContext();
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async ({ currentPassword, newPassword }) => {
    setBusy(true);
    setError('');
    try {
      await users.changePassword({ currentPassword, newPassword });
      form.resetFields();
      successNotification('Пароль изменён', 'На других устройствах нужно будет войти заново.');
    } catch (e) {
      // 400 here means the current password did not match.
      setError(errorStatus(e) === 400 ? 'Текущий пароль указан неверно' : errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={heading}>Пароль</h2>
      <Form form={form} layout="vertical" style={{ maxWidth: '420px' }} onFinish={save}>
        <Form.Item
          name="currentPassword"
          label="Текущий пароль"
          rules={[{ required: true, message: 'Введите текущий пароль' }]}
        >
          <Input.Password size={theme?.size} maxLength={128} autoComplete="current-password" />
        </Form.Item>
        <Form.Item name="newPassword" label="Новый пароль" rules={passwordRules} extra="Не короче 8 символов, с буквой и цифрой">
          <Input.Password size={theme?.size} maxLength={128} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="repeat"
          label="Новый пароль ещё раз"
          dependencies={['newPassword']}
          rules={[{ required: true, message: 'Повторите пароль' }, sameAs('newPassword')]}
        >
          <Input.Password size={theme?.size} maxLength={128} autoComplete="new-password" />
        </Form.Item>
        <FormError>{error}</FormError>
        <Button type="primary" htmlType="submit" size={theme?.size} loading={busy} style={{ marginTop: '10px' }}>
          Изменить пароль
        </Button>
      </Form>
    </>
  );
}

function SettingsPage({ user }) {
  return (
    <AccountLayout title="Настройки">
      <EmailStatus user={user} />
      <Divider />
      <EmailNotifications user={user} />
      <Divider />
      <ChangePassword />
    </AccountLayout>
  );
}

export default withAuth(SettingsPage);
