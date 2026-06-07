# Find In Page Component - Usage Guide

## Overview
A reusable browser-like find-in-page feature that allows users to search and highlight text within any page content.

## Features
- Real-time text search and highlighting
- Navigate between matches (previous/next)
- Shows current match position (e.g., "2/5")
- Smooth scrolling to matches
- Keyboard shortcuts (Enter to find next, Esc to close)
- Dark mode support
- Mobile-friendly
- No backdrop overlay - content remains visible while searching

## Implementation Status

### ✅ Implemented Pages
The find-in-page feature has been successfully added to:

1. **Topics Page** - `/topics/[id]` 
   - URL: `http://localhost:3000/topics/34?title=chapter+badd`
   
2. **Books Page** - `/books/[id]`
   - URL: `http://localhost:3000/books/80?title=Pertemuan+Dharma+2012`
   
3. **Topics2 Page** - `/topics2/[id]`
   - URL: `http://localhost:3000/topics2/1`
   
4. **Topics3 Page** - `/topics3/[id]`
   - URL: `http://localhost:3000/topics3/16`
   
5. **Audio Page** - `/audio/[id]`
   - URL: `http://localhost:3000/audio/356?title=100+orang+nyanyi+Da+Bei+Zhou`
   
6. **Video Page** - `/video/[categoryId]/[subCategoryId]`
   - URL: `http://localhost:3000/video/113/121?title=2009+-+2011`

All pages now have a 3-dot menu icon in the top bar with "Cari di Halaman" option.

## How to Use

1. Click the 3-dot menu icon (⋮) in the top bar
2. Select "Cari di Halaman" from the dropdown
3. Type your search query in the input field
4. Press Enter or click the down arrow to navigate to next match
5. Use up/down arrows to navigate between matches
6. Press Esc or click X to close

## Component Details

### Location
`app/components/FindInPage.vue`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls visibility of the find panel |
| `targetSelector` | `string` | `'body'` | CSS selector for the content area to search within |

### Events

| Event | Description |
|-------|-------------|
| `close` | Emitted when user closes the find panel |

### Keyboard Shortcuts

- `Enter` - Find next match
- `Esc` - Close find panel

### Styling

The component uses:
- All matches: Bright yellow (`#fde047`) with black text
- Current match: Orange (`#f97316`) with white text and bold font
- Compact design at top of screen
- No backdrop overlay for better visibility
- Smooth scroll animation to current match

## Adding to New Pages

To add this feature to other pages, follow this pattern:

```vue
<template>
  <div>
    <!-- Header with 3-dot menu -->
    <div class="flex items-center justify-between p-4">
      <h1>Page Title</h1>
      
      <div class="relative">
        <button @click="showMenu = !showMenu">
          <Icon name="mdi:dots-vertical" class="w-6 h-6" />
        </button>
        
        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <button
            @click="openFindInPage"
            class="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 rounded-lg"
          >
            <Icon name="mdi:magnify" class="w-5 h-5" />
            <span>Cari di Halaman</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Content with ID -->
    <div id="page-content" class="p-4">
      <!-- Your content here -->
    </div>
    
    <!-- Find In Page Component -->
    <FindInPage
      :is-open="showFindInPage"
      target-selector="#page-content"
      @close="showFindInPage = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showMenu = ref(false)
const showFindInPage = ref(false)

const openFindInPage = () => {
  showMenu.value = false
  showFindInPage.value = true
}
</script>
```

## Tips

1. **Target Specific Content**: Use a specific CSS selector (like `#page-content`) instead of `body` to limit search scope and improve performance.

2. **Add ID to Content Container**: Make sure your main content area has an ID:
   ```vue
   <div id="page-content" class="content">
     <!-- searchable content -->
   </div>
   ```

3. **Menu Positioning**: The 3-dot menu uses absolute positioning, so wrap it in a `relative` container.

4. **Z-Index**: The find panel uses `z-50` to stay on top. The dropdown menu uses `z-20`.

## Design Improvements

Compared to the initial version:
- Removed dark backdrop overlay for better content visibility
- Compact single-line design at top of screen
- Brighter highlight colors for better visibility
- Orange highlight for current match (more prominent)
- Cleaner, less intrusive UI
