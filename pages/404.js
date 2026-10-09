import { Button, Result } from 'antd';
import Link from 'next/link';
import Seo from '../src/components/seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Страница не найдена" noindex />
      <Result
        style={{ marginTop: '120px' }}
        status="404"
        title="Страница не найдена"
        subTitle="Возможно, ссылка устарела или в адресе опечатка."
        extra={[
          <Link key="home" href="/">
            <Button type="primary">На главную</Button>
          </Link>,
          <Link key="tasks" href="/tasks">
            <Button>К задачам</Button>
          </Link>,
        ]}
      />
    </>
  );
}
