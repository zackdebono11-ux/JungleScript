$ErrorActionPreference = "Stop"

$Project = Join-Path $PSScriptRoot "JungleAgent\Jungle Helper\JungleHelper"
$Launcher = Join-Path $PSScriptRoot "jungle-helper.bat"

Clear-Host

Write-Host ""
Write-Host "==============================================="
Write-Host "          JUNGLESCRIPT - JUNGLE HELPER"
Write-Host "==============================================="
Write-Host ""
Write-Host "Starting Jungle Helper..."
Write-Host ""

# Check the Salesforce project
if (-not (Test-Path (Join-Path $Project "sfdx-project.json"))) {
    Write-Host "[ERROR] Salesforce project was not found." -ForegroundColor Red
    Write-Host ""
    Write-Host $Project
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

# Check the BAT launcher
if (-not (Test-Path $Launcher)) {
    Write-Host "[ERROR] start-jungle-helper.bat was not found." -ForegroundColor Red
    Write-Host ""
    Write-Host $Launcher
    Write-Host ""
    Read-Host "Press Enter to close"
    exit 1
}

Write-Host "[ OK ] Salesforce project found"
Write-Host "[ OK ] Jungle Helper launcher found"
Write-Host ""
Write-Host "Launching Jungle Helper..."
Write-Host ""

# Run the known-working BAT file and WAIT for it
& $Launcher

$ExitCode = $LASTEXITCODE

Write-Host ""
Write-Host "==============================================="
Write-Host "Jungle Helper finished."
Write-Host "Exit code: $ExitCode"
Write-Host "==============================================="
Write-Host ""

Read-Host "Press Enter to close"