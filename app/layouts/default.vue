<template>
  <div class="min-h-screen bg-gray-100 font-inter">
    <div class="mx-auto max-w-md min-h-screen bg-white" :class="{ 'pb-20': showBottomNav }">
      <slot />
    </div>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const mainPages = ['/', '/audio', '/search', '/video', '/lainnya']

const showBottomNav = computed(() => {
  return mainPages.includes(route.path)
})
</script>
