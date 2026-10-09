import { Button } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { tasks } from '../lib/api';
import { withRole } from '../lib/withAuth';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import AccountTaskList from '../src/components/task/accountTaskList';

import i18n from '../utils/i18n-init';
const note = {
  borderTop: '1px solid #EEF0F4',
  marginTop: '16px',
  paddingTop: '14px',
  color: '#5E6674',
};

/** Tasks the expert offered to do, each with the offer they made. */
function MyResponses() {
  return (
    <>
      <PageHeader title={i18n.t('pages.myresponses.moiOtkliki')} seo={{ noindex: true }} />
      <PageContainer>
        <AccountTaskList
          name={['tasks', 'responded']}
          fetcher={tasks.responded}
          emptyText={i18n.t('pages.myresponses.vyEscheNeOtklikalisNa')}
          emptyAction={
            <Link href="/tasks">
              <Button type="primary">{i18n.t('pages.myresponses.naytiZadachu')}</Button>
            </Link>
          }
          renderNote={(task) => (
            <div style={note}>
              {i18n.t('pages.myresponses.vashePredlozhenie')}{' '}
              <b style={{ color: '#0066FF' }}>{task.myResponse.price.toLocaleString('ru-RU')} ₽</b>
              {' · '}
              {moment(task.myResponse.createdAt).format('DD.MM.YYYY')}
              <div style={{ overflowWrap: 'anywhere', marginTop: '4px' }}>
                {task.myResponse.text.length > 200
                  ? `${task.myResponse.text.slice(0, 200)}…`
                  : task.myResponse.text}
              </div>
            </div>
          )}
        />
      </PageContainer>
    </>
  );
}

export default withRole(MyResponses, 'EXPERT');
