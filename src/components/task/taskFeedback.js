import { Button, Form, Input, Rate } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { tasks } from '../../../lib/api';
import { errorMessage } from '../../../lib/api/client';
import { useNotifyContext } from '../../context/notificationContext';

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
            {moment(task.feedback.createdAt).format('DD.MM.YYYY')}
          </span>
        </div>
        <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', marginTop: '10px' }}>
          {task.feedback.text}
        </div>
      </div>
    );
  }

  if (task.viewerStatus !== 'youAuthor') {
    return <span style={{ color: '#5E6674' }}>Заказчик пока не оставил отзыв.</span>;
  }

  const submit = async ({ stars, text }) => {
    setSending(true);
    try {
      await tasks.feedback(task.id, { stars, text: text.trim() });
      successNotification('Спасибо за отзыв', 'Он появится в профиле исполнителя.');
      onDone();
    } catch (e) {
      infoNotification('Не получилось сохранить отзыв', errorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={submit} requiredMark={false}>
      <p style={{ color: '#5E6674' }}>
        Оцените работу исполнителя. Отзыв увидят другие заказчики; изменить его потом нельзя.
      </p>
      <Form.Item
        name="stars"
        label="Оценка"
        rules={[{ required: true, type: 'number', min: 1, message: 'Поставьте оценку от 1 до 5' }]}
      >
        <Rate style={{ color: 'red' }} />
      </Form.Item>
      <Form.Item
        name="text"
        label="Отзыв"
        rules={[{ required: true, whitespace: true, message: 'Напишите пару слов о работе' }]}
      >
        <Input.TextArea
          rows={4}
          maxLength={3000}
          showCount
          placeholder="Что получилось хорошо, что можно улучшить"
        />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={sending}>
        Оставить отзыв
      </Button>
    </Form>
  );
}
