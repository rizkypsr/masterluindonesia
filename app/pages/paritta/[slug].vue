<script setup lang="ts">
import parittaData from '~/assets/json/paritta.json'

interface Paritta {
    title: string
    href: string
    englishTitle: string
    chineseTitle: string
    pinyinTitle: string
    pinyinTitleAlt: string
    audioFile: string
    dharani: {
        chinese: string
        pinyin: string
        pinyinAlt: string
    }
}

const route = useRoute()
const slug = route.params.slug as string

const paritta = computed(() => {
    return (parittaData as Paritta[]).find(p => p.href === `/paritta/${slug}`)
})

// Audio state
const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)
const reciteCount = ref(0)
const isPlayerExpanded = ref(true)

// Font size state
const fontSize = ref(16)
const minFontSize = 12
const maxFontSize = 32

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

const audioUrl = computed(() => {
    if (!paritta.value) return ''
    // Find the index of this paritta in the array (1-based for audio file naming)
    const index = (parittaData as Paritta[]).findIndex(p => p.href === `/paritta/${slug}`)
    if (index === -1) return ''
    // Audio files are named audio1.mp3, audio2.mp3, etc.
    return `https://masterluindonesia.com/assets/assets/images/paritta/audio${index + 1}.mp3`
})

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function togglePlay() {
    if (!audioRef.value) return
    if (isPlaying.value) {
        audioRef.value.pause()
    } else {
        audioRef.value.play()
    }
}

function onTimeUpdate() {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime
    }
}

function onLoadedMetadata() {
    if (audioRef.value) {
        duration.value = audioRef.value.duration
    }
}

function onPlay() {
    isPlaying.value = true
}

function onPause() {
    isPlaying.value = false
}

function onEnded() {
    isPlaying.value = false
    reciteCount.value++
}

function seekTo(event: Event) {
    const input = event.target as HTMLInputElement
    if (audioRef.value) {
        audioRef.value.currentTime = parseFloat(input.value)
    }
}

function skipBackward() {
    if (audioRef.value) {
        audioRef.value.currentTime = Math.max(0, audioRef.value.currentTime - 10)
    }
}

function skipForward() {
    if (audioRef.value) {
        audioRef.value.currentTime = Math.min(duration.value, audioRef.value.currentTime + 10)
    }
}

function cyclePlaybackRate() {
    const currentIndex = playbackRates.indexOf(playbackRate.value)
    const nextIndex = (currentIndex + 1) % playbackRates.length
    playbackRate.value = playbackRates[nextIndex] ?? 1
    if (audioRef.value) {
        audioRef.value.playbackRate = playbackRate.value
    }
}

function decreasePlaybackRate() {
    if (playbackRate.value > 0.5) {
        playbackRate.value = Math.round((playbackRate.value - 0.1) * 10) / 10
        if (audioRef.value) {
            audioRef.value.playbackRate = playbackRate.value
        }
    }
}

function increasePlaybackRate() {
    if (playbackRate.value < 2) {
        playbackRate.value = Math.round((playbackRate.value + 0.1) * 10) / 10
        if (audioRef.value) {
            audioRef.value.playbackRate = playbackRate.value
        }
    }
}

function incrementCount() {
    reciteCount.value++
}

function decrementCount() {
    if (reciteCount.value > 0) {
        reciteCount.value--
    }
}

function resetCount() {
    reciteCount.value = 0
}

function zoomIn() {
    if (fontSize.value < maxFontSize) {
        fontSize.value += 2
    }
}

function zoomOut() {
    if (fontSize.value > minFontSize) {
        fontSize.value -= 2
    }
}

function resetZoom() {
    fontSize.value = 16
}

function togglePlayerExpanded() {
    isPlayerExpanded.value = !isPlayerExpanded.value
}
</script>

<template>
    <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
            <div class="flex items-center gap-3">
                <BackButton />
                <h1 class="text-lg font-semibold text-black dark:text-white truncate max-w-[200px]">
                    {{ paritta?.title }}
                </h1>
            </div>
            <div class="flex items-center gap-2">
                <button class="p-2" @click="zoomIn">
                    <Icon name="mdi:magnify-plus-outline" class="w-6 h-6 text-black dark:text-white" />
                </button>
                <button class="p-2" @click="zoomOut">
                    <Icon name="mdi:magnify-minus-outline" class="w-6 h-6 text-black dark:text-white" />
                </button>
                <button class="p-2" @click="resetZoom">
                    <Icon name="mdi:refresh" class="w-6 h-6 text-black dark:text-white" />
                </button>
            </div>
        </div>

        <!-- Content Area -->
        <div v-if="paritta" class="flex-1 overflow-y-auto px-4 py-6" :style="{ fontSize: fontSize + 'px' }">
            <!-- Chinese Title -->
            <h2 class="font-bold text-black dark:text-white mb-2 text-center" style="font-size: 1.25em;">
                {{ paritta.chineseTitle }}
            </h2>

            <!-- English Title -->
            <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
                {{ paritta.englishTitle }}
            </p>

            <!-- Dharani Content -->
            <div class="space-y-6">
                <!-- Chinese -->
                <div>
                    <h3 class="font-semibold text-black dark:text-white mb-2">漢字 (Chinese)</h3>
                    <p class="text-black dark:text-white leading-relaxed text-lg">
                        {{ paritta.dharani.chinese }}
                    </p>
                </div>

                <!-- Pinyin -->
                <div>
                    <h3 class="font-semibold text-black dark:text-white mb-2">拼音 (Pinyin)</h3>
                    <p class="text-black dark:text-white leading-relaxed">
                        {{ paritta.dharani.pinyin }}
                    </p>
                </div>

                <!-- Alternative Pinyin -->
                <div>
                    <h3 class="font-semibold text-black dark:text-white mb-2">Alternative Pinyin</h3>
                    <p class="text-black dark:text-white leading-relaxed">
                        {{ paritta.dharani.pinyinAlt }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Audio Player -->
        <div class="bg-amber-100 dark:bg-amber-900 shrink-0">
            <!-- Collapse/Expand Button -->
            <button class="w-full flex justify-center py-1" @click="togglePlayerExpanded">
                <Icon :name="isPlayerExpanded ? 'mdi:minus' : 'mdi:chevron-up'"
                    class="w-6 h-6 text-black dark:text-white" />
            </button>

            <div v-if="isPlayerExpanded" class="px-4 pb-4">
                <!-- Title -->
                <p class="font-semibold text-black dark:text-white mb-2">{{ paritta?.title }}</p>

                <!-- Progress Bar -->
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-sm text-black dark:text-white w-12">{{ formatTime(currentTime) }}</span>
                    <input type="range" :value="currentTime" :max="duration || 100"
                        class="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary"
                        @input="seekTo" />
                    <span class="text-sm text-black dark:text-white w-12 text-right">{{ formatTime(duration) }}</span>
                </div>

                <!-- Playback Rate -->
                <div class="flex justify-center mb-3">
                    <button class="px-3 py-1 text-sm text-black dark:text-white" @click="cyclePlaybackRate">
                        {{ playbackRate }}x
                    </button>
                </div>

                <!-- Controls -->
                <div class="flex items-center justify-center gap-4 mb-4">
                    <button class="p-2" @click="decreasePlaybackRate">
                        <Icon name="mdi:minus-circle-outline" class="w-8 h-8 text-black dark:text-white" />
                    </button>
                    <button class="p-2" @click="skipBackward">
                        <Icon name="mdi:rewind" class="w-8 h-8 text-black dark:text-white" />
                    </button>
                    <button class="w-14 h-14 rounded-full bg-primary flex items-center justify-center"
                        @click="togglePlay">
                        <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-8 h-8 text-black" />
                    </button>
                    <button class="p-2" @click="skipForward">
                        <Icon name="mdi:fast-forward" class="w-8 h-8 text-black dark:text-white" />
                    </button>
                    <button class="p-2" @click="increasePlaybackRate">
                        <Icon name="mdi:plus-circle-outline" class="w-8 h-8 text-black dark:text-white" />
                    </button>
                </div>

                <!-- Counter -->
                <div class="flex items-center justify-center gap-4">
                    <button class="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
                        @click="decrementCount">
                        <Icon name="mdi:minus" class="w-6 h-6 text-black dark:text-white" />
                    </button>
                    <span class="text-2xl font-bold text-black dark:text-white w-16 text-center">
                        {{ reciteCount }}
                    </span>
                    <button class="w-12 h-12 rounded-lg bg-primary flex items-center justify-center"
                        @click="incrementCount">
                        <Icon name="mdi:plus" class="w-6 h-6 text-black" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Hidden Audio Element -->
        <audio ref="audioRef" :src="audioUrl" preload="metadata" @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata" @play="onPlay" @pause="onPause" @ended="onEnded" />
    </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #f59e0b;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #f59e0b;
    cursor: pointer;
    border: none;
}
</style>
