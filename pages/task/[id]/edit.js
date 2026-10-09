import { Col, Result, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { tasks } from '../../../lib/api';
import { withAuth } from '../../../lib/withAuth';
import PageContainer from '../../../src/components/layouts/pageContainer';
import PageHeader from '../../../src/components/layouts/pageHeader';
import TaskForm from '../../../src/components/taskForm/taskForm';
import { useThemeContext } from '../../../src/context/themeContext';

function EditTask({ user }) {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = Number(router.query.id);
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  // Loaded in the browser as the author, so the documents are included.
  const { data: task, isLoading } = useQuery(['task', id], () => tasks.get(id), {
    enabled: Number.isFinite(id),
    refetchOnWindowFocus: false,
  });

  if (isLoading || !router.isReady) {
    return (
      <div style={{ textAlign: 'center', marginTop: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!task) {
    return <Result status="404" title="Задача не найдена" style={{ marginTop: '120px' }} />;
  }
  if (task.author.id !== user.id) {
    return <Result status="403" title="Редактировать задачу может только её автор" style={{ marginTop: '120px' }} />;
  }
  if (task.status !== 'OPEN') {
    return (
      <Result
        status="warning"
        title="Задачу уже нельзя редактировать"
        subTitle="Изменять можно только задачу, которая ещё принимает отклики."
        style={{ marginTop: '120px' }}
      />
    );
  }

  const onSubmit = async (body) => {
    await tasks.update(id, body);
    queryClient.invalidateQueries(['task', id]);
    queryClient.invalidateQueries('tasks');
    router.push(`/task/${id}`);
  };

  return (
    <>
      <PageHeader title="Редактирование задачи" maxWidth="900px" closeBtn seo={{ noindex: true }} />
      <PageContainer maxWidth="900px">
        <Col span={24}>
          <div style={{ background: 'white', borderRadius: '10px', padding: pad }}>
            <TaskForm task={task} submitText="Сохранить" onSubmit={onSubmit} />
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export default withAuth(EditTask);
