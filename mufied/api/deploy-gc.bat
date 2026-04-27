
cls
@echo off
echo Deploy start time: %date% %time%
gcloud run deploy nest-api --source . --region asia-south1 --platform managed --allow-unauthenticated --port 8080 --min-instances 0
echo Deploy end time: %date% %time%
