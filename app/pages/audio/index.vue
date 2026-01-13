<template>
  <div>
    <!-- Header -->
    <div class="px-4 pt-6 pb-4 shadow-md"
      style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <h1 class="text-black mb-2 font-semibold">Audio Dokumentasi</h1>
      <div class="flex items-center bg-white rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-black mr-2" />
        <input v-model="searchQuery" type="text" placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400" />
      </div>
    </div>

    <!-- TAB BAR -->
    <div class="bg-white shadow-md">
      <div class="flex">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === tab.id ? 'text-black' : 'text-gray-400'">
          {{ tab.label }}
          <span v-if="activeTab === tab.id" class="absolute bottom-0 left-4 right-4 h-0.5 bg-black rounded-full" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="py-4">
      <AudioTabDaftarIsi v-if="activeTab === 'daftarisi'" :categories="filteredCategories" :loading="pending" />
      <AudioTabTopik v-else-if="activeTab === 'topik'" :categories="filteredCategories" :loading="pending" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

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

const activeTab = ref("daftarisi")
const searchQuery = ref("")

const tabs = [
  { id: "daftarisi", label: "Daftar Isi" },
  { id: "topik", label: "Topik" },
]

const { data: categoriesData, pending } = await useFetch<{ success: boolean; data: Category[] }>(
  'https://api.masterluindonesia.com/api/category?type=audio&languange=CH'
)

const categories = computed(() => categoriesData.value?.data?.sort((a, b) => a.order - b.order) || [])

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return categories.value
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(cat => 
    cat.title.toLowerCase().includes(query) ||
    cat.sub_category.some(sub => sub.title.toLowerCase().includes(query))
  )
})
</script>
