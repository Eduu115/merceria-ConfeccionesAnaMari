# Confecciones Ana Mari

Sitio web de Confecciones Ana Mari, mercería y taller de arreglos.

El proyecto es un escaparate digital: catálogo de prendas y mercería, información de servicios y vías de contacto. No incluye carrito ni pagos en línea.

## Alcance

El código de este repositorio corresponde al sitio de producción del negocio.

## Despliegue (homelab + Cloudflare Tunnel)

Todo corre en el servidor doméstico con Docker Compose. No hace falta Netlify ni puertos abiertos en el router: Cloudflare Tunnel publica el front y la API.

Al arrancar, la API aplica las migraciones de `apps/api/src/db/migraciones` y, si la base está vacía, la semilla.

### Primera vez

1. Copia `.env.example` a `.env` y rellena al menos `DB_PASSWORD`, `SESION_SECRETO`, `TUNNEL_TOKEN`, `DOMINIO` y `CORS_ORIGINS` (`https://DOMINIO.com,https://www.DOMINIO.com`).
2. En Cloudflare Zero Trust → Networks → Tunnels, crea hostnames públicos:
   - `DOMINIO.com` y `www.DOMINIO.com` → servicio `http://web:80`
   - `api.DOMINIO.com` → servicio `http://api:3001`
3. Lanza el despliegue:

```bash
./scripts/desplegar.sh
```

### Actualizaciones

En el servidor, con el repo en `main` y el working tree limpio:

```bash
./scripts/desplegar.sh
```

El script comprueba dependencias y `.env`, hace `git pull --ff-only`, reconstruye `db` / `api` / `web` / `cloudflared` y verifica `/health`.

Opciones útiles: `--sin-pull`, `--rama <nombre>`, `--forzar` (working tree sucio).

### Desarrollo local

El compose de desarrollo sigue en `docker-compose.dev.yml` (`npm run dev:docker`).

## Contacto

Para cualquier asunto relacionado con el sitio, usa los canales publicados en la web del negocio.
