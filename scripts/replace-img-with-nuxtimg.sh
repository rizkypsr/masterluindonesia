#!/bin/bash

# Script to help identify remaining <img> tags that need to be replaced with <NuxtImg>
echo "🔍 Finding remaining <img> tags in Vue files..."
echo ""

echo "📊 Count by file:"
grep -r "<img" app --include="*.vue" | cut -d: -f1 | sort | uniq -c | sort -rn
echo ""

echo "📁 Files with <img> tags:"
grep -r "<img" app --include="*.vue" -l | sort
echo ""

echo "💡 Recommendation:"
echo "   Replace <img> with <NuxtImg> and add:"
echo "   - format=\"webp\""
echo "   - loading=\"lazy\" (or \"eager\" for above-fold)"
echo "   - width and height attributes"
echo "   - fetchpriority=\"high\" for critical images"
echo ""

echo "Example replacement:"
echo "<!-- Before -->"
echo "<img src=\"/image.jpg\" alt=\"Description\" class=\"w-full\" />"
echo ""
echo "<!-- After -->"
echo "<NuxtImg src=\"/image.jpg\" alt=\"Description\" class=\"w-full\" format=\"webp\" loading=\"lazy\" width=\"800\" height=\"600\" />"
