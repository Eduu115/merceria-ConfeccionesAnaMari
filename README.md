# Confecciones Ana Mari

Sitio web de Confecciones Ana Mari, mercería y taller de arreglos.

El proyecto es un escaparate digital: catálogo de prendas y mercería, información de servicios y vías de contacto. No incluye carrito ni pagos en línea.

## Alcance

El código de este repositorio corresponde al sitio de producción del negocio. La documentación operativa (entorno de trabajo, infraestructura y puesta en marcha) se mantiene fuera del control de versiones y no forma parte de este README.

## Contacto

Para cualquier asunto relacionado con el sitio, usa los canales publicados en la web del negocio.

## Despliegue

El front vive en `apps/web` y se publica en Netlify. La API (`apps/api`) y Postgres corren en el homelab con Docker Compose, sin puertos abiertos en el host. Cloudflare Tunnel expone la API.

Al arrancar, la API aplica las migraciones de `apps/api/src/db/migraciones` y, si la base está vacía, la semilla. No hace falta un `.sql` de init en Postgres.

### Netlify

1. Importa este repositorio. El `netlify.toml` de la raíz fija la base en `apps/web`.
2. En *Environment variables* define `VITE_API_URL=https://api.DOMINIO.com` (sustituye `DOMINIO.com`).
3. El build solo se lanza si cambia algo dentro de `apps/web`.

### Homelab

1. Copia `.env.example` a `.env` y rellena `DB_PASSWORD`, `TUNNEL_TOKEN` y `CORS_ORIGINS` (`https://DOMINIO.com,https://www.DOMINIO.com`).
2. `git pull && docker compose up -d --build`
3. En el panel de Cloudflare Tunnel, la ruta pública es `api.DOMINIO.com` → `http://api:3001`.

El compose de desarrollo local sigue en `docker-compose.dev.yml` (`npm run dev:docker`).
