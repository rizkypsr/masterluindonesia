<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent } from 'reka-ui'
import type { ChatCategory } from '~/composables/useChatApi'

interface CategoryTreeItem extends TreeItem {
  id: number
  description?: string | null
  children?: CategoryTreeItem[]
}

const props = defineProps<{
  categories: ChatCategory[]
  selectedId?: number | null
  loading?: boolean
}>()

const emit = defineEmits<{ select: [cat: ChatCategory] }>()

/** Keys of the expanded branches, as returned by `getKey`. */
const expanded = ref<string[]>([])
/** Ids whose description is currently revealed. */
const infoOpenIds = ref<Set<number>>(new Set())

/** Flat id → node lookup, so a tree select can emit the original category. */
const nodeById = computed(() => {
  const map = new Map<number, ChatCategory>()
  const walk = (list: ChatCategory[]) => {
    for (const n of list) {
      map.set(n.id, n)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(props.categories)
  return map
})

const treeItems = computed<CategoryTreeItem[]>(() => {
  const toItem = (node: ChatCategory): CategoryTreeItem => {
    const hasChildren = !!node.children?.length
    const item: CategoryTreeItem = {
      id: node.id,
      label: node.name,
      description: node.description ?? null,
      class:
        props.selectedId === node.id
          ? 'bg-primary/10 dark:bg-yellow-500/10 text-gray-900 dark:text-white'
          : undefined,
    }
    if (hasChildren) item.children = node.children.map(toItem)
    return item
  }
  return props.categories.map(toItem)
})

function getKey(item: CategoryTreeItem): string {
  return String(item.id)
}

function isInfoOpen(id: number): boolean {
  return infoOpenIds.value.has(id)
}

function toggleInfo(id: number) {
  const next = new Set(infoOpenIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  infoOpenIds.value = next
}

/** Parents are group headers — only leaves are selectable. */
function onSelect(e: TreeItemSelectEvent<CategoryTreeItem>) {
  const item = e.detail.value
  if (!item || item.children?.length) return
  const node = nodeById.value.get(item.id)
  if (node) emit('select', node)
}

/** Ids from root down to `targetId` inclusive, or null if not in the tree. */
function pathTo(list: ChatCategory[], targetId: number): number[] | null {
  for (const node of list) {
    if (node.id === targetId) return [node.id]
    if (node.children?.length) {
      const below = pathTo(node.children, targetId)
      if (below) return [node.id, ...below]
    }
  }
  return null
}

// Expand every branch on the path to the current selection, at any depth (e.g.
// when resuming a conversation from history, or reopening the picker).
watch(
  () => [props.categories, props.selectedId] as const,
  ([cats, selectedId]) => {
    if (selectedId == null) return
    // Drop the leaf itself — only its ancestors need expanding.
    const ancestors = (pathTo(cats, selectedId) ?? []).slice(0, -1).map(String)
    const missing = ancestors.filter((id) => !expanded.value.includes(id))
    if (missing.length) expanded.value = [...expanded.value, ...missing]
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="loading" class="py-6 text-center">
    <Icon name="mdi:loading" class="w-6 h-6 text-secondary dark:text-gray-400 animate-spin" />
  </div>

  <UTree
    v-else
    v-model:expanded="expanded"
    :items="treeItems"
    :get-key="getKey"
    size="xl"
    expanded-icon=""
    collapsed-icon=""
    :ui="{
      link: 'items-start text-left text-xl',
      linkLabel: 'whitespace-normal break-words leading-snug',
      linkLeadingIcon: 'hidden',
    }"
    @select="onSelect"
  >
    <template #item-label="{ item }">
      <span class="block">{{ item.label }}</span>
      <!-- `description` is stored as HTML in the DB. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <span
        v-if="item.description && isInfoOpen(item.id)"
        class="desc-html block mt-1 text-sm font-normal text-secondary dark:text-gray-400"
        v-html="item.description"
      />
    </template>

    <template #item-trailing="{ item, expanded: isExpanded }">
      <button
        v-if="item.description"
        type="button"
        class="p-0.5 inline-flex items-center justify-center rounded-full text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-yellow-400"
        aria-label="Info kategori"
        @click.stop.prevent="toggleInfo(item.id)"
      >
        <Icon name="mdi:information-outline" class="w-4 h-4" />
      </button>
      <Icon
        v-if="item.children?.length"
        name="mdi:chevron-down"
        class="w-4 h-4 shrink-0 text-secondary dark:text-gray-400 transition-transform"
        :class="isExpanded ? 'rotate-180' : ''"
      />
    </template>
  </UTree>
</template>

<style scoped>
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
