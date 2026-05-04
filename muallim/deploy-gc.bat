
cls
@echo off
echo Deploy start time: %date% %time%
Echo Deploying MUALLIM

@echo off
setlocal

set "PROJECT_ID=muallim-494306"
set "REGION=asia-south1"
set "SERVICE_NAME=muallim"
set "CLOUD_SQL_INSTANCE=%PROJECT_ID%:%REGION%:muallim-db-instace"
set "DB_SOCKET_PATH=/cloudsql/%CLOUD_SQL_INSTANCE%"
set "DB_USERNAME=postgres"
set "DB_PASSWORD=Trivandrum@123"
set "DB_NAME=muallimdb"
set "DB_SYNC=true"
set "DB_SEED=true"

gcloud run deploy "%SERVICE_NAME%" ^
  --source . ^
  --region "%REGION%" ^
  --allow-unauthenticated ^
  --project "%PROJECT_ID%" ^
  --add-cloudsql-instances "%CLOUD_SQL_INSTANCE%" ^
  --set-env-vars "DB_SOCKET_PATH=%DB_SOCKET_PATH%,DB_PORT=5432,DB_USERNAME=%DB_USERNAME%,DB_PASSWORD=%DB_PASSWORD%,DB_NAME=%DB_NAME%,DB_SYNC=%DB_SYNC%,DB_SEED=%DB_SEED%,BOOTSTRAP_FAIL_FAST=false,DB_CONNECT_TIMEOUT_MS=10000,NODE_ENV=production"



echo Deploy end time: %date% %time%
