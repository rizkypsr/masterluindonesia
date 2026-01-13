<template>
    <div class="min-h-screen bg-gray-50 pb-8">
        <!-- Header -->
        <div class="bg-white px-4 py-4 flex items-center gap-3 shadow-sm">
            <button @click="$router.back()" class="p-1">
                <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
            </button>
            <h1 class="text-lg font-semibold text-black flex-1 line-clamp-1">{{ pageTitle }}</h1>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="p-4 space-y-4">
            <div class="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div class="h-40 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <template v-else-if="videoData">
            <!-- YouTube Player -->
            <div class="aspect-video bg-black">
                <iframe :src="youtubeEmbedUrl" class="w-full h-full" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen />
            </div>

            <!-- Video Info -->
            <div class="px-4 py-4 bg-white">
                <div class="flex items-start justify-between">
                    <h2 class="text-lg font-semibold text-black flex-1">{{ videoData.title }}</h2>
                    <div class="flex items-center gap-3 shrink-0">
                        <button class="p-2">
                            <Icon name="mdi:star-outline" class="w-6 h-6 text-gray-600" />
                        </button>
                        <button class="p-2">
                            <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Subtitle Section -->
            <div v-if="videoData.subtitle?.length" class="bg-white mt-2">
                <button @click="showSubtitle = !showSubtitle"
                    class="w-full px-4 py-3 flex items-center justify-between">
                    <span class="font-semibold text-black">SUBTITLE</span>
                    <Icon :name="showSubtitle ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-6 h-6 text-gray-600" />
                </button>

                <div v-if="showSubtitle" class="px-4 pb-4">
                    <!-- Search -->
                    <div class="mb-4">
                        <input v-model="subtitleSearch" type="text" placeholder="Masukan kata kunci"
                            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm" />
                    </div>

                    <!-- Subtitle List -->
                    <div class="max-h-80 overflow-y-auto space-y-4">
                        <div v-for="sub in filteredSubtitles" :key="sub.timestamp" class="flex items-start gap-4">
                            <div class="text-center shrink-0">
                                <p class="text-sm text-gray-500">{{ formatTimestamp(sub.timestamp) }}</p>
                            </div>
                            <p class="flex-1 text-sm text-black">{{ sub.description_wa }}</p>
                            <div class="flex items-center gap-2 shrink-0">
                                <button class="p-1">
                                    <Icon name="mdi:content-copy" class="w-5 h-5 text-gray-400" />
                                </button>
                                <button class="p-1">
                                    <Icon name="mdi:account-voice" class="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sub Videos by Group -->
            <div v-if="videoData.sub_video?.length" class="mt-2 space-y-4">
                <div v-for="group in videoData.sub_video" :key="group.group_sub_video_id" class="bg-white py-4">
                    <h3 class="px-4 font-semibold text-black mb-3">{{ group.group_sub_video_name }}</h3>

                    <!-- Horizontal Carousel -->
                    <UCarousel 
                        v-slot="{ item }"
                        :items="group.child" 
                        :ui="{ 
                            item: 'basis-full',
                            dot: 'bg-secondary'
                        }"
                        dots
                        class="px-4"
                    >
                        <NuxtLink 
                            :to="{ path: `/video/play/${item.id}`, query: { title: item.title } }"
                            class="flex items-center gap-4 pr-4">
                            <img :src="getYoutubeThumbnail(item.url)" :alt="item.title"
                                class="w-36 h-24 object-cover rounded-lg bg-gray-200 shrink-0" />
                            <p class="text-sm font-semibold text-black line-clamp-3">{{ item.title }}</p>
                        </NuxtLink>
                    </UCarousel>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

interface Subtitle {
    timestamp: number
    description_wa: string
    description: string
}

interface SubVideo {
    id: number
    parent_id: number
    title: string
    synopsis: string
    url: string
    url_audio: string | null
    order: number
    city: string | null
    date: string | null
}

interface SubVideoGroup {
    group_sub_video_id: number
    group_sub_video_name: string
    child: SubVideo[]
}

interface VideoDetail {
    id: number
    parent_id: number | null
    video_category_id: number
    location_id: number | null
    city: string | null
    title: string
    synopsis: string
    url: string
    url_audio: string
    order: number | null
    date: string | null
    subtitle: Subtitle[]
    sub_video: SubVideoGroup[]
}

const route = useRoute()
const videoId = computed(() => route.params.id)
const pageTitle = computed(() => (route.query.title as string) || 'Video')

const showSubtitle = ref(false)
const subtitleSearch = ref("")

const { data: response, pending } = await useFetch<{ success: boolean; data: VideoDetail }>(
    () => `https://api.masterluindonesia.com/api/video?video_category_id=${videoId.value}`
)

const videoData = computed(() => response.value?.data)

const youtubeEmbedUrl = computed(() => {
    if (!videoData.value?.url) return ''
    const videoId = extractYoutubeId(videoData.value.url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
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

const getYoutubeThumbnail = (url: string): string => {
    const videoId = extractYoutubeId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '/fallback.svg'
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
