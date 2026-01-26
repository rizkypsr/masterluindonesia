<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
        <!-- Header -->
        <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm">
            <BackButton />
            <h1 class="text-lg font-semibold text-black dark:text-white flex-1 line-clamp-1">{{ pageTitle }}</h1>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="p-4 space-y-4">
            <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
            <div class="h-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <template v-else-if="videoData">
            <!-- YouTube Player -->
            <div class="aspect-video bg-black">
                <div id="youtube-player"></div>
            </div>

            <!-- Video Info -->
            <div class="px-4 py-4 bg-white dark:bg-gray-800">
                <div class="flex items-start justify-between">
                    <h2 class="font-semibold text-black dark:text-white flex-1" :style="{ fontSize: fontSize + 'px' }">{{ videoData.title }}</h2>
                    <div class="flex items-center gap-3 shrink-0">
                        <button class="p-2" @click="addToBookmark">
                            <Icon :name="isVideoBookmarked ? 'mdi:star' : 'mdi:star-outline'" 
                                  :class="isVideoBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'"
                                  class="w-6 h-6" />
                        </button>
                        <button class="p-2" @click="shareContent">
                            <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Subtitle Section -->
            <div v-if="videoData.subtitle?.length" class="bg-white dark:bg-gray-800 mt-2">
                <button @click="showSubtitle = !showSubtitle"
                    class="w-full px-4 py-3 flex items-center justify-between">
                    <span class="font-semibold text-black dark:text-white">SUBTITLE</span>
                    <Icon :name="showSubtitle ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>

                <div v-if="showSubtitle" class="px-4 pb-4">
                    <!-- Search -->
                    <div class="mb-4">
                        <input v-model="subtitleSearch" type="text" placeholder="Masukan kata kunci"
                            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
                    </div>

                    <!-- Subtitle List -->
                    <div class="max-h-80 overflow-y-auto space-y-4">
                        <div v-for="sub in filteredSubtitles" :key="sub.timestamp" :style="{ fontSize: fontSize + 'px' }">
                            <div class="flex items-center mb-2">
                                <div class="flex-1"></div>
                                <p class="text-black dark:text-gray-400 cursor-pointer hover:text-primary dark:hover:text-yellow-400" @click="seekToTimestamp(sub.timestamp)">{{ formatTimestamp(sub.timestamp) }}</p>
                                <div class="flex-1 flex justify-end gap-2">
                                    <button @click="copyToClipboard(sub.description_wa)" class="p-1">
                                        <Icon name="mdi:content-copy" class="w-5 h-5 text-black dark:text-gray-500" />
                                    </button>
                                    <button @click="speakText(sub.description_wa)" class="p-1">
                                        <Icon name="mdi:account-voice" class="w-5 h-5 text-black dark:text-gray-500" />
                                    </button>
                                </div>
                            </div>
                            <p class="text-black dark:text-white" v-html="sub.description"></p>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Bottom Section with FAB -->
        <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <FabZoom 
                v-model:isOpen="showFabMenu"
                class="absolute right-0 bottom-full z-10"
                @zoomIn="zoomIn" 
                @zoomOut="zoomOut"
                @scrollTop="scrollToTop"
            />
        </div>

        <!-- Bookmark Modal -->
        <BookmarkModal />
    </div>
</template>

<script setup lang="ts">
import { useBookmark } from '~/composables/useBookmark'
import { useHistory } from '~/composables/useHistory'
import { ref, computed, onMounted, watch } from "vue"

interface Subtitle {
    timestamp: number
    description_wa: string
    description: string
}

interface SubVideoDetail {
    id: number
    parent_id: number | null
    video_category_id: number | null
    location_id: number | null
    city: string | null
    title: string
    synopsis: string
    url: string
    url_audio: string | null
    order: number | null
    date: string | null
    subtitle: Subtitle[]
    sub_video: []
}

const route = useRoute()
const videoId = computed(() => route.params.id)
const pageTitle = computed(() => (route.query.title as string) || 'Video')

const showSubtitle = ref(false)
const subtitleSearch = ref("")

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(16)

const zoomIn = () => {
    fontSize.value = Math.min(fontSize.value + 2, 28)
}

const zoomOut = () => {
    fontSize.value = Math.max(fontSize.value - 2, 12)
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { data: response, pending } = await useFetch<{ success: boolean; data: SubVideoDetail }>(
    () => `https://api.masterluindonesia.com/api/video?videoId=${videoId.value}`
)

const videoData = computed(() => response.value?.data)

// YouTube Player
const player = ref<any>(null)

const initYouTubePlayer = () => {
    if (!videoData.value?.url) return
    const videoIdYT = extractYoutubeId(videoData.value.url)
    if (!videoIdYT) return

    // Load YouTube IFrame API
    if (!(window as any).YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
        
        ;(window as any).onYouTubeIframeAPIReady = () => {
            createPlayer(videoIdYT)
        }
    } else {
        createPlayer(videoIdYT)
    }
}

const createPlayer = (videoIdYT: string) => {
    player.value = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoIdYT,
        playerVars: {
            playsinline: 1
        }
    })
}

const seekToTimestamp = (seconds: number) => {
    if (player.value?.seekTo) {
        player.value.seekTo(seconds, true)
        player.value.playVideo()
    }
}

onMounted(() => {
    initYouTubePlayer()
})

watch(videoData, () => {
    if (videoData.value?.url && !player.value) {
        initYouTubePlayer()
    }
})

const filteredSubtitles = computed(() => {
    if (!videoData.value?.subtitle) return []
    if (!subtitleSearch.value.trim()) return videoData.value.subtitle
    const query = subtitleSearch.value.toLowerCase()
    return videoData.value.subtitle.filter(sub =>
        sub.description_wa.toLowerCase().includes(query)
    )
})

const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)
    return match?.[1] ?? null
}

const formatTimestamp = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const toast = useToast()

const copyToClipboard = async (text: string) => {
    try {
        const formattedText = text.replace(/\\n/g, '\n')
        await navigator.clipboard.writeText(formattedText)
        toast.add({
            title: 'Berhasil disalin',
            color: 'success'
        })
    } catch (err) {
        toast.add({
            title: 'Gagal menyalin',
            color: 'error'
        })
    }
}

const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'id-ID'
        window.speechSynthesis.speak(utterance)
    }
}

// Bookmark
const { createVideoBookmark, fetchBookmarksByType, isBookmarked } = useBookmark()

// History
const { saveVideoHistory } = useHistory()

const isVideoBookmarked = computed(() => {
    if (!videoData.value) return false
    return isBookmarked(1, videoData.value.title)
})

onMounted(async () => {
    await fetchBookmarksByType(1)
    
    // Save to history (fire and forget)
    if (videoData.value) {
        saveVideoHistory(
            videoData.value.title,
            videoData.value.id,
            null,
            'CN'
        )
    }
})

const addToBookmark = () => {
    if (!videoData.value) return
    createVideoBookmark(
        videoData.value.title,
        Number(videoId.value),
        'ID'
    )
}

const shareContent = () => {
    if (!videoData.value) return
    
    const title = videoData.value.title
    const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(title)}`

    if (navigator.share) {
        navigator.share({
            title: title,
            text: title,
            url: shareUrl
        })
    } else {
        const shareText = `${title}\n${shareUrl}`
        navigator.clipboard.writeText(shareText)
    }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
}
</style>
