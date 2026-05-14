```bash
#!/bin/bash
# scripts/docker-optimize.sh

echo "🐳 Docker Optimization Script"
echo "========================="

# Clean up unused resources
echo "🧹 Cleaning up unused Docker resources..."
docker system prune -f
docker volume prune -f
docker network prune -f

# Build optimized images
echo "🏗️ Building optimized images..."
docker build --target runner -t sda-training:latest .

# Analyze image size
echo "📊 Analyzing image size..."
docker images sda-training:latest

# Security scan
echo "🔒 Running security scan..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image sda-training:latest

# Performance test
echo "⚡ Running performance test..."
docker run --rm -d --name perf-test sda-training:latest
sleep 10
docker stats perf-test --no-stream
docker stop perf-test

echo "✅ Optimization complete!"
```
