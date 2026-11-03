---
title: Getting Started
description: Install v3-jsoneditor, register it locally or globally, use it from a CDN, and render a minimal JSON editor.
---

# Getting Started

## Installation

::: code-group

```bash [npm]
npm install v3-jsoneditor
```

```bash [pnpm]
pnpm add v3-jsoneditor
```

```bash [yarn]
yarn add v3-jsoneditor
```

```bash [bun]
bun add v3-jsoneditor
```

:::

`vue` (version 3) is a peer dependency. `jsoneditor` is installed automatically as a dependency, and its stylesheet is imported by the component, so there is nothing else to set up.

## Local import

Import the component where you need it. This is the recommended approach because it keeps your bundle tree-shakable.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'world' })
</script>

<template>
  <Vue3Jsoneditor v-model="json" height="400px" />
</template>
```

## Global registration

The default export carries an `install` function, so you can register it as a plugin. This registers the component as `Vue3Jsoneditor`, usable as `<Vue3Jsoneditor>` or `<vue3-jsoneditor>`.

```js
// main.js
import { createApp } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'
import App from './App.vue'

const app = createApp(App)
app.use(Vue3Jsoneditor)
app.mount('#app')
```

### Global defaults

Pass a config object as the second argument to set defaults for every editor in your app. Every key except `componentName` is a default for the prop of the same name; `options` is merged with each component's own `options` (the component wins).

```js
app.use(Vue3Jsoneditor, {
  componentName: 'JsonEditor', // default: 'Vue3Jsoneditor'
  theme: 'auto',
  height: 500,
  debounce: 200,
  options: { search: false },
})
```

The named `install` export works too, as does registering the component yourself under any name:

```js
import Vue3Jsoneditor, { install } from 'v3-jsoneditor'

app.use({ install })
// or
app.component('JsonEditor', Vue3Jsoneditor)
```

## CDN / UMD

Without a build step, load the stylesheet, Vue, jsoneditor and then the UMD bundle. The bundle exposes a global `Vue3Jsoneditor` and uses jsoneditor from its `JSONEditor` global. `v3-jsoneditor/dist/style.css` already contains jsoneditor's own CSS, so you only need one stylesheet.

```html
<!doctype html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/v3-jsoneditor/dist/style.css"
    />
  </head>
  <body>
    <div id="app">
      <vue3-jsoneditor v-model="json" height="400px"></vue3-jsoneditor>
      <pre>{{ json }}</pre>
    </div>

    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://unpkg.com/jsoneditor@10/dist/jsoneditor.min.js"></script>
    <script src="https://unpkg.com/v3-jsoneditor"></script>
    <script>
      const app = Vue.createApp({
        data: () => ({ json: { hello: 'world' } }),
      })
      app.use(Vue3Jsoneditor)
      app.mount('#app')
    </script>
  </body>
</html>
```

::: tip
In in-DOM templates (HTML written directly in the page), use the kebab-case tag `<vue3-jsoneditor>`, because the browser lowercases tag names before Vue sees them.
:::

## Minimal example

A complete component that edits a JSON object and shows the bound value:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({
  id: 1,
  title: 'Hello v3-jsoneditor',
  published: true,
  tags: ['vue', 'json'],
})
</script>

<template>
  <Vue3Jsoneditor v-model="json" current-mode="tree" height="360px" />
  <pre>{{ json }}</pre>
</template>
```

See the [Basic example](/examples/basic) for a live version.

## Nuxt

The component is SSR-safe to import, and the editor renders on the client. See [SSR, Nuxt & VitePress](/guide/ssr) for a Nuxt plugin and recommended `<ClientOnly>` usage.

## Next steps

- [Usage](/guide/usage): modes, options, methods and events.
- [Theming](/guide/theming): pick a theme or brand it with CSS variables.
- [Props reference](/api/props).
