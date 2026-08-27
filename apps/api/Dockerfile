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

FROM deps AS web-build
COPY paquetes/compartido ./paquetes/compartido
COPY apps/web ./apps/web
RUN npm run build -w apps/web

FROM deps AS produccion
RUN apk add --no-cache wget
WORKDIR /app
COPY paquetes/compartido ./paquetes/compartido
COPY apps/api ./apps/api
COPY --from=web-build /app/apps/web/dist /app/publico
ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start", "-w", "apps/api"]
