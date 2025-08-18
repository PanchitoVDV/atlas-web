# ---- Base Stage ----
# Use a specific Node.js version for consistency
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ---- Builder Stage ----
# This stage builds the application
FROM base AS builder
WORKDIR /app
# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Copy source code and build the app
COPY . .
RUN pnpm build

# ---- Runner Stage ----
# This stage creates the final, lean image
FROM base AS runner
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Expose the port the app runs on
EXPOSE 3000

# We will use an entrypoint script to run migrations before starting the app
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "start:prod"]