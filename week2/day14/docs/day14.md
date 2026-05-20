# 1. Winston Logger
```js
const winston = require('winston');
```

`winston` is a logging library.

It helps save:
- errors
- request logs
- server events

into:
- console
- log files

# 2. Logger Configuration
```js
const logger = winston.createLogger({
  // ...
});
```

This creates the logger.

These lines:
```js
new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
```
mean:
- all errors will be saved to `logs/error.log`

```js
new winston.transports.File({ filename: 'logs/combined.log' })
```
means:
- all logs will also be saved to `logs/combined.log`

```js
new winston.transports.Console()
```
means:
- logs also show in the terminal.

## 3. MonitoringService Class
`class MonitoringService`

This is the main monitoring system.

It stores:
- request stats
- error stats
- server metrics

## 4. recordRequest()
`recordRequest(req, res, duration)`

This runs whenever an API request completes.

Example:
- `GET /users`

It stores:
- API method
- URL
- status code
- response time
- user agent
- IP address
- user ID

Example log:
```json
{
  "method": "GET",
  "url": "/users",
  "statusCode": 200,
  "duration": 45
}
```

## 5. recordError()
`recordError(error, req)`

If the API crashes or throws an error, this stores:
- error message
- stack trace
- API URL
- user info

Useful for debugging production issues.

## 6. updateMetrics()

This stores API statistics.

Example: `GET /users`

Stores:
- total requests
- total response time
- total errors
- last request time

## 7. getMetrics()
`getMetrics()`

Returns server information like:
- uptime
- RAM usage
- Node.js version
- platform
- request stats

Example response:
```json
{
  "uptime": 100000,
  "memory": {
    "heapUsed": 123456
  }
}
```

## 8. getHealthStatus()

This checks whether the server is healthy.

Example:
If memory usage > 90% then:
```json
{
  "status": "unhealthy"
}
```
Otherwise:
```json
{
  "status": "healthy"
}
```

## 9. calculateErrorRate()

Calculates:
- errors / total requests

Example:
- 100 requests
- 5 failed

Error rate:
- 5%

## 10. Monitoring Middleware
`const monitoringMiddleware`

This middleware automatically tracks every request.

This part:
```js
const start = performance.now();
```
starts the timer.

This part:
```js
res.on('finish', () => {
  // ...
});
```
runs when the request finishes.

Then it calculates:
- response time

Example:
- `/users` API took `120ms`

## 11. Health Check Endpoint
`const healthCheck`

Usually used like:
```js
app.get('/health', healthCheck);
```

Then browser response:
```json
{
  "status": "healthy"
}
```

This is used by:
- DevOps
- Docker
- Kubernetes
- Load balancers

to know if the server is alive.

## 12. Metrics Endpoint
```js
app.get('/metrics', metrics);
```

Returns full server statistics.

Useful for:
- dashboards
- monitoring tools
- analytics

## Real Industry Usage

Large companies use systems like this for:
- production monitoring
- debugging
- API analytics
- server health tracking
- performance optimization

## Simple Understanding

Think of this file as:
> "Hospital monitor for your backend"

It continuously checks:
- Is the server healthy?
- Which API is slow?
- Which API failed?
- How many requests came in?
- How much memory is used?
- What errors occurred?

## How You Use It

In Express:
```js
app.use(monitoringMiddleware);

app.get('/health', healthCheck);
app.get('/metrics', metrics);
```

Then:
- Visit `/health` to check server health.
- Visit `/metrics` to see detailed statistics.
