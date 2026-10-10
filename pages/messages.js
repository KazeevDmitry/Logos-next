import { ArrowLeftOutlined } from '@ant-design/icons';
import { Col, Empty, Spin } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { chat } from '../lib/api';
import { withAuth } from '../lib/withAuth';
import ConversationList, { companionName } from '../src/components/chat/conversationList';
import { FinishButton } from '../src/components/chat/consultation';
import Thread from '../src/components/chat/thread';
import PageContainer from '../src/components/layouts/pageContainer';
import PageHeader from '../src/components/layouts/pageHeader';
import UserImage from '../src/components/userImage/userImage';
import { useThemeContext } from '../src/context/themeContext';

import i18n from '../utils/i18n-init';
const panel = { background: 'white', borderRadius: '10px', overflow: 'hidden' };
const HEIGHT = 'max(420px, calc(100vh - 300px))';

/**
 * Chats between a customer and experts: paid consultations, started from an
 * expert's profile or with an expert who responded to the customer's task.
 * The open chat is in the URL (?chat=<id>), which is what notices link to.
 * On a phone the list and the open chat take the screen in turn.
 */
function MessagesPage({ user }) {
  const theme = useThemeContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: conversations, isLoading } = useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: () => chat.conversations(),
    refetchOnWindowFocus: false,
    // A chat opens when the customer pays and closes when both finish: neither is pushed.
    refetchInterval: 30_000,
  });
  const activeId = Number(router.query.chat) || null;
  const active = conversations?.find((conversation) => conversation.id === activeId) ?? null;

  const select = (id) =>
    router.push({ pathname: '/messages', query: id ? { chat: id } : {} }, undefined, {
      shallow: true,
    });
  const refreshChats = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['chat'] }),
    [queryClient],
  );

  const showList = theme.isDesktop || !active;
  const showThread = theme.isDesktop || Boolean(active);

  return (
    <>
      <PageHeader title={i18n.t('pages.messages.soobscheniya')} seo={{ noindex: true }} />
      <PageContainer>
        {isLoading && (
          <Col span={24} style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </Col>
        )}
        {conversations?.length === 0 && (
          <Col span={24}>
            <Empty
              style={{ margin: '60px 0' }}
              description={i18n.t('pages.messages.dialogovPokaNetChatOtkryvaetsya')}
            />
          </Col>
        )}
        {conversations?.length > 0 && showList && (
          <Col xs={24} sm={24} md={24} lg={8} xl={7}>
            <div
              style={{
                ...panel,
                maxHeight: theme.isDesktop ? HEIGHT : undefined,
                overflowY: 'auto',
              }}
            >
              <ConversationList
                conversations={conversations}
                activeId={activeId}
                viewerId={user.id}
                onSelect={select}
              />
            </div>
          </Col>
        )}
        {conversations?.length > 0 && showThread && (
          <Col xs={24} sm={24} md={24} lg={16} xl={17}>
            <div style={{ ...panel, height: HEIGHT, display: 'flex', flexDirection: 'column' }}>
              {active ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: '1px solid #EEF0F4',
                    }}
                  >
                    {!theme.isDesktop && (
                      <button
                        type="button"
                        aria-label={i18n.t('pages.messages.kSpiskuDialogov')}
                        onClick={() => select(null)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                      >
                        <ArrowLeftOutlined />
                      </button>
                    )}
                    <UserImage image={active.companion.avatarUrl ?? ''} width={40} />
                    <div style={{ minWidth: 0 }}>
                      <b>{companionName(active.companion)}</b>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {active.task ? (
                          <Link href={`/task/${active.task.id}`}>{active.task.title}</Link>
                        ) : (
                          <span style={{ color: '#5E6674' }}>
                            {i18n.t('ui.consultation.consultation')}
                          </span>
                        )}
                      </div>
                    </div>
                    <FinishButton conversation={active} onChanged={refreshChats} />
                  </div>
                  <Thread
                    key={active.id}
                    conversationId={active.id}
                    conversation={active}
                    viewerId={user.id}
                    onRead={refreshChats}
                    onChanged={refreshChats}
                  />
                </>
              ) : (
                <div style={{ margin: 'auto', color: '#5E6674' }}>
                  {activeId
                    ? i18n.t('pages.messages.dialogNeNayden')
                    : i18n.t('pages.messages.vyberiteDialogSleva')}
                </div>
              )}
            </div>
          </Col>
        )}
      </PageContainer>
    </>
  );
}

export default withAuth(MessagesPage);
