Deploy MongoDB and PostgreSQL in Kubernetes:

```yaml
# k8s/mongodb-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
  namespace: sda-training
  labels:
    app: sda-training
    component: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sda-training
      component: database
  template:
    metadata:
      labels:
        app: sda-training
        component: database
    spec:
      containers:
      - name: mongodb
        image: mongo:5.0
        ports:
        - containerPort: 27017
          name: mongodb
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: MONGO_ROOT_PASSWORD
        - name: MONGO_INITDB_DATABASE
          value: "sda_training"
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - mongosh
            - --eval
            - "db.adminCommand('ping')"
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - mongosh
            - --eval
            - "db.adminCommand('ping')"
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: mongodb-data
        persistentVolumeClaim:
          claimName: mongodb-data-pvc
      restartPolicy: Always

---
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
  namespace: sda-training
  labels:
    app: sda-training
    component: database
spec:
  type: ClusterIP
  ports:
  - port: 27017
    targetPort: 27017
    protocol: TCP
    name: mongodb
  selector:
    app: sda-training
    component: database
```

```yaml
# k8s/postgresql-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgresql
  namespace: sda-training
  labels:
    app: sda-training
    component: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sda-training
      component: database
  template:
    metadata:
      labels:
        app: sda-training
        component: database
    spec:
      containers:
      - name: postgresql
        image: postgres:13
        ports:
        - containerPort: 5432
          name: postgresql
        env:
        - name: POSTGRES_DB
          value: "sda_training"
        - name: POSTGRES_USER
          value: "postgres"
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: sda-training-secrets
              key: POSTGRES_PASSWORD
        volumeMounts:
        - name: postgresql-data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgresql-data
        persistentVolumeClaim:
          claimName: postgresql-data-pvc
      restartPolicy: Always

---
apiVersion: v1
kind: Service
metadata:
  name: postgresql-service
  namespace: sda-training
  labels:
    app: sda-training
    component: database
spec:
  type: ClusterIP
  ports:
  - port: 5432
    targetPort: 5432
    protocol: TCP
    name: postgresql
  selector:
    app: sda-training
    component: database
```
