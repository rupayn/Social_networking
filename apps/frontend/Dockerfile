FROM node:20-alpine AS base

# Required for some native dependencies on Alpine
RUN apk update && apk add --no-cache libc6-compat

WORKDIR /app

# ---
FROM base AS prepare
RUN npm install -g turbo
COPY . .

# Prune monorepo for frontend app
RUN turbo prune frontend --docker

# ---
FROM base AS runner

WORKDIR /app

# Install dependencies for the pruned workspace
COPY --from=prepare /app/out/json/ .
RUN npm install

# Copy full frontend source
COPY --from=prepare /app/out/full/ .

# Switch to frontend app
WORKDIR /app/apps/frontend

# Optional, but documents the default React port (CRA = 3000)
EXPOSE 5173

# Start the React app using its own script and port
CMD ["npm", "start"]
