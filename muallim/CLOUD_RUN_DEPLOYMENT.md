# Cloud Run Deployment Guide for Muallim Portal

## Overview

This guide explains how to deploy the muallim-api service (NestJS API + Angular UIs) to Google Cloud Run with Cloud SQL integration.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Cloud Run Service                      │
│                    (muallim-api:8080)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NestJS API Server (port 8080)                       │   │
│  │  - /api/* → API routes                               │   │
│  │  - /web-ui/* → Web UI (Angular)                      │   │
│  │  - /admin-ui/* → Admin UI (Angular)                  │   │
│  │  - /api/health → Health check endpoint               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Cloud SQL Proxy (optional, via socket)              │   │
│  │  - Connects to Cloud SQL PostgreSQL                  │   │
│  │  - Unix socket: /cloudsql/{CONNECTION_NAME}          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↓
    Cloud SQL PostgreSQL Instance
    (muallim_portal database)
```

---

## Prerequisites

1. **Google Cloud Project** with:
   - Cloud Run API enabled
   - Cloud SQL Admin API enabled
   - Container Registry API enabled
   - Artifact Registry API enabled

2. **gcloud CLI** installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Cloud SQL PostgreSQL Instance** running:
   - Instance should be accessible
   - Database `muallim_portal` created
   - User with appropriate permissions

4. **Docker** installed (for local testing)

---

## Deployment Methods

### Method 1: Deploy via gcloud CLI (Recommended)

#### Step 1: Build and Push Container Image

```bash
# Set your project ID and image name
export PROJECT_ID=$(gcloud config get-value project)
export IMAGE_NAME=muallim-api
export IMAGE_URL=gcr.io/${PROJECT_ID}/${IMAGE_NAME}

# Build the Docker image and push to Container Registry
gcloud builds submit --tag ${IMAGE_URL}:latest

# Or build locally and push
docker build -t ${IMAGE_URL}:latest .
docker push ${IMAGE_URL}:latest
```

#### Step 2: Deploy to Cloud Run

```bash
# Deploy with Cloud SQL connection
gcloud run deploy muallim-api \
  --image ${IMAGE_URL}:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 3600 \
  --set-env-vars "DB_INSTANCE_CONNECTION_NAME=PROJECT_ID:REGION:INSTANCE_NAME,DB_USERNAME=postgres,DB_PASSWORD=YOUR_PASSWORD" \
  --add-cloudsql-instances PROJECT_ID:REGION:INSTANCE_NAME
```

Replace:
- `PROJECT_ID` - Your GCP project ID
- `REGION` - Cloud SQL region (e.g., asia-south1)
- `INSTANCE_NAME` - Cloud SQL instance name
- `YOUR_PASSWORD` - Database password

#### Step 3: Verify Deployment

```bash
# Get the service URL
gcloud run services describe muallim-api --region asia-south1

# Test the health endpoint
curl https://muallim-api-XXXXX.run.app/api/health
```

---

## Environment Variables Configuration

### Database Connection (Choose ONE)

#### Option A: Cloud SQL Proxy (Recommended for Cloud Run)

```bash
DB_INSTANCE_CONNECTION_NAME=project-id:region:instance-name
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

The entrypoint script will automatically:
1. Start Cloud SQL Proxy
2. Create a Unix socket at `/cloudsql/{CONNECTION_NAME}`
3. Set `DB_SOCKET_PATH` for TypeORM

#### Option B: Direct DATABASE_URL

```bash
DATABASE_URL=postgresql://username:password@host:5432/muallim_portal
```

#### Option C: Manual Configuration

```bash
DB_HOST=cloudsqlproxy-host
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

### Other Configuration

```bash
# Node.js and API
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=512
PORT=8080

# Database
DB_SYNC=false                    # Don't auto-sync schema in production
DB_SSL=false                     # Use SSL if required
DB_CONNECT_TIMEOUT_MS=10000      # Connection timeout in ms

# Application
LOG_LEVEL=info
```

---

## Database Setup

### Create Cloud SQL Instance

```bash
# Create a new PostgreSQL instance
gcloud sql instances create muallim-postgresql \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region asia-south1 \
  --availability-type REGIONAL

# Create database
gcloud sql databases create muallim_portal \
  --instance=muallim-postgresql

# Create user
gcloud sql users create postgres \
  --instance=muallim-postgresql \
  --password=YOUR_SECURE_PASSWORD
```

### Initialize Database Schema

The NestJS API will auto-sync the schema on first run if `DB_SYNC=true` is set (development only).

For production, use TypeORM migrations:

```bash
# Generate migration
npm run typeorm migration:generate -- -n InitialSchema -d src/database.config.ts

# Run migration
npm run typeorm migration:run -- -d src/database.config.ts
```

---

## Monitoring and Troubleshooting

### View Logs

```bash
# Stream logs from Cloud Run service
gcloud run services logs read muallim-api --region asia-south1 --limit 50 --follow

# View build logs
gcloud builds log [BUILD_ID] --region asia-south1
```

### Common Issues

#### 1. Container Fails to Start

**Symptom:** "The user-provided container failed to start and listen on the port"

**Solutions:**
- Check logs: `gcloud run services logs read muallim-api --limit 100`
- Verify PORT is set to 8080
- Check NestJS main.ts is listening on PORT environment variable
- Ensure node_modules are properly installed

#### 2. Database Connection Timeout

**Symptom:** "Error: connect ECONNREFUSED" or "Database connection timeout"

**Solutions:**
- Verify Cloud SQL instance is running
- Check `DB_INSTANCE_CONNECTION_NAME` format: `project-id:region:instance-name`
- Verify database credentials are correct
- Ensure Cloud SQL API is enabled

#### 3. Cloud SQL Proxy Fails to Start

**Symptom:** "Cloud SQL Proxy did not become ready in time"

**Solutions:**
- Verify Cloud SQL instance name is correct
- Check instance has public IP or is in VPC properly configured
- Increase timeout in entrypoint.sh if needed
- Check Cloud SQL Admin API is enabled

#### 4. Static UI Files Not Found

**Symptom:** "Admin UI bundle not found" warning in logs

**Solutions:**
- Verify Angular builds succeeded during Docker build
- Check build output paths in Dockerfile match angular.json configuration
- Run `npm run build` locally to test
- Check for build errors in Docker build logs

#### 5. Health Check Failures

**Symptom:** Service crashes after X minutes, "Health check failed"

**Solutions:**
- Ensure `/api/health` endpoint exists and returns 200 status
- Check database connection is working
- Monitor API server startup time (may need `--min-instances 1`)
- Increase health check timeout in Dockerfile if needed

---

## Performance Tuning

### Memory Configuration

```bash
# Current default: 512Mi (suitable for small workloads)
# For higher traffic, use:
gcloud run deploy muallim-api \
  --memory 1024Mi \
  --cpu 1
```

### CPU Configuration

Cloud Run allocates CPU based on memory:
- 128Mi → 0.083 vCPU (shared)
- 256Mi → 0.25 vCPU
- 512Mi → 0.5 vCPU
- 1024Mi → 1 vCPU

### Min/Max Instances

```bash
# Set minimum instances (avoid cold starts)
gcloud run services update muallim-api \
  --min-instances 1 \
  --max-instances 10
```

---

## Database Optimization for Cloud Run

### Connection Pool

TypeORM connection pool is configured in the API. For Cloud Run:
- Default pool size: 25 connections (suitable for Cloud SQL Proxy)
- Adjust if needed in database.config.ts

### Timeouts

```bash
# Connection timeout: 10 seconds (production default)
DB_CONNECT_TIMEOUT_MS=10000

# Query timeout: Configure in TypeORM options
# Statement timeout: Configure at database level
```

---

## Scaling and Cost Optimization

### Recommended Configuration for Production

```bash
gcloud run deploy muallim-api \
  --region asia-south1 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --concurrency 100 \
  --min-instances 1 \
  --max-instances 100 \
  --platform managed \
  --allow-unauthenticated
```

### Estimated Monthly Cost (asia-south1)

- **Cloud Run:** ~$2-5/month (first 2M requests free)
- **Cloud SQL (db-f1-micro):** ~$10-15/month
- **Total:** ~$15-20/month

---

## Security Best Practices

### 1. Use Secret Manager for Credentials

```bash
# Store database password in Secret Manager
echo -n "your-password" | gcloud secrets create db-password --data-file=-

# Reference in Cloud Run
gcloud run deploy muallim-api \
  --set-env-vars "DB_PASSWORD=projects/PROJECT_ID/secrets/db-password/latest"
```

### 2. Use Cloud SQL Proxy

Recommended over direct database connections. It provides:
- Encrypted connections
- IP whitelisting
- Connection control
- Audit logs

### 3. Enable IAM Binding

```bash
# Allow only specific users to deploy
gcloud run services add-iam-policy-binding muallim-api \
  --member=serviceAccount:SERVICE_ACCOUNT_EMAIL \
  --role=roles/run.developer
```

### 4. Use Private Cloud SQL

For production, keep database private:
- Remove public IP
- Use Private Service Connection or VPC
- Connect only via Cloud SQL Proxy

---

## Backup and Disaster Recovery

### Automated Backups

```bash
# Enable automated backups on Cloud SQL instance
gcloud sql backups create --instance=muallim-postgresql

# Schedule daily backups
gcloud sql instances patch muallim-postgresql \
  --backup-start-time 03:00 \
  --transaction-log-retention-days 7
```

### Manual Backup

```bash
gcloud sql backups create --instance=muallim-postgresql --description="production-backup"
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Configure Docker authentication
        run: gcloud auth configure-docker
      
      - name: Build and push Docker image
        run: |
          docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/muallim-api:${{ github.sha }} .
          docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/muallim-api:${{ github.sha }}
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy muallim-api \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/muallim-api:${{ github.sha }} \
            --region asia-south1 \
            --set-env-vars DB_INSTANCE_CONNECTION_NAME=${{ secrets.DB_CONNECTION_NAME }}
```

---

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Proxy Guide](https://cloud.google.com/sql/docs/postgres/cloud-sql-proxy)
- [NestJS with Cloud SQL](https://cloud.google.com/nodejs/docs/reference/cloud-sql-connector/latest)
- [TypeORM PostgreSQL Driver](https://typeorm.io/data-source-options#postgres-data-source-options)

---

## Support and Issues

If you encounter issues:

1. Check logs: `gcloud run services logs read muallim-api --limit 100`
2. Test locally with Docker: `docker run -e PORT=8080 -p 8080:8080 gcr.io/PROJECT/muallim-api:latest`
3. Check Cloud SQL connectivity: `gcloud sql operations list --instance=muallim-postgresql`
4. Verify IAM permissions are correctly set
