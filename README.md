# Confecciones Ana Mari

Sitio web de Confecciones Ana Mari, mercería y taller de arreglos.

El proyecto es un escaparate digital: catálogo de prendas y mercería, información de servicios y vías de contacto. No incluye carrito ni pagos en línea.

## Alcance

El código de este repositorio corresponde al sitio de producción del negocio.

## Despliegue (homelab + Cloudflare Tunnel)

Todo corre en el servidor doméstico con Docker Compose (`db`, `api`, `web`). El túnel lo gestiona el `cloudflared` instalado en el host, compartido con otras apps; el compose no lleva su propio conector. La web (nginx) se publica solo en `127.0.0.1:3012` y reenvía `/api`, `/subidas` y `/socket.io` a la API.

Al arrancar, la API aplica las migraciones de `apps/api/src/db/migraciones` y, si la base está vacía, la semilla.

### Primera vez

1. Copia `.env.example` a `.env` y rellena al menos `DB_PASSWORD`, `SESION_SECRETO`, `DOMINIO` y `CORS_ORIGINS` (`https://DOMINIO.com,https://www.DOMINIO.com`).
2. En Cloudflare Zero Trust → Networks → Tunnels, en el túnel del host, las rutas públicas:
   - `DOMINIO.com` y `www.DOMINIO.com` → `http://localhost:3012`
3. Lanza el despliegue:

```bash
./scripts/desplegar.sh
```

### Actualizaciones

En el servidor, con el repo en `main` y el working tree limpio:

```bash
./scripts/desplegar.sh
```

El script comprueba dependencias y `.env`, hace `git pull --ff-only`, reconstruye `db` / `api` / `web`, verifica la web, el proxy y la API en `127.0.0.1:3012` y luego el dominio público.

Opciones útiles: `--sin-pull`, `--rama <nombre>`, `--forzar` (working tree sucio).

### Desarrollo local

El compose de desarrollo sigue en `docker-compose.dev.yml` (`npm run dev:docker`).

## Contacto

Para cualquier asunto relacionado con el sitio, usa los canales publicados en la web del negocio.
