<script setup lang="ts">
interface Contact {
  id: number
  nama: string
  no_wa: string
  status: number
}

interface ApiResponse {
  success: boolean
  message: string
  data: Contact[]
}

const config = useRuntimeConfig()

const { data: contacts, status } = await useFetch<ApiResponse>(
  `${config.public.apiBaseUrl}/contact/wa`,
  {
    transform: (response) => response.data.filter(c => c.status === 1)
  }
)

function openWhatsApp(phoneNumber: string) {
  const url = `https://wa.me/${phoneNumber}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="mt-6 px-4 pb-6">
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-black dark:text-white">Hubungi Kami</h2>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="flex justify-center py-8">
      <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-primary dark:text-yellow-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="text-center py-8">
      <p class="text-red-500 dark:text-red-400">Gagal memuat data kontak</p>
    </div>

    <!-- Contact List - Horizontal Scroll -->
    <div v-else class="flex gap-4 overflow-x-auto custom-scrollbar pb-3">
      <button
        v-for="contact in contacts"
        :key="contact.id"
        @click="openWhatsApp(contact.no_wa)"
        class="flex flex-col items-center gap-2 shrink-0 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow min-w-[120px]"
      >
        <Icon name="mdi:whatsapp" class="w-12 h-12 text-green-600 dark:text-green-400" />
        <span class="text-sm font-medium text-black dark:text-white text-center">{{ contact.nama }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
}
</style>
