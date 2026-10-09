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
| `NEXT_PUBLIC_SITE_URL` | build           | Public address of the site, for canonical links and sharing tags.                                                                                                               |

In development they come from the compose files. For the production image they are build arguments (see `Dockerfile` and `../Logos-api/compose.prod.yml`). Do not create a file named `.env` here: Docker Compose reads it for its own settings.

## Layout

- `pages/` — routes. Catalogue and content pages render on the server; account pages check the session in the browser (`lib/withAuth.js`).
- `lib/api/` — the only place that talks to the backend: `client.js` (axios, session refresh, error texts) and `index.js` (one function per endpoint).
- `src/components/` — UI components; `src/context/` — user, theme, notifications, socket; `src/hooks/` — reference data and list pages whose filters live in the URL.
- `utils/Locales/` — `ru.js` and `en.js` (same keys, checked by `make locales`) and `apiErrors.js`, the Russian text for the API's error messages. The site is published in Russian. All interface text lives in the locale files: shared vocabulary under `task`, `account`, `finance`, and each page's or component's own copy under `pages.<route>` and `ui.<component>`.
- `styles/` — global styles and the site's design values (`variables.scss`); `src/theme.js` gives the same values to Ant Design as theme tokens.
- `e2e/` — Playwright tests. They run against the stack in `../Logos-api/compose.e2e.yml`, which uses this app's production image.

## Checks

CI (`.github/workflows/ci.yml`) runs lint, the format check, the locale check and a production build on every push and pull request. The browser tests need the API repository next to this one and start once the repository variable `API_REPOSITORY` is set.
