FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY paquetes/compartido/package.json ./paquetes/compartido/
RUN npm ci

FROM deps AS desarrollo
WORKDIR /app
EXPOSE 5173
CMD ["npm", "run", "dev", "-w", "apps/web", "--", "--host", "0.0.0.0"]

FROM deps AS build
COPY paquetes/compartido ./paquetes/compartido
COPY apps/web ./apps/web
RUN npm run build -w apps/web

FROM nginx:1.27-alpine AS produccion
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
