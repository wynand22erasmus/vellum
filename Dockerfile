FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
COPY scripts/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Development: Vite + Express API (vite-plugin-node), used by docker compose.
FROM deps AS dev
COPY . .
RUN npx prisma generate
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# Production: built static assets + Express on PORT.
FROM deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS production
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY package.json prisma.config.ts ./
EXPOSE 3000
CMD ["npx", "tsx", "src/server.ts"]
