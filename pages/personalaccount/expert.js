import { Alert, Button, Form, Input, InputNumber, Select, Spin } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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

import i18n from '../../utils/i18n-init';
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
        successNotification(i18n.t('pages.personalaccountExpert.profilSohranen'), '');
      } else {
        queryClient.setQueryData(['my-expert'], await experts.become(body));
        // The role changed: the menu and the pages open to experts depend on it.
        await refreshUser();
        successNotification(
          i18n.t('pages.personalaccountExpert.vyStaliEkspertom'),
          i18n.t('pages.personalaccountExpert.dobavteUslugiIObrazovanieTak'),
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
      <AccountLayout title={i18n.t('pages.personalaccountExpert.profilEksperta')}>
        <Spin />
      </AccountLayout>
    );
  }

  return (
    <AccountLayout
      title={
        isExpert
          ? i18n.t('pages.personalaccountExpert.profilEksperta')
          : i18n.t('pages.personalaccountExpert.statEkspertom')
      }
    >
      {isExpert && expert ? (
        <p style={{ color: '#5E6674' }}>
          {i18n.t('pages.personalaccountExpert.etiSvedeniyaVidyatZakazchikiV')}{' '}
          <Link href={`/expert/${expert.id}`}>
            {i18n.t('pages.personalaccountExpert.vashemProfile')}
          </Link>
          .
        </p>
      ) : (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: '24px', maxWidth: '720px' }}
          message={i18n.t('pages.personalaccountExpert.ekspertyOtklikayutsyaNaZadachiI')}
          description={i18n.t('pages.personalaccountExpert.rasskazhiteOSvoeyPraktikeVy')}
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
          label={i18n.t('pages.personalaccountExpert.spetsializatsiya')}
          rules={[
            {
              required: true,
              type: 'array',
              min: 1,
              message: i18n.t('pages.personalaccountExpert.vyberiteHotyaByOdnuSpetsializatsiyu'),
            },
          ]}
        >
          <Select
            mode="multiple"
            size={theme?.size}
            optionFilterProp="label"
            options={toOptions(specializations)}
            placeholder={i18n.t('pages.personalaccountExpert.naprimerAdvokatYurist')}
          />
        </Form.Item>
        <Form.Item
          name="branchIds"
          label={i18n.t('pages.personalaccountExpert.otrasliPrava')}
          rules={[
            {
              required: true,
              type: 'array',
              min: 1,
              message: i18n.t('pages.personalaccountExpert.vyberiteHotyaByOdnuOtrasl'),
            },
          ]}
        >
          <Select
            mode="multiple"
            size={theme?.size}
            optionFilterProp="label"
            options={toOptions(branches)}
            placeholder={i18n.t('pages.personalaccountExpert.vKakihOtraslyahVyPraktikuete')}
          />
        </Form.Item>
        <Form.Item name="experience" label={i18n.t('pages.personalaccountExpert.opytRabotyLet')}>
          <InputNumber
            size={theme?.size}
            min={0}
            max={70}
            precision={0}
            style={{ width: '160px' }}
          />
        </Form.Item>
        <Form.Item name="description" label={i18n.t('pages.personalaccountExpert.oSebe')}>
          <Input.TextArea
            rows={8}
            maxLength={5000}
            showCount
            placeholder={i18n.t('pages.personalaccountExpert.chemVyZanimaetesSKakimi')}
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
          {isExpert
            ? i18n.t('pages.personalaccountExpert.sohranit')
            : i18n.t('pages.personalaccountExpert.statEkspertom')}
        </Button>
      </Form>
    </AccountLayout>
  );
}

export default withAuth(ExpertProfilePage);
