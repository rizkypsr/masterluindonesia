<script setup lang="ts">
import parittaData from '~/assets/json/paritta.json'

interface Paritta {
  title: string
  href: string
  englishTitle: string
  chineseTitle: string
  pinyinTitle: string
  pinyinTitleAlt: string
  audioFile: string | null
  dharani: {
    chinese: string
    pinyin: string
    pinyinAlt: string
  }
}

const parittas = parittaData as Paritta[]
const scrollContainer = ref<HTMLElement | null>(null)
const { saveScrollPosition, getScrollPosition } = useScrollState()
const wasAtBottom = useState<boolean>('tab-paritta-at-bottom', () => false)

// Restore scroll position on mount
onMounted(() => {
  const savedPosition = getScrollPosition('tab-paritta')
  if (savedPosition > 0 || wasAtBottom.value) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (scrollContainer.value) {
          const maxScroll = scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight
          // If was at bottom, scroll to bottom; otherwise use saved position
          scrollContainer.value.scrollTop = wasAtBottom.value ? maxScroll : Math.min(savedPosition, maxScroll)
        }
      })
    })
  }
})

// Save scroll position before unmount
onBeforeUnmount(() => {
  if (scrollContainer.value) {
    const maxScroll = scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight
    const currentScroll = scrollContainer.value.scrollTop
    // Check if at bottom (within 5px tolerance)
    wasAtBottom.value = maxScroll - currentScroll < 5
    saveScrollPosition('tab-paritta', currentScroll)
  }
})
</script>

<template>
  <div ref="scrollContainer" class="h-full overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
    <NuxtLink v-for="paritta in parittas" :key="paritta.href" :to="paritta.href"
      class="flex items-center justify-between px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-800">
      <span class="font-bold text-black dark:text-white text-xl">{{ paritta.title }}</span>
      <Icon name="mdi:chevron-right" class="w-6 h-6 text-gray-400" />
    </NuxtLink>
  </div>
</template>
