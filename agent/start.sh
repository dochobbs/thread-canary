#!/bin/bash
cd /home/sprite/thread-agent
export PATH="/.sprite/languages/node/nvm/versions/node/v22.20.0/bin:$PATH"

# Source env vars from .env file  
set -a
source /home/sprite/thread-agent/.env
set +a

exec node server.mjs
