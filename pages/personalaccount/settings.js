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

import i18n from '../../utils/i18n-init';
const heading = { fontSize: '20px', fontWeight: 500 };

/** Whether the address is confirmed, with a way to get the letter again. */
function EmailStatus({ user }) {
  const { successNotification, infoNotification } = useNotifyContext();
  const [busy, setBusy] = useState(false);

  const resend = async () => {
    setBusy(true);
    try {
      await auth.resendConfirmation();
      successNotification(
        i18n.t('pages.personalaccountSettings.pismoOtpravleno'),
        i18n.t('pages.personalaccountSettings.otkroyteSsylkuIzPismaNa', { email: user.email }),
      );
    } catch (e) {
      infoNotification(
        i18n.t('pages.personalaccountSettings.nePoluchilosOtpravitPismo'),
        errorMessage(e),
      );
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
          <span style={{ color: '#1FAA78' }}>
            {i18n.t('pages.personalaccountSettings.podtverzhden')}
          </span>
        ) : (
          <span style={{ color: '#C98A0B' }}>
            {i18n.t('pages.personalaccountSettings.nePodtverzhden')}
          </span>
        )}
      </p>
      {!user.emailVerified && (
        <Button loading={busy} onClick={resend}>
          {i18n.t('pages.personalaccountSettings.otpravitPismoEscheRaz')}
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
      infoNotification(
        i18n.t('pages.personalaccountSettings.nePoluchilosSohranit'),
        errorMessage(e),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={heading}>{i18n.t('pages.personalaccountSettings.uvedomleniya')}</h2>
      <label style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
        <Switch checked={user.emailNotifications} loading={busy} onChange={toggle} />
        <span>{i18n.t('pages.personalaccountSettings.prisylatUvedomleniyaNaEMail')}</span>
      </label>
      <p style={{ color: '#5E6674', marginTop: '8px', maxWidth: '560px' }}>
        {i18n.t('pages.personalaccountSettings.obOtklikahVyboreIspolnitelyaOplate')}
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
      successNotification(
        i18n.t('pages.personalaccountSettings.parolIzmenen'),
        i18n.t('pages.personalaccountSettings.naDrugihUstroystvahNuzhnoBudet'),
      );
    } catch (e) {
      // 400 here means the current password did not match.
      setError(
        errorStatus(e) === 400
          ? i18n.t('pages.personalaccountSettings.tekuschiyParolUkazanNeverno')
          : errorMessage(e),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={heading}>{i18n.t('pages.personalaccountSettings.parol')}</h2>
      <Form form={form} layout="vertical" style={{ maxWidth: '420px' }} onFinish={save}>
        <Form.Item
          name="currentPassword"
          label={i18n.t('pages.personalaccountSettings.tekuschiyParol')}
          rules={[
            {
              required: true,
              message: i18n.t('pages.personalaccountSettings.vvediteTekuschiyParol'),
            },
          ]}
        >
          <Input.Password size={theme?.size} maxLength={128} autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={i18n.t('pages.personalaccountSettings.novyyParol')}
          rules={passwordRules}
          extra={i18n.t('pages.personalaccountSettings.neKoroche8SimvolovS')}
        >
          <Input.Password size={theme?.size} maxLength={128} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="repeat"
          label={i18n.t('pages.personalaccountSettings.novyyParolEscheRaz')}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: i18n.t('pages.personalaccountSettings.povtoriteParol') },
            sameAs('newPassword'),
          ]}
        >
          <Input.Password size={theme?.size} maxLength={128} autoComplete="new-password" />
        </Form.Item>
        <FormError>{error}</FormError>
        <Button
          type="primary"
          htmlType="submit"
          size={theme?.size}
          loading={busy}
          style={{ marginTop: '10px' }}
        >
          {i18n.t('pages.personalaccountSettings.izmenitParol')}
        </Button>
      </Form>
    </>
  );
}

function SettingsPage({ user }) {
  return (
    <AccountLayout title={i18n.t('pages.personalaccountSettings.nastroyki')}>
      <EmailStatus user={user} />
      <Divider />
      <EmailNotifications user={user} />
      <Divider />
      <ChangePassword />
    </AccountLayout>
  );
}

export default withAuth(SettingsPage);
