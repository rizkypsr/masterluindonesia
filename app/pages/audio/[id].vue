<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="goBack()"
        class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white">{{ pageTitle }}</h1>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 pb-40">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="i in 6" :key="i"
            class="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
        </div>
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 animate-pulse">
          <div class="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>

      <template v-else>
        <!-- Category Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button v-for="group in audioGroups" :key="group.id" @click="selectedGroupId = group.id"
            class="shrink-0 px-4 py-2 rounded-full text-lg font-medium transition-colors" :class="selectedGroupId === group.id
              ? 'bg-primary text-black dark:bg-yellow-500'
              : 'bg-primary/40 text-black dark:bg-gray-700 dark:text-gray-300'">
            {{ group.name }}
          </button>
        </div>

        <!-- Audio List for Selected Group -->
        <div class="space-y-2">
          <div v-for="audio in selectedGroupAudios" :key="audio.id">
            <!-- Audio Item - Not Selected -->
            <button v-if="currentAudio?.id !== audio.id" @click="playAudio(audio)"
              class="w-full flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              :style="{ fontSize: fontSize + 'px' }">
              <div
                class="w-14 h-14 bg-gradient-to-b from-[#c9a227] to-[#8b7355] rounded-lg flex items-center justify-center shrink-0">
                <Icon name="mdi:music-note" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 text-left">
                <p class="font-medium text-black dark:text-white line-clamp-2 text-lg">{{ audio.title.trim() }}</p>
              </div>
              <span class="text-gray-500 dark:text-gray-400 shrink-0">{{ audio.duration }}</span>
            </button>

            <!-- Audio Item - Selected (with Player & Show Teks) -->
            <div v-else class="bg-[#c09637] dark:bg-yellow-600 rounded-2xl overflow-hidden"
              :style="{ fontSize: fontSize + 'px' }">
              <!-- Player Header -->
              <div class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <button @click="togglePlay" class="shrink-0">
                    <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-6 h-6 text-black" />
                  </button>
                  <p class="font-medium text-black flex-1 line-clamp-1 text-lg">{{ audio.title.trim() }}</p>
                  <span class="text-black shrink-0">{{ audio.duration }}</span>
                </div>
              </div>

              <!-- Show Teks Accordion -->
              <div class="bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl overflow-hidden">
                <button @click="showSubtitle = !showSubtitle"
                  class="w-full flex items-center justify-between px-4 py-3">
                  <span class="text-lg font-medium text-black dark:text-white">Show Teks</span>
                  <Icon :name="showSubtitle ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>

                <!-- Subtitle Content -->
                <div v-if="showSubtitle" class="px-4 pb-4">
                  <!-- Search Input -->
                  <input v-model="subtitleSearch" type="text" placeholder="Masukan kata kunci"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-lg mb-4 focus:outline-none focus:border-primary bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />

                  <!-- Subtitle List -->
                  <div class="space-y-4">
                    <div v-for="sub in filteredSubtitles" :key="sub.id"
                      class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-lg"
                      :style="{ fontSize: fontSize + 'px' }">
                      <p class="font-semibold text-black dark:text-white mb-2 cursor-pointer hover:text-primary dark:hover:text-yellow-400"
                        @click="seekToTimestamp(sub.timestamp)">{{ sub.title }}</p>
                      <p class="text-black dark:text-gray-400 mb-2 text-md" v-html="sub.description"></p>
                      <div class="text-black dark:text-white mb-4 text-md" v-html="highlightText(sub.script)"></div>

                      <!-- Action Buttons -->
                      <div class="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button @click="copySubtitle(sub)"
                          class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                          <Icon name="mdi:content-copy" class="w-4 h-4" />
                          <span>Salin</span>
                        </button>
                        <button @click="viewDetail(sub)"
                          class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                          <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                          <span>Detail</span>
                        </button>
                        <button @click="speakSubtitle(sub)"
                          class="flex items-center gap-1 text-lg hover:text-primary dark:hover:text-yellow-400"
                          :class="speakingSubtitleId === sub.id ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
                          <Icon :name="speakingSubtitleId === sub.id ? 'mdi:stop' : 'mdi:account-voice'"
                            class="w-4 h-4" />
                          <span>{{ speakingSubtitleId === sub.id ? 'Stop' : 'Voice' }}</span>
                        </button>
                      </div>
                    </div>
                    <p v-if="filteredSubtitles.length === 0"
                      class="text-lg text-gray-500 dark:text-gray-400 text-center py-4">
                      Tidak ada teks ditemukan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" />

    <!-- Bottom Section Container -->
    <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <!-- Floating Action Button (positioned above bottom drawer) - Lazy loaded -->
      <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-0 bottom-full z-10" @zoomIn="zoomIn"
        @zoomOut="zoomOut" @scrollTop="scrollToTop" />

      <!-- Bottom Audio Player Drawer -->
      <div v-if="currentAudio"
        class="bg-white dark:bg-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] p-4">
        <!-- Minimized View -->
        <template v-if="isPlayerMinimized">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-lg text-gray-500 dark:text-gray-400">Sedang diputar</p>
              <p class="font-semibold text-black dark:text-white line-clamp-1">{{ currentAudio.title.trim() }}</p>
            </div>
            <button @click="isPlayerMinimized = false" class="p-2">
              <Icon name="mdi:menu" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>

        <!-- Expanded View -->
        <template v-else>
          <div class="flex items-center justify-between mb-2">
            <p class="text-lg font-medium text-black dark:text-white flex-1 line-clamp-1">{{ currentAudio.title.trim()
              }}</p>
            <button @click="closePlayer" class="p-1">
              <Icon name="mdi:close" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center gap-2 mb-3">
            <input type="range" :value="currentTime" :max="duration" @input="seek"
              class="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-primary" />
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20 text-right">{{ formatTime(currentTime) }}/{{
              formatTime(duration) }}</span>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button class="p-1" @click="addToBookmark">
                <Icon :name="isAudioBookmarked ? 'mdi:star' : 'mdi:star-outline'"
                  :class="isAudioBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'" class="w-6 h-6" />
              </button>
              <button class="p-1" @click="addToPlaylist">
                <Icon name="mdi:playlist-plus" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
              <button class="p-1" @click="shareContent">
                <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button @click="skipBackward" class="p-2">
                <Icon name="mdi:rewind" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button @click="togglePlay"
                class="w-12 h-12 bg-primary dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-7 h-7 text-black" />
              </button>
              <button @click="skipForward" class="p-2">
                <Icon name="mdi:fast-forward" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <button class="p-1" @click="isPlayerMinimized = true">
              <Icon name="mdi:minus" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Bookmark Modal - Lazy loaded -->
    <LazyBookmarkModal />
    
    <!-- Playlist Modal - Lazy loaded -->
    <LazyPlaylistModal />
  </div>
</template>

<script setup lang="ts">
import { useBookmark } from '~/composables/useBookmark'
import { useHistory } from '~/composables/useHistory'
import { useSmartBack } from '~/composables/useSmartBack'
import { ref, computed, watch, onMounted } from "vue"

const { goBack } = useSmartBack()

interface Subtitle {
  id: number
  title: string
  timestamp: number
  script: string
  script_wa: string
  description: string
  description_wa: string
}

interface AudioItem {
  id: number
  sub_group_id: number
  title: string
  url: string
  order: number
  duration: string
  translate_id: number
  translate_ch: number
  subtitle: Subtitle[]
}

interface AudioGroup {
  id: number
  audio_category_id: number
  name: string
  order: number
  have_child: number
  audio: AudioItem[]
}

const route = useRoute()
const config = useRuntimeConfig()
const categoryId = computed(() => route.params.id)
const pageTitle = computed(() => (route.query.title as string) || 'Audio')

// History
const { saveAudioHistory } = useHistory()

const { data: audioData, pending } = await useFetch<{ success: boolean; data: AudioGroup[] }>(
  () => `${config.public.apiBaseUrl}/audio?audio_category_id=${categoryId.value}`
)

const audioGroups = computed(() => audioData.value?.data?.sort((a, b) => a.order - b.order) || [])

// Selected Group State - persisted across navigation
const selectedGroupId = useState<number | null>(`audio-selected-group-${categoryId.value}`, () => null)

// Set default selected group when data loads
watch(audioGroups, (groups) => {
  if (groups.length > 0 && selectedGroupId.value === null) {
    selectedGroupId.value = groups[0].id
  }
}, { immediate: true })

const selectedGroupAudios = computed(() => {
  const group = audioGroups.value.find(g => g.id === selectedGroupId.value)
  return group?.audio || []
})

// Audio Player State - persisted across navigation
const audioElement = ref<HTMLAudioElement | null>(null)
const currentAudioId = useState<number | null>(`audio-current-id-${categoryId.value}`, () => null)
const currentAudio = computed(() => {
  if (!currentAudioId.value) return null
  for (const group of audioGroups.value) {
    const audio = group.audio.find(a => a.id === currentAudioId.value)
    if (audio) return audio
  }
  return null
})
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Subtitle State
const showSubtitle = ref(false)
const subtitleSearch = ref('')

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(16) // base font size in px
const isPlayerMinimized = ref(false)

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 10)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const filteredSubtitles = computed(() => {
  if (!currentAudio.value?.subtitle) return []
  const subtitles = currentAudio.value.subtitle
  if (!subtitleSearch.value.trim()) return subtitles
  const search = subtitleSearch.value.toLowerCase()
  return subtitles.filter(sub => sub.script.toLowerCase().includes(search))
})

const highlightText = (text: string) => {
  if (!subtitleSearch.value.trim()) return text
  const search = subtitleSearch.value.trim()
  const regex = new RegExp(`(${search})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>')
}

// Strip HTML tags for plain text display
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

// Copy subtitle to clipboard
const toast = useToast()

const copySubtitle = async (sub: Subtitle) => {
  const text = `${sub.title}\n${sub.description_wa}\n${sub.script_wa}`.replace(/\\n/g, '\n')
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

// Text-to-Speech State
const isSpeaking = ref(false)
const speakingSubtitleId = ref<number | null>(null)

// Speak subtitle using Web Speech API
const speakSubtitle = (sub: Subtitle) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  // If already speaking this subtitle, stop it
  if (isSpeaking.value && speakingSubtitleId.value === sub.id) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    speakingSubtitleId.value = null
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const text = stripHtml(sub.script)
  const utterance = new SpeechSynthesisUtterance(text)

  // Set Indonesian language
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    isSpeaking.value = true
    speakingSubtitleId.value = sub.id
  }

  utterance.onend = () => {
    isSpeaking.value = false
    speakingSubtitleId.value = null
  }

  utterance.onerror = () => {
    isSpeaking.value = false
    speakingSubtitleId.value = null
  }

  window.speechSynthesis.speak(utterance)
}

// View detail - navigate to detail page
const viewDetail = (sub: Subtitle) => {
  if (!currentAudio.value) return
  navigateTo({
    path: '/audio/detail',
    query: {
      audio_id: currentAudio.value.id,
      subtitle_id: sub.id
    }
  })
}

const playAudio = (audio: AudioItem) => {
  if (currentAudio.value?.id === audio.id) {
    togglePlay()
    return
  }
  currentAudioId.value = audio.id
  showSubtitle.value = false
  subtitleSearch.value = ''
  if (audioElement.value) {
    audioElement.value.src = audio.url
    audioElement.value.play()
    isPlaying.value = true
  }

  // Save to history (fire and forget)
  saveAudioHistory(audio.title, audio.id, null, 'CN')
}

const togglePlay = () => {
  if (!audioElement.value) return
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const closePlayer = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
  currentAudioId.value = null
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  showSubtitle.value = false
  subtitleSearch.value = ''
}

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

const onEnded = () => {
  isPlaying.value = false
}

const seek = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (audioElement.value) {
    audioElement.value.currentTime = Number(target.value)
  }
}

const skipForward = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = Math.min(audioElement.value.currentTime + 10, duration.value)
  }
}

const skipBackward = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = Math.max(audioElement.value.currentTime - 10, 0)
  }
}

const seekToTimestamp = (timestamp: number) => {
  if (audioElement.value) {
    audioElement.value.currentTime = timestamp
    if (!isPlaying.value) {
      audioElement.value.play()
      isPlaying.value = true
    }
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Bookmark
const { createAudioBookmark, fetchBookmarksByType, isBookmarked } = useBookmark()

// Playlist
const { openPlaylistModal } = usePlaylist()

const isAudioBookmarked = computed(() => {
  if (!currentAudio.value) return false
  return isBookmarked(2, currentAudio.value.title)
})

onMounted(async () => {
  await fetchBookmarksByType(2)

  // Restore audio source if there was a selected audio
  if (currentAudio.value && audioElement.value) {
    audioElement.value.src = currentAudio.value.url
  }
})

const addToBookmark = () => {
  if (!currentAudio.value) return
  createAudioBookmark(
    currentAudio.value.title,
    currentAudio.value.id,
    Number(categoryId.value)
  )
}

const addToPlaylist = () => {
  if (!currentAudio.value) return
  openPlaylistModal(2, {
    audioId: currentAudio.value.id,
    audio_category_id: Number(categoryId.value)
  })
}

const shareContent = () => {
  if (!currentAudio.value) return

  const title = currentAudio.value.title.trim()
  const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(pageTitle.value)}`
  const shareTitle = `${pageTitle.value} - ${title}`

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareTitle,
      url: shareUrl
    })
  } else {
    // Fallback: copy to clipboard
    const shareText = `${shareTitle}\n${shareUrl}`
    navigator.clipboard.writeText(shareText)
  }
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #ffca03;
  border-radius: 50%;
  cursor: pointer;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
