import { Col, Result, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { tasks } from '../../../lib/api';
import { withAuth } from '../../../lib/withAuth';
import PageContainer from '../../../src/components/layouts/pageContainer';
import PageHeader from '../../../src/components/layouts/pageHeader';
import TaskForm from '../../../src/components/taskForm/taskForm';
import { useThemeContext } from '../../../src/context/themeContext';

import i18n from '../../../utils/i18n-init';
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
    return (
      <Result
        status="404"
        title={i18n.t('pages.taskIdEdit.zadachaNeNaydena')}
        style={{ marginTop: '120px' }}
      />
    );
  }
  if (task.author.id !== user.id) {
    return (
      <Result
        status="403"
        title={i18n.t('pages.taskIdEdit.redaktirovatZadachuMozhetTolkoEe')}
        style={{ marginTop: '120px' }}
      />
    );
  }
  if (task.status !== 'OPEN') {
    return (
      <Result
        status="warning"
        title={i18n.t('pages.taskIdEdit.zadachuUzheNelzyaRedaktirovat')}
        subTitle={i18n.t('pages.taskIdEdit.izmenyatMozhnoTolkoZadachuKotoraya')}
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
      <PageHeader
        title={i18n.t('pages.taskIdEdit.redaktirovanieZadachi')}
        maxWidth="900px"
        closeBtn
        seo={{ noindex: true }}
      />
      <PageContainer maxWidth="900px">
        <Col span={24}>
          <div style={{ background: 'white', borderRadius: '10px', padding: pad }}>
            <TaskForm
              task={task}
              submitText={i18n.t('pages.taskIdEdit.sohranit')}
              onSubmit={onSubmit}
            />
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export default withAuth(EditTask);
