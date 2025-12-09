# -------- Base image & common config --------
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------- Install dependencies (with devDeps) --------
FROM base AS deps

# Copy root and backend package files first (better layer caching)
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install ALL dependencies (including dev) for building
RUN npm i

# -------- Build backend --------
FROM base AS builder
WORKDIR /app

# Reuse node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the monorepo
COPY . .

RUN npm i

# Build only the backend workspace
# Make sure "backend" matches the name in apps/backend/package.json
RUN npm run build --workspace backend

# -------- Production runtime image --------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copy only the files needed to install prod deps
COPY package.json package-lock.json turbo.json ./
COPY apps/backend/package.json ./apps/backend/package.json

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built backend code from builder stage
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# If your backend uses any other runtime assets (e.g. .env.example, prisma schema, etc.),
# copy them here as needed.
# COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

EXPOSE 3000

USER nodeuser

# Start the backend in production mode
# Ensure apps/backend/package.json has a "start" script
CMD ["node", "run", "start"]
