<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600">4. Bai Hua Fo Fa</span>
      <TentangMenu type="lima-pusaka" />
    </div>

    <!-- Hero Image -->
    <div class="relative bg-gradient-to-b from-yellow-100 to-yellow-50">
      <img src="https://masterluindonesia.com/assets/assets/images/tentang/image6.png" alt="Membaca Bai Hua Fo Fa"
        class="w-full" />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Membaca</h1>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Bai Hua Fo Fa</h1>

      <p class="text-gray-500 text-sm mb-4">Membaca Bai Hua Fo Fa</p>

      <p class="text-gray-700 text-sm mb-4">
        Bai Hua Fo Fa adalah ajaran Buddhis mendalam yang diuraikan dengan bahasa sehari-hari agar semua makhluk yang 
        berjodoh bisa membina diri di zaman akhir Dharma ini untuk memahami kebenaran akan duniawi ini dan terbebas dari 6 alam reinkarnasi
      </p>

      <p class="text-gray-700 text-sm mb-4">
        Menggabungkan Tripitaka dan 12 Sutra Buddha untuk mendapatkan kebijaksanaan,
      </p>

      <p class="text-gray-700 text-sm mb-4">
        menerapkan Ajaran Dharma ke dalam kehidupan sehari-hari dan memurnikan kembali jiwa dan meningkatkan kebijaksanaan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
</script>
