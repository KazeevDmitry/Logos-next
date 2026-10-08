import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Spin } from 'antd';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withRole } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { useMyExpert } from '../../src/components/account/completeness';
import { FormError } from '../../src/components/authPage/authPage';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';

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
      successNotification('Услуги сохранены', '');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountLayout title="Услуги и цены">
      {isLoading || !expert ? (
        <Spin />
      ) : (
        <Form
          onFinish={save}
          style={{ maxWidth: '760px' }}
          initialValues={{ services: expert.services.map(({ title, price }) => ({ title, price })) }}
        >
          <p style={{ color: '#5E6674' }}>
            Что вы делаете и сколько это стоит. Список показывается в вашем профиле в этом порядке.
          </p>
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div key={key} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <Form.Item
                      name={[name, 'title']}
                      style={{ flex: 1, minWidth: 0 }}
                      rules={[{ required: true, whitespace: true, message: 'Назовите услугу' }]}
                    >
                      <Input
                        size={theme?.size}
                        maxLength={200}
                        placeholder="Например: составление искового заявления"
                        aria-label={`Услуга ${index + 1}`}
                      />
                    </Form.Item>
                    <Form.Item name={[name, 'price']} rules={[{ required: true, message: 'Укажите цену' }]}>
                      <InputNumber
                        size={theme?.size}
                        min={0}
                        max={100000000}
                        precision={0}
                        addonAfter="₽"
                        placeholder="Цена"
                        aria-label={`Цена услуги ${index + 1}`}
                        style={{ width: theme.isDesktop ? '180px' : '130px' }}
                      />
                    </Form.Item>
                    <Button
                      size={theme?.size}
                      icon={<DeleteOutlined />}
                      aria-label={`Удалить услугу ${index + 1}`}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
                {fields.length === 0 && <p>Услуг пока нет.</p>}
                {fields.length < MAX_SERVICES && (
                  <Button icon={<PlusOutlined />} onClick={() => add({ title: '', price: undefined })}>
                    Добавить услугу
                  </Button>
                )}
              </>
            )}
          </Form.List>
          <FormError>{error}</FormError>
          <div style={{ marginTop: '24px' }}>
            <Button type="primary" htmlType="submit" size={theme?.size} loading={busy}>
              Сохранить
            </Button>
          </div>
        </Form>
      )}
    </AccountLayout>
  );
}

export default withRole(ServicesPage, 'EXPERT');
