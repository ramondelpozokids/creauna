# Comprueba registro de cliente + login superadmin (servidor local o producción)
param(
  [string]$BaseUrl = "http://localhost:3000",
  [switch]$Production
)

if ($Production) { $BaseUrl = "https://creauna.vercel.app" }

Write-Host "=== CREAUNA auth check ($BaseUrl) ===" -ForegroundColor Cyan

# 1. Estado del sistema
try {
  $status = Invoke-RestMethod -Uri "$BaseUrl/api/auth/status" -Method GET
  Write-Host "`n[status]" -ForegroundColor Yellow
  $status | ConvertTo-Json -Depth 4
  if ($status.db -ne "ok") {
    Write-Host "FALLO: base de datos no disponible" -ForegroundColor Red
    exit 1
  }
  if (-not $status.adminBootstrapConfigured) {
    Write-Host "AVISO: falta CREAUNA_ADMIN_PASSWORD en Vercel (superadmin login bootstrap)" -ForegroundColor DarkYellow
  }
} catch {
  Write-Host "No se pudo leer /api/auth/status: $_" -ForegroundColor Red
  exit 1
}

# 2. Registro cliente de prueba
$testEmail = "test-cliente-$(Get-Random -Maximum 999999)@example.com"
$testPass = "TestCliente123"
$testBody = @{
  name = "Cliente Prueba"
  email = $testEmail
  password = $testPass
} | ConvertTo-Json

Write-Host "`n[register cliente] $testEmail" -ForegroundColor Yellow
try {
  $reg = Invoke-WebRequest -Uri "$BaseUrl/api/auth/register" -Method POST -ContentType "application/json" -Body $testBody -UseBasicParsing
  if ($reg.StatusCode -eq 200) {
    Write-Host "OK registro cliente" -ForegroundColor Green
  }
} catch {
  $err = $_.ErrorDetails.Message
  if ($err -match "409|registrado") {
    Write-Host "Email ya existía (aceptable en re-runs)" -ForegroundColor DarkYellow
  } else {
    Write-Host "FALLO registro: $err" -ForegroundColor Red
  }
}

# 3. Login cliente
$loginBody = @{ email = $testEmail; password = $testPass } | ConvertTo-Json
Write-Host "`n[login cliente]" -ForegroundColor Yellow
try {
  $login = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
  if ($login.StatusCode -eq 200) {
    Write-Host "OK login cliente" -ForegroundColor Green
  }
} catch {
  Write-Host "FALLO login cliente: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`nSuperadmin: usa info@ramondelpozorott.es en /login tras configurar CREAUNA_ADMIN_PASSWORD en Vercel." -ForegroundColor Cyan
Write-Host "Listo." -ForegroundColor Green
