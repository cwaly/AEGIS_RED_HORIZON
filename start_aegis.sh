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

# --- Verificacion de puertos ocupados (frontend 1337 / AI Gateway 4000) ---
# Si un cierre anterior dejo procesos huerfanos (u otro proyecto usa estos
# puertos), avisamos con detalle en vez de abrir el navegador contra un
# servidor equivocado o inexistente.
find_port_pid() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null | head -n1
        return
    fi
    if command -v fuser &> /dev/null; then
        fuser "$port"/tcp 2>/dev/null | tr -d ' '
        return
    fi
    # Fallback para Git Bash / MSYS en Windows, donde no hay lsof ni fuser
    # pero sí el netstat.exe nativo de Windows.
    if command -v netstat &> /dev/null; then
        netstat -ano 2>/dev/null | grep -E ":$port[[:space:]].*LISTENING" | awk '{print $NF}' | head -n1
    fi
}

PORT_BUSY=0
for PORT in 1337 4000; do
    PID=$(find_port_pid "$PORT")
    if [ -n "$PID" ]; then
        echo "[ERROR] El puerto $PORT ya esta en uso por el proceso PID $PID:"
        ps -p "$PID" -o command= 2>/dev/null | sed 's/^/        /'
        echo "        Puede ser una instancia anterior de AEGIS que no cerro bien, u otro proyecto."
        echo "        Para liberarlo: kill $PID"
        echo ""
        PORT_BUSY=1
    fi
done
if [ "$PORT_BUSY" -eq 1 ]; then
    echo "[ABORTADO] Libera el/los puerto(s) indicado(s) arriba y vuelve a ejecutar este script."
    exit 1
fi

echo "[INFO] Levantando servidor tactico (frontend :1337 + AI Gateway :4000)..."

# Iniciar Vite + AI Gateway en segundo plano
npm run dev &
DEV_PID=$!

# Al salir (Ctrl+C, cierre de terminal, o fin normal) matamos el grupo de
# procesos completo -- evita dejar vite/tsx huerfanos ocupando los puertos
# en la proxima ejecucion.
cleanup() {
    kill -- -$DEV_PID 2>/dev/null || kill "$DEV_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "[INFO] Esperando a que la plataforma responda..."
READY=0
for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:1337; then
        READY=1
        break
    fi
    sleep 1
done

if [ "$READY" -eq 1 ]; then
    echo "[INFO] Plataforma en linea. Abriendo navegador..."
else
    echo "[AVISO] La plataforma esta tardando en responder. Revisa los logs arriba por errores (p.ej. falta GEMINI_API_KEY en .env)."
fi

if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:1337
elif command -v open &> /dev/null; then
    open http://localhost:1337
else
    echo "[INFO] Por favor, abre tu navegador manualmente en: http://localhost:1337"
fi

# Mantener la terminal abierta hasta que el usuario detenga la plataforma
wait "$DEV_PID"
