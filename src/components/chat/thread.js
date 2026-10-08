import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chat } from '../../../lib/api';

const PAGE = 30;

function Bubble({ message, mine }) {
  return (
    <div style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', margin: '6px 0' }}>
      <div
        style={{
          maxWidth: 'min(520px, 82%)',
          padding: '8px 12px',
          borderRadius: mine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: mine ? '#0066FF' : '#F0F2F6',
          color: mine ? 'white' : 'black',
          overflowWrap: 'anywhere',
        }}
      >
        {message.text && <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>}
        {message.attachments.map((file) => (
          <div key={file.id}>
            <a href={file.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
              <PaperClipOutlined /> {file.name}
            </a>
          </div>
        ))}
        <div style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>{moment(message.createdAt).format('HH:mm')}</div>
      </div>
    </div>
  );
}

const dayLabel = (date) =>
  moment(date).calendar(null, { sameDay: '[Сегодня]', lastDay: '[Вчера]', lastWeek: 'D MMMM', sameElse: 'D MMMM YYYY' });

/**
 * Messages of one chat, oldest at the top, with earlier pages loaded on
 * demand. Opening the chat marks the companion's messages as read.
 */
export default function Thread({ conversationId, viewerId, onRead }) {
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [loadingOlder, setLoadingOlder] = useState(false);
  const box = useRef(null);
  // After loading older messages the view must stay where it was, not jump to the top.
  const keepFromBottom = useRef(null);

  const markRead = useCallback(() => {
    chat
      .read(conversationId)
      .then(onRead)
      .catch(() => undefined);
  }, [conversationId, onRead]);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    setMessages([]);
    chat
      .history(conversationId, { limit: PAGE })
      .then((page) => {
        if (cancelled) return;
        setMessages(page.items);
        setHasMore(page.hasMore);
        setState('ready');
        markRead();
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [conversationId, markRead]);

  const lastId = messages[messages.length - 1]?.id;
  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    if (keepFromBottom.current !== null) {
      element.scrollTop = element.scrollHeight - keepFromBottom.current;
      keepFromBottom.current = null;
    } else {
      element.scrollTop = element.scrollHeight;
    }
  }, [lastId, messages.length]);

  const loadOlder = async () => {
    setLoadingOlder(true);
    try {
      const page = await chat.history(conversationId, { limit: PAGE, before: messages[0].id });
      keepFromBottom.current = box.current.scrollHeight - box.current.scrollTop;
      setMessages((current) => [...page.items, ...current]);
      setHasMore(page.hasMore);
    } finally {
      setLoadingOlder(false);
    }
  };

  if (state === 'error') {
    return <Result status="warning" title="Не удалось загрузить переписку" subTitle="Обновите страницу." />;
  }

  let previousDay = null;
  return (
    <div ref={box} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }} aria-live="polite">
      {state === 'loading' && (
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Spin />
        </div>
      )}
      {hasMore && (
        <div style={{ textAlign: 'center' }}>
          <Button type="link" loading={loadingOlder} onClick={loadOlder}>
            Показать более ранние
          </Button>
        </div>
      )}
      {state === 'ready' && messages.length === 0 && (
        <p style={{ color: '#5E6674', textAlign: 'center', marginTop: '60px' }}>Сообщений пока нет.</p>
      )}
      {messages.map((message) => {
        const day = moment(message.createdAt).format('YYYY-MM-DD');
        const newDay = day !== previousDay;
        previousDay = day;
        return (
          <div key={message.id}>
            {newDay && (
              <div style={{ textAlign: 'center', color: '#9AA1AD', fontSize: '12px', margin: '12px 0 4px' }}>
                {dayLabel(message.createdAt)}
              </div>
            )}
            <Bubble message={message} mine={message.senderId === viewerId} />
          </div>
        );
      })}
    </div>
  );
}
