<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
        </button>
        <h1 class="text-lg font-semibold text-black">Resep</h1>
      </div>
      <button class="p-1">
        <Icon name="mdi:magnify" class="w-6 h-6 text-black" />
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      <!-- Popular Recipes Section -->
      <div class="px-4 py-4">
        <h2 class="text-xl font-semibold text-black mb-4">Resep Populer</h2>

        <div class="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
          <NuxtLink v-for="recipe in popularRecipes" :key="recipe.id" :to="`/recipes/${recipe.id}`"
            class="shrink-0 w-64">
            <NuxtImg :src="getImageUrl(recipe.cover) || '/fallback.svg'" :alt="recipe.title"
              class="w-full h-40 object-cover rounded-xl" loading="lazy" format="webp" width="256" height="160" />
            <h3 class="mt-2 text-base font-semibold text-black line-clamp-1">{{ recipe.title }}</h3>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                  <Icon name="mdi:clock-outline" class="w-4 h-4 text-orange-400" />
                </div>
                <span class="text-xs text-gray-600">{{ recipe.time_cook }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Icon name="mdi:account-group-outline" class="w-4 h-4 text-cyan-400" />
                </div>
                <span class="text-xs text-gray-600">{{ recipe.for_people || '-' }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Categories Section -->
      <div class="px-4 pb-6">
        <h2 class="text-xl font-semibold text-black mb-4">Kategori Masakan</h2>
        <div class="grid grid-cols-3 gap-3">
          <NuxtLink v-for="category in categories" :key="category.id" :to="`/recipes/category/${category.id}`"
            class="block relative overflow-hidden rounded-xl aspect-square">
            <NuxtImg :src="category.image || '/fallback.svg'" :alt="category.title" class="w-full h-full object-cover"
              loading="lazy" format="webp" width="200" height="200" />
            <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2">
              <p class="text-white text-sm font-medium leading-tight">{{ category.title }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Search by Ingredient Section -->
      <div class="px-4 pb-6">
        <h2 class="text-xl font-semibold text-black mb-4">Cari Resep dari Bahannya</h2>
        
        <!-- Ingredient Chips -->
        <div class="flex gap-2 overflow-x-auto custom-scrollbar pb-3">
          <button
            v-for="ingredient in ingredients"
            :key="ingredient.id"
            @click="selectIngredient(ingredient.id)"
            class="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="selectedIngredientId === ingredient.id 
              ? 'bg-primary text-black' 
              : 'bg-gray-200 text-gray-700'"
          >
            {{ ingredient.name }}
          </button>
        </div>

        <!-- Recipes by Ingredient -->
        <div v-if="recipesByIngredient.length > 0" class="grid grid-cols-2 gap-4 mt-4">
          <NuxtLink
            v-for="recipe in recipesByIngredient"
            :key="recipe.id"
            :to="`/recipes/${recipe.id}`"
            class="block"
          >
            <NuxtImg
              :src="getImageUrl(recipe.cover) || '/fallback.svg'"
              :alt="recipe.title"
              class="w-full h-36 object-cover rounded-xl"
              loading="lazy"
              format="webp"
              width="300"
              height="144"
            />
            <h3 class="mt-2 text-sm font-semibold text-black line-clamp-2">{{ recipe.title }}</h3>
            <div class="flex items-center gap-2 mt-2">
              <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <Icon name="mdi:clock-outline" class="w-3 h-3 text-orange-400" />
              </div>
              <span class="text-xs text-gray-600">{{ recipe.time_cook }}</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                <Icon name="mdi:account-group-outline" class="w-3 h-3 text-cyan-400" />
              </div>
              <span class="text-xs text-gray-600">{{ recipe.for_people || '-' }}</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-else-if="isLoadingRecipes" class="grid grid-cols-2 gap-4 mt-4">
          <div v-for="i in 2" :key="i" class="animate-pulse">
            <div class="w-full h-36 bg-gray-200 rounded-xl"></div>
            <div class="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="selectedIngredientId && recipesByIngredient.length === 0" class="flex flex-col items-center justify-center py-12">
          <div class="w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 relative">
            <Icon name="mdi:food-off" class="w-12 h-12 text-gray-300" />
          </div>
          <p class="text-gray-500 font-medium text-center">Tidak ada resep dengan bahan ini</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

interface Recipe {
  id: number
  parent_id: number | null
  recipe_category_id: number
  title: string
  link_youtube: string | null
  time_cook: string
  for_people: string
  ingredients: string
  how_to_cook: string
  seq: number
  count_click: number
  have_child: number
  cover: string | null
}

interface Category {
  id: number
  code: string | null
  title: string
  parent_id: number | null
  order: number
  type: string
  languange: string | null
  image: string
  sub_category: any[]
}

interface Ingredient {
  id: number
  name: string
}

const selectedIngredientId = ref<number | null>(null)
const isLoadingRecipes = ref(false)

const { data: popularData } = await useFetch<{ success: boolean; data: Recipe[] }>(
  `${config.public.apiBaseUrl}/recipe/popular`
)

const { data: categoriesData } = await useFetch<{ success: boolean; data: Category[] }>(
  `${config.public.apiBaseUrl}/category?type=recipe`
)

const { data: ingredientsData } = await useFetch<{ success: boolean; data: Ingredient[] }>(
  `${config.public.apiBaseUrl}/ingredient`
)

const { data: recipesByIngredientData, refresh: refreshRecipesByIngredient } = await useFetch<{ success: boolean; data: Recipe[] }>(
  () => selectedIngredientId.value 
    ? `${config.public.apiBaseUrl}/recipe?ingredientId=${selectedIngredientId.value}`
    : '',
  { immediate: false }
)

const popularRecipes = computed(() => {
  return popularData.value?.data || []
})

const categories = computed(() => {
  if (categoriesData.value?.data) {
    return categoriesData.value.data.sort((a, b) => a.order - b.order)
  }
  return []
})

const ingredients = computed(() => {
  return ingredientsData.value?.data || []
})

const recipesByIngredient = computed(() => {
  return recipesByIngredientData.value?.data || []
})

const selectIngredient = async (id: number) => {
  if (selectedIngredientId.value === id) return
  
  selectedIngredientId.value = id
  isLoadingRecipes.value = true
  await refreshRecipesByIngredient()
  isLoadingRecipes.value = false
}

// Auto-select first ingredient on mount
onMounted(() => {
  const firstIngredient = ingredients.value[0]
  if (firstIngredient && !selectedIngredientId.value) {
    selectIngredient(firstIngredient.id)
  }
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
