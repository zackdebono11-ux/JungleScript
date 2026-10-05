@echo off
setlocal EnableDelayedExpansion

title JUNGLESCRIPT // JUNGLE HELPER

:: ============================================================
:: FUTURISTIC JUNGLESCRIPT TERMINAL
:: ============================================================

:: Dark background + bright green text
color 0A

:: Make the console larger
mode con: cols=78 lines=32

cls

:: ------------------------------------------------------------
:: HEADER
:: ------------------------------------------------------------

echo.
echo  ============================================================================
echo.
echo                  J U N G L E S C R I P T
echo.
echo                     J U N G L E   H E L P E R
echo.
echo  ============================================================================
echo.
echo                     CODE WITHOUT LIMITS.
echo.
echo  ----------------------------------------------------------------------------
echo.

:: ------------------------------------------------------------
:: STARTUP SYSTEM
:: ------------------------------------------------------------

echo  [SYSTEM] Initializing Jungle Core...
timeout /t 1 /nobreak >nul

echo  [ OK ]   JungleScript environment
timeout /t 1 /nobreak >nul

echo  [ OK ]   Jungle Helper agent
timeout /t 1 /nobreak >nul

echo  [ OK ]   Multilingual engine
timeout /t 1 /nobreak >nul

echo  [ OK ]   JungleScript knowledge
timeout /t 1 /nobreak >nul

echo.
echo  ----------------------------------------------------------------------------
echo.
echo                         SYSTEM READY
echo.
echo  ----------------------------------------------------------------------------
echo.

:: ------------------------------------------------------------
:: START AGENT
:: ------------------------------------------------------------

echo  [SYSTEM] Connecting to Jungle Helper...
echo.

call "%~dp0start-jungle-helper.bat"

:: ------------------------------------------------------------
:: EXIT
:: ------------------------------------------------------------

echo.
echo  ----------------------------------------------------------------------------
echo.
echo  [SYSTEM] Jungle Helper session ended.
echo.
echo  ============================================================================
echo.

pause
endlocal