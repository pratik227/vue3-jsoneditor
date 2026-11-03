---
title: Usage
description: Bind JSON with v-model, switch editor modes, pass jsoneditor options, call methods through a template ref, and listen to events.
---

# Usage

## v-model

`v-model` binds any JSON value: an object, array, string, number, boolean or `null`.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref([{ id: 1, done: false }, { id: 2, done: true }])
</script>

<template>
  <Vue3Jsoneditor v-model="json" height="320px" />
</template>
```

How updates flow:

- **Editor to parent**: every valid edit emits `update:modelValue` and `change` with the parsed value.
- **Parent to editor**: assigning a new value updates the editor in place using jsoneditor's `update()` (the editor is not re-created). In `tree`, `view` and `form` modes the tree is expanded automatically after each update.
- **Invalid text**: while the text in `code` or `text` mode is not valid JSON, the model is not updated and an `error` event is emitted instead.
- **Clearing**: emptying the editor in `code` or `text` mode emits `null`.

### Raw text with v-model:text

`v-model:text` binds the raw editor text, including invalid JSON while the user is typing. This is useful to preserve the user's formatting or to save drafts. If `text` is provided initially, it wins over `modelValue`.

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const text = ref('{\n  "draft": true\n}')
</script>

<template>
  <Vue3Jsoneditor v-model:text="text" height="240px" />
</template>
```

### Debouncing updates

By default every keystroke emits `update:modelValue`, `update:text` and `change`. Set `debounce` (milliseconds) to batch them; 150 to 300 is recommended for large documents.

```vue
<Vue3Jsoneditor v-model="json" :debounce="200" />
```

::: tip
For big documents, prefer `shallowRef` over `ref` so Vue does not make every nested node deeply reactive. See [Large JSON](/examples/large-json).
:::

## Modes

jsoneditor offers five modes:

| Mode | Description |
| --- | --- |
| `tree` | Collapsible tree with inline editing, drag and drop, search and undo. |
| `code` | Ace-powered code editor with syntax highlighting and formatting. **Default.** |
| `form` | Like `tree`, but only values are editable; the structure is locked. |
| `text` | Plain textarea with format/compact/repair buttons. |
| `view` | Read-only tree. |

Set the initial mode with `current-mode` and limit the mode switcher with `mode-list`:

```vue
<Vue3Jsoneditor
  v-model="json"
  current-mode="tree"
  :mode-list="['tree', 'code']"
/>
```

Use `v-model:currentMode` to keep the active mode in sync when the user switches through the menu, or to switch it from outside:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ a: 1 })
const mode = ref('tree')
</script>

<template>
  <button @click="mode = mode === 'tree' ? 'code' : 'tree'">Toggle mode</button>
  <Vue3Jsoneditor v-model="json" v-model:current-mode="mode" />
  <p>Current mode: {{ mode }}</p>
</template>
```

The `mode-change` event fires with `(newMode, oldMode)` whenever the mode changes.

::: warning
Changing `modeList` or `language` after mount re-creates the editor. The content is preserved, but transient state such as undo history is lost.
:::

## Read-only

`read-only` makes the editor read-only in every mode, while keeping mode switching, search and copying available:

```vue
<Vue3Jsoneditor v-model="json" read-only />
```

For a read-only tree only, `current-mode="view"` also works. See the [Read-only example](/examples/read-only).

## Layout props

| Prop | Default | Description |
| --- | --- | --- |
| `main-menu-bar` | `true` | Show the main menu bar. |
| `navigation-bar` | `true` | Show the breadcrumb navigation bar (`tree`, `view`, `form`). |
| `status-bar` | `true` | Show the status bar (`code`, `text`). |
| `indentation` | `2` | Spaces used when formatting JSON. |

```vue
<Vue3Jsoneditor v-model="json" :navigation-bar="false" :status-bar="false" :indentation="4" />
```

## Passing jsoneditor options

The `options` prop is passed straight to the jsoneditor constructor, so any [jsoneditor configuration option](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#configuration-options) works:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ name: 'Ada' })

const options = {
  search: false,
  enableSort: false,
  enableTransform: false,
}
</script>

<template>
  <Vue3Jsoneditor v-model="json" :options="options" height="300px" />
</template>
```

### Precedence

When the same setting can come from several places, the component resolves it in this order:

1. **Component props** such as `currentMode`, `modeList`, `language`, `indentation`, `mainMenuBar`, `navigationBar` and `statusBar` win.
2. **`options`** values come next (the component's `options` merged over any global `options` from `app.use`).
3. **Defaults** of the component (for example `indentation: 2`) apply last.

For example, the starting mode is `currentMode` if set, otherwise `options.mode`, otherwise `'code'`.

### Your callbacks are merged

The component uses several jsoneditor callbacks internally (`onChange`, `onModeChange`, `onFocus` and so on). If you pass your own, such as `options.onChange`, **both run**: the component's handler (which emits events) and yours.

```js
const options = {
  onChange() {
    console.log('changed (from options.onChange)')
  },
}
```

The one exception is `onColorPicker`: jsoneditor's built-in color picker is used unless you listen to `@colorPicker` or pass `options.onColorPicker`.

In most cases the component's events are more convenient than raw callbacks; use whichever you prefer.

## Template ref and methods

Grab the component with a template ref to call its exposed methods:

```vue
<script setup>
import { ref } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ user: { name: 'Ada', roles: ['admin', 'dev'] } })
const editorRef = ref(null)

function reset() {
  editorRef.value.setEditorContent({ user: null })
}

function logRaw() {
  const editor = editorRef.value.getEditor() // raw JSONEditor instance
  console.log(editor.getText())
}
</script>

<template>
  <button @click="editorRef.expandAll()">Expand all</button>
  <button @click="editorRef.collapseAll()">Collapse all</button>
  <button @click="reset">Reset</button>
  <button @click="logRaw">Log text</button>

  <Vue3Jsoneditor ref="editorRef" v-model="json" current-mode="tree" />
</template>
```

| Method | Description |
| --- | --- |
| `getEditor()` | The raw `JSONEditor` instance, or `null` before mount. |
| `get()` | The current parsed JSON; throws if the text is invalid. |
| `getText()` | The raw editor text. |
| `validate()` | Runs validation; resolves with an array of errors. |
| `expandAll()` | Expand all nodes (`tree`, `view`, `form`). |
| `collapseAll()` | Collapse all nodes (`tree`, `view`, `form`). |
| `setEditorContent(json)` | Replace the editor content. |
| `toggleFullScreen()` | Enter or exit fullscreen. |
| `focus()` | Focus the editor. |

See the [Methods reference](/api/methods) for details.

## Events

```vue
<Vue3Jsoneditor
  v-model="json"
  @change="(value) => console.log('changed', value)"
  @error="(err) => console.warn('invalid JSON', err)"
  @mode-change="(mode, prev) => console.log(prev, '->', mode)"
  @focus="() => console.log('focused')"
  @blur="() => console.log('blurred')"
/>
```

The full list, with payloads, is in the [Events reference](/api/events).

## Language

Set the UI language with `language`. Supported values: `en` (default), `zh-CN`, `pt-BR`, `tr`, `ja`, `fr-FR`, `de`, `ru`, `es`.

```vue
<Vue3Jsoneditor v-model="json" language="de" />
```

## Height

`height` accepts a CSS length string or a number (pixels):

```vue
<Vue3Jsoneditor v-model="json" height="50vh" />
<Vue3Jsoneditor v-model="json" :height="400" />
```

Without `height`, the editor is `400px` tall. That default has zero specificity, so a height you set with your own CSS class always wins.
