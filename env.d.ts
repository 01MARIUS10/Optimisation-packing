/// <reference types="vite/client" />

declare module '*.Vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
