#!/bin/bash

# Angular Evolution Demo — Start All Services
# This script starts the API server and all 6 Angular milestone apps.
# Each runs in the background. Use stop-all.sh or Ctrl+C to stop.

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Angular Evolution Demo...${NC}"
echo ""

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Store PIDs for cleanup
PIDS=()

cleanup() {
  echo ""
  echo -e "${BLUE}🛑 Stopping all services...${NC}"
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo -e "${GREEN}✅ All services stopped.${NC}"
  exit 0
}

trap cleanup SIGINT SIGTERM

# Start slides server
echo -e "${GREEN}🎬 Starting slides server (port 8080)...${NC}"
(npx http-server slides -c-1 -p 8080 2>&1 | sed 's/^/[slides] /') &
PIDS+=($!)

# Start API server
echo -e "${GREEN}📚 Starting API server (port 3000)...${NC}"
(cd api && nvm use 20 --silent && node server.js) &
PIDS+=($!)
sleep 1

# Start v4-v9 (Angular 9, Node 12, port 4200)
echo -e "${GREEN}📦 Starting v4-v9 (port 4200)...${NC}"
(cd v4-v9 && nvm use 12 --silent && npx ng serve --port 4200 2>&1 | sed 's/^/[v4-v9] /') &
PIDS+=($!)

# Start v10-v13 (Angular 13, Node 16, port 4201)
echo -e "${GREEN}📦 Starting v10-v13 (port 4201)...${NC}"
(cd v10-v13 && nvm use 16 --silent && npx ng serve --port 4201 2>&1 | sed 's/^/[v10-v13] /') &
PIDS+=($!)

# Start v14-v16 (Angular 16, Node 18, port 4202)
echo -e "${GREEN}📦 Starting v14-v16 (port 4202)...${NC}"
(cd v14-v16 && nvm use 18 --silent && npx ng serve --port 4202 2>&1 | sed 's/^/[v14-v16] /') &
PIDS+=($!)

# Start v17-v19 (Angular 19, Node 20, port 4203)
echo -e "${GREEN}📦 Starting v17-v19 (port 4203)...${NC}"
(cd v17-v19 && nvm use 20 --silent && npx ng serve --port 4203 2>&1 | sed 's/^/[v17-v19] /') &
PIDS+=($!)

# Start v20-v21 (Angular 21, Node 22, port 4204)
echo -e "${GREEN}📦 Starting v20-v21 (port 4204)...${NC}"
(cd v20-v21 && nvm use 22.22.3 --silent && npx ng serve --port 4204 2>&1 | sed 's/^/[v20-v21] /') &
PIDS+=($!)

# Start v22 (Angular 22, Node 22, port 4205)
echo -e "${GREEN}📦 Starting v22 (port 4205)...${NC}"
(cd v22 && nvm use 22.22.3 --silent && npx ng serve --port 4205 2>&1 | sed 's/^/[v22] /') &
PIDS+=($!)

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All services starting!${NC}"
echo ""
echo "  📚 API:      http://localhost:3000"
echo "  🎬 Slides:   http://localhost:8080"
echo "  📦 v4-v9:    http://localhost:4200"
echo "  📦 v10-v13:  http://localhost:4201"
echo "  📦 v14-v16:  http://localhost:4202"
echo "  📦 v17-v19:  http://localhost:4203"
echo "  📦 v20-v21:  http://localhost:4204"
echo "  📦 v22:      http://localhost:4205"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait for all background processes
wait
