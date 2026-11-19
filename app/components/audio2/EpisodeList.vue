<template>
  <div class="space-y-2">
    <div v-for="ep in episodes" :id="`ep-${ep.id}`" :key="ep.id" class="scroll-mt-4">
      <!-- Row / opened card. v-show keeps the opened episode (and its audio) alive while searching it. -->
      <div v-show="!searchMode[ep.id]" class="relative"
        :class="openId === ep.id ? 'mt-4 mb-3' : 'flex gap-2 items-center'">
        <button v-if="openId !== ep.id" type="button" @click="openEpisode(ep.id)"
          class="flex-1 min-w-0 flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            :class="ep.segment_count > 0
              ? 'bg-gradient-to-b from-[#c9a227] to-[#8b7355]'
              : 'bg-gray-300 dark:bg-gray-700'">
            <Icon name="mdi:music-note" class="w-7 h-7 text-white" />
          </div>
          <div class="flex-1 min-w-0 text-left">
            <p class="font-medium text-black dark:text-white line-clamp-2 break-words text-lg">{{ ep.title }}</p>
            <div class="flex items-baseline gap-2 text-sm text-gray-500 dark:text-gray-400">
              <p class="flex-1 min-w-0 truncate">{{ rowMeta(ep) }}</p>
              <span class="shrink-0 tabular-nums">{{ audio2ShortDuration(ep.duration) }}</span>
            </div>
          </div>
        </button>

        <Audio2EpisodeView v-else :episode-id="ep.id" :category-title="showCategory ? ep.category?.title : ''"
          inline autoplay @collapse="openId = null" />

        <!-- Search inside this audio -->
        <button v-if="openId !== ep.id" type="button" aria-label="Cari dalam audio ini"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" @click="openSearch(ep.id)">
          <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <button v-else type="button" aria-label="Cari dalam audio ini" @click="openSearch(ep.id)"
          class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10 border-2 border-[#c09637] dark:border-yellow-600">
          <Icon name="mdi:magnify" class="w-4 h-4 text-black dark:text-white" />
        </button>
      </div>

      <template v-if="searchMode[ep.id]">
        <div class="flex items-center gap-3 mb-2">
          <input :ref="el => setSearchInput(ep.id, el)" :value="queries[ep.id] ?? ''" type="search"
            placeholder="Cari dalam audio ini..." enterkeyhint="search"
            class="flex-1 min-w-0 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
            @input="queries[ep.id] = ($event.target as HTMLInputElement).value" @keyup.enter="runSearch(ep.id)" />
          <button v-if="queries[ep.id]?.trim()" type="button" @click="runSearch(ep.id)"
            class="px-3 py-2 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded">
            Cari
          </button>
          <button type="button" aria-label="Tutup pencarian" class="p-1" @click="closeSearch(ep.id)">
            <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>

        <div v-if="loading[ep.id]" class="flex justify-center py-8">
          <UIcon name="i-lucide-loader-circle" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>
        <div v-else-if="results[ep.id]?.length" class="space-y-4 mb-4">
          <SearchResultCard v-for="item in results[ep.id]" :key="itemKey(item)" :item="item"
            :is-expanded="expandedItems.has(itemKey(item))" :font-size="18" :is-speaking="speakingKey === itemKey(item)"
            :search-keyword="searchedKeyword[ep.id]" @toggle="toggleItem(item)" @navigate="openResult(item)"
            @speak="speak(itemKey(item), item)" />
        </div>
        <p v-else-if="searchedKeyword[ep.id]" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Tidak ada hasil ditemukan
        </p>
      </template>
    </div>

    <!-- Room for the bottom player so the last row is not hidden under it -->
    <div v-if="openId !== null" class="h-56" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import type { Audio2Episode } from '~/types/audio2'
import type { SearchItem } from '~/types/search'
import { audio2FormatDate, audio2SearchResultRoute, audio2ShortDuration } from '~/utils/audio2'

type ListEpisode = Audio2Episode & { category?: { id: number; title: string } }

const props = withDefaults(defineProps<{
  episodes: ListEpisode[]
  /** Timeline mixes categories: show each row's category. */
  showCategory?: boolean
}>(), { showCategory: false })

const router = useRouter()

const rowMeta = (ep: ListEpisode) => [
  props.showCategory ? ep.category?.title : '',
  audio2FormatDate(ep.aired_on),
  // No-transcript rows are told apart by their gray thumbnail.
  ep.segment_count > 0 ? `${ep.segment_count} segmen` : '',
].filter(Boolean).join(' · ')

// ---------------- Open one episode at a time (single audio) ----------------
const openId = ref<number | null>(null)
async function openEpisode(id: number) {
  openId.value = id
  await nextTick()
  document.getElementById(`ep-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------------- Search inside one audio ----------------
const searchMode = reactive<Record<number, boolean>>({})
const queries = reactive<Record<number, string>>({})
const searchedKeyword = reactive<Record<number, string>>({})
const results = reactive<Record<number, SearchItem[]>>({})
const loading = reactive<Record<number, boolean>>({})
const expandedItems = ref<Set<string>>(new Set())
const searchInputs: Record<number, HTMLInputElement | null> = {}

const setSearchInput = (id: number, el: unknown) => { searchInputs[id] = (el as HTMLInputElement | null) ?? null }
const { speakingKey, speak, stop: stopSpeech } = useAudio2Speech()
const itemKey = (item: SearchItem) => `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

async function openSearch(id: number) {
  searchMode[id] = true
  await nextTick()
  searchInputs[id]?.focus()
}

function closeSearch(id: number) {
  stopSpeech()
  searchMode[id] = false
  queries[id] = ''
  searchedKeyword[id] = ''
  results[id] = []
}

async function runSearch(id: number) {
  const keyword = (queries[id] ?? '').trim()
  if (!keyword) return
  searchedKeyword[id] = keyword
  loading[id] = true
  results[id] = []
  try {
    const res = await postSearch({
      keyword,
      page: 1,
      paginate: 20,
      selectedCategory: ['Audio'],
      selected_nodes: { audio: { audio_ids: [id] } },
    })
    results[id] = res.data || []
  } catch (e) {
    console.error('Audio 2 episode search failed', e)
  } finally {
    loading[id] = false
  }
}

function toggleItem(item: SearchItem) {
  const key = itemKey(item)
  const next = new Set(expandedItems.value)
  next.has(key) ? next.delete(key) : next.add(key)
  expandedItems.value = next
}

function openResult(item: SearchItem) {
  const target = audio2SearchResultRoute(item)
  if (target) router.push(target)
}
</script>
