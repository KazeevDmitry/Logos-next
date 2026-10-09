import { MessageOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import Link from 'next/link';
import { useUnreadMessages } from '../../context/socketContext';

import i18n from '../../../utils/i18n-init';
/** The chat icon in the header with the number of unread messages. */
export default function MessagesLink({ size = 22 }) {
  const unread = useUnreadMessages();
  return (
    <Link
      href="/messages"
      aria-label={
        unread > 0
          ? i18n.t('ui.messagesLink.soobscheniyaNeprochitannyh', { unread })
          : i18n.t('ui.messagesLink.soobscheniya')
      }
      style={{ color: 'inherit', padding: '6px', lineHeight: 1, display: 'inline-block' }}
    >
      <Badge count={unread} size="small" overflowCount={99}>
        <MessageOutlined style={{ fontSize: `${size}px`, color: 'inherit' }} />
      </Badge>
    </Link>
  );
}
