<template>
  <div class="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Header -->
    <header class="shrink-0 flex items-center gap-3 px-3 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <button
        class="p-2 flex justify-center align-middle rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Kembali"
        @click="goBack"
      >
        <Icon name="mdi:arrow-left" class="w-6 h-6" />
      </button>
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div class="w-9 h-9 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0">
          <Icon name="mdi:robot-happy" class="w-5 h-5 text-black" />
        </div>
        <div class="min-w-0">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white truncate">MasterLu AI</h1>
          <span
            v-if="selectedCategory"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400 truncate max-w-full mt-0.5"
          >
            <Icon name="mdi:tag" class="w-3 h-3 shrink-0" />
            {{ selectedCategory.name }}
          </span>
        </div>
      </div>
      <button
        v-if="messages.length"
        class="p-2 flex justify-center align-middle rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Obrolan baru"
        @click="newChat"
      >
        <Icon name="mdi:square-edit-outline" class="w-5 h-5" />
      </button>
      <button
        class="p-2 flex justify-center align-middle rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Riwayat percakapan"
        @click="openDrawer"
      >
        <Icon name="mdi:history" class="w-5 h-5" />
      </button>
    </header>

    <!-- Plan / quota bar -->
    <div
      v-if="quota"
      class="shrink-0 flex items-center gap-1 px-3 py-1.5 text-sm text-secondary dark:text-gray-400 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
    >
      <Icon name="mdi:crown-outline" class="w-3.5 h-3.5 shrink-0" />
      <span>{{ quota.plan.label }}</span>
      <template v-if="!unlimited && quota.remaining !== null">
        <span>·</span>
        <span :class="quotaReached ? 'text-red-500 font-medium' : ''">{{ quota.remaining }}/{{ quota.limit }} pertanyaan hari ini</span>
      </template>
    </div>

    <!-- Quota reached → upgrade CTA (top, so the FAB never covers it) -->
    <div
      v-if="isAuthenticated && quotaReached"
      class="shrink-0 px-3 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/40 flex items-center gap-2"
    >
      <p class="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
        Kuota {{ quota?.plan.label }} hari ini habis ({{ quota?.limit }} pertanyaan). Upgrade untuk menambah kuota.
      </p>
      <button
        class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        @click="openPlans"
      >
        <Icon name="mdi:whatsapp" class="w-4 h-4" />
        Upgrade
      </button>
    </div>

    <!-- Messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide" @scroll="onScroll">
      <!-- Empty state -->
      <div v-if="!messages.length" class="h-full flex flex-col items-center justify-center text-center px-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 dark:bg-yellow-500/10 mb-4">
          <Icon name="mdi:robot-happy" class="w-9 h-9 text-primary dark:text-yellow-400" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Halo! 👋</h2>
        <p class="text-[16px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6 max-w-xs">
          {{ selectedCategory
            ? `Kategori "${selectedCategory.name}" dipilih. Ketik pertanyaan Anda di bawah.`
            : 'Pilih kategori untuk memulai percakapan.' }}
        </p>

        <ChatCategoryGrid
          class="w-full max-w-xs text-left"
          :categories="categories"
          :selected-id="selectedCategory?.id ?? null"
          :loading="loadingCategories"
          @select="(cat) => (selectedCategory = cat)"
        />
      </div>

      <!-- Message list -->
      <template v-for="message in messages" :key="message.id">
        <!-- User message -->
        <div v-if="message.role === 'user'" class="flex flex-col items-end">
          <div
            class="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-primary dark:bg-yellow-500 text-black leading-relaxed whitespace-pre-wrap break-words"
            :style="{ fontSize: fontSize + 'px' }"
          >
            {{ textOf(message) }}
          </div>
          <button
            class="mt-1 mr-1 flex items-center gap-1 text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 transition-colors"
            aria-label="Salin pesan"
            @click="copyMessage(message.id, textOf(message))"
          >
            <Icon :name="copiedId === message.id ? 'mdi:check' : 'mdi:content-copy'" class="w-3.5 h-3.5" />
            {{ copiedId === message.id ? 'Disalin' : 'Salin' }}
          </button>
        </div>

        <!-- Assistant message -->
        <div v-else class="flex gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0 mt-0.5">
            <Icon name="mdi:robot-happy" class="w-4 h-4 text-black" />
          </div>
          <div class="max-w-[85%] space-y-1.5">
            <div
              class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 leading-relaxed break-words"
              :style="{ fontSize: fontSize + 'px' }"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-if="textOf(message)" class="md-content" v-html="renderMarkdown(textOf(message))" />
              <span v-else class="inline-flex gap-1.5 py-1">
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 0ms" />
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 200ms" />
                <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 400ms" />
              </span>
            </div>

            <button
              v-if="textOf(message)"
              class="ml-1 flex items-center gap-1 text-sm text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 transition-colors"
              aria-label="Salin pesan"
              @click="copyMessage(message.id, textOf(message))"
            >
              <Icon :name="copiedId === message.id ? 'mdi:check' : 'mdi:content-copy'" class="w-3.5 h-3.5" />
              {{ copiedId === message.id ? 'Disalin' : 'Salin' }}
            </button>

            <!-- Sources -->
            <div v-if="sourcesOf(message).length" class="space-y-1.5">
              <p class="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 px-1">Artikel Terkait</p>
              <component
                :is="linkFor(src) ? resolveLinkComponent : 'div'"
                v-for="(src, i) in sourcesOf(message)"
                :key="`${src.content_type}-${src.content_id}-${src.segment_id ?? i}`"
                :to="linkFor(src)"
                class="block px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                :class="linkFor(src) ? 'hover:border-primary dark:hover:border-yellow-500 transition-colors' : ''"
              >
                <div class="flex items-start gap-2">
                  <Icon :name="iconFor(src.content_type)" class="w-4 h-4 text-primary dark:text-yellow-400 mt-0.5 shrink-0" />
                  <div class="min-w-0">
                    <p class="text-base font-medium text-gray-900 dark:text-white truncate">
                      {{ src.title || src.category_title || 'Sumber' }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <p v-if="src.chapter_title || src.category_title" class="text-sm text-secondary dark:text-gray-400 truncate">
                        {{ src.chapter_title || src.category_title }}
                      </p>
                      <span
                        v-if="src.timestamp_formatted"
                        class="inline-flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400"
                      >
                        <Icon name="mdi:clock-outline" class="w-3 h-3" />
                        {{ src.timestamp_formatted }}
                      </span>
                    </div>
                    <p v-if="src.snippet" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {{ src.snippet }}
                    </p>
                  </div>
                </div>
              </component>
            </div>
          </div>
        </div>
      </template>

      <!-- Waiting for the bot's first response (before the stream starts) -->
      <div v-if="isWaiting" class="flex gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0 mt-0.5">
          <Icon name="mdi:robot-happy" class="w-4 h-4 text-black" />
        </div>
        <div class="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <span class="flex gap-1.5">
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 0ms" />
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 200ms" />
            <span class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 typing-dot" style="animation-delay: 400ms" />
          </span>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="flex gap-2">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/40 shrink-0 mt-0.5">
          <Icon name="mdi:alert" class="w-4 h-4 text-red-500" />
        </div>
        <div class="max-w-[85%]">
          <div class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 text-base">
            {{ error.message || 'Terjadi kesalahan. Coba lagi.' }}
          </div>
          <button class="mt-1 text-sm text-primary dark:text-yellow-400 font-medium px-1" @click="retry">
            Coba lagi
          </button>
        </div>
      </div>
      <!-- Scroll to bottom -->
      <div class="sticky bottom-2 z-10 flex justify-start pointer-events-none">
        <Transition name="fade">
          <button
            v-if="showScrollBtn"
            class="pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400 transition-colors"
            aria-label="Gulir ke bawah"
            @click="scrollToBottom('smooth')"
          >
            <Icon name="mdi:chevron-down" class="w-6 h-6" />
          </button>
        </Transition>
      </div>
    </div>

    <!-- Not authenticated notice -->
    <div v-if="!isAuthenticated" class="shrink-0 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-900/40">
      <p class="text-sm text-yellow-800 dark:text-yellow-300 text-center">
        Silakan masuk terlebih dahulu untuk menggunakan chatbot.
      </p>
    </div>

    <!-- Input bar -->
    <div class="shrink-0 relative px-3 py-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <!-- Floating zoom / scroll tools (above the input bar) -->
      <LazyFabZoom
        v-model:isOpen="isToolsExpanded"
        class="absolute right-0 bottom-full z-20"
        @zoomIn="zoomIn"
        @zoomOut="zoomOut"
        @scrollTop="scrollToTop"
      />
      <div class="flex items-end gap-2">
        <textarea
          ref="inputEl"
          v-model="input"
          rows="1"
          :disabled="!isAuthenticated || quotaReached"
          :placeholder="quotaReached ? 'Kuota harian habis' : 'Tulis pertanyaan...'"
          class="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-yellow-500 disabled:opacity-60"
          @input="autoGrow"
          @keydown="onKeydown"
        />
        <button
          v-if="isBusy"
          class="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          aria-label="Hentikan"
          @click="chat.stop()"
        >
          <Icon name="mdi:stop" class="w-5 h-5" />
        </button>
        <button
          v-else
          :disabled="!canSend"
          class="w-11 h-11 shrink-0 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 text-black transition-opacity disabled:opacity-40"
          aria-label="Kirim"
          @click="send"
        >
          <Icon name="mdi:send" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Conversations drawer -->
    <Transition name="fade">
      <div
        v-if="drawerOpen"
        class="absolute inset-0 z-30 bg-black/40"
        @click="drawerOpen = false"
      />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="drawerOpen"
        class="absolute inset-y-0 left-0 z-40 w-[82%] max-w-xs bg-white dark:bg-gray-800 shadow-xl flex flex-col"
      >
        <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Riwayat</h2>
          <button
            class="p-2 flex justify-center align-middle rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Tutup"
            @click="drawerOpen = false"
          >
            <Icon name="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <div class="shrink-0 px-3 py-3">
          <button
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary dark:bg-yellow-500 text-black text-base font-medium transition-opacity hover:opacity-90"
            @click="startNewChat"
          >
            <Icon name="mdi:plus" class="w-5 h-5" />
            Obrolan Baru
          </button>
          <p class="text-sm text-secondary dark:text-gray-400 text-center mt-2">
            {{ conversations.length }}/3 percakapan
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-3 pb-4 scrollbar-hide">
          <div v-if="loadingList" class="py-8 text-center">
            <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
          </div>
          <p v-else-if="!conversations.length" class="py-8 text-center text-base text-secondary dark:text-gray-400">
            Belum ada percakapan.
          </p>
          <ul v-else class="space-y-1">
            <li
              v-for="c in conversations"
              :key="c.id"
              class="group flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-colors"
              :class="c.id === conversationId ? 'bg-primary/10 dark:bg-yellow-500/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
              @click="selectConversation(c.id)"
            >
              <Icon name="mdi:message-text-outline" class="w-4 h-4 text-secondary dark:text-gray-400 shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="text-base text-gray-900 dark:text-white truncate">{{ c.title || 'Tanpa judul' }}</p>
                <div class="flex items-center gap-1.5">
                  <span
                    v-if="c.category"
                    class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400 truncate max-w-24"
                  >
                    {{ c.category.name }}
                  </span>
                  <p class="text-sm text-secondary dark:text-gray-400">{{ formatDate(c.updated_at) }}</p>
                </div>
              </div>
              <button
                class="p-1.5 rounded-full text-secondary dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Hapus percakapan"
                @click.stop="confirmDelete(c)"
              >
                <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </Transition>

    <!-- Category picker (first-message gate) -->
    <Transition name="fade">
      <div
        v-if="showCategoryPicker"
        class="absolute inset-0 z-40 bg-black/40 flex items-end"
        @click.self="cancelCategoryPicker"
      >
        <Transition name="sheet" appear>
          <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pilih kategori pertanyaan</h3>
              <button
                class="p-1 -mr-1 rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Batal"
                @click="cancelCategoryPicker"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mb-3">
              Kategori menentukan sumber jawaban dan tidak bisa diubah setelah percakapan dimulai.
            </p>

            <p
              v-if="pendingMessage"
              class="text-base text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/60 rounded-xl px-3 py-2 mb-3 line-clamp-2"
            >
              "{{ pendingMessage }}"
            </p>

            <div class="max-h-[55vh] overflow-y-auto scrollbar-hide">
              <ChatCategoryGrid
                :categories="categories"
                :loading="loadingCategories"
                @select="pickCategory"
              />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Plans / upgrade picker -->
    <Transition name="fade">
      <div
        v-if="showPlans"
        class="absolute inset-0 z-50 bg-black/40 flex items-end"
        @click.self="showPlans = false"
      >
        <Transition name="sheet" appear>
          <div class="w-full bg-white dark:bg-gray-800 rounded-t-2xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pilih paket donatur</h3>
              <button
                class="p-1 -mr-1 rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Tutup"
                @click="showPlans = false"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mb-3">
              Pembayaran dilakukan manual via WhatsApp admin. Pilih paket untuk melanjutkan.
            </p>

            <div v-if="loadingPlans" class="py-6 text-center">
              <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="p in plans"
                :key="p.name"
                class="flex items-center gap-3 px-3 py-3 rounded-xl border"
                :class="quota?.plan.name === p.name
                  ? 'border-primary dark:border-yellow-500 bg-primary/5 dark:bg-yellow-500/10'
                  : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-base font-semibold text-gray-900 dark:text-white truncate">{{ p.label }}</p>
                    <span
                      v-if="quota?.plan.name === p.name"
                      class="shrink-0 px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400"
                    >Paket aktif</span>
                  </div>
                  <p class="text-sm text-secondary dark:text-gray-400">
                    {{ formatPrice(p.price) }} · {{ planLimitLabel(p) }}
                  </p>
                </div>
                <button
                  :disabled="quota?.plan.name === p.name || p.name === 'free'"
                  class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-40 disabled:hover:bg-green-600"
                  @click="choosePlan(p)"
                >
                  <Icon name="mdi:whatsapp" class="w-4 h-4" />
                  Pilih
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { marked } from 'marked'
import { NuxtLink } from '#components'
import { useAuth } from '~/lib/auth'
import {
  useChatApi,
  type CategoryRef,
  type ChatCategory,
  type ConversationListItem,
  type PlanCatalogItem,
  type QuotaState,
} from '~/composables/useChatApi'
import {
  createMasterLuChatTransport,
  type ChatContentType,
  type ChatQuota,
  type ChatSource,
  type MasterLuUIMessage,
} from '~/lib/chatTransport'

const config = useRuntimeConfig()
const router = useRouter()
const toast = useToast()
const { getAuthHeader, isAuthenticated } = useAuth()
const chatApi = useChatApi()

const resolveLinkComponent = NuxtLink

marked.setOptions({ gfm: true, breaks: true })

const conversationId = ref<number | undefined>(undefined)
const input = ref('')
const scrollEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const copiedId = ref<string | null>(null)

// Conversation history (drawer)
const drawerOpen = ref(false)
const conversations = ref<ConversationListItem[]>([])
const loadingList = ref(false)

// Categories (first-message gate)
const categories = ref<ChatCategory[]>([])
const selectedCategory = ref<CategoryRef | null>(null)
const pendingMessage = ref('')
const showCategoryPicker = ref(false)
const loadingCategories = ref(false)

// Subscription / donor plan + daily quota
const quota = ref<QuotaState | null>(null)
const adminWa = ref<string | null>(null)
const plans = ref<PlanCatalogItem[]>([])
const showPlans = ref(false)
const loadingPlans = ref(false)

const unlimited = computed(() => quota.value?.unlimited ?? false)
const quotaReached = computed(
  () => !unlimited.value && quota.value != null && (quota.value.remaining ?? 1) <= 0,
)

// Zoom / scroll tools (FabZoom)
const isToolsExpanded = ref(false)
const fontSize = ref(17)

function zoomIn() {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

function zoomOut() {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

function scrollToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const chat = new Chat<MasterLuUIMessage>({
  transport: createMasterLuChatTransport({
    apiBaseUrl: config.public.apiV2BaseUrl,
    getAuthHeader: () => getAuthHeader() as Record<string, string>,
    getConversationId: () => conversationId.value,
    getCategoryId: () => selectedCategory.value?.id,
    onMeta: (meta) => {
      const isNew = !conversationId.value
      if (meta?.conversation_id) conversationId.value = meta.conversation_id
      // A brand-new conversation just got an id → refresh the sidebar list.
      if (isNew) refreshConversations()
    },
    onHttpError: handleHttpError,
    onQuota: (q) => {
      // Header plan code differs from cached → full refetch (need label/expiry).
      if (!quota.value || quota.value.plan.name !== q.plan) {
        fetchQuota()
        return
      }
      quota.value = {
        ...quota.value,
        unlimited: q.limit == null,
        limit: q.limit ?? quota.value.limit,
        remaining: q.remaining,
      }
    },
    onNeedsCategory: (cats) => {
      // Defensive: server still wants a category — re-open the picker.
      if (Array.isArray(cats) && cats.length) categories.value = cats as ChatCategory[]
      showCategoryPicker.value = true
    },
  }),
})

function handleHttpError(
  status: number,
  message: string,
  extra?: { retryAfterSeconds?: number; quota?: ChatQuota },
) {
  if (status === 409) {
    toast.add({
      title: 'Batas percakapan tercapai',
      description: 'Maksimal 3 percakapan. Hapus salah satu untuk memulai obrolan baru.',
      color: 'error',
    })
    openDrawer()
  } else if (status === 429 && extra?.quota) {
    // Daily question quota reached → upgrade-via-WhatsApp CTA.
    const q = extra.quota
    if (quota.value) {
      quota.value = { ...quota.value, remaining: 0, used: q.used, limit: q.limit }
    } else {
      fetchQuota()
    }
    toast.add({
      title: 'Batas harian tercapai',
      description: message,
      color: 'warning',
      actions: [{ label: 'Lihat Paket', onClick: openPlans }],
    })
  } else if (status === 429) {
    toast.add({
      title: 'Terlalu banyak permintaan',
      description: extra?.retryAfterSeconds
        ? `Coba lagi dalam ${extra.retryAfterSeconds} detik.`
        : 'Mohon tunggu sebentar lalu coba lagi.',
      color: 'warning',
    })
  } else if (status === 400) {
    toast.add({
      title: 'Kategori tidak valid',
      description: 'Silakan pilih kategori lagi.',
      color: 'error',
    })
    // Re-fetch categories and ask again.
    selectedCategory.value = null
    ensureCategories(true)
    showCategoryPicker.value = true
  } else if (status === 401) {
    toast.add({
      title: 'Sesi berakhir',
      description: 'Silakan masuk kembali untuk melanjutkan.',
      color: 'error',
    })
  } else if (status === 413) {
    toast.add({ title: 'Pesan terlalu panjang', description: 'Maksimal 2000 karakter.', color: 'error' })
  }
}

const messages = computed(() => chat.messages)
const status = computed(() => chat.status)
const error = computed(() => chat.error)
const isBusy = computed(() => status.value === 'submitted' || status.value === 'streaming')
// Show a standalone typing bubble while awaiting the first response chunk.
const isWaiting = computed(() => status.value === 'submitted')
const canSend = computed(
  () => isAuthenticated.value && !!input.value.trim() && !isBusy.value && !quotaReached.value,
)

function textOf(message: MasterLuUIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function sourcesOf(message: MasterLuUIMessage): ChatSource[] {
  if (message.role !== 'assistant') return []
  const part = message.parts.find((p) => p.type === 'data-sources')
  return part && part.type === 'data-sources' ? part.data.books : []
}

const ICON_BY_TYPE: Record<ChatContentType, string> = {
  book: 'mdi:book-open-variant',
  topics2: 'mdi:lightbulb-on-outline',
  topics3: 'mdi:comment-question-outline',
  audio: 'mdi:music-note',
  video: 'mdi:play-box',
}

// Build the frontend deep-link for a source. Each content type has its own
// route shape and uses content_id / segment_id / title differently.
function linkFor(src: ChatSource): string | undefined {
  switch (src.content_type) {
    case 'audio':
      return src.content_id
        ? `/audio/detail?audio_id=${src.content_id}${src.segment_id ? `&subtitle_id=${src.segment_id}` : ''}`
        : undefined
    case 'book':
      return src.segment_id ? `/book/${src.segment_id}` : undefined
    case 'video':
      return src.content_id
        ? `/video/play/${src.content_id}${src.title ? `?title=${encodeURIComponent(src.title)}` : ''}`
        : undefined
    case 'topics2':
      return src.segment_id ? `/topics2/content/${src.segment_id}` : undefined
    case 'topics3':
      return src.segment_id ? `/topics3/content/${src.segment_id}` : undefined
    default:
      return undefined
  }
}

function iconFor(type: ChatContentType): string {
  return ICON_BY_TYPE[type] ?? 'mdi:book-open-variant'
}

function renderMarkdown(text: string): string {
  return marked.parse(text, { async: false }) as string
}

// Convert Markdown to WhatsApp's own lightweight formatting so pasted text
// looks right there (WA doesn't render Markdown): bold markers collapse to
// single asterisks, headings become a bold line, links become "text (url)",
// inline code/strikethrough markers are stripped, list markers normalize to "- ".
function toWhatsAppText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/__(.+?)__/g, '*$1*')
    .replace(/^#{1,6}\s+(.*)$/gm, '*$1*')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1 ($2)')
    .replace(/~~(.+?)~~/g, '~$1~')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/^\s*[*+]\s+/gm, '- ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function copyMessage(id: string, text: string) {
  const formatted = toWhatsAppText(text)
  try {
    await navigator.clipboard.writeText(formatted)
  } catch {
    toast.add({ title: 'Gagal menyalin pesan', color: 'error' })
    return
  }
  copiedId.value = id
  setTimeout(() => {
    if (copiedId.value === id) copiedId.value = null
  }, 1500)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Conversation history ────────────────────────────────────────────────────

function openDrawer() {
  drawerOpen.value = true
  refreshConversations()
}

async function refreshConversations() {
  if (!isAuthenticated.value) return
  loadingList.value = true
  try {
    const data = await chatApi.listConversations(1, 20)
    conversations.value = data.conversations ?? []
  } catch {
    /* keep existing list on failure */
  } finally {
    loadingList.value = false
  }
}

/** Convert persisted conversation messages into AI SDK UI messages. */
function toUiMessages(
  records: Awaited<ReturnType<typeof chatApi.getConversation>>['messages'],
): MasterLuUIMessage[] {
  return records.map((m) => {
    const parts: MasterLuUIMessage['parts'] = [{ type: 'text', text: m.content }]
    if (m.role === 'assistant' && m.books?.length) {
      parts.push({ type: 'data-sources', id: 'sources', data: { books: m.books, grounded: true } })
    }
    return { id: String(m.id), role: m.role, parts }
  })
}

async function selectConversation(id: number) {
  if (isBusy.value) chat.stop()
  drawerOpen.value = false
  try {
    const data = await chatApi.getConversation(id)
    chat.messages = toUiMessages(data.messages)
    conversationId.value = id
    selectedCategory.value = data.conversation.category
    scrollToBottom()
  } catch {
    toast.add({ title: 'Gagal memuat percakapan', color: 'error' })
  }
}

async function confirmDelete(c: ConversationListItem) {
  if (!window.confirm(`Hapus percakapan "${c.title || 'Tanpa judul'}"?`)) return
  try {
    await chatApi.deleteConversation(c.id)
    conversations.value = conversations.value.filter((x) => x.id !== c.id)
    if (conversationId.value === c.id) newChat()
  } catch {
    toast.add({ title: 'Gagal menghapus percakapan', color: 'error' })
  }
}

function startNewChat() {
  newChat()
  drawerOpen.value = false
}

const showScrollBtn = ref(false)
// Whether the viewport is currently near the bottom (within 80px).
let nearBottom = true

function updateScrollState() {
  const el = scrollEl.value
  if (!el) return
  nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  showScrollBtn.value = !nearBottom && el.scrollHeight > el.clientHeight + 80
}

function onScroll() {
  updateScrollState()
}

function scrollToBottom(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    const el = scrollEl.value
    if (el) el.scrollTo({ top: el.scrollHeight, behavior })
    nearBottom = true
    showScrollBtn.value = false
  })
}

// Auto-scroll on new content only when the user is already at the bottom, so we
// don't yank the view while they're reading earlier messages.
function autoScroll() {
  if (nearBottom) scrollToBottom()
  else updateScrollState()
}

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`
}

async function fetchQuota() {
  if (!isAuthenticated.value) return
  try {
    quota.value = await chatApi.getQuota()
  } catch {
    /* non-fatal: badge just stays hidden */
  }
}

async function openPlans() {
  showPlans.value = true
  if (!plans.value.length) {
    loadingPlans.value = true
    try {
      plans.value = await chatApi.listPlans()
    } finally {
      loadingPlans.value = false
    }
  }
}

function formatPrice(idr: number): string {
  return idr <= 0 ? 'Gratis' : `Rp${idr.toLocaleString('id-ID')}`
}

function planLimitLabel(p: PlanCatalogItem): string {
  return p.limit == null ? 'Tanpa batas' : `${p.limit} pertanyaan/hari`
}

async function choosePlan(p: PlanCatalogItem) {
  if (!adminWa.value) adminWa.value = await chatApi.getAdminWhatsApp()
  if (!adminWa.value) {
    toast.add({ title: 'Nomor WhatsApp admin tidak tersedia', color: 'error' })
    return
  }
  const text = encodeURIComponent(
    `Halo admin, saya ingin upgrade ke paket ${p.label} (${formatPrice(p.price)}) untuk chatbot MasterLu.`,
  )
  window.open(`https://wa.me/${adminWa.value}?text=${text}`, '_blank')
  showPlans.value = false
}

async function ensureCategories(force = false) {
  if (!isAuthenticated.value) return
  if (categories.value.length && !force) return
  loadingCategories.value = true
  try {
    categories.value = await chatApi.listCategories()
  } catch {
    /* keep whatever we have */
  } finally {
    loadingCategories.value = false
  }
}

/**
 * Send a message, gating new conversations behind category selection.
 * A new conversation (no conversation_id) requires a category first, so we hold
 * the message and show the picker; once a category is chosen the message is sent.
 */
function submitMessage(text: string) {
  const trimmed = text.trim()
  if (!trimmed || isBusy.value || !isAuthenticated.value) return

  if (quotaReached.value) {
    toast.add({
      title: 'Batas harian tercapai',
      description: 'Kuota pertanyaan hari ini habis. Upgrade untuk menambah kuota.',
      color: 'warning',
      actions: [{ label: 'Lihat Paket', onClick: openPlans }],
    })
    return
  }

  if (!conversationId.value && !selectedCategory.value) {
    pendingMessage.value = trimmed
    input.value = ''
    nextTick(autoGrow)
    ensureCategories()
    showCategoryPicker.value = true
    return
  }

  chat.sendMessage({ text: trimmed })
}

function pickCategory(cat: ChatCategory) {
  selectedCategory.value = cat
  showCategoryPicker.value = false
  const text = pendingMessage.value
  pendingMessage.value = ''
  if (text) chat.sendMessage({ text })
}

function cancelCategoryPicker() {
  showCategoryPicker.value = false
  // Return the held message to the input so it isn't lost.
  if (pendingMessage.value && !input.value) {
    input.value = pendingMessage.value
    nextTick(autoGrow)
  }
  pendingMessage.value = ''
}

function send() {
  const text = input.value.trim()
  if (!text || isBusy.value || !isAuthenticated.value) return
  input.value = ''
  nextTick(autoGrow)
  submitMessage(text)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function retry() {
  chat.clearError()
  chat.regenerate()
}

function newChat() {
  chat.stop()
  chat.messages = []
  conversationId.value = undefined
  selectedCategory.value = null
  pendingMessage.value = ''
  showCategoryPicker.value = false
}

function goBack() {
  router.back()
}

watch(
  () => [messages.value.length, messages.value[messages.value.length - 1]?.parts, isWaiting.value],
  autoScroll,
  { deep: true },
)

onMounted(() => {
  if (isAuthenticated.value) {
    refreshConversations()
    ensureCategories()
    fetchQuota()
  }
})

useHead({ title: 'Chatbot' })
</script>

<style scoped>
/* Typing indicator */
.typing-dot {
  animation: typing-bounce 1.2s infinite ease-in-out;
}
@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

/* Drawer transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.25s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}

/* Markdown rendering for assistant replies */
.md-content :deep(p) {
  margin: 0 0 0.5rem;
}
.md-content :deep(p:last-child) {
  margin-bottom: 0;
}
.md-content :deep(h1),
.md-content :deep(h2),
.md-content :deep(h3),
.md-content :deep(h4) {
  font-weight: 600;
  margin: 0.75rem 0 0.35rem;
  line-height: 1.3;
}
.md-content :deep(h1) { font-size: 1.25em; }
.md-content :deep(h2) { font-size: 1.15em; }
.md-content :deep(h3),
.md-content :deep(h4) { font-size: 1.05em; }
.md-content :deep(ul),
.md-content :deep(ol) {
  margin: 0.25rem 0 0.5rem;
  padding-left: 1.25rem;
}
.md-content :deep(ul) { list-style: disc; }
.md-content :deep(ol) { list-style: decimal; }
.md-content :deep(li) { margin: 0.15rem 0; }
.md-content :deep(li::marker) { color: var(--color-primary, #c09637); }
.md-content :deep(a) {
  color: var(--color-primary, #c09637);
  text-decoration: underline;
  word-break: break-word;
}
.md-content :deep(strong) { font-weight: 600; }
.md-content :deep(blockquote) {
  border-left: 3px solid var(--color-primary, #c09637);
  padding: 0.25rem 0.75rem;
  margin: 0.5rem 0;
  background: rgba(192, 150, 55, 0.08);
  border-radius: 0.375rem;
}
.md-content :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.85em;
}
.md-content :deep(pre) {
  background: rgba(0, 0, 0, 0.06);
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.md-content :deep(pre code) {
  background: transparent;
  padding: 0;
}
.dark .md-content :deep(code),
.dark .md-content :deep(pre) {
  background: rgba(255, 255, 255, 0.08);
}
</style>
