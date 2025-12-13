# Etapa 1: dependencias + prisma
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package files
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm ci --only=production

# Copiamos Prisma y generamos el cliente
COPY prisma ./prisma
RUN npx prisma generate

# Copiamos el código
COPY src ./src
COPY index.js server.js ./

# Etapa final
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3003

CMD ["node", "index.js"]

