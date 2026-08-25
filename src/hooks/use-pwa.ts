import { useCallback, useEffect, useRef, useState } from "react";

import { registerServiceWorker } from "@/lib/pwa";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * PWA install prompt + update notification state.
 * Purely additive: does not touch generator logic.
 */
export function usePwa() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(null);
  const applyUpdateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      promptEvent.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      promptEvent.current = null;
      setCanInstall(false);
      setInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const displayModeQuery = window.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = () => setInstalled(isStandalone());
    displayModeQuery.addEventListener("change", onDisplayModeChange);

    void registerServiceWorker({
      onNeedRefresh: (applyUpdate) => {
        applyUpdateRef.current = applyUpdate;
        setUpdateReady(true);
      },
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      displayModeQuery.removeEventListener("change", onDisplayModeChange);
    };
  }, []);

  const install = useCallback(async () => {
    const event = promptEvent.current;
    if (!event) return;
    await event.prompt();
    const choice = await event.userChoice;
    promptEvent.current = null;
    setCanInstall(false);
    if (choice.outcome === "accepted") setInstalled(true);
  }, []);

  const applyUpdate = useCallback(() => {
    applyUpdateRef.current?.();
    setUpdateReady(false);
  }, []);

  return {
    canInstall: canInstall && !installed,
    installed,
    updateReady,
    install,
    applyUpdate,
  };
}
