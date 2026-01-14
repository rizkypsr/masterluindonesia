<script setup lang="ts">
import { useAuth } from '~/lib/auth';

const colorMode = useColorMode()
const config = useRuntimeConfig()
const { $googleSignIn } = useNuxtApp()
const { loginWithGoogle, isAuthenticated, logout } = useAuth()

const isLoading = ref(false)
const error = ref<string | null>(null)

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(value: boolean) {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
}

// Initialize Google Sign-In on mount
onMounted(async () => {
  try {
    await $googleSignIn.load()
    
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: handleCredentialResponse,
      })
    }
  } catch (e) {
    console.error('Failed to load Google Sign-In', e)
  }
})

async function handleCredentialResponse(response: { credential: string }) {
  isLoading.value = true
  error.value = null
  
  try {
    await loginWithGoogle(response.credential)
    // Success - user is now logged in
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

function openGoogleLogin() {
  if (window.google) {
    window.google.accounts.id.prompt()
  }
}

function handleLogout() {
  logout()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="px-4 py-5 shadow-md" style="background: linear-gradient(to right, #ffca03 0%, #fde249 50%, #d8ae0c 100%);">
      <h1 class="text-black">Pengaturan</h1>
    </div>

    <!-- Content -->
    <div class="px-6 py-6">
      <!-- Section Title -->
      <h2 class="text-black dark:text-white mb-2">Pengaturan Aplikasi</h2>
      <hr class="mb-3">

      <!-- Menu Items -->
      <div class="space-y-1">
        <!-- Mode Tema -->
        <div class="flex items-center justify-between py-2">
          <span class="font-medium text-black dark:text-white">Mode Tema</span>
          <button 
            @click="toggleTheme"
            class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full"
          >
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ isDark ? 'Dark' : 'Light' }}</span>
            <Icon 
              :name="isDark ? 'mdi:weather-night' : 'mdi:white-balance-sunny'" 
              class="w-5 h-5 text-gray-700 dark:text-gray-300" 
            />
          </button>
        </div>

        <!-- Riwayat Artikel -->
        <NuxtLink to="/article-history" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Riwayat Artikel</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Bookmark -->
        <NuxtLink to="/bookmark" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Bookmark</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Panduan Suara AI -->
        <NuxtLink to="/ai-voice-guide" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Panduan Suara AI</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Hubungi Kami -->
        <NuxtLink to="/contact" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Hubungi Kami</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Masuk / Daftar Aplikasi -->
        <button 
          v-if="!isAuthenticated"
          @click="openGoogleLogin" 
          class="flex items-center justify-between py-1 w-full"
          :disabled="isLoading"
        >
          <span class="font-medium text-black dark:text-white">
            {{ isLoading ? 'Memproses...' : 'Masuk / Daftar Aplikasi' }}
          </span>
          <Icon name="mdi:login" class="w-6 h-6 text-black dark:text-white" />
        </button>

        <!-- Keluar (shown when logged in) -->
        <button 
          v-else
          @click="handleLogout" 
          class="flex items-center justify-between py-1 w-full"
        >
          <span class="font-medium text-red-600 dark:text-red-400">Keluar</span>
          <Icon name="mdi:logout" class="w-6 h-6 text-red-600 dark:text-red-400" />
        </button>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
