# ==============================================================================
# Stage 1: Build the Astro Starlight Static Site
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for efficient layer caching
COPY package*.json ./
RUN npm ci

# Copy source files & build the static site
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Production Lightweight Nginx Web Server (~25MB)
# ==============================================================================
FROM nginx:alpine-slim

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
