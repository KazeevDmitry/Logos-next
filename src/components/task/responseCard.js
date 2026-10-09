import { SafetyCertificateOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import dayjs from '../../../utils/dayjs';
import Link from 'next/link';
import RatingBar from '../ratingbar/ratingbar';
import UserImage from '../userImage/userImage';

import i18n from '../../../utils/i18n-init';
/** One expert's offer. `response` is the API's ResponseDto; `actions` are buttons for the author. */
export default function ResponseCard({ response, chosen = false, actions }) {
  const { expert } = response;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        marginTop: '20px',
        border: chosen ? '2px solid #1890ff' : '2px solid transparent',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}
      >
        <Link
          href={`/expert/${expert.expertId}`}
          style={{ color: 'inherit', display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <UserImage image={expert.user.avatarUrl ?? ''} width={50} />
          <div>
            <div style={{ fontWeight: 500, fontSize: '17px' }}>
              {expert.user.name} {expert.user.surname ?? ''}
              {expert.verified && (
                <Tooltip title={i18n.t('ui.responseCard.dokumentyProvereny')}>
                  <SafetyCertificateOutlined style={{ color: '#32D69B', marginLeft: '8px' }} />
                </Tooltip>
              )}
            </div>
            <div style={{ width: '210px', marginTop: '4px' }}>
              <RatingBar
                stars={expert.starsAvg}
                cups={expert.rating}
                reviews={expert.reviewsCount}
              />
            </div>
          </div>
        </Link>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', color: '#0066FF', whiteSpace: 'nowrap' }}>
            {response.price.toLocaleString('ru-RU')} ₽
          </div>
          <div style={{ color: '#5E6674', fontSize: '13px' }}>
            {dayjs(response.createdAt).format('DD MMM YYYY, HH:mm')}
          </div>
        </div>
      </div>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          marginTop: '14px',
          fontSize: '16px',
        }}
      >
        {response.text}
      </div>
      {actions && (
        <div style={{ marginTop: '14px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
