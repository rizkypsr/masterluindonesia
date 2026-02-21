<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UToaster />
</template>

<script setup>
// Optimize font loading with display=swap for better performance
useHead({
  link: [
    {
      rel: 'preload',
      as: 'style',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    }
  ],
  style: [
    {
      children: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`,
      type: 'text/css'
    }
  ]
})
</script>

<style>
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
