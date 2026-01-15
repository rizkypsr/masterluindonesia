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
</script>

<template>
  <div>
    <!-- Header -->
    <div class="px-4 py-5 shadow-md" style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <div class="flex items-center gap-3">
        <NuxtLink to="/lainnya">
          <Icon name="mdi:arrow-left" class="w-6 h-6 text-black" />
        </NuxtLink>
        <h1 class="text-black">Riwayat Artikel</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 py-6">
      <div v-if="isAuthenticated" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <Icon name="mdi:history" class="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>Belum ada riwayat artikel</p>
      </div>
    </div>
  </div>
</template>
