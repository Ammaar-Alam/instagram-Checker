#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Compiling C code..."
cd backend
make
cd ..

echo "Starting Gunicorn server..."
gunicorn server.app:app
