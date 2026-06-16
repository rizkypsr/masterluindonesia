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
          <h1 class="text-base font-semibold text-gray-900 dark:text-white truncate">MasterLu AI</h1>
          <p class="text-xs text-secondary dark:text-gray-400">Tanya seputar MasterLu Indonesia</p>
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

    <!-- Messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-hide" @scroll="onScroll">
      <!-- Empty state -->
      <div v-if="!messages.length" class="h-full flex flex-col items-center justify-center text-center px-6">
        <div class="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 dark:bg-yellow-500/10 mb-4">
          <Icon name="mdi:robot-happy" class="w-9 h-9 text-primary dark:text-yellow-400" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">Halo! 👋</h2>
        <p class="text-[15px] leading-relaxed text-gray-600 dark:text-gray-300 mb-6 max-w-xs">
          Saya bisa menjawab pertanyaan seputar buku, audio, dan video MasterLu Indonesia.
        </p>
        <div class="w-full max-w-xs space-y-2">
          <button
            v-for="s in suggestions"
            :key="s"
            class="w-full text-left text-sm px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-primary dark:hover:border-yellow-500 transition-colors"
            @click="askSuggestion(s)"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- Message list -->
      <template v-for="message in messages" :key="message.id">
        <!-- User message -->
        <div v-if="message.role === 'user'" class="flex justify-end">
          <div
            class="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-md bg-primary dark:bg-yellow-500 text-black leading-relaxed whitespace-pre-wrap break-words"
            :style="{ fontSize: fontSize + 'px' }"
          >
            {{ textOf(message) }}
          </div>
        </div>

        <!-- Assistant message -->
        <div v-else class="flex gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center bg-primary dark:bg-yellow-500 shrink-0 mt-0.5">
            <Icon name="mdi:robot-happy" class="w-4 h-4 text-black" />
          </div>
          <div class="max-w-[85%] space-y-2">
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

            <!-- Sources -->
            <div v-if="sourcesOf(message).length" class="space-y-1.5">
              <p class="text-xs font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 px-1">Artikel Terkait</p>
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
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ src.title || src.category_title || 'Sumber' }}
                    </p>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <p v-if="src.chapter_title || src.category_title" class="text-xs text-secondary dark:text-gray-400 truncate">
                        {{ src.chapter_title || src.category_title }}
                      </p>
                      <span
                        v-if="src.timestamp_formatted"
                        class="inline-flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400"
                      >
                        <Icon name="mdi:clock-outline" class="w-3 h-3" />
                        {{ src.timestamp_formatted }}
                      </span>
                    </div>
                    <p v-if="src.snippet" class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
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
          <div class="px-4 py-2.5 rounded-2xl rounded-bl-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 text-sm">
            {{ error.message || 'Terjadi kesalahan. Coba lagi.' }}
          </div>
          <button class="mt-1 text-xs text-primary dark:text-yellow-400 font-medium px-1" @click="retry">
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
      <p class="text-xs text-yellow-800 dark:text-yellow-300 text-center">
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
          :disabled="!isAuthenticated"
          placeholder="Tulis pertanyaan..."
          class="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-yellow-500 disabled:opacity-60"
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
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">Riwayat</h2>
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
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary dark:bg-yellow-500 text-black text-sm font-medium transition-opacity hover:opacity-90"
            @click="startNewChat"
          >
            <Icon name="mdi:plus" class="w-5 h-5" />
            Obrolan Baru
          </button>
          <p class="text-xs text-secondary dark:text-gray-400 text-center mt-2">
            {{ conversations.length }}/3 percakapan
          </p>
        </div>

        <div class="flex-1 overflow-y-auto px-3 pb-4 scrollbar-hide">
          <div v-if="loadingList" class="py-8 text-center">
            <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
          </div>
          <p v-else-if="!conversations.length" class="py-8 text-center text-sm text-secondary dark:text-gray-400">
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
                <p class="text-sm text-gray-900 dark:text-white truncate">{{ c.title || 'Tanpa judul' }}</p>
                <p class="text-xs text-secondary dark:text-gray-400">{{ formatDate(c.updated_at) }}</p>
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
  </div>
</template>

<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { marked } from 'marked'
import { NuxtLink } from '#components'
import { useAuth } from '~/lib/auth'
import { useChatApi, type ConversationListItem } from '~/composables/useChatApi'
import {
  createMasterLuChatTransport,
  type ChatContentType,
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

// Conversation history (drawer)
const drawerOpen = ref(false)
const conversations = ref<ConversationListItem[]>([])
const loadingList = ref(false)

// Zoom / scroll tools (FabZoom)
const isToolsExpanded = ref(false)
const fontSize = ref(15)

function zoomIn() {
  fontSize.value = Math.min(fontSize.value + 2, 28)
}

function zoomOut() {
  fontSize.value = Math.max(fontSize.value - 2, 12)
}

function scrollToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const suggestions = [
  'Apa itu fengshui menurut MasterLu?',
  'Jelaskan tentang sebab akibat (karma).',
  'Bagaimana cara melatih welas asih?',
]

const chat = new Chat<MasterLuUIMessage>({
  transport: createMasterLuChatTransport({
    apiBaseUrl: config.public.apiV2BaseUrl,
    getAuthHeader: () => getAuthHeader() as Record<string, string>,
    getConversationId: () => conversationId.value,
    onMeta: (meta) => {
      const isNew = !conversationId.value
      if (meta?.conversation_id) conversationId.value = meta.conversation_id
      // A brand-new conversation just got an id → refresh the sidebar list.
      if (isNew) refreshConversations()
    },
    onHttpError: handleHttpError,
  }),
})

function handleHttpError(status: number, message: string, retryAfter?: number) {
  if (status === 409) {
    toast.add({
      title: 'Batas percakapan tercapai',
      description: 'Maksimal 3 percakapan. Hapus salah satu untuk memulai obrolan baru.',
      color: 'error',
    })
    openDrawer()
  } else if (status === 429) {
    toast.add({
      title: 'Terlalu banyak permintaan',
      description: retryAfter
        ? `Coba lagi dalam ${retryAfter} detik.`
        : 'Mohon tunggu sebentar lalu coba lagi.',
      color: 'warning',
    })
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
const canSend = computed(() => isAuthenticated.value && !!input.value.trim() && !isBusy.value)

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

function send() {
  const text = input.value.trim()
  if (!text || isBusy.value || !isAuthenticated.value) return
  input.value = ''
  nextTick(autoGrow)
  chat.sendMessage({ text })
}

function askSuggestion(text: string) {
  if (!isAuthenticated.value || isBusy.value) return
  chat.sendMessage({ text })
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
  if (isAuthenticated.value) refreshConversations()
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
