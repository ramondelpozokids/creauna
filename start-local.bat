@echo off
cd /d "%~dp0"
echo ============================================
echo   CREAUNA - Iniciando en local
echo ============================================
echo.

REM Verificar si node esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b
)

echo [OK] Node.js encontrado.
echo.

REM Instalar dependencias si no existen
if not exist "node_modules" (
    echo [INFO] Instalando dependencias - primera vez...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo al instalar dependencias.
        pause
        exit /b
    )
)

echo.
echo [INFO] Iniciando servidor de desarrollo...
echo.
echo Abre en tu navegador:
echo   http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor.
echo.

call npm run dev

pause