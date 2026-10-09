import { Col } from 'antd';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { tasks } from '../../lib/api';
import { withAuth } from '../../lib/withAuth';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import TaskForm from '../../src/components/taskForm/taskForm';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';

import i18n from '../../utils/i18n-init';
function NewTask() {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { successNotification } = useNotifyContext();
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  const onSubmit = async (body) => {
    const created = await tasks.create(body);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    successNotification(
      i18n.t('pages.taskNew.zadachaOpublikovana'),
      i18n.t('pages.taskNew.ekspertyUvidyatEeVKataloge'),
    );
    router.push(`/task/${created.id}`);
  };

  return (
    <>
      <PageHeader
        title={i18n.t('pages.taskNew.novayaZadacha')}
        maxWidth="900px"
        closeBtn
        seo={{ noindex: true }}
      />
      <PageContainer maxWidth="900px">
        <Col span={24}>
          <div style={{ background: 'white', borderRadius: '10px', padding: pad }}>
            <TaskForm submitText={i18n.t('pages.taskNew.opublikovatZadachu')} onSubmit={onSubmit} />
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export default withAuth(NewTask);
