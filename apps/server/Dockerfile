FROM node:18 AS base

ARG TURBO_TARGET_PACKAGE=server

LABEL org.opencontainers.image.source=https://github.com/keinsell/neuronek
LABEL org.opencontainers.image.description="🧬 Intelligent dosage tracker application with the purpose to monitor supplements, nootropics, and psychoactive substances along with their long-term influence on one's mind and body."
LABEL org.opencontainers.image.licenses=MIT

# -------------
# BUILDER -----
# -------------

FROM base AS builder

RUN apt-get update && apt-get install -y libc6-dev
RUN apt-get update

RUN npm install -g pnpm turbo

WORKDIR /app

RUN corepack prepare pnpm --activate

COPY . .

RUN turbo prune --scope=${TURBO_TARGET_PACKAGE} --docker

# -------------
# INSTALLER ---
# -------------

FROM base AS installer

RUN apt-get update && apt-get install -y libc6-dev
RUN apt-get update

WORKDIR /app

RUN npm install -g pnpm turbo
RUN corepack prepare pnpm --activate

COPY .gitignore .gitignore
COPY --from=builder /app/out/json .
COPY --from=builder /app/out/yarn.lock .

RUN pnpm install

COPY --from=builder /app/out/full/ .

RUN pnpm run turbo build --scope=${TURBO_TARGET_PACKAGE}

# -------------
# RUNNER ------
# -------------

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 express
USER express

COPY --from=installer /app/ .

CMD ["node", "./apps/server/bin/server.js"]
