#!/usr/bin/env bash
# Quick start Drizzle Studio for database visualization
# Opens at http://localhost:4983

echo "🗄️  Starting Drizzle Studio..."
echo "This will open your database in a visual interface."
echo ""

cd /c/Users/Owner/workspace/galaxyco-ai-2.0/packages/database

echo "Opening Drizzle Studio at http://localhost:4983"
echo "Press Ctrl+C to stop"
echo ""

npx drizzle-kit studio
