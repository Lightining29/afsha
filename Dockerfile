# Backend Dockerfile - builds and runs the Node API
FROM node:18-alpine

WORKDIR /app

# Install only production deps
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend/ ./

EXPOSE 5000

# Run the server
CMD ["node", "src/index.js"]
