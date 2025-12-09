# ---------- Build image ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy frontend package files
COPY apps/frontend/package*.json ./apps/frontend/

# Install dependencies for frontend
RUN npm install --prefix ./apps/frontend

# Copy all sources (for shared UI packages etc.)
COPY . .

# Build the frontend (adjust script name if needed)
RUN npm run build --prefix ./apps/frontend

# ---------- Nginx runtime image ----------
FROM nginx:alpine AS runtime

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Nginx will serve the built static files by default
CMD ["nginx", "-g", "daemon off;"]
