# MUFIED API

NestJS backend for the MUFIED site and CMS data endpoints.

## Local Development

```bash
npm install
cp .env.example .env
npm run start:dev
```

The app reads local defaults from `config/config.json` and secrets from `.env`.

## Cloud Run Readiness

This project is configured to run on Google Cloud Run:

- production startup uses `node dist/main.js`
- the HTTP server listens on `0.0.0.0:$PORT`
- Docker deployment is supported through [`Dockerfile`](./Dockerfile)
- source deployments are supported through [`package.json`](./package.json) and [`.gcloudignore`](./.gcloudignore)

## Required Environment Variables

Set these in Cloud Run or Secret Manager:

```bash
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

Optional:

```bash
CORS_ORIGINS=https://example.com,https://admin.example.com
SERVER_PORT=8080
FIREBASE_SERVICE_ACCOUNT_PATH=/secrets/firebase-service-account.json
```

`PORT` is provided automatically by Cloud Run and should not be set manually.

## Deploy To Cloud Run

Deploy from source:

```bash
gcloud run deploy mufied-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

Deploy from Dockerfile:

```bash
gcloud run deploy mufied-api \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated
```

If you use Firebase Admin credentials, prefer Secret Manager or an attached service account instead of shipping a JSON file in the image.
