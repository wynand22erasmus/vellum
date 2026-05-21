ARG VELLUM_PROJECT=vellum
ARG VELLUM_ENV=development

FROM postgres:15-alpine

ARG VELLUM_PROJECT
ARG VELLUM_ENV

LABEL org.opencontainers.image.title="${VELLUM_PROJECT}-postgres" \
      com.vellum.project="${VELLUM_PROJECT}" \
      com.vellum.environment="${VELLUM_ENV}" \
      com.vellum.service="postgres"

RUN apk add --no-cache \
    supervisor \
    nodejs \
    npm \
    php83 \
    php83-pgsql \
    php83-session \
    curl \
  && mkdir -p /var/www/adminer \
  && curl -fsSL -o /var/www/adminer/index.php \
    https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php

WORKDIR /opt/vellum-prisma
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm init -y \
  && npm install --omit=dev --no-package-lock prisma@7.8.0 dotenv@17.4.2

COPY docker/postgres/supervisord.conf /etc/supervisord.conf
COPY docker/postgres/start-prisma-studio.sh /usr/local/bin/start-prisma-studio.sh
RUN chmod +x /usr/local/bin/start-prisma-studio.sh

EXPOSE 5432 5555 8081

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
