import { Form, Input, InputNumber, Modal } from 'antd';
import { useState } from 'react';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { FormError } from '../authPage/authPage';

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
      title="Откликнуться на задачу"
      okText="Отправить отклик"
      cancelText="Отмена"
      confirmLoading={busy}
      onOk={submit}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" name="respond">
        <Form.Item
          name="text"
          label="Комментарий к задаче"
          rules={[{ required: true, whitespace: true, message: 'Расскажите, почему вы подходите' }]}
        >
          <Input.TextArea rows={5} maxLength={3000} showCount />
        </Form.Item>
        <Form.Item
          name="price"
          label="Ваша цена, ₽"
          extra={negotiable ? 'Цена по договоренности: назовите свою.' : `Если не указать, будет бюджет задачи: ${task.budget.toLocaleString('ru-RU')} ₽.`}
          rules={negotiable ? [{ required: true, message: 'Назовите цену' }] : []}
        >
          <InputNumber min={1} max={100000000} precision={0} style={{ width: '200px' }} />
        </Form.Item>
      </Form>
      <FormError>{error}</FormError>
    </Modal>
  );
}
