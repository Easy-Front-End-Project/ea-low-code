/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'virtual:uno.css' {
  const content: string
  export default content
}

declare module 'easy-component-ui' {
  const content: void
  export default content
}
