# LogosEst — frontend

The site of the LogosEst legal-services marketplace. Next.js 16 (pages router, Turbopack), React 19, Ant Design 6, TanStack Query 5, Sass modules, on Node 24. The backend is the NestJS API in `../Logos-api`; its README describes the product, the deployment and the seeded demo accounts.

## Everything runs in Docker

The host needs only `git`, `docker` and `make`. Do not run `yarn` or `node` on the host. `node_modules` appears in the project folder so your editor can resolve imports, but it is installed by the container for Node 24 on Linux.

The usual way to work is the whole stack, started from the API project:

```bash
cd ../Logos-api && make up     # site on http://localhost:3000, API, database, mail inbox
```

To run only the frontend against an API that is already running on port 4000:

```bash
make up                        # http://localhost:3000
make logs
make down
```

If port 3000 is taken: `WEB_PORT=3100 make up` (the same variable works for the API's `make up`).

| Command        | What it does                                                     |
| -------------- | ---------------------------------------------------------------- |
| `make lint`    | ESLint                                                           |
| `make format`  | Prettier, write changes                                          |
| `make locales` | Check that `ru.js` and `en.js` have the same keys                |
| `make build`   | Production build into `.next-check`, safe next to the dev server |
| `make e2e`     | Browser tests of the whole product in a throwaway stack          |
| `make install` | Reinstall dependencies after `package.json` changes              |
| `make shell`   | Shell inside the container                                       |

Each target is a thin wrapper around `docker compose run --rm web …`; to add a package use `docker compose run --rm web yarn add <name>`.

## Configuration

| Variable               | When it is read | Meaning                                                                                                                                                                         |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_INTERNAL_URL`     | build and run   | The API as this server reaches it. `/api/v1` and `/uploads` are proxied there, so the browser only ever talks to the site's own origin and the session cookies are first-party. |
| `NEXT_PUBLIC_WS_URL`   | build           | The API's public origin for the chat socket. Empty when a reverse proxy serves `/socket.io` on the site's origin (production).                                                  |
| `NEXT_PUBLIC_SITE_URL` | build           | Public address of the site, for canonical links, sharing tags and structured data.                                                                                              |

In development they come from the compose files. For the production image they are build arguments (see `Dockerfile` and `../Logos-api/compose.prod.yml`). Do not create a file named `.env` here: Docker Compose reads it for its own settings.

## Layout

- `pages/` — routes. Catalogue and content pages render on the server; account pages check the session in the browser (`lib/withAuth.js`).
- `lib/api/` — the only place that talks to the backend: `client.js` (axios, session refresh, error texts) and `index.js` (one function per endpoint).
- `src/components/` — UI components; `src/context/` — user, theme, notifications, socket; `src/hooks/` — reference data and list pages whose filters live in the URL.
- `utils/Locales/` — `ru.js` and `en.js` (same keys, checked by `make locales`) and `apiErrors.js`, the Russian text for the API's error messages. The site is published in Russian. All interface text lives in the locale files: shared vocabulary under `task`, `account`, `finance`, and each page's or component's own copy under `pages.<route>` and `ui.<component>`.
- `src/components/seo.js`, `src/seo/schema.js`, `lib/pageSeo.js` — what search engines are told, see [Search engines](#search-engines).
- `styles/` — global styles and the site's design values (`variables.scss`); `src/theme.js` gives the same values to Ant Design as theme tokens.
- `e2e/` — Playwright tests of the marketplace loop, Q&A, the admin panel (which the API serves) and what search engines find after an administrator sets it there. They run against the stack in `../Logos-api/compose.e2e.yml`, which uses this app's production image.
- `next.config.js` — besides the proxy rules, the security headers of every page: a content security policy (this origin only; inline scripts and styles stay allowed because Next and Ant Design need them), no framing, a referrer and a permissions policy.

Files that only some people may open (task documents, chat attachments, diploma scans) are linked with `src/components/fileLink`: the API checks the 15-minute session cookie on the file's address, so the link renews the session before opening it. A plain `<a href>` is right only for public files (avatars, article images, question attachments).

## Search engines

Every page gets its title, description, canonical link and sharing tags from `<Seo>` (`src/components/seo.js`), usually through `<PageHeader title seo>`. Personal pages pass `noindex`; `robots.txt` closes them as well, and `sitemap.xml` lists the public ones.

An administrator can replace the title, the description, the sharing picture and "index or not" of the six fixed pages (`/`, `/tasks`, `/experts`, `/articles`, `/questions`, `/agreement`) and of every article in the admin panel. Such a page asks for its settings in `getServerSideProps` (`pageSeo(path, http)` or `articleSeo(article)` from `lib/pageSeo.js`; list pages pass `seoPath` to `listServerProps`) and returns them as the `seo` prop. `_app` puts that prop into a context and `<Seo>` lets it win, so the page's markup does not know about it. An empty setting means the page's own value; a page hidden from search engines also leaves the sitemap.

Public pages also describe themselves in schema.org terms (JSON-LD in the head): the home page as an organization and a site with a search, an article, an expert's profile, a question with its answers, and the path to each of them and to a task. `src/seo/schema.js` builds these as plain objects from the data the page already has; `<JsonLd id="page" data={graph(…)} />` prints them. To describe a new kind of page, add a function there and render it on the page. The block an administrator pastes in the admin panel is printed by `_app` next to it (`id="custom"`).

Addresses in the canonical link, the sharing tags and the structured data are absolute only when `NEXT_PUBLIC_SITE_URL` is set, so set it for anything a search engine will see.

## Payments and chats

A chat with an expert is a paid consultation. "Написать эксперту — … ₽" on an expert's page, and the same button next to an expert's response to the customer's task, start a payment (`useConsultationPayment` in `src/components/chat/consultation.js`) and send the customer to the payment page: Robokassa's in production, `pages/payments/mock/[id].js` in development. The customer returns to `pages/payments/[id]/return.js`, which waits until the API knows the outcome and then leads into the chat or back to the task.

`pages/messages.js` shows what the API says about each chat (`status`, `role`, `replyDueAt`, who has finished): the text box gives way to `ChatGate` (why nobody can write, and the pay button) while the chat is locked or closed; an open chat shows until when the expert must reply and the "Завершить" button. An expert sets the price in the account, on the "Услуги и цены" page. How the money moves and how billing is set up: `../Logos-api/docs/billing.md`.

Deployment is described in the API repository: `../Logos-api/docs/deploy-yandex-cloud.md`.

## Checks

CI (`.github/workflows/ci.yml`) runs lint, the format check, the locale check and a production build on every push and pull request. The browser tests need the API repository next to this one and start once the repository variable `API_REPOSITORY` is set.
