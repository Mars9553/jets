import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

type InstallPromptEvent = {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

declare global {
  interface Window {
    __deferredInstallPrompt: InstallPromptEvent | null;
  }
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    if (window.__deferredInstallPrompt) {
      setDeferredPrompt(window.__deferredInstallPrompt);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as unknown as InstallPromptEvent;
      window.__deferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    window.__deferredInstallPrompt = null;
    return outcome === 'accepted';
  }, [deferredPrompt]);

  return { canInstall: !!deferredPrompt, promptInstall };
}
