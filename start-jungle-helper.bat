@echo off
title Jungle Helper

chcp 65001 >nul

echo.
echo Starting Jungle Helper...
echo.

set "PROJECT=%~dp0JungleAgent\Jungle Helper\JungleHelper"

if not exist "%PROJECT%\sfdx-project.json" (
    echo ERROR: Could not find the JungleHelper Salesforce project.
    echo.
    echo Expected:
    echo %PROJECT%
    echo.
    pause
    exit /b 1
)

cd /d "%PROJECT%"

echo Project found:
echo %CD%
echo.
echo Launching Jungle Helper...
echo.

sf agent preview --authoring-bundle Jungle_Helper --target-org JungleHelper --use-live-actions

echo.
echo Jungle Helper has ended.
pause