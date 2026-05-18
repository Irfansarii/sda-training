# What is Swagger?

* Swagger is a tool used to document, test, and visualize REST APIs.

# It helps developers:

See all API endpoints in one UI
Understand request/response formats
Test APIs directly from the browser
Share API documentation with frontend/backend teams

Nowadays Swagger is part of the OpenAPI Specification ecosystem.


# How to use in Express
const express = require('express');
const { specs, swaggerUi } = require('./config/swagger');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

# Redis ------ fast temporary cache 

# What is Redis?

Redis is an in-memory database/cache that stores data in RAM instead of a hard disk, which makes it extremely fast.

# Redis stands for:

Remote Dictionary Server

# Main Purpose of Redis

Redis is mainly used to:

* Speed up applications
* Reduce database load
* Store temporary or frequently accessed data

Why Redis is Fast

Redis stores data in:

✅ RAM (memory)

instead of:

❌ Hard disk

Client → Node.js → Redis Cache
                     ↓
                  MySQL Database

# learn how to connect redis through caching.js
# get 
# set 
# del 
# flush


# What is CacheService?

CacheService is a custom service/class that helps your Node.js application interact with Redis easily.

Instead of writing Redis code everywhere, you create one reusable service.

# Purpose of CacheService

It handles:

* Connecting to Redis
* Saving data in Redis
* Retrieving data
* Deleting cached data
* Managing cache keys
* Simple Analogy

Think of:

MySQL = Main warehouse
Redis = Fast counter storage
CacheService = Worker managing the counter

# The worker:

stores items
retrieves items
removes items

# from Redis.
# Why Use CacheService?

Without it, you would write Redis logic repeatedly:

await client.get(...)
await client.set(...)
await client.del(...)

in every file.

That becomes messy.

With CacheService

You simply use:

cacheService.get()
cacheService.set()
cacheService.del()

Much cleaner and reusable.

# General rate limiter
* Generallimiter
* stricelimiter
* login limiter

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes',
        limit: 100,
        remaining: 0
      }
    });
  }
});