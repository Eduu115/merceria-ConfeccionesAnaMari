#!/bin/sh
# Vuelca la base del compose de producción (servicio db) y borra copias de más de 14 días.
# Cron sugerido (ajusta la ruta del repo):
# 30 3 * * * cd /ruta/al/repo && ./scripts/backup-db.sh >> /var/log/anamari-backup.log 2>&1
set -eu
raiz=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
destino="$raiz/privado/copias"
mkdir -p "$destino"
fecha=$(date +%Y%m%d-%H%M%S)
docker compose -f "$raiz/docker-compose.yml" exec -T db \
  pg_dump -U anamari anamari | gzip > "$destino/anamari-$fecha.sql.gz"
find "$destino" -name 'anamari-*.sql.gz' -mtime +14 -delete
