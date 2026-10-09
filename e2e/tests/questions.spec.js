const { test, expect } = require('@playwright/test');
const { EXPERT, newPerson, register, signIn, uniqueEmail } = require('./helpers');

test.describe.serial('questions and answers', () => {
  const asker = {
    name: 'Глеб',
    surname: 'Вопросов',
    email: uniqueEmail('asker'),
    password: 'Passw0rd-e2e',
  };
  const title = `Можно ли вернуть задаток ${Date.now()}?`;
  const answer =
    'Да, если договор не был заключён по вине продавца — в двойном размере (ст. 381 ГК РФ).';
  let questionUrl;

  test('a signed-out visitor is sent to sign in before asking', async ({ page }) => {
    await page.goto('/addquestion');
    await expect(page).toHaveURL(/\/login\?next=/);
  });

  test('a user asks a question', async ({ browser }) => {
    const page = await newPerson(browser);
    await register(page, asker);
    await page.goto('/addquestion');
    await page.getByLabel('Заголовок вопроса').fill(title);
    await page
      .getByLabel('Подробности')
      .fill('Внёс задаток за квартиру, продавец передумал продавать.');
    await page.getByLabel('Отрасль права').click();
    await page.locator('.ant-select-tree-node-content-wrapper').first().click();
    await page.getByRole('button', { name: 'Опубликовать вопрос' }).click();

    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    questionUrl = new URL(page.url()).pathname;
    await page.context().close();
  });

  test('an expert answers and the answer is public', async ({ browser, page }) => {
    const expertPage = await newPerson(browser);
    await signIn(expertPage, EXPERT);
    await expertPage.goto(questionUrl);
    await expertPage.getByLabel('Ваш ответ').fill(answer);
    await expertPage.getByRole('button', { name: 'Ответить на вопрос' }).click();
    await expect(expertPage.getByText(answer)).toBeVisible();
    await expertPage.context().close();

    // `page` is a signed-out visitor.
    await page.goto(questionUrl);
    await expect(page.getByText(answer)).toBeVisible();
    await page.goto('/questions');
    await expect(page.getByText(title)).toBeVisible();
  });
});
