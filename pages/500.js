import { Button, Result } from 'antd';
import Link from 'next/link';
import Seo from '../src/components/seo';

export default function ServerErrorPage() {
  return (
    <>
      <Seo title="Ошибка сервера" noindex />
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
