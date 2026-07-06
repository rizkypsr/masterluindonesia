<template>
  <div v-if="loading" class="py-6 text-center">
    <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
  </div>
  <div v-else class="space-y-3">
    <template v-for="node in categories" :key="node.id">
      <!-- Group header (has children): label + its leaf children -->
      <div v-if="node.children.length">
        <p class="text-xs font-semibold uppercase tracking-wide text-secondary dark:text-gray-400 mb-1.5 px-0.5">
          {{ node.name }}
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="child in node.children"
            :key="child.id"
            type="button"
            class="flex items-center gap-2 px-3 py-3 rounded-xl border text-left text-sm font-medium transition-colors"
            :class="btnClass(child.id)"
            @click="emit('select', child)"
          >
            <Icon name="mdi:tag-outline" class="w-5 h-5 text-primary dark:text-yellow-400 shrink-0" />
            <span class="truncate">{{ child.name }}</span>
          </button>
        </div>
      </div>

      <!-- Top-level leaf (no children): selectable on its own -->
      <button
        v-else
        type="button"
        class="w-full flex items-center gap-2 px-3 py-3 rounded-xl border text-left text-sm font-medium transition-colors"
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

function btnClass(id: number): string {
  return props.selectedId === id
    ? 'border-primary dark:border-yellow-500 bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white'
    : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-primary dark:hover:border-yellow-500 hover:bg-primary/5 dark:hover:bg-yellow-500/10'
}
</script>
