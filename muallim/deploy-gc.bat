@echo off
setlocal

set SERVICE_NAME=muallim
set REGION=asia-south1

for /f "delims=" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i

if "%PROJECT_ID%"=="" (
  echo Unable to determine the active Google Cloud project.
  echo Run: gcloud config set project YOUR_PROJECT_ID
  exit /b 1
)

set IMAGE_URI=gcr.io/%PROJECT_ID%/%SERVICE_NAME%

echo Building %IMAGE_URI% from the root Dockerfile...
gcloud builds submit --tag %IMAGE_URI% .
if errorlevel 1 exit /b 1

echo Deploying %SERVICE_NAME% to Cloud Run in %REGION%...
gcloud run deploy %SERVICE_NAME% --image %IMAGE_URI% --region %REGION% --platform managed --allow-unauthenticated --port 8080 --min-instances 0
if errorlevel 1 exit /b 1

endlocal
