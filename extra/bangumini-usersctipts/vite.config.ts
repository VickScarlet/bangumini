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
    server: {
        open: '/dist/bangumini.es.user.js',
    },
    build: {
        lib: {
            entry: ['src/index.ts'],
            name: 'bangumini',
            fileName: (format) => `bangumini.${format}.user.js`,
            formats: ['es', 'umd', 'iife'],
        },
        sourcemap: true,
        rollupOptions: {
            // external: ['react', 'react-dom', 'echarts'],
            // output: {
            //     globals: {
            //         react: 'React',
            //         'react-dom': 'ReactDOM',
            //         echarts: 'echarts',
            //     },
            // },
            plugins: [
                cssInjectedByJsPlugin(),
                userscript({
                    name: '番组迷你',
                    namespace: 'https://b38.dev',
                    match: ['*://bgm.tv/*', '*://bangumi.tv/*', '*://chii.in/*'],
                    // require: ['https://unpkg.com/echarts'],
                }),
            ],
        },
    },
})
