<template>
  <div class="h-screen bg-white flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 shrink-0">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 cursor-pointer">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
        </button>
        <h1 class="text-lg font-semibold text-black">Detail Buku</h1>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-1">
          <Icon name="mdi:star-outline" class="w-6 h-6 text-black" />
        </button>
        <button class="p-1" @click="shareBook">
          <Icon name="mdi:share-variant" class="w-6 h-6 text-black" />
        </button>
      </div>
    </div>

    <!-- Book Info -->
    <div class="px-4 py-6 flex items-center gap-4 shrink-0">
      <ClientOnly>
        <NuxtImg :src="bookCover" :alt="bookTitle" class="w-24 h-32 object-cover rounded-xl shrink-0" loading="lazy"
          placeholder="/fallback.svg" fallback="/fallback.svg" />
        <template #fallback>
          <div class="w-24 h-32 bg-gray-200 rounded-xl animate-pulse shrink-0"></div>
        </template>
      </ClientOnly>
      <h2 class="text-xl font-semibold text-black">{{ bookTitle }}</h2>
    </div>

    <!-- Content -->
    <div class="px-4 flex-1 flex flex-col overflow-hidden">
      <!-- Empty State -->
      <div v-if="chapters.length === 0" class="flex flex-col items-center justify-center flex-1">
        <div class="w-32 h-32 rounded-full border-2 border-gray-200 flex items-center justify-center mb-4 relative">
          <Icon name="mdi:package-variant" class="w-16 h-16 text-gray-300" />
          <div class="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Icon name="mdi:cancel" class="w-6 h-6 text-gray-300" />
          </div>
        </div>
        <p class="text-gray-500 font-medium">Data tidak tersedia</p>
      </div>

      <!-- Chapters List -->
      <div v-else class="flex flex-col overflow-hidden flex-1">
        <h3 class="text-lg font-semibold text-black mb-4 shrink-0">Daftar Isi</h3>
        
        <div class="overflow-y-auto flex-1 custom-scrollbar pb-4">
          <div v-for="chapter in chapters" :key="chapter.id" class="mb-4">
            <!-- Chapter Title -->
            <h4 class="text-base font-semibold text-black py-2">{{ chapter.title }}</h4>
            
            <!-- Sub Chapters -->
            <div v-if="chapter.sub_chapters && chapter.sub_chapters.length > 0">
              <NuxtLink
                v-for="sub in chapter.sub_chapters"
                :key="sub.id"
                :to="`/book/${bookId}/${sub.id}`"
                class="block py-3 pl-4 cursor-pointer hover:bg-gray-50"
              >
                <span class="text-sm text-black">{{ sub.title }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

interface SubChapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub: any[]
}

interface Chapter {
  id: number
  book_id: number
  title: string
  description: string | null
  seq: number
  have_child: number
  sub_chapters: SubChapter[]
}

const bookId = computed(() => route.params.id as string)
const bookTitle = computed(() => (route.query.title as string) || 'Buku')
const bookCover = computed(() => (route.query.cover as string) || '/fallback.svg')

const { data: chaptersData } = await useFetch<{ success: boolean; data: Chapter[] }>(
  () => `https://api.masterluindonesia.com/api/books/${bookId.value}`
)

const chapters = computed(() => {
  if (chaptersData.value?.data) {
    return chaptersData.value.data.sort((a, b) => a.seq - b.seq)
  }
  return []
})

const shareBook = async () => {
  const shareData = {
    title: bookTitle.value,
    text: `Baca buku "${bookTitle.value}" di Master Lu Indonesia`,
    url: window.location.href
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
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
