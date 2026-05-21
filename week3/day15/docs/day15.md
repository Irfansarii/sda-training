# Learnt

# Environment Setup
 * MongoDB
 * PostgreSQL
 * redis

# docker-compose.yml

It is used to run multiple services together for your backend project using one command.

You have:

* Node.js app
* MongoDB
* PostgreSQL
* Redis
* Nginx

all connected in one setup.


# Flow of Entire System

Browser
   ↓
Nginx
   ↓
Node.js App
   ↓
MongoDB / PostgreSQL / Redis

# Why Use Docker Compose?

# Without Docker Compose:

❌ Start every service manually

* MongoDB
* Redis
* PostgreSQL
* Node app
* Nginx

With Docker Compose:

✅ One command:

docker-compose up

Everything starts automatically.

Useful Commands

# Start All Containers

* docker-compose up

# Run in Background

* docker-compose up -d

# Stop Containers

* docker-compose down

# Rebuild Containers

* docker-compose up --build

Important Concept
# This setup is called: Multi-Container Architecture

Each service has its own isolated container.

Benefits:

✅ Clean architecture
✅ Easy deployment
✅ Scalable
✅ Same setup everywhere
✅ No dependency conflicts

