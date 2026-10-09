import { Button, Result } from 'antd';
import Head from 'next/head';
import Link from 'next/link';

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>Ошибка сервера — LogosEst</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Result
        style={{ marginTop: '120px' }}
        status="500"
        title="Сервис временно недоступен"
        subTitle="Мы уже разбираемся. Попробуйте обновить страницу через минуту."
        extra={
          <Link href="/">
            <Button type="primary">На главную</Button>
          </Link>
        }
      />
    </>
  );
}
