FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
COPY index.js server.js ./
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3003
CMD ["node", "index.js"]

