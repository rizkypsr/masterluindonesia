<template>
  <div>
    <!-- Header -->
    <div class="px-4 pt-6 pb-4 shadow-md"
      style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <h1 class="text-black mb-2 font-semibold">
        Apa yang ingin kamu pelajari?
      </h1>
      <div class="flex items-center bg-white rounded-lg px-4 py-3">
        <Icon name="mdi:magnify" class="w-5 h-5 text-black mr-2" />
        <input type="text" placeholder="Keyword"
          class="flex-1 bg-transparent outline-none text-gray-600 placeholder-gray-400" />
      </div>
    </div>

    <!-- TAB BAR -->
    <div class="bg-white shadow-md">
      <div ref="tabContainer" class="flex overflow-x-auto scrollbar-hide relative">
        <button v-for="(tab, index) in tabs" :key="tab.id" :ref="el => (tabRefs[index] = el as HTMLElement)"
          @click="selectTab(tab.id, index)"
          class="px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors relative shrink-0"
          :class="activeTab === tab.id ? 'text-black' : 'text-gray-400'">
          {{ tab.label }}
          <span v-if="activeTab === tab.id" class="absolute bottom-0 left-4 right-4 h-0.5 bg-black rounded-full" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="py-6">
      <TabsTabTerbaru v-if="activeTab === 'terbaru'" />
      <TabsTabParitta v-else-if="activeTab === 'paritta'" />
      <TabsTabUnduh v-else-if="activeTab === 'unduh'" />
      <TabsTabEdukasi v-else-if="activeTab === 'edukasi'" />
      <TabsTabTentang v-else-if="activeTab === 'tentang'" />
      <TabsTabContact v-else-if="activeTab === 'contact'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue"

const activeTab = ref("terbaru")
const tabContainer = ref<HTMLElement | null>(null)
const tabRefs = ref<HTMLElement[]>([])

const tabs = [
  { id: "terbaru", label: "Terbaru" },
  { id: "paritta", label: "Paritta" },
  { id: "unduh", label: "Unduh" },
  { id: "edukasi", label: "Edukasi" },
  { id: "tentang", label: "Tentang" },
  { id: "contact", label: "Contact" },
]

const TARGET_VISIBLE_INDEX = 1
const GAP_OFFSET = 8

const selectTab = (tabId: string, index: number) => {
  activeTab.value = tabId
  nextTick(() => scrollTabToPreferredPosition(index))
}

const scrollTabToPreferredPosition = (index: number) => {
  const container = tabContainer.value
  const tab = tabRefs.value[index]

  if (!container || !tab) return

  const tabLeft = tab.offsetLeft
  const tabWidth = tab.offsetWidth
  const containerWidth = container.clientWidth
  const maxScrollLeft = container.scrollWidth - containerWidth

  const targetScrollLeft = tabLeft - tabWidth * TARGET_VISIBLE_INDEX - GAP_OFFSET
  const finalScrollLeft = Math.min(Math.max(0, targetScrollLeft), maxScrollLeft)

  container.scrollTo({
    left: finalScrollLeft,
    behavior: "smooth",
  })
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
