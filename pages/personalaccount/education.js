import { DeleteOutlined, EditOutlined, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Spin } from 'antd';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withRole } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { FormError } from '../../src/components/authPage/authPage';
import FileUploader from '../../src/components/fileUploader/fileUploader';
import { useNotifyContext } from '../../src/context/notificationContext';

import i18n from '../../utils/i18n-init';
const THIS_YEAR = new Date().getFullYear();

/** Dialog for adding an education entry or editing `education`. */
function EducationModal({ education, open, onClose, onSaved }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (values) => {
    setBusy(true);
    setError('');
    const body = {
      university: values.university.trim(),
      speciality: values.speciality.trim(),
      city: values.city?.trim() || null,
      year: values.year,
      diplomaFileId: values.diploma?.[0]?.id ?? null,
    };
    try {
      await (education ? experts.updateEducation(education.id, body) : experts.addEducation(body));
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      destroyOnClose
      title={
        education
          ? i18n.t('pages.personalaccountEducation.izmenitObrazovanie')
          : i18n.t('pages.personalaccountEducation.dobavitObrazovanie')
      }
      onCancel={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        preserve={false}
        onFinish={save}
        initialValues={{
          university: education?.university ?? '',
          speciality: education?.speciality ?? '',
          city: education?.city ?? '',
          year: education?.year,
          diploma: education?.diploma ? [education.diploma] : [],
        }}
      >
        <Form.Item
          name="university"
          label={i18n.t('pages.personalaccountEducation.uchebnoeZavedenie')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: i18n.t('pages.personalaccountEducation.ukazhiteUchebnoeZavedenie'),
            },
          ]}
        >
          <Input
            maxLength={200}
            placeholder={i18n.t('pages.personalaccountEducation.naprimerMguImMV')}
          />
        </Form.Item>
        <Form.Item
          name="speciality"
          label={i18n.t('pages.personalaccountEducation.spetsialnost')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: i18n.t('pages.personalaccountEducation.ukazhiteSpetsialnost'),
            },
          ]}
        >
          <Input
            maxLength={200}
            placeholder={i18n.t('pages.personalaccountEducation.naprimerYurisprudentsiya')}
          />
        </Form.Item>
        <Form.Item name="city" label={i18n.t('pages.personalaccountEducation.gorod')}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item
          name="year"
          label={i18n.t('pages.personalaccountEducation.godOkonchaniya')}
          rules={[
            {
              required: true,
              message: i18n.t('pages.personalaccountEducation.ukazhiteGodOkonchaniya'),
            },
          ]}
        >
          <InputNumber min={1950} max={THIS_YEAR + 8} precision={0} style={{ width: '140px' }} />
        </Form.Item>
        <Form.Item
          name="diploma"
          label={i18n.t('pages.personalaccountEducation.diplom')}
          extra={i18n.t('pages.personalaccountEducation.skanIliFotoDiplomaEgo')}
        >
          <FileUploader
            max={1}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            label={i18n.t('pages.personalaccountEducation.prikrepitDiplom')}
          />
        </Form.Item>
        <FormError>{error}</FormError>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}
        >
          <Button onClick={onClose}>{i18n.t('pages.personalaccountEducation.otmena')}</Button>
          <Button type="primary" htmlType="submit" loading={busy}>
            {i18n.t('pages.personalaccountEducation.sohranit')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

function EducationPage() {
  const queryClient = useQueryClient();
  const { successNotification, infoNotification } = useNotifyContext();
  const { data: educations = [], isLoading } = useQuery(
    ['my-educations'],
    () => experts.educations(),
    {
      refetchOnWindowFocus: false,
    },
  );
  // undefined: closed; null: adding; an entry: editing it.
  const [editing, setEditing] = useState(undefined);

  const refresh = () => {
    queryClient.invalidateQueries(['my-educations']);
    queryClient.invalidateQueries(['my-expert']);
  };
  const remove = async (education) => {
    try {
      await experts.removeEducation(education.id);
      refresh();
    } catch (e) {
      infoNotification(
        i18n.t('pages.personalaccountEducation.nePoluchilosUdalit'),
        errorMessage(e),
      );
    }
  };

  return (
    <AccountLayout title={i18n.t('pages.personalaccountEducation.obrazovanie')}>
      <EducationModal
        open={editing !== undefined}
        education={editing ?? null}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          successNotification(i18n.t('pages.personalaccountEducation.obrazovanieSohraneno'), '');
          refresh();
        }}
      />
      {isLoading && <Spin />}
      {!isLoading && educations.length === 0 && (
        <Empty
          description={i18n.t('pages.personalaccountEducation.vyEscheNeDobaviliObrazovanie')}
          style={{ margin: '30px 0' }}
        />
      )}
      {educations.map((education) => (
        <div
          key={education.id}
          style={{
            display: 'flex',
            gap: '16px',
            padding: '16px 0',
            borderBottom: '1px solid #EEF0F4',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
            <div style={{ fontSize: '18px', fontWeight: 500 }}>{education.university}</div>
            <div>{education.speciality}</div>
            <div style={{ color: '#5E6674' }}>
              {[
                education.city,
                i18n.t('pages.personalaccountEducation.g', { year: education.year }),
              ]
                .filter(Boolean)
                .join(' · ')}
            </div>
            {education.diploma ? (
              <a href={education.diploma.url} target="_blank" rel="noreferrer">
                <PaperClipOutlined /> {education.diploma.name}
              </a>
            ) : (
              <span style={{ color: '#C98A0B' }}>
                {i18n.t('pages.personalaccountEducation.diplomNeZagruzhen')}
              </span>
            )}
          </div>
          <Button
            icon={<EditOutlined />}
            aria-label={i18n.t('pages.personalaccountEducation.izmenit', {
              university: education.university,
            })}
            onClick={() => setEditing(education)}
          />
          <Popconfirm
            title={i18n.t('pages.personalaccountEducation.udalitEtuZapis')}
            okText={i18n.t('pages.personalaccountEducation.da')}
            cancelText={i18n.t('pages.personalaccountEducation.net')}
            onConfirm={() => remove(education)}
          >
            <Button
              icon={<DeleteOutlined />}
              aria-label={i18n.t('pages.personalaccountEducation.udalit', {
                university: education.university,
              })}
            />
          </Popconfirm>
        </div>
      ))}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginTop: '20px' }}
        onClick={() => setEditing(null)}
      >
        {i18n.t('pages.personalaccountEducation.dobavitObrazovanie')}
      </Button>
    </AccountLayout>
  );
}

export default withRole(EducationPage, 'EXPERT');
