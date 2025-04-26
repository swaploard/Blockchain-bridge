# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

# Install system dependencies
RUN apk add --no-cache curl age git

# Install SOPS
RUN curl -LO https://github.com/mozilla/sops/releases/download/v3.8.1/sops-v3.8.1.linux.amd64 && \
    mv sops-v3.8.1.linux.amd64 /usr/local/bin/sops && \
    chmod +x /usr/local/bin/sops

# Create non-root user and config directories
RUN adduser -D appuser && \
    mkdir -p /home/appuser/.config/sops/age && \
    chown -R appuser:appuser /home/appuser/.config

# Set environment and working directory
ENV NODE_ENV=production
ENV SOPS_AGE_KEY_FILE=/home/appuser/.config/sops/age/keys.txt
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy SOPS config and encrypted .env
COPY .sops.yaml ./
COPY .env.enc ./

# Copy source files
COPY *.js ./
COPY *.json ./
COPY contracts/ ./contracts/

# Set permissions
RUN chown -R appuser:appuser /app && \
    chmod 755 /app && \
    chmod 644 .env.enc .sops.yaml *.js *.json

# Switch to non-root user
USER appuser

# Expose port and set entrypoint
EXPOSE 8584
COPY --chmod=755 entrypoint.sh ./
ENTRYPOINT ["./entrypoint.sh"]
