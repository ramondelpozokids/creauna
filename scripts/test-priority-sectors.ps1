# Valida los 15 sectores prioritarios contra el motor Studio
$ErrorActionPreference = "Continue"
Set-Location "$PSScriptRoot\.."

$tests = @(
  @{ sector = "Reformas"; prompt = "Web para empresa de reformas integrales en Madrid con galeria de obras"; expect = "flow" },
  @{ sector = "Inmobiliaria"; prompt = "Inmobiliaria con listado de pisos y contacto"; expect = "habitat" },
  @{ sector = "Dental"; prompt = "Clinica dental con ortodoncia y reserva de cita"; expect = "care" },
  @{ sector = "Restaurante"; prompt = "Restaurante gourmet con carta y reservas"; expect = "vesper" },
  @{ sector = "Taller"; prompt = "Taller mecanico de coches con citas online"; expect = "pistons" },
  @{ sector = "Abogados"; prompt = "Despacho de abogados laboralistas con servicios"; expect = "lex" },
  @{ sector = "Asesoria"; prompt = "Gestoria y asesoria fiscal para autonomos"; expect = "ledger" },
  @{ sector = "Solar"; prompt = "Empresa energia solar fotovoltaica autoconsumo"; expect = "volt" },
  @{ sector = "Arquitectura"; prompt = "Estudio de arquitectura e interiorismo portfolio"; expect = "blueprint" },
  @{ sector = "Fisioterapia"; prompt = "Clinica de fisioterapia y rehabilitacion"; expect = "care" },
  @{ sector = "Gimnasio"; prompt = "Gimnasio crossfit con planes mensuales"; expect = "forge" },
  @{ sector = "Turismo rural"; prompt = "Casa rural en la sierra con reservas"; expect = "haven" },
  @{ sector = "Peluqueria"; prompt = "Peluqueria y salon de belleza con reservas"; expect = "lumen" },
  @{ sector = "Electricista"; prompt = "Electricista urgencias 24h fontaneria"; expect = "flow" },
  @{ sector = "SaaS"; prompt = "Startup SaaS software B2B con demo"; expect = "arc" }
)

$ok = 0
$fail = 0
foreach ($t in $tests) {
  $body = @{ prompt = $t.prompt; lang = "es"; action = "initial"; previewSections = @() } | ConvertTo-Json -Compress
  try {
    $r = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/studio/generate" -ContentType "application/json" -Body $body -TimeoutSec 120
    if ($r.templateSlug -eq $t.expect) {
      Write-Host "OK  $($t.sector) -> $($r.templateSlug)" -ForegroundColor Green
      $ok++
    } else {
      Write-Host "FAIL $($t.sector) -> $($r.templateSlug) (esperado $($t.expect))" -ForegroundColor Red
      $fail++
    }
  } catch {
    Write-Host "ERR  $($t.sector): $($_.Exception.Message)" -ForegroundColor Red
    $fail++
  }
}
Write-Host ""
Write-Host "Resultado: $ok OK / $($ok + $fail) total"
