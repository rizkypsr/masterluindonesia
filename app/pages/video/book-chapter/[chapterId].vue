<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <BackButton />
      <h1 class="text-lg font-semibold text-black dark:text-white">Video</h1>
    </div>

    <!-- Content -->
    <div ref="contentContainer" class="flex-1 overflow-y-auto p-4">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <Icon name="mdi:alert-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Gagal memuat video</p>
        <button @click="refresh()" class="mt-4 px-4 py-2 bg-[#ffcb00] text-[#221b00] rounded-lg">
          Coba Lagi
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!video" class="text-center py-8">
        <Icon name="mdi:video-off" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Tidak ada video untuk chapter ini</p>
      </div>

      <!-- Video Display -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- Video Title -->
        <h3 class="text-lg font-semibold text-black dark:text-white mb-2">
          {{ video.title }}
        </h3>

        <!-- Video Description -->
        <p v-if="video.synopsis" class="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {{ video.synopsis }}
        </p>

        <!-- Video Meta -->
        <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span v-if="video.date">
            <Icon name="mdi:calendar" class="w-4 h-4 inline mr-1" />
            {{ formatDate(video.date) }}
          </span>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button v-if="video.video_id" @click="playVideo"
            class="px-4 py-2 bg-[#ffcb00] text-[#221b00] rounded-lg font-medium hover:bg-yellow-500 transition-colors">
            <Icon name="mdi:play" class="w-4 h-4 inline mr-1" />
            Putar Video
          </button>

          <button v-if="video.url" @click="openVideoUrl(video.url)"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Icon name="mdi:open-in-new" class="w-4 h-4 inline mr-1" />
            Buka Link
          </button>

          <!-- No video available message -->
          <div v-if="!video.video_id && !video.url" class="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
            Video tidak tersedia
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const chapterId = route.params.chapterId as string

interface Video {
  video_id: number | null
  title: string
  synopsis?: string
  url?: string
  url_audio?: string
  date?: string
}

interface ApiResponse {
  success: boolean
  message: string
  data: {
    chapter_id: number
    chapter_title: string
    video: Video | null
  }
}

// Fetch video for this chapter
const { data: apiResponse, pending, error, refresh } = await useFetch<ApiResponse>(
  `${config.public.apiBaseUrl}/videos/book-chapter/${chapterId}`,
  {
    default: () => ({ success: false, message: '', data: { chapter_id: 0, chapter_title: '', video: null } })
  }
)

// Extract video from the API response
const video = computed(() => apiResponse.value?.data?.video || null)

// Format date helper
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Play video function - now uses video_id directly
const playVideo = () => {
  if (video.value?.video_id) {
    navigateTo(`/video/play/sub/${video.value.video_id}?title=${encodeURIComponent(video.value.title)}`)
  }
}

// Open video URL in new tab
const openVideoUrl = (url: string) => {
  window.open(url, '_blank')
}

// Set page title
useHead({
  title: 'Video'
})
</script>

<style scoped>
/* Removed unused line-clamp classes */
</style>