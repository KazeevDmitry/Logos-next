const { test, expect } = require('@playwright/test');
const { EXPERT, confirmClick, newPerson, register, signIn, uniqueEmail } = require('./helpers');

/** "1 900 ₽" as the site writes it: any kind of space between the thousands. */
const priceText = (amount) =>
  new RegExp(`${amount.toLocaleString('ru-RU').replace(/\s/g, ' ').split(' ').join('\\s')} ₽`);

/**
 * A chat with an expert is a paid consultation: the customer pays from the
 * expert's profile, the expert earns the money with the first reply, and
 * the chat closes when both have finished.
 */
test.describe.serial('a paid consultation', () => {
  const customer = {
    name: 'Нина',
    surname: 'Консультова',
    email: uniqueEmail('consult'),
    password: 'Passw0rd-e2e',
  };
  let customerPage;
  let expertPage;
  let expert;
  let chatUrl;

  test.beforeAll(async ({ browser, request }) => {
    customerPage = await newPerson(browser);
    expertPage = await newPerson(browser);
    const found = await (
      await request.get('/api/v1/experts', { params: { search: EXPERT.name, pageSize: 50 } })
    ).json();
    // The demo expert the other tests sign in as.
    await signIn(expertPage, EXPERT);
    const me = await (await expertPage.request.get('/api/v1/experts/me')).json();
    expert = found.items.find((item) => item.id === me.id);
    expect(expert.consultationPrice).toBeGreaterThan(0);
  });

  test.afterAll(async () => {
    await customerPage.context().close();
    await expertPage.context().close();
  });

  test('a visitor sees the price and is asked to sign in', async ({ page }) => {
    await page.goto(`/expert/${expert.id}`);
    const write = page.getByRole('link', { name: /^Написать эксперту — / });
    await expect(write).toContainText(priceText(expert.consultationPrice));
    await expect(page.getByText(/Оплата открывает чат с экспертом/)).toBeVisible();
    await write.click();
    await expect(page).toHaveURL(/\/login\?next=/);
  });

  test('the customer pays from the profile and the chat opens', async () => {
    await register(customerPage, customer);
    await customerPage.goto(`/expert/${expert.id}`);
    await customerPage.getByRole('button', { name: /^Написать эксперту — / }).click();

    // The mock provider's page stands in for Robokassa.
    await expect(customerPage).toHaveURL(/\/payments\/mock\/\d+$/);
    await expect(customerPage.getByText('Оплата консультации эксперта')).toBeVisible();
    await expect(customerPage.getByText(priceText(expert.consultationPrice)).first()).toBeVisible();
    await customerPage.getByRole('button', { name: 'Оплатить', exact: true }).click();
    await expect(customerPage.getByText(/Оплата .* прошла/)).toBeVisible();
    await expect(customerPage.getByText(/Чат открыт\. Эксперт получит деньги/)).toBeVisible();

    await customerPage.getByRole('link', { name: 'Перейти в чат' }).click();
    await expect(customerPage).toHaveURL(/\/messages\?chat=\d+$/);
    chatUrl = new URL(customerPage.url()).pathname + new URL(customerPage.url()).search;
    await expect(customerPage.getByTestId('consultation-note')).toContainText(
      /Консультация оплачена .* Эксперт ответит до/,
    );

    await customerPage.getByLabel('Сообщение', { exact: true }).fill('Нужна помощь с договором');
    await customerPage.getByLabel('Сообщение', { exact: true }).press('Enter');
    await expect(customerPage.getByText('Нужна помощь с договором').last()).toBeVisible();

    // The money is held for the customer, not gone.
    await customerPage.goto('/finance');
    await expect(customerPage.getByText('Зарезервировано').locator('..')).toContainText(
      priceText(expert.consultationPrice),
    );
    // The profile now leads straight into the open chat.
    await customerPage.goto(`/expert/${expert.id}`);
    await expect(customerPage.getByRole('link', { name: 'Перейти в чат' })).toBeVisible();
  });

  test('the expert is told, replies and is paid, less the commission', async () => {
    await expertPage.goto('/');
    await expertPage.getByRole('button', { name: /Уведомления, непрочитанных/ }).click();
    await expect(expertPage.getByText('Оплачена консультация').first()).toBeVisible();

    await expertPage.goto(chatUrl);
    await expect(expertPage.getByTestId('consultation-note')).toContainText(
      /Заказчик оплатил консультацию .* Ответьте до/,
    );
    await expertPage.getByLabel('Сообщение', { exact: true }).fill('Пришлите договор, посмотрю');
    await expertPage.getByLabel('Сообщение', { exact: true }).press('Enter');
    await expect(expertPage.getByText('Пришлите договор, посмотрю').last()).toBeVisible();
    // The reply was in time: nothing is awaited any more.
    await expect(expertPage.getByTestId('consultation-note')).toHaveCount(0);

    await expertPage.goto('/finance');
    await expect(expertPage.getByText('Оплата консультации').first()).toBeVisible();
    const earned = expert.consultationPrice - Math.floor(expert.consultationPrice / 10);
    await expect(
      expertPage.getByText(new RegExp(`\\+${priceText(earned).source}`)).first(),
    ).toBeVisible();
  });

  test('the chat closes when both have finished, and can be paid for again', async () => {
    await customerPage.goto(chatUrl);
    await confirmClick(customerPage, 'Завершить');
    await expect(customerPage.getByTestId('consultation-note')).toContainText(
      'Вы завершили консультацию',
    );
    // Still open until the expert agrees.
    await expect(customerPage.getByLabel('Сообщение', { exact: true })).toBeVisible();

    await expertPage.goto(chatUrl);
    await expect(expertPage.getByTestId('consultation-note')).toContainText(
      'Собеседник завершил консультацию',
    );
    await confirmClick(expertPage, 'Завершить');
    await expect(expertPage.getByTestId('chat-gate')).toContainText('Консультация завершена');
    await expect(expertPage.getByLabel('Сообщение', { exact: true })).toHaveCount(0);
    // The conversation can still be read.
    await expect(expertPage.getByText('Нужна помощь с договором').last()).toBeVisible();

    await customerPage.goto(chatUrl);
    const gate = customerPage.getByTestId('chat-gate');
    await expect(gate).toContainText('Консультация завершена');
    await expect(gate.getByRole('button', { name: /^Начать новую консультацию — / })).toBeVisible();
    await expect(customerPage.getByLabel('Сообщение', { exact: true })).toHaveCount(0);
  });

  test('the expert changes the price in the account and the profile shows it', async ({ page }) => {
    await expertPage.goto('/personalaccount/services');
    const price = expertPage.getByLabel('Цена консультации');
    await expect(price).toHaveValue(String(expert.consultationPrice));
    await price.fill('3300');
    await expertPage.getByRole('button', { name: 'Сохранить' }).first().click();
    await expect(expertPage.getByText('Цена консультации сохранена')).toBeVisible();

    await page.goto(`/expert/${expert.id}`);
    await expect(page.getByRole('link', { name: /^Написать эксперту — 3\s300 ₽$/ })).toBeVisible();

    // Back to what the other tests found.
    await price.fill(String(expert.consultationPrice));
    await expertPage.getByRole('button', { name: 'Сохранить' }).first().click();
    await expect(expertPage.getByText('Цена консультации сохранена').last()).toBeVisible();
  });
});
