# Prueba de fuego: prompts como los escribe un cliente real
$ErrorActionPreference = "Continue"
Set-Location "$PSScriptRoot\.."

$prompts = @(
  "Vi una web en Squarespace estilo Stanton, quiero un blog de recetas parecido para mi negocio",
  "Quiero una web de gestoria y asesoria con navbar, sidebar, footer legal, formulario contacto, mapa y WhatsApp",
  "He visto un despacho de abogados muy elegante en internet, quiero la mia similar con servicios y contacto",
  "Crea una web para mi barberia, vi una en Wix con reservas online y galeria de cortes",
  "Web profesional de energias renovables inspirada en ritest.es: solar fotovoltaica, autoconsumo, baterias, cargadores EV, FAQ y testimonios"
)

$i = 0
foreach ($p in $prompts) {
  $i++
  Write-Host ""
  Write-Host "--- TEST $i ---" -ForegroundColor Cyan
  Write-Host $p
  $body = @{ prompt = $p; lang = "es"; action = "initial"; previewSections = @() } | ConvertTo-Json -Compress
  try {
    $r = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/studio/generate" -ContentType "application/json" -Body $body -TimeoutSec 180
    $types = ($r.previewSections | ForEach-Object { $_.type }) -join ", "
    Write-Host "OK | template: $($r.templateSlug) | business: $($r.businessName) | sections: $($r.previewSections.Count) | source: $($r.source)" -ForegroundColor Green
    Write-Host "types: $types"
    $msgLen = [Math]::Min(140, $r.message.Length)
    Write-Host "msg: $($r.message.Substring(0, $msgLen))"
  } catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
  }
}
