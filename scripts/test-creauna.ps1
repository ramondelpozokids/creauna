# CREAUNA — comprobación completa (ejecutar en orden)
# Uso: .\scripts\test-creauna.ps1
# Requisito: npm run dev en otra terminal (o descomenta Start-Dev abajo)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

Write-Host "`n=== 1. CLAVES API (.env.local) ===" -ForegroundColor Cyan
node -e "require('dotenv').config({path:'.env.local'}); let okCount=0; ['GEMINI','ANTHROPIC','OPENAI','GROQ'].forEach(k=>{const v=process.env[k+'_API_KEY']||''; const ok=v.length>=20; if(ok) okCount++; console.log(k+': '+(ok?'OK ('+v.length+' chars)':'FALTA o invalida ('+v.length+' chars)'))}); process.exit(okCount>0?0:1)"
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
  Write-Host "`nRESULTADO: IA ACTIVA" -ForegroundColor Green
} elseif ($r.previewSections.Count -gt 0) {
  Write-Host "`nRESULTADO: Web generada SIN IA (solo reglas). Anade keys en .env.local" -ForegroundColor Yellow
} else {
  Write-Host "`nRESULTADO: ERROR en generacion" -ForegroundColor Red
}
