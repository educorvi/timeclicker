import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next/resolvers';
import url from '@rollup/plugin-url';
import Icons from 'unplugin-icons/vite';
import IconsResolve from 'unplugin-icons/resolver';
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'swagger-ui': ['swagger-ui-dist'],
                },
            },
        },
    },
    plugins: [
        vue(),
        Components({
            resolvers: [BootstrapVueNextResolver(), IconsResolve()],
            dts: true,
        }),
        url({
            include: ['**/*.woff2'],
        }),
        Icons({
            compiler: 'vue3',
            autoInstall: true,
        }),
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,txt,json}'],
                navigateFallbackDenylist: [/^\/api\/*/],
            },
            devOptions: { enabled: true },
            manifest: {
                name: 'Timeclicker',
                short_name: 'Clicker',
                description: 'An app to log your hours',
                theme_color: '#3080e2',
                background_color: '#112a49',
                icons: [
                    {
                        src: '/icons/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: '/icons/android-chrome-maskable-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/icons/android-chrome-maskable-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
