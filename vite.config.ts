// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        // The guarded wrapper in src/lib/pwa.ts is the only registrar.
        injectRegister: null,
        registerType: "prompt",
        filename: "sw.js",
        devOptions: { enabled: false },
        manifestFilename: "manifest.webmanifest",
        manifest: {
          name: "Gerador de Configs",
          short_name: "Gerador Configs",
          description:
            "Gere variações do arquivo-base de configuração alterando somente o segundo MAC.",
          lang: "pt-BR",
          dir: "ltr",
          start_url: "/admin/gerador-configs",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#0b0f14",
          theme_color: "#0b0f14",
          icons: [
            { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "/pwa-maskable-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          // Static frontend assets only — no HTML precache, no API/auth/dynamic data.
          globPatterns: ["**/*.{js,css,png,svg,ico,webp,woff,woff2}"],
          globIgnores: ["**/sw.js", "**/workbox-*.js"],
          navigateFallback: null,
          cleanupOutdatedCaches: true,
          clientsClaim: false,
          skipWaiting: false,
          runtimeCaching: [
            {
              // HTML navigations: always try the network first.
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin && request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-navigations",
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
            {
              // Same-origin build assets only.
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin &&
                /\.(?:js|css|png|svg|ico|webp|woff2?)$/.test(url.pathname) &&
                !url.pathname.startsWith("/api/"),
              handler: "CacheFirst",
              options: {
                cacheName: "static-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
