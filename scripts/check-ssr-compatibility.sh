#!/bin/bash

# SSR Compatibility Checker
# This script helps identify potential SSR issues in your Nuxt app

echo "🔍 Checking for SSR compatibility issues..."
echo ""

echo "📋 Files with localStorage usage:"
grep -r "localStorage\." app/ --include="*.vue" --include="*.ts" | grep -v "import.meta.client" | grep -v "useBrowserAPI"
echo ""

echo "📋 Files with window usage:"
grep -r "window\." app/ --include="*.vue" --include="*.ts" | grep -v "import.meta.client" | grep -v "typeof window" | grep -v "useBrowserAPI"
echo ""

echo "📋 Files with document usage:"
grep -r "document\." app/ --include="*.vue" --include="*.ts" | grep -v "import.meta.client" | grep -v "typeof document"
echo ""

echo "📋 Files with navigator usage:"
grep -r "navigator\." app/ --include="*.vue" --include="*.ts" | grep -v "import.meta.client" | grep -v "useBrowserAPI"
echo ""

echo "✅ Check complete! Review the output above for potential SSR issues."
echo "💡 Tip: Wrap browser API calls with 'import.meta.client' checks or use the useBrowserAPI() composable"
