<template>
  <div>
    <!-- Loading -->
    <div v-if="pending" class="animate-pulse">
      <div class="h-14 bg-[#c09637]/60 dark:bg-yellow-600/60 rounded-2xl"></div>
      <div v-if="!inline" class="space-y-4 mt-4">
        <div v-for="i in 4" :key="i" class="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="loadError || !detail" class="text-center py-12">
      <p class="text-lg text-gray-600 dark:text-gray-400">{{ loadError || 'Episode tidak ditemukan' }}</p>
      <button v-if="inline" class="mt-4 px-4 py-2 rounded-full bg-primary text-black font-medium" @click="emit('collapse')">
        Tutup
      </button>
      <button v-else class="mt-4 px-4 py-2 rounded-full bg-primary text-black font-medium" @click="router.push('/audio')">
        Ke menu Audio
      </button>
    </div>

    <div v-else class="bg-[#c09637] dark:bg-yellow-600 rounded-2xl overflow-hidden" :style="{ fontSize: fontSize + 'px' }">
      <!-- Episode header -->
      <div class="px-4 py-3 flex items-center gap-3">
        <button :aria-label="isPlaying ? 'Jeda' : 'Putar'" class="shrink-0" @click="togglePlay">
          <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-7 h-7 text-black" />
        </button>
        <div class="flex-1 min-w-0">
          <p v-if="categoryTitle" class="text-sm font-semibold text-black">{{ categoryTitle }}</p>
          <p class="font-medium text-black line-clamp-2 break-words text-lg">{{ detail.episode.title }}</p>
          <p v-if="episodeMeta" class="text-sm text-black/75">{{ episodeMeta }}</p>
        </div>
        <span class="text-black shrink-0 tabular-nums">{{ audio2ShortDuration(detail.episode.duration) }}</span>
      </div>

      <!-- Transcript -->
      <div class="bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl overflow-hidden">
        <div class="flex items-center gap-1 px-4 py-3">
          <button class="flex-1 text-left text-lg font-medium text-black dark:text-white" @click="showText = !showText">
            Show Teks
          </button>
          <button v-if="showText && hasTranscript" @click="toggleViewMode"
            :aria-label="viewMode === 'all' ? 'Ganti ke tampilan per penelepon' : 'Ganti ke tampilan semua teks'"
            class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="viewMode === 'caller' ? 'bg-gray-100 dark:bg-gray-700' : ''">
            <Icon :name="viewMode === 'all' ? 'mdi:view-sequential' : 'mdi:view-list'"
              class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button :aria-label="showText ? 'Sembunyikan teks' : 'Tampilkan teks'" class="p-1.5"
            @click="showText = !showText">
            <Icon :name="showText ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div v-if="showText" class="px-3 pb-4">
          <p v-if="!hasTranscript" class="text-center text-gray-500 dark:text-gray-400 py-6">
            Belum ada transkrip untuk episode ini.
          </p>

          <template v-else>
            <input :value="textSearch" type="search" placeholder="Masukan kata kunci" enterkeyhint="search"
              @input="textSearch = ($event.target as HTMLInputElement).value"
              class="w-full px-4 py-3 rounded-lg text-lg mb-4 focus:outline-none bg-gray-50 dark:bg-gray-600 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300" />

            <!-- Tampilan 1: semua teks -->
            <div v-if="viewMode === 'all'" class="space-y-4">
              <section v-for="group in filteredCallers" :key="group.caller">
                <button type="button" :aria-expanded="isGroupOpen(group.caller)" @click="toggleGroup(group.caller)"
                  class="w-full flex items-center gap-2 text-left text-sm font-bold tracking-wide uppercase text-[#8a6a1f] dark:text-yellow-400 pb-1.5 border-b border-gray-200 dark:border-gray-600"
                  :class="isGroupOpen(group.caller) ? 'mb-3' : ''">
                  <span class="flex-1">{{ group.label }}</span>
                  <span class="font-normal normal-case text-gray-500 dark:text-gray-400">{{ group.segments.length }} segmen</span>
                  <Icon :name="isGroupOpen(group.caller) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-5 h-5 shrink-0" />
                </button>
                <template v-if="isGroupOpen(group.caller)">
                <article v-for="seg in group.segments" :id="`seg-${seg.id}`" :key="seg.id"
                  class="mb-5 last:mb-0 rounded-lg px-2 py-1 -mx-2 scroll-mt-3 transition-colors"
                  :class="segmentHighlightClass(seg.id)">
                  <button class="font-bold text-left text-black dark:text-white hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                    @click="seekTo(seg.timestamp)">
                    {{ segmentNumber(seg.id) }}. {{ segmentCode(seg) }}
                    <Icon name="mdi:play-circle-outline" class="w-5 h-5 inline -mt-0.5 ml-0.5 text-[#8a6a1f] dark:text-yellow-400" />
                  </button>
                  <p v-if="seg.title_plain" class="mt-1 text-gray-700 dark:text-gray-300">[{{ seg.title_plain }}]</p>
                  <div class="audio2-content mt-2 text-black dark:text-white" v-html="highlight(seg.content)"></div>
                  <div class="flex items-center gap-6 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                    <button class="flex items-center gap-1 text-base text-gray-700 dark:text-gray-300 hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                      @click="copySegment(seg, group.label)">
                      <Icon name="mdi:content-copy" class="w-4 h-4" />
                      <span>Salin</span>
                    </button>
                    <button v-if="!onlySegment" class="flex items-center gap-1 text-base text-gray-700 dark:text-gray-300 hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                      @click="openSegmentDetail(seg)">
                      <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                      <span>Detail</span>
                    </button>
                    <button class="flex items-center gap-1 text-base hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                      :class="speakingId === seg.id ? 'text-[#8a6a1f] dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
                      @click="speakSegment(seg)">
                      <Icon :name="speakingId === seg.id ? 'mdi:stop' : 'mdi:account-voice'" class="w-4 h-4" />
                      <span>{{ speakingId === seg.id ? 'Stop' : 'Voice' }}</span>
                    </button>
                  </div>
                </article>
                </template>
              </section>
            </div>

            <!-- Tampilan 2: per penelepon -->
            <div v-else class="space-y-4">
              <section v-for="group in filteredCallers" :key="group.caller">
                <button type="button" :aria-expanded="isGroupOpen(group.caller)" @click="toggleGroup(group.caller)"
                  class="w-full flex items-center gap-2 text-left text-sm font-bold tracking-wide uppercase text-[#8a6a1f] dark:text-yellow-400 pb-1.5 border-b border-gray-200 dark:border-gray-600"
                  :class="isGroupOpen(group.caller) ? 'mb-2' : ''">
                  <span class="flex-1">{{ group.label }}</span>
                  <span class="font-normal normal-case text-gray-500 dark:text-gray-400">{{ group.segments.length }} segmen</span>
                  <Icon :name="isGroupOpen(group.caller) ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="w-5 h-5 shrink-0" />
                </button>
                <div v-if="isGroupOpen(group.caller)" class="space-y-2">
                  <div v-for="seg in group.segments" :id="`seg-${seg.id}`" :key="seg.id"
                    class="border rounded-lg overflow-hidden scroll-mt-3 transition-colors"
                    :class="activeSegmentId === seg.id ? 'border-[#c09637] dark:border-yellow-500' : 'border-gray-200 dark:border-gray-600'">
                    <div class="flex items-start gap-2 px-3 py-2">
                      <button class="flex-1 min-w-0 text-left" @click="seekTo(seg.timestamp)">
                        <span class="block font-semibold text-black dark:text-white">{{ segmentCode(seg) }}</span>
                        <span v-if="seg.title_plain" class="block mt-0.5 text-gray-700 dark:text-gray-300 leading-snug">[{{ seg.title_plain }}]</span>
                      </button>
                      <button :aria-label="isSegmentOpen(seg.id) ? 'Tutup isi segmen' : 'Buka isi segmen'"
                        class="p-1 shrink-0" @click="toggleSegment(seg.id)">
                        <Icon :name="isSegmentOpen(seg.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                          class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div v-if="isSegmentOpen(seg.id)" class="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
                      <div class="audio2-content mt-2 text-black dark:text-white" v-html="highlight(seg.content)"></div>
                      <div class="flex items-center gap-6 pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
                        <button class="flex items-center gap-1 text-base text-gray-700 dark:text-gray-300 hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                          @click="copySegment(seg, group.label)">
                          <Icon name="mdi:content-copy" class="w-4 h-4" />
                          <span>Salin</span>
                        </button>
                        <button v-if="!onlySegment" class="flex items-center gap-1 text-base text-gray-700 dark:text-gray-300 hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                          @click="openSegmentDetail(seg)">
                          <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                          <span>Detail</span>
                        </button>
                        <button class="flex items-center gap-1 text-base hover:text-[#8a6a1f] dark:hover:text-yellow-400"
                          :class="speakingId === seg.id ? 'text-[#8a6a1f] dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'"
                          @click="speakSegment(seg)">
                          <Icon :name="speakingId === seg.id ? 'mdi:stop' : 'mdi:account-voice'" class="w-4 h-4" />
                          <span>{{ speakingId === seg.id ? 'Stop' : 'Voice' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <p v-if="filteredCallers.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
              Tidak ada teks ditemukan
            </p>
          </template>
        </div>
      </div>
    </div>

    <audio ref="audioElement" preload="metadata" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata"
      @play="isPlaying = true" @pause="isPlaying = false" @ended="isPlaying = false" />

    <!-- Bottom player (Audio 1 style). In the list it replaces the bottom nav and is
         teleported so it stays visible while the row is swapped for its search box. -->
    <Teleport to="body" :disabled="!inline">
    <div v-if="isPageActive" class="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
      <slot name="above-player" />

      <div v-if="detail"
        class="bg-white dark:bg-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] p-4">
        <template v-if="isPlayerMinimized">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-lg text-gray-500 dark:text-gray-400">{{ isPlaying ? 'Sedang diputar' : 'Dijeda' }}</p>
              <p class="font-semibold text-black dark:text-white line-clamp-1">{{ detail.episode.title }}</p>
            </div>
            <button aria-label="Perbesar pemutar" class="p-2" @click="isPlayerMinimized = false">
              <Icon name="mdi:menu" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center justify-between mb-2">
            <p class="text-lg font-medium text-black dark:text-white flex-1 line-clamp-1">{{ detail.episode.title }}</p>
            <button v-if="inline" aria-label="Tutup pemutar" class="p-1" @click="emit('collapse')">
              <Icon name="mdi:close" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <input type="range" aria-label="Posisi audio" :value="currentTime" :max="duration || 0" step="1"
              class="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-primary"
              @input="onScrub" />
            <span class="text-xs text-gray-500 dark:text-gray-400 w-24 text-right tabular-nums">
              {{ formatTime(currentTime) }}/{{ formatTime(duration) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button :aria-label="isEpisodeBookmarked ? 'Sudah di-bookmark' : 'Bookmark'" class="p-1" @click="addBookmark">
                <Icon :name="isEpisodeBookmarked ? 'mdi:star' : 'mdi:star-outline'" class="w-6 h-6"
                  :class="isEpisodeBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'" />
              </button>
              <button aria-label="Bagikan" class="p-1" @click="share">
                <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button aria-label="Mundur 10 detik" class="p-2" @click="skip(-10)">
                <Icon name="mdi:rewind" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button :aria-label="isPlaying ? 'Jeda' : 'Putar'" @click="togglePlay"
                class="w-12 h-12 bg-primary dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-7 h-7 text-black" />
              </button>
              <button aria-label="Maju 10 detik" class="p-2" @click="skip(10)">
                <Icon name="mdi:fast-forward" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <button aria-label="Perkecil pemutar" class="p-1" @click="isPlayerMinimized = true">
              <Icon name="mdi:minus" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>
      </div>
    </div>
    </Teleport>

    <LazyBookmarkModal />
  </div>
</template>

<script setup lang="ts">
import type { Audio2Caller, Audio2Detail, Audio2Segment } from '~/types/audio2'
import { audio2DetailRoute, audio2FormatDate, audio2ShortDuration } from '~/utils/audio2'

const props = withDefaults(defineProps<{
  episodeId: number | string
  /** Segment to scroll to and highlight once loaded. */
  segmentId?: number | null
  /** Seconds to seek to once loaded (defaults to the segment's timestamp). */
  startAt?: number | null
  fontSize?: number
  /** Expanded inside the episode list: inline player, header collapses it. */
  inline?: boolean
  categoryTitle?: string
  /** Start playing as soon as the episode loads (the list opens a row by tapping it). */
  autoplay?: boolean
  /** Show only `segmentId` (what a segment's "Detail" button opens, like Audio 1). */
  onlySegment?: boolean
}>(), { segmentId: null, startAt: null, fontSize: 18, inline: false, categoryTitle: '', autoplay: false, onlySegment: false })

const emit = defineEmits<{ collapse: []; loaded: [detail: Audio2Detail] }>()

const router = useRouter()
const toast = useToast()
const api = useAudio2Api()

const detail = ref<Audio2Detail | null>(null)
const pending = ref(true)
const loadError = ref('')

const episodeMeta = computed(() => {
  if (!detail.value) return ''
  const ep = detail.value.episode
  return [audio2FormatDate(ep.aired_on), ep.segment_count ? `${ep.segment_count} segmen` : ''].filter(Boolean).join(' · ')
})

const hasTranscript = computed(() => (detail.value?.callers ?? []).some(c => c.segments.length > 0))

// Segment numbering runs across the whole episode, in API order.
const allSegments = computed(() => (detail.value?.callers ?? []).flatMap(c => c.segments))
const numberById = computed(() => new Map(allSegments.value.map((s, i) => [s.id, i + 1])))
const segmentNumber = (id: number) => numberById.value.get(id) ?? ''
const segmentCode = (seg: Audio2Segment) => [seg.code, seg.timestamp_formatted].filter(Boolean).join(' ')

// ---------------- View state ----------------
const viewMode = useState<'all' | 'caller'>('audio2-detail-view', () => 'all')
// Like Audio 1, the list opens a row with the text folded; the detail page shows it.
const showText = ref(!props.inline || props.segmentId != null)
const textSearch = ref('')
const expanded = ref<Set<number>>(new Set())
const focusSegmentId = ref<number | null>(null)

// Caller groups (Pembuka, Penelepon 1, ...) are dropdowns, folded by default.
// While a keyword is typed every group with a match is shown.
const openGroups = ref<Set<number>>(new Set())
const isSearching = computed(() => textSearch.value.trim() !== '')
const isGroupOpen = (caller: number) => isSearching.value || openGroups.value.has(caller)
const toggleGroup = (caller: number) => {
  const next = new Set(openGroups.value)
  if (isSearching.value) {
    // Folding while searching: stop forcing groups open, keep the others as they were.
    textSearch.value = ''
    next.delete(caller)
  } else if (next.has(caller)) next.delete(caller)
  else next.add(caller)
  openGroups.value = next
}
// Per-caller view: a keyword also unfolds the matching segments' text.
const isSegmentOpen = (id: number) => isSearching.value || expanded.value.has(id)

const toggleViewMode = () => { viewMode.value = viewMode.value === 'all' ? 'caller' : 'all' }
const toggleSegment = (id: number) => {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}

const plainText = (html: string) => {
  if (!import.meta.client) return html
  // Keep a break between paragraphs/lines so words don't run together.
  const spaced = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6])>/gi, '$&\n')
  const doc = new DOMParser().parseFromString(spaced, 'text/html')
  return (doc.body.textContent || '').replace(/[ \t]*\n[ \t]*/g, '\n').replace(/\n{3,}/g, '\n\n')
}

const visibleCallers = computed<Audio2Caller[]>(() => {
  const callers = detail.value?.callers ?? []
  if (!props.onlySegment || props.segmentId == null) return callers
  return callers
    .map(c => ({ ...c, segments: c.segments.filter(s => s.id === props.segmentId) }))
    .filter(c => c.segments.length > 0)
})

const filteredCallers = computed<Audio2Caller[]>(() => {
  const callers = visibleCallers.value
  const q = textSearch.value.trim().toLowerCase()
  if (!q) return callers.filter(c => c.segments.length > 0)
  return callers
    .map(c => ({
      ...c,
      segments: c.segments.filter(s =>
        (s.title_plain ?? '').toLowerCase().includes(q)
        || (s.code ?? '').toLowerCase().includes(q)
        || plainText(s.content).toLowerCase().includes(q)),
    }))
    .filter(c => c.segments.length > 0)
})

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Highlight the in-page keyword inside text nodes only, keeping the CMS markup. */
const highlight = (html: string) => {
  const q = textSearch.value.trim()
  if (!q || !import.meta.client) return html
  const container = document.createElement('div')
  container.innerHTML = html
  const regex = new RegExp(`(${escapeRegExp(q)})`, 'gi')
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (!regex.test(text)) return
      regex.lastIndex = 0
      const span = document.createElement('span')
      span.innerHTML = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(regex, '<mark class="bg-yellow-300 text-black">$1</mark>')
      node.parentNode?.replaceChild(span, node)
    } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName !== 'MARK') {
      Array.from(node.childNodes).forEach(walk)
    }
  }
  walk(container)
  return container.innerHTML
}

// ---------------- Player ----------------
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isPlayerMinimized = ref(false)

// In the list (a main tab), the player takes the bottom nav's place while it is open.
// Pages are kept alive: a cached page must drop its teleported player, its audio and the nav override.
const hideBottomNav = useState('hide-bottom-nav', () => false)
const isPageActive = ref(true)
onMounted(() => { if (props.inline) hideBottomNav.value = true })
onBeforeUnmount(() => { if (props.inline) hideBottomNav.value = false })
onActivated(() => {
  isPageActive.value = true
  if (props.inline) hideBottomNav.value = true
})
onDeactivated(() => {
  isPageActive.value = false
  audioElement.value?.pause()
  if (import.meta.client) window.speechSynthesis?.cancel()
  if (props.inline) hideBottomNav.value = false
})
let pendingSeek: number | null = null

/** Segment whose timestamp is the latest one at or before the playhead. */
const activeSegmentId = computed(() => {
  if (!isPlaying.value && currentTime.value === 0) return null
  let active: number | null = null
  let best = -1
  for (const s of allSegments.value) {
    if (s.timestamp <= currentTime.value + 0.5 && s.timestamp >= best) {
      best = s.timestamp
      active = s.id
    }
  }
  return active
})

const segmentHighlightClass = (id: number) => {
  if (focusSegmentId.value === id) return 'bg-yellow-100 dark:bg-gray-700'
  if (activeSegmentId.value === id) return 'bg-[#fff3be] dark:bg-gray-700/60'
  return ''
}

function ensureSource() {
  const el = audioElement.value
  if (!el || !detail.value) return null
  if (!el.src) el.src = detail.value.episode.url
  return el
}

async function play() {
  const el = ensureSource()
  if (!el) return
  try {
    await el.play()
  } catch (e) {
    // Autoplay may be blocked until the user taps play; the seek still applies.
    console.warn('Audio 2 play blocked', e)
  }
}

function togglePlay() {
  const el = ensureSource()
  if (!el) return
  if (el.paused) play()
  else el.pause()
}

function seekTo(seconds: number) {
  const el = ensureSource()
  if (!el) return
  if (el.readyState >= 1) el.currentTime = seconds
  else pendingSeek = seconds
  currentTime.value = seconds
  play()
}

function skip(delta: number) {
  const el = ensureSource()
  if (!el) return
  el.currentTime = Math.max(0, Math.min(el.currentTime + delta, duration.value || el.currentTime + delta))
}

function onScrub(e: Event) {
  const el = ensureSource()
  if (el) el.currentTime = Number((e.target as HTMLInputElement).value)
}

function onTimeUpdate() {
  if (audioElement.value) currentTime.value = audioElement.value.currentTime
}

function onLoadedMetadata() {
  const el = audioElement.value
  if (!el) return
  duration.value = el.duration
  if (pendingSeek != null) {
    el.currentTime = pendingSeek
    pendingSeek = null
  }
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

onBeforeUnmount(() => {
  audioElement.value?.pause()
  if (import.meta.client) window.speechSynthesis?.cancel()
})

// ---------------- Load + deep link ----------------
async function load() {
  pending.value = true
  loadError.value = ''
  try {
    detail.value = await api.fetchDetail(String(props.episodeId))
  } catch (e: any) {
    detail.value = null
    loadError.value = e?.statusCode === 404 || e?.status === 404 ? 'Episode tidak ditemukan' : 'Gagal memuat episode'
    console.error('Failed to load Audio 2 episode', e)
  } finally {
    pending.value = false
  }
  if (!detail.value) return
  emit('loaded', detail.value)
  await nextTick()
  ensureSource() // loads metadata so the player shows the real duration

  const segment = props.segmentId != null ? allSegments.value.find(s => s.id === props.segmentId) : undefined
  const startAt = props.startAt ?? segment?.timestamp

  if (segment) {
    focusSegmentId.value = segment.id
    expanded.value = new Set([segment.id])
    const group = detail.value.callers.find(c => c.segments.some(s => s.id === segment.id))
    if (group) openGroups.value = new Set([group.caller])
    await nextTick()
    document.getElementById(`seg-${segment.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  if (startAt != null) {
    await nextTick()
    seekTo(startAt)
  } else if (props.autoplay) {
    play()
  }
}

onMounted(load)
watch(() => props.episodeId, () => {
  audioElement.value?.pause()
  if (audioElement.value) audioElement.value.removeAttribute('src')
  currentTime.value = 0
  duration.value = 0
  focusSegmentId.value = null
  expanded.value = new Set()
  openGroups.value = new Set()
  load()
})

// ---------------- Segment actions ----------------
async function copySegment(seg: Audio2Segment, callerLabel: string) {
  const parts = [
    detail.value?.episode.title,
    `${callerLabel} · ${segmentCode(seg)}`,
    seg.title_plain ? `[${seg.title_plain}]` : '',
    plainText(seg.content).trim(),
  ].filter(Boolean)
  try {
    await navigator.clipboard.writeText(parts.join('\n\n'))
    toast.add({ title: 'Teks disalin', color: 'success' })
  } catch {
    toast.add({ title: 'Gagal menyalin teks', color: 'error' })
  }
}

const speakingId = ref<number | null>(null)
function speakSegment(seg: Audio2Segment) {
  if (!import.meta.client || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  if (speakingId.value === seg.id) {
    speakingId.value = null
    return
  }
  const utterance = new SpeechSynthesisUtterance(plainText(seg.content))
  utterance.lang = 'id-ID'
  utterance.onstart = () => { speakingId.value = seg.id }
  utterance.onend = utterance.onerror = () => { if (speakingId.value === seg.id) speakingId.value = null }
  window.speechSynthesis.speak(utterance)
}

// ---------------- Bookmark (same type as Audio 1, marked as Audio 2) ----------------
const { createAudio2Bookmark, fetchBookmarksByType, isAudio2Bookmarked } = useBookmark()
const isEpisodeBookmarked = computed(() => !!detail.value && isAudio2Bookmarked(detail.value.episode.id))
onMounted(() => { fetchBookmarksByType(2) })
function addBookmark() {
  if (!detail.value) return
  createAudio2Bookmark(detail.value.episode.title, detail.value.episode.id, detail.value.category.id)
}

function openSegmentDetail(seg: Audio2Segment) {
  if (!detail.value) return
  const target = audio2DetailRoute(detail.value.episode.id, { segmentId: seg.id, timestamp: seg.timestamp }) as { path: string; query: Record<string, string> }
  router.push({ ...target, query: { ...target.query, only: '1' } })
}

function share() {
  if (!detail.value) return
  const url = new URL(`${window.location.origin}/audio2/${detail.value.episode.id}`)
  const t = Math.floor(currentTime.value)
  if (t > 0) url.searchParams.set('t', String(t))
  const title = `${detail.value.category.title} - ${detail.value.episode.title}`
  if (navigator.share) {
    navigator.share({ title, text: title, url: url.toString() }).catch(() => {})
  } else {
    navigator.clipboard.writeText(`${title}\n${url}`)
      .then(() => toast.add({ title: 'Link disalin ke clipboard', color: 'success' }))
      .catch(() => toast.add({ title: 'Gagal menyalin link', color: 'error' }))
  }
}

defineExpose({ detail, currentTime, share })
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #ffca03;
  border-radius: 50%;
  cursor: pointer;
}

.audio2-content :deep(p) {
  margin: 0 0 0.6em;
  line-height: 1.6;
}

.audio2-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>

<style>
/* CMS speaker labels / highlights use bright backgrounds: keep their text dark in dark mode. */
.dark .audio2-content span[style*="background-color"],
.dark .audio2-content mark {
  color: #000000 !important;
}
</style>
