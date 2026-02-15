#!/bin/bash

# Find components that should be lazy loaded
echo "🔍 Finding components that could benefit from lazy loading..."
echo ""

echo "📦 Large components (good candidates for lazy loading):"
find app/components -name "*.vue" -type f -exec wc -l {} + | sort -rn | head -10
echo ""

echo "🎯 Modal components (should always be lazy):"
find app/components -name "*Modal*.vue" -type f
echo ""

echo "🎯 Components with v-if (good lazy loading candidates):"
grep -r "v-if" app/pages --include="*.vue" | grep -o '<[A-Z][a-zA-Z]*' | sort | uniq -c | sort -rn
echo ""

echo "💡 Recommendation: Add 'Lazy' prefix to these components in your templates"
echo "   Example: <BookmarkModal /> → <LazyBookmarkModal />"
