# 1. Usar una imagen base de Node.js ligera y segura (Alpine Linux)
FROM node:20-alpine

# 2. Crear el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package.json package-lock.json* ./

# 4. Instalar las dependencias
RUN npm install

# 5. Copiar el resto del código fuente al contenedor
COPY . .

# 6. Exponer el puerto hacker 1337
EXPOSE 1337

# 7. Comando para iniciar la aplicación
# Usamos '--host' para permitir conexiones desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]