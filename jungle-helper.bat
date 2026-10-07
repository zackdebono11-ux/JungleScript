@echo off
setlocal EnableDelayedExpansion

title JUNGLESCRIPT // JUNGLE HELPER
color 2F
chcp 65001 >nul
mode con: cols=150 lines=45
cls

echo.
echo ^|                                                                                                                                                      ^|
echo ^|       ██╗██╗   ██╗███╗   ██╗ ██████╗ ██╗     ███████╗███████╗ ██████╗██████╗ ██╗██████╗       ^|
echo ^|       ██║██║   ██║████╗  ██║██╔════╝ ██║     ██╔════╝██╔════╝██╔════╝██╔══██╗██║██╔══██╗     ^|
echo ^|       ██║██║   ██║██╔██╗ ██║██║  ███╗██║     █████╗  ███████╗██║     ██████╔╝██║██████╔╝     ^|
echo ^|  ██   ██║██║   ██║██║╚██╗██║██║   ██║██║     ██╔══╝  ╚════██║██║     ██╔══██╗██║██╔══██╗     ^|
echo ^|  ╚█████╔╝╚██████╔╝██║ ╚████║╚██████╔╝███████╗███████╗███████║╚██████╗██║  ██║██║██████╔╝     ^|
echo ^|   ╚════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═════╝      ^|
echo ^|                                                                                                                                                      ^|
echo ^|                              J U N G L E   H E L P E R                                                                                              ^|
echo ^|                                                                                                                                                      ^|
echo ^|______________________________________________________________________________________________________________________________________________________^|
echo.

echo [SYSTEM] Initializing Jungle Core...
timeout /t 1 /nobreak >nul

echo [ OK ]   JungleScript environment
timeout /t 1 /nobreak >nul

echo [ OK ]   Jungle Helper agent
timeout /t 1 /nobreak >nul

echo [ OK ]   Multilingual engine
timeout /t 1 /nobreak >nul

echo [ OK ]   JungleScript knowledge
echo.

echo [SYSTEM] SYSTEM READY
echo.

echo [SYSTEM] Connecting to Jungle Helper...
echo.

call "%~dp0start-jungle-helper.bat"

echo.
echo [SYSTEM] Jungle Helper session ended.
echo.
pause

endlocal