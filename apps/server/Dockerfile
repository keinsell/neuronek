# Base image
FROM node:alpine AS builder

# Set an argument for the target package
ARG TURBO_TARGET_PACKAGE=server

# Install necessary dependencies
RUN apk add --no-cache libc6-compat \
	&& apk update \
	&& apk add --update python3 make g++

# Set the working directory
WORKDIR /app

# Prepare Node environment and enable yarn 2
RUN corepack prepare yarn@stable --activate \
	&& yarn set version berry \
	&& yarn global add turbo

# Copy files into the container
COPY . .

# Prune unused dependencies and install dependencies for the target package
RUN turbo prune --scope=${TURBO_TARGET_PACKAGE} --docker

# Build the application
RUN yarn install && yarn build

# Create the application image
FROM node:alpine AS installer

# Set working directory
WORKDIR /app

# Prepare Node environment and enable yarn 2
RUN corepack prepare yarn@stable --activate \
	&& yarn set version berry \
	&& yarn global add turbo

# Copy the necessary files from the builder image
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore
COPY turbo.json turbo.json

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy built application from builder image
COPY --from=builder /app .

# Prepare runner of application
FROM node:alpine AS runner

# Set working directory
WORKDIR /app

# Expose default application port
EXPOSE 1337

# Create user for running application
RUN addgroup --system --gid 1001 runner \
	&& adduser --system --uid 1001 runner

# Use non-root user
USER runner

# Copy application from installer image
COPY --from=installer /app .

# Start application
CMD ["node", "apps/server/bin/server.js"]
