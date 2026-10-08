import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Empty, Popover, Spin } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { notifications } from '../../../lib/api';

const SHOWN = 8;
const REFRESH_MS = 60_000;

function NoticeList({ onNavigate }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['notifications', 'latest'], () => notifications.list({ pageSize: SHOWN }));
  const refresh = () => queryClient.invalidateQueries('notifications');

  const open = (notice) => {
    if (!notice.read) {
      notifications
        .read(notice.id)
        .catch(() => undefined)
        .then(refresh);
    }
    if (notice.link) {
      router.push(notice.link);
    }
    onNavigate();
  };
  const readAll = async () => {
    await notifications.readAll().catch(() => undefined);
    refresh();
  };

  if (isLoading) {
    return (
      <div style={{ width: '340px', textAlign: 'center', padding: '20px' }}>
        <Spin />
      </div>
    );
  }
  const items = data?.items ?? [];
  if (items.length === 0) {
    return <Empty description="Уведомлений пока нет" style={{ width: '340px', margin: '10px 0' }} />;
  }

  return (
    <div style={{ width: 'min(340px, 80vw)' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '60vh', overflowY: 'auto' }}>
        {items.map((notice) => (
          <li key={notice.id}>
            <button
              type="button"
              onClick={() => open(notice)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                border: 'none',
                borderBottom: '1px solid #EEF0F4',
                padding: '10px 8px',
                cursor: 'pointer',
                background: notice.read ? 'transparent' : 'rgba(0, 102, 255, 0.06)',
              }}
            >
              <div style={{ fontWeight: notice.read ? 400 : 600 }}>{notice.title}</div>
              <div style={{ color: '#5E6674', overflowWrap: 'anywhere' }}>{notice.body}</div>
              <div style={{ color: '#9AA1AD', fontSize: '12px' }}>{moment(notice.createdAt).fromNow()}</div>
            </button>
          </li>
        ))}
      </ul>
      {data.unread > 0 && (
        <Button type="link" onClick={readAll} style={{ paddingLeft: '8px' }}>
          Отметить все прочитанными
        </Button>
      )}
    </div>
  );
}

/** The bell in the header: unread count and the latest notices in a dropdown. */
export default function NotificationBell({ size = 22 }) {
  const [open, setOpen] = useState(false);
  const { data } = useQuery(['notifications', 'unread'], () => notifications.unreadCount(), {
    refetchInterval: REFRESH_MS,
  });
  const unread = data?.unread ?? 0;

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      destroyTooltipOnHide
      title="Уведомления"
      content={<NoticeList onNavigate={() => setOpen(false)} />}
    >
      <button
        type="button"
        aria-label={unread > 0 ? `Уведомления, непрочитанных: ${unread}` : 'Уведомления'}
        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', lineHeight: 1, color: 'inherit' }}
      >
        <Badge count={unread} size="small" overflowCount={99}>
          <BellOutlined style={{ fontSize: `${size}px` }} />
        </Badge>
      </button>
    </Popover>
  );
}
