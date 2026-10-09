import Link from 'next/link';
import { experts } from '../lib/api';
import ExpertCard from '../src/components/expertCard/expertCard';
import ListPage from '../src/components/listPage/listPage';
import { listServerProps, useListQuery } from '../src/hooks/useListQuery';

import i18n from '../utils/i18n-init';
const PAGE_SIZE = 8;
/** URL query key → API parameter. */
const FILTERS = {
  branch: ['branchId', 'int'],
  specialization: ['specializationId', 'int'],
  city: ['cityId', 'int'],
};
const options = { filters: FILTERS, pageSize: PAGE_SIZE };

export default function Experts({ serverData }) {
  const query = useListQuery('experts', experts.list, { ...options, serverData });

  return (
    <ListPage
      title={i18n.t('pages.experts.eksperty')}
      description={i18n.t('pages.experts.yuristyAdvokatyINotariusyS')}
      searchPlaceholder={i18n.t('pages.experts.vveditePolnostyuIliChastichnoImya')}
      filter={{ city: true, spec: true, branch: true, budget: false }}
      query={query}
      pageSize={PAGE_SIZE}
      pluralPath="experts.plural"
      emptyText={i18n.t('pages.experts.ekspertyNeNaydenyPoprobuyteIzmenit')}
      renderItem={(expert) => (
        <Link href={`/expert/${expert.id}`} style={{ color: 'black', cursor: 'pointer' }}>
          <ExpertCard expert={expert} />
        </Link>
      )}
    />
  );
}

export const getServerSideProps = listServerProps(experts.list, options);
