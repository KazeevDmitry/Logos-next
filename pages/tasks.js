import { Button } from 'antd';
import Link from 'next/link';
import { tasks } from '../lib/api';
import ListPage from '../src/components/listPage/listPage';
import TaskCard from '../src/components/taskCard/taskCard';
import { useThemeContext } from '../src/context/themeContext';
import { listServerProps, useListQuery } from '../src/hooks/useListQuery';

import i18n from '../utils/i18n-init';
const PAGE_SIZE = 5;
/** URL query key → API parameter. */
const FILTERS = {
  branch: ['branchId', 'int'],
  specialization: ['specializationId', 'int'],
  city: ['cityId', 'int'],
  budgetmin: ['budgetMin', 'int'],
  budgetmax: ['budgetMax', 'int'],
  contractual: ['contractual', 'bool'],
};
const options = { filters: FILTERS, pageSize: PAGE_SIZE };

export default function Tasks({ serverData }) {
  const theme = useThemeContext();
  const query = useListQuery('tasks', tasks.list, { ...options, serverData });

  return (
    <ListPage
      title={i18n.t('pages.tasks.zadachi')}
      description={i18n.t('pages.tasks.yuridicheskieZadachiOtZakazchikovDogovory')}
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
          <Link href="/task/new">
            <Button size={theme?.size} type="primary">
              {i18n.t('pages.tasks.sozdatZadachu')}
            </Button>
          </Link>
        </div>
      }
      searchPlaceholder={i18n.t('pages.tasks.vvediteStrokuDlyaPoiska')}
      filter={{ city: true, spec: true, branch: true, budget: true }}
      query={query}
      pageSize={PAGE_SIZE}
      pluralPath="tasks.plural"
      emptyText={i18n.t('pages.tasks.zadachNeNaydenoPoprobuyteIzmenit')}
      renderItem={(task) => (
        <Link href={`/task/${task.id}`} style={{ color: 'black', cursor: 'pointer' }}>
          <TaskCard task={task} />
        </Link>
      )}
    />
  );
}

export const getServerSideProps = listServerProps(tasks.list, options);
