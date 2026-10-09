import { Alert, Button, Spin } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { experts } from '../../lib/api';
import { errorMessage } from '../../lib/api/client';
import { withRole } from '../../lib/withAuth';
import AccountLayout from '../../src/components/account/accountLayout';
import { FormError } from '../../src/components/authPage/authPage';
import FileUploader from '../../src/components/fileUploader/fileUploader';

import i18n from '../../utils/i18n-init';
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
      <p>{i18n.t('pages.personalaccountVerification.zagruziteSkanIliFotoRazvorota')}</p>
      <p style={{ color: '#5E6674' }}>
        {i18n.t('pages.personalaccountVerification.dokumentUviditTolkoAdministratorPri')}
      </p>
      <FileUploader
        value={files}
        onChange={setFiles}
        max={1}
        accept="image/jpeg,image/png,image/webp,application/pdf"
        label={i18n.t('pages.personalaccountVerification.vybratFayl')}
      />
      <FormError>{error}</FormError>
      <Button
        type="primary"
        style={{ marginTop: '20px' }}
        disabled={files.length === 0}
        loading={busy}
        onClick={send}
      >
        {again
          ? i18n.t('pages.personalaccountVerification.otpravitPovtorno')
          : i18n.t('pages.personalaccountVerification.otpravitNaProverku')}
      </Button>
    </div>
  );
}

/** Identity check: a verified expert gets a mark in the profile and in search results. */
function VerificationPage() {
  const queryClient = useQueryClient();
  const { data: request, isLoading } = useQuery({
    queryKey: ['my-verification'],
    queryFn: () => experts.verification(),
    refetchOnWindowFocus: false,
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['my-verification'] });
    queryClient.invalidateQueries({ queryKey: ['my-expert'] });
  };
  const status = request?.status;

  return (
    <AccountLayout title={i18n.t('pages.personalaccountVerification.podtverzhdenieLichnosti')}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          {!status && (
            <Alert
              type="info"
              showIcon
              message={i18n.t('pages.personalaccountVerification.lichnostNePodtverzhdena')}
              description={i18n.t(
                'pages.personalaccountVerification.podtverzhdennyeEkspertyPoluchayutOtmetkuV',
              )}
            />
          )}
          {status === 'PENDING' && (
            <Alert
              type="info"
              showIcon
              message={i18n.t('pages.personalaccountVerification.dokumentNaProverke')}
              description={i18n.t(
                'pages.personalaccountVerification.zayavkaOtpravlenaObychnoProverkaZanimaet',
                { v0: date(request.createdAt) },
              )}
            />
          )}
          {status === 'APPROVED' && (
            <Alert
              type="success"
              showIcon
              message={i18n.t('pages.personalaccountVerification.lichnostPodtverzhdena')}
              description={i18n.t(
                'pages.personalaccountVerification.proverkaProydenaVVashemProfile',
                { v0: date(request.reviewedAt ?? request.createdAt) },
              )}
            />
          )}
          {status === 'REJECTED' && (
            <Alert
              type="error"
              showIcon
              message={i18n.t('pages.personalaccountVerification.proverkaNeProydena')}
              description={
                request.comment
                  ? i18n.t('pages.personalaccountVerification.kommentariyAdministratora', {
                      comment: request.comment,
                    })
                  : i18n.t('pages.personalaccountVerification.zagruziteDokumentEscheRaz')
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
