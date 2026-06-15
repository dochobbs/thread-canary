#!/bin/bash
# Start the THREAD iMessage agent
# Sources .env for credentials, then runs the Node.js server

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Source env vars from .env file
if [ -f .env ]; then
  set -a
  source .env
  set +a
else
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in your credentials."
  exit 1
fi

exec node server.mjs
