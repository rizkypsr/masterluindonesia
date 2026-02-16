<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <BackButton to="/?tab=tentang" />
      <span class="text-sm text-gray-600 dark:text-gray-400">1. Membaca Paritta</span>
      <TentangMenu type="lima-pusaka" />
    </div>

    <!-- Hero Image -->
    <div class="relative bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
      <img 
        src="https://firebasestorage.googleapis.com/v0/b/master-lu-indonesia.appspot.com/o/images%2Ftentang%2Fimage3.png?alt=media&token=98afcfd4-3ed7-474d-8deb-2bd750862666" 
        alt="Membaca Paritta" 
        class="w-full"
      />
    </div>

    <!-- Content -->
    <div class="px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Membaca Paritta</h1>

      <!-- Section 1 -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Apa itu membaca paritta?</h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Membaca paritta adalah untuk meningkatkan tingkat kesadaran spiritual, mengembangkan sifat dasar dan pembinaan diri. Membaca paritta bisa menghubungkan aura kita dengan Pu Sa, menggunakan kebijaksanaan Pu Sa untuk menjalani hidup di alam manusia.
        </p>
      </div>

      <!-- Section 2 -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Mengapa perlu membaca paritta?</h2>
        
        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">1. Membaca paritta tidak membutuhkan uang sepeserpun</h3>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Asalkan bisa rutin meluangkan sedikit waktu untuk membaca paritta, maka bisa meningkatkan kualitas kehidupanmu saat ini juga masa depan!
        </p>
        <ul class="text-gray-700 dark:text-gray-300 text-sm mb-4 space-y-1 list-disc list-inside">
          <li>Demi keharmonisan keluarga</li>
          <li>Demi keharmonisan suami istri</li>
          <li>Demi masa depan dan kesehatan anak</li>
          <li>Demi karir yang cerah</li>
          <li>Demi kesehatan orang tua</li>
          <li>Demi dijauhkan dari segala penyakit</li>
          <li>Mulailah membaca paritta mulai dari sekarang!</li>
        </ul>

        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">2. Membaca paritta bisa melindungi kita</h3>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Paritta adalah bahasa Bodhisattva. Membaca paritta bisa mendapatkan berkat dari Buddha Bodhisattva.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Selain bisa mengikis karma buruk, membaca paritta juga bisa menambah kumpulan pahala.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Bodhisattva bisa memberikan sinar perlindungan bagi si pembaca paritta.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">
          Membaca paritta bisa mengundang sinar Buddha memberikan Aura baik yang senantiasa mengelilingi dan melincungi kita.
        </p>

        <h3 class="font-semibold text-gray-900 dark:text-white mb-2">3. Dijauhkan Dari Segala Permasalahan</h3>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Alam manusia memang adalah alam yang penuh masalah.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Rutin membaca paritta (Terutama Da Bei Zhou dan Xin Jing setiap hari), bisa menumbuhkan kebijaksanaan, keharmonisan, mengembangkan welas asih, toleransi, kekuatan, menguraikan permasalahan dan mengetahui permohonan.
        </p>
      </div>

      <!-- Section 3 -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Bagaimana cara membaca paritta?</h2>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Membaca paritta bisa dilakukan kapan saja dan di mana saja. Yang terpenting adalah niat yang tulus dan fokus saat membaca.
        </p>
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Disarankan untuk membaca paritta di tempat yang tenang dan bersih. Sebelum membaca, bersihkan pikiran dan hati terlebih dahulu.
        </p>
      </div>

      <!-- Section 4 -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Manfaat membaca paritta</h2>
        <ul class="text-gray-700 dark:text-gray-300 text-sm space-y-2 list-disc list-inside">
          <li>Meningkatkan kesadaran spiritual</li>
          <li>Mengembangkan kebijaksanaan</li>
          <li>Menumbuhkan welas asih</li>
          <li>Melindungi dari hal-hal negatif</li>
          <li>Membawa ketenangan pikiran</li>
          <li>Membantu menyelesaikan masalah kehidupan</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})
</script>
