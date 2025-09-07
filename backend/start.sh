#!/bin/bash

# Pehchaan Backend Startup Script

echo "🚀 Starting Pehchaan Backend API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    
    # Try to start MongoDB (adjust path as needed)
    if command -v mongod &> /dev/null; then
        mongod --fork --logpath /tmp/mongodb.log
        echo "✅ MongoDB started"
    else
        echo "❌ MongoDB is not installed. Please install MongoDB."
        exit 1
    fi
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ .env file created. Please update the configuration."
        echo "📝 Edit .env file with your MongoDB URI and other settings."
    else
        echo "❌ env.example file not found. Please create .env file manually."
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the application
echo "🎯 Starting the application..."
echo "📊 Environment: ${NODE_ENV:-development}"
echo "🌐 Port: ${PORT:-5000}"
echo "🔗 Health check: http://localhost:${PORT:-5000}/api/health"
echo ""

# Start with nodemon in development, node in production
if [ "${NODE_ENV:-development}" = "development" ]; then
    echo "🔄 Starting in development mode with nodemon..."
    npx nodemon server.js
else
    echo "🚀 Starting in production mode..."
    node server.js
fi
