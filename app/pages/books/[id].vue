<template>
  <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white">Detail Buku</h1>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-1" @click="addToBookmark">
          <Icon :name="isBookBookmarked ? 'mdi:star' : 'mdi:star-outline'" 
                :class="isBookBookmarked ? 'text-yellow-500' : 'text-black dark:text-white'"
                class="w-6 h-6" />
        </button>
        <button class="p-1" @click="addToPlaylist">
          <Icon name="mdi:playlist-plus" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <button class="p-1" @click="shareBook">
          <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>
    </div>

    <!-- Book Info -->
    <div class="px-4 py-6 flex items-center gap-4 shrink-0">
      <ClientOnly>
        <NuxtImg :src="bookCover" :alt="bookTitle" class="w-24 h-32 object-cover rounded-xl shrink-0" loading="lazy"
          placeholder="/fallback.svg" fallback="/fallback.svg" />
        <template #fallback>
          <div class="w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse shrink-0"></div>
        </template>
      </ClientOnly>
      <h2 class="font-semibold text-black dark:text-white" :style="{ fontSize: (fontSize + 4) + 'px' }">{{ bookTitle }}</h2>
    </div>

    <!-- Content -->
    <div class="px-4 flex-1 flex flex-col overflow-hidden">
      <!-- Empty State -->
      <div v-if="chapters.length === 0" class="flex flex-col items-center justify-center flex-1">
        <div class="w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 relative">
          <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300 dark:text-gray-600" />
          <div class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <Icon name="mdi:cancel" class="w-6 h-6 text-gray-300 dark:text-gray-600" />
          </div>
        </div>
        <p class="text-gray-500 dark:text-gray-400 font-medium">Data tidak tersedia</p>
      </div>

      <!-- Chapters List -->
      <div v-else class="flex flex-col overflow-hidden flex-1">
        <h3 class="font-semibold text-black dark:text-white mb-4 shrink-0" :style="{ fontSize: (fontSize + 2) + 'px' }">Daftar Isi</h3>

        <div ref="scrollContainer" class="overflow-y-auto flex-1 custom-scrollbar pb-4">
          <div v-for="chapter in chapters" :key="chapter.id" class="mb-4">
            <!-- Chapter Title -->
            <h4 class="font-semibold text-black dark:text-white py-2" :style="{ fontSize: fontSize + 'px' }">{{ chapter.title }}</h4>

            <!-- Sub Chapters (Recursive) -->
            <ChapterItem 
              v-if="chapter.sub_chapters && chapter.sub_chapters.length > 0"
              v-for="sub in chapter.sub_chapters" 
              :key="sub.id"
              :chapter="sub"
              :book-id="bookId"
              :font-size="fontSize"
              :level="1"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with FAB -->
    <div class="shrink-0 relative pb-[env(safe-area-inset-bottom)]">
      <FabZoom 
        v-model:isOpen="showFabMenu"
        class="absolute right-4 bottom-4 z-10 mb-[env(safe-area-inset-bottom)]"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @scrollTop="scrollToTop"
      />
    </div>

    <!-- Bookmark Modal -->
    <BookmarkModal />
    
    <!-- Playlist Modal -->
    <PlaylistModal />
  </div>
</template>

<script setup lang="ts">
import { useBookmark } from '~/composables/useBookmark'
import { useHistory } from '~/composables/useHistory'

const route = useRoute()
const config = useRuntimeConfig()

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(16)
const scrollContainer = ref<HTMLElement | null>(null)

// Bookmark
const { createBookBookmark, fetchBookmarksByType, isBookmarked } = useBookmark()

// Playlist
const { openPlaylistModal } = usePlaylist()

// History
const { saveBookHistory } = useHistory()

const isBookBookmarked = computed(() => {
  return isBookmarked(3, bookTitle.value)
})

onMounted(async () => {
  await fetchBookmarksByType(3)
  
  // Save to history
  saveBookHistory(bookTitle.value, Number(bookId.value))
})

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

const scrollToTop = () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

interface SubChapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub?: SubChapter[]
}

interface Chapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub_chapters: SubChapter[]
}

const bookId = computed(() => route.params.id as string)
const bookTitle = computed(() => (route.query.title as string) || 'Buku')
const bookCover = computed(() => (route.query.cover as string) || '/fallback.svg')

const { data: chaptersData } = await useFetch<{ success: boolean; data: Chapter[] }>(
  () => `${config.public.apiBaseUrl}/books/${bookId.value}`
)

const chapters = computed(() => {
  if (chaptersData.value?.data) {
    return chaptersData.value.data.sort((a, b) => a.seq - b.seq)
  }
  return []
})

const shareBook = async () => {
  const shareData = {
    title: `Baca Buku "${bookTitle.value}"`,
    text: `Baca Buku "${bookTitle.value}" di`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`Baca Buku "${bookTitle.value}" di\n${window.location.href}`)
    alert('Link berhasil disalin!')
  }
}

const addToBookmark = () => {
  createBookBookmark(
    bookTitle.value,
    Number(bookId.value),
    chapters.value[0]?.sub_chapters?.[0]?.id || 0,
    1
  )
}

const addToPlaylist = () => {
  openPlaylistModal(3, {
    bookId: Number(bookId.value),
    chapterId: chapters.value[0]?.sub_chapters?.[0]?.id || 0
  })
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
</style>
