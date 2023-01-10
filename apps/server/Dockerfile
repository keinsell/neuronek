# This Dockerfile is intended to be used only in monorepos.
# Context of Dockerfile will be always root of directory.
# Dockerfile should be stored most likely in our package.
# Example usage on docker-compose below:
#  build:
#     context: .
#     dockerfile: ./apps/server/Dockerfile

# Use installer image to install packages
FROM node:alpine AS installer

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install build packages for native node modules
RUN apk update && apk add --update \
  python3 \
  make \
  g++

WORKDIR /app

# Copy source to build directory
COPY package.json package.json
COPY yarn.lock yarn.lock

# Copy source to build directory
COPY . .

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
