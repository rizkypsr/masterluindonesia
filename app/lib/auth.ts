// Custom auth integration with masterluindonesia API using Better Auth endpoint

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    token_type: string;
  };
}

interface SessionUser {
  id: string | number;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  username: string;
  social_media: number;
  row_status: number;
  is_admin?: boolean;
}

interface Session {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: number | string;
}

interface SessionResponse {
  user: SessionUser;
  session: Session;
}

export const useAuth = () => {
  const config = useRuntimeConfig()
  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    secure: import.meta.env.PROD,
    sameSite: 'lax',
  });

  const user = useState<SessionUser | null>('auth_user', () => null);
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => !!user.value?.is_admin);

  // Exchange a Google ID token (JWT) for our own session token. The backend
  // verifies the token with Google server-side and extracts the profile itself,
  // so the client must send ONLY the id token — never raw id/email/name, which
  // could be forged.
  const loginWithGoogle = async (idToken: string) => {
    const response = await $fetch<LoginResponse>(`${config.public.apiV2BaseUrl}/auth/logingoogle`, {
      method: 'POST',
      body: { idToken },
    });

    if (response.success && response.data?.token) {
      token.value = response.data.token;
      await fetchSession();
      return response;
    }

    throw new Error(response.message || 'Login failed');
  };

  const fetchSession = async () => {
    if (!token.value) {
      user.value = null;
      return null;
    }

    try {
      const response = await $fetch<SessionResponse | null>(`${config.public.apiV2BaseUrl}/auth/get-session`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });

      if (response && response.user) {
        user.value = response.user;
        return response;
      } else {
        token.value = null;
        user.value = null;
        return null;
      }
    } catch (e) {
      token.value = null;
      user.value = null;
      return null;
    }
  };

  const logout = async () => {
    if (token.value) {
      try {
        await $fetch(`${config.public.apiV2BaseUrl}/auth/sign-out`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          },
          body: {}
        });
      } catch (e) {
        console.error('Logout failed:', e);
      }
    }
    token.value = null;
    user.value = null;
  };

  const getAuthHeader = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  };

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    loginWithGoogle,
    fetchSession,
    logout,
    getAuthHeader,
  };
};
