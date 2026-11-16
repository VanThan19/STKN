# Script khoi dong nhanh VietFit (Backend API + Frontend Vite)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataDir = Join-Path $root "data"
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null

Write-Host "Dang khoi dong Backend API (cong 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PORT='3000'; `$env:DATA_DIR='$dataDir'; `$env:DEFAULT_LANG='vi'; `$env:PASSWORD_LOGIN='1'; `$env:FIRST_USER_ADMIN='1'; Set-Location '$root\api'; npm.cmd start"

Write-Host "Dang khoi dong Frontend Vite (cong 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm.cmd run dev"
