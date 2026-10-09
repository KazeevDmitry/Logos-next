import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio, Upload } from 'antd';
import { useState } from 'react';
import { users } from '../../lib/api';
import { errorMessage, errorStatus } from '../../lib/api/client';
import { withAuth } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { FormError } from '../../src/components/authPage/authPage';
import { CitySelect } from '../../src/components/cityInput/cityInput';
import UserImage from '../../src/components/userImage/userImage';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';

import i18n from '../../utils/i18n-init';
const AVATAR_ERRORS = {
  413: i18n.t('pages.personalaccountProfile.faylSlishkomBolshoyMaksimum5'),
  415: i18n.t('pages.personalaccountProfile.podhodyatFotografiiJpgPngI'),
};

/** The profile photo with buttons to replace and remove it. */
function AvatarEditor({ user }) {
  const { setCurrentUser } = useUserContext();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const change = async (request) => {
    setBusy(true);
    setError('');
    try {
      setCurrentUser(await request());
    } catch (e) {
      setError(AVATAR_ERRORS[errorStatus(e)] ?? errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
      }}
    >
      <UserImage image={user.avatarUrl ?? ''} width={110} />
      <div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Upload
            accept="image/jpeg,image/png,image/webp"
            showUploadList={false}
            disabled={busy}
            beforeUpload={(file) => {
              change(() => users.setAvatar(file));
              // Sent above; stop antd from uploading the file itself.
              return Upload.LIST_IGNORE;
            }}
          >
            <Button icon={<UploadOutlined />} loading={busy}>
              {user.avatarUrl
                ? i18n.t('pages.personalaccountProfile.zamenitFoto')
                : i18n.t('pages.personalaccountProfile.zagruzitFoto')}
            </Button>
          </Upload>
          {user.avatarUrl && (
            <Button
              icon={<DeleteOutlined />}
              disabled={busy}
              onClick={() => change(() => users.removeAvatar())}
            >
              {i18n.t('pages.personalaccountProfile.udalit')}
            </Button>
          )}
        </div>
        <div style={{ color: '#5E6674', marginTop: '8px' }}>
          {i18n.t('pages.personalaccountProfile.jpgPngIliWebpDo')}
        </div>
        {error && (
          <div role="alert" style={{ color: '#F44336', marginTop: '6px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

/** "8 (916) 123-45-67" and the like → "+79161234567". */
function normalisePhone(text) {
  const digits = (text ?? '').replace(/\D/g, '');
  if (digits === '') {
    return null;
  }
  // A Russian number typed the domestic way: 8XXXXXXXXXX.
  return `+${digits.length === 11 && digits.startsWith('8') ? `7${digits.slice(1)}` : digits}`;
}

function ProfilePage({ user }) {
  const theme = useThemeContext();
  const { setCurrentUser } = useUserContext();
  const { successNotification } = useNotifyContext();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (values) => {
    setBusy(true);
    setError('');
    try {
      const updated = await users.update({
        name: values.name.trim(),
        surname: values.surname?.trim() || null,
        phone: normalisePhone(values.phone),
        gender: values.gender ?? null,
        cityId: values.cityId ?? null,
      });
      setCurrentUser(updated);
      successNotification(i18n.t('pages.personalaccountProfile.izmeneniyaSohraneny'), '');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountLayout title={i18n.t('pages.personalaccountProfile.lichnyeDannye')}>
      <AvatarEditor user={user} />
      <Form
        layout="vertical"
        style={{ maxWidth: '560px' }}
        onFinish={save}
        initialValues={{
          name: user.name,
          surname: user.surname ?? '',
          phone: user.phone ?? '',
          gender: user.gender ?? undefined,
          cityId: user.city?.id,
        }}
      >
        <Form.Item
          name="name"
          label={i18n.t('pages.personalaccountProfile.imya')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: i18n.t('pages.personalaccountProfile.ukazhiteImya'),
            },
          ]}
        >
          <Input size={theme?.size} maxLength={60} autoComplete="given-name" />
        </Form.Item>
        <Form.Item name="surname" label={i18n.t('pages.personalaccountProfile.familiya')}>
          <Input size={theme?.size} maxLength={60} autoComplete="family-name" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={i18n.t('pages.personalaccountProfile.telefon')}
          extra={i18n.t('pages.personalaccountProfile.vMezhdunarodnomFormateNaprimer7')}
          rules={[
            {
              validator: (_, value) =>
                !value || /^\+[1-9]\d{9,14}$/.test(normalisePhone(value) ?? '')
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        i18n.t('pages.personalaccountProfile.proverteNomerNuzhenKodStrany'),
                      ),
                    ),
            },
          ]}
        >
          <Input
            size={theme?.size}
            maxLength={24}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7"
          />
        </Form.Item>
        <Form.Item name="cityId" label={i18n.t('pages.personalaccountProfile.gorod')}>
          <CitySelect />
        </Form.Item>
        <Form.Item name="gender" label={i18n.t('pages.personalaccountProfile.pol')}>
          <Radio.Group>
            <Radio value="MALE">{i18n.t('pages.personalaccountProfile.muzhskoy')}</Radio>
            <Radio value="FEMALE">{i18n.t('pages.personalaccountProfile.zhenskiy')}</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="E-mail"
          extra={i18n.t('pages.personalaccountProfile.adresIspolzuetsyaDlyaVhodaIzmenit')}
        >
          <Input size={theme?.size} value={user.email} disabled />
        </Form.Item>
        <FormError>{error}</FormError>
        <Button type="primary" htmlType="submit" size={theme?.size} loading={busy}>
          {i18n.t('pages.personalaccountProfile.sohranit')}
        </Button>
      </Form>
    </AccountLayout>
  );
}

export default withAuth(ProfilePage);
