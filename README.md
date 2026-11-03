# v3-jsoneditor

> A modern, themeable JSON editor component for Vue 3: a wrapper around [jsoneditor](https://github.com/josdejong/jsoneditor) with `v-model`, five editing modes, light/dark themes, accessible full screen, JSON Schema validation, SSR safety and TypeScript types.

[![npm](https://img.shields.io/npm/v/v3-jsoneditor)](https://www.npmjs.com/package/v3-jsoneditor) [![license](https://img.shields.io/npm/l/v3-jsoneditor)](./LICENSE)

**Docs and live playground:** https://v3-jsoneditor.netlify.app/
**For AI tools:** [`/llms.txt`](https://v3-jsoneditor.netlify.app/llms.txt) · [`/llms-full.txt`](https://v3-jsoneditor.netlify.app/llms-full.txt)

## Installation

```bash
npm install v3-jsoneditor
```

## Usage

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'vue' })
</script>

<template>
  <Vue3Jsoneditor v-model="json" height="400px" theme="auto" />
</template>
```

Styles are injected automatically. For CDN or strict-CSP setups, `v3-jsoneditor/style.css` is also published.

### Register globally (with defaults)

```js
import { createApp } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'
import App from './App.vue'

createApp(App)
  .use(Vue3Jsoneditor, { theme: 'auto', height: 500 }) // optional global defaults
  .mount('#app')
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/v3-jsoneditor/dist/style.css" />
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/jsoneditor@10/dist/jsoneditor.min.js"></script>
<script src="https://unpkg.com/v3-jsoneditor"></script>
<script>
  Vue.createApp({ data: () => ({ json: { hello: 'vue' } }) })
    .use(Vue3Jsoneditor.default)
    .mount('#app')
</script>
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` / `modelValue` | any JSON | – | Bound JSON value. Clearing the editor emits `null`. |
| `v-model:text` / `text` | `string` | – | Raw editor text (may be invalid JSON while typing). |
| `options` | `object` | `{}` | Any [jsoneditor option](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options). Your callbacks run in addition to the component's. |
| `v-model:currentMode` / `currentMode` | `'tree' \| 'code' \| 'form' \| 'text' \| 'view'` | `'code'` | Active mode. |
| `modeList` | `string[]` | all five | Modes offered in the switcher. |
| `theme` | `'light' \| 'dark' \| 'auto' \| 'classic'` | `'light'` | `auto` follows `<html class="dark">` or the OS. `classic` is the original look. |
| `height` | `string \| number` | `'400px'` | Numbers are pixels. |
| `plus` | `boolean` | `true` | Show the full screen button. |
| `v-model:fullscreen` / `fullscreen` | `boolean` | `false` | Full screen state. Esc exits. |
| `readOnly` | `boolean` | `false` | Read-only in every mode. |
| `debounce` | `number` | `0` | Debounce (ms) for model updates. |
| `language` | `string` | `'en'` | `en`, `zh-CN`, `pt-BR`, `tr`, `ja`, `fr-FR`, `de`, `ru`, `es`. |
| `indentation` | `number` | `2` | Spaces per indent level. |
| `mainMenuBar` / `navigationBar` / `statusBar` | `boolean` | `true` | Toggle editor chrome. |

## Events

`update:modelValue`, `update:text`, `update:currentMode`, `update:fullscreen`, `change`, `error` (invalid JSON), `validation-error`, `mode-change`, `fullscreen-change`, `focus`, `blur`, `textSelectionChange`, `selectionChange`, `colorPicker`.

## Methods (template ref)

`getEditor()`, `get()`, `getText()`, `validate()`, `focus()`, `setEditorContent(json)`, `expandAll()`, `collapseAll()`, `toggleFullScreen()`.

## Slots

- `#toolbar="{ editor, mode }"`: extra buttons inside the menu bar.
- default: placeholder shown until the editor has mounted.

## Theming

```css
.my-editor.v3-jsoneditor {
  --vje-accent: #10b981;
  --vje-radius: 14px;
}
```

See the [theming guide](https://v3-jsoneditor.netlify.app/guide/theming) for every variable.

## Development

```bash
npm install
npm run build          # library -> dist/
npm run docs:dev       # docs site (run `npm install` in docs/ first)
```

## Support

If this helped you, consider [sponsoring the project on GitHub](https://github.com/sponsors/pratik227). Thank you!

## License

MIT © Pratik Patel. Toolbar icons from the [Solar icon set](https://icon-sets.iconify.design/solar/) (CC BY 4.0).
