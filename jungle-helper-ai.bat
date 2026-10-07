@echo off
chcp 65001 >nul

set "PROJECT=%~dp0JungleAgent\Jungle Helper\JungleHelper"

if not exist "%PROJECT%\sfdx-project.json" (
    exit /b 1
)

cd /d "%PROJECT%"

sf agent preview --authoring-bundle Jungle_Helper --target-org JungleHelper --use-live-actions