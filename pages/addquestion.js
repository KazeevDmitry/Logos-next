import { Button, Col, Form, Input } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { questions } from '../lib/api';
import { errorMessage } from '../lib/api/client';
import { withAuth } from '../lib/withAuth';
import { FormError } from '../src/components/authPage/authPage';
import BranchSelect from '../src/components/branchSelect/branchSelect';
import FileUploader from '../src/components/fileUploader/fileUploader';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import { useNotifyContext } from '../src/context/notificationContext';
import { useThemeContext } from '../src/context/themeContext';

function AddQuestion() {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { successNotification } = useNotifyContext();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  const onFinish = async ({ title, description, branch, attachments = [] }) => {
    setBusy(true);
    setError('');
    try {
      const created = await questions.create({
        title,
        description,
        branchId: branch.branch_id ?? undefined,
        subbranchId: branch.subbranch_id ?? undefined,
        fileIds: attachments.map((file) => file.id),
      });
      queryClient.invalidateQueries('questions');
      successNotification('Вопрос сохранен', 'Ожидайте ответа специалистов');
      router.push(`/question/${created.id}`);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Задать вопрос" maxWidth="900px" closeBtn seo={{ noindex: true }} />
      <PageContainer maxWidth="900px">
        <Col span={24}>
          <div style={{ background: 'white', borderRadius: '10px', padding: pad }}>
            <Form name="addquestion" layout="vertical" onFinish={onFinish} scrollToFirstError>
              <Form.Item
                name="title"
                label="Заголовок вопроса"
                rules={[
                  { required: true, whitespace: true, message: 'Сформулируйте вопрос' },
                  { min: 5, message: 'Не короче 5 символов' },
                ]}
              >
                <Input size={theme?.size} maxLength={200} showCount placeholder="Например: можно ли вернуть товар без чека?" />
              </Form.Item>
              <Form.Item
                name="description"
                label="Подробности"
                rules={[
                  { required: true, whitespace: true, message: 'Опишите ситуацию' },
                  { min: 10, message: 'Не короче 10 символов' },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 5, maxRows: 16 }} maxLength={10000} showCount />
              </Form.Item>
              <Form.Item
                name="branch"
                label="Отрасль права"
                rules={[
                  {
                    validator: (_, value) =>
                      value?.branch_id || value?.subbranch_id
                        ? Promise.resolve()
                        : Promise.reject(new Error('Выберите отрасль права')),
                  },
                ]}
              >
                <BranchSelect size={theme?.size} />
              </Form.Item>
              <Form.Item name="attachments" label="Документы (до 5 файлов)" extra="JPG, PNG, WEBP, PDF, DOC, DOCX до 10 МБ">
                <FileUploader max={5} />
              </Form.Item>
              <FormError>{error}</FormError>
              <Button type="primary" htmlType="submit" size={theme?.size} loading={busy} style={{ marginTop: '16px' }}>
                Опубликовать вопрос
              </Button>
            </Form>
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export default withAuth(AddQuestion);
