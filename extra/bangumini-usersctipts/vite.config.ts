// vite.config.ts
import { defineConfig } from 'vite'
import userscript from './plugins/rollup-userscript'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    build: {
        lib: {
            entry: ['src/index.ts'],
            name: 'umd',
            fileName: (format) => `bangumini.${format}.user.js`,
            formats: ['es', 'umd', 'iife'],
        },
        // sourcemap: false,
        rollupOptions: {
            plugins: [
                cssInjectedByJsPlugin(),
                userscript({
                    name: '番组迷你',
                    namespace: 'https://b38.dev',
                    match: ['*://bgm.tv/*', '*://bangumi.tv/*', '*://chii.in/*'],
                    require: ['https://unpkg.com/echarts'],
                }),
            ],
        },
    },
})
