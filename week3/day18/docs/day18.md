# Environment Specific Workflows

What this workflow does

Whenever code is pushed to the:

develop branch

GitHub automatically:

Starts a deployment pipeline
Connects to Kubernetes
Updates application image
Deploys the app
Waits for deployment success
Runs health checks
Runs integration tests
File location
.github/workflows/deploy-staging.yml

This means:

GitHub Actions workflow configuration