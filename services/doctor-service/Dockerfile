# ─── Stage 1: Install production dependencies ─────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

# ─── Stage 2: Lean production image ───────────────────────────────────────
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 4003

CMD ["node", "src/server.js"]
