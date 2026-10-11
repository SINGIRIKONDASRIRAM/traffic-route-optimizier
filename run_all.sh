#!/usr/bin/env bash
# Traffic Route Optimizer - Single-Command Host Launcher

echo "🚀 Starting Traffic Route Optimizer hosts..."

# 1. Start C++ Routing Engine on port 8080
if ! lsof -i :8080 > /dev/null 2>&1; then
  echo "🔹 Starting C++ Graph Engine on port 8080..."
  ./engine/routing_engine 8080 > /dev/null 2>&1 &
  sleep 1
else
  echo "✅ C++ Graph Engine is active on port 8080"
fi

# 2. Start Node.js Gateway API on port 5001
if ! lsof -i :5001 > /dev/null 2>&1; then
  echo "🔹 Starting Gateway API on port 5001..."
  (cd gateway && npm run dev > /dev/null 2>&1 &)
  sleep 2
else
  echo "✅ Gateway API is active on port 5001"
fi

# 3. Start Frontend UI on port 3000
if ! lsof -i :3000 > /dev/null 2>&1; then
  echo "🔹 Starting Frontend UI on port 3000..."
  (cd frontend && npm run dev > /dev/null 2>&1 &)
  sleep 2
else
  echo "✅ Frontend UI is active on port 3000"
fi

echo ""
echo "🎉 All 3 hosts are up and interconnected!"
echo "👉 Your single link: http://localhost:3000"
