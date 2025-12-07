# ---------- Builder ----------
FROM node:20-alpine AS builder

WORKDIR /repo

# Copy workspace files
COPY package.json package-lock.json ./
COPY turbo.json ./turbo.json
COPY apps ./apps
COPY packages ./packages

# Install all deps for the monorepo
RUN npm ci

# Build only backend (npm workspaces)
# Assumes "backend" is the workspace name in root package.json
RUN npx turbo run build --filter=backend...

# ---------- Runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy backend dist and package.json
COPY --from=builder /repo/apps/backend/dist ./dist
COPY --from=builder /repo/apps/backend/package.json ./

# Copy production node_modules from builder
# (this avoids re-installing in the runner)
COPY --from=builder /repo/node_modules ./node_modules

# If backend_things is not built separately:
# Either it's only used at build time (then omit this),
# or you want the package present at runtime:
COPY --from=builder /repo/packages/backend_things ./packages/backend_things

CMD ["node", "dist/server.js"]
