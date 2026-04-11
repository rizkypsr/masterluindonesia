<template>
  <div class="h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="px-4 pt-6 pb-4 shadow-md bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 shrink-0">
      <h1 class="text-black dark:text-white mb-2 font-semibold">Video Dokumentasi</h1>
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
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
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
        <div v-for="category in filteredCategories" :key="category.id" :id="`category-${category.id}`" class="py-4">
          <div class="flex items-center justify-between">
            <button @click="toggleCategory(category.id)" class="flex-1 flex items-center justify-between">
              <div class="text-left">
                <h3 class="text-base font-semibold text-black dark:text-white">{{ category.title }}</h3>
                <p class="text-lg text-gray-500 dark:text-gray-400">{{ category.sub_category.length }} subkategori</p>
              </div>
              <Icon :name="expandedCategories.includes(category.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </button>
            <button @click="shareCategory(category)" class="p-1 ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <Icon name="mdi:share-variant" class="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          <!-- Sub Categories -->
          <div v-if="expandedCategories.includes(category.id)" class="mt-3 pl-4 divide-y divide-gray-100 dark:divide-gray-800">
            <button v-for="sub in category.sub_category" :key="sub.id"
              v-ripple
              @click="$router.push({ path: `/video/${category.id}/${sub.id}`, query: { title: sub.title } })"
              class="w-full text-left block py-3 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 rounded transition-colors">
              <span class="text-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400 active:text-primary dark:active:text-yellow-400 transition-colors">{{ sub.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
import { ref, computed, onMounted } from "vue"

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

const { data: categoriesData, pending } = await useFetch<{ success: boolean; data: Category[] }>(
  `${config.public.apiBaseUrl}/category?type=video&languange=CH`
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

const shareCategory = async (category: Category) => {
  // Ensure category is expanded when sharing
  if (!expandedCategories.value.includes(category.id)) {
    expandedCategories.value.push(category.id)
  }
  
  const shareUrl = `${window.location.origin}${window.location.pathname}?categoryId=${category.id}`
  
  const shareData = {
    title: 'Video Dokumentasi',
    text: `Video - ${category.title}`,
    url: shareUrl
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(`Lihat "${category.title}" di\n${shareUrl}`)
    alert('Link berhasil disalin!')
  }
}

// Handle categoryId from URL - expand and scroll to category
onMounted(() => {
  if (import.meta.client) {
    setTimeout(() => {
      const categoryId = route.query.categoryId as string
      
      if (categoryId) {
        const id = parseInt(categoryId, 10)
        
        // Expand the category
        if (!expandedCategories.value.includes(id)) {
          expandedCategories.value.push(id)
        }
        
        // Scroll to category after a short delay to ensure it's rendered
        setTimeout(() => {
          const categoryElement = document.getElementById(`category-${categoryId}`)
          if (categoryElement) {
            categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }, 100)
  }
})
</script>
