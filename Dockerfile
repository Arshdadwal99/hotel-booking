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
ENV PORT=8000
EXPOSE 8000
HEALTHCHECK CMD curl -fsS http://localhost:8000/ || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npm start"]
