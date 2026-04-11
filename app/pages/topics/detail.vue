<template>
    <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <div class="flex items-center gap-4 flex-1 min-w-0">
                <button @click="$router.back()"
                    class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded shrink-0">
                    <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
                </button>
                <h1 class="text-lg font-semibold text-black dark:text-white line-clamp-1">{{ pageTitle }}</h1>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <button @click="showInfoModal = true"
                    class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Icon name="mdi:information" class="w-6 h-6 text-primary dark:text-yellow-400" />
                </button>
                <button @click="addBookmark" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Icon :name="isTopic1Bookmarked ? 'mdi:star' : 'mdi:star-outline'"
                        :class="isTopic1Bookmarked ? 'text-yellow-500' : 'text-black dark:text-white'"
                        class="w-6 h-6" />
                </button>
                <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
                </button>
            </div>
        </div>

        <!-- Autoplay Toggle & Search -->
        <div class="px-4 py-4 shrink-0 space-y-3">
            <!-- Autoplay Toggle -->
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Autoplay</span>
                <button @click="autoplayEnabled = !autoplayEnabled"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    :class="autoplayEnabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="autoplayEnabled ? 'translate-x-6' : 'translate-x-1'"></span>
                </button>
            </div>

            <!-- Search -->
            <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3">
                <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Pencarian"
                    class="flex-1 bg-transparent text-black dark:text-white placeholder-gray-400 outline-none text-sm" />
            </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto">
            <!-- Loading State -->
            <div v-if="pending" class="px-4 space-y-4">
                <div v-for="i in 3" :key="i" class="animate-pulse">
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>

            <!-- Content List -->
            <div v-else class="px-4 space-y-4 pb-20">
                <div v-if="filteredContents.length === 0" class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
                </div>

                <div v-for="item in filteredContents" :key="item.id" class="rounded-xl overflow-hidden"
                    :class="expandedItems.has(item.id) ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'"
                    :style="{ fontSize: fontSize + 'px' }">
                    <!-- Card Header -->
                    <div class="p-3 cursor-pointer" @click="toggleExpand(item.id)">
                        <div class="flex items-center justify-between gap-3">
                            <h3 class="font-bold"
                                :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'"
                                :style="{ fontSize: fontSize + 'px' }">
                                {{ item.title }}
                            </h3>
                            <div class="flex items-center gap-1 shrink-0">
                                <button v-if="item.audio" @click.stop="playAudio(item)"
                                    class="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors flex justify-center items-center">
                                    <Icon
                                        :name="playingItemId === item.id && isPlaying ? 'mdi:pause-circle' : 'mdi:play-circle'"
                                        class="w-6 h-6"
                                        :class="expandedItems.has(item.id) ? 'text-black' : 'text-primary dark:text-yellow-400'" />
                                </button>
                                <button @click.stop="goToAudioDetail(item)" class="p-2 flex justify-center items-center">
                                    <Icon name="mdi:arrow-right" class="w-6 h-6"
                                        :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <p class="my-2"
                                :class="expandedItems.has(item.id) ? 'text-black' : 'text-gray-600 dark:text-gray-300'"
                                :style="{ fontSize: fontSize + 'px' }">
                                {{ item.description }}
                            </p>
                        </div>
                    </div>

                    <!-- Expandable Content -->
                    <div v-if="expandedItems.has(item.id)" class="mx-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div class="text-black dark:text-white leading-relaxed topic-content" v-html="item.script">
                        </div>
                        <div class="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                            <button @click.stop="copyContent(item)"
                                class="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:font-bold">
                                <Icon name="mdi:content-copy" class="w-4 h-4" />
                                <span>Salin</span>
                            </button>
                            <button @click.stop="speakContent(item)" class="flex items-center gap-1 hover:font-bold"
                                :class="speakingItemId === item.id ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
                                <Icon :name="speakingItemId === item.id ? 'mdi:stop' : 'mdi:account-voice'"
                                    class="w-4 h-4" />
                                <span>{{ speakingItemId === item.id ? 'Stop' : 'Voice' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAB - Fixed at bottom -->
        <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto pointer-events-none">
            <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-4 bottom-4 pointer-events-auto"
                @zoomIn="zoomIn" @zoomOut="zoomOut" @scrollTop="scrollToTop" />
        </div>

        <!-- Bookmark Modal - Lazy loaded -->
        <LazyBookmarkModal />

        <!-- Information Modal -->
        <UModal v-model:open="showInfoModal" title="Informasi Ensiklopedia">
            <template #body>
                <div v-if="isLoadingInfo" class="flex justify-center py-8">
                    <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
                </div>

                <div v-else-if="infoDescription" class="text-black dark:text-white">
                    <div class="text-base leading-relaxed" v-html="infoDescription"></div>
                </div>

                <div v-else class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">Tidak ada informasi tersedia</p>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBookmark } from '~/composables/useBookmark'
import { useCopySubtitle } from '~/composables/useCopySubtitle'

interface Audio {
    id: number
    audio_sub_group_id: number
    title: string
    url: string
    seq: number
    duration: string
    translate_id: number
    translate_ch: number
}

interface TopicContent {
    id: number
    audio_id: number
    title: string
    description: string
    description_wa?: string
    script: string
    script_wa?: string
    timestamp?: number
    audio?: Audio
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const subId = computed(() => route.query.subId as string)
const pageTitle = computed(() => (route.query.title as string) || 'Detail')

// Bookmark
const { createTopic1Bookmark, fetchBookmarksByType, isBookmarked } = useBookmark()
const isTopic1Bookmarked = ref(false)

// Copy functionality
const { copyToClipboard } = useCopySubtitle()

const searchQuery = ref('')
const expandedItems = ref<Set<number>>(new Set())
const speakingItemId = ref<number | null>(null)
const isSpeaking = ref(false)

// Audio player state
const currentAudio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const playingItemId = ref<number | null>(null)
const autoplayEnabled = ref(false)

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(18)

// Information modal state
const showInfoModal = ref(false)
const infoDescription = ref('')
const isLoadingInfo = ref(false)

// Fetch information when modal opens
const fetchInformation = async () => {
    if (infoDescription.value) return // Already fetched

    isLoadingInfo.value = true
    try {
        const response = await $fetch<{
            success: boolean
            message: string
            data: Array<{
                id: number
                description: string
                type: string
                created_at: string
                updated_at: string
            }>
        }>(`${config.public.apiBaseUrl}/information?type=topik1`)

        if (response.success && response.data.length > 0) {
            infoDescription.value = response.data[0].description
        }
    } catch (error) {
        console.error('Failed to fetch information:', error)
    } finally {
        isLoadingInfo.value = false
    }
}

// Watch for modal open to fetch information
watch(showInfoModal, (isOpen) => {
    if (isOpen) {
        fetchInformation()
    }
})

const zoomIn = () => {
    fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
    fontSize.value = Math.max(fontSize.value - 2, 10)
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const { data: response, pending } = await useFetch<{ success: boolean; data: TopicContent[] }>(
    () => `${config.public.apiBaseUrl}/topics/content/${subId.value}`
)

// Fetch bookmarks on mount
onMounted(async () => {
    await fetchBookmarksByType(4)
})

// Watch for bookmark status
watch(() => pageTitle.value, (title) => {
    if (title) {
        isTopic1Bookmarked.value = isBookmarked(4, title)
    }
}, { immediate: true })

const contents = computed(() => response.value?.data || [])

const filteredContents = computed(() => {
    if (!searchQuery.value.trim()) return contents.value
    const query = searchQuery.value.toLowerCase()
    return contents.value.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
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

const copyContent = async (item: TopicContent) => {
    await copyToClipboard({
        title: item.title,
        description: item.description_wa,
        full_detail: item.script_wa
    })
}

const speakContent = (item: TopicContent) => {
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

    const text = stripHtml(item.script)
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

const goToAudioDetail = (item: TopicContent) => {
    router.push({
        path: '/audio/detail',
        query: {
            audio_id: item.audio_id,
            subtitle_id: item.id
        }
    })
}

const shareContent = async () => {
    const shareData = {
        title: 'Ensiklopedia',
        text: pageTitle.value,
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
        await navigator.clipboard.writeText(`Lihat "${pageTitle.value}" di\n${window.location.href}`)
        alert('Link berhasil disalin!')
    }
}

const addBookmark = () => {
    createTopic1Bookmark(
        pageTitle.value || 'Ensiklopedia',
        Number(subId.value)
    )
}

const playAudio = (item: TopicContent) => {
    if (!item.audio) return

    // If already playing this audio, pause it
    if (playingItemId.value === item.id && currentAudio.value) {
        currentAudio.value.pause()
        isPlaying.value = false
        playingItemId.value = null
        return
    }

    // Stop any currently playing audio
    if (currentAudio.value) {
        currentAudio.value.pause()
        currentAudio.value = null
    }

    // Create and play new audio
    const audio = new Audio(item.audio.url)
    currentAudio.value = audio
    playingItemId.value = item.id
    isPlaying.value = true

    // Wait for audio to be loaded before setting currentTime
    audio.addEventListener('loadedmetadata', () => {
        // Set timestamp if available (already in seconds)
        if (item.timestamp && item.timestamp > 0) {
            audio.currentTime = item.timestamp
        }
    })

    audio.play().catch(error => {
        console.error('Failed to play audio:', error)
        isPlaying.value = false
        playingItemId.value = null
    })

    audio.onended = () => {
        isPlaying.value = false
        playingItemId.value = null

        // Autoplay next audio if enabled
        if (autoplayEnabled.value) {
            playNextAudio(item)
        }
    }

    audio.onerror = () => {
        isPlaying.value = false
        playingItemId.value = null
    }
}

const playNextAudio = (currentItem: TopicContent) => {
    const currentIndex = filteredContents.value.findIndex(item => item.id === currentItem.id)

    // Check if there's a next item
    if (currentIndex !== -1 && currentIndex < filteredContents.value.length - 1) {
        const nextItem = filteredContents.value[currentIndex + 1]

        // Only play if next item has audio
        if (nextItem.audio) {
            // Small delay before playing next
            setTimeout(() => {
                playAudio(nextItem)
            }, 500)
        }
    }
}
</script>

<style>
/* Dark mode: change text color to black for highlighted text, keep background colors */
.dark .topic-content span[style*="background-color"] {
    color: #000000 !important;
}
</style>
