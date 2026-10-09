import { PaperClipOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import moment from 'moment';
import UserImage from '../userImage/userImage';

import i18n from '../../../utils/i18n-init';
export const companionName = (user) => `${user.name} ${user.surname ?? ''}`.trim();

/** What the last message looked like, in one line. */
function preview(conversation, viewerId) {
  const last = conversation.lastMessage;
  if (!last) {
    return i18n.t('ui.conversationList.soobscheniyPokaNet');
  }
  const text = last.text || i18n.t('ui.conversationList.vlozhenie');
  return last.senderId === viewerId ? i18n.t('ui.conversationList.vy', { text }) : text;
}

/** The user's chats; `activeId` is the one open on the right. */
export default function ConversationList({ conversations, activeId, viewerId, onSelect }) {
  return (
    <ul
      aria-label={i18n.t('ui.conversationList.dialogi')}
      style={{ listStyle: 'none', margin: 0, padding: 0 }}
    >
      {conversations.map((conversation) => {
        const active = conversation.id === activeId;
        return (
          <li key={conversation.id}>
            <button
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(conversation.id)}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                width: '100%',
                textAlign: 'left',
                border: 'none',
                borderBottom: '1px solid #EEF0F4',
                padding: '12px 16px',
                cursor: 'pointer',
                background: active ? 'rgba(0, 102, 255, 0.08)' : 'white',
              }}
            >
              <UserImage image={conversation.companion.avatarUrl ?? ''} width={44} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <b style={ellipsis}>{companionName(conversation.companion)}</b>
                  {conversation.lastMessage && (
                    <span style={{ color: '#9AA1AD', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {moment(conversation.lastMessage.createdAt).calendar(null, CALENDAR)}
                    </span>
                  )}
                </span>
                <span style={{ ...ellipsis, display: 'block', color: '#0066FF', fontSize: '13px' }}>
                  {conversation.task.title}
                </span>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '8px',
                    color: '#5E6674',
                  }}
                >
                  <span style={ellipsis}>
                    {conversation.lastMessage && !conversation.lastMessage.text && (
                      <PaperClipOutlined />
                    )}{' '}
                    {preview(conversation, viewerId)}
                  </span>
                  <Badge count={conversation.unreadCount} size="small" />
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const ellipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};
/** Time for today, a short date otherwise. */
const CALENDAR = {
  sameDay: 'HH:mm',
  lastDay: i18n.t('ui.conversationList.vchera'),
  lastWeek: 'DD.MM',
  sameElse: 'DD.MM.YY',
  nextDay: 'DD.MM',
  nextWeek: 'DD.MM',
};
