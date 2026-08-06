<script setup lang="ts">
import { useAuth } from '~/lib/auth'
import {
  useChatAdminApi,
  type QueueItem,
  type TakeoverItem,
} from '~/composables/useChatAdminApi'
import type { ConversationMessage } from '~/composables/useChatApi'

const { isAuthenticated, isAdmin, ensureSession } = useAuth()
const admin = useChatAdminApi()
const toast = useToast()

const items = ref<QueueItem[]>([])
const total = ref(0)
const loading = ref(true)

// Conversations currently under live takeover (resume list).
const takeovers = ref<TakeoverItem[]>([])
const takingOver = ref<number | null>(null)

// Reply sheet
const active = ref<QueueItem | null>(null)
const replyText = ref('')
const sending = ref(false)

// Context (full conversation history) inside the sheet
const context = ref<ConversationMessage[]>([])
const loadingContext = ref(false)
const showContext = ref(false)

onMounted(async () => {
  await ensureSession()
  if (!isAuthenticated.value || !isAdmin.value) {
    toast.add({ title: 'Halaman ini khusus admin', color: 'error' })
    navigateTo('/lainnya')
    return
  }
  refresh()
})

async function refresh() {
  loading.value = true
  refreshTakeovers()
  try {
    const data = await admin.getQueue(1, 50)
    items.value = data.items
    total.value = data.total
  } catch {
    toast.add({ title: 'Gagal memuat antrian', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function refreshTakeovers() {
  try {
    takeovers.value = await admin.listTakeovers()
  } catch {
    /* non-fatal — resume list just stays as-is */
  }
}

/** Claim a conversation and open the live chat page. */
async function startTakeover(conversationId: number) {
  if (takingOver.value) return
  takingOver.value = conversationId
  try {
    await admin.takeover(conversationId)
    navigateTo(`/chat-admin-live/${conversationId}`)
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode
    if (status === 409) {
      toast.add({ title: 'Sudah diambil admin lain', color: 'warning' })
      refresh()
    } else {
      toast.add({ title: 'Gagal mengambil alih', description: e?.data?.message, color: 'error' })
    }
  } finally {
    takingOver.value = null
  }
}

function openLive(conversationId: number) {
  navigateTo(`/chat-admin-live/${conversationId}`)
}

// UModal wants a boolean; drive it off whether a queue item is active.
const replyOpen = computed({
  get: () => active.value !== null,
  set: (v: boolean) => {
    if (!v) active.value = null
  },
})

function openReply(item: QueueItem) {
  active.value = item
  replyText.value = ''
  context.value = []
  showContext.value = false
}

function closeReply() {
  active.value = null
}

async function loadContext() {
  if (!active.value) return
  showContext.value = true
  if (context.value.length) return
  loadingContext.value = true
  try {
    const data = await admin.getConversation(active.value.conversation_id)
    context.value = data.messages
  } catch {
    toast.add({ title: 'Gagal memuat riwayat', color: 'error' })
    showContext.value = false
  } finally {
    loadingContext.value = false
  }
}

async function submitReply() {
  const item = active.value
  const reply = replyText.value.trim()
  if (!item || !reply || sending.value) return

  sending.value = true
  try {
    await admin.replyMessage(item.message_id, reply)
    toast.add({ title: 'Balasan terkirim', color: 'success' })
    items.value = items.value.filter((x) => x.message_id !== item.message_id)
    total.value = Math.max(total.value - 1, items.value.length)
    active.value = null
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode
    if (status === 404) {
      // Already answered (possibly by another admin) or gone.
      toast.add({
        title: 'Sudah dijawab',
        description: 'Pertanyaan ini sudah dijawab admin lain.',
        color: 'warning',
      })
      items.value = items.value.filter((x) => x.message_id !== item.message_id)
      active.value = null
    } else {
      toast.add({ title: 'Gagal mengirim balasan', description: e?.data?.message, color: 'error' })
    }
  } finally {
    sending.value = false
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

useHead({ title: 'Antrian Jawaban' })
</script>

<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="shrink-0 px-4 py-4 shadow-sm bg-white dark:bg-gray-800">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BackButton />
          <h1 class="text-lg font-semibold text-black dark:text-white">Antrian Jawaban</h1>
        </div>
        <button
          class="p-2 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Muat ulang"
          @click="refresh"
        >
          <Icon name="mdi:refresh" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 py-4 space-y-5">
      <!-- Live: conversations this admin fleet is handling now -->
      <div v-if="takeovers.length">
        <p class="text-sm font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 mb-2">
          Sedang ditangani
        </p>
        <div class="space-y-2">
          <button
            v-for="t in takeovers"
            :key="t.conversation_id"
            class="w-full text-left p-3 rounded-xl border border-green-300 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 hover:border-green-500 transition-colors"
            @click="openLive(t.conversation_id)"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:account-tie" class="w-4 h-4 shrink-0 text-green-700 dark:text-green-400" />
              <p class="text-base font-medium text-black dark:text-white truncate flex-1">
                {{ t.title || 'Tanpa judul' }}
              </p>
            </div>
            <p class="text-sm text-secondary dark:text-gray-400 mt-1">
              {{ t.pengguna?.nama || 'Pengguna' }} · {{ formatDateTime(t.updated_at) }}
            </p>
          </button>
        </div>
      </div>

      <!-- Queue -->
      <div>
        <div v-if="loading" class="flex justify-center py-12">
          <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-[#bf9638] dark:text-yellow-400" />
        </div>

        <div v-else-if="!items.length" class="text-center text-gray-500 dark:text-gray-400 py-12">
          <Icon name="mdi:check-circle-outline" class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Tidak ada pertanyaan menunggu.</p>
        </div>

        <div v-else class="space-y-2">
          <p class="text-sm text-secondary dark:text-gray-400 mb-1">{{ total }} menunggu jawaban</p>
          <div
            v-for="item in items"
            :key="item.message_id"
            class="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <p class="text-base font-medium text-black dark:text-white break-words">{{ item.question }}</p>
            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span
                v-if="item.category"
                class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400"
              >
                {{ item.category.name }}
              </span>
              <span class="text-sm text-secondary dark:text-gray-400">
                {{ item.pengguna?.nama || 'Pengguna' }} · {{ formatDateTime(item.created_at) }}
              </span>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-black dark:text-white hover:border-primary dark:hover:border-yellow-500 transition-colors"
                @click="openReply(item)"
              >
                <Icon name="mdi:reply" class="w-4 h-4" />
                Jawab sekali
              </button>
              <button
                :disabled="takingOver === item.conversation_id"
                class="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                @click="startTakeover(item.conversation_id)"
              >
                <Icon name="mdi:headset" class="w-4 h-4" />
                Ambil alih
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reply sheet -->
    <UModal v-model:open="replyOpen" :dismissible="!sending">
      <template #content>
        <div v-if="active" class="p-6 max-h-[85vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-2 mb-3">
            <h3 class="text-lg font-semibold text-black dark:text-white">Jawab pertanyaan</h3>
            <button
              class="p-1 -mr-1 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Tutup"
              @click="closeReply"
            >
              <Icon name="mdi:close" class="w-5 h-5" />
            </button>
          </div>

          <!-- The question + who asked -->
          <div class="rounded-xl bg-gray-100 dark:bg-gray-700/60 p-3 mb-3">
            <p class="text-base text-gray-900 dark:text-white break-words">{{ active.question }}</p>
            <p class="text-sm text-secondary dark:text-gray-400 mt-1">
              {{ active.pengguna?.nama || 'Pengguna' }}
              <template v-if="active.category"> · {{ active.category.name }}</template>
            </p>
          </div>

          <!-- Optional: full conversation context -->
          <button
            class="flex items-center gap-1 text-sm text-primary dark:text-yellow-400 font-medium mb-3"
            @click="loadContext"
          >
            <Icon name="mdi:history" class="w-4 h-4" />
            Lihat riwayat percakapan
          </button>

          <div v-if="showContext" class="mb-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <div v-if="loadingContext" class="py-4 text-center">
              <Icon name="mdi:loading" class="w-5 h-5 animate-spin text-secondary dark:text-gray-400" />
            </div>
            <div v-else class="space-y-2 max-h-56 overflow-y-auto">
              <div
                v-for="m in context"
                :key="m.id"
                class="text-sm"
                :class="m.role === 'user' ? 'text-right' : 'text-left'"
              >
                <span
                  class="inline-block px-3 py-1.5 rounded-xl break-words max-w-[85%]"
                  :class="m.role === 'user'
                    ? 'bg-primary/15 dark:bg-yellow-500/15 text-gray-900 dark:text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'"
                >
                  {{ m.content }}
                </span>
              </div>
            </div>
          </div>

          <label class="block text-black dark:text-white font-medium mb-2">Jawaban Anda</label>
          <textarea
            v-model="replyText"
            rows="5"
            placeholder="Tulis jawaban untuk pengguna..."
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#bf9638] focus:outline-none text-black dark:text-white bg-white dark:bg-gray-800"
          />

          <div class="flex gap-3 justify-end mt-6">
            <UButton variant="outline" :disabled="sending" @click="closeReply">
              Batal
            </UButton>
            <UButton
              :loading="sending"
              :disabled="!replyText.trim()"
              class="bg-[#bf9638] hover:opacity-90 text-black"
              @click="submitReply"
            >
              Kirim Balasan
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
