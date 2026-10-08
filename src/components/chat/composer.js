import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { chat } from '../../../lib/api';
import { errorMessage, errorStatus } from '../../../lib/api/client';
import FileUploader from '../fileUploader/fileUploader';

const MAX_FILES = 5;

/**
 * Text box and attachments for one chat. Enter sends, Shift+Enter breaks
 * the line. `onSent` receives the stored message.
 */
export default function Composer({ conversationId, onSent }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const empty = text.trim() === '' && files.length === 0;

  const send = async () => {
    if (empty || busy) return;
    setBusy(true);
    setError('');
    try {
      const message = await chat.send(conversationId, {
        text: text.trim() || undefined,
        fileIds: files.map((file) => file.id),
      });
      setText('');
      setFiles([]);
      onSent(message);
    } catch (e) {
      setError(errorStatus(e) === 429 ? 'Слишком много сообщений подряд. Подождите минуту.' : errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ borderTop: '1px solid #EEF0F4', padding: '12px 16px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        <Input.TextArea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onPressEnter={(event) => {
            if (!event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          autoSize={{ minRows: 1, maxRows: 6 }}
          maxLength={5000}
          placeholder="Напишите сообщение"
          aria-label="Сообщение"
        />
        <Button type="primary" icon={<SendOutlined />} loading={busy} disabled={empty} onClick={send} aria-label="Отправить" />
      </div>
      <div style={{ marginTop: '8px' }}>
        <FileUploader value={files} onChange={setFiles} max={MAX_FILES} label="Прикрепить файл" />
      </div>
      {error && (
        <div role="alert" style={{ color: '#F44336', marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
