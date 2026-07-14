# Copia las muestras AURA del escritorio a public/demos/starters/
# Uso: coloca los HTML en el escritorio y ejecuta:
#   powershell -File scripts/install-aura-starters.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$desktop = [Environment]::GetFolderPath('Desktop')
$starters = Join-Path $root 'public\demos\starters'

$map = @(
  @{ slug = 'lumina-dental'; src = 'dental.html' },
  @{ slug = 'aura-estates'; src = 'inmobiliaria.html' },
  @{ slug = 'aura-sanctuary'; src = 'hotel.html' },
  @{ slug = 'apex-athletics'; src = 'gimnasio.html' },
  @{ slug = 'aeterna-co'; src = 'index.html' },
  @{ slug = 'vitalis-fisio'; src = 'fisio.html' },
  @{ slug = 'armonia-vital'; src = 'acupuntura.html' },
  @{ slug = 'aura-architects'; src = 'aquitectura.html' }
)

$missing = @()
foreach ($item in $map) {
  $src = Join-Path $desktop $item.src
  $destDir = Join-Path $starters $item.slug
  $dest = Join-Path $destDir 'index.html'
  if (-not (Test-Path $src)) {
    $missing += $item.src
    continue
  }
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Copy-Item $src $dest -Force
  Write-Host "OK  $($item.src) -> $($item.slug)/index.html"
}

if ($missing.Count -gt 0) {
  Write-Host ''
  Write-Host 'Faltan en el escritorio:' ($missing -join ', ')
  Write-Host 'Coloca los HTML y vuelve a ejecutar el script.'
  exit 1
}

Write-Host ''
Write-Host 'Las muestras están listas en public/demos/starters/'
