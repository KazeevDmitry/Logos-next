# LogosEst — frontend

Next.js 14 (pages router), React 18, Ant Design 4, react-query.

## Everything runs in Docker

The host needs only `git`, `docker` and `make`. Do not run `yarn` or `node` on the host. `node_modules` appears in the project folder so your editor can resolve imports, but it is installed by the container for Node 20 on Linux.

```bash
cp .env.example .env.local   # then fill in the values
make up                      # dev server with hot reload on http://localhost:3000
make logs
make down
```

| Command        | What it does                                   |
| -------------- | ---------------------------------------------- |
| `make lint`    | ESLint                                         |
| `make format`  | Prettier, write changes                        |
| `make build`   | Production build                               |
| `make install` | Reinstall dependencies after `package.json` changes |
| `make shell`   | Shell inside the container                     |

Each target is a thin wrapper around `docker compose run --rm web …`; to add a package use `docker compose run --rm web yarn add <name>`.

Environment variables go in `.env.local`. Do not create a file named `.env`: Docker Compose reads it for its own settings.

## Layout

- `pages/` — routes
- `src/components/` — UI components
- `src/context/` — theme, user and notification contexts
- `utils/` — helpers, icons, locales (`utils/Locales/ru.js`, `en.js`)
- `styles/` — global styles and Ant Design variables (`antdVariables.less`)
