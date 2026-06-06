#!/bin/bash
echo "========================================================"
echo "        INICIANDO AEGIS: RED HORIZON (C2 CORE)"
echo "               Created by Cesar Matute"
echo "========================================================"
echo ""

# Navegar al directorio donde esta el script
cd "$(dirname "$0")"

# Comprobar si Node.js esta instalado
if ! command -v npm &> /dev/null
then
    echo "[ERROR] Node.js no esta instalado. Descargalo de https://nodejs.org/"
    exit 1
fi

# Comprobar si las dependencias estan instaladas
if [ ! -d "node_modules" ]; then
    echo "[INFO] Detectando primera ejecucion. Instalando modulos de Node..."
    npm install
fi

echo "[INFO] Levantando servidor tactico en el puerto 1337..."

# Iniciar Vite en segundo plano
npm run dev &

# Esperar 3 segundos para que el servidor levante
sleep 3

# Intentar abrir el navegador por defecto dependiendo del sistema operativo (Linux o Mac)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:1337
elif command -v open &> /dev/null; then
    open http://localhost:1337
else
    echo "[INFO] Por favor, abre tu navegador manualmente en: http://localhost:1337"
fi

# Mantener la terminal abierta
wait