<template>
  <div class="h-dvh bg-gray-100 font-inter overflow-hidden">
    <div class="mx-auto max-w-md h-full bg-white flex flex-col overflow-hidden">
      <div class="flex-1 overflow-hidden" :class="{ 'pb-safe-bottom-nav': showBottomNav }">
        <slot />
      </div>
      <!-- Rendered eagerly: this is an SPA build, and a deferred/visibility-gated
           BottomNav can fail to ever hydrate on a direct page load. -->
      <BottomNav v-if="showBottomNav" class="shrink-0" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const mainPages = ['/', '/audio', '/search', '/video', '/lainnya']

const showBottomNav = computed(() => {
  return mainPages.includes(route.path)
})
</script>

<style scoped>
.pb-safe-bottom-nav {
  padding-bottom: calc(4rem + env(safe-area-inset-bottom));
}
</style>
