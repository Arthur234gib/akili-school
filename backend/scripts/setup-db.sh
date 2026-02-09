#!/bin/bash

# Akili School Database Setup Script

set -e

echo "🚀 Akili School Database Setup"
echo "================================"

# Load environment variables
if [ -f .env ]; then
    source .env
    echo "✓ Loaded environment variables from .env"
else
    echo "⚠️  No .env file found. Using defaults..."
    DB_HOST=${DB_HOST:-localhost}
    DB_PORT=${DB_PORT:-5432}
    DB_NAME=${DB_NAME:-akili_db}
    DB_USER=${DB_USER:-postgres}
fi

echo ""
echo "Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on $DB_HOST:$DB_PORT"
    echo "Please start PostgreSQL and try again."
    exit 1
fi

echo "✓ PostgreSQL is running"

# Check if database exists
DB_EXISTS=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -w "$DB_NAME" || true)

if [ -z "$DB_EXISTS" ]; then
    echo "Creating database '$DB_NAME'..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo "✓ Database created"
else
    echo "✓ Database '$DB_NAME' already exists"
fi

# Run schema
echo ""
echo "Running database schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f db/schema.sql > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✓ Database schema applied successfully"
else
    echo "❌ Failed to apply database schema"
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "You can now start the server with:"
echo "  npm run dev"
echo ""
echo "Default admin credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo "  Email: admin@akili.school"
echo ""
echo "⚠️  IMPORTANT: Change the admin password in production!"
