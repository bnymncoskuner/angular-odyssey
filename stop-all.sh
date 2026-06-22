#!/bin/bash

# Angular Evolution Demo — Stop All Services
# Kills any ng serve and API server processes

echo "🛑 Stopping all Angular Evolution Demo services..."

# Kill API server
pkill -f "node server.js" 2>/dev/null && echo "  ✅ API server stopped" || echo "  ⚪ API server not running"

# Kill all ng serve processes
pkill -f "ng serve" 2>/dev/null && echo "  ✅ All ng serve processes stopped" || echo "  ⚪ No ng serve processes running"

echo "Done."
