<template>
  <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center gap-4 flex-1 min-w-0">
        <button @click="goBack()"
          class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded shrink-0">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white line-clamp-1">{{ pageTitle }}</h1>
      </div>
      <button @click="shareContent" class="p-1 shrink-0">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
    </div>

    <!-- Search -->
    <div class="px-4 py-4 shrink-0">
      <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Pencarian"
          class="flex-1 bg-transparent text-black dark:text-white placeholder-gray-400 outline-none text-sm" />
      </div>
    </div>

    <!-- Scrollable Content Area -->
    <div ref="contentRef" class="flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="px-4 space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      <!-- Category Chips -->
      <div v-else-if="categories.length > 0" class="px-4">
        <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)"
            class="shrink-0 px-4 py-2 rounded-full text-lg font-medium transition-colors" :class="selectedCategoryId === category.id
              ? 'bg-primary text-black dark:bg-yellow-500'
              : 'bg-primary/40 text-black dark:bg-gray-700 dark:text-gray-300'">
            {{ category.name }}
          </button>
        </div>

        <!-- Content List -->
        <div class="space-y-4 pb-20">
          <div v-if="filteredContents.length === 0" class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
          </div>

          <div v-for="item in filteredContents" :key="item.id" class="rounded-xl overflow-hidden"
            :class="expandedItems.has(item.id) ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'"
            :style="{ fontSize: fontSize + 'px' }">
            <!-- Card Header -->
            <div class="p-3 cursor-pointer" @click="toggleExpand(item.id)">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="font-bold"
                    :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'"
                    :style="{ fontSize: fontSize + 'px' }"
                    v-html="item.content">
                  </div>
                </div>
                <button class="p-2 shrink-0">
                  <Icon :name="expandedItems.has(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-6 h-6"
                    :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'" />
                </button>
              </div>
            </div>

            <!-- Expandable Content -->
            <div v-if="expandedItems.has(item.id)" class="mx-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div class="text-black dark:text-white leading-relaxed" v-html="item.content"></div>
              <div class="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                <button @click.stop="copyContent(item)"
                  class="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:font-bold">
                  <Icon name="mdi:content-copy" class="w-4 h-4" />
                  <span>Salin</span>
                </button>
                <button @click.stop="speakContent(item)"
                  class="flex items-center gap-1 hover:font-bold"
                  :class="speakingItemId === item.id ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
                  <Icon :name="speakingItemId === item.id ? 'mdi:stop' : 'mdi:account-voice'" class="w-4 h-4" />
                  <span>{{ speakingItemId === item.id ? 'Stop' : 'Voice' }}</span>
                </button>
                <button @click.stop="openVideoPage"
                  class="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:font-bold">
                  <Icon name="mdi:play" class="w-4 h-4" />
                  <span>Video</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="px-4 text-center py-8">
        <Icon name="mdi:file-document-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada konten</p>
      </div>
    </div>

    <!-- FAB - Fixed at bottom -->
    <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto pointer-events-none">
      <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-4 bottom-4 pointer-events-auto" @zoomIn="zoomIn"
        @zoomOut="zoomOut" @scrollTop="scrollToTop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSmartBack } from '~/composables/useSmartBack'

const { goBack } = useSmartBack()

interface Content {
  id: number
  content: string
  content_wa: string
}

interface Category {
  id: number
  name: string
  description: string | null
  contents: Content[]
}

const route = useRoute()
const config = useRuntimeConfig()
const toast = useToast()

const chapterId = computed(() => route.params.chapterId as string)
const pageTitle = computed(() => route.query.title as string || 'Konten')

const contents = ref<Category[]>([])
const isLoading = ref(true)
const contentRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const expandedItems = ref<Set<number>>(new Set())
const speakingItemId = ref<number | null>(null)
const isSpeaking = ref(false)

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(18) // base font size in px

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 10)
}

const scrollToTop = () => {
  contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// Categories
const categories = computed(() => contents.value || [])

// Selected category state
const selectedCategoryId = ref<number | null>(null)

// Select category and scroll to top
const selectCategory = (categoryId: number) => {
  selectedCategoryId.value = categoryId
  scrollToTop()
  // Clear search when switching categories
  searchQuery.value = ''
  // Collapse all items
  expandedItems.value.clear()
}

// Set default selected category when data loads
watch(categories, (cats) => {
  if (cats.length > 0 && selectedCategoryId.value === null) {
    selectedCategoryId.value = cats[0]?.id || null
  }
}, { immediate: true })

// Get contents for selected category
const selectedCategoryContents = computed(() => {
  const category = categories.value.find(c => c.id === selectedCategoryId.value)
  return category?.contents || []
})

// Filtered contents based on search
const filteredContents = computed(() => {
  if (!searchQuery.value.trim()) return selectedCategoryContents.value
  const query = searchQuery.value.toLowerCase()
  return selectedCategoryContents.value.filter(item =>
    stripHtml(item.content).toLowerCase().includes(query)
  )
})

const toggleExpand = (id: number) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id)
  } else {
    expandedItems.value.add(id)
  }
  expandedItems.value = new Set(expandedItems.value)
}

const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const copyContent = async (item: Content) => {
  const text = stripHtml(item.content_wa || item.content)
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      title: 'Berhasil disalin',
      color: 'success'
    })
  } catch (err) {
    console.error('Failed to copy:', err)
    toast.add({
      title: 'Gagal menyalin',
      color: 'error'
    })
  }
}

const speakContent = (item: Content) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  // If already speaking this item, stop it
  if (isSpeaking.value && speakingItemId.value === item.id) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    speakingItemId.value = null
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const text = stripHtml(item.content_wa || item.content)
  const utterance = new SpeechSynthesisUtterance(text)

  // Set Indonesian language
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    isSpeaking.value = true
    speakingItemId.value = item.id
  }

  utterance.onend = () => {
    isSpeaking.value = false
    speakingItemId.value = null
  }

  utterance.onerror = () => {
    isSpeaking.value = false
    speakingItemId.value = null
  }

  window.speechSynthesis.speak(utterance)
}

// Open video page function
const openVideoPage = () => {
  const videoUrl = `/video/topic3-chapter/${chapterId.value}`
  navigateTo(videoUrl)
}

// Share content
const shareContent = async () => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(pageTitle.value)}`
  const shareTitle = pageTitle.value

  const shareData = {
    title: shareTitle,
    text: shareTitle,
    url: shareUrl
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`${shareTitle}\n${shareUrl}`)
    toast.add({
      title: 'Link disalin ke clipboard',
      color: 'success'
    })
  }
}

onMounted(async () => {
  // Fetch content data
  try {
    const response = await $fetch<{ success: boolean; data: Category[] }>(
      `${config.public.apiBaseUrl}/topics3/contents/${chapterId.value}`
    )
    contents.value = response.data || []
  } catch (error) {
    console.error('Error fetching topics3 content:', error)
    toast.add({
      title: 'Gagal memuat konten',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.prose {
  font-size: 1rem;
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1rem;
}
</style>
