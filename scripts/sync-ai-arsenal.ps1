# Sync arsenal IA (6 keys) a los 5 proyectos de Ramon
# Uso:
#   1. Copia Clave\arsenal-ai.env.template -> Clave\arsenal-ai.env y rellena keys
#   2. .\scripts\sync-ai-arsenal.ps1
#   3. Opcional Vercel: .\scripts\sync-ai-arsenal.ps1 -PushVercel

param(
  [switch]$PushVercel,
  [switch]$CopyPingModule,
  [string]$SourceEnv = "$env:USERPROFILE\Desktop\Clave\arsenal-ai.env"
)

$ErrorActionPreference = "Stop"

$AI_VARS = @(
  "GEMINI_API_KEY", "GEMINI_MODEL",
  "ANTHROPIC_API_KEY", "CLAUDE_MODEL",
  "OPENAI_API_KEY", "OPENAI_MODEL",
  "GROQ_API_KEY", "GROQ_MODEL",
  "MANUS_API_KEY", "FAL_KEY", "AI_PING_SECRET"
)

$Projects = @(
  @{ Name = "CREAUNA"; Path = "$env:USERPROFILE\Desktop\CREAUNA"; EnvFile = ".env.local"; PingLib = "app\lib\ai\providerPing.ts" },
  @{ Name = "Editorial"; Path = "$env:USERPROFILE\Desktop\editorial"; EnvFile = ".env.local"; PingLib = "src\lib\ai\providerPing.ts" },
  @{ Name = "RDPR"; Path = "$env:USERPROFILE\Desktop\RDPR"; EnvFile = ".env.local"; PingLib = "lib\ai\providerPing.ts" },
  @{ Name = "CourtManager"; Path = "$env:USERPROFILE\Desktop\courtmanager-pro"; EnvFile = ".env.local"; PingLib = "src\lib\ai\providerPing.ts" },
  @{ Name = "Portfolio-Ramon"; Path = "$env:USERPROFILE\Desktop\portfolio-ramon"; EnvFile = ".env.local"; PingLib = "lib\ai\providerPing.ts" }
)

$SharedPing = "$env:USERPROFILE\Desktop\Clave\shared\providerPing.ts"

function Read-EnvMap([string]$Path) {
  $map = @{}
  if (-not (Test-Path $Path)) { return $map }
  Get-Content $Path -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim().Trim('"')
    if ($val) { $map[$key] = $val }
  }
  return $map
}

function Test-RealKey([string]$Key, [string]$Val) {
  if (-not $Val) { return $false }
  if ($Val -match '^(TU_|cambiar|genera|sk_test|whsec_|placeholder|xxx|your_)') { return $false }
  if ($Val -eq '""' -or $Val -eq "''") { return $false }
  $min = if ($Key -eq 'FAL_KEY') { 10 } elseif ($Key -eq 'AI_PING_SECRET') { 8 } else { 20 }
  return $Val.Length -ge $min
}

function Merge-EnvFile([string]$TargetPath, [hashtable]$NewVars) {
  $existing = @{}
  $lines = @()
  if (Test-Path $TargetPath) {
    $lines = @(Get-Content $TargetPath -Encoding UTF8)
    foreach ($line in $lines) {
      $trim = $line.Trim()
      if ($trim -eq "" -or $trim.StartsWith("#")) { continue }
      $idx = $trim.IndexOf("=")
      if ($idx -lt 1) { continue }
      $k = $trim.Substring(0, $idx).Trim()
      $existing[$k] = $true
    }
  }

  $out = New-Object System.Collections.Generic.List[string]
  foreach ($line in $lines) { [void]$out.Add([string]$line) }

  $added = @()
  foreach ($key in $AI_VARS) {
    if (-not $NewVars.ContainsKey($key)) { continue }
    $val = $NewVars[$key]
    if (-not (Test-RealKey $key $val) -and $key -notmatch '_MODEL$') { continue }
    if ($existing.ContainsKey($key)) {
      for ($i = 0; $i -lt $out.Count; $i++) {
        if ($out[$i] -match "^\s*$([regex]::Escape($key))\s*=") {
          $out[$i] = "$key=$val"
          $added += $key
          break
        }
      }
    } else {
      if ($out.Count -gt 0 -and $out[$out.Count - 1] -ne "") { $out.Add("") }
      if ($added.Count -eq 0 -and -not (($out -join "`n") -match "ARSENAL IA")) {
        $out.Add("# --- ARSENAL IA (sync-ai-arsenal.ps1) ---")
      }
      $out.Add("$key=$val")
      $added += $key
    }
  }

  $dir = Split-Path $TargetPath -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -Path $TargetPath -Value $out -Encoding UTF8
  return $added
}

Write-Host "`n=== SYNC ARSENAL IA (6 proveedores x 5 proyectos) ===" -ForegroundColor Cyan

$sourceMap = Read-EnvMap $SourceEnv
if ($sourceMap.Count -eq 0) {
  $fallback = "$env:USERPROFILE\Desktop\CREAUNA\.env.local"
  Write-Host "No encontrado: $SourceEnv" -ForegroundColor Yellow
  Write-Host "Intentando fallback: $fallback" -ForegroundColor Yellow
  $sourceMap = Read-EnvMap $fallback
}

if ($sourceMap.Count -eq 0) {
  Write-Host "`nERROR: Sin keys. Crea $SourceEnv desde arsenal-ai.env.template" -ForegroundColor Red
  exit 1
}

$keyCount = ($AI_VARS | Where-Object { $sourceMap.ContainsKey($_) -and (Test-RealKey $_ $sourceMap[$_]) }).Count
Write-Host "Fuente: $($sourceMap.Count) vars - $keyCount claves IA validas`n" -ForegroundColor Green

if ($keyCount -eq 0) {
  Write-Host "AVISO: No hay keys IA reales en la fuente. Rellena Clave\arsenal-ai.env o CREAUNA\.env.local" -ForegroundColor Yellow
  Write-Host "Continuando: se copiaran modelos y estructura .env.example`n" -ForegroundColor Yellow
}

foreach ($proj in $Projects) {
  $target = Join-Path $proj.Path $proj.EnvFile
  if (-not (Test-Path $proj.Path)) {
    Write-Host "SKIP $($proj.Name) - no existe $($proj.Path)" -ForegroundColor Yellow
    continue
  }

  $merged = Merge-EnvFile $target $sourceMap
  Write-Host "OK  $($proj.Name) -> $($proj.EnvFile) ($($merged.Count) vars IA)" -ForegroundColor Green

  if ($CopyPingModule -and (Test-Path $SharedPing) -and $proj.Name -ne "CREAUNA") {
    $dest = Join-Path $proj.Path $proj.PingLib
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item $SharedPing $dest -Force
    Write-Host "    + providerPing.ts copiado" -ForegroundColor DarkGray
  }
}

if ($PushVercel) {
  Write-Host "`n=== VERCEL (requiere vercel login + link en cada repo) ===" -ForegroundColor Cyan
  foreach ($proj in $Projects) {
    if (-not (Test-Path $proj.Path)) { continue }
    Write-Host "`n--- $($proj.Name) ---" -ForegroundColor Cyan
    Push-Location $proj.Path
    try {
      foreach ($key in $AI_VARS) {
        if (-not $sourceMap.ContainsKey($key) -or -not $sourceMap[$key]) { continue }
        $val = $sourceMap[$key]
        Write-Host "  $key -> production,preview,development"
        $val | npx vercel env add $key production preview development 2>$null
      }
    } catch {
      Write-Host "  AVISO: $($_.Exception.Message)" -ForegroundColor Yellow
    } finally {
      Pop-Location
    }
  }
}

Write-Host "`n=== VERIFICACION LOCAL (npm run ping:ai en cada proyecto) ===" -ForegroundColor Cyan
Write-Host "  CREAUNA:        cd CREAUNA; npm run ping:ai"
Write-Host "  Editorial:      cd editorial; npm run ping:ai"
Write-Host "  RDPR:           cd RDPR; npm run ping:ai"
Write-Host "  CourtManager:   cd courtmanager-pro; npm run ping:ai"
Write-Host "  Portfolio:      cd portfolio-ramon; npm run ping:ai"
Write-Host "`nProduccion: GET /api/ai/ping?secret=TU_AI_PING_SECRET`n" -ForegroundColor DarkGray
