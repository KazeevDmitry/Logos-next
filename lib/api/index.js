/**
 * Every backend call the frontend makes, grouped by resource.
 *
 * Each function takes an optional axios instance as its last argument:
 * omit it in the browser, pass `createApi(context)` in getServerSideProps.
 * All functions resolve to the response body.
 */
import { api, cleanParams } from './client';

const data = (promise) => promise.then((response) => response.data);

export const auth = {
  register: (body, http = api) => data(http.post('/auth/register', body)),
  login: (body, http = api) => data(http.post('/auth/login', body)),
  logout: (http = api) => data(http.post('/auth/logout')),
  confirmEmail: (token, http = api) => data(http.post('/auth/confirm-email', { token })),
  resendConfirmation: (http = api) => data(http.post('/auth/resend-confirmation')),
  forgotPassword: (email, http = api) => data(http.post('/auth/forgot-password', { email })),
  resetPassword: (token, password, http = api) =>
    data(http.post('/auth/reset-password', { token, password })),
  /** Which "sign in with …" services the installation offers: { providers: ['yandex', …] }. */
  oauthProviders: (http = api) => data(http.get('/auth/oauth/providers')),
};

export const users = {
  me: (http = api) => data(http.get('/users/me')),
  update: (body, http = api) => data(http.patch('/users/me', body)),
  changePassword: (body, http = api) => data(http.post('/users/me/password', body)),
  setAvatar: (file, http = api) => data(http.post('/users/me/avatar', fileForm(file))),
  removeAvatar: (http = api) => data(http.delete('/users/me/avatar')),
};

export const reference = {
  branches: (http = api) => data(http.get('/branches')),
  specializations: (http = api) => data(http.get('/specializations')),
  cities: (search, http = api) =>
    data(http.get('/cities', { params: cleanParams({ search, limit: 20 }) })),
  city: (id, http = api) => data(http.get(`/cities/${id}`)),
};

export const files = {
  upload: (file, http = api) => data(http.post('/files', fileForm(file))),
};

export const experts = {
  list: (params, http = api) => data(http.get('/experts', { params: cleanParams(params) })),
  top: (limit = 9, http = api) => data(http.get('/experts/top', { params: { limit } })),
  get: (id, http = api) => data(http.get(`/experts/${id}`)),
  feedbacks: (id, params, http = api) =>
    data(http.get(`/experts/${id}/feedbacks`, { params: cleanParams(params) })),
  mine: (http = api) => data(http.get('/experts/me')),
  become: (body, http = api) => data(http.post('/experts/me', body)),
  update: (body, http = api) => data(http.patch('/experts/me', body)),
  replaceServices: (services, http = api) => data(http.put('/experts/me/services', { services })),
  educations: (http = api) => data(http.get('/experts/me/educations')),
  addEducation: (body, http = api) => data(http.post('/experts/me/educations', body)),
  updateEducation: (id, body, http = api) => data(http.patch(`/experts/me/educations/${id}`, body)),
  removeEducation: (id, http = api) => data(http.delete(`/experts/me/educations/${id}`)),
  verification: (http = api) => data(http.get('/experts/me/verification')),
  requestVerification: (passportFileId, http = api) =>
    data(http.post('/experts/me/verification', { passportFileId })),
};

export const news = {
  categories: (http = api) => data(http.get('/categories')),
  list: (params, http = api) => data(http.get('/articles', { params: cleanParams(params) })),
  get: (slug, http = api) => data(http.get(`/articles/${encodeURIComponent(slug)}`)),
  similar: (slug, limit = 2, http = api) =>
    data(http.get(`/articles/${encodeURIComponent(slug)}/similar`, { params: { limit } })),
};

export const seo = {
  /** What administrators set for search engines on the site's fixed pages. */
  pages: (http = api) => data(http.get('/seo/pages')),
};

export const questions = {
  list: (params, http = api) => data(http.get('/questions', { params: cleanParams(params) })),
  get: (id, http = api) => data(http.get(`/questions/${id}`)),
  create: (body, http = api) => data(http.post('/questions', body)),
  answers: (id, http = api) => data(http.get(`/questions/${id}/answers`)),
  answer: (id, text, http = api) => data(http.post(`/questions/${id}/answers`, { text })),
};

export const tasks = {
  list: (params, http = api) => data(http.get('/tasks', { params: cleanParams(params) })),
  get: (id, http = api) => data(http.get(`/tasks/${id}`)),
  create: (body, http = api) => data(http.post('/tasks', body)),
  update: (id, body, http = api) => data(http.patch(`/tasks/${id}`, body)),
  /** choose | unassign | decline | confirm | submit | request-changes | accept | dispute | cancel */
  act: (id, action, body = {}, http = api) => data(http.post(`/tasks/${id}/${action}`, body)),
  responses: (id, http = api) => data(http.get(`/tasks/${id}/responses`)),
  respond: (id, body, http = api) => data(http.post(`/tasks/${id}/responses`, body)),
  withdrawResponse: (id, http = api) => data(http.delete(`/tasks/${id}/responses/mine`)),
  feedback: (id, body, http = api) => data(http.post(`/tasks/${id}/feedback`, body)),
  fund: (id, http = api) => data(http.post(`/tasks/${id}/fund`)),
  mine: (params, http = api) => data(http.get('/tasks/mine', { params: cleanParams(params) })),
  performing: (params, http = api) =>
    data(http.get('/tasks/performing', { params: cleanParams(params) })),
  responded: (params, http = api) =>
    data(http.get('/tasks/responded', { params: cleanParams(params) })),
};

export const notifications = {
  list: (params, http = api) => data(http.get('/notifications', { params: cleanParams(params) })),
  unreadCount: (http = api) => data(http.get('/notifications/unread-count')),
  read: (id, http = api) => data(http.post(`/notifications/${id}/read`)),
  readAll: (http = api) => data(http.post('/notifications/read-all')),
};

export const chat = {
  conversations: (http = api) => data(http.get('/conversations')),
  unreadCount: (http = api) => data(http.get('/conversations/unread-count')),
  history: (id, params, http = api) =>
    data(http.get(`/conversations/${id}/messages`, { params: cleanParams(params) })),
  send: (id, body, http = api) => data(http.post(`/conversations/${id}/messages`, body)),
  read: (id, http = api) => data(http.post(`/conversations/${id}/read`)),
  /** The customer starts the payment that opens the chat (a consultation). */
  pay: (id, http = api) => data(http.post(`/conversations/${id}/pay`)),
  /** The caller is done; the chat closes when the other side is too. */
  finish: (id, http = api) => data(http.post(`/conversations/${id}/finish`)),
};

export const consultations = {
  /**
   * "Написать эксперту" from a profile: { conversationId, payment }, where
   * `payment` is null when the chat with the expert is open already.
   */
  start: (expertId, http = api) => data(http.post(`/experts/${expertId}/consultation`)),
};

export const finance = {
  balance: (http = api) => data(http.get('/finance/balance')),
  transactions: (params, http = api) =>
    data(http.get('/finance/transactions', { params: cleanParams(params) })),
  payouts: (http = api) => data(http.get('/finance/payouts')),
  requestPayout: (body, http = api) => data(http.post('/finance/payouts', body)),
  payment: (id, http = api) => data(http.get(`/payments/${id}`)),
  mockComplete: (id, outcome = 'succeeded', http = api) =>
    data(http.post(`/payments/${id}/mock-complete`, { outcome })),
};

/** Multipart body with the file under the field name the API expects. */
function fileForm(file) {
  const form = new FormData();
  form.append('file', file);
  return form;
}
