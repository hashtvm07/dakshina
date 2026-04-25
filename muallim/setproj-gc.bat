@echo off
setlocal

set "PROJECT_ID=%~1"
if "%PROJECT_ID%"=="" (
  echo Usage: setproj-gc.bat ^<gcp-project-id^>
  echo Example: setproj-gc.bat my-real-project-id
  exit /b 1
)

call gcloud config set project "%PROJECT_ID%"
