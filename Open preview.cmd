@echo off
rem Builds the Property Management Professionals preview and opens it in your browser.
rem Keep this window open while you look at the site. Close it to stop the preview.
cd /d "%~dp0"
node build.mjs
if errorlevel 1 (
  echo.
  echo The build found problems. Read the list above, fix them, and run this again.
  pause
  exit /b 1
)
start "" http://localhost:4321
node serve.mjs
