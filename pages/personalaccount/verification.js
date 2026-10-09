import { Alert, Button, Spin } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withRole } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { FormError } from '../../src/components/authPage/authPage';
import FileUploader from '../../src/components/fileUploader/fileUploader';

const date = (value) => moment(value).format('DD.MM.YYYY');

/** Upload of the passport scan and the request to check it. */
function PassportForm({ onSent, again }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    setError('');
    try {
      await experts.requestVerification(files[0].id);
      onSent();
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', marginTop: '20px' }}>
      <p>
        Загрузите скан или фото разворота паспорта с фотографией. Имя и фамилия в паспорте должны
        совпадать с указанными в профиле.
      </p>
      <p style={{ color: '#5E6674' }}>
        Документ увидит только администратор при проверке. JPG, PNG, WEBP или PDF до 10 МБ.
      </p>
      <FileUploader
        value={files}
        onChange={setFiles}
        max={1}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        label="Выбрать файл"
      />
      <FormError>{error}</FormError>
      <Button
        type="primary"
        style={{ marginTop: '20px' }}
        disabled={files.length === 0}
        loading={busy}
        onClick={send}
      >
        {again ? 'Отправить повторно' : 'Отправить на проверку'}
      </Button>
    </div>
  );
}

/** Identity check: a verified expert gets a mark in the profile and in search results. */
function VerificationPage() {
  const queryClient = useQueryClient();
  const { data: request, isLoading } = useQuery(['my-verification'], () => experts.verification(), {
    refetchOnWindowFocus: false,
  });
  const refresh = () => {
    queryClient.invalidateQueries(['my-verification']);
    queryClient.invalidateQueries(['my-expert']);
  };
  const status = request?.status;

  return (
    <AccountLayout title="Подтверждение личности">
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {!status && (
            <Alert
              type="info"
              showIcon
              message="Личность не подтверждена"
              description="Подтверждённые эксперты получают отметку в профиле и в поиске — заказчики доверяют им больше."
            />
          )}
          {status === 'PENDING' && (
            <Alert
              type="info"
              showIcon
              message="Документ на проверке"
              description={`Заявка отправлена ${date(request.createdAt)}. Обычно проверка занимает один-два рабочих дня; о результате придёт уведомление.`}
            />
          )}
          {status === 'APPROVED' && (
            <Alert
              type="success"
              showIcon
              message="Личность подтверждена"
              description={`Проверка пройдена ${date(request.reviewedAt ?? request.createdAt)}. В вашем профиле стоит отметка.`}
            />
          )}
          {status === 'REJECTED' && (
            <Alert
              type="error"
              showIcon
              message="Проверка не пройдена"
              description={
                request.comment
                  ? `Комментарий администратора: ${request.comment}`
                  : 'Загрузите документ ещё раз.'
              }
            />
          )}
          {(!status || status === 'REJECTED') && (
            <PassportForm again={status === 'REJECTED'} onSent={refresh} />
          )}
        </>
      )}
    </AccountLayout>
  );
}

export default withRole(VerificationPage, 'EXPERT');
