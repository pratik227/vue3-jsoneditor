---
title: SSR, Nuxt & VitePress
description: Use v3-jsoneditor with server-side rendering in Nuxt 3/4 and VitePress; the editor loads jsoneditor lazily and renders on the client.
---

# SSR, Nuxt & VitePress

jsoneditor touches `window` and `document`, so it can only run in the browser. v3-jsoneditor handles this for you:

- jsoneditor is **imported lazily inside `onMounted`**, so importing `v3-jsoneditor` during server rendering is safe.
- On the server the component renders an empty container. The editor itself appears on the client after mount.

Because the editor appears only after hydration, wrapping it in `<ClientOnly>` with a placeholder of the same height is recommended to avoid layout shift.

You can also use the component's default slot as a placeholder: its content is rendered until the editor has mounted.

```vue
<Vue3Jsoneditor v-model="json" height="400px">
  <div class="editor-skeleton">Loading editor...</div>
</Vue3Jsoneditor>
```

## Nuxt 3 / Nuxt 4

### Plugin (global registration)

```ts
// plugins/v3-jsoneditor.client.ts
import Vue3Jsoneditor from 'v3-jsoneditor'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Jsoneditor)
})
```

The `.client` suffix registers the plugin only in the browser, so the component must be used inside `<ClientOnly>`:

```vue
<script setup lang="ts">
const json = ref({ hello: 'nuxt' })
</script>

<template>
  <ClientOnly>
    <Vue3Jsoneditor v-model="json" height="400px" />
    <template #fallback>
      <div style="height: 400px">Loading editor...</div>
    </template>
  </ClientOnly>
</template>
```

::: tip
If you prefer a universal plugin (`plugins/v3-jsoneditor.ts`, without `.client`), that works too, since the import is SSR-safe. `<ClientOnly>` is then optional but still recommended for a stable layout.
:::

### Local import

```vue
<script setup lang="ts">
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'nuxt' })
</script>

<template>
  <ClientOnly>
    <Vue3Jsoneditor v-model="json" height="400px" />
  </ClientOnly>
</template>
```

## VitePress

Register the component in your theme and use it inside `<ClientOnly>` in Markdown:

```ts
// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import Vue3Jsoneditor from 'v3-jsoneditor'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(Vue3Jsoneditor)
  },
}
```

```md
<ClientOnly>
  <Vue3Jsoneditor :model-value="{ hello: 'vitepress' }" theme="auto" height="300px" />
</ClientOnly>
```

`theme="auto"` follows VitePress's dark mode toggle, which sets the `dark` class on `<html>`.

## Other SSR setups

The same rules apply to any SSR framework (Vite SSR, Quasar SSR, Astro with the Vue integration): import normally, render on the client (for Astro use `client:only="vue"`), and reserve the editor's height to avoid layout shift.
