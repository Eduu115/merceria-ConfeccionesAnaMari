#!/usr/bin/env bash
# Compatibilidad: el script real está en scripts/desplegar.sh
exec "$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)/scripts/desplegar.sh" "$@"
