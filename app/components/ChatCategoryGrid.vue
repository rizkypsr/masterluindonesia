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
        <div
          class="w-full flex items-center gap-2 px-3 py-3 text-left transition-colors"
          :class="hasSelectedChild(node)
            ? 'bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white'
            : 'text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/40'"
        >
          <button type="button" class="min-w-0 flex-1 flex items-center gap-2 text-left" @click="toggle(node.id)">
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
          <button
            v-if="node.description"
            type="button"
            class="shrink-0 p-1 rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400"
            aria-label="Info kategori"
            @click.stop="toggleInfo(node.id)"
          >
            <Icon name="mdi:information-outline" class="w-4 h-4" />
          </button>
        </div>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-if="node.description && infoOpen(node.id)"
          class="desc-html px-3 pb-2.5 -mt-1 text-sm text-secondary dark:text-gray-400"
          v-html="node.description"
        />

        <div v-if="isOpen(node.id)" class="border-t border-gray-100 dark:border-gray-700 p-1.5 space-y-1">
          <template v-for="child in node.children" :key="child.id">
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-base transition-colors"
                :class="btnClass(child.id)"
                @click="emit('select', child)"
              >
                <Icon name="mdi:tag-outline" class="w-4 h-4 text-primary dark:text-yellow-400 shrink-0" />
                <span class="truncate">{{ child.name }}</span>
              </button>
              <button
                v-if="child.description"
                type="button"
                class="shrink-0 p-1.5 rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400"
                aria-label="Info kategori"
                @click.stop="toggleInfo(child.id)"
              >
                <Icon name="mdi:information-outline" class="w-4 h-4" />
              </button>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div
              v-if="child.description && infoOpen(child.id)"
              class="desc-html px-3 pb-1.5 text-sm text-secondary dark:text-gray-400"
              v-html="child.description"
            />
          </template>
        </div>
      </div>

      <!-- Top-level leaf (no children): selectable on its own -->
      <div v-else class="rounded-xl border overflow-hidden" :class="props.selectedId === node.id ? 'border-primary dark:border-yellow-500' : 'border-gray-200 dark:border-gray-700'">
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="flex-1 min-w-0 flex items-center gap-2 px-3 py-3 text-left text-base font-medium transition-colors"
            :class="btnClass(node.id, true)"
            @click="emit('select', node)"
          >
            <Icon name="mdi:tag-outline" class="w-5 h-5 text-primary dark:text-yellow-400 shrink-0" />
            <span class="truncate">{{ node.name }}</span>
          </button>
          <button
            v-if="node.description"
            type="button"
            class="shrink-0 mr-2 p-1 rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400"
            aria-label="Info kategori"
            @click.stop="toggleInfo(node.id)"
          >
            <Icon name="mdi:information-outline" class="w-4 h-4" />
          </button>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div
          v-if="node.description && infoOpen(node.id)"
          class="desc-html px-3 pb-2.5 -mt-1 text-sm text-secondary dark:text-gray-400"
          v-html="node.description"
        />
      </div>
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
const infoOpenIds = ref<Set<number>>(new Set())

function isOpen(id: number): boolean {
  return openIds.value.has(id)
}

function toggle(id: number) {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
}

function infoOpen(id: number): boolean {
  return infoOpenIds.value.has(id)
}

function toggleInfo(id: number) {
  const next = new Set(infoOpenIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  infoOpenIds.value = next
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

function btnClass(id: number, bordered = false): string {
  const border = bordered ? '' : 'border '
  if (props.selectedId === id) {
    return `${border}border-primary dark:border-yellow-500 bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white`
  }
  return `${border}border-transparent text-gray-800 dark:text-gray-100 hover:border-primary dark:hover:border-yellow-500 hover:bg-primary/5 dark:hover:bg-yellow-500/10`
}
</script>

<style scoped>
/* `description` is stored as HTML in the DB — style the common tags it uses. */
.desc-html :deep(p) {
  margin: 0 0 0.35rem;
}
.desc-html :deep(p:last-child) {
  margin-bottom: 0;
}
.desc-html :deep(ul),
.desc-html :deep(ol) {
  margin: 0.25rem 0;
  padding-left: 1.1rem;
}
.desc-html :deep(ul) {
  list-style: disc;
}
.desc-html :deep(ol) {
  list-style: decimal;
}
.desc-html :deep(strong) {
  font-weight: 600;
}
.desc-html :deep(a) {
  color: var(--color-primary, #c09637);
  text-decoration: underline;
}
</style>
