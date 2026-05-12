Implement persistent data storage:

```yaml
# k8s/persistent-volume.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: app-logs-pv
  labels:
    app: sda-training
    component: logs
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs
  nfs:
    server: nfs-server.example.com
    path: /exports/app-logs

---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: app-uploads-pv
  labels:
    app: sda-training
    component: uploads
spec:
  capacity:
    storage: 50Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: nfs
  nfs:
    server: nfs-server.example.com
    path: /exports/app-uploads
```

```yaml
# k8s/persistent-volume-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-logs-pvc
  namespace: sda-training
  labels:
    app: sda-training
    component: logs
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 10Gi
  storageClassName: nfs

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-uploads-pvc
  namespace: sda-training
  labels:
    app: sda-training
    component: uploads
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Gi
  storageClassName: nfs
```
