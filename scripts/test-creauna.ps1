# CREAUNA — comprobación completa (ejecutar en orden)
# Uso: .\scripts\test-creauna.ps1
# Requisito: npm run dev en otra terminal (o descomenta Start-Dev abajo)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

Write-Host "`n=== 1. CLAVES API (.env.local) — 6 proveedores ===" -ForegroundColor Cyan
node -e "require('dotenv').config({path:'.env.local'}); const keys=['GEMINI','ANTHROPIC','OPENAI','GROQ','MANUS','FAL']; let ok=0; keys.forEach(k=>{const envKey=k==='FAL'?'FAL_KEY':k+'_API_KEY'; const v=process.env[envKey]||''; const min=k==='FAL'?10:20; const good=v.length>=min; if(good) ok++; console.log(k+': '+(good?'OK ('+v.length+' chars)':'FALTA o invalida ('+v.length+' chars)'))}); process.exit(ok>=1?0:1)"
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nAVISO: Sin claves validas en local." -ForegroundColor Yellow
  Write-Host "  Copia desde Vercel -> Settings -> Environment Variables" -ForegroundColor Yellow
  Write-Host "  O ejecuta: npx vercel env pull .env.local" -ForegroundColor Yellow
}

Write-Host "`n=== 2. SERVIDOR (http://localhost:3000) ===" -ForegroundColor Cyan
try {
  $ping = Invoke-WebRequest -Uri "http://localhost:3000/api/ai/status" -UseBasicParsing -TimeoutSec 5
  Write-Host "Servidor: OK" -ForegroundColor Green
} catch {
  Write-Host "Servidor: NO RESPONDE" -ForegroundColor Red
  Write-Host "  Abre otra terminal y ejecuta: npm run dev" -ForegroundColor Yellow
  exit 1
}

Write-Host "`n=== 3. ESTADO MOTORES (/api/ai/status) ===" -ForegroundColor Cyan
$status = Invoke-RestMethod "http://localhost:3000/api/ai/status"
$status | ConvertTo-Json -Depth 6
if ($status.configured.Count -eq 0) {
  Write-Host "`nNingun motor IA activo (keys missing/invalid)." -ForegroundColor Yellow
}

Write-Host "`n=== 4. GENERACION STUDIO (Rest Art Cafe) ===" -ForegroundColor Cyan
$body = @{
  prompt          = "Rest Art Cafe restaurante terraza Vallecas"
  lang            = "es"
  action          = "initial"
  previewSections = @()
} | ConvertTo-Json -Compress

$r = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/studio/generate" -ContentType "application/json" -Body $body

Write-Host "source:    $($r.source)"
Write-Host "motors:    $($r.motorsUsed -join ', ')"
Write-Host "secciones: $($r.previewSections.Count)"
Write-Host "mensaje:"
Write-Host $r.message

if ($r.source -eq "hybrid") {
  Write-Host "`nRESULTADO STUDIO: IA ACTIVA" -ForegroundColor Green
} elseif ($r.previewSections.Count -gt 0) {
  Write-Host "`nRESULTADO STUDIO: Web generada SIN IA (solo reglas). Anade keys en .env.local" -ForegroundColor Yellow
} else {
  Write-Host "`nRESULTADO STUDIO: ERROR en generacion" -ForegroundColor Red
}

Write-Host "`n=== 5. PING EN VIVO (/api/ai/ping) ===" -ForegroundColor Cyan
try {
  $ping = Invoke-RestMethod "http://localhost:3000/api/ai/ping" -TimeoutSec 120
  Write-Host "OK: $($ping.summary.ok) | Errores: $($ping.summary.errors) | Sin key: $($ping.summary.missing)" -ForegroundColor Green
  $ping.providers | ForEach-Object {
    $color = if ($_.status -eq 'ok') { 'Green' } elseif ($_.status -eq 'missing') { 'Yellow' } else { 'Red' }
    Write-Host "  $($_.label): $($_.status) $(if ($_.latencyMs) { "$($_.latencyMs)ms" } else { '' })" -ForegroundColor $color
    if ($_.error) { Write-Host "    -> $($_.error)" -ForegroundColor Red }
  }
} catch {
  Write-Host "Ping no disponible (401 sin admin/secret o servidor sin keys)." -ForegroundColor Yellow
}
