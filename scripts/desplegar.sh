#!/usr/bin/env bash
# Despliegue en el homelab: comprobaciones → git pull → docker compose up.
# Uso (en el servidor, desde cualquier sitio):
#   ./scripts/desplegar.sh
#   ./scripts/desplegar.sh --rama main
#   ./scripts/desplegar.sh --sin-pull          # solo reconstruir contenedores
#   ./scripts/desplegar.sh --forzar            # permite working tree sucio
set -euo pipefail

raiz="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$raiz"

rama="main"
hacer_pull=1
forzar=0
compose=(docker compose -f "$raiz/docker-compose.yml")

rojo() { printf '\033[31m%s\033[0m\n' "$*"; }
verde() { printf '\033[32m%s\033[0m\n' "$*"; }
aviso() { printf '\033[33m%s\033[0m\n' "$*"; }

uso() {
  sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --rama) rama="${2:?}"; shift 2 ;;
    --sin-pull) hacer_pull=0; shift ;;
    --forzar) forzar=1; shift ;;
    -h|--help) uso 0 ;;
    *) rojo "Opción desconocida: $1"; uso 1 ;;
  esac
done

fallar() {
  rojo "✗ $*"
  exit 1
}

ok() { verde "✓ $*"; }

# --- Comprobaciones -----------------------------------------------------------

comando_existe() { command -v "$1" >/dev/null 2>&1; }

[[ -d "$raiz/.git" ]] || fallar "No es un repositorio git: $raiz"
comando_existe git || fallar "Falta git"
comando_existe docker || fallar "Falta docker"
docker compose version >/dev/null 2>&1 || fallar "Falta el plugin 'docker compose'"

[[ -f "$raiz/.env" ]] || fallar "No hay .env en la raíz. Copia .env.example y rellénalo."

# Lee KEY=valor del .env sin ejecutarlo (evita fallos con espacios, p. ej. ADMIN_NOMBRE=Ana Mari).
leer_env() {
  local clave="$1" linea valor
  linea="$(grep -E "^[[:space:]]*${clave}=" "$raiz/.env" | tail -n1 || true)"
  [[ -n "$linea" ]] || { printf ''; return; }
  valor="${linea#*=}"
  valor="${valor#"${valor%%[![:space:]]*}"}"
  valor="${valor%"${valor##*[![:space:]]}"}"
  if [[ "$valor" == \"*\" ]]; then
    valor="${valor:1:${#valor}-2}"
  elif [[ "$valor" == \'*\' ]]; then
    valor="${valor:1:${#valor}-2}"
  fi
  printf '%s' "$valor"
}

vars_obligatorias=(DB_PASSWORD TUNNEL_TOKEN DOMINIO CORS_ORIGINS SESION_SECRETO)
declare -A env_vals=()
for v in "${vars_obligatorias[@]}"; do
  env_vals["$v"]="$(leer_env "$v")"
  [[ -n "${env_vals[$v]}" ]] || fallar "Falta la variable $v en .env"
done

DOMINIO="${env_vals[DOMINIO]}"
TUNNEL_TOKEN="${env_vals[TUNNEL_TOKEN]}"

if [[ "$DOMINIO" == "DOMINIO.com" ]]; then
  fallar "DOMINIO sigue siendo el placeholder DOMINIO.com; pon el dominio real."
fi

rama_actual="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$rama_actual" != "$rama" ]]; then
  if [[ "$forzar" -eq 1 ]]; then
    aviso "Estás en '$rama_actual' (esperado '$rama'); continúo por --forzar."
  else
    fallar "Rama actual: $rama_actual. Cambia a '$rama' o usa --rama / --forzar."
  fi
fi

if [[ -n "$(git status --porcelain)" ]]; then
  if [[ "$forzar" -eq 1 ]]; then
    aviso "Working tree sucio; continúo por --forzar."
  else
    fallar "Hay cambios sin commit. Haz commit/stash o usa --forzar."
  fi
fi

ok "Comprobaciones iniciales"

# --- Git pull -----------------------------------------------------------------

if [[ "$hacer_pull" -eq 1 ]]; then
  aviso "git fetch + pull --ff-only (origin/$rama)…"
  git fetch --prune origin
  if ! git rev-parse --verify "origin/$rama" >/dev/null 2>&1; then
    fallar "No existe origin/$rama"
  fi
  if [[ "$rama_actual" != "$rama" ]]; then
    git checkout "$rama"
  fi
  git pull --ff-only origin "$rama"
  ok "Código actualizado ($(git rev-parse --short HEAD))"
else
  aviso "Omitiendo git pull (--sin-pull)"
fi

# --- Docker -------------------------------------------------------------------

aviso "Construyendo y levantando servicios (db, api, web, cloudflared)…"
"${compose[@]}" up -d --build --remove-orphans
ok "Contenedores en marcha"

aviso "Esperando salud de la API…"
intentos=30
hasta_ok=0
for i in $(seq 1 "$intentos"); do
  if "${compose[@]}" exec -T api wget -qO- http://127.0.0.1:3001/health >/dev/null 2>&1; then
    hasta_ok=1
    break
  fi
  sleep 2
done
[[ "$hasta_ok" -eq 1 ]] || fallar "La API no respondió /health a tiempo. Revisa: docker compose logs api"

ok "API sana"
"${compose[@]}" ps

cat <<EOF

$(verde "Despliegue terminado.")
  Sitio:  https://${DOMINIO}
  API:    https://api.${DOMINIO}
  Salud:  https://api.${DOMINIO}/health

Recuerda en Cloudflare Tunnel:
  ${DOMINIO} / www.${DOMINIO}  →  http://web:80
  api.${DOMINIO}               →  http://api:3001
EOF
