Implement networking and external access:

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sda-training-service
  namespace: sda-training
  labels:
    app: sda-training
    component: app
spec:
  type: ClusterIP
  ports:
  - port: 3000
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: sda-training
    component: app
```

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sda-training-ingress
  namespace: sda-training
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - sda-training.com
    - api.sda-training.com
    secretName: sda-training-tls
  rules:
  - host: sda-training.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sda-training-service
            port:
              number: 3000
  - host: api.sda-training.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: sda-training-service
            port:
              number: 3000
```
