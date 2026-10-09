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
# These are read while building and end up in the build output: the rewrite
# target for /api/v1 and /uploads, and the values the browser code uses.
ARG API_INTERNAL_URL=http://api:4000
ARG NEXT_PUBLIC_WS_URL=
ARG NEXT_PUBLIC_SITE_URL=
ENV API_INTERNAL_URL=$API_INTERNAL_URL \
    NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY . .
RUN yarn build

FROM base AS prod
ARG API_INTERNAL_URL=http://api:4000
# Server-side rendering calls the API at run time.
ENV NODE_ENV=production \
    API_INTERNAL_URL=$API_INTERNAL_URL
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["yarn", "start", "--hostname", "0.0.0.0"]
