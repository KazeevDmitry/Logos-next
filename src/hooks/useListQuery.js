import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useQuery } from 'react-query';

const toInt = (value) => {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : undefined;
};

/** SearchField stores the text URI-encoded; tolerate plain text too. */
function decodeSearch(value) {
  if (typeof value !== 'string' || value === '') {
    return undefined;
  }
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

/**
 * Turns the URL query of a list page into API parameters.
 * `filters` maps a URL key to an API key and a kind:
 *
 *     { branch: ['branchId', 'int'], contractual: ['contractual', 'bool'] }
 */
export function listParams(query, filters = {}, pageSize = 10) {
  const params = { page: toInt(query.page) ?? 1, pageSize, search: decodeSearch(query.search) };
  for (const [urlKey, [apiKey, kind]] of Object.entries(filters)) {
    const raw = query[urlKey];
    if (raw === undefined || raw === '') continue;
    if (kind === 'int') params[apiKey] = toInt(raw);
    else if (kind === 'bool') params[apiKey] = raw === 'true' ? true : raw === 'false' ? false : undefined;
    else params[apiKey] = raw;
  }
  return params;
}

/**
 * Data for a paginated, filterable list page whose state lives in the URL.
 *
 * `serverData` is what getServerSideProps rendered; it seeds only the query
 * for the URL the page was opened with, never a later page or filter.
 * Returns react-query's result plus the `params` and current `page`.
 */
export function useListQuery(name, fetcher, { filters, pageSize = 10, serverData } = {}) {
  const router = useRouter();
  const params = listParams(router.query, filters, pageSize);
  const key = [name, params];
  const firstKey = useRef(JSON.stringify(key));
  const isFirst = firstKey.current === JSON.stringify(key);

  const result = useQuery(key, () => fetcher(params), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    initialData: isFirst && serverData ? serverData : undefined,
    // Server-rendered data is fresh; do not refetch it right after hydration.
    staleTime: 30_000,
  });
  return { ...result, params, page: params.page };
}

/**
 * getServerSideProps for a list page: fetches the first render's data as the
 * visitor. On an API failure the page renders empty and retries in the browser.
 */
export function listServerProps(fetcher, { filters, pageSize = 10, extra } = {}) {
  return async (context) => {
    const { createApi } = await import('../../lib/api/client');
    const http = createApi(context);
    const more = extra ? await extra(http).catch(() => ({})) : {};
    try {
      const serverData = await fetcher(listParams(context.query, filters, pageSize), http);
      return { props: { serverData, ...more } };
    } catch {
      return { props: { serverData: null, ...more } };
    }
  };
}
