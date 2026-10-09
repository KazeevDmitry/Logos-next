const { test, expect } = require('@playwright/test');
const {
  ADMIN,
  EXPERT,
  confirmAction,
  confirmClick,
  findLinkInMail,
  newPerson,
  register,
  signIn,
  signInToPanel,
  uniqueEmail,
} = require('./helpers');

/**
 * The marketplace loop, end to end, with two people in two browsers:
 * a new customer publishes a task, an expert offers to do it, the customer
 * chooses and pays, the expert delivers, the customer accepts and reviews.
 */
test.describe.serial('a task from publication to review', () => {
  const customer = {
    name: 'Вера',
    surname: 'Тестова',
    email: uniqueEmail('customer'),
    password: 'Passw0rd-e2e',
  };
  const title = `Проверка договора аренды ${Date.now()}`;
  let customerPage;
  let expertPage;
  let taskUrl;

  test.beforeAll(async ({ browser }) => {
    customerPage = await newPerson(browser);
    expertPage = await newPerson(browser);
  });

  test.afterAll(async () => {
    await customerPage.context().close();
    await expertPage.context().close();
  });

  test('a visitor registers and confirms the e-mail', async ({ request }) => {
    await register(customerPage, customer);

    const link = await findLinkInMail(request, customer.email, /http\S+confirm-email\?token=\S+/);
    await customerPage.goto(new URL(link).pathname + new URL(link).search);
    await expect(customerPage.getByRole('heading', { name: 'E-mail подтверждён' })).toBeVisible();
  });

  test('the customer publishes a task', async () => {
    await customerPage.goto('/task/new');
    await customerPage.getByLabel('Название задачи').fill(title);
    await customerPage
      .getByLabel('Что нужно сделать')
      .fill('Проверить договор аренды офиса и указать на риски для арендатора.');
    await customerPage.getByLabel('Бюджет, ₽').fill('15000');
    await customerPage.getByRole('button', { name: 'Опубликовать задачу' }).click();

    await expect(customerPage.getByRole('heading', { level: 1, name: title })).toBeVisible();
    await expect(customerPage.getByText('Принимает отклики')).toBeVisible();
    taskUrl = new URL(customerPage.url()).pathname;
    expect(taskUrl).toMatch(/^\/task\/\d+$/);
  });

  test('the task is in the public catalogue', async () => {
    await expertPage.goto('/tasks');
    await expect(expertPage.getByText(title)).toBeVisible();
  });

  test('an expert offers to do it', async () => {
    await signIn(expertPage, EXPERT);
    await expertPage.goto(taskUrl);
    await expertPage.getByRole('button', { name: 'Откликнуться на задачу' }).click();
    await expertPage
      .getByLabel('Комментарий к задаче')
      .fill('Проверю за два дня, опыт по аренде 8 лет.');
    await expertPage.getByLabel('Ваша цена, ₽').fill('14000');
    await expertPage.getByRole('button', { name: 'Отправить отклик' }).click();

    await expect(expertPage.getByText('Вы откликнулись')).toBeVisible();
    await expect(expertPage.getByRole('heading', { name: 'Ваш отклик' })).toBeVisible();
  });

  test('the customer is notified and chooses the expert', async () => {
    await customerPage.goto(taskUrl);
    await expect(
      customerPage.getByRole('button', { name: /Уведомления, непрочитанных/ }),
    ).toBeVisible();
    await expect(customerPage.getByRole('heading', { name: 'Отклики (1)' })).toBeVisible();
    await customerPage.getByRole('button', { name: 'Выбрать исполнителем' }).click();

    await expect(customerPage.getByText('Ждёт подтверждения исполнителя')).toBeVisible();
  });

  test('the expert confirms', async () => {
    await expertPage.goto(taskUrl);
    await expertPage.getByRole('button', { name: 'Подтвердить участие' }).click();
    await expect(expertPage.getByText('Ждёт оплаты').first()).toBeVisible();
  });

  test('the customer pays and the money is held', async () => {
    await customerPage.goto(taskUrl);
    await customerPage.getByRole('button', { name: /^Оплатить 14\s000 ₽$/ }).click();

    // The mock provider's page stands in for the bank.
    await expect(customerPage).toHaveURL(/\/payments\/mock\/\d+$/);
    await customerPage.getByRole('button', { name: 'Оплатить', exact: true }).click();
    await expect(customerPage.getByText(/Оплата 14\s000 ₽ прошла/)).toBeVisible();

    await customerPage.getByRole('link', { name: 'Вернуться к задаче' }).click();
    await expect(customerPage.getByText('В работе').first()).toBeVisible();

    await customerPage.goto('/finance');
    await expect(customerPage.getByText('Зарезервировано').locator('..')).toContainText(
      /14\s000 ₽/,
    );
  });

  test('the expert submits the work', async () => {
    await expertPage.goto(taskUrl);
    await confirmClick(expertPage, 'Сдать работу');
    await expect(expertPage.getByText('На проверке').first()).toBeVisible();
  });

  test('the customer accepts and leaves a review', async () => {
    await customerPage.goto(taskUrl);
    await confirmClick(customerPage, 'Принять работу');
    await expect(customerPage.getByRole('heading', { name: 'Отзыв заказчика' })).toBeVisible();

    await customerPage.locator('.ant-rate-star').nth(4).click();
    await customerPage.getByLabel('Отзыв', { exact: true }).fill('Всё чётко и в срок, рекомендую.');
    await customerPage.getByRole('button', { name: 'Оставить отзыв' }).click();
    await expect(customerPage.getByText('Всё чётко и в срок, рекомендую.')).toBeVisible();
    // Not public yet: an administrator reads every review first.
    await expect(customerPage.getByText('На проверке')).toBeVisible();
    await expertPage.goto(taskUrl);
    await expect(expertPage.getByText('Заказчик пока не оставил отзыв.')).toBeVisible();
  });

  test('an administrator publishes the review', async ({ browser }) => {
    const admin = await newPerson(browser);
    await signInToPanel(admin, ADMIN);
    const waiting = admin.getByTestId('card-Отзывы на проверке');
    await expect(waiting.getByRole('heading')).toHaveText('1');
    await waiting.getByRole('link', { name: 'Открыть список' }).click();

    const row = admin.locator('tbody tr', { hasText: 'Всё чётко и в срок, рекомендую.' });
    await expect(row).toContainText('На проверке');
    // A click on the row opens the review.
    await row.getByText('Всё чётко и в срок, рекомендую.').click();
    await confirmAction(admin, 'approve');
    await expect(admin.getByText('Отзыв опубликован')).toBeVisible();
    await admin.context().close();

    await customerPage.reload();
    await expect(customerPage.getByText('На проверке')).toHaveCount(0);
  });

  test('the expert is paid, less the commission, and the review is on the profile', async () => {
    await expertPage.goto('/finance');
    // 14 000 minus the platform's 10 %.
    await expect(expertPage.getByText('Оплата за выполненную задачу').first()).toBeVisible();
    await expect(expertPage.getByText(/\+12\s600 ₽/).first()).toBeVisible();

    await expertPage.goto(taskUrl);
    await expertPage
      .getByRole('link', { name: new RegExp(EXPERT.name) })
      .first()
      .click();
    await expect(expertPage).toHaveURL(/\/expert\/\d+$/);
    await expertPage.getByRole('tab', { name: /Отзывы/ }).click();
    // The review is in the list and in the side column.
    await expect(expertPage.getByText('Всё чётко и в срок, рекомендую.').first()).toBeVisible();
  });

  test('the two can talk in the chat of the task', async () => {
    await customerPage.goto(taskUrl);
    await customerPage.getByRole('link', { name: /Написать эксперту/ }).click();
    await expect(customerPage).toHaveURL(/\/messages\?chat=\d+$/);
    const text = `Спасибо за работу! ${Date.now()}`;
    await customerPage.getByLabel('Сообщение', { exact: true }).fill(text);
    await customerPage.getByLabel('Сообщение', { exact: true }).press('Enter');
    await expect(customerPage.getByText(text).last()).toBeVisible();

    await expertPage.goto('/messages');
    await expect(expertPage.getByRole('link', { name: /Сообщения, непрочитанных/ })).toBeVisible();
    await expertPage
      .getByRole('button', { name: new RegExp(customer.name) })
      .first()
      .click();
    await expect(expertPage.getByText(text).last()).toBeVisible();
  });
});
