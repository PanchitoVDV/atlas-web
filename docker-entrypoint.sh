#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Run database migrations
echo "Running database migrations..."
pnpm db:push

# Execute the main container command (CMD)
exec "$@"