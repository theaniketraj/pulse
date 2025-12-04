#!/bin/bash

# Debug script to simulate GitHub Actions deployment locally
# Run this to see what the workflow will do

set -e

echo "=========================================="
echo "DEBUG: Local Deployment Simulation"
echo "=========================================="
echo ""

echo "Step 1: Building documentation..."
npm run docs:build
echo "✓ Build complete"
echo ""

echo "Step 2: Checking build output structure..."
echo "=== Directory listing ==="
ls -la docs/.vitepress/dist/
echo ""

echo "=== Critical files check ==="
if [ -f "docs/.vitepress/dist/index.html" ]; then
    echo "✓ index.html EXISTS"
else
    echo "✗ index.html MISSING"
fi

if [ -f "docs/.vitepress/dist/vp-icons.css" ]; then
    echo "✓ vp-icons.css EXISTS"
else
    echo "✗ vp-icons.css MISSING"
fi

if [ -d "docs/.vitepress/dist/assets" ]; then
    echo "✓ assets/ directory EXISTS"
    echo "  Assets count: $(ls -1 docs/.vitepress/dist/assets | wc -l)"
else
    echo "✗ assets/ directory MISSING"
fi
echo ""

echo "=== First 30 lines of index.html ==="
head -30 docs/.vitepress/dist/index.html
echo ""

echo "=== Asset paths in HTML ==="
echo "Link hrefs:"
grep -o 'href="[^"]*"' docs/.vitepress/dist/index.html | head -10
echo ""
echo "Script srcs:"
grep -o 'src="[^"]*"' docs/.vitepress/dist/index.html | head -10
echo ""

echo "=== VitePress config ==="
echo "Base setting:"
grep "base:" docs/.vitepress/config.mts || echo "No base setting found"
echo ""

echo "=== File to be deployed ==="
echo "Total files in dist:"
find docs/.vitepress/dist -type f | wc -l
echo ""
echo "Sample files:"
find docs/.vitepress/dist -type f | head -20
echo ""

echo "=========================================="
echo "Summary:"
echo "=========================================="
echo "Deploy source: docs/.vitepress/dist/"
echo "Expected GitHub Pages URL: https://theaniketraj.github.io/vitals/"
echo ""
echo "If assets have /vitals/ prefix → CORRECT"
echo "If assets have / prefix only → INCORRECT (will 404)"
echo ""

echo "To test locally:"
echo "1. cd docs/.vitepress/dist"
echo "2. python -m http.server 8080"
echo "3. Visit http://localhost:8080"
echo "   (Assets will 404 because they expect /vitals/ path)"
echo ""
