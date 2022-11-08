import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import { createStyleImportPlugin as styleImport } from 'vite-plugin-style-import'

const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'),
)

export default defineConfig({
  define: {
    __APP_NAME__: `"${packageJson.name}"`,
    __APP_VERSION__: `"${packageJson.version}"`,
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    vueJsx(),
    unocss({
      safelist: ['hidden'],
    }),
    eslint({
      fix: true,
    }),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          resolveStyle: (name) => `ant-design-vue/es/${name}/style/index`,
          ensureStyleFile: true,
        },
        {
          libraryName: '@formily/antdv-x3',
          resolveStyle: (name) => `@formily/antdv-x3/esm/${name}/style`,
          ensureStyleFile: true,
        },
        {
          libraryName: '@ant-design-vue/pro-layout',
          base: '@ant-design-vue/pro-layout/dist/style.less',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'ant-design-vue/lib': 'ant-design-vue/es',
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
