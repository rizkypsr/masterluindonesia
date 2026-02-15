<script setup lang="ts">
import { useAuth } from '~/lib/auth';

const { $googleSignIn } = useNuxtApp();
const { loginWithGoogle } = useAuth();
const config = useRuntimeConfig();

const isLoading = ref(false);
const error = ref<string | null>(null);

let tokenClient: any = null;

onMounted(async () => {
  if (!import.meta.client) return
  
  try {
    await $googleSignIn.load();
    
    if (window.google) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: config.public.googleClientId,
        scope: 'email profile openid',
        callback: handleTokenResponse,
      });
    }
  } catch (e) {
    error.value = 'Failed to load Google Sign-In';
  }
});

function handleLogin() {
  if (tokenClient) {
    error.value = null;
    tokenClient.requestAccessToken();
  }
}

async function handleTokenResponse(response: { access_token?: string; error?: string }) {
  if (response.error) {
    error.value = response.error;
    return;
  }
  
  if (response.access_token) {
    isLoading.value = true;
    try {
      await loginWithGoogle(response.access_token);
      navigateTo('/');
    } catch (e: any) {
      error.value = e.message || 'Login failed';
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <UButton 
      @click="handleLogin" 
      size="lg" 
      variant="outline"
      :loading="isLoading"
      icon="i-simple-icons-google"
    >
      Sign in with Google
    </UButton>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
