<script setup lang="ts">
import { useAuth } from '~/lib/auth';

const { $googleSignIn } = useNuxtApp();
const { loginWithGoogle } = useAuth();
const config = useRuntimeConfig();

const isLoading = ref(false);
const error = ref<string | null>(null);
const buttonRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    await $googleSignIn.load();
    
    if (window.google && buttonRef.value) {
      window.google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: handleCredentialResponse,
      });
      
      window.google.accounts.id.renderButton(buttonRef.value, {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'signin_with',
      });
    }
  } catch (e) {
    error.value = 'Failed to load Google Sign-In';
  }
});

async function handleCredentialResponse(response: { credential: string }) {
  isLoading.value = true;
  error.value = null;
  
  try {
    await loginWithGoogle(response.credential);
    navigateTo('/'); // Redirect after successful login
  } catch (e: any) {
    error.value = e.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div ref="buttonRef" />
    <p v-if="isLoading" class="text-sm text-gray-500">Logging in...</p>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
