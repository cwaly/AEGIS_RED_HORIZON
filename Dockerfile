# ---- Etapa 1: Build del frontend (Vite) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# ---- Etapa 2: Runtime (AI Gateway + estático de producción) ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=1337

# Solo dependencias necesarias en runtime (express, tsx, zod, etc. son "dependencies")
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY server ./server

# 6. Exponer el puerto hacker 1337
EXPOSE 1337

# 7. El servidor Express sirve el build estático y expone /api (Gemini/Ollama)
CMD ["npx", "tsx", "server/index.ts"]
