<template>
  <div class="px-4">
    <!-- Banner Images -->
    <div class="pb-4">
      <NuxtImg src="https://masterluindonesia.com/assets/assets/images/main_image_audio_screen.jpeg" alt="Gambar" />
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-600 mb-6">
      Mendengarkan acara rekaman Master Jun Honglu setiap hari bisa membuka kebijaksanaan,
      meningkatkan tingkat kesadaran, memperbaiki segala perilaku dan kebiasaan buruk, mengubah
      nasib dan mendapatkan banyak manfaat lainnya.
    </p>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Categories Accordion -->
    <div v-else class="divide-y divide-gray-200">
      <div v-for="category in categories" :key="category.id" class="py-4">
        <button @click="toggleCategory(category.id)" class="w-full flex items-center justify-between">
          <div class="text-left">
            <h3 class="text-base font-semibold text-black">{{ category.title }}</h3>
            <p class="text-sm text-gray-500">{{ category.sub_category.length }} subkategori</p>
          </div>
          <Icon :name="expandedCategories.includes(category.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="w-6 h-6 text-gray-400" />
        </button>

        <!-- Sub Categories -->
        <div v-if="expandedCategories.includes(category.id)" class="mt-3 pl-4 divide-y divide-gray-100">
          <NuxtLink v-for="sub in category.sub_category" :key="sub.id"
            :to="{ path: `/video/${category.id}/${sub.id}`, query: { title: sub.title } }"
            class="block py-3 text-sm text-gray-700 hover:text-black">
            {{ sub.title }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

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

const expandedCategories = ref<number[]>([])

const toggleCategory = (id: number) => {
  const index = expandedCategories.value.indexOf(id)
  if (index === -1) {
    expandedCategories.value.push(id)
  } else {
    expandedCategories.value.splice(index, 1)
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
