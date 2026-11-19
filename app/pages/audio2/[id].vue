<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button aria-label="Kembali" @click="goBack()"
        class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1 line-clamp-1">{{ pageTitle }}</h1>
      <button aria-label="Informasi" @click="showInfoModal = true"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
        <Icon name="mdi:information" class="w-6 h-6 text-primary dark:text-yellow-400" />
      </button>
      <button aria-label="Bagikan" @click="shareEpisode" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <div class="relative">
        <button aria-label="Menu lainnya" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          @click="showMenu = !showMenu">
          <Icon name="mdi:dots-vertical" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <div v-if="showMenu"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <button @click="openFindInPage"
            class="w-full px-4 py-3 text-left text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 rounded-lg">
            <Icon name="mdi:magnify" class="w-5 h-5" />
            <span>Cari di Halaman</span>
          </button>
        </div>
      </div>
    </div>

    <FindInPage :is-open="showFindInPage" target-selector="#audio2-content" @close="showFindInPage = false" />

    <div id="audio2-content" ref="scrollContainer" class="flex-1 overflow-y-auto p-4 pb-48">
      <Audio2EpisodeView ref="episodeView" :key="viewKey" :episode-id="episodeId" :segment-id="segmentParam"
        :start-at="tParam" :only-segment="route.query.only === '1'" :font-size="fontSize" @loaded="detail = $event">
        <template #above-player>
          <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-0 bottom-full z-10" @zoomIn="zoomIn"
            @zoomOut="zoomOut" @scrollTop="scrollToTop" />
        </template>
      </Audio2EpisodeView>
    </div>

    <UModal v-model:open="showInfoModal" title="Informasi Audio">
      <template #body>
        <div v-if="isLoadingInfo" class="flex justify-center py-8">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
        </div>
        <div v-else-if="infoDescription" class="text-base leading-relaxed whitespace-pre-line text-black dark:text-white"
          v-html="processHtmlForDisplay(infoDescription)"></div>
        <p v-else class="text-center py-8 text-gray-500 dark:text-gray-400">Tidak ada informasi tersedia</p>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Audio2Detail } from '~/types/audio2'
import { processHtmlForDisplay } from '~/utils/html'

const { goBack } = useSmartBack()
const route = useRoute()
const config = useRuntimeConfig()

const episodeId = computed(() => String(route.params.id))
const optionalNumber = (v: unknown) => {
  if (v === undefined || v === null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
// Deep link: ?t=seconds&segment=id
const segmentParam = computed(() => optionalNumber(route.query.segment))
const tParam = computed(() => optionalNumber(route.query.t))
// Remount on a new episode, segment or single-segment mode (e.g. the Detail button).
const viewKey = computed(() => `${episodeId.value}-${route.query.segment ?? ''}-${route.query.only ?? ''}`)

const detail = ref<Audio2Detail | null>(null)
const episodeView = ref<{ share: () => void } | null>(null)
watch(episodeId, () => { detail.value = null })

const pageTitle = computed(() => {
  if (!detail.value) return 'Audio'
  const year = detail.value.episode.year
  return year ? `${detail.value.category.title} ${year}` : detail.value.category.title
})
useHead({ title: () => detail.value?.episode.title ?? 'Audio' })

// ---------------- Actions ----------------
const showFabMenu = ref(false)
const fontSize = ref(18)
const showMenu = ref(false)
const showFindInPage = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)

const zoomIn = () => { fontSize.value = Math.min(fontSize.value + 2, 26) }
const zoomOut = () => { fontSize.value = Math.max(fontSize.value - 2, 12) }
const scrollToTop = () => scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
const openFindInPage = () => {
  showMenu.value = false
  showFindInPage.value = true
}

const shareEpisode = () => episodeView.value?.share()

// Same "Informasi Audio" text as Audio 1.
const showInfoModal = ref(false)
const infoDescription = ref('')
const isLoadingInfo = ref(false)
watch(showInfoModal, async (open) => {
  if (!open || infoDescription.value) return
  isLoadingInfo.value = true
  try {
    const res = await $fetch<{ success: boolean; data: { description: string }[] }>(
      `${config.public.apiBaseUrl}/information?type=audio`)
    if (res.success && res.data.length > 0) infoDescription.value = res.data[0]!.description
  } catch (e) {
    console.error('Failed to fetch audio information', e)
  } finally {
    isLoadingInfo.value = false
  }
})
</script>
