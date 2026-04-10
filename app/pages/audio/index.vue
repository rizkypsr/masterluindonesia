<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="px-4 pt-6 pb-4 shadow-md bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shrink-0">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-black dark:text-white font-semibold">Audio Dokumentasi</h1>
        <button @click="showInfoModal = true" class="p-1 hover:bg-white/20 dark:hover:bg-gray-600 rounded transition-colors">
          <Icon name="mdi:information" class="w-6 h-6 text-black dark:text-white" />
        </button>
      </div>
      <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-black dark:text-gray-300 mr-2" />
        <input v-model="searchQuery" type="text" placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto py-4 px-4">
      <!-- Banner Images -->
      <div class="pb-4">
        <NuxtImg src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Fmain_image_audio_screen.jpeg?alt=media&token=ba63e4f9-e51b-4e3d-a34e-a38c139ace1f" alt="Gambar" class="rounded-lg" />
      </div>

      <!-- Description -->
      <p class="text-md text-black dark:text-gray-300 mb-6 text-center">
        Mendengarkan acara rekaman Master Jun Honglu setiap hari bisa membuka kebijaksanaan,
        meningkatkan tingkat kesadaran, memperbaiki segala perilaku dan kebiasaan buruk, mengubah
        nasib dan mendapatkan banyak manfaat lainnya.
      </p>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>

      <!-- Categories Accordion -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-for="category in filteredCategories" :key="category.id" class="py-4">
          <button @click="toggleCategory(category.id)" class="w-full flex items-center justify-between">
            <div class="text-left">
              <h3 class="text-base font-semibold text-black dark:text-white">{{ category.title }}</h3>
              <p class="text-lg text-gray-500 dark:text-gray-400">{{ category.sub_category.length }} subkategori</p>
            </div>
            <Icon :name="expandedCategories.includes(category.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </button>

          <!-- Sub Categories -->
          <div v-if="expandedCategories.includes(category.id)" class="mt-3 pl-4 divide-y divide-gray-100 dark:divide-gray-800">
            <NuxtLink v-for="sub in category.sub_category" :key="sub.id"
              :to="{ path: `/audio/${sub.id}`, query: { title: sub.title } }"
              class="block py-3 text-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
              {{ sub.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Information Modal -->
    <UModal v-model:open="showInfoModal" title="Informasi Audio">
      <template #body>
        <div v-if="isLoadingInfo" class="flex justify-center py-8">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
        </div>

        <div v-else-if="infoDescription" class="text-black dark:text-white">
          <div class="text-base leading-relaxed" v-html="infoDescription"></div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">Tidak ada informasi tersedia</p>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
import { ref, computed, watch } from "vue"

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

const searchQuery = ref("")
const expandedCategories = ref<number[]>([])

// Information modal state
const showInfoModal = ref(false)
const infoDescription = ref('')
const isLoadingInfo = ref(false)

// Fetch information when modal opens
const fetchInformation = async () => {
  if (infoDescription.value) return // Already fetched
  
  isLoadingInfo.value = true
  try {
    const response = await $fetch<{
      success: boolean
      message: string
      data: Array<{
        id: number
        description: string
        type: string
        created_at: string
        updated_at: string
      }>
    }>(`${config.public.apiBaseUrl}/information?type=audio`)
    
    if (response.success && response.data.length > 0) {
      infoDescription.value = response.data[0].description
    }
  } catch (error) {
    console.error('Failed to fetch information:', error)
  } finally {
    isLoadingInfo.value = false
  }
}

// Watch for modal open to fetch information
watch(showInfoModal, (isOpen) => {
  if (isOpen) {
    fetchInformation()
  }
})

const { data: categoriesData, pending } = await useFetch<{ success: boolean; data: Category[] }>(
  `${config.public.apiBaseUrl}/category?type=audio&languange=CH`
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

const toggleCategory = (id: number) => {
  const index = expandedCategories.value.indexOf(id)
  if (index === -1) {
    expandedCategories.value.push(id)
  } else {
    expandedCategories.value.splice(index, 1)
  }
}
</script>
