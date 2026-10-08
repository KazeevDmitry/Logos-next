import { Button, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { errorMessage } from '../../../lib/api/client';
import { useThemeContext } from '../../context/themeContext';
import { useBranches } from '../../hooks/useReference';
import { FormError } from '../authPage/authPage';
import CityInput from '../cityInput/cityInput';
import FileUploader from '../fileUploader/fileUploader';

/** Form values for a task from the API, or the defaults of a new one. */
function toFormValues(task) {
  if (!task) {
    return { priceMode: 'fixed', documents: [], branchIds: [] };
  }
  return {
    title: task.title,
    text: task.text,
    priceMode: task.contractual ? 'negotiable' : 'fixed',
    budget: task.budget ?? undefined,
    deadline: task.deadline ? moment(task.deadline) : undefined,
    cityId: task.city?.id,
    specializationId: task.specialization?.id,
    branchIds: task.branches.map((branch) => branch.id),
    documents: task.documents,
  };
}

/** The request body the API expects, from the form values. */
function toRequest(values) {
  const negotiable = values.priceMode === 'negotiable';
  return {
    title: values.title,
    text: values.text,
    contractual: negotiable,
    budget: negotiable ? null : values.budget,
    deadline: values.deadline ? values.deadline.endOf('day').toISOString() : null,
    cityId: values.cityId ?? null,
    specializationId: values.specializationId ?? null,
    branchIds: values.branchIds ?? [],
    fileIds: (values.documents ?? []).map((file) => file.id),
  };
}

/**
 * The form for publishing or editing a task. `onSubmit` receives the API
 * request body and may throw; the error text is shown under the form.
 */
export default function TaskForm({ task, submitText, onSubmit }) {
  const theme = useThemeContext();
  const branches = useBranches();
  const [form] = Form.useForm();
  const priceMode = Form.useWatch('priceMode', form);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onFinish = async (values) => {
    setBusy(true);
    setError('');
    try {
      await onSubmit(toRequest(values));
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <Form form={form} name="task" layout="vertical" initialValues={toFormValues(task)} onFinish={onFinish} scrollToFirstError>
      <Form.Item
        name="title"
        label="Название задачи"
        rules={[
          { required: true, whitespace: true, message: 'Назовите задачу' },
          { min: 5, message: 'Не короче 5 символов' },
        ]}
      >
        <Input size={theme?.size} maxLength={200} showCount placeholder="Например: раздел имущества при разводе" />
      </Form.Item>

      <Form.Item
        name="text"
        label="Что нужно сделать"
        rules={[
          { required: true, whitespace: true, message: 'Опишите задачу' },
          { min: 10, message: 'Не короче 10 символов' },
        ]}
      >
        <Input.TextArea autoSize={{ minRows: 5, maxRows: 16 }} maxLength={10000} showCount />
      </Form.Item>

      <Form.Item name="priceMode" label="Стоимость">
        <Radio.Group>
          <Radio value="fixed">Фиксированный бюджет</Radio>
          <Radio value="negotiable">По договоренности</Radio>
        </Radio.Group>
      </Form.Item>
      {priceMode !== 'negotiable' && (
        <Form.Item name="budget" label="Бюджет, ₽" rules={[{ required: true, message: 'Укажите бюджет' }]}>
          <InputNumber size={theme?.size} min={1} max={100000000} precision={0} style={{ width: '220px' }} />
        </Form.Item>
      )}

      <Form.Item name="deadline" label="Срок выполнения">
        <DatePicker
          size={theme?.size}
          format="DD.MM.YYYY"
          disabledDate={(date) => date && date.isBefore(moment().startOf('day'))}
        />
      </Form.Item>

      <Form.Item name="cityId" label="Город">
        <CityInput />
      </Form.Item>
      <Form.Item name="specializationId" label="Кто нужен">
        <CityInput marker="spec" placeholder="Любой специалист" />
      </Form.Item>
      <Form.Item name="branchIds" label="Отрасли права">
        <Select mode="multiple" allowClear size={theme?.size} optionFilterProp="children" maxTagCount="responsive">
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="documents"
        label="Документы (до 10 файлов)"
        extra="Документы увидят только эксперты и администраторы. JPG, PNG, WEBP, PDF, DOC, DOCX до 10 МБ."
      >
        <FileUploader max={10} />
      </Form.Item>

      <FormError>{error}</FormError>
      <Button type="primary" htmlType="submit" size={theme?.size} loading={busy} style={{ marginTop: '16px' }}>
        {submitText}
      </Button>
    </Form>
  );
}
