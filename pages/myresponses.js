import { Button } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { tasks } from '../lib/api';
import { withRole } from '../lib/withAuth';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import AccountTaskList from '../src/components/task/accountTaskList';

const note = { borderTop: '1px solid #EEF0F4', marginTop: '16px', paddingTop: '14px', color: '#5E6674' };

/** Tasks the expert offered to do, each with the offer they made. */
function MyResponses() {
  return (
    <>
      <PageHeader title="Мои отклики" />
      <PageContainer>
        <AccountTaskList
          name={['tasks', 'responded']}
          fetcher={tasks.responded}
          emptyText="Вы ещё не откликались на задачи."
          emptyAction={
            <Link href="/tasks">
              <Button type="primary">Найти задачу</Button>
            </Link>
          }
          renderNote={(task) => (
            <div style={note}>
              Ваше предложение:{' '}
              <b style={{ color: '#0066FF' }}>{task.myResponse.price.toLocaleString('ru-RU')} ₽</b>
              {' · '}
              {moment(task.myResponse.createdAt).format('DD.MM.YYYY')}
              <div style={{ overflowWrap: 'anywhere', marginTop: '4px' }}>
                {task.myResponse.text.length > 200 ? `${task.myResponse.text.slice(0, 200)}…` : task.myResponse.text}
              </div>
            </div>
          )}
        />
      </PageContainer>
    </>
  );
}

export default withRole(MyResponses, 'EXPERT');
