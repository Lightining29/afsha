# Multi-stage Dockerfile: build frontend + run backend

# --- Stage 1: Build frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --- Stage 2: Backend + serve frontend ---
FROM node:18-alpine
WORKDIR /app

# Install backend production deps
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend's public directory
COPY --from=frontend-builder /app/dist ./public

EXPOSE 5000

CMD ["node", "src/index.js"]
