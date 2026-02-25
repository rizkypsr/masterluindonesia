<template>
    <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
        <!-- Header -->
        <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <button @click="$router.back()"
                class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
                <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
            </button>
            <h1 class="text-lg font-semibold text-black dark:text-white line-clamp-1">{{ pageTitle }}</h1>
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
                    :class="expandedItems.has(item.id) ? 'bg-[#c09637] dark:bg-yellow-600' : 'bg-white dark:bg-gray-800'">
                    <!-- Card Header -->
                    <div class="p-3 cursor-pointer" @click="toggleExpand(item.id)">
                        <div class="flex items-start justify-between gap-3">
                            <div class="flex-1">
                                <h3 class="font-bold text-xl"
                                    :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'">
                                    {{ item.title }}
                                </h3>
                                <p class="mt-1 text-lg"
                                    :class="expandedItems.has(item.id) ? 'text-black' : 'text-gray-600 dark:text-gray-300'">
                                    {{ item.description }}
                                </p>
                            </div>
                            <button @click.stop="goToAudioDetail(item)" class="p-2 shrink-0">
                                <Icon name="mdi:arrow-right" class="w-6 h-6"
                                    :class="expandedItems.has(item.id) ? 'text-black' : 'text-black dark:text-white'" />
                            </button>
                        </div>
                    </div>

                    <!-- Expandable Content -->
                    <div v-if="expandedItems.has(item.id)" class="mx-4 mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                        <div class="text-black dark:text-white leading-relaxed" v-html="item.script"></div>
                        <div class="flex items-center gap-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                            <button @click.stop="copyContent(item)"
                                class="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 hover:font-bold">
                                <Icon name="mdi:content-copy" class="w-4 h-4" />
                                <span>Salin</span>
                            </button>
                        </div>
                    </div>
                </div>
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
import { ref, computed } from 'vue'

interface TopicContent {
    id: number
    audio_id: number
    title: string
    description: string
    script: string
}

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const subId = computed(() => route.query.subId as string)
const pageTitle = computed(() => (route.query.title as string) || 'Detail')

const searchQuery = ref('')
const expandedItems = ref<Set<number>>(new Set())

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(14)

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
    const text = `${item.title}\n${item.description}\n\n${stripHtml(item.script)}`
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
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
</script>
