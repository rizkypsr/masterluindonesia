<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
    <div
      class="h-72 shrink-0"
      :class="gradientClass">
      <img :src="image" :alt="title" class="w-full h-full object-contain" />
    </div>
    <div class="p-4">
      <h3 class="font-bold text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h3>
      <p v-for="(text, idx) in content" :key="idx" class="text-gray-700 dark:text-gray-300 text-sm mb-2">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  image: string
  title: string
  content: string[]
  gradientColor?: 'blue' | 'orange' | 'yellow' | 'green' | 'purple' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  gradientColor: 'blue'
})

const gradientClass = computed(() => {
  const gradients = {
    blue: 'bg-gradient-to-b from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800',
    orange: 'bg-gradient-to-b from-orange-100 to-orange-50 dark:from-gray-700 dark:to-gray-800',
    yellow: 'bg-gradient-to-b from-yellow-100 to-yellow-50 dark:from-gray-700 dark:to-gray-800',
    green: 'bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-700 dark:to-gray-800',
    purple: 'bg-gradient-to-b from-purple-100 to-purple-50 dark:from-gray-700 dark:to-gray-800',
    red: 'bg-gradient-to-b from-red-100 to-red-50 dark:from-gray-700 dark:to-gray-800'
  }
  return gradients[props.gradientColor]
})
</script>
