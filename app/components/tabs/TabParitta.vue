<script setup lang="ts">
import parittaData from '~/assets/json/paritta.json'

interface Paritta {
  title: string
  href: string
  englishTitle: string
  chineseTitle: string
  pinyinTitle: string
  pinyinTitleAlt: string
  audioFile: string
  dharani: {
    chinese: string
    pinyin: string
    pinyinAlt: string
  }
}

const parittas = parittaData as Paritta[]
</script>

<template>
  <div class="h-[calc(100vh-200px)] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
    <NuxtLink v-for="paritta in parittas" :key="paritta.href" :to="paritta.href"
      class="flex items-center justify-between px-4 py-5 hover:bg-gray-50 dark:hover:bg-gray-800">
      <span class="font-bold text-black dark:text-white text-xl">{{ paritta.title }}</span>
      <Icon name="mdi:chevron-right" class="w-6 h-6 text-gray-400" />
    </NuxtLink>
  </div>
</template>
