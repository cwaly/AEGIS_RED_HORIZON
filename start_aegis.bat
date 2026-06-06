@echo off
title AEGIS: Red Horizon - C2 Core Engine
color 0C

echo ========================================================
echo        INICIANDO AEGIS: RED HORIZON (C2 CORE)
echo               Created by Cesar Matute
echo ========================================================
echo.

:: Navegar al directorio donde esta el archivo .bat
cd /d "%~dp0"

:: Comprobar si Node.js esta instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Descargalo de https://nodejs.org/
    pause
    exit
)

:: Comprobar si las dependencias estan instaladas
if not exist "node_modules\" (
    echo [INFO] Detectando primera ejecucion. Instalando modulos de Node...
    call npm install
)

echo [INFO] Levantando servidor tactico en el puerto 1337...

:: Esperar 3 segundos y abrir el navegador web por defecto
timeout /t 3 /nobreak >nul
start http://localhost:1337

:: Iniciar Vite (el servidor web)
call npm run dev

pause