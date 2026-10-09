import axios from 'axios';
import i18n from '../../utils/i18n-init';
import apiErrors from '../../utils/Locales/apiErrors';

/** All backend routes live under this prefix; Next rewrites proxy it to the API. */
export const API_PREFIX = '/api/v1';

const isServer = typeof window === 'undefined';

/**
 * In the browser requests go to the same origin (cookies are sent
 * automatically). During server rendering there is no origin, so the API is
 * reached directly over the internal network.
 */
function baseURL() {
  return isServer ? `${process.env.API_INTERNAL_URL ?? 'http://localhost:4000'}${API_PREFIX}` : API_PREFIX;
}

/** Auth routes must not trigger a refresh-and-retry: a 401 there is the answer. */
const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let refreshing = null;

/** One refresh at a time, shared by every request that hit a 401 meanwhile. */
function refreshSession(instance) {
  refreshing ??= instance.post('/auth/refresh').finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/**
 * Creates an axios instance for the backend.
 *
 * Pass the `context` of getServerSideProps to act as the visiting user
 * during server rendering: their cookies are forwarded to the API.
 */
export function createApi(context) {
  const instance = axios.create({
    baseURL: baseURL(),
    withCredentials: true,
    headers: context?.req?.headers?.cookie ? { cookie: context.req.headers.cookie } : {},
  });

  if (!isServer) {
    // The access cookie lives 15 minutes. When it expires the API answers 401;
    // swap the refresh cookie for a new pair and repeat the request once.
    instance.interceptors.response.use(undefined, async (error) => {
      const { config, response } = error;
      const skip = !config || config.__retried || NO_REFRESH.some((path) => config.url?.startsWith(path));
      if (response?.status !== 401 || skip) {
        throw error;
      }
      try {
        await refreshSession(instance);
      } catch {
        throw error;
      }
      return instance({ ...config, __retried: true });
    });
  }
  return instance;
}

/** The browser-side client. In getServerSideProps use `createApi(context)` instead. */
export const api = createApi();

/**
 * What to tell the user about a failed request, in the site's language.
 * The API's own text is shown only where it is the site's language
 * (English); otherwise it is translated or replaced by a general message.
 */
export function errorMessage(error, fallback = i18n.t('errors.fallback')) {
  if (!error?.response) {
    return error?.request ? i18n.t('errors.network') : fallback;
  }
  const { status, data } = error.response;
  if (status === 429) {
    return i18n.t('errors.tooMany');
  }
  const english = (i18n.language ?? 'ru').startsWith('en');
  if (Array.isArray(data?.details) && data.details.length > 0) {
    return english ? data.details.join('; ') : i18n.t('errors.validation');
  }
  if (english) {
    return data?.message ?? fallback;
  }
  return apiErrors[data?.message] ?? fallback;
}

/** HTTP status of a failed request, or undefined for network errors. */
export const errorStatus = (error) => error?.response?.status;

/** Drops empty filters so they do not end up in the query string. */
export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}
