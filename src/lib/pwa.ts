/**
 * Single, guarded service-worker registrar.
 * Never registers in dev, inside an iframe, or in Lovable preview hosts.
 */

const SW_URL = "/sw.js";

function isBlockedHost(hostname: string) {
  return (
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev")
  );
}

export function canRegisterServiceWorker() {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  if (!import.meta.env.PROD) return false;
  if (window.self !== window.top) return false;
  if (isBlockedHost(window.location.hostname)) return false;
  if (new URL(window.location.href).searchParams.has("sw=off".split("=")[0]!)) {
    // ?sw=off kill switch
    if (new URL(window.location.href).searchParams.get("sw") === "off") return false;
  }
  return true;
}

async function unregisterAppServiceWorkers() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((registration) => {
        const scriptURL =
          registration.active?.scriptURL ??
          registration.waiting?.scriptURL ??
          registration.installing?.scriptURL ??
          "";
        return scriptURL.endsWith(SW_URL);
      })
      .map((registration) => registration.unregister()),
  );
}

export type PwaUpdateHandlers = {
  onNeedRefresh: (applyUpdate: () => void) => void;
};

/** Registers the service worker when allowed; returns a cleanup-free no-op otherwise. */
export async function registerServiceWorker({ onNeedRefresh }: PwaUpdateHandlers) {
  if (!canRegisterServiceWorker()) {
    await unregisterAppServiceWorkers();
    return;
  }

  const { registerSW } = await import("virtual:pwa-register");
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      onNeedRefresh(() => {
        void updateSW(true);
      });
    },
  });
}
