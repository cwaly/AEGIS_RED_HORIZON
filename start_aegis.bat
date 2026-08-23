@echo off
setlocal enabledelayedexpansion
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
    exit /b 1
)

:: Comprobar si las dependencias estan instaladas
if not exist "node_modules\" (
    echo [INFO] Detectando primera ejecucion. Instalando modulos de Node...
    call npm install
)

:: --- Verificacion de puertos ocupados (frontend 1337 / AI Gateway 4000) ---
:: Si un cierre anterior dejo procesos huerfanos (u otro proyecto usa estos
:: puertos), avisamos con detalle en vez de abrir el navegador contra un
:: servidor equivocado o inexistente.
set PORT_BUSY=0
for %%P in (1337 4000) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
        if not "!REPORTED_%%A!"=="1" (
            set REPORTED_%%A=1
            echo [ERROR] El puerto %%P ya esta en uso por el proceso PID %%A:
            for /f "delims=" %%C in ('powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=%%A').CommandLine" 2^>nul') do echo         %%C
            echo         Puede ser una instancia anterior de AEGIS que no cerro bien, u otro proyecto.
            echo         Para liberarlo: taskkill /F /PID %%A
            echo.
            set PORT_BUSY=1
        )
    )
)
if "%PORT_BUSY%"=="1" (
    echo [ABORTADO] Cierra el/los proceso^(s^) indicado^(s^) arriba y vuelve a ejecutar este script.
    pause
    exit /b 1
)

echo [INFO] Levantando servidor tactico ^(frontend :1337 + AI Gateway :4000^)...
start "AEGIS Red Horizon - Server" cmd /k npm run dev

echo [INFO] Esperando a que la plataforma responda...
set READY=0
for /l %%i in (1,1,30) do (
    if "!READY!"=="0" (
        curl -s -o nul http://localhost:1337
        if not errorlevel 1 (
            set READY=1
        ) else (
            ping -n 2 127.0.0.1 >nul
        )
    )
)

if "%READY%"=="1" (
    echo [INFO] Plataforma en linea. Abriendo navegador...
) else (
    echo [AVISO] La plataforma esta tardando en responder. Revisa la ventana "AEGIS Red Horizon - Server" por errores ^(p.ej. falta GEMINI_API_KEY en .env^).
)
start http://localhost:1337

echo.
echo [INFO] AEGIS corre en la ventana "AEGIS Red Horizon - Server". Cierra esa ventana ^(o Ctrl+C dentro de ella^) para detener la plataforma por completo.
pause
