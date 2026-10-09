import { Button, Form, Input, Rate } from 'antd';
import dayjs from '../../../utils/dayjs';
import { useState } from 'react';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { useNotifyContext } from '../../context/notificationContext';

import i18n from '../../../utils/i18n-init';
/**
 * The author's review of a completed task: a form until it is left (once,
 * by the author), the review itself afterwards for everyone.
 */
export default function TaskFeedback({ task, onDone }) {
  const { successNotification, infoNotification } = useNotifyContext();
  const [sending, setSending] = useState(false);

  if (task.status !== 'COMPLETED') {
    return null;
  }

  if (task.feedback) {
    return (
      <div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Rate disabled value={task.feedback.stars} style={{ color: 'red' }} />
          <span style={{ color: '#5E6674' }}>
            {dayjs(task.feedback.createdAt).format('DD.MM.YYYY')}
          </span>
          {/* Only the author is sent a review that is not published yet. */}
          {task.feedback.status === 'PENDING' && (
            <span style={{ color: '#C98A0B' }}>{i18n.t('ui.taskFeedback.naProverke')}</span>
          )}
          {task.feedback.status === 'REJECTED' && (
            <span style={{ color: '#F44336' }}>{i18n.t('ui.taskFeedback.otklonen')}</span>
          )}
        </div>
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: '10px' }}>
          {task.feedback.text}
        </div>
      </div>
    );
  }

  if (task.viewerStatus !== 'youAuthor') {
    return (
      <span style={{ color: '#5E6674' }}>
        {i18n.t('ui.taskFeedback.zakazchikPokaNeOstavilOtzyv')}
      </span>
    );
  }

  const submit = async ({ stars, text }) => {
    setSending(true);
    try {
      await tasks.feedback(task.id, { stars, text: text.trim() });
      successNotification(
        i18n.t('ui.taskFeedback.spasiboZaOtzyv'),
        i18n.t('ui.taskFeedback.onPoyavitsyaVProfileIspolnitelya'),
      );
      onDone();
    } catch (e) {
      infoNotification(i18n.t('ui.taskFeedback.nePoluchilosSohranitOtzyv'), errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={submit} requiredMark={false}>
      <p style={{ color: '#5E6674' }}>
        {i18n.t('ui.taskFeedback.otseniteRabotuIspolnitelyaOtzyvUvidyat')}
      </p>
      <Form.Item
        name="stars"
        label={i18n.t('ui.taskFeedback.otsenka')}
        rules={[
          {
            required: true,
            type: 'number',
            min: 1,
            message: i18n.t('ui.taskFeedback.postavteOtsenkuOt1Do'),
          },
        ]}
      >
        <Rate style={{ color: 'red' }} />
      </Form.Item>
      <Form.Item
        name="text"
        label={i18n.t('ui.taskFeedback.otzyv')}
        rules={[
          {
            required: true,
            whitespace: true,
            message: i18n.t('ui.taskFeedback.napishiteParuSlovORabote'),
          },
        ]}
      >
        <Input.TextArea
          rows={4}
          maxLength={3000}
          showCount
          placeholder={i18n.t('ui.taskFeedback.chtoPoluchilosHoroshoChtoMozhno')}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={sending}>
        {i18n.t('ui.taskFeedback.ostavitOtzyv')}
      </Button>
    </Form>
  );
}
