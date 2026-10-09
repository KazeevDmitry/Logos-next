const { test, expect } = require('@playwright/test');
const { EXPERT, newPerson, register, uniqueEmail } = require('./helpers');

/** The admin panel is served by the API, not by the site. */
const ADMIN_URL = process.env.ADMIN_URL ?? 'http://localhost:4000';
/** Seeded by the API (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`). */
const ADMIN = { email: 'admin@logosest.local', password: 'Admin12345' };
/** The smallest file the API accepts as a PNG image. */
const PASSPORT = {
  name: 'passport.png',
  mimeType: 'image/png',
  buffer: Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.from('scan of a passport'),
  ]),
};

async function signInToPanel(page, { email, password }) {
  await page.goto(`${ADMIN_URL}/admin/login`);
  await page.locator('input[name=email]').fill(email);
  await page.locator('input[name=password]').fill(password);
  await page.getByRole('button', { name: 'Войти' }).click();
}

/** Clicks a button of a record and answers the "are you sure?" dialog with yes. */
async function confirmAction(page, action) {
  await page.getByTestId(`action-${action}`).click();
  await page.getByRole('button', { name: 'Подтвердить' }).click();
}

/**
 * Registers a person on the site, makes them an expert and sends a passport
 * scan for verification. Returns their ids and the id of the request.
 */
async function expertAskingForVerification(page, name) {
  const person = {
    name,
    surname: 'Проверкина',
    email: uniqueEmail('expert'),
    password: 'Passw0rd-e2e',
  };
  await register(page, person);
  const post = async (path, options) => {
    const response = await page.request.post(`/api/v1/${path}`, options);
    expect(response.ok(), `POST ${path}: ${response.status()}`).toBe(true);
    return response.json();
  };
  const expert = await post('experts/me', { data: {} });
  const scan = await post('files', { multipart: { file: PASSPORT } });
  const request = await post('experts/me/verification', { data: { passportFileId: scan.id } });
  return { ...person, userId: expert.user.id, expertId: expert.id, requestId: request.id };
}

/**
 * The back office, as an administrator uses it: sign in, see what is
 * waiting, check an expert's documents, write and publish an article,
 * block an account. Each step is then checked on the site itself.
 */
test.describe.serial('the admin panel', () => {
  let admin;
  let anna;
  let boris;
  let annaPage;
  let borisPage;

  test.beforeAll(async ({ browser }) => {
    admin = await newPerson(browser);
    annaPage = await newPerson(browser);
    borisPage = await newPerson(browser);
  });

  test.afterAll(async () => {
    for (const page of [admin, annaPage, borisPage]) {
      await page.context().close();
    }
  });

  const record = (table, id) => `${ADMIN_URL}/admin/resources/${table}/records/${id}/show`;

  test('is closed to visitors and to people who are not administrators', async () => {
    await admin.goto(`${ADMIN_URL}/admin`);
    await expect(admin).toHaveURL(/\/admin\/login$/);
    await expect(admin.getByText('Вход только для сотрудников')).toBeVisible();

    // A real account of the site with its right password, but not an administrator.
    await signInToPanel(admin, EXPERT);
    await expect(admin.getByText('Неверный e-mail или пароль')).toBeVisible();
    await expect(admin).toHaveURL(/\/admin\/login$/);
  });

  test('an administrator signs in and sees what is waiting', async () => {
    anna = await expertAskingForVerification(annaPage, 'Анна');

    await signInToPanel(admin, ADMIN);
    await expect(admin.getByText('Ждут вашего решения')).toBeVisible();
    const waiting = admin.getByTestId('card-Заявки на проверку');
    await expect(waiting.getByRole('heading')).toHaveText('1');

    await waiting.getByRole('link', { name: 'Открыть список' }).click();
    await expect(admin).toHaveURL(/VerificationRequest\?filters\.status=PENDING/);
    await expect(admin.locator('tbody tr')).toHaveCount(1);
    await expect(admin.locator('tbody tr')).toContainText('На проверке');
  });

  test('opens the passport scan, which nobody else can', async ({ request }) => {
    await admin.goto(record('VerificationRequest', anna.requestId));
    await admin.getByTestId('property-show-passport').getByRole('link').click();
    const link = admin.getByRole('link', { name: 'Открыть файл «passport.png»' });
    await expect(link).toBeVisible();
    const address = new URL(await link.getAttribute('href'), ADMIN_URL).toString();

    const scan = await admin.request.get(address);
    expect(scan.status()).toBe(200);
    expect(scan.headers()['content-type']).toBe('image/png');
    expect(Buffer.compare(await scan.body(), PASSPORT.buffer)).toBe(0);

    // Without the panel's session the address leads to the sign-in page.
    const anonymous = await request.get(address);
    expect(anonymous.url()).toMatch(/\/admin\/login$/);
    // The site's own address of the file is for its owner only.
    const publicAddress = address.replace('/admin/files/', '/uploads/');
    expect((await request.get(publicAddress)).status()).toBe(404);
    expect((await annaPage.request.get(new URL(publicAddress).pathname)).status()).toBe(200);
  });

  test('approves the documents and the expert gets the mark on the site', async () => {
    await admin.goto(record('VerificationRequest', anna.requestId));
    await expect(admin.getByTestId('action-approve')).toHaveText('Подтвердить документы');
    await confirmAction(admin, 'approve');
    await expect(admin.getByText('Эксперт проверен')).toBeVisible();
    await expect(admin.getByTestId('property-show-status')).toContainText('Подтверждена');
    // Decided: the buttons are gone.
    await expect(admin.getByTestId('action-approve')).toHaveCount(0);
    await expect(admin.getByTestId('action-reject')).toHaveCount(0);

    await annaPage.goto(`/expert/${anna.expertId}`);
    await expect(annaPage.locator('.anticon-safety-certificate').first()).toBeVisible();
  });

  test('rejects another request with a reason the expert then reads', async () => {
    boris = await expertAskingForVerification(borisPage, 'Борис');
    const reason = 'Скан обрезан: не видно серию и номер. Загрузите разворот целиком.';

    await admin.goto(record('VerificationRequest', boris.requestId));
    await admin.getByTestId('action-reject').click();
    await expect(admin.getByText('Эксперт увидит этот текст в личном кабинете')).toBeVisible();
    await admin.getByLabel('Причина отказа').fill(reason);
    await admin.getByRole('button', { name: 'Отклонить' }).click();
    await expect(admin.getByText('Заявка отклонена')).toBeVisible();
    await expect(admin.getByTestId('property-show-status')).toContainText('Отклонена');

    await borisPage.goto('/personalaccount/verification');
    await expect(borisPage.getByText(reason)).toBeVisible();
    await borisPage.goto(`/expert/${boris.expertId}`);
    await expect(borisPage.locator('.anticon-safety-certificate')).toHaveCount(0);
  });

  test('writes an article, which is on the site only after publishing', async ({ page }) => {
    const title = `Как проверить договор аренды ${Date.now()}`;
    await admin.goto(`${ADMIN_URL}/admin/resources/Article/actions/new`);
    await admin.getByTestId('property-edit-title').locator('input').fill(title);
    await admin
      .getByTestId('property-edit-content')
      .locator('textarea')
      .fill('## На что смотреть\n\nСрок, **цена** и порядок расторжения.');
    const [saved] = await Promise.all([
      admin.waitForResponse((response) => response.request().method() === 'POST'),
      admin.getByTestId('button-save').click(),
    ]);
    const article = (await saved.json()).record.params;
    // The address was left empty: it is made from the title.
    expect(article.slug).toMatch(/^kak-proverit-dogovor-arendy-\d+$/);

    // A draft: not on the site.
    expect((await page.goto(`/articles/${article.slug}`)).status()).toBe(404);

    await admin.goto(record('Article', article.id));
    await confirmAction(admin, 'publish');
    await expect(admin.getByText('Статья опубликована')).toBeVisible();

    await page.goto(`/articles/${article.slug}`);
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'На что смотреть' })).toBeVisible();

    await confirmAction(admin, 'unpublish');
    await expect(admin.getByText('Статья снята с публикации')).toBeVisible();
    expect((await page.goto(`/articles/${article.slug}`)).status()).toBe(404);
  });

  test('blocks an account: it is signed out at once and cannot sign in', async () => {
    await admin.goto(record('User', boris.userId));
    await confirmAction(admin, 'block');
    await expect(admin.getByText('Пользователь заблокирован')).toBeVisible();
    await expect(admin.getByTestId('property-show-status')).toContainText('Заблокирован');

    expect((await borisPage.request.get('/api/v1/users/me')).status()).toBeGreaterThanOrEqual(401);
    await borisPage.context().clearCookies();
    await borisPage.goto('/login');
    await borisPage.getByPlaceholder('E-mail').fill(boris.email);
    await borisPage.getByPlaceholder('Пароль').fill(boris.password);
    await borisPage.locator('button[type=submit]').click();
    await expect(borisPage.getByText('Аккаунт заблокирован')).toBeVisible();

    await confirmAction(admin, 'unblock');
    await expect(admin.getByText('Пользователь разблокирован')).toBeVisible();
  });

  test('cannot take the administrator role away from the last administrator', async () => {
    const users = await (
      await admin.request.get(
        `${ADMIN_URL}/admin/api/resources/User/actions/list?filters.email=${ADMIN.email}`,
      )
    ).json();
    const adminId = users.records[0].params.id;

    const response = await admin.request.post(
      `${ADMIN_URL}/admin/api/resources/User/records/${adminId}/edit`,
      { multipart: { role: 'USER', status: 'BLOCKED' } },
    );
    const body = await response.json();
    expect(body.notice.message).toBe('Это последний администратор: его роль изменить нельзя');
    expect(body.record.params).toMatchObject({ role: 'ADMIN', status: 'ACTIVE' });
    // The password hash never leaves the server.
    expect(body.record.params).not.toHaveProperty('passwordHash');
  });
});
