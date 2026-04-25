@echo off
setlocal

set "PROJECT_ID=%~1"
if "%PROJECT_ID%"=="" (
  echo Usage: deploy-gc.bat ^<gcp-project-id^>
  echo Example: deploy-gc.bat my-real-project-id
  exit /b 1
)

call gcloud config set project "%PROJECT_ID%"
if errorlevel 1 exit /b %errorlevel%

call gcloud run deploy muallim ^
  --project "%PROJECT_ID%" ^
  --source . ^
  --region asia-south1 ^
  --platform managed ^
  --allow-unauthenticated ^
  --port 8080 ^
  --min-instances 0
