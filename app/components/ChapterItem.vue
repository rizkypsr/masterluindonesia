<template>
  <div>
    <!-- Non-clickable Chapter Header (has children) -->
    <div 
      v-if="chapter.have_child === 1 && chapter.sub && chapter.sub.length > 0"
      class="py-3 border-b border-gray-400 dark:border-gray-600"
      :style="{ marginLeft: (level * 16) + 'px' }"
    >
      <span class="text-black dark:text-white font-bold" :style="{ fontSize: fontSize + 'px' }">
        {{ chapter.title }}
      </span>
    </div>

    <!-- Clickable Chapter Link (no children) -->
    <NuxtLink 
      v-else
      :to="{ path: `/book/${bookId}/${chapter.id}`, query: { chapter: chapter.title } }"
      class="block cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <div 
        class="py-3 border-b border-gray-400 dark:border-gray-600"
        :style="{ marginLeft: (level * 16) + 'px' }"
      >
        <span class="text-black dark:text-white" :style="{ fontSize: fontSize + 'px' }">
          {{ chapter.title }}
        </span>
      </div>
    </NuxtLink>

    <!-- Nested Sub Chapters (Recursive) -->
    <ChapterItem
      v-if="chapter.sub && chapter.sub.length > 0"
      v-for="subChapter in chapter.sub"
      :key="subChapter.id"
      :chapter="subChapter"
      :book-id="bookId"
      :font-size="fontSize"
      :level="level + 1"
    />
  </div>
</template>

<script setup lang="ts">
interface SubChapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub?: SubChapter[]
}

interface Props {
  chapter: SubChapter
  bookId: string
  fontSize: number
  level: number
}

defineProps<Props>()
</script>
