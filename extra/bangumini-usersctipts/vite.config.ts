// vite.config.ts
import { defineConfig } from 'vite'
import tampermonkey from 'vite-plugin-tampermonkey'

export default defineConfig({
    plugins: [
        tampermonkey({
            externalGlobals: ['echarts'],
        }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})
