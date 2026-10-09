import { Button, Result } from 'antd';
import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Страница не найдена — LogosEst</title>
        <meta name="robots" content="noindex" />
      </Head>
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
