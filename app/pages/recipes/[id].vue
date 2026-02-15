<template>
    <div class="h-screen bg-white flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
            <div class="flex items-center gap-4">
                <button @click="$router.back()"
                    class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
                    <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
                </button>
                <h1 class="text-lg font-semibold text-black line-clamp-1">{{ recipe?.title || 'Resep' }}</h1>
            </div>
            <div class="flex items-center gap-3">
                <button class="p-1" @click="shareRecipe">
                    <Icon name="mdi:share-variant" class="w-6 h-6 text-black" />
                </button>
            </div>
        </div>

        <!-- YouTube Embed -->
        <div v-if="youtubeId" class="w-full aspect-video bg-black shrink-0">
            <iframe :src="`https://www.youtube.com/embed/${youtubeId}`" class="w-full h-full" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
        </div>
        <!-- Fallback Image if no YouTube -->
        <div v-else-if="recipe?.image?.length" class="w-full aspect-video shrink-0">
            <NuxtImg :src="recipe.image[0]" :alt="recipe.title" class="w-full h-full object-cover" loading="lazy"
              format="webp" width="768" height="432" />
        </div>

        <!-- Recipe Info (Scrollable) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-4 py-4">
            <!-- Title & Like -->
            <div class="flex items-start justify-between gap-4">
                <h2 class="text-xl font-semibold text-black">{{ recipe?.title }}</h2>
                <div class="flex items-center gap-1 shrink-0">
                    <Icon name="mdi:heart-outline" class="w-5 h-5 text-gray-400" />
                    <span class="text-sm text-gray-500">{{ recipe?.count_like || 0 }}</span>
                </div>
            </div>

            <!-- Time & People -->
            <div class="flex items-center gap-4 mt-3">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Icon name="mdi:clock-outline" class="w-5 h-5 text-orange-400" />
                    </div>
                    <span class="text-sm text-gray-600">{{ recipe?.time_cook }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                        <Icon name="mdi:account-group-outline" class="w-5 h-5 text-cyan-400" />
                    </div>
                    <span class="text-sm text-gray-600">{{ recipe?.for_people }}</span>
                </div>
            </div>

            <!-- Ingredients -->
            <div class="mt-6">
                <h3 class="text-sm font-bold text-black uppercase tracking-wide mb-3">Bahan - Bahan</h3>
                <div class="text-sm text-black whitespace-pre-line leading-relaxed">{{ recipe?.ingredients }}</div>
            </div>

            <!-- How to Cook -->
            <div class="mt-6 pb-6">
                <h3 class="text-sm font-bold text-black uppercase tracking-wide mb-3">Cara Memasak</h3>
                <div class="text-sm text-black whitespace-pre-line leading-relaxed">{{ recipe?.how_to_cook }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

interface RecipeDetail {
    title: string
    time_cook: string
    for_people: string
    ingredients: string
    how_to_cook: string
    count_like: number
    link_youtube: string
    image: string[]
}

const recipeId = computed(() => route.params.id as string)

const { data: recipeData } = await useFetch<{ success: boolean; data: RecipeDetail }>(
    () => `${config.public.apiBaseUrl}/recipe/detail/${recipeId.value}`
)

const recipe = computed(() => recipeData.value?.data)

const youtubeId = computed(() => {
    if (!recipe.value?.link_youtube) return null
    const url = recipe.value.link_youtube
    // Handle youtu.be format
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
    if (shortMatch) return shortMatch[1]
    // Handle youtube.com format
    const longMatch = url.match(/[?&]v=([^?&]+)/)
    if (longMatch) return longMatch[1]
    return null
})

const shareRecipe = async () => {
    const shareData = {
        title: recipe.value?.title || 'Resep',
        text: `Lihat resep "${recipe.value?.title}" di Master Lu Indonesia`,
        url: window.location.href
    }

    if (navigator.share) {
        try {
            await navigator.share(shareData)
        } catch (err) {
            // User cancelled or error
        }
    } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link berhasil disalin!')
    }
}
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
