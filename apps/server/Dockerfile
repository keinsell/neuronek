# This Dockerfile is intended to be used only in monorepos.
# Context of Dockerfile will be always root of directory.
# Dockerfile should be stored most likely in our package.
# Example usage on docker-compose below:
#  build:
#     context: .
#     dockerfile: ./apps/server/Dockerfile

# Use builder image to prepare source from monorepo
FROM node:alpine AS builder

# Update system packages
RUN apk update

# Set working directory
WORKDIR /app

# Install turbo
RUN npm i -g turbo

# Prepare source for server
COPY . .
RUN npx turbo prune --scope=server --docker

# Use installer image to install packages
FROM node:alpine AS installer

# Install build packages for native node modules
RUN apk update && apk add --update python3 make g++

WORKDIR /app

# Copy source to build directory
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

# Install necessary packages
RUN yarn install
# Build necessary packages
RUN yarn turbo run build --filter=server...

# Use runner image to run app with limited permissions
FROM node:alpine AS runner

WORKDIR /app

EXPOSE 3000

# Add user with limited permissions
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner

# Use user with limited permissions
USER runner

# Copy bundle and start application
COPY --from=installer /app .
CMD node apps/server/dist/index.js
