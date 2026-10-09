import { CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import { Button, Progress } from 'antd';
import Link from 'next/link';
import { withAuth } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { useCompleteness } from '../../src/components/account/completeness';
import UserImage from '../../src/components/userImage/userImage';

import i18n from '../../utils/i18n-init';
const ROLE = {
  USER: i18n.t('pages.personalaccountIndex.zakazchik'),
  EXPERT: i18n.t('pages.personalaccountIndex.ekspert'),
  ADMIN: i18n.t('pages.personalaccountIndex.administrator'),
};

/** One step of the checklist; a link when the step has a page to do it on. */
function Check({ check }) {
  const row = (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 0',
        color: check.done ? '#5E6674' : 'black',
      }}
    >
      <CheckCircleFilled style={{ color: check.done ? '#32D69B' : '#CED3DB', fontSize: '18px' }} />
      <span style={{ textDecoration: check.done ? 'line-through' : 'none' }}>{check.text}</span>
      {!check.done && check.href && (
        <RightOutlined style={{ fontSize: '11px', color: '#0066FF' }} />
      )}
    </span>
  );
  return <li>{check.href && !check.done ? <Link href={check.href}>{row}</Link> : row}</li>;
}

function AccountOverview({ user }) {
  const { checks, percent } = useCompleteness();

  return (
    <AccountLayout title={i18n.t('pages.personalaccountIndex.lichnyyKabinet')}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <UserImage image={user.avatarUrl ?? ''} width={90} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '24px', fontWeight: 500, overflowWrap: 'anywhere' }}>
            {`${user.name} ${user.surname ?? ''}`.trim()}
          </div>
          <div style={{ color: '#5E6674', overflowWrap: 'anywhere' }}>{user.email}</div>
          <div style={{ color: '#5E6674' }}>
            {ROLE[user.role]}
            {user.city ? ` · ${user.city.name}` : ''}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginTop: '30px',
        }}
      >
        <Progress type="circle" percent={percent} size={110} strokeColor="#0066FF" />
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 500 }}>
            {percent === 100
              ? i18n.t('pages.personalaccountIndex.profilZapolnen')
              : i18n.t('pages.personalaccountIndex.zapolniteProfil')}
          </h2>
          {percent < 100 && (
            <p style={{ color: '#5E6674', maxWidth: '520px' }}>
              {user.role === 'EXPERT'
                ? i18n.t('pages.personalaccountIndex.zakazchikiChascheVybirayutIspolniteleyS')
                : i18n.t('pages.personalaccountIndex.sZapolnennymProfilemIspolnitelyamProsche')}
            </p>
          )}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {checks.map((check) => (
              <Check key={check.text} check={check} />
            ))}
          </ul>
        </div>
      </div>

      {user.role === 'USER' && (
        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            borderRadius: '10px',
            background: '#F0F2F6',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            {i18n.t('pages.personalaccountIndex.vyYuristAdvokatIliNotarius')}
          </div>
          <p style={{ color: '#5E6674', margin: '6px 0 14px' }}>
            {i18n.t('pages.personalaccountIndex.stanteEkspertomOtklikaytesNaZadachi')}
          </p>
          <Link href="/personalaccount/expert">
            <Button type="primary">{i18n.t('pages.personalaccountIndex.statEkspertom')}</Button>
          </Link>
        </div>
      )}
    </AccountLayout>
  );
}

export default withAuth(AccountOverview);
