<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400">4. Bai Hua Fo Fa</span>
      <TentangMenu type="lima-pusaka" />
    </div>

    <!-- Hero Image -->
    <div class="relative bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
      <img src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage6.png?alt=media&token=8c71ab9b-52c7-4785-bcbe-15f714a05c1b" alt="Membaca Bai Hua Fo Fa"
        class="w-full" />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Membaca</h1>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bai Hua Fo Fa</h1>

      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">Membaca Bai Hua Fo Fa</p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Bai Hua Fo Fa adalah ajaran Buddhis mendalam yang diuraikan dengan bahasa sehari-hari agar semua makhluk yang 
        berjodoh bisa membina diri di zaman akhir Dharma ini untuk memahami kebenaran akan duniawi ini dan terbebas dari 6 alam reinkarnasi
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
        Menggabungkan Tripitaka dan 12 Sutra Buddha untuk mendapatkan kebijaksanaan,
      </p>

      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
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
