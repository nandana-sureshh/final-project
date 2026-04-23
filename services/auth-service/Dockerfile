# ─── Stage 1: Install production dependencies ─────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

# ─── Stage 2: Lean production image ───────────────────────────────────────
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY src ./src
COPY package.json ./

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4001

CMD ["node", "src/server.js"]
