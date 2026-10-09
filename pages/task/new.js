import { Col } from 'antd';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { tasks } from '../../lib/api';
import { withAuth } from '../../lib/withAuth';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import TaskForm from '../../src/components/taskForm/taskForm';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';

function NewTask() {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { successNotification } = useNotifyContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  const onSubmit = async (body) => {
    const created = await tasks.create(body);
    queryClient.invalidateQueries('tasks');
    successNotification('Задача опубликована', 'Эксперты увидят её в каталоге и смогут откликнуться.');
    router.push(`/task/${created.id}`);
  };

  return (
    <>
      <PageHeader title="Новая задача" maxWidth="900px" closeBtn seo={{ noindex: true }} />
      <PageContainer maxWidth="900px">
        <Col span={24}>
          <div style={{ background: 'white', borderRadius: '10px', padding: pad }}>
            <TaskForm submitText="Опубликовать задачу" onSubmit={onSubmit} />
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export default withAuth(NewTask);
