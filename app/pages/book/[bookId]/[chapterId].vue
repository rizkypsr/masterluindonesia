<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const bookId = route.params.bookId as string
const chapterId = route.params.chapterId as string

interface BookDetail {
    id: number
    book_category_id: number
    url: string
    url_pdf: string | null
    synopsis: string | null
    title: string
    seq: number
    date: string | null
}

interface BookContent {
    id: number
    book_chapters_id: number
    content: string
    content_wa: string
    page: number
    bookaudio: any[]
}

interface ContentResponse {
    success: boolean
    message: string
    data: BookContent[]
}

const isMenuOpen = ref(false)
const currentPageIndex = ref(0)
const isToolsExpanded = ref(false)
const contents = ref<BookContent[]>([])
const isLoadingContents = ref(true)
const contentRef = ref<HTMLElement | null>(null)
const isPageModalOpen = ref(false)
const selectedPage = ref(1)

// Search state
const isSearchMode = ref(false)
const searchQuery = ref('')
const searchResults = ref<{ pageIndex: number; snippet: string; highlightedSnippet: string }[]>([])
const highlightTerm = ref('')

interface SearchResult {
    pageIndex: number
    snippet: string
    highlightedSnippet: string
}

// Fetch book detail
const { data: bookDetail } = await useFetch<BookDetail>(
    `https://api.masterluindonesia.com/api/books/detail/${bookId}`
)

// Fetch book contents
onMounted(async () => {
    try {
        const response = await $fetch<ContentResponse>(
            `https://api.masterluindonesia.com/api/books/contents/${chapterId}`
        )
        contents.value = response.data || []
    } catch (e) {
        console.error('Failed to load contents', e)
    } finally {
        isLoadingContents.value = false
    }
})

// Total pages = 1 (book detail) + contents length
const totalPages = computed(() => 1 + contents.value.length)

// Current content (only for page > 0, since page 0 is book detail)
const currentContent = computed(() => {
    if (currentPageIndex.value === 0) return null
    return contents.value[currentPageIndex.value - 1]
})

// Generate page options for select
const pageOptions = computed(() => {
    return Array.from({ length: totalPages.value }, (_, i) => ({
        label: `Halaman ${i + 1}`,
        value: i + 1
    }))
})

// Highlighted content for display
const highlightedContent = computed(() => {
    if (!currentContent.value) return ''
    const text = stripHtml(currentContent.value.content)
    if (!highlightTerm.value) return text
    
    const regex = new RegExp(`(${escapeRegex(highlightTerm.value)})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>')
})

// Highlighted title for display
const highlightedTitle = computed(() => {
    if (!bookDetail.value?.title) return ''
    if (!highlightTerm.value) return bookDetail.value.title
    
    const regex = new RegExp(`(${escapeRegex(highlightTerm.value)})`, 'gi')
    return bookDetail.value.title.replace(regex, '<mark class="bg-yellow-300">$1</mark>')
})

function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function stripHtml(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()
}

function goBack() {
    router.back()
}

function nextPage() {
    if (currentPageIndex.value < totalPages.value - 1) {
        currentPageIndex.value++
        scrollToTop()
    }
}

function prevPage() {
    if (currentPageIndex.value > 0) {
        currentPageIndex.value--
        scrollToTop()
    }
}

function toggleTools() {
    isToolsExpanded.value = !isToolsExpanded.value
}

function zoomIn() {
    // TODO: Implement zoom in
}

function zoomOut() {
    // TODO: Implement zoom out
}

function scrollToTop() {
    contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function shareContent() {
    if (navigator.share) {
        const text = currentPageIndex.value === 0
            ? bookDetail.value?.title
            : currentContent.value?.content_wa
        navigator.share({
            title: bookDetail.value?.title,
            text: text || '',
        })
    }
}

function addBookmark() {
    // TODO: Implement bookmark
}

function goToPage() {
    selectedPage.value = currentPageIndex.value + 1
    isPageModalOpen.value = true
}

function confirmGoToPage() {
    currentPageIndex.value = selectedPage.value - 1
    isPageModalOpen.value = false
    scrollToTop()
}

function openSearch() {
    isSearchMode.value = true
    isMenuOpen.value = false
    searchQuery.value = ''
    searchResults.value = []
}

function closeSearch() {
    isSearchMode.value = false
    searchQuery.value = ''
    searchResults.value = []
}

function clearHighlight() {
    highlightTerm.value = ''
}

function performSearch() {
    if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
    }

    const query = searchQuery.value.toLowerCase()
    const results: SearchResult[] = []

    // Search in book title (page 0)
    if (bookDetail.value?.title.toLowerCase().includes(query)) {
        const title = bookDetail.value.title
        const idx = title.toLowerCase().indexOf(query)
        const snippet = title
        const highlightedSnippet = title.substring(0, idx) + 
            '<mark class="bg-yellow-300">' + title.substring(idx, idx + query.length) + '</mark>' + 
            title.substring(idx + query.length)
        results.push({ pageIndex: 0, snippet, highlightedSnippet })
    }

    // Search in contents (page 1+)
    contents.value.forEach((content, index) => {
        const text = stripHtml(content.content).toLowerCase()
        if (text.includes(query)) {
            const originalText = stripHtml(content.content)
            const idx = text.indexOf(query)
            
            // Get snippet around the match (100 chars before and after)
            const start = Math.max(0, idx - 50)
            const end = Math.min(originalText.length, idx + query.length + 100)
            let snippet = originalText.substring(start, end)
            if (start > 0) snippet = '...' + snippet
            if (end < originalText.length) snippet = snippet + '...'
            
            // Create highlighted version
            const snippetLower = snippet.toLowerCase()
            const matchIdx = snippetLower.indexOf(query)
            const highlightedSnippet = snippet.substring(0, matchIdx) + 
                '<mark class="bg-yellow-300">' + snippet.substring(matchIdx, matchIdx + query.length) + '</mark>' + 
                snippet.substring(matchIdx + query.length)
            
            results.push({ pageIndex: index + 1, snippet, highlightedSnippet })
        }
    })

    searchResults.value = results
}

function goToSearchResult(pageIndex: number) {
    highlightTerm.value = searchQuery.value
    currentPageIndex.value = pageIndex
    isSearchMode.value = false
    searchQuery.value = ''
    searchResults.value = []
    scrollToTop()
}
</script>

<template>
    <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
        <!-- Header - Normal Mode -->
        <div v-if="!isSearchMode" class="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
            <div class="flex items-center gap-3">
                <BackButton />
                <h1 class="text-lg font-semibold text-black dark:text-white truncate max-w-[200px]">
                    {{ bookDetail?.title }}
                </h1>
            </div>
            <div class="relative">
                <button @click="isMenuOpen = !isMenuOpen" class="p-2">
                    <Icon name="mdi:dots-vertical" class="w-6 h-6 text-black dark:text-white" />
                </button>

                <!-- Dropdown Menu -->
                <div v-if="isMenuOpen"
                    class="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 py-2">
                    <button class="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="openSearch()">
                        <Icon name="mdi:magnify" class="w-5 h-5 shrink-0 text-black dark:text-white" />
                        <span class="text-black dark:text-white whitespace-nowrap">Pencarian</span>
                    </button>
                    <button class="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="addBookmark(); isMenuOpen = false">
                        <Icon name="mdi:star-outline" class="w-5 h-5 shrink-0 text-black dark:text-white" />
                        <span class="text-black dark:text-white whitespace-nowrap">Bookmark</span>
                    </button>
                    <button class="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="goToPage(); isMenuOpen = false">
                        <Icon name="mdi:book-open-page-variant" class="w-5 h-5 shrink-0 text-black dark:text-white" />
                        <span class="text-black dark:text-white whitespace-nowrap">Pergi ke halaman</span>
                    </button>
                    <button class="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="shareContent(); isMenuOpen = false">
                        <Icon name="mdi:share-variant" class="w-5 h-5 shrink-0 text-black dark:text-white" />
                        <span class="text-black dark:text-white whitespace-nowrap">Share</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Header - Search Mode -->
        <div v-else class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
            <button @click="closeSearch" class="p-1">
                <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
            </button>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari..."
                class="flex-1 text-black dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary focus:outline-none py-1"
                @keyup.enter="performSearch"
                autofocus
            />
            <button @click="isMenuOpen = !isMenuOpen" class="p-2">
                <Icon name="mdi:dots-vertical" class="w-6 h-6 text-black dark:text-white" />
            </button>
        </div>

        <!-- Search Results -->
        <div v-if="isSearchMode" ref="contentRef" class="flex-1 overflow-y-auto">
            <div v-if="searchResults.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
                <button
                    v-for="(result, index) in searchResults"
                    :key="index"
                    class="w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                    @click="goToSearchResult(result.pageIndex)"
                >
                    <p class="text-black dark:text-white text-sm leading-relaxed" v-html="result.highlightedSnippet"></p>
                    <p class="text-gray-500 text-xs mt-2 text-right">Halaman {{ result.pageIndex + 1 }}</p>
                </button>
            </div>
            <div v-else-if="searchQuery && searchResults.length === 0" class="flex justify-center py-8">
                <p class="text-gray-500">Tidak ada hasil ditemukan</p>
            </div>
        </div>

        <!-- Content Area (scrollable) - Normal Mode -->
        <div v-else ref="contentRef" class="flex-1 overflow-y-auto px-4 py-6">
            <!-- Page 1: Book Detail (Cover + Title) -->
            <template v-if="currentPageIndex === 0">
                <div v-if="bookDetail?.url" class="flex justify-center mb-6">
                    <img :src="bookDetail.url" :alt="bookDetail.title" class="max-w-full h-auto rounded-lg shadow-md" />
                </div>
                <h2 class="text-xl font-bold text-black dark:text-white mb-6" v-html="highlightedTitle"></h2>
            </template>

            <!-- Page 2+: Content Pages -->
            <template v-else>
                <div v-if="currentContent" class="prose prose-sm max-w-none">
                    <p class="text-black dark:text-white leading-relaxed whitespace-pre-line" v-html="highlightedContent"></p>
                </div>
                <div v-else-if="isLoadingContents" class="flex justify-center py-8">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
                </div>
            </template>

            <!-- Clear highlight button -->
            <div v-if="highlightTerm" class="fixed bottom-24 left-4 z-10">
                <button @click="clearHighlight" class="px-3 py-2 bg-yellow-300 rounded-full shadow-lg flex items-center gap-2">
                    <span class="text-black text-sm">{{ highlightTerm }}</span>
                    <Icon name="mdi:close" class="w-4 h-4 text-black" />
                </button>
            </div>
        </div>

        <!-- Floating Tools Button -->
        <div class="fixed bottom-20 right-4 z-10">
            <div v-if="isToolsExpanded" class="flex items-center gap-2 mb-2 bg-white rounded-full shadow-lg p-1">
                <button @click="zoomIn" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon name="mdi:magnify-plus" class="w-5 h-5 text-gray-700" />
                </button>
                <button @click="zoomOut" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon name="mdi:magnify-minus" class="w-5 h-5 text-gray-700" />
                </button>
                <button @click="scrollToTop"
                    class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon name="mdi:arrow-up" class="w-5 h-5 text-gray-700" />
                </button>
                <button @click="toggleTools" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="mdi:close" class="w-5 h-5 text-black" />
                </button>
            </div>
            <button v-else @click="toggleTools"
                class="w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center">
                <Icon name="mdi:menu" class="w-6 h-6 text-black" />
            </button>
        </div>

        <!-- Bottom Navigation -->
        <div class="border-t border-gray-200 bg-white dark:bg-gray-900 px-4 py-3 shrink-0">
            <div class="flex items-center justify-between">
                <button @click="prevPage" :disabled="currentPageIndex === 0" class="p-2 disabled:opacity-30">
                    <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
                </button>

                <span class="text-black dark:text-white">
                    {{ currentPageIndex + 1 }}/{{ totalPages }}
                </span>

                <button @click="nextPage" :disabled="currentPageIndex >= totalPages - 1"
                    class="p-2 disabled:opacity-30">
                    <Icon name="mdi:arrow-right" class="w-6 h-6 text-black dark:text-white" />
                </button>
            </div>
        </div>

        <!-- Go to Page Modal -->
        <UModal v-model:open="isPageModalOpen">
            <template #content>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-black dark:text-white mb-4">Pergi ke Halaman</h3>
                    
                    <USelect
                        v-model="selectedPage"
                        :items="pageOptions"
                        placeholder="Pilih halaman"
                        class="w-full mb-4"
                    />
                    
                    <div class="flex gap-3 justify-end">
                        <UButton variant="outline" @click="isPageModalOpen = false">
                            Batal
                        </UButton>
                        <UButton class="bg-primary hover:bg-primary/90 text-black" @click="confirmGoToPage">
                            Pergi
                        </UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>
