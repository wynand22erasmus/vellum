#!/usr/bin/env bash
# Run Compose using Docker or Podman, whichever is available.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Compose interpolates .env for image names; load here for VELLUM_BUILD_TARGET defaults.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# shellcheck disable=SC1091
source "$ROOT_DIR/scripts/host-ports.env"

export VELLUM_PROJECT="${VELLUM_PROJECT:-vellum}"
export VELLUM_ENV="${VELLUM_ENV:-development}"

case "$VELLUM_ENV" in
  development | production) ;;
  *)
    echo "Error: VELLUM_ENV must be 'development' or 'production' (got: $VELLUM_ENV)" >&2
    exit 1
    ;;
esac

if [[ -z "${VELLUM_BUILD_TARGET:-}" ]]; then
  case "$VELLUM_ENV" in
    production) export VELLUM_BUILD_TARGET=production ;;
    *) export VELLUM_BUILD_TARGET=dev ;;
  esac
fi

detect_compose() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    printf '%s\n' 'docker compose'
    return 0
  fi
  if command -v podman >/dev/null 2>&1 && podman compose version >/dev/null 2>&1; then
    printf '%s\n' 'podman compose'
    return 0
  fi
  if command -v docker-compose >/dev/null 2>&1; then
    printf '%s\n' 'docker-compose'
    return 0
  fi
  if command -v podman-compose >/dev/null 2>&1; then
    printf '%s\n' 'podman-compose'
    return 0
  fi
  return 1
}

COMPOSE_CMD="$(detect_compose)" || {
  echo "Error: Neither Docker Compose nor Podman Compose is available." >&2
  echo "Install one of:" >&2
  echo "  - docker compose  (Docker Compose v2 plugin)" >&2
  echo "  - podman compose  (Podman Compose plugin)" >&2
  echo "  - docker-compose / podman-compose (standalone)" >&2
  exit 1
}

if [[ "${COMPOSE_VERBOSE:-}" == "1" ]]; then
  echo "Using: $COMPOSE_CMD" >&2
fi

case "$COMPOSE_CMD" in
  'docker compose') exec docker compose "$@" ;;
  'podman compose') exec podman compose "$@" ;;
  docker-compose) exec docker-compose "$@" ;;
  podman-compose) exec podman-compose "$@" ;;
  *)
    echo "Error: Unknown compose command: $COMPOSE_CMD" >&2
    exit 1
    ;;
esac
