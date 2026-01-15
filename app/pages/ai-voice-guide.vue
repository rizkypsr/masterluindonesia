<script setup lang="ts">
import { useAuth } from '~/lib/auth'

const { isAuthenticated } = useAuth()
const toast = useToast()

onMounted(() => {
  if (!isAuthenticated.value) {
    toast.add({
      title: 'Anda harus login untuk mengakses halaman ini',
      color: 'error'
    })
    navigateTo('/lainnya')
  }
})

const samsungImages = [
  'https://masterluindonesia.com/assets/assets/images/pengaturan_samsung_1.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_samsung_2.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_samsung_3.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_samsung_4.jpeg',
]

const xiaomiImages = [
  'https://masterluindonesia.com/assets/assets/images/pengaturan_xiaomi_1.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_xiaomi_2.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_xiaomi_3.jpeg',
  'https://masterluindonesia.com/assets/assets/images/pengaturan_xiaomi_4.jpeg',
]

const samsungIndex = ref(0)
const xiaomiIndex = ref(0)

function prevSamsung() {
  if (samsungIndex.value > 0) samsungIndex.value--
}
function nextSamsung() {
  if (samsungIndex.value < samsungImages.length - 1) samsungIndex.value++
}
function prevXiaomi() {
  if (xiaomiIndex.value > 0) xiaomiIndex.value--
}
function nextXiaomi() {
  if (xiaomiIndex.value < xiaomiImages.length - 1) xiaomiIndex.value++
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="px-4 py-4 bg-white dark:bg-gray-900 shadow-md flex items-center gap-3">
      <BackButton />
      <h1 class="text-black dark:text-white">Panduan Text To Speech</h1>
    </div>

    <!-- Content -->
    <div v-if="isAuthenticated" class="px-6 py-6 space-y-8">
      <!-- Samsung Section -->
      <div>
        <h2 class="text-lg font-semibold text-black dark:text-white text-center mb-2">
          Pengaturan Handphone Samsung
        </h2>
        <div class="flex justify-end gap-2 mb-2">
          <button @click="prevSamsung" :disabled="samsungIndex === 0" class="p-1 disabled:opacity-30">
            <Icon name="mdi:arrow-left" class="w-6 h-6 text-gray-400" />
          </button>
          <button @click="nextSamsung" :disabled="samsungIndex === samsungImages.length - 1" class="p-1 disabled:opacity-30">
            <Icon name="mdi:arrow-right" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
        <div class="flex justify-center">
          <img 
            :src="samsungImages[samsungIndex]" 
            alt="Pengaturan Samsung" 
            class="max-h-125 object-contain rounded-lg"
          />
        </div>
      </div>

      <!-- Xiaomi Section -->
      <div>
        <h2 class="text-lg font-semibold text-black dark:text-white text-center mb-2">
          Pengaturan Handphone Xiaomi
        </h2>
        <div class="flex justify-end gap-2 mb-2">
          <button @click="prevXiaomi" :disabled="xiaomiIndex === 0" class="p-1 disabled:opacity-30">
            <Icon name="mdi:arrow-left" class="w-6 h-6 text-gray-400" />
          </button>
          <button @click="nextXiaomi" :disabled="xiaomiIndex === xiaomiImages.length - 1" class="p-1 disabled:opacity-30">
            <Icon name="mdi:arrow-right" class="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
        <div class="flex justify-center">
          <img 
            :src="xiaomiImages[xiaomiIndex]" 
            alt="Pengaturan Xiaomi" 
            class="max-h-125 object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</template>
