# =========================
# Build stage
# =========================
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app

# Copy root workspace files (relative to repo root)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copy email service package.json
COPY services/email-service/package.json ./services/email-service/


# Copy email service source code
COPY services/email-service ./services/email-service

# Install dependencies including dev for build
RUN pnpm install --frozen-lockfile --filter ./services/email-service...

# Build the project
RUN pnpm --filter email-service run build


# =========================
# Production stage
# =========================
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@10.20.0

WORKDIR /app/services/email-service

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json /app/
COPY services/email-service/package.json ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile --dir . --filter email-service --ignore-scripts

# Copy built files from builder
COPY --from=builder /app/services/email-service/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"]
