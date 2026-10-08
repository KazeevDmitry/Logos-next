# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# Development: source is bind-mounted by compose, node_modules and .next are volumes.
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["yarn", "dev", "--hostname", "0.0.0.0"]

FROM deps AS build
COPY . .
RUN yarn build

FROM base AS prod
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["yarn", "start", "--hostname", "0.0.0.0"]
