<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm shrink-0">
      <button @click="goBack()"
        class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white flex-1">{{ pageTitle }}</h1>
      <button @click="showAudioInfoModal = true"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
        <Icon name="mdi:information" class="w-6 h-6 text-primary dark:text-yellow-400" />
      </button>
      <button @click="shareContent" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
        <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <div class="relative">
        <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" @click="showMenu = !showMenu">
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

    <!-- Find In Page Component -->
    <FindInPage :is-open="showFindInPage" target-selector="#audio-content" @close="showFindInPage = false" />

    <!-- Content -->
    <div id="audio-content" class="flex-1 overflow-y-auto p-4 pb-40">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div class="flex gap-2 overflow-x-auto pb-2">
          <div v-for="i in 6" :key="i"
            class="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0"></div>
        </div>
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 animate-pulse">
          <div class="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>

      <template v-else>
        <!-- Category Tabs -->
        <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button v-for="group in audioGroups" :key="group.id" @click="selectGroup(group.id)"
            class="shrink-0 px-4 py-2 rounded-full text-lg font-medium transition-colors" :class="selectedGroupId === group.id
              ? 'bg-primary text-black dark:bg-yellow-500'
              : 'bg-primary/40 text-black dark:bg-gray-700 dark:text-gray-300'">
            {{ group.name }}
          </button>
        </div>

        <!-- Group Search Input -->
        <div v-if="selectedGroupId" class="mb-4">
          <div class="flex items-center gap-3">
            <input v-model="groupSearchQuery" type="text" placeholder="Cari dalam kategori ini..."
              class="flex-1 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
              @keyup.enter="handleGroupSearch" />
            <button v-if="groupSearchQuery.trim()" @click="handleGroupSearch"
              class="px-3 py-2 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded">
              Cari
            </button>
            <button v-if="hasGroupSearched" @click="clearGroupSearch"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>
        </div>

        <!-- Group Search Results -->
        <div v-if="hasGroupSearched">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              HASIL PENCARIAN "{{ groupSearchedKeyword }}"
            </p>
          </div>

          <!-- Loading -->
          <div v-if="isGroupSearching" class="flex justify-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
          </div>

          <!-- Results List -->
          <div v-else-if="groupSearchResults.length > 0" class="space-y-4">
            <SearchResultCard v-for="item in groupSearchResults"
              :key="`grp-search-${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`" :item="item"
              :is-expanded="expandedGroupSearchItems.has(`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`)"
              :font-size="fontSize"
              :is-speaking="groupSearchSpeakingItemId === `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
              :search-keyword="groupSearchedKeyword" @toggle="toggleGroupSearchExpand(item)"
              @navigate="navigateToSearchResult(item)" @speak="speakGroupSearchContent(item)" />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
          </div>
        </div>

        <!-- Audio List for Selected Group -->
        <div v-else class="space-y-2">
          <div v-for="audio in selectedGroupAudios" :key="audio.id">
            <!-- Audio Item Header with Search -->
            <div v-if="!audioSearchModes[audio.id]" class="relative"
              :class="currentAudio?.id === audio.id ? '' : 'flex gap-2 items-center'">
              <!-- Audio Item - Not Selected -->
              <button v-if="currentAudio?.id !== audio.id" @click="playAudio(audio)"
                class="flex-1 flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                :style="{ fontSize: fontSize + 'px' }">
                <div
                  class="w-14 h-14 bg-gradient-to-b from-[#c9a227] to-[#8b7355] rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="mdi:music-note" class="w-8 h-8 text-white" />
                </div>
                <div class="flex-1 text-left">
                  <p class="font-medium text-black dark:text-white line-clamp-2 text-lg">{{ audio.title.trim() }}</p>
                </div>
                <span class="text-gray-500 dark:text-gray-400 shrink-0">{{ audio.duration }}</span>
              </button>

              <!-- Audio Item - Selected (with Player & Show Teks) -->
              <div v-else class="bg-[#c09637] dark:bg-yellow-600 rounded-2xl overflow-hidden"
                :style="{ fontSize: fontSize + 'px' }">
                <!-- Player Header -->
                <div class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <button @click="togglePlay" class="shrink-0">
                      <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-6 h-6 text-black" />
                    </button>
                    <p class="font-medium text-black flex-1 line-clamp-1 text-lg">{{ audio.title.trim() }}</p>
                    <span class="text-black shrink-0">{{ audio.duration }}</span>
                  </div>
                </div>

                <!-- Show Teks Accordion -->
                <div class="bg-white dark:bg-gray-800 mx-3 mb-3 rounded-xl overflow-hidden">
                  <button @click="showSubtitle = !showSubtitle"
                    class="w-full flex items-center justify-between px-4 py-3">
                    <span class="text-lg font-medium text-black dark:text-white">Show Teks</span>
                    <div class="flex items-center gap-1">
                      <!-- View Mode Toggle -->
                      <button v-if="showSubtitle" @click.stop="toggleSubtitleViewMode"
                        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center justify-center"
                        title="Toggle view mode">
                        <Icon :name="subtitleViewMode === 'list' ? 'mdi:view-list' : 'mdi:view-sequential'"
                          class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <div class="p-1 flex items-center justify-center">
                        <Icon :name="showSubtitle ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                          class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                  </button>

                  <!-- Subtitle Content -->
                  <div v-if="showSubtitle" class="px-2 pb-3">
                    <!-- Search Input -->
                    <input v-model="subtitleSearch" type="text" placeholder="Masukan kata kunci"
                      class="w-full px-4 py-3 rounded-lg text-lg mb-4 focus:outline-none bg-gray-50 dark:bg-gray-600 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />

                    <!-- Subtitle List - Mode A (List View) -->
                    <div v-if="subtitleViewMode === 'list'" class="space-y-4">
                      <div v-for="sub in filteredSubtitles" :key="sub.id" class="rounded-lg p-1 text-lg"
                        :style="{ fontSize: fontSize + 'px' }">
                        <p class="font-semibold text-black dark:text-white mb-2 cursor-pointer hover:text-primary dark:hover:text-yellow-400"
                          @click="seekToTimestamp(sub.timestamp)">{{ sub.order }}. {{ sub.title }}</p>
                        <p class="text-black dark:text-gray-400 mb-2 text-md" v-html="sub.description"></p>
                        <div class="text-black dark:text-white mb-4 text-md" v-html="highlightText(sub.script)"></div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <button @click="copySubtitle(sub)"
                            class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                            <Icon name="mdi:content-copy" class="w-4 h-4" />
                            <span>Salin</span>
                          </button>
                          <button @click="viewDetail(sub)"
                            class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                            <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                            <span>Detail</span>
                          </button>
                          <button @click="speakSubtitle(sub)"
                            class="flex items-center gap-1 text-lg hover:text-primary dark:hover:text-yellow-400"
                            :class="speakingSubtitleId === sub.id ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
                            <Icon :name="speakingSubtitleId === sub.id ? 'mdi:stop' : 'mdi:account-voice'"
                              class="w-4 h-4" />
                            <span>{{ speakingSubtitleId === sub.id ? 'Stop' : 'Voice' }}</span>
                          </button>
                        </div>
                      </div>
                      <p v-if="filteredSubtitles.length === 0"
                        class="text-lg text-gray-500 dark:text-gray-400 text-center py-4">
                        Tidak ada teks ditemukan
                      </p>
                    </div>

                    <!-- Subtitle List - Mode B (Accordion View) -->
                    <div v-else class="space-y-2">
                      <div v-for="sub in filteredSubtitles" :key="sub.id"
                        class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                        :style="{ fontSize: fontSize + 'px' }">
                        <!-- Accordion Header -->
                        <button @click="toggleAccordion(sub.id)"
                          class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <p class="font-semibold text-black dark:text-white text-left flex-1 cursor-pointer hover:text-primary dark:hover:text-yellow-400"
                            @click.stop="seekToTimestamp(sub.timestamp)">{{ sub.title }}</p>
                          <Icon :name="expandedSubtitles.has(sub.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                            class="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                        </button>

                        <!-- Accordion Content -->
                        <div v-if="expandedSubtitles.has(sub.id)"
                          class="px-3 pb-3 border-t border-gray-200 dark:border-gray-600">
                          <p class="text-black dark:text-gray-400 mb-2 text-md mt-2" v-html="sub.description"></p>
                          <div class="text-black dark:text-white mb-4 text-md" v-html="highlightText(sub.script)"></div>

                          <!-- Action Buttons -->
                          <div class="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <button @click="copySubtitle(sub)"
                              class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                              <Icon name="mdi:content-copy" class="w-4 h-4" />
                              <span>Salin</span>
                            </button>
                            <button @click="viewDetail(sub)"
                              class="flex items-center gap-1 text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400">
                              <Icon name="mdi:file-document-outline" class="w-4 h-4" />
                              <span>Detail</span>
                            </button>
                            <button @click="speakSubtitle(sub)"
                              class="flex items-center gap-1 text-lg hover:text-primary dark:hover:text-yellow-400"
                              :class="speakingSubtitleId === sub.id ? 'text-primary dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300'">
                              <Icon :name="speakingSubtitleId === sub.id ? 'mdi:stop' : 'mdi:account-voice'"
                                class="w-4 h-4" />
                              <span>{{ speakingSubtitleId === sub.id ? 'Stop' : 'Voice' }}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <p v-if="filteredSubtitles.length === 0"
                        class="text-lg text-gray-500 dark:text-gray-400 text-center py-4">
                        Tidak ada teks ditemukan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search Icon - Positioned absolutely at top center, slightly outside -->
              <button v-if="currentAudio?.id !== audio.id" @click="openAudioSearch(audio.id)"
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Icon name="mdi:magnify" class="w-6 h-6 text-black dark:text-white" />
              </button>

              <button v-else @click="openAudioSearch(audio.id)"
                class="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10 border-2 border-[#c09637] dark:border-yellow-600">
                <Icon name="mdi:magnify" class="w-4 h-4 text-black dark:text-white" />
              </button>
            </div>

            <!-- Audio Search Input -->
            <div v-else class="flex items-center gap-3 mb-2">
              <input v-model="audioSearchQueries[audio.id]" type="text" placeholder="Cari dalam audio ini..."
                class="flex-1 text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                @keyup.enter="handleAudioSearch(audio.id)" autofocus />
              <button v-if="audioSearchQueries[audio.id]?.trim()" @click="handleAudioSearch(audio.id)"
                class="px-3 py-2 bg-primary hover:bg-primary/90 text-black text-sm font-medium rounded">
                Cari
              </button>
              <button @click="closeAudioSearch(audio.id)" class="p-1">
                <Icon name="mdi:close" class="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>

            <!-- Audio Search Results -->
            <div
              v-if="audioSearchLoading[audio.id] || audioSearchResults[audio.id]?.length > 0 || (audioSearchModes[audio.id] && audioSearchQueries[audio.id]?.trim() && !audioSearchLoading[audio.id] && audioSearchResults[audio.id]?.length === 0)">
              <!-- Loading -->
              <div v-if="audioSearchLoading[audio.id]" class="flex justify-center py-8">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
              </div>

              <!-- Results List -->
              <div v-else-if="audioSearchResults[audio.id]?.length > 0" class="space-y-4 mb-4">
                <SearchResultCard v-for="item in audioSearchResults[audio.id]"
                  :key="`aud-${audio.id}-${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                  :item="item"
                  :is-expanded="expandedAudioSearchItems[audio.id]?.has(`${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`)"
                  :font-size="fontSize"
                  :is-speaking="speakingAudioItemId[audio.id] === `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`"
                  :search-keyword="audioSearchQueries[audio.id]" @toggle="toggleAudioSearchExpand(audio.id, item)"
                  @navigate="navigateToSearchResult(item)" @speak="speakAudioSearchContent(audio.id, item)" />
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Tidak ada hasil ditemukan</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Hidden Audio Element -->
    <audio ref="audioElement" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @ended="onEnded" />

    <!-- Bottom Section Container -->
    <div class="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <!-- Floating Action Button (positioned above bottom drawer) - Lazy loaded -->
      <LazyFabZoom v-model:isOpen="showFabMenu" class="absolute right-0 bottom-full z-10" @zoomIn="zoomIn"
        @zoomOut="zoomOut" @scrollTop="scrollToTop" />

      <!-- Bottom Audio Player Drawer -->
      <div v-if="currentAudio"
        class="bg-white dark:bg-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] p-4">
        <!-- Minimized View -->
        <template v-if="isPlayerMinimized">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-lg text-gray-500 dark:text-gray-400">Sedang diputar</p>
              <p class="font-semibold text-black dark:text-white line-clamp-1">{{ currentAudio.title.trim() }}</p>
            </div>
            <button @click="isPlayerMinimized = false" class="p-2">
              <Icon name="mdi:menu" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>

        <!-- Expanded View -->
        <template v-else>
          <div class="flex items-center justify-between mb-2">
            <p class="text-lg font-medium text-black dark:text-white flex-1 line-clamp-1">{{ currentAudio.title.trim()
            }}</p>
            <button @click="closePlayer" class="p-1">
              <Icon name="mdi:close" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="flex items-center gap-2 mb-3">
            <input type="range" :value="currentTime" :max="duration" @input="seek"
              class="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-primary" />
            <span class="text-xs text-gray-500 dark:text-gray-400 w-20 text-right">{{ formatTime(currentTime) }}/{{
              formatTime(duration) }}</span>
          </div>

          <!-- Controls -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button class="p-1" @click="addToBookmark">
                <Icon :name="isAudioBookmarked ? 'mdi:star' : 'mdi:star-outline'"
                  :class="isAudioBookmarked ? 'text-yellow-500' : 'text-gray-600 dark:text-gray-400'" class="w-6 h-6" />
              </button>
              <button class="p-1" @click="shareContent">
                <Icon name="mdi:share-variant-outline" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button @click="skipBackward" class="p-2">
                <Icon name="mdi:rewind" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <button @click="togglePlay"
                class="w-12 h-12 bg-primary dark:bg-yellow-500 rounded-full flex items-center justify-center">
                <Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-7 h-7 text-black" />
              </button>
              <button @click="skipForward" class="p-2">
                <Icon name="mdi:fast-forward" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <button class="p-1" @click="isPlayerMinimized = true">
              <Icon name="mdi:minus" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Bookmark Modal - Lazy loaded -->
    <LazyBookmarkModal />

    <!-- Audio Information Modal -->
    <UModal v-model:open="showAudioInfoModal" title="Informasi Audio">
      <template #body>
        <div v-if="isLoadingAudioInfo" class="flex justify-center py-8">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
        </div>

        <div v-else-if="audioInfoDescription" class="text-black dark:text-white">
          <div class="text-base leading-relaxed" v-html="audioInfoDescription"></div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Tidak ada informasi tersedia</p>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useBookmark } from '~/composables/useBookmark'
import { useHistory } from '~/composables/useHistory'
import { useSmartBack } from '~/composables/useSmartBack'
import { ref, computed, watch, onMounted } from "vue"
import type { SearchItem } from '~/types/search'

const { goBack } = useSmartBack()
const router = useRouter()

interface Subtitle {
  id: number
  title: string
  timestamp: number
  script: string
  script_wa: string
  description: string
  description_wa: string
  order: number
}

interface AudioItem {
  id: number
  sub_group_id: number
  title: string
  url: string
  order: number
  duration: string
  translate_id: number
  translate_ch: number
  subtitle: Subtitle[]
}

interface AudioGroup {
  id: number
  audio_category_id: number
  name: string
  order: number
  have_child: number
  audio: AudioItem[]
}

const route = useRoute()
const config = useRuntimeConfig()
const categoryId = computed(() => route.params.id)
const pageTitle = computed(() => (route.query.title as string) || 'Audio')

// History
const { saveAudioHistory } = useHistory()

const { data: audioData, pending } = await useFetch<{ success: boolean; data: AudioGroup[] }>(
  () => `${config.public.apiBaseUrl}/audio?audio_category_id=${categoryId.value}`
)

const audioGroups = computed(() => audioData.value?.data?.sort((a, b) => a.order - b.order) || [])

// Per-audio search state
const audioSearchModes = ref<Record<number, boolean>>({})
const audioSearchQueries = ref<Record<number, string>>({})
const audioSearchResults = ref<Record<number, SearchItem[]>>({})
const audioSearchLoading = ref<Record<number, boolean>>({})
const expandedAudioSearchItems = ref<Record<number, Set<string>>>({})
const speakingAudioItemId = ref<Record<number, string | null>>({})

// Group search state (for searching all audios in selected group)
const groupSearchQuery = ref('')
const groupSearchedKeyword = ref('')
const hasGroupSearched = ref(false)
const isGroupSearching = ref(false)
const groupSearchResults = ref<SearchItem[]>([])
const expandedGroupSearchItems = ref<Set<string>>(new Set())
const groupSearchSpeakingItemId = ref<string | null>(null)
const isGroupSearchSpeaking = ref(false)

// Per-audio search functions
const handleAudioSearch = async (audioId: number) => {
  const query = audioSearchQueries.value[audioId]
  if (!query || !query.trim()) {
    audioSearchResults.value[audioId] = []
    return
  }

  audioSearchLoading.value[audioId] = true

  try {
    // Build query parameters
    const params = new URLSearchParams()
    params.append('keyword', query.trim())
    params.append('page', '1')
    params.append('paginate', '20')
    params.append('selectedCategory[]', 'Audio')
    params.append('audio_ids[]', audioId.toString())

    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?${params.toString()}`, {
      method: 'GET'
    })

    audioSearchResults.value[audioId] = response.data || []
  } catch (error) {
    console.error('Audio search failed:', error)
    audioSearchResults.value[audioId] = []
  } finally {
    audioSearchLoading.value[audioId] = false
  }
}

const toggleAudioSearchExpand = (audioId: number, item: SearchItem) => {
  if (!expandedAudioSearchItems.value[audioId]) {
    expandedAudioSearchItems.value[audioId] = new Set()
  }

  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  const expandedSet = expandedAudioSearchItems.value[audioId]

  if (expandedSet.has(key)) {
    expandedSet.delete(key)
  } else {
    expandedSet.add(key)
  }

  expandedAudioSearchItems.value[audioId] = new Set(expandedSet)
}

const speakAudioSearchContent = (audioId: number, item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (speakingAudioItemId.value[audioId] === itemKey) {
    window.speechSynthesis.cancel()
    speakingAudioItemId.value[audioId] = null
    return
  }

  window.speechSynthesis.cancel()

  const text = item.full_detail
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    speakingAudioItemId.value[audioId] = itemKey
  }

  utterance.onend = () => {
    speakingAudioItemId.value[audioId] = null
  }

  utterance.onerror = () => {
    speakingAudioItemId.value[audioId] = null
  }

  window.speechSynthesis.speak(utterance)
}

const openAudioSearch = (audioId: number) => {
  // Close all other open search inputs
  Object.keys(audioSearchModes.value).forEach(key => {
    const id = Number(key)
    if (id !== audioId && audioSearchModes.value[id]) {
      closeAudioSearch(id)
    }
  })

  audioSearchModes.value[audioId] = true
  audioSearchQueries.value[audioId] = ''
  audioSearchResults.value[audioId] = []
  if (!expandedAudioSearchItems.value[audioId]) {
    expandedAudioSearchItems.value[audioId] = new Set()
  }
}

const closeAudioSearch = (audioId: number) => {
  audioSearchModes.value[audioId] = false
  audioSearchQueries.value[audioId] = ''
  audioSearchResults.value[audioId] = []
  if (expandedAudioSearchItems.value[audioId]) {
    expandedAudioSearchItems.value[audioId].clear()
  }
  speakingAudioItemId.value[audioId] = null
  window.speechSynthesis.cancel()
}

const navigateToSearchResult = (item: SearchItem) => {
  const itemType = item.type.toLowerCase()

  if (itemType === 'audio') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'video') {
    const videoId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/video/detail', query: { video_id: videoId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik1' || itemType === 'topic1') {
    const audioId = item.header_id || ''
    const subtitleId = item.id || ''
    router.push({ path: '/audio/detail', query: { audio_id: audioId, subtitle_id: subtitleId } })
  } else if (itemType === 'topik2' || itemType === 'topic2') {
    const headerId = item.header_id ? String(item.header_id) : ''
    router.push(`/topics2/content/${headerId}`)
  } else if (itemType === 'topik3' || itemType === 'topic3') {
    const headerId = item.header_id ? String(item.header_id) : ''
    router.push(`/topics3/content/${headerId}`)
  } else if (itemType === 'book' || itemType === 'buku') {
    const headerId = item.header_id ? String(item.header_id) : ''
    const parts = headerId.split('#')
    const [, chapterId, page] = parts
    router.push({ path: `/book/${chapterId}`, query: { page } })
  }
}

// Selected Group State - persisted across navigation
const selectedGroupId = useState<number | null>(`audio-selected-group-${categoryId.value}`, () => null)

// Set default selected group when data loads
watch(audioGroups, (groups) => {
  if (groups.length > 0 && selectedGroupId.value === null) {
    selectedGroupId.value = groups[0].id
  }
}, { immediate: true })

// Select group and clear group search
const selectGroup = (groupId: number) => {
  selectedGroupId.value = groupId
  clearGroupSearch()
}

// Group search functions
const handleGroupSearch = async () => {
  if (!groupSearchQuery.value.trim() || !selectedGroupId.value) return

  groupSearchedKeyword.value = groupSearchQuery.value.trim()
  hasGroupSearched.value = true
  isGroupSearching.value = true
  groupSearchResults.value = []

  try {
    const group = audioGroups.value.find(g => g.id === selectedGroupId.value)
    if (!group) return

    const audioIds = group.audio.map(audio => audio.id)

    // Build query parameters
    const params = new URLSearchParams()
    params.append('keyword', groupSearchedKeyword.value)
    params.append('page', '1')
    params.append('paginate', '20')
    params.append('selectedCategory[]', 'Audio')
    audioIds.forEach(id => params.append('audio_ids[]', id.toString()))

    const response = await $fetch<{
      success: boolean
      message: string
      data: SearchItem[]
    }>(`${config.public.apiBaseUrl}/search?${params.toString()}`, {
      method: 'GET'
    })

    groupSearchResults.value = response.data || []
  } catch (error) {
    console.error('Group search failed:', error)
  } finally {
    isGroupSearching.value = false
  }
}

const clearGroupSearch = () => {
  groupSearchQuery.value = ''
  groupSearchedKeyword.value = ''
  hasGroupSearched.value = false
  groupSearchResults.value = []
  expandedGroupSearchItems.value.clear()
  isGroupSearchSpeaking.value = false
  groupSearchSpeakingItemId.value = null
  window.speechSynthesis.cancel()
}

const toggleGroupSearchExpand = (item: SearchItem) => {
  const key = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`
  if (expandedGroupSearchItems.value.has(key)) {
    expandedGroupSearchItems.value.delete(key)
  } else {
    expandedGroupSearchItems.value.add(key)
  }
  expandedGroupSearchItems.value = new Set(expandedGroupSearchItems.value)
}

const speakGroupSearchContent = (item: SearchItem) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  const itemKey = `${item.type}-${item.header_id}-${item.id}-${item.timestamp || ''}`

  if (isGroupSearchSpeaking.value && groupSearchSpeakingItemId.value === itemKey) {
    window.speechSynthesis.cancel()
    isGroupSearchSpeaking.value = false
    groupSearchSpeakingItemId.value = null
    return
  }

  window.speechSynthesis.cancel()

  const text = item.full_detail
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    isGroupSearchSpeaking.value = true
    groupSearchSpeakingItemId.value = itemKey
  }

  utterance.onend = () => {
    isGroupSearchSpeaking.value = false
    groupSearchSpeakingItemId.value = null
  }

  utterance.onerror = () => {
    isGroupSearchSpeaking.value = false
    groupSearchSpeakingItemId.value = null
  }

  window.speechSynthesis.speak(utterance)
}

const selectedGroupAudios = computed(() => {
  const group = audioGroups.value.find(g => g.id === selectedGroupId.value)
  return group?.audio || []
})

// Audio Player State - persisted across navigation
const audioElement = ref<HTMLAudioElement | null>(null)
const currentAudioId = useState<number | null>(`audio-current-id-${categoryId.value}`, () => null)
const currentAudio = computed(() => {
  if (!currentAudioId.value) return null
  for (const group of audioGroups.value) {
    const audio = group.audio.find(a => a.id === currentAudioId.value)
    if (audio) return audio
  }
  return null
})
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

// Subtitle State
const showSubtitle = ref(false)
const subtitleSearch = ref('')
const subtitleViewMode = ref<'list' | 'accordion'>('list')
const expandedSubtitles = ref<Set<number>>(new Set())

const toggleSubtitleViewMode = () => {
  subtitleViewMode.value = subtitleViewMode.value === 'list' ? 'accordion' : 'list'
}

const toggleAccordion = (subtitleId: number) => {
  if (expandedSubtitles.value.has(subtitleId)) {
    expandedSubtitles.value.delete(subtitleId)
  } else {
    expandedSubtitles.value.add(subtitleId)
  }
  expandedSubtitles.value = new Set(expandedSubtitles.value)
}

// FAB Menu State
const showFabMenu = ref(false)
const fontSize = ref(18) // base font size in px
const isPlayerMinimized = ref(false)
const showMenu = ref(false)
const showFindInPage = ref(false)

// Audio Information modal state
const showAudioInfoModal = ref(false)
const audioInfoDescription = ref('')
const isLoadingAudioInfo = ref(false)

// Fetch audio information when modal opens
const fetchAudioInformation = async () => {
  if (audioInfoDescription.value) return // Already fetched

  isLoadingAudioInfo.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: Array<{
        id: number
        description: string
        type: string
        created_at: string
        updated_at: string
      }>
    }>(`${config.public.apiBaseUrl}/information?type=audio`)

    if (response.success && response.data.length > 0) {
      audioInfoDescription.value = response.data[0].description
    }
  } catch (error) {
    console.error('Failed to fetch audio information:', error)
  } finally {
    isLoadingAudioInfo.value = false
  }
}

// Watch for modal open to fetch information
watch(showAudioInfoModal, (isOpen) => {
  if (isOpen) {
    fetchAudioInformation()
  }
})

const openFindInPage = () => {
  showMenu.value = false
  showFindInPage.value = true
}

const zoomIn = () => {
  fontSize.value = Math.min(fontSize.value + 2, 24)
}

const zoomOut = () => {
  fontSize.value = Math.max(fontSize.value - 2, 10)
}

const scrollToTop = () => {
  const scrollContainer = document.querySelector('.flex-1.overflow-y-auto')
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const filteredSubtitles = computed(() => {
  if (!currentAudio.value?.subtitle) return []
  const subtitles = currentAudio.value.subtitle
  if (!subtitleSearch.value.trim()) return subtitles
  const search = subtitleSearch.value.toLowerCase()
  return subtitles.filter(sub => sub.script.toLowerCase().includes(search))
})

const highlightText = (text: string) => {
  if (!subtitleSearch.value.trim()) return text
  const search = subtitleSearch.value.trim()
  const regex = new RegExp(`(${search})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-300">$1</mark>')
}

// Strip HTML tags for plain text display
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

// Use composable for copy functionality
const { copyToClipboard } = useCopySubtitle()

const copySubtitle = async (sub: Subtitle) => {
  await copyToClipboard({
    title: sub.title,
    description: sub.description,
    description_wa: sub.description_wa,
    script: sub.script,
    script_wa: sub.script_wa
  })
}

// Text-to-Speech State
const isSpeaking = ref(false)
const speakingSubtitleId = ref<number | null>(null)

// Speak subtitle using Web Speech API
const speakSubtitle = (sub: Subtitle) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported')
    return
  }

  // If already speaking this subtitle, stop it
  if (isSpeaking.value && speakingSubtitleId.value === sub.id) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    speakingSubtitleId.value = null
    return
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const text = stripHtml(sub.script)
  const utterance = new SpeechSynthesisUtterance(text)

  // Set Indonesian language
  utterance.lang = 'id-ID'
  utterance.rate = 1
  utterance.pitch = 1

  utterance.onstart = () => {
    isSpeaking.value = true
    speakingSubtitleId.value = sub.id
  }

  utterance.onend = () => {
    isSpeaking.value = false
    speakingSubtitleId.value = null
  }

  utterance.onerror = () => {
    isSpeaking.value = false
    speakingSubtitleId.value = null
  }

  window.speechSynthesis.speak(utterance)
}

// View detail - navigate to detail page
const viewDetail = (sub: Subtitle) => {
  if (!currentAudio.value) return
  navigateTo({
    path: '/audio/detail',
    query: {
      audio_id: currentAudio.value.id,
      subtitle_id: sub.id
    }
  })
}

const playAudio = (audio: AudioItem) => {
  if (currentAudio.value?.id === audio.id) {
    togglePlay()
    return
  }
  currentAudioId.value = audio.id
  showSubtitle.value = false
  subtitleSearch.value = ''
  if (audioElement.value) {
    audioElement.value.src = audio.url
    audioElement.value.play()
    isPlaying.value = true
  }

  // Save to history (fire and forget)
  saveAudioHistory(audio.title, audio.id, null, 'CN')
}

const togglePlay = () => {
  if (!audioElement.value) return
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const closePlayer = () => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.src = ''
  }
  currentAudioId.value = null
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  showSubtitle.value = false
  subtitleSearch.value = ''
}

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
  }
}

const onEnded = () => {
  isPlaying.value = false
}

const seek = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (audioElement.value) {
    audioElement.value.currentTime = Number(target.value)
  }
}

const skipForward = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = Math.min(audioElement.value.currentTime + 10, duration.value)
  }
}

const skipBackward = () => {
  if (audioElement.value) {
    audioElement.value.currentTime = Math.max(audioElement.value.currentTime - 10, 0)
  }
}

const seekToTimestamp = (timestamp: number) => {
  if (audioElement.value) {
    audioElement.value.currentTime = timestamp
    if (!isPlaying.value) {
      audioElement.value.play()
      isPlaying.value = true
    }
  }
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Bookmark
const { createAudioBookmark, fetchBookmarksByType, isBookmarked } = useBookmark()

const isAudioBookmarked = computed(() => {
  if (!currentAudio.value) return false
  return isBookmarked(2, currentAudio.value.title)
})

onMounted(async () => {
  await fetchBookmarksByType(2)

  // Restore audio source if there was a selected audio
  if (currentAudio.value && audioElement.value) {
    audioElement.value.src = currentAudio.value.url
  }
})

const addToBookmark = () => {
  if (!currentAudio.value) return
  createAudioBookmark(
    currentAudio.value.title,
    currentAudio.value.id,
    Number(categoryId.value)
  )
}

const shareContent = () => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?title=${encodeURIComponent(pageTitle.value)}`

  let shareTitle = pageTitle.value
  if (currentAudio.value) {
    const title = currentAudio.value.title.trim()
    shareTitle = `${pageTitle.value} - ${title}`
  }

  if (navigator.share) {
    navigator.share({
      title: shareTitle,
      text: shareTitle,
      url: shareUrl
    }).catch(err => {
      // User cancelled or error - silently ignore
      console.log('Share cancelled or failed:', err)
    })
  } else {
    // Fallback: copy to clipboard
    const shareText = `${shareTitle}\n${shareUrl}`
    navigator.clipboard.writeText(shareText).then(() => {
      toast.add({
        title: 'Link disalin ke clipboard',
        color: 'success'
      })
    }).catch(err => {
      console.error('Failed to copy:', err)
      toast.add({
        title: 'Gagal menyalin link',
        color: 'error'
      })
    })
  }
}
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

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

<style>
/* Dark mode: change text color to black for highlighted text in subtitles */
.dark span[style*="background-color"] {
  color: #000000 !important;
}
</style>
