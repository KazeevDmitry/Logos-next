import { Button, Input } from 'antd';
import dayjs from '../../../utils/dayjs';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { news } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { useUserContext } from '../../context/userContext';
import UserImage from '../userImage/userImage';

import i18n from '../../../utils/i18n-init';
const MAX_LENGTH = 3000;
/** Replies deeper than this are drawn at the same indent, so long threads stay readable on phones. */
const MAX_INDENT_LEVEL = 3;

/** Groups the API's flat list (oldest first) by parent id. */
function byParent(comments) {
  const map = new Map();
  for (const comment of comments) {
    const key = comment.parentId ?? 0;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(comment);
  }
  return map;
}

/** Text box for a new comment or a reply. */
function CommentForm({ articleId, parentId = null, onDone, autoFocus = false }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const mutation = useMutation({
    mutationFn: (body) => news.addComment(articleId, body),
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] });
      queryClient.invalidateQueries({ queryKey: ['article'] });
      onDone?.();
    },
  });

  return (
    <div style={{ marginTop: '10px' }}>
      <Input.TextArea
        autoFocus={autoFocus}
        autoSize={{ minRows: 2, maxRows: 8 }}
        maxLength={MAX_LENGTH}
        showCount
        value={text}
        placeholder={
          parentId ? i18n.t('ui.comments.vashOtvet') : i18n.t('ui.comments.vashKommentariy')
        }
        onChange={(e) => setText(e.target.value)}
      />
      {mutation.isError && (
        <div role="alert" style={{ color: '#F44336', marginTop: '6px' }}>
          {errorMessage(mutation.error)}
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Button
          type="primary"
          loading={mutation.isPending}
          disabled={!text.trim()}
          onClick={() => mutation.mutate({ text, parentId })}
        >
          {i18n.t('ui.comments.otpravit')}
        </Button>
        {onDone && <Button onClick={onDone}>{i18n.t('ui.comments.otmena')}</Button>}
      </div>
    </div>
  );
}

function Comment({ comment, tree, articleId, level, canReply }) {
  const [replying, setReplying] = useState(false);
  const { author } = comment;
  const replies = tree.get(comment.id) ?? [];

  return (
    <div
      style={{ marginTop: '20px', marginLeft: level > 0 && level <= MAX_INDENT_LEVEL ? '24px' : 0 }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <UserImage image={author.avatarUrl ?? ''} width={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <b>
              {author.name} {author.surname ?? ''}
            </b>
            <span style={{ color: '#5E6674', fontSize: '13px' }}>
              {dayjs(comment.createdAt).format('DD MMM YYYY, HH:mm')}
            </span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: '4px' }}>
            {comment.text}
          </div>
          {canReply && !replying && (
            <Button type="link" style={{ padding: 0 }} onClick={() => setReplying(true)}>
              {i18n.t('ui.comments.otvetit')}
            </Button>
          )}
          {replying && (
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              autoFocus
              onDone={() => setReplying(false)}
            />
          )}
        </div>
      </div>
      {replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          tree={tree}
          articleId={articleId}
          level={level + 1}
          canReply={canReply}
        />
      ))}
    </div>
  );
}

/** The comment thread of an article with a form for signed-in readers. */
export default function Comments({ articleId }) {
  const { currentUser } = useUserContext();
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: () => news.comments(articleId),
    refetchOnWindowFocus: false,
  });
  const tree = useMemo(() => byParent(comments), [comments]);
  const roots = tree.get(0) ?? [];

  return (
    <div>
      {currentUser ? (
        <CommentForm articleId={articleId} />
      ) : (
        <p style={{ color: '#5E6674' }}>
          <Link href="/login">{i18n.t('ui.comments.voydite')}</Link>
          {i18n.t('ui.comments.chtobyOstavitKommentariy')}
        </p>
      )}
      {!isLoading && roots.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {i18n.t('ui.comments.dlyaEtoyStatiPokaNet')}
        </p>
      )}
      {roots.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          tree={tree}
          articleId={articleId}
          level={0}
          canReply={Boolean(currentUser)}
        />
      ))}
    </div>
  );
}
