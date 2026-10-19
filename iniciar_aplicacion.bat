@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
title SafeWork 4.0 - TECIROMAQ (Servidor Local con SQLite)

echo ====================================================================
echo           SAFEWORK 4.0 - TECIROMAQ (SISTEMA SST CLINICO)
echo ====================================================================
echo.
echo [1/3] Verificando entorno Node.js...

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else (
        echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
        echo Por favor instale Node.js 18 o superior para ejecutar SafeWork 4.0.
        pause
        exit /b 1
    )
)

echo [OK] Node.js detectado correctamente.
echo.
echo [2/3] Compilando recursos y sincronizando Base de Datos SQLite...
node scripts/build-standalone.mjs
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la compilacion de recursos.
    pause
    exit /b 1
)

:: Obtener la direccion IP local de la maquina
set "IP_LOCAL=127.0.0.1"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        set "IP_LOCAL=%%b"
    )
)

echo.
echo [3/3] Servidor listo. Abriendo navegador...
echo.
echo ====================================================================
echo   ENLACES DE ACCESO AL SISTEMA SAFEWORK 4.0:
echo ====================================================================
echo   [Localhost]             http://localhost:5173/
echo   [Direccion IP Red]      http://%IP_LOCAL%:5173/
echo   [Nombre de Servidor/PC] http://%COMPUTERNAME%:5173/
echo ====================================================================
echo   ACCESOS DIRECTOS A MODULOS (DESDE CUALQUIER DISPOSITIVO EN RED):
echo   - Modulo 01 Normativa:    http://%IP_LOCAL%:5173/normativa
echo   - Modulo 02 Inspecciones: http://%IP_LOCAL%:5173/inspecciones
echo   - Modulo 03 Riesgos:      http://%IP_LOCAL%:5173/riesgos
echo   - Modulo 04 Monitoreo:    http://%IP_LOCAL%:5173/monitoreo
echo   - Modulo 05 Capacitacion: http://%IP_LOCAL%:5173/capacitacion
echo   - Modulo 06 LOTO:         http://%IP_LOCAL%:5173/liberacion-loto
echo.
echo   - API SQLite:             http://%IP_LOCAL%:5173/api/state
echo   - Archivo BD:             database/safework_database.sqlite
echo ====================================================================
echo   Para detener el servidor presione CTRL + C en esta ventana.
echo ====================================================================
echo.

start "" "http://localhost:5173/"
node server/server.mjs

pause