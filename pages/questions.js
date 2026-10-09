import { Button } from 'antd';
import Link from 'next/link';
import { questions } from '../lib/api';
import ListPage from '../src/components/listPage/listPage';
import QuestionCard from '../src/components/questionCard/questionCard';
import { AskQuestionSideBlock } from '../src/components/SideFilter/sideFilter';
import { useThemeContext } from '../src/context/themeContext';
import { useUserContext } from '../src/context/userContext';
import { listServerProps, useListQuery } from '../src/hooks/useListQuery';

import i18n from '../utils/i18n-init';
const PAGE_SIZE = 5;
const options = {
  filters: { branch: ['branchId', 'int'], subbranch: ['subbranchId', 'int'] },
  pageSize: PAGE_SIZE,
};

export default function Questions({ serverData }) {
  const theme = useThemeContext();
  const { isExpert } = useUserContext();
  const query = useListQuery('questions', questions.list, { ...options, serverData });
  const pad = `${theme?.gutters?.gorizontal?.[theme?.id] ?? 20}px`;

  return (
    <ListPage
      title={i18n.t('pages.questions.voprosyIOtvety')}
      description={i18n.t('pages.questions.voprosyYuristamIOtvetyPraktikuyuschih')}
      headerChildren={
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Link href="/addquestion">
            <Button size={theme?.size} type="primary">
              {i18n.t('pages.questions.zadatVopros')}
            </Button>
          </Link>
        </div>
      }
      searchPlaceholder={i18n.t('pages.questions.vvediteStrokuDlyaPoiska')}
      filter={{ branch: true, spec: false, city: false, budget: false }}
      query={query}
      pageSize={PAGE_SIZE}
      pluralPath="questions.plural"
      emptyText={i18n.t('pages.questions.voprosovNeNaydeno')}
      sideExtra={!isExpert && <AskQuestionSideBlock style={{ padding: pad }} />}
      renderItem={(question) => (
        <Link href={`/question/${question.id}`} style={{ color: 'black', cursor: 'pointer' }}>
          <QuestionCard question={question} />
        </Link>
      )}
    />
  );
}

export const getServerSideProps = listServerProps(questions.list, options);
