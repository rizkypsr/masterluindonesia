<template>
  <div class="pb-6 px-4">
    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-500 dark:text-red-400">Gagal memuat data</p>
      <UButton @click="() => refresh()" class="mt-4" variant="outline">Coba Lagi</UButton>
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <div v-for="category in categories" :key="category.id">
        <!-- Main Category Title -->
        <h2 class="text-xl font-bold text-black dark:text-white mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
          {{ category.title }}
        </h2>

        <!-- Subcategories -->
        <div class="space-y-6">
          <div v-for="sub in category.sub" :key="sub.id">
            <!-- Subcategory Title -->
            <h3 class="text-lg font-semibold text-black dark:text-white italic mb-3">
              {{ sub.title }}
            </h3>

            <!-- Download Items Grid -->
            <div class="grid grid-cols-3 gap-3 mb-6">
              <div
                v-for="item in sub.unduh"
                :key="item.id"
                class="cursor-pointer"
                @click="handleDownload(item)"
              >
                <!-- Cover Image -->
                <div class="relative">
                  <NuxtImg
                    :src="item.cover"
                    :alt="item.title"
                    class="w-full aspect-3/4 object-cover rounded-lg shadow-md"
                    loading="lazy"
                    format="webp"
                    quality="60"
                    width="200"
                    height="267"
                  />
                  <!-- PDF Badge -->
                  <div
                    v-if="item.is_pdf"
                    class="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded"
                  >
                    PDF
                  </div>
                  <!-- External Link Badge -->
                  <div
                    v-if="item.link_url && !item.url"
                    class="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded"
                  >
                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3" />
                  </div>
                </div>
                <!-- Item Title -->
                <p class="mt-2 text-lg text-center text-black dark:text-white line-clamp-2">
                  {{ item.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

interface UnduhItem {
  id: number
  unduh_category_id: number
  title: string
  is_pdf: number
  cover: string
  url: string | null
  link_url: string | null
  seq: number
}

interface SubCategory {
  id: number
  title: string
  unduh: UnduhItem[]
}

interface Category {
  id: number
  title: string
  sub: SubCategory[]
}

interface ApiResponse {
  success: boolean
  message: string
  data: Category[]
}

const { data, pending, error, refresh } = await useFetch<ApiResponse>(
  `${config.public.apiBaseUrl}/unduh`
)

const categories = computed(() => data.value?.data || [])

const handleDownload = (item: UnduhItem) => {
  // If has link_url, open external link
  if (item.link_url) {
    window.open(item.link_url, '_blank')
    return
  }

  // If has url, download or open
  if (item.url) {
    if (item.is_pdf) {
      // Open PDF in new tab
      window.open(item.url, '_blank')
    } else {
      // Open image in new tab
      window.open(item.url, '_blank')
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
