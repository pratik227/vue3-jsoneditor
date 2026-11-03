---
title: Introduction
description: What v3-jsoneditor is, its key features, and when to use it in a Vue 3 application.
---

# Introduction

**v3-jsoneditor** is a Vue 3 component that wraps [jsoneditor](https://github.com/josdejong/jsoneditor) by Jos de Jong, the battle-tested web tool for viewing, editing, formatting and validating JSON. It gives you a single `<Vue3Jsoneditor>` component with `v-model` support, a modern theme, a fullscreen mode and a typed API, so you can drop a full JSON editor into any Vue 3 app in a couple of lines.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ name: 'v3-jsoneditor', stars: 42, tags: ['vue', 'json'] })
</script>

<template>
  <Vue3Jsoneditor v-model="json" height="320px" />
</template>
```

<llm-exclude>

## Explore the docs

<CardGrid />

</llm-exclude>

## Features

- **Two-way binding** with `v-model` for any JSON value: objects, arrays, strings, numbers, booleans and `null`.
- **Five editing modes** from jsoneditor: `tree`, `code`, `form`, `text` and `view`, with a configurable mode switcher and `v-model:currentMode`.
- **JSON Schema validation** through `options.schema`, plus custom validation via `options.onValidate` and a `validation-error` event.
- **Themes**: a modern `light` theme (default), `dark`, `auto` (follows your site's dark mode) and `classic` (the original jsoneditor look), all customizable with CSS variables.
- **Fullscreen mode** in every editor mode, controllable with `v-model:fullscreen`, closable with <kbd>Esc</kbd>.
- **Custom toolbar** content through the `#toolbar` slot.
- **Full jsoneditor access**: pass any [jsoneditor option](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options) through `options`, or grab the raw instance with `getEditor()`.
- **SSR-safe**: jsoneditor is loaded lazily on the client, so the component can be imported in Nuxt and VitePress.
- **TypeScript types** with JSDoc ship with the package.
- **Internationalization**: `en`, `zh-CN`, `pt-BR`, `tr`, `ja`, `fr-FR`, `de`, `ru` and `es`.

## When to use it

v3-jsoneditor is a good fit when you need to:

- Let users edit configuration, settings or API payloads as structured JSON.
- Inspect API responses or logs in an admin panel or developer tool.
- Offer a read-only, collapsible JSON viewer.
- Validate user-supplied JSON against a JSON Schema before saving it.

If you only need to *display* a small, static snippet of JSON, a `<pre>` block with syntax highlighting is lighter. For everything interactive, read on.

## Next steps

- [Getting Started](/guide/getting-started): install and render your first editor.
- [Usage](/guide/usage): `v-model`, modes, options, methods and events.
- [Examples](/examples/): live demos you can copy.
- [Playground](/playground): try every prop interactively.

<SponsorCard />
