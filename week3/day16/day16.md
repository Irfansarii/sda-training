# This docker-compose.yml file is used to run a complete production-level backend system using multiple services together in containers.

* It means your project is not running only a Node.js app — it is running an entire ecosystem:

* Node.js App
* MongoDB
* PostgreSQL
* Redis
* Nginx
* Prometheus
* Grafana

# all connected automatically through Docker.


User Request
     ↓
Nginx (Reverse Proxy)
     ↓
Node.js App
     ↓
 ┌───────────────┬───────────────┬───────────────┐
 ↓               ↓               ↓
MongoDB      PostgreSQL       Redis
(Database)    (Database)      (Cache)

Monitoring:

# Prometheus → collects metrics


# Grafana → shows dashboards/charts


# Docker Optimization Scripts

This is a **Bash automation script** used for:

✅ Cleaning Docker resources
✅ Building optimized Docker images
✅ Checking image size
✅ Running security scans
✅ Testing container performance

Basically, this script helps developers maintain and optimize Docker applications automatically instead of manually typing many commands.

---

# File Meaning

```bash
#!/bin/bash
```

Means:

Run this script using Bash shell.

---

# Script Name

```bash
scripts/docker-optimize.sh
```

Usually stored inside:

```text
project/
 ├── scripts/
 │    └── docker-optimize.sh
```

---

# What This Script Does Step-by-Step

---

# 1. Print Header

```bash
echo "🐳 Docker Optimization Script"
```

Displays message in terminal.

Output:

```text
🐳 Docker Optimization Script
=========================
```

---

# 2. Clean Unused Docker Resources

```bash
docker system prune -f
```

Removes:

* stopped containers
* unused images
* build cache
* dangling resources

---

## Why Needed?

Docker stores lots of unused data.

Over time:

* disk fills up
* builds become slower

This command cleans unnecessary files.

---

## Volume Cleanup

```bash
docker volume prune -f
```

Deletes unused Docker volumes.

Useful because database volumes can consume huge storage.

---

## Network Cleanup

```bash
docker network prune -f
```

Deletes unused Docker networks.

---

# 3. Build Optimized Image

```bash
docker build --target runner -t sda-training:latest .
```

Builds Docker image.

---

## Meaning of Each Part

| Part                     | Meaning                                      |
| ------------------------ | -------------------------------------------- |
| `docker build`           | Build image                                  |
| `--target runner`        | Use runner stage from multi-stage Dockerfile |
| `-t sda-training:latest` | Tag image name                               |
| `.`                      | Current folder                               |

---

# Why `--target runner`?

In multi-stage Dockerfiles:

```dockerfile
FROM node AS builder
# build app

FROM node AS runner
# final lightweight image
```

`runner` is optimized production image.

Benefits:

✅ smaller size
✅ faster startup
✅ more secure
✅ fewer dependencies

---

# 4. Analyze Image Size

```bash
docker images sda-training:latest
```

Shows:

* image size
* image id
* created date

Example:

```text
REPOSITORY      TAG       SIZE
sda-training    latest    210MB
```

---

# Why Important?

Smaller image means:

✅ faster deployment
✅ faster CI/CD
✅ lower cloud costs
✅ quicker container startup

---

# 5. Security Scan

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image sda-training:latest
```

Runs **Trivy security scanner**.

---

# What Trivy Does

Checks Docker image for:

* vulnerabilities
* outdated packages
* insecure libraries
* CVEs
* malware risks

---

# Example

Suppose image contains:

```text
OpenSSL vulnerable version
```

Trivy reports:

```text
HIGH Vulnerability Found
```

---

# Why Important?

In production:

security vulnerabilities can:

* expose servers
* leak data
* allow hacking

Companies regularly scan images.

---

# 6. Performance Test

```bash
docker run --rm -d --name perf-test sda-training:latest
```

Starts container in background.

---

## Flags Meaning

| Flag               | Meaning                          |
| ------------------ | -------------------------------- |
| `--rm`             | Auto-remove container after stop |
| `-d`               | Detached/background mode         |
| `--name perf-test` | Container name                   |

---

# Wait 10 Seconds

```bash
sleep 10
```

Allows app to fully start.

---

# Monitor Resource Usage

```bash
docker stats perf-test --no-stream
```

Shows:

* CPU usage
* RAM usage
* network usage
* disk I/O

Example:

```text
CPU: 2%
MEMORY: 120MB
```

---

# Stop Test Container

```bash
docker stop perf-test
```

Stops performance test container.

---

# Final Message

```bash
echo "✅ Optimization complete!"
```

Shows success message.

---

# Real Purpose of This Script

This script automates DevOps tasks.

Instead of manually doing:

```bash
docker prune
docker build
docker scan
docker stats
```

everything runs in one command.

---

# Benefits

| Benefit      | Explanation             |
| ------------ | ----------------------- |
| Automation   | Saves time              |
| Optimization | Smaller images          |
| Security     | Detects vulnerabilities |
| Performance  | Measures resource usage |
| Maintenance  | Cleans Docker junk      |
| CI/CD Ready  | Can run in pipelines    |

---

# Real-World Usage

Used in:

* DevOps pipelines
* CI/CD
* Production deployments
* Kubernetes projects
* Cloud deployments

---

# How To Run It

Give permission:

```bash
chmod +x scripts/docker-optimize.sh
```

Run:

```bash
./scripts/docker-optimize.sh
```

---

# Final Summary

This script is basically a:

✅ Docker maintenance tool
✅ Docker optimization tool
✅ Security auditing tool
✅ Performance testing tool
✅ Deployment preparation script

for production-grade backend applications.

Prometheus collects metrics
Your backend services continuously expose data like:

CPU usage
Memory usage
Request count
API response time
Database connections
Errors

Prometheus collects all this data every few seconds.
Grafana displays charts/dashboards

Using Grafana you can see:

✅ API response time
✅ Requests per second
✅ CPU usage
✅ RAM usage
✅ DB performance
✅ Error rate
✅ Cache hit ratio



This file is an Nginx configuration file used to configure:

✅ Reverse Proxy
✅ Load Balancing
✅ Security
✅ HTTPS/SSL
✅ Rate Limiting
✅ Compression
✅ Static File Serving
✅ API Routing

for your backend application. 

---

# Simple Meaning

Instead of users directly accessing your Node.js app:

```text id="c8r6cl"
User → Node.js App
```

this file makes requests go through Nginx first:

```text id="cb15l0"
User → Nginx → Node.js App
```

Nginx becomes the "gateway" for your application.

---

# What is Nginx?

Nginx is a very fast web server and reverse proxy.

Used for:

* handling traffic
* forwarding requests
* security
* HTTPS
* load balancing
* caching

Most production applications use Nginx.

---

# File Breakdown

---

# 1. Events Block

```nginx id="nclj0r"
events {
    worker_connections 1024;
}
```

Defines how many simultaneous connections Nginx can handle.

---

## Meaning

```text id="7gb1ct"
worker_connections 1024
```

means:

Each worker process can handle 1024 users/connections.

---

# 2. HTTP Block

```nginx id="zpw36e"
http {
```

Main configuration section for web traffic.

Everything related to HTTP requests goes here.

---

# 3. MIME Types

```nginx id="0v5urw"
include /etc/nginx/mime.types;
```

Helps Nginx identify file types.

Example:

| Extension | Type                   |
| --------- | ---------------------- |
| `.html`   | text/html              |
| `.css`    | text/css               |
| `.js`     | application/javascript |

---

# 4. Logging

```nginx id="9iwt1o"
access_log /var/log/nginx/access.log;
```

Stores all incoming requests.

Example logs:

```text id="p0p7i9"
GET /api/users 200
POST /login 401
```

Useful for:

* debugging
* analytics
* security monitoring

---

# 5. Gzip Compression

```nginx id="gm9fgf"
gzip on;
```

Compresses responses before sending to browser.

---

# Why Important?

Without gzip:

```text id="9c8x1z"
JSON size = 1MB
```

With gzip:

```text id="aw1o6e"
Compressed = 200KB
```

Benefits:

✅ faster APIs
✅ less bandwidth
✅ better performance

---

# 6. Rate Limiting

```nginx id="cw8qfu"
limit_req_zone
```

Protects against:

* spam
* brute-force attacks
* excessive API usage

---

# Example

```nginx id="7g43r8"
rate=10r/s
```

means:

Allow only:

```text id="0ixy3l"
10 requests per second
```

from one IP.

---

# Login Protection

```nginx id="2x0xlp"
rate=5r/m
```

means:

Only 5 login attempts per minute.

Prevents password brute-force attacks.

---

# 7. Upstream Servers

```nginx id="1bjlwm"
upstream app_servers {
    server app:3000;
}
```

Defines backend servers.

---

# Meaning

Nginx forwards requests to:

```text id="esovj6"
app container on port 3000
```

---

# Load Balancing

You can add multiple app servers:

```nginx id="j3jv0z"
server app2:3000;
server app3:3000;
```

Then Nginx distributes traffic.

---

# Example

```text id="gjvblj"
Request 1 → app1
Request 2 → app2
Request 3 → app3
```

This is called:

✅ Load Balancing

---

# 8. Server Block

```nginx id="r1l6ez"
server {
    listen 80;
}
```

Defines HTTP server.

Port:

```text id="53r7mh"
80 = HTTP
```

---

# 9. Security Headers

```nginx id="yyx00u"
add_header X-Frame-Options DENY;
```

Adds browser security protections.

---

# Purpose of Security Headers

| Header                 | Protection   |
| ---------------------- | ------------ |
| X-Frame-Options        | Clickjacking |
| X-Content-Type-Options | MIME attacks |
| X-XSS-Protection       | XSS attacks  |
| HSTS                   | Force HTTPS  |

---

# 10. Health Check Endpoint

```nginx id="jlwmnj"
location /health
```

Used by:

* Docker
* Kubernetes
* monitoring systems

to check server health.

---

# Response

```text id="t0d6v2"
healthy
```

If app working properly.

---

# 11. API Routing

```nginx id="uy0hm0"
location /api/
```

Handles all API requests.

Example:

```text id="7gxomk"
/api/users
/api/products
/api/orders
```

---

# proxy_pass

```nginx id="9ws8c5"
proxy_pass http://app_servers;
```

Means:

Forward request to backend Node.js servers.

---

# Forwarded Headers

```nginx id="zjlwm"
proxy_set_header X-Forwarded-For
```

Passes original user IP to backend.

Very important for:

* logging
* authentication
* analytics
* security

---

# 12. Timeouts

```nginx id="xg6m3o"
proxy_connect_timeout 30s;
```

Prevents requests hanging forever.

If backend doesn't respond in 30s:

request fails.

---

# 13. Authentication Route Protection

```nginx id="h8c5j8"
location /api/auth/login
```

Special protection for login APIs.

---

# Why Separate?

Login endpoints are highly targeted by hackers.

Extra rate limiting added.

---

# 14. Static Files

```nginx id="9yltow"
location /static/
```

Serves uploaded files directly from Nginx.

---

# Why Important?

Instead of:

```text id="1hn0i5"
Node.js serving images
```

Nginx serves them faster.

Better performance.

---

# 15. Cache Control

```nginx id="63p8l7"
expires 1y;
```

Browser caches files for 1 year.

Good for:

* images
* JS files
* CSS

Improves speed.

---

# 16. Default Route

```nginx id="6kwifg"
location /
```

Handles all remaining requests.

---

# 17. HTTPS Server

```nginx id="n9ghl0"
listen 443 ssl http2;
```

HTTPS secure server.

Port:

```text id="f8dx0m"
443 = HTTPS
```

---

# SSL Certificates

```nginx id="i4o2fw"
ssl_certificate
```

Used for encryption.

Makes:

```text id="i0c0wq"
https://
```

possible.

---

# Why HTTPS Important?

Without HTTPS:

data visible to hackers.

With HTTPS:

data encrypted.

---

# TLS Versions

```nginx id="hthn1n"
TLSv1.2 TLSv1.3
```

Modern secure encryption protocols.

---

# HTTP/2

```nginx id="s4r5yv"
http2
```

Faster than HTTP/1.1.

Benefits:

✅ multiplexing
✅ lower latency
✅ faster page loads

---

# Overall Architecture

```text id="lcvjrf"
                ┌─────────────┐
                │   Users     │
                └──────┬──────┘
                       ↓
                ┌─────────────┐
                │    Nginx    │
                │ ReverseProxy│
                └──────┬──────┘
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
   Node App 1                  Node App 2
```

---

# Real Purpose of This File

This file turns Nginx into:

✅ API Gateway
✅ Reverse Proxy
✅ Load Balancer
✅ Security Layer
✅ HTTPS Server
✅ Static File Server
✅ Traffic Controller

for production-grade applications.

---

# Final Meaning

This configuration file basically tells Nginx:

```text id="61i4gz"
"Accept all incoming internet traffic,
secure it,
compress it,
protect it,
balance it across servers,
and forward it to my backend application."
```
This file is a **Dockerfile** used to create an optimized Docker image for your Node.js application.

It tells Docker:

✅ how to build the application
✅ how to install dependencies
✅ how to optimize image size
✅ how to run the app securely
✅ how to prepare production deployment

---

# Simple Meaning

This file converts your Node.js project into a portable container image.

Without Docker:

```text id="n2y0af"
Need:
- Node installed
- dependencies installed
- environment setup
```

With Docker:

```text id="0jq0v4"
Everything packaged inside one image
```

You can run app anywhere.

---

# Main Purpose

This Dockerfile is designed for:

✅ production deployment
✅ optimized image size
✅ security
✅ faster builds
✅ better performance

using a technique called:

# Multi-Stage Build

---

# What is Multi-Stage Build?

Instead of using one big image:

```text id="ab7h0y"
Build tools + source code + dependencies + runtime
```

Docker separates stages.

Result:

✅ smaller final image
✅ cleaner image
✅ fewer vulnerabilities
✅ faster deployment

---

# File Breakdown

---

# 1. Base Image

```dockerfile id="mk5j4j"
FROM node:18-alpine AS base
```

Uses lightweight Node.js image.

---

# Why Alpine?

`alpine` is a very small Linux distribution.

Benefits:

| Normal Node Image | Alpine |
| ----------------- | ------ |
| ~900MB            | ~150MB |

Much smaller image.

---

# AS base

Creates reusable base stage.

Other stages inherit from it.

---

# 2. Dependencies Stage

```dockerfile id="3lbrbm"
FROM base AS deps
```

Separate stage only for production dependencies.

---

# WORKDIR

```dockerfile id="exj8m2"
WORKDIR /app
```

Sets working directory inside container.

Equivalent to:

```bash id="7r1wfi"
cd /app
```

---

# Copy Package Files

```dockerfile id="jlwm8i"
COPY package.json package-lock.json ./
```

Copies dependency files.

---

# Install Dependencies

```dockerfile id="ap9yyu"
RUN npm ci --only=production
```

Installs only production dependencies.

---

# Why npm ci?

Better than `npm install` for production.

Benefits:

✅ faster
✅ reproducible builds
✅ exact versions

---

# Why --only=production?

Skips dev dependencies like:

* nodemon
* eslint
* jest

Makes image smaller.

---

# Cache Clean

```dockerfile id="fw7h1s"
npm cache clean --force
```

Removes npm cache.

Reduces image size further.

---

# 3. Builder Stage

```dockerfile id="yx6x0t"
FROM base AS builder
```

Used to build application.

---

# Install All Dependencies

```dockerfile id="8hhj4m"
RUN npm ci
```

Includes dev dependencies because build tools may need them.

Example:

* TypeScript
* Babel
* Webpack

---

# Copy Source Code

```dockerfile id="xvld2x"
COPY . .
```

Copies complete project.

---

# Build Application

```dockerfile id="8otnnt"
RUN npm run build
```

Compiles app.

Example:

```text id="jlwm5v"
TypeScript → JavaScript
```

Output usually generated in:

```text id="ms0m3m"
dist/
```

---

# 4. Production Runner Stage

```dockerfile id="sm5v8m"
FROM node:18-alpine AS runner
```

Final production image.

This is the image actually deployed.

---

# Why Separate Runner Stage?

Only includes:

✅ compiled app
✅ production dependencies

Excludes:

❌ source code
❌ build tools
❌ dev dependencies

Much smaller and safer.

---

# 5. Create Non-Root User

```dockerfile id="w8x0l8"
RUN adduser --system --uid 1001 nodejs
```

Creates custom user.

---

# Why Important?

By default Docker runs as:

```text id="pv9f9r"
root user
```

Dangerous for security.

Best practice:

Run containers as non-root user.

---

# Security Benefit

If hacker compromises container:

they won't get root access.

---

# 6. Copy Built Files

```dockerfile id="jlwm77"
COPY --from=builder /app/dist ./dist
```

Copies compiled application from builder stage.

---

# Copy Production Dependencies

```dockerfile id="v9nndq"
COPY --from=deps /app/node_modules ./node_modules
```

Copies only production dependencies.

---

# Copy package.json

```dockerfile id="jlwm32"
COPY --from=builder /app/package.json ./package.json
```

Needed for metadata/scripts.

---

# 7. Create Folders

```dockerfile id="2qx4lc"
RUN mkdir -p logs
```

Creates logs directory.

---

# uploads Directory

```dockerfile id="jlwm11"
RUN mkdir -p uploads
```

Stores uploaded files.

---

# chown

```dockerfile id="jlwm21"
chown -R nodejs:nodejs
```

Gives permission to custom user.

---

# 8. Switch User

```dockerfile id="jlwm66"
USER nodejs
```

Runs app using non-root user.

Security best practice.

---

# 9. Expose Port

```dockerfile id="jlwm55"
EXPOSE 3000
```

Documents application port.

Means app listens on:

```text id="pkdvs6"
port 3000
```

---

# 10. Health Check

```dockerfile id="jlwm44"
HEALTHCHECK
```

Docker automatically checks app health.

---

# Runs

```dockerfile id="jlwm33"
CMD node healthcheck.js
```

If healthcheck fails repeatedly:

container marked unhealthy.

---

# Why Important?

Useful for:

* Docker Compose
* Kubernetes
* load balancers
* auto-restarts

---

# 11. Start Application

```dockerfile id="jlwm22"
CMD ["node", "dist/index.js"]
```

Starts production server.

Equivalent to:

```bash id="jlwm12"
node dist/index.js
```

---

# Final Architecture

```text id="jlwm99"
Stage 1 → Install prod dependencies
Stage 2 → Build app
Stage 3 → Create optimized production image
```

---

# Why This Dockerfile Is Professional

This follows industry best practices:

| Feature                | Benefit         |
| ---------------------- | --------------- |
| Multi-stage build      | Smaller image   |
| Alpine image           | Lightweight     |
| npm ci                 | Faster/reliable |
| Non-root user          | Security        |
| Healthcheck            | Monitoring      |
| Production-only deps   | Optimization    |
| Separate builder stage | Cleaner image   |

---

# Final Meaning

This Dockerfile basically tells Docker:

```text id="jlwm88"
"Build my Node.js app efficiently,
optimize the image,
secure the container,
and prepare it for production deployment."
```

It is a production-grade Docker setup used in real-world backend systems.
