import { CalendarOutlined, EnvironmentOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Result } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { tasks } from '../../lib/api';
import { createApi } from '../../lib/api/client';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import { AuthorLine, BranchPills } from '../../src/components/questionCard/questionCard';
import RespondModal from '../../src/components/task/respondModal';
import ResponseCard from '../../src/components/task/responseCard';
import TaskActions, { useTaskAction } from '../../src/components/task/taskActions';
import TaskTimeline from '../../src/components/task/taskTimeline';
import { taskPrice, TaskStatusPill, ViewerStatusPill } from '../../src/components/taskCard/taskStatus';
import { useNotifyContext } from '../../src/context/notificationContext';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';

const block = { background: 'white', borderRadius: '10px' };

export default function TaskPage({ serverTask }) {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentUser, isExpert } = useUserContext();
  const { successNotification } = useNotifyContext();
  const [responding, setResponding] = useState(false);
  const id = Number(router.query.id);
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  // Refetched once the visitor's session is known: documents and viewerStatus depend on who asks.
  const { data: task } = useQuery(['task', id, currentUser?.id ?? null], () => tasks.get(id), {
    initialData: serverTask ?? undefined,
    enabled: Number.isFinite(id),
    refetchOnWindowFocus: false,
  });

  const isAuthor = task?.viewerStatus === 'youAuthor';
  const hasOwnOffer = ['youRespond', 'youChosen', 'youPerformer'].includes(task?.viewerStatus);
  const { data: responses = [] } = useQuery(['responses', id, currentUser?.id ?? null], () => tasks.responses(id), {
    enabled: Boolean(task) && (isAuthor || hasOwnOffer),
    refetchOnWindowFocus: false,
  });

  const refresh = () => {
    queryClient.invalidateQueries(['task', id]);
    queryClient.invalidateQueries(['responses', id]);
    queryClient.invalidateQueries('tasks');
  };
  const { run: runAction, running } = useTaskAction(id, refresh);

  if (!task) {
    return <Result status="404" title="Задача не найдена" style={{ marginTop: '120px' }} />;
  }

  const canRespond = task.status === 'OPEN' && isExpert && task.viewerStatus === null;
  const withdraw = async () => {
    await tasks.withdrawResponse(id);
    refresh();
  };

  return (
    <>
      <RespondModal
        task={task}
        open={responding}
        onClose={() => setResponding(false)}
        onDone={() => {
          setResponding(false);
          successNotification('Отклик отправлен', 'Заказчик увидит его и сможет выбрать вас исполнителем.');
          refresh();
        }}
      />
      <PageHeader title={task.title} />
      <PageContainer>
        <Col xs={24} sm={24} md={24} lg={17} xl={18}>
          <div style={{ ...block, padding: pad }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <TaskStatusPill status={task.status} />
              <ViewerStatusPill viewerStatus={task.viewerStatus} />
            </div>
            {task.specialization && (
              <div style={{ fontSize: '18px', fontWeight: 500, marginTop: '14px' }}>{task.specialization.name}</div>
            )}
            <BranchPills branches={task.branches} />
            <Divider />
            <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: '16px', lineHeight: '24px' }}>
              {task.text}
            </div>
            {task.documents.length > 0 && (
              <>
                <Divider />
                <div style={{ fontWeight: 500, marginBottom: '8px' }}>Документы</div>
                {task.documents.map((file) => (
                  <div key={file.id}>
                    <PaperClipOutlined />{' '}
                    <a href={file.url} target="_blank" rel="noreferrer">
                      {file.name}
                    </a>
                  </div>
                ))}
              </>
            )}
            <Divider />
            <div style={{ color: '#5E6674', marginBottom: '8px' }}>Заказчик</div>
            <AuthorLine user={task.author} size={50} />
          </div>

          {(isAuthor || hasOwnOffer) && (
            <div style={{ marginTop: pad }}>
              <h2 style={{ fontSize: '24px', fontWeight: 500, marginBottom: 0 }}>
                {isAuthor ? `Отклики (${responses.length})` : 'Ваш отклик'}
              </h2>
              {isAuthor && responses.length === 0 && (
                <p style={{ color: '#5E6674', marginTop: '12px' }}>Пока никто не откликнулся.</p>
              )}
              {responses.map((response) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  chosen={task.performer?.expertId === response.expert.expertId}
                  actions={
                    isAuthor && task.status === 'OPEN' ? (
                      <Button
                        type="primary"
                        loading={running === 'choose'}
                        onClick={() => runAction('choose', { responseId: response.id })}
                      >
                        Выбрать исполнителем
                      </Button>
                    ) : !isAuthor && task.status === 'OPEN' ? (
                      <Button onClick={withdraw}>Отозвать отклик</Button>
                    ) : null
                  }
                />
              ))}
            </div>
          )}
        </Col>

        <Col xs={24} sm={24} md={24} lg={7} xl={6}>
          <div style={{ ...block, padding: pad }}>
            <div style={{ fontSize: '28px', color: '#0066FF' }}>{taskPrice(task)}</div>
            {task.agreedPrice !== null && task.budget !== null && task.agreedPrice !== task.budget && (
              <div style={{ color: '#5E6674' }}>Бюджет задачи: {task.budget.toLocaleString('ru-RU')} ₽</div>
            )}
            <Divider />
            <div style={{ display: 'grid', gap: '10px', color: '#5E6674' }}>
              {task.city && (
                <span>
                  <EnvironmentOutlined /> {task.city.name}
                </span>
              )}
              <span>
                <CalendarOutlined /> Опубликована {moment(task.createdAt).format('DD.MM.YYYY')}
              </span>
              {task.deadline && (
                <span>
                  <CalendarOutlined /> Срок: до {moment(task.deadline).format('DD.MM.YYYY')}
                </span>
              )}
              <span>Откликов: {task.responsesCount}</span>
            </div>
            {task.performer && (
              <>
                <Divider />
                <div style={{ color: '#5E6674', marginBottom: '8px' }}>Исполнитель</div>
                <Link href={`/expert/${task.performer.expertId}`} style={{ color: 'inherit' }}>
                  <AuthorLine user={task.performer.user} />
                </Link>
              </>
            )}

            <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
              {canRespond && (
                <Button type="primary" size={theme?.size} onClick={() => setResponding(true)}>
                  Откликнуться на задачу
                </Button>
              )}
              {task.status === 'OPEN' && !currentUser && (
                <Link href={`/login?next=/task/${task.id}`}>
                  <Button type="primary" size={theme?.size} style={{ width: '100%' }}>
                    Войти, чтобы откликнуться
                  </Button>
                </Link>
              )}
              {task.status === 'OPEN' && currentUser && !isExpert && !isAuthor && (
                <span style={{ color: '#5E6674' }}>
                  Откликаться могут эксперты. <Link href="/personalaccount/expert">Стать экспертом</Link>
                </span>
              )}
              <TaskActions task={task} refresh={refresh} size={theme?.size} />
              {isAuthor && task.status === 'OPEN' && (
                <Link href={`/task/${task.id}/edit`}>
                  <Button size={theme?.size} style={{ width: '100%' }}>
                    Редактировать задачу
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div style={{ ...block, padding: pad, marginTop: pad }}>
            <div style={{ fontWeight: 500, marginBottom: '16px' }}>Ход задачи</div>
            <TaskTimeline task={task} />
          </div>
        </Col>
      </PageContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    return { props: { serverTask: await tasks.get(context.query.id, createApi(context)) } };
  } catch {
    context.res.statusCode = 404;
    return { props: { serverTask: null } };
  }
}
