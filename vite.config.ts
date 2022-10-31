import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'
import unocss from 'unocss/vite'

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
