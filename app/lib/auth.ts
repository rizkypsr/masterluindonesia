// Custom auth integration with masterluindonesia API
// Your backend handles Google OAuth and returns JWT tokens

const API_BASE = 'https://api.masterluindonesia.com/api';

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    token_type: string;
  };
}

export const useAuth = () => {
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    secure: true,
    sameSite: 'lax',
  });

  const isAuthenticated = computed(() => !!token.value);

  // Call your backend with Google ID token or access token
  const loginWithGoogle = async (googleToken: string) => {
    const response = await $fetch<LoginResponse>(`${API_BASE}/logingoogle`, {
      method: 'POST',
      body: {
        token: googleToken, // Adjust field name based on your API
      },
    });

    if (response.success && response.data?.token) {
      token.value = response.data.token;
      return response;
    }

    throw new Error(response.message || 'Login failed');
  };

  const logout = () => {
    token.value = null;
  };

  const getAuthHeader = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  };

  return {
    token: readonly(token),
    isAuthenticated,
    loginWithGoogle,
    logout,
    getAuthHeader,
  };
};
