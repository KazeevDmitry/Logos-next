import { Button, DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { errorMessage } from '../../../lib/api/client';
import { useThemeContext } from '../../context/themeContext';
import { useBranches } from '../../hooks/useReference';
import { FormError } from '../authPage/authPage';
import CityInput from '../cityInput/cityInput';
import FileUploader from '../fileUploader/fileUploader';

import i18n from '../../../utils/i18n-init';
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
    <Form
      form={form}
      name="task"
      layout="vertical"
      initialValues={toFormValues(task)}
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="title"
        label={i18n.t('ui.taskForm.nazvanieZadachi')}
        rules={[
          { required: true, whitespace: true, message: i18n.t('ui.taskForm.nazoviteZadachu') },
          { min: 5, message: i18n.t('ui.taskForm.neKoroche5Simvolov') },
        ]}
      >
        <Input
          size={theme?.size}
          maxLength={200}
          showCount
          placeholder={i18n.t('ui.taskForm.naprimerRazdelImuschestvaPriRazvode')}
        />
      </Form.Item>

      <Form.Item
        name="text"
        label={i18n.t('ui.taskForm.chtoNuzhnoSdelat')}
        rules={[
          { required: true, whitespace: true, message: i18n.t('ui.taskForm.opishiteZadachu') },
          { min: 10, message: i18n.t('ui.taskForm.neKoroche10Simvolov') },
        ]}
      >
        <Input.TextArea autoSize={{ minRows: 5, maxRows: 16 }} maxLength={10000} showCount />
      </Form.Item>

      <Form.Item name="priceMode" label={i18n.t('ui.taskForm.stoimost')}>
        <Radio.Group>
          <Radio value="fixed">{i18n.t('ui.taskForm.fiksirovannyyByudzhet')}</Radio>
          <Radio value="negotiable">{i18n.t('ui.taskForm.poDogovorennosti')}</Radio>
        </Radio.Group>
      </Form.Item>
      {priceMode !== 'negotiable' && (
        <Form.Item
          name="budget"
          label={i18n.t('ui.taskForm.byudzhet')}
          rules={[{ required: true, message: i18n.t('ui.taskForm.ukazhiteByudzhet') }]}
        >
          <InputNumber
            size={theme?.size}
            min={1}
            max={100000000}
            precision={0}
            style={{ width: '220px' }}
          />
        </Form.Item>
      )}

      <Form.Item name="deadline" label={i18n.t('ui.taskForm.srokVypolneniya')}>
        <DatePicker
          size={theme?.size}
          format="DD.MM.YYYY"
          disabledDate={(date) => date && date.isBefore(moment().startOf('day'))}
        />
      </Form.Item>

      <Form.Item name="cityId" label={i18n.t('ui.taskForm.gorod')}>
        <CityInput />
      </Form.Item>
      <Form.Item name="specializationId" label={i18n.t('ui.taskForm.ktoNuzhen')}>
        <CityInput marker="spec" placeholder={i18n.t('ui.taskForm.lyuboySpetsialist')} />
      </Form.Item>
      <Form.Item name="branchIds" label={i18n.t('ui.taskForm.otrasliPrava')}>
        <Select
          mode="multiple"
          allowClear
          size={theme?.size}
          optionFilterProp="children"
          maxTagCount="responsive"
        >
          {branches.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="documents"
        label={i18n.t('ui.taskForm.dokumentyDo10Faylov')}
        extra={i18n.t('ui.taskForm.dokumentyUvidyatTolkoEkspertyI')}
      >
        <FileUploader max={10} />
      </Form.Item>

      <FormError>{error}</FormError>
      <Button
        type="primary"
        htmlType="submit"
        size={theme?.size}
        loading={busy}
        style={{ marginTop: '16px' }}
      >
        {submitText}
      </Button>
    </Form>
  );
}
