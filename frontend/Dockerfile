FROM node:18-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG API_BASE_URL=http://localhost:3035
ARG API_INTERNAL_BASE_URL=http://backend:3035
ENV API_BASE_URL=$API_BASE_URL
ENV API_INTERNAL_BASE_URL=$API_INTERNAL_BASE_URL
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3034

CMD ["npm", "run", "start", "--", "-p", "3034"]
