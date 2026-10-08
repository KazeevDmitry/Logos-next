import { DeleteOutlined, PaperClipOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useState } from 'react';
import { files as filesApi } from '../../../lib/api';
import { errorMessage, errorStatus } from '../../../lib/api/client';

const UPLOAD_ERRORS = {
  413: 'Файл слишком большой (максимум 10 МБ)',
  415: 'Подходят JPG, PNG, WEBP, PDF, DOC и DOCX',
};

/**
 * Uploads files one by one to POST /files and keeps the list of results.
 *
 * `value` / `onChange` carry the API's file objects ({ id, name, url, … }),
 * so the component works as an antd Form control; the form then sends
 * `value.map((file) => file.id)`.
 */
export default function FileUploader({ value = [], onChange, max = 5, accept, label = 'Прикрепить файл' }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file) => {
    setBusy(true);
    setError('');
    try {
      const uploaded = await filesApi.upload(file);
      onChange?.([...value, uploaded]);
    } catch (e) {
      setError(UPLOAD_ERRORS[errorStatus(e)] ?? errorMessage(e));
    } finally {
      setBusy(false);
    }
    // The upload is done here; stop antd from sending the file itself.
    return Upload.LIST_IGNORE;
  };

  return (
    <div>
      {value.map((file) => (
        <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <PaperClipOutlined />
          <a href={file.url} target="_blank" rel="noreferrer" style={{ overflowWrap: 'anywhere' }}>
            {file.name}
          </a>
          <Button
            type="text"
            size="small"
            aria-label={`Убрать ${file.name}`}
            icon={<DeleteOutlined />}
            onClick={() => onChange?.(value.filter((item) => item.id !== file.id))}
          />
        </div>
      ))}
      {value.length < max && (
        <Upload accept={accept} showUploadList={false} beforeUpload={upload} disabled={busy}>
          <Button icon={<UploadOutlined />} loading={busy}>
            {label}
          </Button>
        </Upload>
      )}
      {error && (
        <div role="alert" style={{ color: '#F44336', marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
