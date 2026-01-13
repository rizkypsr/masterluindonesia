<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200">
      <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
      </button>
      <h1 class="text-lg font-semibold text-black">{{ topicTitle }}</h1>
    </div>

    <!-- Content -->
    <div class="px-4 py-4">
      <!-- Empty State -->
      <div v-if="categories.length === 0" class="flex flex-col items-center justify-center py-32">
        <div class="w-32 h-32 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 relative">
          <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300" />
          <div class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Icon name="mdi:cancel" class="w-6 h-6 text-gray-300" />
          </div>
        </div>
        <p class="text-gray-500 font-medium">Data tidak tersedia</p>
      </div>

      <!-- Categories List -->
      <div v-else>
        <div v-for="category in categories" :key="category.id" class="mb-2">
          <!-- Category Title -->
          <h2 class="text-base font-semibold text-black py-3">{{ category.title }}</h2>
          
          <!-- Sub Categories -->
          <div v-if="category.sub_category && category.sub_category.length > 0" class="divide-y divide-gray-200">
            <div
              v-for="sub in category.sub_category"
              :key="sub.id"
              class="py-3 cursor-pointer hover:bg-gray-50"
            >
              <span class="text-sm text-black">{{ sub.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

interface SubCategory {
  id: number
  parent_id: number
  topics_id: number
  title: string
}

interface TopicCategory {
  id: number
  topics_id: number
  title: string
  have_child: number
  sub_category: SubCategory[]
}

const topicId = computed(() => route.params.id as string)
const topicTitle = computed(() => (route.query.title as string) || 'Topic')

const { data: categoriesData } = await useFetch<{ success: boolean; data: TopicCategory[] }>(
  () => `https://api.masterluindonesia.com/api/topics/category/${topicId.value}`
)

const categories = computed(() => {
  return categoriesData.value?.data || []
})
</script>
