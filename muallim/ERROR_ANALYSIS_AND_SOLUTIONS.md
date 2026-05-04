# Error Analysis and Solutions - Muallim Portal Cloud Run Deployment

## Overview

This document analyzes all potential errors that can occur during deployment and provides solutions.

---

## Build-Time Errors

### Error 1: Angular Build Failure

**Error Message in Docker Build:**
```
ERROR: TS5001: Missing type definition file for 'X'
ERROR: error TS2551: Property does not exist
✘ [ERROR] TS2551: Property '...' does not exist on type '...'
```

**Root Causes:**
1. Missing or incorrect TypeScript type definitions
2. Component property name mismatch in templates
3. Incorrect import statements
4. Angular version compatibility issues

**Solutions:**
```bash
# 1. Clean and rebuild locally
rm -rf node_modules dist
npm ci
npm run build

# 2. Check for template/component mismatches
# Review error location from build output

# 3. Update TypeScript definitions
npm install --save-dev @types/node

# 4. Check Angular version compatibility
ng version
```

---

### Error 2: NestJS Build Failure

**Error Message:**
```
✘ [ERROR] Cannot find module 'X'
ERROR: Could not resolve module 'X' with the given conditions
```

**Root Causes:**
1. Missing dependencies
2. TypeORM driver not installed
3. Database config loading errors
4. Import path issues

**Solutions:**
```bash
# 1. Install missing dependencies
npm install

# 2. Verify all databases drivers are installed
npm install pg  # PostgreSQL driver for TypeORM

# 3. Check import paths
grep -r "from \'" src/ | grep -i database

# 4. Rebuild
npm run build
```

---

### Error 3: Docker Build Timeout or Failure

**Error Message:**
```
ERROR: build step 0 failed: step exited with non-zero status: 1
The build was timeout during the execution
```

**Root Causes:**
1. npm ci taking too long (slow network)
2. Build step failing silently
3. Out of memory during build
4. Disk space issues

**Solutions:**
```bash
# 1. Build locally first to identify issues
docker build -t muallim-api:test .

# 2. Check Docker daemon status
docker system df  # Check disk usage

# 3. Prune unused layers
docker system prune -a

# 4. Build with increased resources
# (local Docker Desktop → Preferences → Resources)

# 5. Use gcloud builds with more resources
gcloud builds submit --config=cloudbuild.yaml \
  --machine-type=N1_HIGHCPU_8
```

---

## Runtime Errors

### Error 4: Container Not Listening on Port 8080

**Error in Cloud Run:**
```
ERROR: (gcloud.run.deploy) The user-provided container failed to start 
and listen on the port defined by the PORT=8080 environment variable 
within the allocated timeout.
```

**Root Causes:**
1. API not reading PORT environment variable
2. main.ts listening on hardcoded port
3. Startup script error
4. Dependencies not loading
5. Database connection blocking startup

**Solutions:**

Check API listening on PORT:
```bash
# Verify main.ts uses PORT env var
cat api/src/main.ts | grep "process.env.PORT"

# Should output:
# const port = Number(process.env.PORT ?? 3000);
```

**Fix in main.ts if needed:**
```typescript
// ✓ CORRECT
const port = Number(process.env.PORT ?? 3000);

// ✗ WRONG
const port = 3000;  // Hardcoded, ignores PORT env var
```

Test locally:
```bash
# Set PORT and run
PORT=8080 node dist/main

# Or via Docker
docker run -e PORT=8080 -p 8080:8080 muallim-api:test
```

---

### Error 5: Health Check Failures

**Error in Cloud Run:**
```
Revision has failed with unhealthy status
Health checks failed
```

**Root Causes:**
1. `/api/health` endpoint doesn't exist
2. Health check returns non-200 status
3. API crashes during startup
4. Database connection required for health check
5. Startup time exceeds health check timeout

**Solutions:**

Verify health endpoint exists:
```bash
# Check API has health controller
find api/src -name "*health*"

# Expected: api/src/health/health.controller.ts
```

Test health endpoint locally:
```bash
# Start API
PORT=8080 npm run start:prod

# In another terminal
curl http://localhost:8080/api/health
# Should return 200 with JSON response
```

Check startup logs:
```bash
# Stream logs while service starts
gcloud run services logs read muallim-api --limit 50 --follow

# Look for:
# ✓ "NestJS application successfully started"
# ✓ Database connection successful
```

Increase health check timeout if needed:
```bash
# Edit Dockerfile HEALTHCHECK line
# Increase --start-period from 10s to 30s if needed
```

---

### Error 6: Database Connection Failure

**Error in Logs:**
```
Error: getaddrinfo ENOTFOUND <hostname>
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: Client received SASL response, but no SASL response handler
```

**Root Causes:**
1. Incorrect `DB_INSTANCE_CONNECTION_NAME` format
2. Cloud SQL instance not running
3. Cloud SQL Proxy not started
4. Incorrect credentials
5. Database doesn't exist
6. User doesn't have required permissions

**Solutions:**

Verify Cloud SQL instance:
```bash
# List Cloud SQL instances
gcloud sql instances list

# Check instance status
gcloud sql instances describe muallim-postgresql

# Expected status: RUNNABLE
```

Verify connection name format:
```bash
# Format: project-id:region:instance-name
# Example: my-project:asia-south1:muallim-postgresql

# Get exact connection name
gcloud sql instances describe muallim-postgresql \
  --format='value(connectionName)'
```

Test database credentials:
```bash
# Connect directly to verify credentials
psql -h CLOUDSQL_IP -U postgres -d muallim_portal -c "SELECT 1"

# Or use Cloud SQL Auth Proxy
cloud-sql-proxy project-id:region:instance-name &
psql -h /cloudsql/project-id:region:instance-name \
     -U postgres -d muallim_portal
```

Check database exists:
```bash
# List databases
gcloud sql databases list --instance=muallim-postgresql

# If muallim_portal doesn't exist, create it
gcloud sql databases create muallim_portal \
  --instance=muallim-postgresql
```

Verify user permissions:
```bash
# Connect to database and check permissions
psql -h /cloudsql/... -U postgres -d muallim_portal -c "\du"

# Should see postgres user with CREATE, CONNECT privileges
```

---

### Error 7: Cloud SQL Proxy Issues

**Error in Logs:**
```
Cloud SQL Proxy started with PID XXXX
Cloud SQL Proxy did not become ready in time
```

**Root Causes:**
1. Cloud SQL API not enabled
2. Service account doesn't have Cloud SQL Editor role
3. Instance in different region/project
4. Network connectivity issues
5. Cloud SQL instance quota exceeded

**Solutions:**

Enable Cloud SQL API:
```bash
gcloud services enable sqladmin.googleapis.com
```

Check IAM permissions:
```bash
# Get Cloud Run service account
gcloud run services describe muallim-api --region asia-south1 \
  --format='value(serviceAccountEmail)'

# Grant Cloud SQL Editor role
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:SERVICE_ACCOUNT \
  --role=roles/cloudsql.editor
```

Verify instance configuration:
```bash
# Instance should have public IP or proper VPC setup
gcloud sql instances describe muallim-postgresql \
  --format='value(settings.ipConfiguration)'

# For public IP: ipv4Enabled=true
# For VPC: privateNetwork is set
```

Check Cloud Run-Cloud SQL connectivity:
```bash
# Cloud Run must be in same or peer VPC, or instance must have public IP
# For Cloud SQL Proxy to work:
# 1. Instance has public IP, OR
# 2. Cloud Run is in VPC with private service connection
```

---

### Error 8: Static UI Files Not Served

**Symptom:** 404 on `/admin-ui` and `/web-ui` routes

**Root Causes:**
1. Angular builds failed (app.component.html/index.html not copied)
2. Wrong output path in Docker COPY commands
3. Angular configuration changes
4. Build artifacts cleaned up

**Solutions:**

Verify build outputs exist:
```bash
# After Angular build, check output paths
ls -la admin-ui/dist/admin-ui/browser/
ls -la web-ui/dist/web-ui/browser/

# Both should have index.html
```

Check Docker COPY paths:
```bash
# In Dockerfile, verify COPY commands match actual paths:
COPY --from=builder /build/admin-ui/dist/admin-ui/browser ./public/admin-ui
COPY --from=builder /build/web-ui/dist/web-ui/browser ./public/web-ui
```

Rebuild and inspect Docker image:
```bash
# Build image
docker build -t muallim-api:test .

# Verify files copied correctly
docker run --rm muallim-api:test \
  find public -type f -name "*.html"
```

Check NestJS static file serving:
```bash
# In main.ts, verify static serving is configured
grep -n "express.static" api/src/main.ts
```

---

### Error 9: Out of Memory Errors

**Error in Logs:**
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

**Root Causes:**
1. Memory allocation too small (512Mi default may be insufficient)
2. Memory leak in NestJS app or Angular builds
3. Large data operations without streaming
4. Database connection pool leaks

**Solutions:**

Increase Cloud Run memory:
```bash
gcloud run services update muallim-api \
  --memory 1024Mi \
  --region asia-south1
```

Optimize Node.js memory:
```bash
# Dockerfile already sets:
ENV NODE_OPTIONS=--max-old-space-size=512

# Increase if needed:
ENV NODE_OPTIONS=--max-old-space-size=1024
```

Check for memory leaks:
```bash
# Profile locally
node --inspect dist/main

# In Chrome: chrome://inspect
# Profile heap and look for growing memory
```

Optimize database queries:
```typescript
// ✓ Use pagination
const [data, total] = await repository.findAndCount({
  take: 10,
  skip: (page - 1) * 10
});

// ✗ Avoid loading all rows
const data = await repository.find();
```

---

### Error 10: Timeout During Cloud SQL Connection

**Error in Logs:**
```
Error: Client request timeout
Error: Query execution timeout
```

**Root Causes:**
1. Slow Cloud SQL instance (db-f1-micro may be slow)
2. Network latency in communication
3. Long-running queries
4. Connection pool exhausted

**Solutions:**

Upgrade Cloud SQL tier:
```bash
# Current: db-f1-micro (shared resources)
# Upgrade to:
gcloud sql instances patch muallim-postgresql \
  --tier=db-custom-2-7680  # 2 vCPU, 7.5GB RAM
```

Increase database timeout:
```bash
# Set in Cloud Run env vars
DB_CONNECT_TIMEOUT_MS=30000  # 30 seconds
```

Optimize TypeORM config:
```bash
# Reduce connection pool if too many
DB_POOL_SIZE=10  # Default is 25
```

---

## Deployment Error Checklist

### Pre-Deployment

- [ ] Local Docker build succeeds: `docker build -t test .`
- [ ] Angular builds have no errors: `npm run build` (admin-ui, web-ui)
- [ ] NestJS builds: `npm run build` (api)
- [ ] Health endpoint works: `curl http://localhost:8080/api/health`
- [ ] Environment variables documented

### Cloud Build

- [ ] Container Registry API enabled
- [ ] Project ID correct in gcloud commands
- [ ] Build completes without errors
- [ ] Docker image pushed to gcr.io

### Cloud Run Deployment

- [ ] Cloud Run API enabled
- [ ] Service name available (not in use)
- [ ] Region specified (asia-south1)
- [ ] Memory sufficient (512Mi minimum, 1024Mi recommended)

### Cloud SQL Setup

- [ ] Cloud SQL instance running
- [ ] Database created: `muallim_portal`
- [ ] User created with proper permissions
- [ ] Public IP configured (if using proxy)
- [ ] `DB_INSTANCE_CONNECTION_NAME` in correct format

### Connectivity

- [ ] Service account has Cloud SQL Editor role
- [ ] Cloud SQL Proxy can be downloaded
- [ ] Health checks passing
- [ ] API accessible: `curl https://SERVICE_URL/api/health`

---

## Quick Debugging Command Reference

```bash
# View latest logs (last 50 lines)
gcloud run services logs read muallim-api --limit 50

# Follow logs in real-time
gcloud run services logs read muallim-api --follow

# View service details
gcloud run services describe muallim-api

# View revisions
gcloud run revisions list --service muallim-api

# Test service accessibility
curl https://muallim-api-xxxxx.run.app/api/health

# SSH into container (if needed - not recommended for prod)
gcloud run services update muallim-api --debug

# Rollback to previous revision
gcloud run services update-traffic muallim-api --to-revisions=OLD_REVISION=100

# View build logs
gcloud builds log BUILD_ID

# Check resource usage
gcloud run services describe muallim-api --format=json | grep -i memory
```

---

## Summary of Common Solutions

| Issue | Quick Fix |
|-------|-----------|
| Port not listening | Check `process.env.PORT` in main.ts |
| Health check fails | Verify `/api/health` endpoint exists |
| DB connection fails | Check `DB_INSTANCE_CONNECTION_NAME` format |
| Cloud SQL Proxy timeout | Grant IAM roles, check instance status |
| Out of memory | Increase `--memory` to 1024Mi |
| Build timeout | Check npm install, use `--prefer-offline` |
| UI files missing | Verify angular.json outputPath, check Docker COPY |
| Startup too slow | Enable min-instances to avoid cold starts |
| All errors | Check logs: `gcloud run services logs read muallim-api --limit 100` |

