/*
 * @Author: yangmiaomiao
 * @Date: 2023-12-28 20:30:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-08-24 10:10:37
 * @Description:
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuejsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import viteCompression from 'vite-plugin-compression'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
    plugins: [
        vue(),
        vuejsx(),
        viteCompression({
            verbose: true,
            disable: false,
            threshold: 1048576,
            algorithm: 'gzip',
            ext: '.gz',
        }),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹(路径为存放所有svg图标的文件夹不单个svg图标)
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]',
        }),
    ],
    base: './',
    resolve: {
        alias: {
            '~': path.resolve(__dirname, './'), // 设置路径
            '@': path.resolve(__dirname, 'src'), // 设置别名
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
            '@components': path.resolve(__dirname, './src/components'),
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
        preprocessorOptions: {
            // 导入scss预编译程序
            scss: {
                additionalData: `@import "@/styles/var.scss";`,
            },
        },
    },
    server: {
        port: 8090,
        host: true,
        hmr: true,
        watch: {
            usePolling: true, // 修复HMR热更新失效
        },
        open: true, //是否自动在浏览器打开
        proxy: {
            '/mock': {
                target: 'http://127.0.0.1:4523/m1/3915073-0-default/mock',
                changeOrigin: true,
                ws: true,
                rewrite: (path) => path.replace(/^\/mock/, ''),
            },
            '/Web': {
                //设置开发环境代理
                // target: 'http://10.158.27.179:8080/Web',
                target: 'http://127.0.0.1:4523/m1/4089913-0-default/Web', //代理的目标地址(后端设置的端口号)
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/Web/, ''),
                bypass(req, res, options: any) {
                    const proxyURL = options.target + options.rewrite(req.url)
                    res.setHeader('x-req-proxyURL', proxyURL) // 设置响应头可以看到
                },
            },
        },
    },
    build: {
        outDir: 'dist',
        minify: 'esbuild',
        sourcemap: false,
        // 禁用 gzip 压缩大小报告，可略微减少打包时间
        reportCompressedSize: false,
        // 规定触发警告的 chunk 大小
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                // Static resource classification and packaging
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    define: {
        // enable hydration mismatch details in production build
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
})
