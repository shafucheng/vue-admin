/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare const __APP_NAME__: string
declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_APP_BASEURL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
