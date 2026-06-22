# Frontend Dockerfile (multi-stage) - builds Vite app and serves with nginx

# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy frontend sources and build
COPY . ./
RUN npm run build

# --- Production stage ---
FROM nginx:alpine AS runner

# Copy built static site
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose nginx default port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
