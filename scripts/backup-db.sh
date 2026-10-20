#!/usr/bin/env bash
# Copia completa de la tienda en el disco de datos del servidor, fuera del disco
# donde vive la base: la base (pg_dump) y las fotos subidas (volumen "subidas").
# Comprueba cada fichero antes de darlo por bueno y borra los de más de 30 días.
#
# Programada en el cron del host (crontab de dudu):
#   20 3 * * * cd /home/dudu/apps/merceria-ConfeccionesAnaMari && ./scripts/backup-db.sh >> /home/dudu/logs/merceria-backup.log 2>&1
#
# La API hace además su propia copia diaria de la base (servicios/copias.ts) en
# el volumen "copias", en el mismo disco que la base: esa sirve para deshacer un
# error rápido; esta es la que sobrevive a que se pierda ese disco.
#
# Restaurar (desde la raíz del repo):
#   gunzip -c /mnt/nas/backups/merceria/anamari-FECHA.sql.gz | docker compose exec -T db psql -U anamari anamari
#   docker compose exec -T api tar -xzf - -C /app/datos/subidas < /mnt/nas/backups/merceria/subidas-FECHA.tar.gz
set -euo pipefail

raiz=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
destino="${DESTINO_COPIAS:-/mnt/nas/backups/merceria}"
dias=30
compose=(docker compose -f "$raiz/docker-compose.yml")
fecha=$(date +%Y%m%d-%H%M%S)
base="$destino/anamari-$fecha.sql.gz"
subidas="$destino/subidas-$fecha.tar.gz"

log() { echo "[$(date '+%F %T')] copia: $*"; }
fallar() { log "ERROR: $*"; exit 1; }
trap 'rm -f "$base.tmp" "$subidas.tmp"' EXIT

# Con el disco de datos sin montar, el destino sería un directorio de la raíz.
mountpoint -q /mnt/nas || fallar "/mnt/nas no está montado; no copio nada"
mkdir -p "$destino"
chmod 700 "$destino"

# Un gzip válido y con un mínimo de tamaño: una copia vacía no es una copia.
comprobar() {
  local fichero=$1 minimo=$2
  [ "$(stat -c %s "$fichero")" -ge "$minimo" ] && gzip -t "$fichero" \
    || fallar "copia no válida: $(basename "${fichero%.tmp}") ($(stat -c %s "$fichero") bytes)"
}

"${compose[@]}" exec -T db pg_dump -U anamari anamari | gzip > "$base.tmp" \
  || fallar "pg_dump falló"
comprobar "$base.tmp" 1000
mv "$base.tmp" "$base"

"${compose[@]}" exec -T api tar -czf - -C /app/datos/subidas . > "$subidas.tmp" \
  || fallar "no se pudieron empaquetar las subidas"
comprobar "$subidas.tmp" 100
mv "$subidas.tmp" "$subidas"
chmod 600 "$base" "$subidas"

find "$destino" -maxdepth 1 \( -name 'anamari-*.sql.gz' -o -name 'subidas-*.tar.gz' \) \
  -mtime +"$dias" -print -delete | sed 's/^/  borrada: /'
log "ok: base $(stat -c %s "$base") bytes, subidas $(stat -c %s "$subidas") bytes ($(tar -tzf "$subidas" | grep -vc '/$') ficheros)"
