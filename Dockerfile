# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=23.7.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /src

# Set default environment (no differentiation between dev and prod)
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules (including devDependencies like ts-node and typescript)
COPY package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY . .

# Copy the migrations folder into the Docker image
COPY ./src/migration /src/migration

# Final stage for app image
FROM base

# Set NODE_ENV to development to install devDependencies
ENV NODE_ENV=development

# Copy built application from build stage
COPY --from=build /src /src

# Install dev dependencies (including ts-node, typescript, etc.)
RUN npm install --only=dev

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD ["npm", "run", "start"]