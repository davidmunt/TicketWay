# -------- Etapa 1: Build Angular --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

RUN npm install
COPY . .

# Genera build en la ruta que Angular está usando realmente
RUN npm run build -- --configuration=production

# -------- Etapa 2: Nginx --------
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia la carpeta correcta (según build)
COPY --from=builder /app/dist/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
