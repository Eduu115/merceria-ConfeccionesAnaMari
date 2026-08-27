#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
docker compose -f docker-compose.prod.yml pull || true
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec -T app npm run semilla -w apps/api || true
echo "Despliegue terminado."
