<script setup lang="ts">
import { useAuth } from '~/lib/auth';

const colorMode = useColorMode()
const config = useRuntimeConfig()
const { $googleSignIn } = useNuxtApp()
const { loginWithGoogle, isAuthenticated, isAdmin, logout, user, fetchSession } = useAuth()

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

let gisReady = false
const googleBtnEl = ref<HTMLElement | null>(null)

// Initialize Google Sign-In on mount
onMounted(async () => {
  // 1. Fetch user info if authenticated and not yet fetched
  if (isAuthenticated.value && !user.value) {
    try {
      await fetchSession()
    } catch (e) {
      console.error('[Lainnya] Failed to fetch session:', e)
    }
  }

  // 2. Load Google Sign-In SDK and set up the ID-token (credential) flow.
  //    The backend verifies the ID token with Google, so we need the token
  //    itself — not an OAuth2 access token — from `response.credential`.
  try {
    await $googleSignIn.load()

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: handleCredentialResponse,
        auto_select: false,
      })
      gisReady = true
      renderGoogleButton()
    }
  } catch (e) {
    console.error('[Lainnya] Failed to load Google Sign-In SDK:', e)
  }
})

/**
 * Render Google's official button, but invisibly (opacity ~0) stacked on top of
 * our own dark button. The GIS button lives in a cross-origin iframe whose white
 * background can't be styled away, so instead we hide it and let it only catch
 * the click — the user still clicks the real iframe, so no cross-origin trick is
 * involved and the account-chooser popup works normally.
 */
function renderGoogleButton() {
  if (!gisReady || !window.google || isAuthenticated.value) return
  nextTick(() => {
    const el = googleBtnEl.value
    if (!el) return
    el.innerHTML = ''
    window.google!.accounts.id.renderButton(el, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'center',
      // Cover our visual button so a click anywhere on it hits the iframe.
      width: Math.min(el.clientWidth || 320, 400),
    })
  })
}

// Re-render whenever the login section reappears after a logout.
watch(isAuthenticated, (authed) => {
  if (!authed) renderGoogleButton()
})

async function handleCredentialResponse(response: { credential?: string; error?: string }) {
  if (response.error || !response.credential) {
    error.value = 'Login Google gagal, coba lagi'
    return
  }

  isLoading.value = true
  error.value = null
  try {
    await loginWithGoogle(response.credential)
  } catch (e: any) {
    // 400 (missing token) / 401 (invalid/expired/wrong audience) → generic message.
    error.value = 'Login Google gagal, coba lagi'
    console.error('[Lainnya] Google login failed:', e)
  } finally {
    isLoading.value = false
  }
}

function handleLogout() {
  logout()
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
      <div v-if="isAuthenticated && user" class="py-3 mb-4 border-b border-gray-300 dark:border-gray-600">
        <div class="flex items-center gap-3">
          <Icon name="mdi:account-circle" class="w-10 h-10 text-primary dark:text-yellow-400" />
          <div class="flex-1">
            <p class="font-semibold text-lg text-black dark:text-white">{{ user.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
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

        <!-- Saldo Deposit -->
        <NuxtLink v-if="isAuthenticated" to="/saldo" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Saldo Deposit</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Chat FAQ (admin only) -->
        <NuxtLink v-if="isAdmin" to="/chat-faq-manager" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Chat FAQ</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Antrian Jawaban (admin only) -->
        <NuxtLink v-if="isAdmin" to="/chat-admin-queue" class="flex items-center justify-between py-1">
          <span class="font-medium text-black dark:text-white">Antrian Jawaban</span>
          <Icon name="mdi:chevron-right" class="w-9 h-9 text-black dark:text-white" />
        </NuxtLink>

        <!-- Masuk / Daftar Aplikasi — our dark button, with the real (invisible)
             Google button stacked on top to catch the click. -->
        <div v-if="!isAuthenticated" class="py-2">
          <div class="relative w-full h-11">
            <div
              class="absolute inset-0 flex items-center justify-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pointer-events-none"
            >
              <Icon name="material-icon-theme:google" class="w-5 h-5 text-[#4285F4]" />
              <span class="font-medium text-black dark:text-white">Masuk dengan Google</span>
            </div>
            <div ref="googleBtnEl" class="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.001]" />
          </div>
          <p v-if="isLoading" class="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Memproses...
          </p>
        </div>

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
