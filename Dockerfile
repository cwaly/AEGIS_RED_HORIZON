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
# Dentro del contenedor, 127.0.0.1 apunta al propio contenedor, no al host --
# host.docker.internal es como Docker Desktop (Win/Mac) alcanza servicios del
# host, como un Ollama corriendo fuera del contenedor. Si .env define
# OLLAMA_BASE_URL explícitamente (vía --env-file), ese valor gana sobre este
# default. En Linux nativo puede requerir `docker run --add-host=host.docker.internal:host-gateway`.
ENV OLLAMA_BASE_URL=http://host.docker.internal:11434

# Solo dependencias necesarias en runtime (express, zod, dotenv, etc. son "dependencies";
# tsx y typescript son devDependencies, ya no se instalan aquí)
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server

# 6. Exponer el puerto hacker 1337
EXPOSE 1337

# 7. El servidor Express (compilado a JS nativo) sirve el build estático y expone /api (Gemini/Ollama)
CMD ["node", "dist-server/index.js"]
