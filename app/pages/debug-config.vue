<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Runtime Config Debug</h1>
    <div class="space-y-2">
      <p><strong>API Base URL:</strong> {{ config.public.apiBaseUrl }}</p>
      <p><strong>Is Server:</strong> {{ isServer }}</p>
      <p><strong>Is Client:</strong> {{ !isServer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const isServer = import.meta.server

console.log('Runtime Config:', config.public)
</script>
