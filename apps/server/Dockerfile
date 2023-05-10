FROM node:18-alpine AS base

ARG TURBO_TARGET_PACKAGE=server

LABEL org.opencontainers.image.source=https://github.com/keinsell/neuronek
LABEL org.opencontainers.image.description="🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
LABEL org.opencontainers.image.licenses=MIT

# -------------
# BUILDER -----
# -------------

FROM base AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

RUN corepack prepare yarn@stable --activate && yarn set version berry
RUN npm i -g turbo

WORKDIR /app

COPY . .

RUN turbo prune --scope=${TURBO_TARGET_PACKAGE} --docker

# -------------
# INSTALLER ---
# -------------

FROM base AS installer

RUN apk add --no-cache libc6-compat
RUN apk update

RUN corepack prepare yarn@stable --activate && yarn set version berry

WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN mkdir -p ~/.yarn-cache && yarn config set cacheFolder ~/.yarn-cache
VOLUME ~/.yarn-cache
RUN yarn install --immutable --immutable-cache

COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=${TURBO_TARGET_PACKAGE}...

# -------------
# RUNNER ------
# -------------

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
USER express

COPY --from=installer /app/apps/${TURBO_TARGET_PACKAGE}/package.json .

COPY --from=installer --chown=express:nodejs /app .

CMD ["node", "./apps/server/bin/server.js"]
