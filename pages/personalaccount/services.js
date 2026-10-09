import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Spin } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withRole } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { useMyExpert } from '../../src/components/account/completeness';
import { FormError } from '../../src/components/authPage/authPage';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';

import i18n from '../../utils/i18n-init';
const MAX_SERVICES = 50;

/** The expert's price list. The whole list is saved at once, in the order shown. */
function ServicesPage() {
  const theme = useThemeContext();
  const queryClient = useQueryClient();
  const { successNotification } = useNotifyContext();
  const { data: expert, isLoading } = useMyExpert();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async ({ services = [] }) => {
    setBusy(true);
    setError('');
    try {
      const updated = await experts.replaceServices(
        services.map((service) => ({ title: service.title.trim(), price: service.price })),
      );
      queryClient.setQueryData(['my-expert'], updated);
      successNotification(i18n.t('pages.personalaccountServices.uslugiSohraneny'), '');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountLayout title={i18n.t('pages.personalaccountServices.uslugiITseny')}>
      {isLoading || !expert ? (
        <Spin />
      ) : (
        <Form
          onFinish={save}
          style={{ maxWidth: '760px' }}
          initialValues={{
            services: expert.services.map(({ title, price }) => ({ title, price })),
          }}
        >
          <p style={{ color: '#5E6674' }}>
            {i18n.t('pages.personalaccountServices.chtoVyDelaeteISkolko')}
          </p>
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Form.Item
                      name={[name, 'title']}
                      style={{ flex: 1, minWidth: 0 }}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: i18n.t('pages.personalaccountServices.nazoviteUslugu'),
                        },
                      ]}
                    >
                      <Input
                        size={theme?.size}
                        maxLength={200}
                        placeholder={i18n.t(
                          'pages.personalaccountServices.naprimerSostavlenieIskovogoZayavleniya',
                        )}
                        aria-label={i18n.t('pages.personalaccountServices.usluga', {
                          v0: index + 1,
                        })}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'price']}
                      rules={[
                        {
                          required: true,
                          message: i18n.t('pages.personalaccountServices.ukazhiteTsenu'),
                        },
                      ]}
                    >
                      <InputNumber
                        size={theme?.size}
                        min={0}
                        max={100000000}
                        precision={0}
                        addonAfter="₽"
                        placeholder={i18n.t('pages.personalaccountServices.tsena')}
                        aria-label={i18n.t('pages.personalaccountServices.tsenaUslugi', {
                          v0: index + 1,
                        })}
                        style={{ width: theme.isDesktop ? '180px' : '130px' }}
                      />
                    </Form.Item>
                    <Button
                      size={theme?.size}
                      icon={<DeleteOutlined />}
                      aria-label={i18n.t('pages.personalaccountServices.udalitUslugu', {
                        v0: index + 1,
                      })}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
                {fields.length === 0 && (
                  <p>{i18n.t('pages.personalaccountServices.uslugPokaNet')}</p>
                )}
                {fields.length < MAX_SERVICES && (
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => add({ title: '', price: undefined })}
                  >
                    {i18n.t('pages.personalaccountServices.dobavitUslugu')}
                  </Button>
                )}
              </>
            )}
          </Form.List>
          <FormError>{error}</FormError>
          <div style={{ marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" size={theme?.size} loading={busy}>
              {i18n.t('pages.personalaccountServices.sohranit')}
            </Button>
          </div>
        </Form>
      )}
    </AccountLayout>
  );
}

export default withRole(ServicesPage, 'EXPERT');
