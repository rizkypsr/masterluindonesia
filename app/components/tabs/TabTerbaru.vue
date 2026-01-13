<template>
  <div class="py-6">
    <!-- Carousel -->
    <ClientOnly>
      <UCarousel v-if="media.length > 0" :items="media" :ui="{ item: 'basis-[80%]' }" :autoplay="{ delay: 3000 }" loop
        class="overflow-hidden">
        <template #default="slotProps">
          <NuxtImg v-if="slotProps?.item" :src="slotProps.item.url" :alt="slotProps.item.name"
            class="w-full h-40 object-cover rounded-xl" loading="lazy" format="webp" quality="60"/>
        </template>
      </UCarousel>
    </ClientOnly>

    <!-- Agenda Section -->
    <div class="mt-4 px-4">
      <h2 class="text-lg font-semibold text-black mb-4">Agenda Hari Ini</h2>

      <!-- Date Selector -->
      <div ref="dateContainer" class="flex gap-2 overflow-x-scroll scrollbar-hide pb-2 px-[calc(50%-28px)]"
        style="scroll-snap-type: x proximity;" @scroll="onDateScroll">
        <button v-for="(date, index) in dateRange" :key="date.full" :ref="el => (dateRefs[index] = el as HTMLElement)"
          @click="selectDate(date.full, index)"
          class="flex flex-col items-center justify-center min-w-14 py-2 px-3 rounded-lg transition-colors shrink-0"
          style="scroll-snap-align: center;"
          :class="selectedDate === date.full ? 'bg-primary text-black font-bold' : 'bg-secondary/50 text-gray-700'">
          <span class="text-lg font-semibold">{{ date.day }}</span>
          <span class="text-xs">{{ date.month }}</span>
        </button>
      </div>

      <!-- Agenda Card -->
      <div class="mt-3 border-3 border-secondary rounded-xl p-2 shadow-xl">
        <div class="rounded-xl px-4 py-8 text-center mb-4"
          style="background: linear-gradient(to bottom, #fdd746 0%, #d79204 100%);">
          <h3 class="text-xl font-semibold text-black">{{ formattedSelectedDate }}</h3>
          <div class="flex items-center justify-center gap-2 mt-2 text-black/80">
            <Icon name="mdi:moon-waning-crescent" class="w-5 h-5" />
            <span>{{ agendaData?.title || '-' }}</span>
          </div>
        </div>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-black font-medium">Li Fo Da Chan Hui Wen</span>
            <span class="text-black">{{ agendaData?.li_fo_da_chan_hui_wen || 0 }} Kali</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-black font-medium">XFZ</span>
            <span class="text-black">{{ agendaData?.xfz || 0 }} Lembar</span>
          </div>
        </div>
        <div class="flex justify-end mt-3">
          <Icon name="mdi:information-outline" class="w-6 h-6 text-black" />
        </div>
      </div>
    </div>

    <!-- Topics Section -->
    <div class="mt-6 px-4">
      <UAccordion :items="topicsAccordionItems" default-value="Pelajari Topik Tertentu" class="topics-accordion">
        <template #topics>
          <div class="divide-y divide-gray-200">
            <NuxtLink v-for="topic in topics" :key="topic.id"
              :to="{ path: `/topics/${topic.id}`, query: { title: topic.title } }"
              class="block py-4 cursor-pointer hover:bg-gray-50">
              <span class="text-base font-medium text-black">{{ topic.title }}</span>
            </NuxtLink>
          </div>
        </template>
      </UAccordion>
    </div>

    <!-- Books Section -->
    <div class="mt-6 px-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-black">Koleksi Buku</h2>
        <NuxtLink to="/books" class="text-primary font-medium">Lihat semua</NuxtLink>
      </div>
      <div class="flex gap-3 pb-3 overflow-x-auto custom-scrollbar">
        <NuxtLink v-for="book in books" :key="book.id"
          :to="{ path: `/books/${book.id}`, query: { title: book.title, cover: book.url } }" class="shrink-0 w-28">
          <ClientOnly>
            <NuxtImg :src="book.url" :alt="book.title" class="w-28 h-40 object-cover rounded-xl" loading="lazy"
              format="webp" quality="60" />
            <template #fallback>
              <div class="w-28 h-40 bg-gray-200 rounded-xl animate-pulse"></div>
            </template>
          </ClientOnly>
          <p class="mt-2 text-sm font-medium text-black line-clamp-2">{{ book.title }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from "vue"

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

interface Recipe {
  id: number
  parent_id: number
  recipe_category_id: number
  title: string
  link_youtube: string
  time_cook: string
  for_people: string
  ingredients: string
  how_to_cook: string
  seq: number
  count_click: number
  have_child: number
  cover: string
}

const dateContainer = ref<HTMLElement | null>(null)
const dateRefs = ref<HTMLElement[]>([])

const { data: mediaData } = await useFetch<{ success: boolean; data: MediaItem[] }>(
  'https://api.masterluindonesia.com/api/app/media'
)

const { data: topicsData } = await useFetch<{ success: boolean; data: Topic[] }>(
  'https://api.masterluindonesia.com/api/topics'
)

const topics = computed(() => topicsData.value?.data?.sort((a, b) => a.seq - b.seq) || [])

const topicsAccordionItems = computed(() => [{
  label: 'Pelajari Topik Tertentu',
  value: 'Pelajari Topik Tertentu',
  slot: 'topics'
}])

const { data: booksData } = await useFetch<{ success: boolean; data: Book[] }>(
  'https://api.masterluindonesia.com/api/bookspaginate?page=1'
)

const books = computed(() => booksData.value?.data?.sort((a, b) => a.seq - b.seq) || [])

const { data: recipesData } = await useFetch<{ success: boolean; data: Recipe[] }>(
  'https://api.masterluindonesia.com/api/recipe/popular'
)

const recipes = computed(() => recipesData.value?.data?.sort((a, b) => a.seq - b.seq) || [])
const media = computed(() => mediaData.value?.data?.sort((a, b) => a.seq - b.seq) || [])

const today = new Date()
const formatDateParam = (date: Date): string => date.toISOString().split('T')[0] ?? ''
const selectedDate = ref<string>(formatDateParam(today))

const { data: allAgendaData } = await useFetch<{ success: boolean; data: Agenda[] }>(
  'https://api.masterluindonesia.com/api/app/agenda'
)

const dateRange = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  if (!allAgendaData.value?.data) return []
  return allAgendaData.value.data.map(agenda => {
    const dateStr = agenda.date || ''
    const date = new Date(dateStr + 'T00:00:00')
    return { full: dateStr, day: date.getDate(), month: months[date.getMonth()] }
  })
})

const todayIndex = computed(() => dateRange.value.findIndex(d => d.full === formatDateParam(today)))

const formattedSelectedDate = computed(() => {
  const dateStr = selectedDate.value || formatDateParam(today)
  const date = new Date(dateStr)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
})

const agendaData = computed(() => allAgendaData.value?.data?.find(a => a.date === selectedDate.value) || null)

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
    if (index !== -1) dateRefs.value[index]?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
  }, 300)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.topics-accordion :deep(button span) { font-size: 1.25rem; font-weight: 600; color: black; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(0, 0, 0, 0.2) transparent; }
.custom-scrollbar::-webkit-scrollbar { height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.35); }
</style>
