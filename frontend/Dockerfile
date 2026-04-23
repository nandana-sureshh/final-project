# ─── Stage 1: Build React app ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies.
# Using --legacy-peer-deps handles peer dependency conflicts in react-scripts 5.
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Build the production bundle.
# REACT_APP_* vars point to localhost because the browser (not the container)
# makes the API calls. The docker-compose exposes each service port to the host.
ENV REACT_APP_AUTH_URL=http://localhost:4001
ENV REACT_APP_PATIENT_URL=http://localhost:4002
ENV REACT_APP_DOCTOR_URL=http://localhost:4003
ENV REACT_APP_APPOINTMENT_URL=http://localhost:4004

RUN npm run build

# ─── Stage 2: Serve with nginx ────────────────────────────────────────────
FROM nginx:1.25-alpine

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Custom nginx config for React Router (SPA fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
