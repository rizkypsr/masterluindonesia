<script setup lang="ts">
import { useAuth } from '~/lib/auth';

const colorMode = useColorMode()
const config = useRuntimeConfig()
const { $googleSignIn } = useNuxtApp()
const { loginWithGoogle, isAuthenticated, logout, getAuthHeader } = useAuth()

const isLoading = ref(false)
const error = ref<string | null>(null)
const userName = ref<string | null>(null)
const userEmail = ref<string | null>(null)

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

let tokenClient: any = null

// Initialize Google Sign-In on mount
onMounted(async () => {
  try {
    await $googleSignIn.load()

    if (window.google) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope: 'email profile openid',
        callback: handleTokenResponse,
      })
    }

    // Fetch user info if authenticated
    if (isAuthenticated.value) {
      await fetchUserInfo()
    }
  } catch (e) {
    console.error('Failed to load Google Sign-In', e)
  }
})

// Fetch user info from backend
async function fetchUserInfo() {
  try {
    const response = await $fetch<{ success: boolean; data: { nama: string; email: string } }>(
      `${config.public.apiBaseUrl}/myprofile`,
      {
        headers: getAuthHeader() as Record<string, string>
      }
    )
    if (response.success && response.data) {
      userName.value = response.data.nama
      userEmail.value = response.data.email
    }
  } catch (e) {
    console.error('Failed to fetch user info:', e)
  }
}

async function handleTokenResponse(response: { access_token?: string; error?: string }) {
  if (response.error) {
    error.value = response.error
    return
  }

  if (response.access_token) {
    isLoading.value = true
    error.value = null
    try {
      await loginWithGoogle(response.access_token)
      // Fetch user info after successful login
      await fetchUserInfo()
    } catch (e: any) {
      error.value = e.message || 'Login failed'
    } finally {
      isLoading.value = false
    }
  }
}

function openGoogleLogin() {
  if (tokenClient) {
    error.value = null
    tokenClient.requestAccessToken()
  }
}

function handleLogout() {
  logout()
  userName.value = null
  userEmail.value = null
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="px-4 py-5 shadow-md bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
      <h1 class="text-black dark:text-white">Pengaturan</h1>
    </div>

    <!-- Content -->
    <div class="px-6 py-6">
      <!-- User Name (shown when logged in) -->
      <div v-if="isAuthenticated && userName" class="py-3 mb-4 border-b border-gray-300 dark:border-gray-600">
        <div class="flex items-center gap-3">
          <Icon name="mdi:account-circle" class="w-10 h-10 text-primary dark:text-yellow-400" />
          <div class="flex-1">
            <p class="font-semibold text-lg text-black dark:text-white">{{ userName }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="space-y-1">
        <!-- Mode Tema -->
        <div class="flex items-center justify-between py-2">
          <span class="font-medium text-black dark:text-white">Mode Tema</span>
          <button @click="toggleTheme"
            class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800">
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ isDark ? 'Dark' : 'Light' }}</span>
            <Icon :name="isDark ? 'mdi:weather-night' : 'mdi:white-balance-sunny'"
              class="w-5 h-5 text-gray-700 dark:text-gray-300" />
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

        <!-- Masuk / Daftar Aplikasi -->
        <button v-if="!isAuthenticated" @click="openGoogleLogin" class="flex items-center justify-between py-1 w-full"
          :disabled="isLoading">
          <span class="font-medium text-black dark:text-white cursor-pointer hover:underline">
            {{ isLoading ? 'Memproses...' : 'Masuk / Daftar Aplikasi' }}
          </span>
          <Icon name="mdi:login" class="w-6 h-6 text-black dark:text-white" />
        </button>

        <!-- Keluar (shown when logged in) -->
        <button v-else @click="handleLogout" class="flex items-center justify-between py-1 w-full">
          <span class="font-medium text-red-600 dark:text-red-400">Keluar</span>
          <Icon name="mdi:logout" class="w-6 h-6 text-red-600 dark:text-red-400" />
        </button>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-red-500 dark:text-red-400 mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
