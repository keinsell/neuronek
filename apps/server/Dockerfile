FROM node:alpine AS builder

ARG TURBO_TARGET_PACKAGE=server

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Update builder image and install dependencies
RUN apk update

# Set working directory
WORKDIR /app

# Install Turbo CLI for monorepository management
RUN yarn global add turbo

# Add files of monorepository to container
COPY . .

# Install dependencies for application and purne unused dependencies
RUN turbo prune --scope=$TURBO_TARGET_PACKAGE --docker

# Install dependencies for application
FROM node:alpine AS installer

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Update builder image and install dependencies
RUN apk update && apk add --update python3 make g++

# Set working directory
WORKDIR /app

# Copy dependencies from builder image
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

# Install dependencies for application
RUN yarn install
# Build application
RUN yarn turbo run build --filter=$TURBO_TARGET_PACKAGE...

# Prepare runner of application
FROM node:alpine AS runner

LABEL org.opencontainers.image.source=https://github.com/keinsell/neuronek
LABEL org.opencontainers.image.description="🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
LABEL org.opencontainers.image.licenses=MIT

# Set working directory
WORKDIR /app

# Expose default application port
EXPOSE 1337

# Create user for running application
RUN addgroup --system --gid 1001 runner
RUN adduser --system --uid 1001 runner

# Use non-root user
USER runner

# Copy application from builder image
COPY --from=installer /app .

# Start application
CMD node apps/$TURBO_TARGET_PACKAGE/dist/index.js
