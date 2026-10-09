import { Button, Col, Empty, Input, Result } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { questions } from '../../lib/api';
import { createApi, errorMessage } from '../../lib/api/client';
import PageContainer from '../../src/components/layouts/pageContainer';
import PageHeader from '../../src/components/layouts/pageHeader';
import QuestionCard, { AuthorLine } from '../../src/components/questionCard/questionCard';
import { AskQuestionSideBlock } from '../../src/components/SideFilter/sideFilter';
import { useThemeContext } from '../../src/context/themeContext';
import { useUserContext } from '../../src/context/userContext';

import i18n from '../../utils/i18n-init';
/** New answers show up without a reload. */
const ANSWERS_REFRESH_MS = 30_000;

function AnswerForm({ questionId }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const mutation = useMutation((value) => questions.answer(questionId, value), {
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries(['answers', questionId]);
      queryClient.invalidateQueries(['question', questionId]);
    },
  });

  return (
    <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
      <div style={{ fontSize: '20px', fontWeight: 500 }}>
        {i18n.t('pages.questionId.znaeteOtvetNaEtotVopros')}
      </div>
      <p style={{ color: '#5E6674' }}>{i18n.t('pages.questionId.namVsegdaPriyatnoZnatMnenie')}</p>
      <Input.TextArea
        autoSize={{ minRows: 4, maxRows: 14 }}
        maxLength={10000}
        showCount
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {mutation.isError && (
        <div role="alert" style={{ color: '#F44336', marginTop: '6px' }}>
          {errorMessage(mutation.error)}
        </div>
      )}
      <Button
        type="primary"
        style={{ marginTop: '12px' }}
        loading={mutation.isLoading}
        disabled={!text.trim()}
        onClick={() => mutation.mutate(text)}
      >
        {i18n.t('pages.questionId.otvetitNaVopros')}
      </Button>
    </div>
  );
}

function AnswerCard({ answer }) {
  return (
    <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginTop: '20px' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}
      >
        <AuthorLine user={answer.author} />
        <span style={{ color: '#5E6674', fontSize: '14px' }}>
          {moment(answer.createdAt).format('DD MMM YYYY, HH:mm')}
        </span>
      </div>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          marginTop: '12px',
          fontSize: '16px',
        }}
      >
        {answer.text}
      </div>
    </div>
  );
}

export default function QuestionPage({ serverQuestion, serverAnswers = [] }) {
  const theme = useThemeContext();
  const { currentUser, isExpert, isAdmin } = useUserContext();
  const id = Number(useRouter().query.id);
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  const { data: question } = useQuery(['question', id], () => questions.get(id), {
    initialData: serverQuestion ?? undefined,
    enabled: Number.isFinite(id),
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
  const { data: answers = [] } = useQuery(['answers', id], () => questions.answers(id), {
    initialData: serverAnswers,
    enabled: Boolean(question),
    refetchInterval: ANSWERS_REFRESH_MS,
    refetchOnWindowFocus: false,
  });

  if (!question) {
    return (
      <Result
        status="404"
        title={i18n.t('pages.questionId.voprosNeNayden')}
        style={{ marginTop: '120px' }}
      />
    );
  }
  const canAnswer = isExpert || isAdmin;

  return (
    <>
      <PageHeader title={question.title} seo={{ description: question.text }} />
      <PageContainer>
        <Col xs={24} sm={24} md={16} lg={17} xl={18}>
          <QuestionCard question={{ ...question, answersCount: answers.length }} expanded />

          {canAnswer && <AnswerForm questionId={question.id} />}
          {!currentUser && (
            <p style={{ marginTop: '20px', color: '#5E6674' }}>
              {i18n.t('pages.questionId.vyYurist')}{' '}
              <Link href={`/login?next=/question/${question.id}`}>
                {i18n.t('pages.questionId.voydite')}
              </Link>
              {i18n.t('pages.questionId.chtobyOtvetit')}
            </p>
          )}

          {answers.length === 0 ? (
            <Empty
              description={i18n.t('pages.questionId.otvetovPokaNet')}
              style={{ margin: '40px 0' }}
            />
          ) : (
            answers.map((answer) => <AnswerCard key={answer.id} answer={answer} />)
          )}
        </Col>
        <Col xs={24} sm={24} md={8} lg={7} xl={6}>
          {!isExpert && <AskQuestionSideBlock style={{ padding: pad }} />}
        </Col>
      </PageContainer>
    </>
  );
}

export async function getServerSideProps(context) {
  const http = createApi(context);
  try {
    const serverQuestion = await questions.get(context.query.id, http);
    const serverAnswers = await questions.answers(context.query.id, http).catch(() => []);
    return { props: { serverQuestion, serverAnswers } };
  } catch {
    context.res.statusCode = 404;
    return { props: { serverQuestion: null, serverAnswers: [] } };
  }
}
