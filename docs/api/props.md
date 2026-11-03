---
title: Props
description: Reference of all v3-jsoneditor props (modelValue, options, currentMode, modeList, language, height, plus, fullscreen, theme) and the toolbar slot.
---

# Props

All props of `<Vue3Jsoneditor>`. In templates, use kebab-case (`current-mode`) or camelCase (`currentMode`); both work.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `object \| array \| string \| number \| boolean \| null` | `undefined` | The JSON value. Use with `v-model`. |
| `options` | `object` | `{}` | Passed to the jsoneditor constructor. Accepts any [jsoneditor option](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options). Callbacks are merged with the component's own. `options.schema` is reactive. |
| `text` | `string` | `undefined` | Raw editor text. Use with `v-model:text`. May be invalid JSON while the user types. If provided initially, it wins over `modelValue`. |
| `currentMode` | `'tree' \| 'code' \| 'form' \| 'text' \| 'view'` | `'code'` | Active editor mode. Supports `v-model:currentMode`. |
| `modeList` | `string[]` | `['tree', 'code', 'form', 'text', 'view']` | Modes offered in the mode switcher. Changing it re-creates the editor. |
| `language` | `string` | `'en'` | UI language: `en`, `zh-CN`, `pt-BR`, `tr`, `ja`, `fr-FR`, `de`, `ru`, `es`. Changing it re-creates the editor. |
| `height` | `string \| number` | `undefined` | Editor height. A number is treated as pixels; a string is any CSS length (`'400px'`, `'50vh'`). Without it, the editor fills its parent. |
| `plus` | `boolean` | `true` | Show the fullscreen button in the menu bar (all modes). |
| `fullscreen` | `boolean` | `false` | Fullscreen state. Supports `v-model:fullscreen`. |
| `readOnly` | `boolean` | `false` | Make the editor read-only in all modes (implemented with jsoneditor's `onEditable`). |
| `debounce` | `number` | `0` | Debounce in milliseconds for `update:modelValue`, `update:text` and `change`. 150 to 300 is recommended for large documents. |
| `mainMenuBar` | `boolean` | `true` | Show the main menu bar. |
| `navigationBar` | `boolean` | `true` | Show the navigation bar (breadcrumbs) in `tree`/`view`/`form` modes. |
| `statusBar` | `boolean` | `true` | Show the status bar (cursor position, size) in `code`/`text` modes. |
| `indentation` | `number` | `2` | Spaces used to indent formatted JSON. Wins over `options.indentation`. |
| `theme` | `'light' \| 'dark' \| 'auto' \| 'classic'` | `'light'` | Visual theme. `auto` follows the `html.dark` class or `prefers-color-scheme`; `classic` is the original jsoneditor look. |

## Option precedence

When a setting can come from more than one place: **component props > `options` > component defaults**.

| Setting | Source |
| --- | --- |
| Mode | `currentMode` prop (always set; default `'code'`). |
| Available modes | `modeList` prop. |
| Language | `language` prop. |
| Indentation | `indentation` prop, then `options.indentation`, then `2`. |
| Menu/navigation/status bars | `mainMenuBar` / `navigationBar` / `statusBar` props (default `true`), then the matching `options` keys. |
| Callbacks (`onChange`, `onModeChange`, `onFocus`, ...) | Both the component's handler and yours run. |

See [Usage: passing jsoneditor options](/guide/usage#passing-jsoneditor-options).

## Global defaults

`app.use(Vue3Jsoneditor, config)` accepts defaults for every prop. All keys except `componentName` are defaults for the matching prop; `options` from the global config and from the component are merged (local wins).

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `componentName` | `string` | `'Vue3Jsoneditor'` | Name the component is registered under. |
| any prop name (`theme`, `height`, `debounce`, `language`, ...) | prop type | prop default | Default value for that prop. |
| `options` | `object` | `{}` | Default jsoneditor options, merged with the `options` prop. |

```js
app.use(Vue3Jsoneditor, {
  componentName: 'JsonEditor',
  theme: 'auto',
  height: 500,
  debounce: 200,
  options: { search: false },
})
```

## Slots

### `default`

Placeholder content rendered until the editor has mounted, for example a loading message or skeleton. Useful with SSR, where the editor only appears on the client.

```vue
<Vue3Jsoneditor v-model="json" height="400px">
  <div class="skeleton">Loading editor...</div>
</Vue3Jsoneditor>
```

### `toolbar`

Custom content rendered inside the jsoneditor menu bar, on the right side. It is re-attached automatically when the mode changes (jsoneditor rebuilds its menu bar on mode switch).

| Slot prop | Type | Description |
| --- | --- | --- |
| `editor` | `JSONEditor \| null` | The raw jsoneditor instance. |
| `mode` | `string` | The current mode. |

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ hello: 'world' })
const copy = (editor) =>
  navigator.clipboard.writeText(JSON.stringify(editor.get(), null, 2))
</script>

<template>
  <Vue3Jsoneditor v-model="json">
    <template #toolbar="{ editor, mode }">
      <button type="button" :title="`Copy (${mode})`" @click="copy(editor)">Copy</button>
    </template>
  </Vue3Jsoneditor>
</template>
```

See the [Custom toolbar example](/examples/custom-toolbar).

## CSS variables

Styling is controlled with `--vje-*` CSS variables on `.v3-jsoneditor` (`--vje-accent`, `--vje-bg`, `--vje-surface`, `--vje-border`, `--vje-text`, `--vje-muted`, `--vje-radius`, `--vje-font-mono`, `--vje-shadow`, `--vje-z-fullscreen`). See [Theming](/guide/theming#css-variables) for descriptions.

## Related

- [Events](/api/events)
- [Methods](/api/methods)
