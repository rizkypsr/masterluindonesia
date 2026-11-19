<script setup lang="ts">
import type { ConversationListItem } from '~/composables/useChatApi'

/** One row in the chat history drawer. */
const props = defineProps<{
  conversation: ConversationListItem
  active?: boolean
  /** Swaps the row into an inline title editor. */
  editing?: boolean
  saving?: boolean
}>()

const emit = defineEmits<{
  select: []
  rename: []
  submitRename: [title: string]
  cancelRename: []
  move: []
  remove: []
}>()

const draft = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

// Seed the draft from the current title each time editing starts.
watch(
  () => props.editing,
  (editing) => {
    if (!editing) return
    draft.value = props.conversation.title || ''
    nextTick(() => inputEl.value?.focus())
  },
  { immediate: true },
)

const canSubmit = computed(() => !!draft.value.trim() && !props.saving)

function submit() {
  if (!canSubmit.value) return
  emit('submitRename', draft.value.trim())
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <!-- Inline rename -->
  <li
    v-if="editing"
    class="flex items-center gap-1 rounded-xl px-2 py-2 bg-gray-100 dark:bg-gray-700"
  >
    <input
      ref="inputEl"
      v-model="draft"
      type="text"
      maxlength="255"
      class="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-yellow-500"
      @keydown.enter.prevent="submit"
      @keydown.esc="emit('cancelRename')"
    />
    <button
      :disabled="!canSubmit"
      class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 disabled:opacity-40"
      aria-label="Simpan judul"
      @click="submit"
    >
      <Icon name="mdi:check" class="w-5 h-5" />
    </button>
    <button
      class="shrink-0 p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label="Batal"
      @click="emit('cancelRename')"
    >
      <Icon name="mdi:close" class="w-5 h-5" />
    </button>
  </li>

  <li
    v-else
    class="flex items-center gap-1 rounded-xl px-3 py-2.5 cursor-pointer transition-colors"
    :class="active ? 'bg-primary/10 dark:bg-yellow-500/10' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
    @click="emit('select')"
  >
    <Icon name="mdi:message-text-outline" class="w-4 h-4 mr-1 text-secondary dark:text-gray-400 shrink-0" />
    <div class="min-w-0 flex-1">
      <p class="text-base text-gray-900 dark:text-white truncate">
        {{ conversation.title || 'Tanpa judul' }}
      </p>
      <div class="flex items-center gap-1.5">
        <span
          v-if="conversation.category"
          class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/15 dark:bg-yellow-500/15 text-[11px] font-medium text-[#9a7400] dark:text-yellow-400 truncate max-w-24"
        >
          {{ conversation.category.name }}
        </span>
        <p class="text-sm text-secondary dark:text-gray-400">{{ formatDate(conversation.updated_at) }}</p>
      </div>
    </div>
    <button
      class="p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 hover:bg-primary/10 dark:hover:bg-yellow-500/10 transition-colors"
      aria-label="Ubah judul"
      @click.stop="emit('rename')"
    >
      <Icon name="mdi:pencil-outline" class="w-4 h-4" />
    </button>
    <button
      class="p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400 hover:bg-primary/10 dark:hover:bg-yellow-500/10 transition-colors"
      aria-label="Pindahkan ke grup"
      @click.stop="emit('move')"
    >
      <Icon name="mdi:folder-move-outline" class="w-4 h-4" />
    </button>
    <button
      class="p-1.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
      aria-label="Hapus percakapan"
      @click.stop="emit('remove')"
    >
      <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
    </button>
  </li>
</template>
