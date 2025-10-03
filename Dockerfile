# Base image with Debian for better tooling compatibility (watchman not needed with Expo)
FROM node:20-bullseye

# Avoid interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install useful OS deps
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    python3 \
    build-essential \
    openssh-client \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy only manifests first for better layer caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies (prefer npm ci when lockfile exists)
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then npm install -g yarn && yarn install --frozen-lockfile; \
    else npm install; fi

# Install global CLIs used in this project
RUN npm install -g eas-cli@latest

# Copy the rest of the source
COPY . .

# Default envs suitable for Expo Dev Server in containers
ENV EXPO_NO_TELEMETRY=1 \
    CI=false \
    FORCE_COLOR=1

# Expose Expo dev ports
EXPOSE 19000 19001 19002 8081

# Use shell to allow env var expansion in commands
SHELL [ "/bin/bash", "-lc" ]

# Start Expo in tunnel mode by default to avoid LAN/ADB networking issues across host/container
CMD ["bash", "-lc", "if [ -f package-lock.json ]; then npm ci; else npm install; fi && npx expo start --tunnel"]


