import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import imp from 'vite-plugin-imp'

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    vueJsx(),
    unocss(),
    eslint({
      fix: true,
    }),
    imp({
      libList: [
        {
          libName: 'ant-design-vue',
          libDirectory: 'lib',
          style: (name) => `ant-design-vue/lib/${name}/style/index`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
