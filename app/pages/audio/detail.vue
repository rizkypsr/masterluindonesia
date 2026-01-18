<template>
  <div class="min-h-screen bg-gray-50 pb-40">
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
        <div class="bg-gray-200 rounded-2xl h-32 animate-pulse"></div>
      </div>

      <template v-else-if="audioData?.data">
        <!-- Audio Item - Selected (with Player & Show Teks) -->
        <div class="bg-[#c09637] rounded-2xl overflow-hidden" :style="{ fontSize: fontSize + 'px' }">
          <!-- Player Header -->
          <div class="px-4 py-3">
            <div class="flex items-center gap-3">
              <button @click="togglePlay" class="shrink-0">
                <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-6 h-6 text-black" />
              </button>
              <p class="font-medium text-black flex-1 line-clamp-1">{{ audioData.data.title?.trim() }}</p>
              <span class="text-black shrink-0">{{ audioData.data.duration }}</span>
            </div>
          </div>

          <!-- Show Teks Accordion -->
          <div class="bg-white mx-3 mb-3 rounded-xl overflow-hidden">
            <button 
              @click="showSubtitle = !showSubtitle" 
              class="w-full flex items-center justify-between px-4 py-3"
            >
              <span class="text-sm font-medium text-black">Show Teks</span>
              <Icon 
                :name="showSubtitle ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
                class="w-5 h-5 text-gray-600" 
              />
            </button>

            <!-- Subtitle Content -->
            <div v-if="showSubtitle" class="px-4 pb-4">
              <!-- Search Input -->
              <input 
                v-model="subtitleSearch"
                type="text" 
                placeholder="Masukan kata kunci"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:border-primary"
              />

              <!-- Subtitle List -->
              <div class="max-h-96 overflow-y-auto space-y-4">
                <div 
                  v-for="sub in filteredSubtitles" 
                  :key="sub.id"
                  class="border border-gray-200 rounded-lg p-4"
                  :style="{ fontSize: fontSize + 'px' }"
                >
                  <p class="font-semibold text-black mb-2">{{ sub.title }}</p>
                  <p class="text-gray-600 mb-2" v-html="sub.description"></p>
                  <div class="text-black mb-4" v-html="highlightText(sub.script)"></div>
                  
                  <!-- Action Buttons -->
                  <div class="flex items-center gap-6 pt-3 border-t border-gray-200">
                    <button @click="copySubtitle(sub)" class="flex items-center gap-1 text-sm text-gray-700">
                      <Icon name="mdi:content-copy" class="w-4 h-4" />
                      <span>Salin</span>
                    </button>
                    <button @click="speakSubtitle(sub)" class="flex items-center gap-1 text-sm" :class="speakingSubtitleId === sub.id ? 'text-primary' : 'text-gray-700'">
                      <Icon :name="speakingSubtitleId === sub.id ? 'mdi:stop' : 'mdi:account-voice'" class="w-4 h-4" />
                      <span>{{ speakingSubtitleId === sub.id ? 'Stop' : 'Voice' }}</span>
                    </button>
                  </div>
                </div>
                <p v-if="filteredSubtitles.length === 0" class="text-sm text-gray-500 text-center py-4">
                  Tidak ada teks ditemukan
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Floating Action Button -->
    <FabZoom 
      v-model:isOpen="showFabMenu" 
      :hasDrawer="!!audioData?.data"
      @zoomIn="zoomIn"
      @zoomOut="zoomOut"
    />

    <!-- Bottom Audio Player Drawer -->
    <div v-if="audioData?.data" class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm font-medium text-black flex-1 line-clamp-1">{{ audioData.data.title?.trim() }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="flex items-center gap-2 mb-3">
        <input type="range" :value="currentTime" :max="duration" @input="seek"
          class="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary" />
        <span class="text-xs text-gray-500 w-20 text-right">{{ formatTime(currentTime) }}/{{ formatTime(duration) }}</span>
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
import { ref, computed, onMounted } from "vue"

interface Subtitle {
  id: number
  title: string
  timestamp: number
  script: string
  script_wa: string
  description: string
  description_wa: string
}

interface AudioDetail {
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

const route = useRoute()
const audioId = computed(() => route.query.audio_id)
const subtitleId = computed(() => route.query.subtitle_id)
const pageTitle = computed(() => (route.query.title as string) || 'Audio Detail')

const { data: audioData, pending } = await useFetch<{ success: boolean; data: AudioDetail }>(
  () => `https://api.masterluindonesia.com/api/audio/detail?audio_id=${audioId.value}&audio_subtitle_id=${subtitleId.value}`
)

// Audio Player State
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Subtitle State
const showSubtitle = ref(false)
const subtitleSearch = ref('')

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(14) // base font size in px

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 10)
}

const filteredSubtitles = computed(() => {
  if (!audioData.value?.data?.subtitle) return []
  const subtitles = audioData.value.data.subtitle
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
const copySubtitle = async (sub: Subtitle) => {
  const text = stripHtml(sub.script)
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    console.error('Failed to copy:', err)
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

// Auto play when data loads
onMounted(() => {
  if (audioData.value?.data?.url && audioElement.value) {
    audioElement.value.src = audioData.value.data.url
  }
})

const togglePlay = () => {
  if (!audioElement.value) return
  if (!audioElement.value.src && audioData.value?.data?.url) {
    audioElement.value.src = audioData.value.data.url
  }
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
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
