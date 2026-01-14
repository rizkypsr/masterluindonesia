// Google Sign-In plugin (client-side only)
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Load Google Sign-In script
  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
      document.head.appendChild(script);
    });
  };

  return {
    provide: {
      googleSignIn: {
        load: loadGoogleScript,
        getClientId: () => config.public.googleClientId,
      },
    },
  };
});

// Type declaration
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}
