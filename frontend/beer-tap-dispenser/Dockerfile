FROM node:22-alpine AS builder

WORKDIR /app

# Copiar primero manifests
COPY package.json ./

# Instalar dependencias en modo CI (IMPORTANTE)
RUN npm install --no-cache --prefer-offline --frozen-lockfile
# Ahora copiar el resto del código
COPY . .

ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Static Server ───────────────────
FROM nginx:1.27-alpine

# Limpiar config default
RUN rm /etc/nginx/conf.d/default.conf

# Config SPA React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build generado
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]