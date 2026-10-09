import { Empty, Pagination, Row, Spin } from 'antd';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { experts } from '../../../lib/api';
import { useThemeContext } from '../../context/themeContext';
import FeedbackCard from './feedbackCard';

import i18n from '../../../utils/i18n-init';
const PAGE_SIZE = 6;

/** Paginated reviews of one expert, loaded from the API page by page. */
export default function Feedbacks({ expertId }) {
  const theme = useThemeContext();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['feedbacks', expertId, page],
    queryFn: () => experts.feedbacks(expertId, { page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
  const gutter = theme?.gutters?.gorizontal?.[theme?.id] ?? 20;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!data || data.total === 0) {
    return (
      <Empty description={i18n.t('ui.feedbacks.otzyvovPokaNet')} style={{ margin: '40px 0' }} />
    );
  }

  return (
    <>
      <Row style={{ width: '100%' }} gutter={[gutter, gutter]}>
        {data.items.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={data.total}
          hideOnSinglePage
          onChange={(next) => {
            window.scrollTo(0, 0);
            setPage(next);
          }}
          size={theme?.isDesktop ? 'default' : 'small'}
        />
      </Row>
    </>
  );
}
