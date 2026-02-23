<template>
  <ClientOnly>
    <template #fallback>
      <div class="py-6 flex items-center justify-center min-h-[400px]">
        <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-primary dark:text-yellow-500" />
      </div>
    </template>
    <div v-if="isLoading" class="py-6 flex items-center justify-center min-h-[400px]">
      <Icon name="svg-spinners:ring-resize" class="w-12 h-12 text-primary dark:text-yellow-500" />
    </div>
    <div v-else class="py-6">
    <!-- Carousel -->
    <UCarousel v-if="media.length > 0" :items="media" :ui="{ item: 'basis-[80%]' }" :autoplay="{ delay: 3000 }"
      loop class="overflow-hidden">
      <template #default="slotProps">
        <NuxtImg v-if="slotProps?.item" :src="getImageUrl(slotProps.item.url)" :alt="slotProps.item.name"
          class="w-full h-40 object-cover rounded-xl" loading="eager" fetchpriority="high" 
          width="600" height="160" />
      </template>
    </UCarousel>

    <!-- Agenda Section -->
    <div v-if="isAgendaMenuEnabled" class="mt-4 px-4">
      <h2 class="text-lg font-semibold text-black dark:text-white mb-4">Agenda Hari Ini</h2>

      <!-- Date Selector -->
      <div ref="dateContainer" class="flex gap-2 overflow-x-scroll scrollbar-hide pb-2 px-[calc(50%-28px)]"
        style="scroll-snap-type: x proximity;" @scroll="onDateScroll">
        <button v-for="(date, index) in dateRange" :key="date.full" :ref="el => (dateRefs[index] = el as HTMLElement)"
          @click="selectDate(date.full, index)"
          class="flex flex-col items-center justify-center min-w-14 py-2 px-3 rounded-lg transition-colors shrink-0"
          style="scroll-snap-align: center;"
          :class="selectedDate === date.full ? 'bg-primary dark:bg-yellow-500 text-black font-bold' : 'bg-secondary/50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'">
          <span class="text-lg font-semibold">{{ date.day }}</span>
          <span class="text-xs">{{ date.month }}</span>
        </button>
      </div>

      <!-- Agenda Card -->
      <div class="mt-3 border-3 border-secondary rounded-xl p-2 shadow-xl">
        <div class="rounded-xl px-4 py-8 text-center"
          style="background: linear-gradient(to bottom, #fdd746 0%, #d79204 100%);">
          <h3 class="text-xl font-semibold text-black">{{ formattedSelectedDate }}</h3>
          <div class="flex items-center justify-center gap-2 mt-2 text-black/80">
            <Icon name="mdi:moon-waning-crescent" class="w-5 h-5" />
            <span>{{ agendaData?.title || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Topics Section -->
    <div v-if="isTopicMenuEnabled" class="mt-6 px-4">
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-black dark:text-white">Pelajari Topik Tertentu</h2>
      </div>

      <template v-if="isLoading">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <USkeleton class="h-5 w-3/4 mb-2" />
          <USkeleton class="h-4 w-full mb-2" />
          <USkeleton class="h-4 w-2/3" />
        </div>
      </template>

      <template v-else-if="topicsTreeItems.length > 0">
        <UTree :items="topicsTreeItems" :get-key="(item) => String(item.id)" size="xl" expanded-icon=""
          collapsed-icon="" :ui="{ linkLeadingIcon: 'hidden' }" @select="handleTopicSelect" />
      </template>

      <div v-else class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
        <Icon name="mdi:folder-outline" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">Belum ada topik</p>
      </div>
    </div>

    <!-- Books Section -->
    <div class="mt-6 px-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-black dark:text-white">Koleksi Buku</h2>
        <NuxtLink to="/books" class="text-primary dark:text-yellow-400 font-medium">Lihat semua</NuxtLink>
      </div>
      <div class="flex gap-3 pb-3 overflow-x-auto custom-scrollbar">
        <NuxtLink v-for="book in books" :key="book.id"
          :to="{ path: `/books/${book.id}`, query: { title: book.title, cover: book.url } }" class="shrink-0 w-28">
          <template v-if="book.url">
            <NuxtImg :src="getImageUrl(book.url)" :alt="book.title" class="w-28 h-40 object-cover rounded-xl" loading="lazy"
              width="112" height="160" />
          </template>
          <template v-else>
            <div
              class="w-28 h-40 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center p-2">
              <p class="text-center font-medium text-black dark:text-white text-xs line-clamp-6">{{ book.title }}</p>
            </div>
          </template>
          <p class="mt-2 text-sm font-medium text-black dark:text-white line-clamp-2">{{ book.title }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Topics2 Section -->
    <Topics2Section v-if="isTopic2MenuEnabled" :key="'topics2-section'" />

    <!-- Community Playlist Section - Lazy loaded with hydration on visible -->
    <LazyCommunityPlaylistSection v-if="isCommunityMenuEnabled" hydrate-on-visible />
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, watch } from "vue"
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'

interface MediaItem {
  id: number
  name: string
  url: string
  seq: number
}

interface Agenda {
  id: number | null
  date: string
  isDefault: number
  li_fo_da_chan_hui_wen: number
  title: string
  xfz: number
}

interface Topic {
  id: number
  category_id: number | null
  title: string
  short_title: string
  seq: number
  icon: number
}

interface Book {
  id: number
  book_category_id: number
  url: string
  url_pdf: string | null
  synopsis: string | null
  title: string
  seq: number
  date: string | null
}

interface MenuMobile {
  id: number
  nama: string
  code: string
  status: boolean
}

const dateContainer = ref<HTMLElement | null>(null)
const dateRefs = ref<HTMLElement[]>([])
const router = useRouter()

// Single optimized API call with server-side caching
const { data: allData, status } = useAsyncData('tabTerbaruData', async () => {
  return $fetch<{ 
    success: boolean
    data: {
      media: MediaItem[]
      topics: Topic[]
      books: Book[]
      agenda: Agenda[]
      menuSettings: MenuMobile[]
    }
  }>('/api/terbaru')
}, {
  server: false
})

const topics = computed(() => allData.value?.data?.topics?.sort((a, b) => a.seq - b.seq) || [])
const books = computed(() => allData.value?.data?.books?.sort((a, b) => a.seq - b.seq) || [])
const media = computed(() => allData.value?.data?.media?.sort((a, b) => a.seq - b.seq) || [])
const agendaList = computed(() => allData.value?.data?.agenda || [])

// Check which menus are enabled
const isTopicMenuEnabled = computed(() => {
  const topicMenu = allData.value?.data?.menuSettings?.find(m => m.code === 'topic')
  return topicMenu?.status === true
})

const isAgendaMenuEnabled = computed(() => {
  const agendaMenu = allData.value?.data?.menuSettings?.find(m => m.code === 'agenda')
  return agendaMenu?.status === true
})

const isTopic2MenuEnabled = computed(() => {
  const topic2Menu = allData.value?.data?.menuSettings?.find(m => m.code === 'topic2')
  return topic2Menu?.status === true
})

const isCommunityMenuEnabled = computed(() => {
  const communityMenu = allData.value?.data?.menuSettings?.find(m => m.code === 'community')
  return communityMenu?.status === true
})

// Transform topics to TreeItem format (flat list, no children)
const topicsTreeItems = computed<TreeItem[]>(() => {
  return topics.value.map(topic => ({
    id: topic.id,
    label: topic.title,
    defaultExpanded: false
  }))
})

const topicsAccordionItems = computed(() => [{
  label: 'Pelajari Topik Tertentu',
  value: 'Pelajari Topik Tertentu',
  slot: 'topics'
}])

const today = new Date()
const formatDateParam = (date: Date): string => date.toISOString().split('T')[0] ?? ''
const selectedDate = ref<string>(formatDateParam(today))

const isLoading = computed(() => status.value === 'pending')

const dateRange = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  if (!agendaList.value) return []
  return agendaList.value.map(agenda => {
    const dateStr = agenda.date || ''
    const date = new Date(dateStr + 'T00:00:00')
    return { full: dateStr, day: date.getDate(), month: months[date.getMonth()] }
  })
})

const todayIndex = computed(() => {
  const todayStr = formatDateParam(today)
  // First try to find exact match
  const exactIndex = dateRange.value.findIndex(d => d.full === todayStr)
  if (exactIndex !== -1) return exactIndex

  // If today not found, find the closest date
  const todayTime = today.getTime()
  let closestIndex = 0
  let closestDiff = Infinity

  dateRange.value.forEach((d, index) => {
    const dateTime = new Date(d.full + 'T00:00:00').getTime()
    const diff = Math.abs(dateTime - todayTime)
    if (diff < closestDiff) {
      closestDiff = diff
      closestIndex = index
    }
  })

  return dateRange.value.length > 0 ? closestIndex : -1
})

const formattedSelectedDate = computed(() => {
  const dateStr = selectedDate.value || formatDateParam(today)
  const date = new Date(dateStr)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
})

const agendaData = computed(() => agendaList.value?.find(a => a.date === selectedDate.value) || null)

function handleTopicSelect(e: TreeItemSelectEvent<TreeItem>) {
  const item = e.detail.value
  if (item?.id) {
    const topic = topics.value.find(t => t.id === item.id)
    if (topic) {
      router.push({
        path: `/topics/${topic.id}`,
        query: { title: topic.title }
      })
    }
  }
}

const selectDate = (date: string, index: number) => {
  selectedDate.value = date
  nextTick(() => {
    dateRefs.value[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  })
}

let scrollTimeout: ReturnType<typeof setTimeout> | null = null
const onDateScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    const container = dateContainer.value
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    let closestIndex = 0, closestDistance = Infinity
    dateRefs.value.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - containerCenter)
      if (distance < closestDistance) { closestDistance = distance; closestIndex = index }
    })
    const closestDate = dateRange.value[closestIndex]
    if (closestDate && closestDate.full !== selectedDate.value) selectedDate.value = closestDate.full
  }, 100)
}

onMounted(() => {
  setTimeout(() => {
    const index = todayIndex.value
    if (index !== -1 && dateRange.value[index]) {
      // Set selected date to the found date (today or closest)
      selectedDate.value = dateRange.value[index].full
      dateRefs.value[index]?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
    }
  }, 300)
})

// Watch for data to load and set initial date
watch(() => allData.value, (newData) => {
  if (newData?.data?.agenda && dateRange.value.length > 0) {
    const index = todayIndex.value
    if (index !== -1 && dateRange.value[index]) {
      selectedDate.value = dateRange.value[index].full
      nextTick(() => {
        dateRefs.value[index]?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
      })
    }
  }
}, { immediate: true })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
</style>
