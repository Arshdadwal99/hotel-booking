FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
COPY . .
RUN echo "No build command detected"

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl dumb-init
COPY --from=builder /app .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -fsS http://localhost:3000/ || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npm start"]
