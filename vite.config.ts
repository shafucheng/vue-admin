import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    vueJsx(),
    eslint({
      fix: true,
    }),
    unocss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
