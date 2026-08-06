<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'
import { useAuth } from '~/lib/auth'
import { useChatApi, type ChatCategory } from '~/composables/useChatApi'
import { useChatAdminApi } from '~/composables/useChatAdminApi'
import type { ConversationMessage } from '~/composables/useChatApi'
import { subscribeConversationStream, type LiveMessage } from '~/lib/sseClient'

const route = useRoute()
const { isAuthenticated, isAdmin, getAuthHeader, user, ensureSession } = useAuth()
const admin = useChatAdminApi()
const chatApi = useChatApi()
const toast = useToast()

const conversationId = Number(route.params.id)

/** Max category suggestions the API accepts per message. */
const MAX_SUGGESTIONS = 10

// Whether this admin still holds the takeover. If another admin claims it or it
// gets released, sending is disabled and a notice shows.
const heldByMe = ref(true)

interface LiveRow {
  id: number
  role: 'user' | 'assistant'
  content: string
  is_admin_reply: boolean
  suggested_categories: { id: number; name: string }[]
}

const title = ref('')
const userName = ref('')
const messages = ref<LiveRow[]>([])
const loading = ref(true)
const input = ref('')
const sending = ref(false)
const releasing = ref(false)
const scrollEl = ref<HTMLElement | null>(null)

// Category suggestions to attach to the next message (rendered as buttons for
// the user). Picked from the category tree (leaves only), max 10.
interface LeafOption {
  id: number
  label: string
}
interface CategoryTreeItem extends TreeItem {
  id: number
  children?: CategoryTreeItem[]
}
const showCatPicker = ref(false)
const catTree = ref<ChatCategory[]>([])
const catExpanded = ref<string[]>([])
const loadingCats = ref(false)
const selectedCats = ref<LeafOption[]>([])
const selectedCatIds = computed(() => new Set(selectedCats.value.map((c) => c.id)))

const catTreeItems = computed<CategoryTreeItem[]>(() => {
  const toItem = (node: ChatCategory): CategoryTreeItem => {
    const item: CategoryTreeItem = { id: node.id, label: node.name }
    if (node.children?.length) item.children = node.children.map(toItem)
    return item
  }
  return catTree.value.map(toItem)
})

function catKey(item: CategoryTreeItem): string {
  return String(item.id)
}

let liveSub: { close: () => void } | null = null
// Highest message id seen — sent as `after_id` so a reconnect backfills the gap.
let lastLiveId = 0

onMounted(async () => {
  await ensureSession()
  if (!isAuthenticated.value || !isAdmin.value) {
    toast.add({ title: 'Halaman ini khusus admin', color: 'error' })
    navigateTo('/lainnya')
    return
  }
  await load()
  startStream()
})

onBeforeUnmount(() => liveSub?.close())

function toRow(m: ConversationMessage | LiveMessage): LiveRow {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    is_admin_reply: m.is_admin_reply ?? false,
    suggested_categories: m.suggested_categories ?? [],
  }
}

async function load() {
  loading.value = true
  try {
    const data = await admin.getConversation(conversationId)
    const conv = data.conversation as {
      title: string
      human_mode?: boolean
      human_mode_admin_id?: number | null
      pengguna?: { nama?: string }
    }
    title.value = conv.title
    userName.value = conv.pengguna?.nama ?? ''
    messages.value = data.messages.map(toRow)
    lastLiveId = data.messages.reduce((max, m) => (m.id > max ? m.id : max), 0)
    applyMode(conv.human_mode ?? false, conv.human_mode_admin_id ?? null)
    scrollToBottom()
  } catch {
    toast.add({ title: 'Gagal memuat percakapan', color: 'error' })
    navigateTo('/chat-admin-queue')
  } finally {
    loading.value = false
  }
}

function appendMessage(msg: LiveMessage) {
  if (msg.id > lastLiveId) lastLiveId = msg.id
  if (messages.value.some((m) => m.id === msg.id)) return
  messages.value = [...messages.value, toRow(msg)]
  scrollToBottom()
}

/** Reflect takeover ownership: held by me only if human_mode and the id matches. */
function applyMode(human: boolean, adminId: number | null) {
  const myId = Number(user.value?.id)
  heldByMe.value = human && adminId != null && adminId === myId
  if (!heldByMe.value && !loading.value) {
    toast.add({
      title: human ? 'Diambil admin lain' : 'Percakapan dilepas',
      description: human
        ? 'Percakapan ini sekarang ditangani admin lain.'
        : 'Percakapan sudah dikembalikan ke AI.',
      color: 'warning',
    })
  }
}

function startStream() {
  liveSub?.close()
  liveSub = subscribeConversationStream({
    url: admin.streamUrl(conversationId),
    getAuthHeader: () => getAuthHeader() as Record<string, string>,
    onMessage: appendMessage,
    onModeChange: (c) => applyMode(c.human_mode, c.human_mode_admin_id),
    getAfterId: () => lastLiveId,
    onResync: load,
  })
}

async function openCatPicker() {
  showCatPicker.value = true
  if (catTree.value.length) return
  loadingCats.value = true
  try {
    catTree.value = await chatApi.listCategories()
  } catch {
    toast.add({ title: 'Gagal memuat kategori', color: 'error' })
  } finally {
    loadingCats.value = false
  }
}

/** Parents are group headers; only leaves toggle a suggestion. */
function onCatSelect(e: TreeItemSelectEvent<CategoryTreeItem>) {
  const item = e.detail.value
  if (!item || item.children?.length) return
  toggleCat({ id: item.id, label: String(item.label ?? '') })
}

function toggleCat(opt: LeafOption) {
  if (selectedCatIds.value.has(opt.id)) {
    selectedCats.value = selectedCats.value.filter((c) => c.id !== opt.id)
  } else {
    if (selectedCats.value.length >= MAX_SUGGESTIONS) {
      toast.add({ title: `Maksimal ${MAX_SUGGESTIONS} kategori`, color: 'warning' })
      return
    }
    selectedCats.value = [...selectedCats.value, opt]
  }
}

function removeCat(id: number) {
  selectedCats.value = selectedCats.value.filter((c) => c.id !== id)
}

function closeCatPicker() {
  showCatPicker.value = false
}

async function send() {
  const content = input.value.trim()
  if (!content || sending.value) return
  const catIds = selectedCats.value.map((c) => c.id)
  input.value = ''
  sending.value = true
  try {
    await admin.sendLiveMessage(conversationId, content, catIds)
    selectedCats.value = []
    // The SSE channel echoes our message back, so we don't append it here.
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode
    if (status === 403) {
      toast.add({
        title: 'Belum diambil alih',
        description: 'Percakapan ini tidak sedang Anda tangani.',
        color: 'error',
      })
      navigateTo('/chat-admin-queue')
    } else {
      toast.add({ title: 'Gagal mengirim pesan', description: e?.data?.message, color: 'error' })
      input.value = content
    }
  } finally {
    sending.value = false
  }
}

async function release() {
  if (releasing.value) return
  if (!window.confirm('Lepas percakapan ini kembali ke AI?')) return
  releasing.value = true
  try {
    await admin.release(conversationId)
    liveSub?.close()
    toast.add({ title: 'Dilepas kembali ke AI', color: 'success' })
    navigateTo('/chat-admin-queue')
  } catch (e: any) {
    toast.add({ title: 'Gagal melepas percakapan', description: e?.data?.message, color: 'error' })
  } finally {
    releasing.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    const el = scrollEl.value
    if (el) el.scrollTo({ top: el.scrollHeight })
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

useHead({ title: 'Live Chat Admin' })
</script>

<template>
  <div class="h-full bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="shrink-0 flex items-center gap-3 px-3 py-3 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
      <BackButton />
      <div class="min-w-0 flex-1">
        <h1 class="text-base font-semibold text-gray-900 dark:text-white truncate">
          {{ title || 'Percakapan' }}
        </h1>
        <p v-if="userName" class="text-sm text-secondary dark:text-gray-400 truncate">{{ userName }}</p>
      </div>
      <button
        :disabled="releasing"
        class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-medium text-black dark:text-white hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
        @click="release"
      >
        <Icon name="mdi:robot-happy-outline" class="w-4 h-4" />
        Lepas ke AI
      </button>
    </header>

    <!-- Messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto px-3 py-4 space-y-3">
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="mdi:loading" class="w-7 h-7 animate-spin text-[#bf9638] dark:text-yellow-400" />
      </div>

      <template v-else v-for="m in messages" :key="m.id">
        <!-- User message (left) -->
        <div v-if="m.role === 'user'" class="flex justify-start">
          <div class="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-bl-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
            {{ m.content }}
          </div>
        </div>

        <!-- Admin / AI message (right) -->
        <div v-else class="flex flex-col items-end">
          <span
            v-if="m.is_admin_reply"
            class="mb-0.5 mr-1 text-[11px] font-medium text-green-700 dark:text-green-400"
          >
            Anda / Admin
          </span>
          <div class="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-primary dark:bg-yellow-500 text-black whitespace-pre-wrap break-words">
            {{ m.content }}
          </div>
          <div v-if="m.suggested_categories.length" class="flex flex-wrap gap-1.5 mt-1 justify-end">
            <span
              v-for="cat in m.suggested_categories"
              :key="cat.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400"
            >
              <Icon name="mdi:tag-outline" class="w-3 h-3" />
              {{ cat.name }}
            </span>
          </div>
        </div>
      </template>
    </div>

    <!-- Not held by me anymore (another admin took over, or released) -->
    <div
      v-if="!loading && !heldByMe"
      class="shrink-0 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-900/40 text-center text-sm text-yellow-800 dark:text-yellow-300"
    >
      Percakapan ini tidak lagi Anda tangani.
    </div>

    <!-- Input -->
    <div class="shrink-0 px-3 py-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <!-- Attached category suggestions (shown to the user as buttons) -->
      <div v-if="selectedCats.length" class="flex flex-wrap gap-1.5 mb-2">
        <span
          v-for="cat in selectedCats"
          :key="cat.id"
          class="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[12px] font-medium text-[#9a7400] dark:text-yellow-400"
        >
          <Icon name="mdi:tag-outline" class="w-3 h-3 shrink-0" />
          <span class="truncate max-w-40">{{ cat.label }}</span>
          <button
            class="p-0.5 inline-flex items-center justify-center rounded-full hover:bg-primary/20 dark:hover:bg-yellow-500/20"
            aria-label="Hapus kategori"
            @click="removeCat(cat.id)"
          >
            <Icon name="mdi:close" class="w-3 h-3" />
          </button>
        </span>
      </div>

      <div class="flex items-end gap-2">
        <button
          :disabled="!heldByMe"
          class="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 text-secondary dark:text-gray-300 hover:border-primary dark:hover:border-yellow-500 transition-colors disabled:opacity-40"
          aria-label="Lampirkan kategori"
          @click="openCatPicker"
        >
          <Icon name="mdi:tag-multiple-outline" class="w-5 h-5" />
        </button>
        <textarea
          v-model="input"
          rows="1"
          :disabled="!heldByMe"
          :placeholder="heldByMe ? 'Balas sebagai admin...' : 'Tidak dapat membalas'"
          class="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-yellow-500 disabled:opacity-60"
          @keydown="onKeydown"
        />
        <button
          :disabled="!input.trim() || sending || !heldByMe"
          class="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full bg-primary dark:bg-yellow-500 text-black transition-opacity disabled:opacity-40"
          aria-label="Kirim"
          @click="send"
        >
          <Icon name="mdi:send" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Category picker -->
    <UModal v-model:open="showCatPicker">
      <template #content>
        <div class="p-6">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h3 class="text-lg font-semibold text-black dark:text-white">Lampirkan kategori</h3>
            <button
              class="p-1 -mr-1 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Tutup"
              @click="showCatPicker = false"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>
          <p class="text-sm text-secondary dark:text-gray-400 mb-3">
            Dipilih {{ selectedCats.length }}/{{ MAX_SUGGESTIONS }}. Kategori ini muncul sebagai
            tombol saran untuk pengguna.
          </p>

          <div v-if="loadingCats" class="py-8 text-center">
            <Icon name="mdi:loading" class="w-6 h-6 animate-spin text-[#bf9638] dark:text-yellow-400" />
          </div>
          <div v-else class="max-h-[50vh] overflow-y-auto">
            <UTree
              v-model:expanded="catExpanded"
              :items="catTreeItems"
              :get-key="catKey"
              size="xl"
              expanded-icon=""
              collapsed-icon=""
              :ui="{
                link: 'items-start text-left text-xl',
                linkLabel: 'whitespace-normal break-words leading-snug',
                linkLeadingIcon: 'hidden',
              }"
              @select="onCatSelect"
            >
              <template #item-leading="{ item }">
                <Icon
                  v-if="!item.children?.length"
                  :name="selectedCatIds.has(item.id) ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
                  class="w-5 h-5 shrink-0 text-primary dark:text-yellow-400"
                />
              </template>
              <template #item-trailing="{ item, expanded: isExpanded }">
                <Icon
                  v-if="item.children?.length"
                  name="mdi:chevron-down"
                  class="w-4 h-4 shrink-0 text-secondary dark:text-gray-400 transition-transform"
                  :class="isExpanded ? 'rotate-180' : ''"
                />
              </template>
            </UTree>
          </div>

          <div class="flex justify-end mt-6">
            <UButton class="bg-[#bf9638] hover:opacity-90 text-black" @click="closeCatPicker">
              Selesai
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
