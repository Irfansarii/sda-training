# what is kubernetes

Kubernetes (often called K8s) is an open-source platform used to manage, deploy, scale and monitor containers automatically.

It is mainly used with containers created by Docker.

Simple understanding

Docker helps you run one container.

Kubernetes helps you manage thousands of containers across many servers.


# These Kubernetes YAML files are used to deploy MongoDB and PostgreSQL databases inside a Kubernetes cluster.

In simple terms:

* **Deployment** → Runs and manages the database container
* **Service** → Allows other applications to connect to the database
* **PVC (PersistentVolumeClaim)** → Stores data permanently so it is not lost when a pod restarts

---

# MongoDB Deployment Explanation

```yaml
kind: Deployment
```

This tells Kubernetes to create and manage a MongoDB container.

---

## Metadata

```yaml
metadata:
  name: mongodb
  namespace: sda-training
```

* `name: mongodb` → name of the deployment
* `namespace: sda-training` → the namespace where it will run

A namespace is used to separate projects/environments.

---

# Replicas

```yaml
replicas: 1
```

Only 1 MongoDB pod will run.

If you set:

```yaml
replicas: 3
```

then 3 copies of the pod will run.

---

# Container

```yaml
containers:
- name: mongodb
  image: mongo:5.0
```

* Uses a Docker image
* `mongo:5.0` means MongoDB version 5

---

# Port

```yaml
ports:
- containerPort: 27017
```

MongoDB runs internally on port `27017`.

---

# Environment Variables

```yaml
env:
- name: MONGO_INITDB_ROOT_USERNAME
  value: "admin"
```

Sets the MongoDB username.

---

```yaml
- name: MONGO_INITDB_ROOT_PASSWORD
  valueFrom:
    secretKeyRef:
```

The password is not written directly in YAML.

It is loaded securely from a Kubernetes Secret.

---

# Database Name

```yaml
- name: MONGO_INITDB_DATABASE
  value: "sda_training"
```

Creates an initial database named:

`sda_training`

---

# Volume Mount

```yaml
volumeMounts:
- name: mongodb-data
  mountPath: /data/db
```

MongoDB data will be stored here.

If the pod crashes or restarts, the data remains safe.

---

# Resources

```yaml
resources:
  requests:
```

Defines the minimum CPU and memory required.

---

```yaml
limits:
```

Defines the maximum CPU and memory the container can use.

---

# Liveness Probe

```yaml
livenessProbe:
```

Kubernetes checks:
“Is MongoDB alive?”

If not:
→ Kubernetes automatically restarts the pod.

---

# Readiness Probe

```yaml
readinessProbe:
```

Checks:
“Is the database ready to accept requests?”

---

# PVC

```yaml
persistentVolumeClaim:
  claimName: mongodb-data-pvc
```

Attaches permanent storage.

Without PVC:
pod deleted → data lost ❌

With PVC:
pod deleted → data safe ✅

---

# Service

```yaml
kind: Service
```

Makes MongoDB accessible inside the cluster.

---

```yaml
name: mongodb-service
```

Now backend applications can connect using:

```env
mongodb://mongodb-service:27017
```

---
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
# PostgreSQL Deployment

This works the same way but for PostgreSQL.

---

# PostgreSQL Image

```yaml
image: postgres:13
```

Runs PostgreSQL version 13.

---

# Port

```yaml
containerPort: 5432
```

Default PostgreSQL port:
`5432`

---

# Credentials

```yaml
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

These are the database login credentials.

---

# pg_isready

```yaml
pg_isready
```

This command checks:
“Is PostgreSQL ready or not?”

---

# Service Access

Backend applications connect like this:

```env
postgresql://postgres:password@postgresql-service:5432/sda_training
```

---
* 
* 
* 
* 
-
* 
* 
* 
* 
-
* 
* 
* 
* 
# Overall Architecture

```text
Backend App
   |
   |----> mongodb-service:27017
   |
   |----> postgresql-service:5432
```

Services provide internal networking between applications.

---

# Why Use Kubernetes?

Benefits:

* Auto restart
* Auto scaling
* Self healing
* Easy deployment
* Persistent storage
* Service discovery
* Production-ready infrastructure

---
-
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 

# Real Flow

## Step 1

Apply the YAML files:

```bash
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f postgresql-deployment.yaml
```

---

## Step 2

Kubernetes creates the pods.

---

## Step 3

Services are created.

---

## Step 4

The backend app connects to the databases.

---

# Important Issue in Your YAML ⚠️

Both deployments use the same labels:

```yaml
app: sda-training
component: database
```

Because of this, services may accidentally select the wrong pod.

Better approach:

MongoDB:

```yaml
labels:
  app: mongodb
```

PostgreSQL:

```yaml
labels:
  app: postgresql
```

Then use separate selectors for each service and deployment.

-
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
-
* 
* 
* 
* 
########################## Kubernetes Manifests.md ##########################################

This is a **complete Kubernetes deployment setup** for a production-level Node.js application called `sda-training`.

It defines everything needed to run your application inside a Kubernetes cluster, including:

* Namespace
* Configuration
* Secrets
* Application deployment
* Scaling
* Health checks
* Persistent storage

Think of it like:

```text
Kubernetes = Cloud Operating System
YAML files = Instructions for Kubernetes
```

These YAML files tell Kubernetes:

> “How to run my app, configure it, secure it, scale it, and keep it alive.”

---

# 1. Namespace

```yaml
kind: Namespace
```

Purpose:
Creates a separate environment inside Kubernetes.

Example:

```yaml
name: sda-training
```

Now all resources will belong to this namespace.

---

## Why Use Namespace?

It helps organize projects.

Example:

```text
production namespace
testing namespace
dev namespace
```

Without namespaces, everything mixes together.

---

# 2. ConfigMap

```yaml
kind: ConfigMap
```

Purpose:
Stores non-sensitive configuration values.

Example:

```yaml
NODE_ENV: "production"
PORT: "3000"
LOG_LEVEL: "info"
```

These values are injected into the application as environment variables.

---

## Why Use ConfigMap?

Instead of hardcoding values in code:

❌ Bad:

```js
const PORT = 3000;
```

✅ Better:

```js
const PORT = process.env.PORT;
```

Now Kubernetes controls the configuration.

---

# 3. Secret

```yaml
kind: Secret
```

Purpose:
Stores sensitive data securely.

Example:

```yaml
JWT_SECRET
MONGODB_URI
POSTGRES_URL
REDIS_URL
```

These are Base64 encoded.

---

## Why Secrets?

You should never write passwords directly in code.

❌ Bad:

```js
const password = "123456";
```

✅ Better:

Store securely in Kubernetes Secret.

---

# 4. Deployment

```yaml
kind: Deployment
```

Purpose:
Runs and manages your application containers.

---

# App Name

```yaml
name: sda-training-app
```

Deployment name.

---

# Replicas

```yaml
replicas: 3
```

Runs 3 copies of your app.

Why?

* Load balancing
* High availability
* Better traffic handling

---

## Example

If one pod crashes:

```text
Pod-1 ❌
Pod-2 ✅
Pod-3 ✅
```

App still works.

---

# Container

```yaml
containers:
- name: app
  image: sda-training:latest
```

Uses Docker image:

```text
sda-training:latest
```

This is your Node.js application image.

---

# Port

```yaml
containerPort: 3000
```

Your Node.js app runs on port `3000`.

---

# Environment Variables

```yaml
env:
```

Loads variables from:

* ConfigMap
* Secrets

Example:

```yaml
configMapKeyRef
secretKeyRef
```

---

# Resources

```yaml
resources:
```

Controls CPU and memory usage.

---

## Requests

```yaml
requests:
```

Minimum required resources.

---

## Limits

```yaml
limits:
```

Maximum allowed resources.

Prevents one app from consuming the entire server.

---

# Liveness Probe

```yaml
livenessProbe:
```

Checks:

> “Is the app alive?”

Kubernetes sends request:

```text
GET /health
```

If it fails repeatedly:
→ pod restarts automatically.

---

# Readiness Probe

```yaml
readinessProbe:
```

Checks:

> “Is the app ready to receive traffic?”

If not ready:
Kubernetes will not send user requests to it.

---

# Volume Mounts

```yaml
volumeMounts:
```

Attaches storage inside the container.

Example:

```yaml
/app/logs
/app/uploads
```

---

# Persistent Volumes

```yaml
persistentVolumeClaim
```

Keeps data safe permanently.

Without PVC:

```text
Pod deleted → files deleted ❌
```

With PVC:

```text
Pod deleted → files safe ✅
```

Useful for:

* Uploaded files
* Logs
* Reports
* Images

---

# Restart Policy

```yaml
restartPolicy: Always
```

If the container crashes:
Kubernetes restarts it automatically.

---

# Overall Architecture

```text
                Kubernetes Cluster
                       |
        --------------------------------
        |              |              |
      Pod-1          Pod-2          Pod-3
    Node.js App    Node.js App    Node.js App
        |              |              |
        --------------------------------
                       |
                MongoDB / PostgreSQL / Redis
```

---

# What This Setup Achieves

This setup provides:

✅ Production-ready deployment
✅ Auto healing
✅ Scaling
✅ Secure secrets management
✅ Persistent storage
✅ Environment management
✅ Health monitoring
✅ High availability

---

# Real Deployment Flow

## Step 1

Create namespace:

```bash
kubectl apply -f namespace.yaml
```

---

## Step 2

Create config and secrets:

```bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
```

---

## Step 3

Deploy app:

```bash
kubectl apply -f deployment.yaml
```

---

## Step 4

Kubernetes creates pods automatically.

---

# In Simple Words

This entire setup means:

> “Run my Node.js application in Kubernetes with security, scalability, monitoring, storage, and automatic recovery.”
