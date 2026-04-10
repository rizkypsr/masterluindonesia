<template>
  <!-- Find Panel - No backdrop, positioned at top -->
  <div v-if="isOpen" class="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600">
      <!-- Compact Search Bar -->
      <div class="flex items-center gap-2 p-3">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Cari teks..."
          class="flex-1 px-3 py-2 text-sm text-black dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          @input="handleSearch"
          @keydown.enter="findNext"
          @keydown.esc="close"
        />
        
        <!-- Match Counter -->
        <div v-if="searchQuery" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          <span v-if="totalMatches > 0">{{ currentMatchIndex + 1 }}/{{ totalMatches }}</span>
          <span v-else class="text-xs">0</span>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex items-center gap-1">
          <button
            @click="findPrevious"
            :disabled="totalMatches === 0"
            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Sebelumnya"
          >
            <Icon name="mdi:chevron-up" class="w-5 h-5 text-black dark:text-white" />
          </button>
          <button
            @click="findNext"
            :disabled="totalMatches === 0"
            class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Selanjutnya"
          >
            <Icon name="mdi:chevron-down" class="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>
        
        <!-- Close Button -->
        <button @click="close" class="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Tutup">
          <Icon name="mdi:close" class="w-5 h-5 text-black dark:text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

interface Props {
  isOpen: boolean
  targetSelector?: string
}

const props = withDefaults(defineProps<Props>(), {
  targetSelector: 'body'
})

const emit = defineEmits<{
  close: []
}>()

const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const currentMatchIndex = ref(0)
const totalMatches = ref(0)
const matches = ref<HTMLElement[]>([])

const HIGHLIGHT_CLASS = 'find-in-page-highlight'
const CURRENT_HIGHLIGHT_CLASS = 'find-in-page-current'

const handleSearch = () => {
  clearHighlights()
  
  if (!searchQuery.value.trim()) {
    totalMatches.value = 0
    currentMatchIndex.value = 0
    return
  }
  
  highlightMatches()
}

const highlightMatches = () => {
  const targetElement = document.querySelector(props.targetSelector)
  if (!targetElement) return
  
  const searchText = searchQuery.value.trim().toLowerCase()
  matches.value = []
  
  const walker = document.createTreeWalker(
    targetElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
        
        const parent = node.parentElement
        if (!parent) return NodeFilter.FILTER_REJECT
        
        // Skip script, style, and already highlighted elements
        const tagName = parent.tagName.toLowerCase()
        if (['script', 'style', 'noscript'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT
        }
        if (parent.classList.contains(HIGHLIGHT_CLASS)) {
          return NodeFilter.FILTER_REJECT
        }
        
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )
  
  const nodesToHighlight: { node: Text; indices: number[] }[] = []
  
  let currentNode: Node | null
  while ((currentNode = walker.nextNode())) {
    const textNode = currentNode as Text
    const text = textNode.textContent?.toLowerCase() || ''
    const indices: number[] = []
    
    let index = text.indexOf(searchText)
    while (index !== -1) {
      indices.push(index)
      index = text.indexOf(searchText, index + 1)
    }
    
    if (indices.length > 0) {
      nodesToHighlight.push({ node: textNode, indices })
    }
  }
  
  // Apply highlights
  nodesToHighlight.forEach(({ node, indices }) => {
    const text = node.textContent || ''
    const parent = node.parentElement
    if (!parent) return
    
    const fragment = document.createDocumentFragment()
    let lastIndex = 0
    
    indices.forEach((index) => {
      // Add text before match
      if (index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, index)))
      }
      
      // Add highlighted match
      const mark = document.createElement('mark')
      mark.className = HIGHLIGHT_CLASS
      mark.textContent = text.substring(index, index + searchText.length)
      mark.style.backgroundColor = '#fde047'
      mark.style.color = '#000000'
      mark.style.padding = '2px 0'
      mark.style.borderRadius = '2px'
      fragment.appendChild(mark)
      matches.value.push(mark)
      
      lastIndex = index + searchText.length
    })
    
    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
    }
    
    parent.replaceChild(fragment, node)
  })
  
  totalMatches.value = matches.value.length
  
  if (totalMatches.value > 0) {
    currentMatchIndex.value = 0
    highlightCurrent()
  }
}

const highlightCurrent = () => {
  matches.value.forEach((match, index) => {
    if (index === currentMatchIndex.value) {
      match.classList.add(CURRENT_HIGHLIGHT_CLASS)
      match.style.backgroundColor = '#f97316'
      match.style.color = '#ffffff'
      match.style.fontWeight = '600'
      match.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      match.classList.remove(CURRENT_HIGHLIGHT_CLASS)
      match.style.backgroundColor = '#fde047'
      match.style.color = '#000000'
      match.style.fontWeight = 'normal'
    }
  })
}

const findNext = () => {
  if (totalMatches.value === 0) return
  
  currentMatchIndex.value = (currentMatchIndex.value + 1) % totalMatches.value
  highlightCurrent()
}

const findPrevious = () => {
  if (totalMatches.value === 0) return
  
  currentMatchIndex.value = currentMatchIndex.value === 0 
    ? totalMatches.value - 1 
    : currentMatchIndex.value - 1
  highlightCurrent()
}

const clearHighlights = () => {
  const highlights = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`)
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode
    if (parent) {
      parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight)
      parent.normalize()
    }
  })
  
  matches.value = []
  totalMatches.value = 0
  currentMatchIndex.value = 0
}

const clearSearch = () => {
  searchQuery.value = ''
  clearHighlights()
}

const close = () => {
  clearHighlights()
  searchQuery.value = ''
  emit('close')
}

// Close on Escape key globally
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    close()
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleEscapeKey)
    }
  } else {
    clearHighlights()
    searchQuery.value = ''
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }
})

onBeforeUnmount(() => {
  clearHighlights()
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', handleEscapeKey)
  }
})
</script>

<style scoped>
.find-in-page-highlight {
  transition: background-color 0.2s ease;
}
</style>
