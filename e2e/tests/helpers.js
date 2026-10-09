const { expect } = require('@playwright/test');

const MAIL_URL = process.env.MAIL_URL ?? 'http://localhost:8025';
/** Seeded by the API (`SEED_DEMO=true`). */
const DEMO_PASSWORD = 'Demo12345';
const EXPERT = { email: 'igor@demo.logosest.local', password: DEMO_PASSWORD, name: 'Игорь' };

/** A new signed-out browser, as a different person would have. */
async function newPerson(browser) {
  const context = await browser.newContext();
  return context.newPage();
}

async function signIn(page, { email, password }) {
  await page.goto('/login');
  await page.getByPlaceholder('E-mail').fill(email);
  await page.getByPlaceholder('Пароль').fill(password);
  await page.locator('button[type=submit]').click();
  await expect(page.getByRole('button', { name: /Меню пользователя/ })).toBeVisible();
}

/** Registers through the form; the site signs the new user in. */
async function register(page, { name, surname, email, password }) {
  await page.goto('/register');
  await page.getByPlaceholder('Имя').fill(name);
  await page.getByPlaceholder('Фамилия').fill(surname);
  await page.getByPlaceholder('E-mail').fill(email);
  await page.getByPlaceholder('Пароль', { exact: true }).fill(password);
  await page.getByPlaceholder('Повторите пароль').fill(password);
  await page.getByRole('checkbox').check();
  await page.locator('button[type=submit]').click();
  await expect(page.getByRole('button', { name: /Меню пользователя/ })).toBeVisible();
}

/** The newest e-mail to `address` whose text matches `pattern`, from the Mailpit inbox. */
async function findLinkInMail(request, address, pattern) {
  await expect
    .poll(async () => {
      const list = await (
        await request.get(`${MAIL_URL}/api/v1/search`, { params: { query: `to:${address}` } })
      ).json();
      for (const item of list.messages ?? []) {
        const message = await (await request.get(`${MAIL_URL}/api/v1/message/${item.ID}`)).json();
        const match = (message.Text ?? '').match(pattern);
        if (match) return match[0];
      }
      return null;
    })
    .not.toBeNull();
  const list = await (
    await request.get(`${MAIL_URL}/api/v1/search`, { params: { query: `to:${address}` } })
  ).json();
  for (const item of list.messages) {
    const message = await (await request.get(`${MAIL_URL}/api/v1/message/${item.ID}`)).json();
    const match = (message.Text ?? '').match(pattern);
    if (match) return match[0];
  }
  throw new Error(`No e-mail to ${address} matching ${pattern}`);
}

/** Clicks a button that asks "are you sure?" and answers yes. */
async function confirmClick(page, name) {
  await page.getByRole('button', { name, exact: true }).click();
  await page
    .locator('.ant-popover:not(.ant-popover-hidden)')
    .getByRole('button', { name: 'Да' })
    .click();
}

const uniqueEmail = (prefix) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}@e2e.logosest.local`;

module.exports = {
  EXPERT,
  DEMO_PASSWORD,
  newPerson,
  signIn,
  register,
  findLinkInMail,
  confirmClick,
  uniqueEmail,
};
