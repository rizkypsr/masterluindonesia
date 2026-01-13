<template>
  <div class="min-h-screen bg-gray-50 pb-32">
    <!-- Header -->
    <div class="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
      <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
      </button>
      <h1 class="text-lg font-semibold text-black">{{ pageTitle }}</h1>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div class="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 animate-pulse">
          <div class="w-14 h-14 bg-gray-200 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <template v-else>
        <!-- Audio Groups -->
        <div v-for="group in audioGroups" :key="group.id" class="mb-6">
          <!-- Category Badge -->
          <span class="inline-block bg-primary text-black text-sm font-medium px-4 py-2 rounded-full mb-4">
            {{ group.name }}
          </span>

          <!-- Audio List -->
          <div class="space-y-2">
            <button v-for="audio in group.audio" :key="audio.id" @click="playAudio(audio)"
              class="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
              :class="currentAudio?.id === audio.id ? 'bg-primary/20' : 'hover:bg-gray-100'">
              <div
                class="w-14 h-14 bg-gradient-to-b from-[#c9a227] to-[#8b7355] rounded-lg flex items-center justify-center shrink-0">
                <Icon name="mdi:music-note" class="w-8 h-8 text-white" />
              </div>
              <div class="flex-1 text-left">
                <p class="text-sm font-medium text-black line-clamp-2">{{ audio.title.trim() }}</p>
              </div>
              <span class="text-sm text-gray-500 shrink-0">{{ audio.duration }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Floating Playlist Button -->
    <button v-if="currentAudio"
      class="fixed bottom-28 right-4 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center">
      <Icon name="mdi:playlist-music" class="w-6 h-6 text-black" />
    </button>

    <!-- Bottom Audio Player -->
    <div v-if="currentAudio" class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-medium text-black flex-1 line-clamp-1">{{ currentAudio.title.trim() }}</p>
        <button @click="closePlayer" class="p-1">
          <Icon name="mdi:close" class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="flex items-center gap-2 mb-3">
        <input type="range" :value="currentTime" :max="duration" @input="seek"
          class="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary" />
        <span class="text-xs text-gray-500 w-20 text-right">{{ formatTime(currentTime) }}/{{ formatTime(duration)
          }}</span>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button class="p-1">
            <Icon name="mdi:star-outline" class="w-6 h-6 text-gray-600" />
          </button>
          <button class="p-1">
            <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button @click="skipBackward" class="p-2">
            <Icon name="mdi:rewind" class="w-6 h-6 text-gray-700" />
          </button>
          <button @click="togglePlay" class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-7 h-7 text-black" />
          </button>
          <button @click="skipForward" class="p-2">
            <Icon name="mdi:fast-forward" class="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <button class="p-1">
          <Icon name="mdi:minus" class="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

interface Subtitle {
  id: number
  text: string
  start: number
  end: number
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
const categoryId = computed(() => route.params.id)
const pageTitle = computed(() => (route.query.title as string) || 'Audio')

const { data: audioData, pending } = await useFetch<{ success: boolean; data: AudioGroup[] }>(
  () => `https://api.masterluindonesia.com/api/audio?audio_category_id=${categoryId.value}`
)

const audioGroups = computed(() => audioData.value?.data?.sort((a, b) => a.order - b.order) || [])

// Audio Player State
const audioElement = ref<HTMLAudioElement | null>(null)
const currentAudio = ref<AudioItem | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const playAudio = (audio: AudioItem) => {
  if (currentAudio.value?.id === audio.id) {
    togglePlay()
    return
  }
  currentAudio.value = audio
  if (audioElement.value) {
    audioElement.value.src = audio.url
    audioElement.value.play()
    isPlaying.value = true
  }
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
  currentAudio.value = null
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
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

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
</style>
