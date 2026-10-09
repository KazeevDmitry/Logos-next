const { test, expect } = require('@playwright/test');
const {
  ADMIN,
  ADMIN_URL,
  EXPERT,
  confirmAction,
  newPerson,
  signIn,
  signInToPanel,
} = require('./helpers');

/** The smallest file the API accepts as a PNG image. */
const PICTURE = {
  name: 'share.png',
  mimeType: 'image/png',
  buffer: Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    Buffer.from('picture for link previews'),
  ]),
};

const edit = (resource, id) => `${ADMIN_URL}/admin/resources/${resource}/records/${id}/edit`;
const field = (page, name) => page.getByTestId(`property-edit-${name}`);
/** Presses "Сохранить" and returns the panel's answer. */
async function save(page) {
  const [response] = await Promise.all([
    page.waitForResponse((answer) => answer.request().method() === 'POST'),
    page.getByTestId('button-save').click(),
  ]);
  return response.json();
}
/** A block of structured data of the page, parsed: "page" is the site's own, "custom" the administrator's. */
async function jsonLd(page, id) {
  return JSON.parse(await page.locator(`script[data-json-ld="${id}"]`).textContent());
}
const meta = (page, name) => page.locator(`meta[name="${name}"]`);
const sitemap = async (page) => (await page.request.get('/sitemap.xml')).text();

/**
 * What an administrator tells search engines in the admin panel, and what
 * a search engine then finds on the site.
 */
test.describe.serial('seo', () => {
  let admin;
  let expertsPageId;

  test.beforeAll(async ({ browser }) => {
    admin = await newPerson(browser);
    await signInToPanel(admin, ADMIN);
    await expect(admin.getByText('Ждут вашего решения')).toBeVisible();
    // The table of fixed pages: one row per page.
    await admin.goto(`${ADMIN_URL}/admin/resources/SeoPage`);
    await expect(admin.locator('tbody tr')).toHaveCount(6);
    const list = await admin.request.get(`${ADMIN_URL}/admin/api/resources/SeoPage/actions/list`);
    const rows = (await list.json()).records.map((row) => row.params);
    expect(rows.map((row) => row.path).sort()).toEqual(
      ['/', '/agreement', '/articles', '/experts', '/questions', '/tasks'].sort(),
    );
    expertsPageId = rows.find((row) => row.path === '/experts').id;
  });

  test.afterAll(async () => {
    // The catalogue of experts goes back to what the site says about it itself.
    await admin.request.post(
      `${ADMIN_URL}/admin/api/resources/SeoPage/records/${expertsPageId}/edit`,
      { multipart: { title: '', description: '', noindex: 'false', jsonLd: '' } },
    );
    await admin.request.delete(`${ADMIN_URL}/admin/seo-pages/${expertsPageId}/image`);
    await admin.context().close();
  });

  test('a fixed page says what the site made up until an administrator sets something', async ({
    page,
  }) => {
    await page.goto('/experts');
    await expect(page).toHaveTitle('Эксперты — LogosEst');
    await expect(meta(page, 'robots')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('script[data-json-ld="custom"]')).toHaveCount(0);
    expect(await sitemap(page)).toContain('/experts</loc>');
  });

  test('an administrator sets the title, description, picture and structured data of a page', async ({
    page,
  }) => {
    await admin.goto(edit('SeoPage', expertsPageId));
    // The address of the page is the site's own.
    await expect(field(admin, 'path').locator('input')).toBeDisabled();
    await field(admin, 'title').locator('input').fill('Найти юриста онлайн: каталог экспертов');
    await field(admin, 'description')
      .locator('textarea')
      .fill('Проверенные юристы, адвокаты и нотариусы со всей России.');

    // Broken JSON is refused with a message under the field; nothing is saved.
    await field(admin, 'jsonLd').locator('textarea').fill('{"@type": "FAQPage",}');
    await save(admin);
    await expect(field(admin, 'jsonLd')).toContainText('Это не разметка JSON-LD');
    await page.goto('/experts');
    await expect(page).toHaveTitle('Эксперты — LogosEst');

    await field(admin, 'jsonLd')
      .locator('textarea')
      .fill('{"@context":"https://schema.org","@type":"FAQPage","name":"Вопросы о <юристах>"}');
    expect((await save(admin)).notice.type).toBe('success');

    // The picture is saved at once, apart from the form.
    await admin.goto(edit('SeoPage', expertsPageId));
    const picture = admin.getByTestId('seo-image');
    await expect(picture).toContainText('Картинки нет');
    await picture.locator('input[type=file]').setInputFiles(PICTURE);
    await expect(picture.getByRole('button', { name: 'Убрать картинку' })).toBeVisible();

    await page.goto('/experts');
    // The administrator's title is used as it is, without the site's name.
    await expect(page).toHaveTitle('Найти юриста онлайн: каталог экспертов');
    await expect(meta(page, 'description')).toHaveAttribute(
      'content',
      'Проверенные юристы, адвокаты и нотариусы со всей России.',
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Найти юриста онлайн: каталог экспертов',
    );
    const image = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(image).toMatch(/\/uploads\/[0-9a-f-]+\.png$/);
    expect((await page.request.get(new URL(image, page.url()).pathname)).status()).toBe(200);
    expect(await jsonLd(page, 'custom')).toEqual({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      name: 'Вопросы о <юристах>',
    });
    // The heading people read stays the page's own.
    await expect(page.getByRole('heading', { level: 1, name: 'Эксперты' })).toBeVisible();
    // Another page is not touched.
    await page.goto('/tasks');
    await expect(page).toHaveTitle('Задачи — LogosEst');
    await expect(page.locator('script[data-json-ld="custom"]')).toHaveCount(0);
  });

  test('a page hidden from search engines says so and leaves the sitemap', async ({ page }) => {
    await admin.goto(edit('SeoPage', expertsPageId));
    await field(admin, 'noindex').locator('a').click();
    const saved = await save(admin);
    expect(saved.record.params.noindex).toBe(true);

    await page.goto('/experts');
    await expect(meta(page, 'robots')).toHaveAttribute('content', 'noindex, nofollow');
    const map = await sitemap(page);
    expect(map).not.toContain('/experts</loc>');
    expect(map).toContain('/tasks</loc>');
  });

  test('an article has its own title for search engines and describes itself as an article', async ({
    page,
  }) => {
    const title = `Как делят имущество при разводе ${Date.now()}`;
    const seoTitle = 'Раздел имущества при разводе: порядок и сроки';
    await admin.goto(`${ADMIN_URL}/admin/resources/Article/actions/new`);
    await field(admin, 'title').locator('input').fill(title);
    await field(admin, 'description').locator('textarea').fill('Квартира, машина и долги.');
    await field(admin, 'content').locator('textarea').fill('Совместно нажитое делится поровну.');
    await field(admin, 'seoTitle').locator('input').fill(seoTitle);
    const article = (await save(admin)).record.params;
    await admin.goto(`${ADMIN_URL}/admin/resources/Article/records/${article.id}/show`);
    await confirmAction(admin, 'publish');
    await expect(admin.getByText('Статья опубликована')).toBeVisible();

    await page.goto(`/articles/${article.slug}`);
    await expect(page).toHaveTitle(seoTitle);
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    // No description for search engines was given: the lead is used.
    await expect(meta(page, 'description')).toHaveAttribute('content', 'Квартира, машина и долги.');

    const nodes = (await jsonLd(page, 'page'))['@graph'];
    const described = nodes.find((node) => node['@type'] === 'Article');
    expect(described).toMatchObject({
      headline: seoTitle,
      description: 'Квартира, машина и долги.',
      inLanguage: 'ru',
    });
    expect(described.mainEntityOfPage).toContain(`/articles/${article.slug}`);
    expect(Date.parse(described.datePublished)).not.toBeNaN();
    const path = nodes.find((node) => node['@type'] === 'BreadcrumbList').itemListElement;
    expect(path.map((item) => item.name)).toEqual(['LogosEst', 'Новости', title]);
    expect(await sitemap(page)).toContain(`/articles/${article.slug}</loc>`);

    // Hidden from search engines: says so and leaves the sitemap, but stays on the site.
    await admin.goto(edit('Article', article.id));
    await field(admin, 'noindex').locator('a').click();
    expect((await save(admin)).record.params.noindex).toBe(true);
    await page.goto(`/articles/${article.slug}`);
    await expect(meta(page, 'robots')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    expect(await sitemap(page)).not.toContain(`/articles/${article.slug}</loc>`);
  });

  test('the home page, an expert and an answered question describe themselves', async ({
    browser,
    page,
  }) => {
    await page.goto('/');
    const home = (await jsonLd(page, 'page'))['@graph'].map((node) => node['@type']);
    expect(home).toEqual(['Organization', 'WebSite']);

    const expert = (await (await page.request.get('/api/v1/experts?pageSize=1')).json()).items[0];
    await page.goto(`/expert/${expert.id}`);
    const profile = (await jsonLd(page, 'page'))['@graph'].find(
      (node) => node['@type'] === 'ProfilePage',
    );
    expect(profile.mainEntity).toMatchObject({
      '@type': 'Person',
      name: `${expert.user.name} ${expert.user.surname}`,
    });

    // A question is a page of questions and answers once a lawyer has answered.
    const question = (await (await page.request.get('/api/v1/questions?pageSize=1')).json())
      .items[0];
    const types = async () => {
      await page.goto(`/question/${question.id}`);
      return (await jsonLd(page, 'page'))['@graph'].map((node) => node['@type']);
    };
    if (question.answersCount === 0) {
      expect(await types()).toEqual(['BreadcrumbList']);
    }
    const lawyer = await newPerson(browser);
    await signIn(lawyer, EXPERT);
    const text = `Да, в течение пятнадцати дней со дня покупки ${Date.now()}.`;
    const answered = await lawyer.request.post(`/api/v1/questions/${question.id}/answers`, {
      data: { text },
    });
    expect(answered.ok()).toBe(true);
    await lawyer.context().close();

    expect(await types()).toEqual(['QAPage', 'BreadcrumbList']);
    const asked = (await jsonLd(page, 'page'))['@graph'][0].mainEntity;
    expect(asked).toMatchObject({ '@type': 'Question', name: question.title });
    expect(asked.answerCount).toBe(asked.suggestedAnswer.length);
    expect(asked.suggestedAnswer.map((answer) => answer.text)).toContain(text);
  });
});
