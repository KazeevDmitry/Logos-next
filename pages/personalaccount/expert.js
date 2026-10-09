import { Alert, Button, Form, Input, InputNumber, Select, Spin } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withAuth } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { useMyExpert } from '../../src/components/account/completeness';
import { FormError } from '../../src/components/authPage/authPage';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';
import { useBranches, useSpecializations } from '../../src/hooks/useReference';

const toOptions = (items) => items.map((item) => ({ value: item.id, label: item.name }));

/**
 * The professional profile. For a customer the same form is the way to
 * become an expert: saving it creates the profile and changes the role.
 */
function ExpertProfilePage() {
  const theme = useThemeContext();
  const queryClient = useQueryClient();
  const { isExpert, refreshUser } = useUserContext();
  const { successNotification } = useNotifyContext();
  const { data: expert, isLoading } = useMyExpert();
  const branches = useBranches();
  const specializations = useSpecializations();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (values) => {
    setBusy(true);
    setError('');
    const body = {
      description: values.description?.trim() || null,
      experience: values.experience ?? null,
      branchIds: values.branchIds ?? [],
      specializationIds: values.specializationIds ?? [],
    };
    try {
      if (isExpert) {
        queryClient.setQueryData(['my-expert'], await experts.update(body));
        successNotification('Профиль сохранён', '');
      } else {
        queryClient.setQueryData(['my-expert'], await experts.become(body));
        // The role changed: the menu and the pages open to experts depend on it.
        await refreshUser();
        successNotification(
          'Вы стали экспертом',
          'Добавьте услуги и образование — так заказчикам проще вас выбрать.',
        );
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (isExpert && isLoading) {
    return (
      <AccountLayout title="Профиль эксперта">
        <Spin />
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title={isExpert ? 'Профиль эксперта' : 'Стать экспертом'}>
      {isExpert && expert ? (
        <p style={{ color: '#5E6674' }}>
          Эти сведения видят заказчики в <Link href={`/expert/${expert.id}`}>вашем профиле</Link>.
        </p>
      ) : (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: '24px', maxWidth: '720px' }}
          message="Эксперты откликаются на задачи и отвечают на вопросы"
          description="Расскажите о своей практике. Вы сможете и дальше создавать задачи как заказчик."
        />
      )}
      <Form
        layout="vertical"
        style={{ maxWidth: '720px' }}
        onFinish={save}
        initialValues={{
          description: expert?.description ?? '',
          experience: expert?.experience ?? undefined,
          specializationIds: expert?.specializations.map((item) => item.id) ?? [],
          branchIds: expert?.branches.map((item) => item.id) ?? [],
        }}
      >
        <Form.Item
          name="specializationIds"
          label="Специализация"
          rules={[
            {
              required: true,
              type: 'array',
              min: 1,
              message: 'Выберите хотя бы одну специализацию',
            },
          ]}
        >
          <Select
            mode="multiple"
            size={theme?.size}
            optionFilterProp="label"
            options={toOptions(specializations)}
            placeholder="Например: адвокат, юрист"
          />
        </Form.Item>
        <Form.Item
          name="branchIds"
          label="Отрасли права"
          rules={[
            { required: true, type: 'array', min: 1, message: 'Выберите хотя бы одну отрасль' },
          ]}
        >
          <Select
            mode="multiple"
            size={theme?.size}
            optionFilterProp="label"
            options={toOptions(branches)}
            placeholder="В каких отраслях вы практикуете"
          />
        </Form.Item>
        <Form.Item name="experience" label="Опыт работы, лет">
          <InputNumber
            size={theme?.size}
            min={0}
            max={70}
            precision={0}
            style={{ width: '160px' }}
          />
        </Form.Item>
        <Form.Item name="description" label="О себе">
          <Input.TextArea
            rows={8}
            maxLength={5000}
            showCount
            placeholder="Чем вы занимаетесь, с какими делами работаете, чем можете быть полезны"
          />
        </Form.Item>
        <FormError>{error}</FormError>
        <Button
          type="primary"
          htmlType="submit"
          size={theme?.size}
          loading={busy}
          style={{ marginTop: '10px' }}
        >
          {isExpert ? 'Сохранить' : 'Стать экспертом'}
        </Button>
      </Form>
    </AccountLayout>
  );
}

export default withAuth(ExpertProfilePage);
