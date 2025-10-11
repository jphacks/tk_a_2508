# Base image with Debian for better tooling compatibility
FROM node:20-bullseye

# Avoid interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install essential OS deps only
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
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

# Install Expo dependencies and fix any compatibility issues
RUN npx expo install --fix

# Install React Navigation dependencies
RUN npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context

# Install global CLIs used in this project
RUN npm install -g eas-cli@latest

RUN npm install -g @expo/ngrok@^4.1.0

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
CMD ["bash", "-lc", "if [ -f package-lock.json ]; then npm ci; else npm install; fi && npx expo install --fix && npx expo start --tunnel"]


