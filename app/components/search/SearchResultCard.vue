<script setup lang="ts">
import type { SearchItem } from '~/types/search'

const props = defineProps<{
  item: SearchItem
  isExpanded: boolean
  fontSize: number
  isSpeaking: boolean
  searchKeyword?: string
}>()

const emit = defineEmits<{
  toggle: []
  navigate: []
  copy: []
  speak: []
  navigateRelated: [chapter: any]
}>()

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function highlightText(text: string): string {
  if (!props.searchKeyword?.trim()) return text
  const search = props.searchKeyword.trim()
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = text
  
  // Function to highlight text in text nodes only
  const highlightTextNodes = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || ''
      if (textContent.toLowerCase().includes(search.toLowerCase())) {
        const regex = new RegExp(`(${search})`, 'gi')
        const highlightedText = textContent.replace(regex, '<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>')
        const span = document.createElement('span')
        span.innerHTML = highlightedText
        node.parentNode?.replaceChild(span, node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't highlight inside mark tags
      if ((node as Element).tagName !== 'MARK') {
        Array.from(node.childNodes).forEach(highlightTextNodes)
      }
    }
  }
  
  highlightTextNodes(tempDiv)
  return tempDiv.innerHTML
}
</script>

<template>
  <div class="rounded-xl overflow-hidden"
    :class="isExpanded ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'"
    :style="{ fontSize: fontSize + 'px' }">
    <!-- Card Header -->
    <div class="p-4 cursor-pointer"
      :class="isExpanded ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'"
      @click="emit('toggle')">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-bold"
            :class="isExpanded ? 'text-black' : 'text-black dark:text-white'"
            :style="{ fontSize: fontSize + 'px' }">
            {{ item.title }}
          </h3>
          <!-- Video metadata -->
          <div v-if="item.type.toLowerCase() === 'video' && (item.sub_group_name || item.timestamp_formatted)" 
            class="flex items-center gap-2 mt-1"
            :class="isExpanded ? 'text-black/80' : 'text-gray-600 dark:text-gray-400'"
            :style="{ fontSize: (fontSize - 2) + 'px' }">
            <span v-if="item.sub_group_name">{{ item.sub_group_name }}</span>
            <span v-if="item.sub_group_name && item.timestamp_formatted" class="text-xs">•</span>
            <span v-if="item.timestamp_formatted">{{ item.timestamp_formatted }}</span>
          </div>
          <!-- Detail text -->
          <p v-if="item.type.toLowerCase() !== 'video'" 
            :class="isExpanded ? 'text-black' : 'text-black dark:text-gray-300'"
            class="mt-1 line-clamp-6"
            :style="{ fontSize: fontSize + 'px' }">{{ item.detail }}</p>
        </div>
        <button @click.stop="emit('navigate')" class="p-2">
          <Icon name="mdi:arrow-right" class="w-6 h-6 text-black dark:text-white shrink-0" />
        </button>
      </div>
    </div>

    <!-- Expandable Content -->
    <div v-if="isExpanded" class="m-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
      <!-- For audio, video, and topik items: render HTML to preserve formatting with highlighting -->
      <div v-if="['audio', 'video', 'topik1', 'topik2', 'topik3', 'topic1', 'topic2', 'topic3', 'ensiklopedia', 'kumpulan tanya jawab'].includes(item.type.toLowerCase())"
        class="text-black dark:text-white mb-4"
        :style="{ fontSize: fontSize + 'px' }"
        v-html="highlightText(item.full_detail)">
      </div>
      <!-- For book items: use plain text with highlighting -->
      <div v-else class="text-black dark:text-white mb-4 whitespace-pre-wrap"
        :style="{ fontSize: fontSize + 'px' }"
        v-html="highlightText(stripHtml(item.full_detail))">
      </div>

      <!-- Related Chapters -->
      <div v-if="item.related_chapters && item.related_chapters.length > 0"
        class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bab Terkait:</h4>
        <div class="space-y-2">
          <button v-for="(chapter, idx) in item.related_chapters" :key="idx"
            @click.stop="emit('navigateRelated', chapter)"
            class="w-full text-left p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div class="text-sm text-gray-900 dark:text-white font-medium">{{ chapter.chapter_title }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ chapter.parent_title }}</div>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
        <button @click.stop="emit('copy')"
          class="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:font-bold">
          <Icon name="mdi:content-copy" class="w-4 h-4" />
          <span>Salin</span>
        </button>
        <button @click.stop="emit('speak')"
          class="flex items-center gap-1 text-sm hover:font-bold"
          :class="isSpeaking ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
          <Icon :name="isSpeaking ? 'mdi:stop' : 'mdi:account-voice'" class="w-4 h-4" />
          <span>{{ isSpeaking ? 'Stop' : 'Voice' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
