# Confecciones Ana Mari

Sitio web de la mercería y taller de arreglos de Getafe (Calle Almagro 15). Es un escaparate con catálogo y captación de contacto: no hay carrito ni pagos.

## Requisitos

- Node.js 20 o superior
- Docker y Docker Compose
- PostgreSQL 16 (en local lo levanta Compose)

## Arranque en local

```sh
cp .env.example .env
docker compose up -d postgres
npm install
npm run dev
```

En local, PostgreSQL se publica en el puerto **5434** y la API en **3010**, para no chocar con otros servicios. El front sigue en **5173**.

La semilla se ejecuta sola al arrancar la API si la base está vacía. Crea el usuario propietario con `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`.

Stack completo en contenedores:

```sh
cp .env.example .env
docker compose up --build
```

## Usuarios

Hay tres roles en base de datos, pensados para más adelante:

| Rol | Uso |
|---|---|
| `propietario` | Dueña del negocio. Se crea en la semilla. |
| `admin_web` | Administración técnica del sitio. |
| `cliente` | Área de cliente futura. |

Hoy no hay pantalla de acceso en la web pública. La API de sesión está en `/api/admin/sesion` (cookie httpOnly). El panel de gestión se conectará a esas rutas cuando toque.

## Despliegue en el VPS

Dominio comprado en Hostinger: apunta un registro **A** de `@` y `www` a la IP del servidor. En el panel de Hostinger: Dominios → DNS / zona DNS.

En el servidor (Ubuntu):

```sh
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER
```

Clona el repositorio, copia el entorno y arranca producción:

```sh
cp .env.example .env
# Edita .env: DOMINIO, POSTGRES_PASSWORD, SESION_SECRETO,
# ADMIN_PASSWORD, SMTP_*, ORIGEN_PUBLICO=https://tudominio
chmod +x deploy/desplegar.sh
./deploy/desplegar.sh
```

Compose de producción (`docker-compose.prod.yml`):

- PostgreSQL persistente
- Aplicación (API Node + front estático)
- Caddy en 80/443 con certificado automático

Abre los puertos 80 y 443 en el cortafuegos. Si Hostinger tiene firewall en el panel, añade las mismas reglas.

Tras el primer arranque, Caddy pide el certificado. El dominio debe resolver ya a esa máquina.

Copia de seguridad: cada noche la API lanza `pg_dump` a `/app/datos/copias` (volumen `copias`) y conserva 30 días.

## Variables importantes

Ver `.env.example`. En producción no uses las claves de ejemplo.

## Estructura

```
apps/web          React + Vite + Tailwind
apps/api          Express + Drizzle + PostgreSQL
paquetes/compartido   Tipos y esquemas Zod
deploy/           Caddy y script de despliegue
```
