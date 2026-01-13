<template>
  <div>
    <!-- Header -->
    <div
      class="px-4 pt-6 pb-4 shadow-md"
      style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);"
    >
      <h1 class="text-black mb-2 font-semibold">
        Apa yang ingin kamu pelajari?
      </h1>

      <div class="flex items-center bg-white rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-black mr-2" />
        <input
          type="text"
          placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400"
        />
      </div>
    </div>

    <!-- TAB BAR -->
    <div class="bg-white shadow-md">
      <div
        ref="tabContainer"
        class="flex overflow-x-auto scrollbar-hide relative"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :ref="el => (tabRefs[index] = el as HTMLElement)"
          @click="selectTab(tab.id, index)"
          class="px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors relative flex-shrink-0"
          :class="activeTab === tab.id ? 'text-black' : 'text-gray-400'"
        >
          {{ tab.label }}

          <span
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-4 right-4 h-0.5 bg-black rounded-full"
          />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="py-6">
      <!-- Carousel -->
      <ClientOnly>
        <UCarousel
          v-if="media.length > 0"
          :items="media"
          :ui="{ item: 'basis-[80%]' }"
          :autoplay="{ delay: 3000 }"
          loop
          class="overflow-hidden"
        >
          <template #default="slotProps">
            <NuxtImg
              v-if="slotProps?.item"
              :src="slotProps.item.url"
              :alt="slotProps.item.name"
              class="w-full h-40 object-cover rounded-xl"
              loading="lazy"
              format="webp"
              quality="80"
            />
          </template>
        </UCarousel>
      </ClientOnly>

      <!-- Agenda Section -->
      <div class="mt-4 px-4">
        <h2 class="text-lg font-semibold text-black mb-4">Agenda Hari Ini</h2>
        
        <!-- Date Selector -->
        <div 
          ref="dateContainer"
          class="flex gap-2 overflow-x-scroll scrollbar-hide pb-2 px-[calc(50%-28px)]"
          style="scroll-snap-type: x proximity;"
          @scroll="onDateScroll"
        >
          <button
            v-for="(date, index) in dateRange"
            :key="date.full"
            :ref="el => (dateRefs[index] = el as HTMLElement)"
            @click="selectDate(date.full, index)"
            class="flex flex-col items-center justify-center min-w-14 py-2 px-3 rounded-lg transition-colors shrink-0"
            style="scroll-snap-align: center;"
            :class="selectedDate === date.full ? 'bg-primary text-black font-bold' : 'bg-secondary/50 text-gray-700'"
          >
            <span class="text-lg font-semibold">{{ date.day }}</span>
            <span class="text-xs">{{ date.month }}</span>
          </button>
        </div>

        <!-- Agenda Card -->
        <div class="mt-3 border-3 border-secondary rounded-xl p-2 shadow-xl">
          <!-- Date Header -->
          <div 
            class="rounded-xl px-4 py-8 text-center mb-4"
            style="background: linear-gradient(to bottom, #fdd746 0%, #d79204 100%);"
          >
            <h3 class="text-xl font-semibold text-black">{{ formattedSelectedDate }}</h3>
            <div class="flex items-center justify-center gap-2 mt-2 text-black/80">
              <Icon name="mdi:moon-waning-crescent" class="w-5 h-5" />
              <span>{{ agendaData?.title || '-' }}</span>
            </div>
          </div>

          <!-- Agenda Details -->
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

          <!-- Info Icon -->
          <div class="flex justify-end mt-3">
            <Icon name="mdi:information-outline" class="w-6 h-6" />
          </div>
        </div>
      </div>

      <div class="text-gray-600 mt-4 px-4">
        Konten {{ tabs.find(t => t.id === activeTab)?.label }}
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

const activeTab = ref("terbaru")
const tabContainer = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])
const dateContainer = ref<HTMLElement | null>(null)
const dateRefs = ref<HTMLElement[]>([])

const tabs = [
  { id: "terbaru", label: "Terbaru" },
  { id: "feed", label: "Feed" },
  { id: "kesaksian", label: "Kesaksian" },
  { id: "kegiatan", label: "Kegiatan" },
  { id: "paritta", label: "Paritta" },
  { id: "unduh", label: "Unduh" },
  { id: "edukasi", label: "Edukasi" },
  { id: "tentang", label: "Tentang" },
  { id: "contact", label: "Contact" },
]

// Fetch media data
const { data: mediaData } = await useFetch<{ success: boolean; data: MediaItem[] }>(
  'https://api.masterluindonesia.com/api/app/media'
)

const media = computed(() => {
  if (mediaData.value?.data) {
    return mediaData.value.data.sort((a, b) => a.seq - b.seq)
  }
  return []
})

// Get today's date
const today = new Date()
const formatDateParam = (date: Date) => {
  return date.toISOString().split('T')[0]
}

const selectedDate = ref(formatDateParam(today))

// Fetch all agenda data for date range
const { data: allAgendaData } = await useFetch<{ success: boolean; data: Agenda[] }>(
  'https://api.masterluindonesia.com/api/app/agenda'
)

// Generate date range from API data
const dateRange = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  if (!allAgendaData.value?.data) return []
  
  return allAgendaData.value.data.map(agenda => {
    const date = new Date(agenda.date + 'T00:00:00')
    return {
      full: agenda.date,
      day: date.getDate(),
      month: months[date.getMonth()]
    }
  })
})

// Find today's index in the date range
const todayIndex = computed(() => {
  const todayStr = formatDateParam(today)
  return dateRange.value.findIndex(d => d.full === todayStr)
})

// Format selected date for display
const formattedSelectedDate = computed(() => {
  const date = new Date(selectedDate.value)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
})

// Get agenda data for selected date
const agendaData = computed(() => {
  if (!allAgendaData.value?.data) return null
  return allAgendaData.value.data.find(a => a.date === selectedDate.value) || null
})

const selectDate = (date: string, index: number) => {
  selectedDate.value = date
  nextTick(() => {
    const dateEl = dateRefs.value[index]
    if (dateEl) {
      dateEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  })
}

// Debounce scroll handler
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const onDateScroll = () => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  
  scrollTimeout = setTimeout(() => {
    const container = dateContainer.value
    if (!container) return
    
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    
    let closestIndex = 0
    let closestDistance = Infinity
    
    dateRefs.value.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const elCenter = rect.left + rect.width / 2
      const distance = Math.abs(elCenter - containerCenter)
      
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    
    const closestDate = dateRange.value[closestIndex]
    if (closestDate && closestDate.full !== selectedDate.value) {
      selectedDate.value = closestDate.full
    }
  }, 100)
}

const TARGET_VISIBLE_INDEX = 1
const GAP_OFFSET = 8

const selectTab = (tabId: string, index: number) => {
  activeTab.value = tabId
  nextTick(() => scrollTabToPreferredPosition(index))
}

const scrollTabToPreferredPosition = (index: number) => {
  const container = tabContainer.value
  const tab = tabRefs.value[index]

  if (!container || !tab) return

  const tabLeft = tab.offsetLeft
  const tabWidth = tab.offsetWidth
  const containerWidth = container.clientWidth
  const maxScrollLeft = container.scrollWidth - containerWidth

  const targetScrollLeft = tabLeft - tabWidth * TARGET_VISIBLE_INDEX - GAP_OFFSET

  const finalScrollLeft = Math.min(Math.max(0, targetScrollLeft), maxScrollLeft)

  container.scrollTo({
    left: finalScrollLeft,
    behavior: "smooth",
  })
}

// Scroll to today on mount
onMounted(() => {
  setTimeout(() => {
    const index = todayIndex.value
    if (index !== -1) {
      const dateEl = dateRefs.value[index]
      if (dateEl) {
        dateEl.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' })
      }
    }
  }, 300)
})
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
