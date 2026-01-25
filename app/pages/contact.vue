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

const { data: contacts, status } = await useFetch<ApiResponse>(
  'https://api.masterluindonesia.com/api/contact/wa',
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
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center gap-4 px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button @click="$router.back()" class="p-1 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
        <Icon name="mdi:arrow-left" class="w-6 h-6 text-black dark:text-white" />
      </button>
      <h1 class="text-lg font-semibold text-black dark:text-white">Hubungi Kami</h1>
    </div>

    <!-- Content -->
    <div class="px-6 py-6">
      <!-- Loading State -->
      <div v-if="status === 'pending'" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
      </div>

      <!-- Error State -->
      <div v-else-if="status === 'error'" class="text-center py-8">
        <p class="text-red-500 dark:text-red-400">Gagal memuat data kontak</p>
      </div>

      <!-- Contact List -->
      <div v-else class="space-y-0">
        <div v-for="contact in contacts" :key="contact.id"
          class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 rounded"
          @click="openWhatsApp(contact.no_wa)">
          <span class="font-medium text-black dark:text-white">{{ contact.nama }}</span>
          <Icon name="mdi:whatsapp" class="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
  </div>
</template>
