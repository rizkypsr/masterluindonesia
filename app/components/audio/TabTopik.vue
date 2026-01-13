<template>
  <div class="px-4">
    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 gap-4">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="h-24 bg-gray-200 rounded-xl"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
      </div>
    </div>

    <!-- Topics Grid -->
    <div v-else class="grid grid-cols-2 gap-4">
      <NuxtLink v-for="category in categories" :key="category.id"
        :to="{ path: `/audio/category/${category.id}`, query: { title: category.title } }"
        class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-center h-16 mb-2">
          <Icon name="mdi:music-circle" class="w-12 h-12 text-primary" />
        </div>
        <h3 class="text-sm font-medium text-black text-center line-clamp-2">{{ category.title }}</h3>
        <p class="text-xs text-gray-500 text-center mt-1">{{ category.sub_category.length }} item</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SubCategory {
  id: number
  code: string | null
  title: string
  parent_id: number
  order: number
  type: string
  languange: string
  image: string | null
}

interface Category {
  id: number
  code: string | null
  title: string
  parent_id: number | null
  order: number
  type: string
  languange: string
  image: string | null
  sub_category: SubCategory[]
}

defineProps<{
  categories: Category[]
  loading: boolean
}>()
</script>
