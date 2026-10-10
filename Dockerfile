# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# Development: source is bind-mounted by compose, node_modules and .next are volumes.
# The .next volume outlives the container and the bundler's cache in it only
# grows, so it is emptied at start once it is over 1 GB.
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "[ \"$(du -sm .next 2>/dev/null | cut -f1)\" -gt 1024 ] 2>/dev/null && find .next -mindepth 1 -delete; exec yarn dev --hostname 0.0.0.0"]

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
RUN NEXT_STANDALONE=1 yarn build

# Production: the server and the packages it loads, nothing else. No
# node_modules, no sources, no build cache.
FROM base AS prod
ARG API_INTERNAL_URL=http://api:4000
# Server-side rendering calls the API at run time.
ENV NODE_ENV=production \
    API_INTERNAL_URL=$API_INTERNAL_URL
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
ENV HOSTNAME=0.0.0.0 PORT=3000
CMD ["node", "server.js"]
