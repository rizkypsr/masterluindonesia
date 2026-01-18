<template>
  <div>
    <button @click="isOpen = true" class="p-1">
      <Icon name="heroicons:bars-3" class="w-5 h-5 text-gray-700" />
    </button>

    <!-- Slideover Menu -->
    <USlideover v-model:open="isOpen" side="bottom">
      <template #content>
        <div class="p-4">
          <!-- Handle bar -->
          <div class="flex justify-center mb-4">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <h3 class="text-lg font-bold text-gray-900 mb-4">DAFTAR MENU</h3>

          <div class="space-y-4">
            <NuxtLink 
              v-for="item in menuItems" 
              :key="item.href" 
              :to="item.href"
              @click="isOpen = false"
              class="block text-gray-900 text-base py-2 hover:text-yellow-600"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: 'lima-pusaka' | 'tentang-main'
}>()

const isOpen = ref(false)

const limaPusakaItems = [
  { title: 'Membaca paritta', href: '/tentang/lima-pusaka/membaca-paritta' },
  { title: 'Berikrar', href: '/tentang/lima-pusaka/berikrar' },
  { title: 'Melepaskan makhluk hidup', href: '/tentang/lima-pusaka/melepaskan-makhluk-hidup' },
  { title: 'Membaca Bai Hua Fo Fa', href: '/tentang/lima-pusaka/membaca-bai-hua-fo-fa' },
  { title: 'Pertobatan Agung', href: '/tentang/lima-pusaka/pertobatan-agung' },
]

const tentangMainItems = [
  { title: 'Xin Ling Fa Men', href: '/tentang/xin-ling-fa-men' },
  { title: 'Master Lu Jun Hong', href: '/tentang/master-lu-jun-hong' },
]

const menuItems = computed(() => {
  return props.type === 'lima-pusaka' ? limaPusakaItems : tentangMainItems
})
</script>
