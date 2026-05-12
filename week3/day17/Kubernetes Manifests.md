Build comprehensive Kubernetes deployment:

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sda-training
  labels:
    app: sda-training
    environment: production
```

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sda-training-config
  namespace: sda-training
data:
  NODE_ENV: "production"
  PORT: "3000"
  API_BASE_URL: "http://sda-training-service:3000"
  LOG_LEVEL: "info"
  CORS_ORIGIN: "https://sda-training.com"
```

```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: sda-training-secrets
  namespace: sda-training
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  MONGODB_URI: <base64-encoded-mongodb-uri>
  POSTGRES_URL: <base64-encoded-postgres-url>
  REDIS_URL: <base64-encoded-redis-url>
```

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sda-training-app
  namespace: sda-training
  labels:
    app: sda-training
    component: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sda-training
      component: app
  template:
    metadata:
      labels:
        app: sda-training
        component: app
    spec:
      containers:
      - name: app
        image: sda-training:latest
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: sda-training-config
              key: NODE_ENV
        - name: PORT
          valueFrom:
            configMapKeyRef:
              name: sda-training-config
              key: PORT
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: JWT_SECRET
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: MONGODB_URI
        - name: POSTGRES_URL
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: POSTGRES_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: REDIS_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: app-logs
          mountPath: /app/logs
        - name: app-uploads
          mountPath: /app/uploads
      volumes:
      - name: app-logs
        persistentVolumeClaim:
          claimName: app-logs-pvc
      - name: app-uploads
        persistentVolumeClaim:
          claimName: app-uploads-pvc
      restartPolicy: Always
```
