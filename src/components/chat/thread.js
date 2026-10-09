import { CheckOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import dayjs from '../../../utils/dayjs';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { chat } from '../../../lib/api';
import { useSocketEvent } from '../../context/socketContext';
import FileLink from '../fileLink/fileLink';
import Composer from './composer';

import i18n from '../../../utils/i18n-init';
const PAGE = 30;

function Bubble({ message, mine }) {
  return (
    <div
      style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', margin: '6px 0' }}
    >
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
            <FileLink url={file.url} style={{ color: 'inherit', textDecoration: 'underline' }}>
              <PaperClipOutlined /> {file.name}
            </FileLink>
          </div>
        ))}
        <div style={{ fontSize: '11px', opacity: 0.7, textAlign: 'right' }}>
          {dayjs(message.createdAt).format('HH:mm')}
          {mine && (
            <span
              role="img"
              aria-label={
                message.read ? i18n.t('ui.thread.prochitano') : i18n.t('ui.thread.otpravleno')
              }
              style={{ marginLeft: '6px' }}
            >
              <CheckOutlined />
              {message.read && <CheckOutlined style={{ marginLeft: '-7px' }} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const dayOf = (message) => dayjs(message.createdAt).format('YYYY-MM-DD');
const dayLabel = (date) =>
  dayjs(date).calendar(null, {
    sameDay: i18n.t('ui.thread.segodnya'),
    lastDay: i18n.t('ui.thread.vchera'),
    lastWeek: 'D MMMM',
    sameElse: 'D MMMM YYYY',
  });

/**
 * One chat: messages oldest at the top with earlier pages loaded on demand,
 * and the box for writing. Seeing the companion's messages marks them read;
 * own messages show one tick when sent and two when read.
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
    // The page remounts this component per chat (key), so state starts empty.
    let cancelled = false;
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

  const append = (message) => {
    setMessages((current) =>
      current.some((item) => item.id === message.id) ? current : [...current, message],
    );
  };

  // Pushed by the server for both sides, so the sender's other tabs follow too.
  useSocketEvent('message:new', (message) => {
    if (message.conversationId !== conversationId || state !== 'ready') return;
    append(message);
    if (message.senderId !== viewerId) {
      markRead();
    }
  });

  useSocketEvent('message:read', (event) => {
    if (event.conversationId === conversationId && event.readerId !== viewerId) {
      setMessages((current) =>
        current.map((item) => (item.senderId === viewerId ? { ...item, read: true } : item)),
      );
    }
  });

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
    return (
      <Result
        status="warning"
        title={i18n.t('ui.thread.neUdalosZagruzitPerepisku')}
        subTitle={i18n.t('ui.thread.obnoviteStranitsu')}
      />
    );
  }

  return (
    <>
      <div
        ref={box}
        style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}
        aria-live="polite"
      >
        {state === 'loading' && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Spin />
          </div>
        )}
        {hasMore && (
          <div style={{ textAlign: 'center' }}>
            <Button type="link" loading={loadingOlder} onClick={loadOlder}>
              {i18n.t('ui.thread.pokazatBoleeRannie')}
            </Button>
          </div>
        )}
        {state === 'ready' && messages.length === 0 && (
          <p style={{ color: '#5E6674', textAlign: 'center', marginTop: '60px' }}>
            {i18n.t('ui.thread.soobscheniyPokaNet')}
          </p>
        )}
        {messages.map((message, index) => {
          const day = dayOf(message);
          const newDay = index === 0 || day !== dayOf(messages[index - 1]);
          return (
            <div key={message.id}>
              {newDay && (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#9AA1AD',
                    fontSize: '12px',
                    margin: '12px 0 4px',
                  }}
                >
                  {dayLabel(message.createdAt)}
                </div>
              )}
              <Bubble message={message} mine={message.senderId === viewerId} />
            </div>
          );
        })}
      </div>
      {state === 'ready' && <Composer conversationId={conversationId} onSent={append} />}
    </>
  );
}
