<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 px-4 py-4 flex items-center gap-3 shadow-sm">
      <button @click="$router.back()" class="p-1">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white">{{ pageTitle }}</h1>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Loading State -->
      <div v-if="pending" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div class="space-y-2 pl-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <!-- Video Groups -->
      <div v-else>
        <div v-for="group in videoGroups" :key="group.id" class="border-b border-gray-400 dark:border-gray-600 pb-2 mb-4">
          <!-- Group Title -->
          <h2 class="text-base font-semibold text-black dark:text-white mb-3">{{ group.title }}</h2>

          <!-- Video Items -->
          <div class="space-y-1">
            <NuxtLink v-for="video in group.sub_category" :key="video.id"
              :to="{ path: `/video/play/${video.id}`, query: { title: video.title } }"
              class="flex items-center gap-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 pl-4 rounded">
              <!-- Indonesian Flag -->
              <NuxtImg v-if="video.translate_id === 1" src="https://flagsapi.com/ID/flat/64.png" alt="ID"
                class="w-8 h-5 object-cover shrink-0 rounded-sm" />
              <!-- Chinese Flag -->
              <NuxtImg v-else-if="video.translate_ch === 1" src="https://flagsapi.com/CN/flat/64.png" alt="CN"
                class="w-8 h-5 object-cover shrink-0 rounded-sm" />
              <!-- No flag -->
              <div v-else class="w-8 shrink-0"></div>

              <!-- Video Title -->
              <span class="text-sm text-gray-700 dark:text-gray-300 flex-1">{{ video.title }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

interface VideoItem {
  id: number
  parent_id: number
  category_id: number
  sub_category_id: number
  title: string
  order: number
  translate_id: number
  translate_ch: number
}

interface VideoGroup {
  id: number
  parent_id: number | null
  category_id: number
  sub_category_id: number
  title: string
  order: number
  translate_id: number
  translate_ch: number
  sub_category: VideoItem[]
}

const route = useRoute()
const categoryId = computed(() => route.params.categoryId)
const subCategoryId = computed(() => route.params.subCategoryId)
const pageTitle = computed(() => (route.query.title as string) || 'Video')

const { data: videoData, pending } = await useFetch<{ success: boolean; data: VideoGroup[] }>(
  () => `https://api.masterluindonesia.com/api/videoCategory?category_id=${categoryId.value}&sub_category_id=${subCategoryId.value}`
)

const videoGroups = computed(() => videoData.value?.data?.sort((a, b) => a.order - b.order) || [])
</script>
