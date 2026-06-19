Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CREAUNA - Iniciando servidor local" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js no está instalado." -ForegroundColor Red
    Write-Host "Descárgalo desde: https://nodejs.org`n" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit
}

Write-Host "[OK] Node.js encontrado" -ForegroundColor Green

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "`n[INFO] Instalando dependencias (primera vez)..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n[INFO] Iniciando CREAUNA..." -ForegroundColor Green
Write-Host "Abre en tu navegador: http://localhost:3000`n" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener.`n" -ForegroundColor Gray

npm run dev