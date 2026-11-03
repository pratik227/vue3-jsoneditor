---
title: Fullscreen
description: Show the fullscreen button, control fullscreen with v-model:fullscreen, listen for fullscreen-change, and adjust its z-index.
---

# Fullscreen

The editor can expand to fill the whole viewport, which is handy for large documents.

## The fullscreen button

The `plus` prop (default `true`) shows a fullscreen button in the menu bar, in **every** mode. Hide it with:

```vue
<Vue3Jsoneditor v-model="json" :plus="false" />
```

## v-model:fullscreen

Bind `fullscreen` to read or control the state from your component:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'world' })
const isFullscreen = ref(false)
</script>

<template>
  <button @click="isFullscreen = true">Open fullscreen</button>
  <Vue3Jsoneditor v-model="json" v-model:fullscreen="isFullscreen" height="300px" />
</template>
```

The state stays in sync whether fullscreen is toggled by the button, by <kbd>Esc</kbd>, by the prop or by a method call.

## Events

`fullscreen-change` is emitted with a boolean whenever the state changes (alongside `update:fullscreen`):

```vue
<Vue3Jsoneditor
  v-model="json"
  @fullscreen-change="(on) => console.log(on ? 'entered' : 'left', 'fullscreen')"
/>
```

## Programmatic toggle

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({})
const editorRef = ref(null)
</script>

<template>
  <button @click="editorRef.toggleFullScreen()">Toggle fullscreen</button>
  <Vue3Jsoneditor ref="editorRef" v-model="json" />
</template>
```

## Behavior

- Press <kbd>Esc</kbd> to exit fullscreen.
- While fullscreen, page scrolling is locked (`overflow: hidden` on `body`) and restored on exit or unmount.
- The editor is fixed over the viewport with `z-index: var(--vje-z-fullscreen)`. If your app has headers or dialogs with a higher `z-index`, raise it:

```css
.v3-jsoneditor {
  --vje-z-fullscreen: 10000;
}
```

::: tip
This is an in-page overlay, not the browser Fullscreen API, so it works inside iframes and does not require a user permission prompt.
:::
