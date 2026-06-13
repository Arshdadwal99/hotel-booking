FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

ARG REACT_APP_API_BASE_URL=http://localhost:3035
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ENV NODE_OPTIONS="--max-old-space-size=6144"

RUN npm run build

FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3033
