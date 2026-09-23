FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY paquetes/compartido/package.json ./paquetes/compartido/
RUN npm ci

FROM deps AS desarrollo
RUN apk add --no-cache wget
WORKDIR /app
CMD ["npm", "run", "dev", "-w", "apps/api"]

FROM node:20-alpine AS deps-prod
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY paquetes/compartido/package.json ./paquetes/compartido/
RUN npm ci --omit=dev

FROM node:20-alpine AS produccion
RUN apk add --no-cache wget
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps-prod /app /app
COPY paquetes/compartido ./paquetes/compartido
COPY apps/api ./apps/api
RUN mkdir -p /app/datos/subidas /app/datos/copias \
  && chown -R app:app /app
USER app
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
CMD ["npm", "run", "start", "-w", "apps/api"]
