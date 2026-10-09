import { Pagination } from 'antd';
import { useRouter } from 'next/router';

/** Page switcher of a list whose page number lives in the URL (`?page=`). */
export default function MyPagination({ page, pageSize, total, setPage }) {
  const router = useRouter();

  const onChange = (value) => {
    router.push({ pathname: router.pathname, query: { ...router.query, page: value } }, undefined, {
      shallow: true,
    });
    setPage(value);
  };

  return (
    <Pagination
      current={page}
      onChange={onChange}
      total={total}
      pageSize={pageSize}
      hideOnSinglePage
      size="small"
    />
  );
}
