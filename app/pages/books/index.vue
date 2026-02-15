<template>
  <div class="h-screen bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="shrink-0 px-4 pt-4 pb-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <div class="flex items-center gap-4 mb-3">
        <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
        </button>
        <h1 class="text-lg font-semibold text-black dark:text-white">Mau baca buku apa hari ini?</h1>
      </div>
      <div class="flex items-center bg-white dark:bg-gray-700 rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400 mr-2" />
        <input v-model="searchQuery" type="text" placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Banner Image -->
      <div class="w-full">
        <NuxtImg 
          src="https://masterluindonesia.com/assets/assets/images/buku_page_banner.png"
          alt="Banner" 
          class="w-full h-48 object-cover" 
          format="webp"
          loading="eager"
          fetchpriority="high"
          width="768"
          height="192"
        />
      </div>

      <!-- Description -->
      <div class="px-4 py-4">
        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
          Membaca buku dapat membuka kebijaksanaan, meningkatkan tingkat kesadaran, memperbaiki segala perilaku dan
          kebiasaan buruk, mengubah nasib dan mendapatkan banyak manfaat lainnya.
        </p>
      </div>

      <!-- Categories -->
      <div class="px-4 pb-6">
        <div v-for="category in filteredCategories" :key="category.id" class="mb-6">
          <h2 class="text-lg font-semibold text-black dark:text-white mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">{{ category.title }}</h2>
          <div class="grid grid-cols-3 gap-3">
            <NuxtLink v-for="book in category.book" :key="book.id"
              :to="{ path: `/books/${book.id}`, query: { title: book.title, cover: book.url } }" class="block">
              <template v-if="book.url">
                <NuxtImg :src="getImageUrl(book.url)" :alt="book.title" class="w-full aspect-3/4 object-cover rounded-xl"
                  loading="lazy" format="webp" width="200" height="267" />
              </template>
              <template v-else>
                <div class="w-full aspect-3/4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center p-4">
                  <p class="text-center font-medium text-black dark:text-white text-sm line-clamp-6">{{ book.title }}</p>
                </div>
              </template>
              <p class="mt-2 font-medium text-black dark:text-white line-clamp-3">{{ book.title }}</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredCategories.length === 0" class="flex flex-col items-center justify-center py-16">
          <div class="w-32 h-32 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 relative">
            <Icon name="mdi:book-open-variant" class="w-16 h-16 text-gray-300 dark:text-gray-600" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Buku tidak ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const searchQuery = ref('')

interface Book {
  id: number
  book_category_id: number
  url: string | null
  url_pdf: string | null
  synopsis: string | null
  title: string
  seq: number
  date: string | null
}

interface BookCategory {
  id: number
  title: string
  book: Book[]
}

const { data: booksData } = await useFetch<{ success: boolean; data: BookCategory[] }>(
  `${config.public.apiBaseUrl}/books`
)

const categories = computed(() => {
  return booksData.value?.data || []
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value
  }

  const query = searchQuery.value.toLowerCase()
  return categories.value
    .map(category => ({
      ...category,
      book: category.book.filter(book =>
        book.title.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.book.length > 0)
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
</style>
