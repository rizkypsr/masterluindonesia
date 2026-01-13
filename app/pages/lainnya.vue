<template>
  <div>
    <!-- Header -->
    <div class="px-4 py-5 shadow-md" style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <h1 class="text-black">Pengaturan</h1>
    </div>

    <!-- Content -->
    <div class="px-6 py-6">
      <!-- Section Title -->
      <h2 class="text-black mb-2">Pengaturan Aplikasi</h2>
      <hr class="mb-3">

      <!-- Menu Items -->
      <div class="space-y-1">
        <!-- Mode Tema -->
        <div class="flex items-center justify-between py-2">
          <span class="font-medium text-black">Mode Tema</span>
          <button class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full">
            <span class="text-sm text-gray-700">Light</span>
            <Icon name="mdi:white-balance-sunny" class="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <!-- Riwayat Artikel -->
        <NuxtLink to="/article-history" class="flex items-center justify-between py-1">
          <span class="font-medium text-black">Riwayat Artikel</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black" />
        </NuxtLink>

        <!-- Bookmark -->
        <NuxtLink to="/bookmark" class="flex items-center justify-between py-1">
          <span class="font-medium text-black">Bookmark</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black" />
        </NuxtLink>

        <!-- Panduan Suara AI -->
        <NuxtLink to="/ai-voice-guide" class="flex items-center justify-between py-1">
          <span class="font-medium text-black">Panduan Suara AI</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black" />
        </NuxtLink>

        <!-- Hubungi Kami -->
        <NuxtLink to="/contact" class="flex items-center justify-between py-1">
          <span class="font-medium text-black">Hubungi Kami</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black" />
        </NuxtLink>

        <!-- Masuk / Daftar Aplikasi -->
        <NuxtLink to="/auth" class="flex items-center justify-between py-1">
          <span class="font-medium text-black">Masuk / Daftar Aplikasi</span>
          <Icon name="mdi:login" class="w-6 h-6 text-black" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
