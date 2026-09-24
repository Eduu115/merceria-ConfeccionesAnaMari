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

vars_obligatorias=(DB_PASSWORD DOMINIO CORS_ORIGINS SESION_SECRETO)
declare -A env_vals=()
for v in "${vars_obligatorias[@]}"; do
  env_vals["$v"]="$(leer_env "$v")"
  [[ -n "${env_vals[$v]}" ]] || fallar "Falta la variable $v en .env"
done

DOMINIO="${env_vals[DOMINIO]}"
PUERTO_WEB="$(leer_env PUERTO_WEB)"
PUERTO_WEB="${PUERTO_WEB:-3012}"

if [[ "$DOMINIO" == "DOMINIO.com" ]]; then
  fallar "DOMINIO sigue siendo el placeholder DOMINIO.com; pon el dominio real."
fi

comando_existe curl || fallar "Falta curl"

if comando_existe systemctl && ! systemctl is-active --quiet cloudflared 2>/dev/null; then
  aviso "El servicio cloudflared del host no está activo; el túnel no llegará a la web."
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

aviso "Construyendo y levantando servicios (db, api, web)…"
"${compose[@]}" up -d --build --remove-orphans
ok "Contenedores en marcha"

local_url="http://127.0.0.1:${PUERTO_WEB}"

esperar_200() {
  local url="$1" intentos="$2" codigo
  for i in $(seq 1 "$intentos"); do
    codigo="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$url" || true)"
    [[ "$codigo" == "200" ]] && { printf '\n'; return 0; }
    printf '\r  %s → %s (intento %s/%s)' "$url" "${codigo:-sin respuesta}" "$i" "$intentos"
    sleep 2
  done
  printf '\n'
  return 1
}

aviso "Comprobando la web en ${local_url} (lo que ve el túnel)…"
esperar_200 "${local_url}/" 45 || fallar "La web no responde en ${local_url}/. Revisa: docker compose logs web"
esperar_200 "${local_url}/health" 45 || fallar "nginx no llega a la API. Revisa: docker compose logs web api"
esperar_200 "${local_url}/api/inicio" 10 || fallar "/api/inicio falla. Revisa: docker compose logs api"
ok "Web, proxy y API responden en local"

aviso "Comprobando https://${DOMINIO} …"
fallos=0
for _ in $(seq 1 10); do
  [[ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 "https://${DOMINIO}/health")" == "200" ]] || fallos=$((fallos + 1))
done
if [[ "$fallos" -eq 0 ]]; then
  ok "https://${DOMINIO} responde 10/10"
else
  aviso "https://${DOMINIO} falló ${fallos}/10. En local va bien, así que el problema está en el túnel:"
  aviso "  - la ruta pública de ${DOMINIO} debe ser http://localhost:${PUERTO_WEB}"
  aviso "  - el túnel debe tener un solo conector (el cloudflared del host)"
fi

"${compose[@]}" ps
