import { Button, Col, Radio } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { tasks } from '../lib/api';
import { withAuth } from '../lib/withAuth';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import AccountTaskList from '../src/components/task/accountTaskList';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';

const createButton = (size) => (
  <Link href="/task/new">
    <Button size={size} type="primary">
      Создать задачу +
    </Button>
  </Link>
);

/** Tasks the user created and, for an expert, tasks they carry out. */
function MyTasks() {
  const theme = useThemeContext();
  const router = useRouter();
  const { isExpert } = useUserContext();
  const performing = isExpert && router.query.role === 'performer';

  const setRole = (role) => {
    router.push(
      { pathname: router.pathname, query: role === 'performer' ? { role } : {} },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <>
      <PageHeader title="Мои задачи" seo={{ noindex: true }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {createButton(theme?.size)}
        </div>
      </PageHeader>
      <PageContainer>
        {isExpert && (
          <Col span={24}>
            <Radio.Group
              value={performing ? 'performer' : 'author'}
              onChange={(e) => setRole(e.target.value)}
            >
              <Radio.Button value="author">Я заказчик</Radio.Button>
              <Radio.Button value="performer">Я исполнитель</Radio.Button>
            </Radio.Group>
          </Col>
        )}
        {performing ? (
          <AccountTaskList
            key="performing"
            name={['tasks', 'performing']}
            fetcher={tasks.performing}
            emptyText="Вас пока не выбирали исполнителем."
            emptyAction={
              <Link href="/tasks">
                <Button type="primary">Найти задачу</Button>
              </Link>
            }
          />
        ) : (
          <AccountTaskList
            key="mine"
            name={['tasks', 'mine']}
            fetcher={tasks.mine}
            emptyText="Вы ещё не создавали задач."
            emptyAction={createButton()}
          />
        )}
      </PageContainer>
    </>
  );
}

export default withAuth(MyTasks);
