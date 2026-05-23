ARG VELLUM_PROJECT=vellum
ARG VELLUM_ENV=development

FROM node:24-alpine AS base
ARG VELLUM_PROJECT=vellum
ARG VELLUM_ENV=development
LABEL org.opencontainers.image.title="${VELLUM_PROJECT}" \
      com.vellum.project="${VELLUM_PROJECT}" \
      com.vellum.environment="${VELLUM_ENV}"
WORKDIR /app
RUN apk add --no-cache openssl
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN npm install -g npm@11.14.1
RUN npm ci

# Development: Vite + Express API (vite-plugin-node), used by docker compose.
FROM deps AS dev
ARG VELLUM_PROJECT=vellum
ARG VELLUM_ENV=development
ARG VELLUM_SERVICE=app
LABEL org.opencontainers.image.title="${VELLUM_PROJECT}" \
      com.vellum.project="${VELLUM_PROJECT}" \
      com.vellum.environment="${VELLUM_ENV}" \
      com.vellum.service="${VELLUM_SERVICE}"
ARG DATABASE_URL=postgresql://vellum:password@postgres:5432/vellum_db
ENV DATABASE_URL=${DATABASE_URL}
COPY . .
RUN npx prisma generate
EXPOSE 5173
CMD ["npm", "run", "dev:api"]

# Production: built static assets + Express on PORT.
FROM deps AS build
ARG DATABASE_URL=postgresql://vellum:password@postgres:5432/vellum_db
ENV DATABASE_URL=${DATABASE_URL}
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS production
ARG VELLUM_PROJECT=vellum
ARG VELLUM_ENV=production
ARG VELLUM_SERVICE=app
LABEL org.opencontainers.image.title="${VELLUM_PROJECT}" \
      com.vellum.project="${VELLUM_PROJECT}" \
      com.vellum.environment="${VELLUM_ENV}" \
      com.vellum.service="${VELLUM_SERVICE}"
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY package.json prisma.config.ts ./
EXPOSE 3000
CMD ["npx", "tsx", "src/server.ts"]
