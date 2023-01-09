FROM node:alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=server --docker

#
#
#

FROM node:alpine AS installer

RUN apk update && apk add --update python3 make g++

WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

RUN yarn install
RUN yarn turbo run build --filter=server...

#
#
#

FROM node:alpine AS runner

WORKDIR /app

EXPOSE 3000

RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner
USER runner
COPY --from=installer /app .

CMD node apps/server/dist/index.js
