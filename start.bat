@echo off
title CREAUNA - Servidor Local
echo.
echo ==========================================
echo   CREAUNA - Iniciando servidor local
echo ==========================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde: https://nodejs.org
    pause
    exit /b
)

if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

echo.
echo Iniciando CREAUNA...
echo Abre: http://localhost:3000
echo.
echo Presiona Ctrl+C para parar.
echo.

npm run dev

pause