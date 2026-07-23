<template>
  <div v-if="loading" class="py-6 text-center">
    <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
  </div>
  <div v-else class="space-y-2">
    <template v-for="node in categories" :key="node.id">
      <!-- Group (has children): row with label + dropdown toggle -->
      <div
        v-if="node.children.length"
        class="rounded-xl border overflow-hidden"
        :class="hasSelectedChild(node) ? 'border-primary dark:border-yellow-500' : 'border-gray-200 dark:border-gray-700'"
      >
        <button
          type="button"
          class="w-full flex items-center justify-between gap-2 px-3 py-3 text-left transition-colors"
          :class="hasSelectedChild(node)
            ? 'bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white'
            : 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/40'"
          @click="toggle(node.id)"
        >
          <span class="min-w-0 flex-1">
            <span class="block text-base font-medium truncate">{{ node.name }}</span>
            <span
              v-if="selectedChildOf(node)"
              class="block text-sm text-primary dark:text-yellow-400 truncate mt-0.5"
            >
              {{ selectedChildOf(node)!.name }}
            </span>
          </span>
          <Icon
            name="mdi:chevron-down"
            class="w-5 h-5 shrink-0 text-secondary dark:text-gray-400 transition-transform"
            :class="isOpen(node.id) ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="isOpen(node.id)" class="border-t border-gray-100 dark:border-gray-700 p-1.5 space-y-1">
          <button
            v-for="child in node.children"
            :key="child.id"
            type="button"
            class="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-base transition-colors"
            :class="btnClass(child.id)"
            @click="emit('select', child)"
          >
            <Icon name="mdi:tag-outline" class="w-4 h-4 text-primary dark:text-yellow-400 shrink-0" />
            <span class="truncate">{{ child.name }}</span>
          </button>
        </div>
      </div>

      <!-- Top-level leaf (no children): selectable on its own -->
      <button
        v-else
        type="button"
        class="w-full flex items-center gap-2 px-3 py-3 rounded-xl border text-left text-base font-medium transition-colors"
        :class="btnClass(node.id)"
        @click="emit('select', node)"
      >
        <Icon name="mdi:tag-outline" class="w-5 h-5 text-primary dark:text-yellow-400 shrink-0" />
        <span class="truncate">{{ node.name }}</span>
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ChatCategory } from '~/composables/useChatApi'

const props = defineProps<{
  categories: ChatCategory[]
  selectedId?: number | null
  loading?: boolean
}>()

const emit = defineEmits<{ select: [cat: ChatCategory] }>()

const openIds = ref<Set<number>>(new Set())

function isOpen(id: number): boolean {
  return openIds.value.has(id)
}

function toggle(id: number) {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
}

function selectedChildOf(node: ChatCategory): ChatCategory | undefined {
  if (props.selectedId == null) return undefined
  return node.children.find((c) => c.id === props.selectedId)
}

function hasSelectedChild(node: ChatCategory): boolean {
  return !!selectedChildOf(node)
}

// Auto-expand the group that already contains the selected child (e.g. when
// resuming a conversation from history).
watch(
  () => [props.categories, props.selectedId] as const,
  ([cats, selectedId]) => {
    if (selectedId == null) return
    const parent = cats.find((n) => n.children.some((c) => c.id === selectedId))
    if (parent && !openIds.value.has(parent.id)) {
      openIds.value = new Set(openIds.value).add(parent.id)
    }
  },
  { immediate: true },
)

function btnClass(id: number): string {
  return props.selectedId === id
    ? 'border border-primary dark:border-yellow-500 bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white'
    : 'border border-transparent text-gray-800 dark:text-gray-100 hover:border-primary dark:hover:border-yellow-500 hover:bg-primary/5 dark:hover:bg-yellow-500/10'
}
</script>
