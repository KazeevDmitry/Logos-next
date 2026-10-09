import { Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { FormError } from '../authPage/authPage';

import i18n from '../../../utils/i18n-init';
/** The dialog in which an expert offers to do a task. */
export default function RespondModal({ task, open, onClose, onDone }) {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const negotiable = task.budget === null;

  const submit = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      await tasks.respond(task.id, { text: values.text, price: values.price ?? undefined });
      form.resetFields();
      onDone();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      title={i18n.t('ui.respondModal.otkliknutsyaNaZadachu')}
      okText={i18n.t('ui.respondModal.otpravitOtklik')}
      cancelText={i18n.t('ui.respondModal.otmena')}
      confirmLoading={busy}
      onOk={submit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" name="respond">
        <Form.Item
          name="text"
          label={i18n.t('ui.respondModal.kommentariyKZadache')}
          rules={[
            {
              required: true,
              whitespace: true,
              message: i18n.t('ui.respondModal.rasskazhitePochemuVyPodhodite'),
            },
          ]}
        >
          <Input.TextArea rows={5} maxLength={3000} showCount />
        </Form.Item>
        <Form.Item
          name="price"
          label={i18n.t('ui.respondModal.vashaTsena')}
          extra={
            negotiable
              ? i18n.t('ui.respondModal.tsenaPoDogovorennostiNazoviteSvoyu')
              : i18n.t('ui.respondModal.esliNeUkazatBudetByudzhet', {
                  v0: task.budget.toLocaleString('ru-RU'),
                })
          }
          rules={
            negotiable ? [{ required: true, message: i18n.t('ui.respondModal.nazoviteTsenu') }] : []
          }
        >
          <InputNumber min={1} max={100000000} precision={0} style={{ width: '200px' }} />
        </Form.Item>
      </Form>
      <FormError>{error}</FormError>
    </Modal>
  );
}
