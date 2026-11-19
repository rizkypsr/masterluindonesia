<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0 relative z-20">
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1">Audio</h1>
      <button aria-label="Bagikan" @click="shareView" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
    </div>

    <div class="relative flex-1 min-h-0 overflow-hidden">
    <!-- Filters (view switch, category, search, year / month chips) float over the list: they slide
         away while scrolling down and come back on any scroll up, like a floating SliverAppBar. -->
    <div ref="filtersEl"
      class="absolute inset-x-0 top-0 px-4 pt-3 pb-1 bg-gray-50 dark:bg-gray-900 z-10"
      :class="[filtersSnapping ? 'transition-transform duration-200 ease-out' : '',
        filtersOffset >= filtersHeight ? '' : 'shadow-[0_6px_6px_-6px_rgba(0,0,0,0.12)]']"
      :style="{ transform: `translateY(-${filtersOffset}px)` }">
        <div class="grid grid-cols-2 gap-1 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl mb-3">
          <button v-for="v in views" :key="v.value" @click="setView(v.value)"
            class="h-10 rounded-lg text-lg font-medium transition-colors"
            :class="view === v.value ? 'bg-primary text-black dark:bg-yellow-500' : 'text-black dark:text-gray-200'">
            {{ v.label }}
          </button>
        </div>

        <!-- Per kategori: category chips + show-all toggle, then year / month -->
        <template v-if="view === 'category'">
          <div v-if="categoriesPending && categories.length === 0" class="flex gap-2 pb-3">
            <div v-for="i in 4" :key="i" class="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
          </div>
          <div v-else class="flex items-center gap-2 pb-3">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)"
                class="shrink-0 px-4 py-2 rounded-full text-lg font-medium transition-colors"
                :class="selectedCategoryId === cat.id
                  ? 'bg-primary text-black dark:bg-yellow-500'
                  : 'bg-primary/40 text-black dark:bg-gray-700 dark:text-gray-300'">
                {{ cat.title }}
              </button>
            </div>
            <ShowAllToggle v-model="showAll" />
          </div>

           <div v-if="canSearch" class="pb-3 flex items-center gap-3">
            <input v-model="categorySearchQuery" type="text" enterkeyhint="search"
              :placeholder="searchPlaceholder"
              class="flex-1 min-w-0 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-lg focus:border-primary focus:outline-none"
              @keyup.enter="runCategorySearch" />
            <button v-if="categorySearchQuery.trim()" @click="runCategorySearch"
              class="px-3 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded">Cari</button>
            <button v-if="hasCategorySearched" aria-label="Tutup pencarian" @click="clearCategorySearch"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          <template v-if="!hasCategorySearched && !episodesPending && yearGroups.length > 0">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button v-for="y in yearGroups" :key="String(y.year)" @click="selectYear(y.year)"
                class="shrink-0 px-4 py-1.5 rounded-full text-lg font-medium transition-colors"
                :class="selectedYear === y.year
                  ? 'bg-primary text-black dark:bg-yellow-500'
                  : 'bg-white border border-gray-300 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'">
                {{ audio2YearLabel(y.year) }}
              </button>
            </div>
            <div v-if="monthGroups.length > 1 || (monthGroups[0] && monthGroups[0].month != null)"
              class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              <button v-for="m in monthGroups" :key="String(m.month)" @click="selectedMonth = m.month"
                class="shrink-0 px-4 py-1.5 rounded-full text-lg font-medium transition-colors"
                :class="selectedMonth === m.month
                  ? 'bg-primary text-black dark:bg-yellow-500'
                  : 'bg-white border border-gray-300 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'">
                {{ audio2MonthLabel(m.month) }}
              </button>
            </div>
          </template>
        </template>

        <!-- Per timeline: year chips + show-all toggle, then month -->
        <template v-else>
          <div class="flex items-center gap-2 pb-3">
            <div class="flex gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              <button v-for="y in timelineYears" :key="String(y.year)" @click="selectTimelineYear(y.year)"
                class="shrink-0 px-4 py-2 rounded-full text-lg font-medium transition-colors"
                :class="timelineYear === y.year
                  ? 'bg-primary text-black dark:bg-yellow-500'
                  : 'bg-primary/40 text-black dark:bg-gray-700 dark:text-gray-300'">
                {{ audio2YearLabel(y.year) }}
              </button>
            </div>
            <ShowAllToggle v-model="showAll" />
          </div>

           <div v-if="canSearch" class="pb-3 flex items-center gap-3">
            <input v-model="categorySearchQuery" type="text" enterkeyhint="search"
              :placeholder="searchPlaceholder"
              class="flex-1 min-w-0 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-lg focus:border-primary focus:outline-none"
              @keyup.enter="runCategorySearch" />
            <button v-if="categorySearchQuery.trim()" @click="runCategorySearch"
              class="px-3 py-2 bg-primary hover:bg-primary/90 text-black font-medium rounded">Cari</button>
            <button v-if="hasCategorySearched" aria-label="Tutup pencarian" @click="clearCategorySearch"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          <div v-if="!hasCategorySearched && !timelinePending && (timelineMonths.length > 1 || (timelineMonths[0] && timelineMonths[0].month != null))"
            class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button v-for="m in timelineMonths" :key="String(m.month)" @click="timelineMonth = m.month"
              class="shrink-0 px-4 py-1.5 rounded-full text-lg font-medium transition-colors"
              :class="timelineMonth === m.month
                ? 'bg-primary text-black dark:bg-yellow-500'
                : 'bg-white border border-gray-300 text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'">
              {{ audio2MonthLabel(m.month) }}
            </button>
          </div>
        </template>
      </div>

    <div ref="scrollContainer" class="h-full overflow-y-auto px-4 pb-8 isolate" @scroll.passive="onListScroll"
      :style="{ paddingTop: `${filtersHeight + 16}px` }">
      <!-- Search results (inside the category, or inside the timeline year) -->
      <div v-if="hasCategorySearched">
          <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
            HASIL PENCARIAN "{{ categorySearchedKeyword }}"
          </p>
          <div v-if="isCategorySearching" class="flex justify-center py-8">
            <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
          <div v-else-if="categorySearchResults.length > 0" class="space-y-4">
            <SearchResultCard v-for="item in categorySearchResults" :key="itemKey(item)" :item="item"
              :is-expanded="expandedSearchItems.has(itemKey(item))" :font-size="18" :is-speaking="speakingKey === itemKey(item)"
              :search-keyword="categorySearchedKeyword" @toggle="toggleSearchItem(item)"
              @navigate="openSearchResult(item)" @speak="speak(itemKey(item), item)" />
          </div>
          <p v-else class="text-center py-8 text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
        </div>

      <!-- ============ PER KATEGORI ============ -->
      <template v-else-if="view === 'category'">
          <div v-if="episodesPending" class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>

          <template v-else-if="yearGroups.length > 0">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {{ selectedCategory?.title }} · {{ periodLabel(selectedMonth, selectedYear) }} · {{ visibleEpisodes.length }} episode{{ showAll ? '' : ' dengan transkrip' }}
            </p>

            <Audio2EpisodeList :key="`cat-${selectedCategoryId}-${selectedYear}-${selectedMonth}`"
              :episodes="visibleEpisodes" />
          </template>

          <div v-else-if="selectedCategoryId" class="text-center py-10 px-4">
            <p class="text-gray-500 dark:text-gray-400 text-lg">
              {{ showAll ? 'Belum ada audio di kategori ini' : 'Belum ada audio dengan transkrip di kategori ini' }}
            </p>
            <button v-if="!showAll" @click="showAll = true"
              class="mt-3 px-4 py-2 rounded-full bg-primary text-black font-medium">Tampilkan semua audio</button>
          </div>
      </template>

      <!-- ============ PER TIMELINE ============ -->
      <template v-else>
        <div v-if="timelinePending" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>

        <template v-else-if="timelineMonths.length > 0">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ periodLabel(timelineMonth, timelineYear) }} · semua kategori · {{ timelineEpisodes.length }} episode{{ showAll ? '' : ' dengan transkrip' }}
          </p>

          <Audio2EpisodeList :key="`tl-${timelineYear}-${timelineMonth}`" :episodes="timelineEpisodes"
            show-category />
        </template>

        <div v-else class="text-center py-10 px-4">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            {{ showAll ? 'Belum ada audio' : 'Belum ada audio dengan transkrip' }}
          </p>
          <button v-if="!showAll" @click="showAll = true"
            class="mt-3 px-4 py-2 rounded-full bg-primary text-black font-medium">Tampilkan semua audio</button>
        </div>
      </template>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h, resolveComponent } from 'vue'
import type { Audio2Category, Audio2Episode, Audio2EpisodesData, Audio2TimelineData } from '~/types/audio2'
import type { SearchItem } from '~/types/search'
import {
  audio2MonthLabel,
  audio2SearchResultRoute,
  audio2YearLabel,
} from '~/utils/audio2'

useHead({ title: 'Audio' })

const router = useRouter()
const route = useRoute()
const toast = useToast()
const api = useAudio2Api()

type View = 'category' | 'timeline'
const views: { value: View; label: string }[] = [
  { value: 'timeline', label: 'Per timeline' },
  { value: 'category', label: 'Per kategori' },
]

// Persisted across navigation (back from the detail restores the same spot).
const view = useState<View>('audio2-view', () => 'timeline')
const showAll = useState('audio2-show-all', () => false)
const selectedCategoryId = useState<number | null>('audio2-category', () => null)
const selectedYear = useState<number | null | undefined>('audio2-year', () => undefined)
const selectedMonth = useState<number | null | undefined>('audio2-month', () => undefined)
const timelineYear = useState<number | null | undefined>('audio2-tl-year', () => undefined)
const timelineMonth = useState<number | null | undefined>('audio2-tl-month', () => undefined)

// Deep link: /audio?view=timeline&category=2&all=1
if (route.query.view === 'timeline' || route.query.view === 'category') view.value = route.query.view
if (route.query.all === '1') showAll.value = true
if (route.query.category) selectedCategoryId.value = Number(route.query.category) || null
// Year/month in a link: a number, or "none" for the "Tanpa tahun" group.
const periodParam = (v: unknown) => v === 'none' ? null : (Number(v) || undefined)
if (route.query.year !== undefined) {
  const target = view.value === 'timeline' ? [timelineYear, timelineMonth] : [selectedYear, selectedMonth]
  target[0]!.value = periodParam(route.query.year)
  target[1]!.value = route.query.month !== undefined ? periodParam(route.query.month) : undefined
}

const setView = (v: View) => { view.value = v }

// ---------------- Collapsing filters ----------------
const filtersEl = ref<HTMLElement | null>(null)
const { height: filtersHeight } = useElementSize(filtersEl, undefined, { box: 'border-box' })
// How far the filters are slid up (0 = fully shown, filtersHeight = gone). It follows the scroll,
// never more than the scroll position (so no gap opens above the list), and snaps when scrolling stops.
const filtersOffset = ref(0)
const filtersSnapping = ref(false)
let lastScrollTop = 0
let snapTimer: ReturnType<typeof setTimeout> | undefined
function onListScroll(e: Event) {
  const el = e.target as HTMLElement
  const top = Math.max(0, el.scrollTop)
  const delta = top - lastScrollTop
  lastScrollTop = top
  const h = filtersHeight.value
  // Keep them while typing in a search box (the keyboard scrolls the list).
  const typing = filtersEl.value?.contains(document.activeElement) ?? false
  filtersSnapping.value = false
  filtersOffset.value = typing ? 0 : Math.min(top, h, Math.max(0, filtersOffset.value + delta))
  clearTimeout(snapTimer)
  snapTimer = setTimeout(() => {
    const off = filtersOffset.value
    if (off <= 0 || off >= h) return
    filtersSnapping.value = true
    // Hide fully only when the list is scrolled past them; else show them again.
    if (off > h / 2 && top >= h) filtersOffset.value = h
    else if (top < h) el.scrollTo({ top: off > h / 2 ? h : 0, behavior: 'smooth' })
    else filtersOffset.value = 0
  }, 140)
}
watch(view, () => { filtersOffset.value = 0; clearCategorySearch() })

// Bring the selected chip of each horizontal chip row into view (e.g. 2012 / Maret from a link).
function revealSelectedChips() {
  filtersEl.value?.querySelectorAll<HTMLElement>('.overflow-x-auto').forEach((row) => {
    const chip = row.querySelector<HTMLElement>('.bg-primary')
    if (!chip) return
    const left = chip.offsetLeft - row.offsetLeft
    if (left < row.scrollLeft || left + chip.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: left - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
    }
  })
}


// ---------------- Per kategori ----------------
const categories = ref<Audio2Category[]>([])
const categoriesPending = ref(false)
const episodesData = ref<Audio2EpisodesData | null>(null)
const episodesPending = ref(false)

const selectedCategory = computed(() => categories.value.find(c => c.id === selectedCategoryId.value) ?? null)
const yearGroups = computed(() => episodesData.value?.years ?? [])
const monthGroups = computed(() => yearGroups.value.find(y => y.year === selectedYear.value)?.months ?? [])
const visibleEpisodes = computed<Audio2Episode[]>(() =>
  monthGroups.value.find(m => m.month === selectedMonth.value)?.episodes ?? [])

async function loadCategories() {
  categoriesPending.value = true
  try {
    categories.value = await api.fetchCategories()
    // Keep the remembered category if it still exists; else prefer the
    // first category that has transcripts, then simply the first one.
    if (!categories.value.some(c => c.id === selectedCategoryId.value)) {
      const firstWithText = categories.value.find(c => c.episode_with_transcript_count > 0)
      selectedCategoryId.value = (firstWithText ?? categories.value[0])?.id ?? null
    }
  } catch (e) {
    console.error('Failed to load Audio 2 categories', e)
  } finally {
    categoriesPending.value = false
  }
}

let episodesRequest = 0
let episodesShowAll: boolean | null = null // showAll the loaded episodes were fetched with
async function loadEpisodes() {
  if (!selectedCategoryId.value) { episodesData.value = null; return }
  const req = ++episodesRequest
  episodesShowAll = showAll.value
  episodesPending.value = true
  try {
    const data = sortEpisodesData(await api.fetchEpisodes(selectedCategoryId.value, showAll.value))
    if (req !== episodesRequest) return
    episodesData.value = data
    // Keep the remembered year/month when still present, else the first.
    const year = data.years.find(y => y.year === selectedYear.value) ?? data.years[0]
    selectedYear.value = year ? year.year : undefined
    const month = year?.months.find(m => m.month === selectedMonth.value) ?? year?.months[0]
    selectedMonth.value = month ? month.month : undefined
  } catch (e) {
    if (req === episodesRequest) episodesData.value = null
    console.error('Failed to load Audio 2 episodes', e)
  } finally {
    if (req === episodesRequest) episodesPending.value = false
  }
}

function selectCategory(id: number) {
  if (selectedCategoryId.value === id) return
  selectedCategoryId.value = id
  selectedYear.value = undefined
  selectedMonth.value = undefined
  clearCategorySearch()
}

function selectYear(year: number | null) {
  selectedYear.value = year
  selectedMonth.value = monthGroups.value[0]?.month
}

watch(selectedCategoryId, () => { if (view.value === 'category') loadEpisodes() })

// ---------------- Search inside a category ----------------
const categorySearchQuery = ref('')
const categorySearchedKeyword = ref('')
const hasCategorySearched = ref(false)
const isCategorySearching = ref(false)
const categorySearchResults = ref<SearchItem[]>([])
const expandedSearchItems = ref<Set<string>>(new Set())

const { speakingKey, speak, stop: stopSpeech } = useAudio2Speech()
const itemKey = (item: SearchItem) => `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

// Per kategori searches the selected category; Per timeline the selected year (its episodes with text).
const timelineSearchIds = computed(() =>
  (timelineData.value?.months ?? []).flatMap(m => m.episodes).filter(e => e.segment_count > 0).map(e => e.id))
const searchPlaceholder = computed(() => view.value === 'timeline' ? 'Cari dalam tahun ini...' : 'Cari dalam kategori ini...')
const canSearch = computed(() => view.value === 'category' ? !!selectedCategoryId.value : !!timelineData.value)

async function runCategorySearch() {
  const keyword = categorySearchQuery.value.trim()
  if (!keyword || !canSearch.value) return
  const audioScope: { category_ids?: number[]; audio_ids?: number[] } = view.value === 'category'
    ? { category_ids: [selectedCategoryId.value!] }
    : { audio_ids: timelineSearchIds.value }
  categorySearchedKeyword.value = keyword
  hasCategorySearched.value = true
  isCategorySearching.value = true
  categorySearchResults.value = []
  if (audioScope.audio_ids?.length === 0) {
    isCategorySearching.value = false // no episode with text in this year
    return
  }
  try {
    const res = await postSearch({
      keyword,
      page: 1,
      paginate: 30,
      selectedCategory: ['Audio'],
      selected_nodes: { audio: audioScope },
    })
    categorySearchResults.value = res.data || []
  } catch (e) {
    console.error('Audio 2 category search failed', e)
  } finally {
    isCategorySearching.value = false
  }
}

function clearCategorySearch() {
  stopSpeech()
  categorySearchQuery.value = ''
  categorySearchedKeyword.value = ''
  hasCategorySearched.value = false
  categorySearchResults.value = []
  expandedSearchItems.value = new Set()
}

function toggleSearchItem(item: SearchItem) {
  const key = itemKey(item)
  const next = new Set(expandedSearchItems.value)
  next.has(key) ? next.delete(key) : next.add(key)
  expandedSearchItems.value = next
}

function openSearchResult(item: SearchItem) {
  const target = audio2SearchResultRoute(item)
  if (target) router.push(target)
}

// ---------------- Per timeline ----------------
const timelineData = ref<Audio2TimelineData | null>(null)
const timelinePending = ref(false)
const timelineYears = computed(() => timelineData.value?.years ?? [])
const timelineMonths = computed(() => timelineData.value?.months ?? [])
const timelineEpisodes = computed(() =>
  timelineMonths.value.find(m => m.month === timelineMonth.value)?.episodes ?? [])

// The API lists newest first; the page shows oldest first (2011, 2012… · Januari, Februari… ·
// 1, 2, 3 April). Undated groups and episodes stay last.
const ascNullsLast = (a: number | null, b: number | null) =>
  a == null ? (b == null ? 0 : 1) : b == null ? -1 : a - b
const byAiredOn = (a: { aired_on: string | null }, b: { aired_on: string | null }) =>
  !a.aired_on ? (b.aired_on ? 1 : 0) : !b.aired_on ? -1 : a.aired_on.localeCompare(b.aired_on)
function sortMonthGroups<E extends { aired_on: string | null }>(months: { month: number | null; episodes: E[] }[]) {
  return [...months]
    .sort((a, b) => ascNullsLast(a.month, b.month))
    .map(m => ({ ...m, episodes: [...m.episodes].sort(byAiredOn) }))
}
function sortEpisodesData(data: Audio2EpisodesData): Audio2EpisodesData {
  return {
    ...data,
    years: [...data.years]
      .sort((a, b) => ascNullsLast(a.year, b.year))
      .map(y => ({ ...y, months: sortMonthGroups(y.months) })),
  }
}
function sortTimelineData(data: Audio2TimelineData): Audio2TimelineData {
  return {
    ...data,
    years: [...data.years]
      .sort((a, b) => ascNullsLast(a.year, b.year))
      .map(y => ({ ...y, months: [...y.months].sort((a, b) => a - b) })),
    months: sortMonthGroups(data.months),
  }
}

let timelineRequest = 0
let timelineShowAll: boolean | null = null
async function loadTimeline() {
  const req = ++timelineRequest
  timelineShowAll = showAll.value
  timelinePending.value = true
  try {
    let data = sortTimelineData(await api.fetchTimeline(timelineYear.value, showAll.value))
    // No year picked yet, or the remembered one vanished (e.g. "show all" switched off):
    // open the oldest year, the first chip.
    const wanted = timelineYear.value !== undefined && data.years.some(y => y.year === timelineYear.value)
      ? timelineYear.value
      : data.years[0]?.year
    if (wanted !== undefined && wanted !== data.year) {
      data = sortTimelineData(await api.fetchTimeline(wanted, showAll.value))
    }
    if (req !== timelineRequest) return
    timelineData.value = data
    timelineYear.value = data.years.length > 0 ? data.year : undefined
    const month = data.months.find(m => m.month === timelineMonth.value) ?? data.months[0]
    timelineMonth.value = month ? month.month : undefined
  } catch (e) {
    if (req === timelineRequest) timelineData.value = null
    console.error('Failed to load Audio 2 timeline', e)
  } finally {
    if (req === timelineRequest) timelinePending.value = false
  }
}

function selectTimelineYear(year: number | null) {
  if (timelineYear.value === year) return
  clearCategorySearch()
  timelineYear.value = year
  timelineMonth.value = undefined
  loadTimeline()
}

// ---------------- Shared ----------------
watch(showAll, () => {
  if (view.value === 'category') loadEpisodes()
  else loadTimeline()
})

// Reload a view on switch when it was never loaded or the eye toggle changed meanwhile.
watch(view, (v) => {
  if (v === 'category') {
    if (!episodesData.value || episodesShowAll !== showAll.value) loadEpisodes()
  } else if (!timelineData.value || timelineShowAll !== showAll.value) {
    loadTimeline()
  }
})

watch([view, selectedCategoryId, selectedYear, selectedMonth, timelineYear, timelineMonth, episodesPending, timelinePending],
  () => nextTick(revealSelectedChips), { flush: 'post' })

onMounted(async () => {
  await loadCategories()
  if (view.value === 'category') loadEpisodes()
  else loadTimeline()
})

function periodLabel(month: number | null | undefined, year: number | null | undefined) {
  if (year === null) return 'Tanpa tahun'
  if (month == null) return audio2YearLabel(year ?? null)
  return `${audio2MonthLabel(month)} ${year}`
}

function shareView() {
  const params = new URLSearchParams({ view: view.value })
  if (view.value === 'category' && selectedCategoryId.value) params.set('category', String(selectedCategoryId.value))
  if (showAll.value) params.set('all', '1')
  const [year, month] = view.value === 'timeline'
    ? [timelineYear.value, timelineMonth.value]
    : [selectedYear.value, selectedMonth.value]
  if (year !== undefined) params.set('year', year === null ? 'none' : String(year))
  if (month !== undefined) params.set('month', month === null ? 'none' : String(month))
  const url = `${window.location.origin}/audio?${params}`
  if (navigator.share) {
    navigator.share({ title: 'Audio', url }).catch(() => {})
  } else {
    navigator.clipboard.writeText(url)
      .then(() => toast.add({ title: 'Link disalin ke clipboard', color: 'success' }))
      .catch(() => toast.add({ title: 'Gagal menyalin link', color: 'error' }))
  }
}

// ---------------- Local components ----------------
const ShowAllToggle = defineComponent({
  props: { modelValue: { type: Boolean, required: true } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const Icon = resolveComponent('Icon')
    return () => h('button', {
      type: 'button',
      'aria-pressed': props.modelValue,
      'aria-label': props.modelValue
        ? 'Sembunyikan audio yang belum ada transkrip'
        : 'Tampilkan semua audio, termasuk yang belum ada transkrip',
      class: [
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors',
        props.modelValue
          ? 'bg-primary border-primary dark:bg-yellow-500 dark:border-yellow-500'
          : 'bg-white border-[#c09637] dark:bg-gray-800 dark:border-yellow-500',
      ],
      onClick: () => emit('update:modelValue', !props.modelValue),
    }, [h(Icon, {
      name: props.modelValue ? 'mdi:eye' : 'mdi:eye-off',
      class: ['w-5 h-5', props.modelValue ? 'text-black' : 'text-[#8a6a1f] dark:text-yellow-400'],
    })])
  },
})

</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
