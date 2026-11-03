---
title: Methods
description: Methods exposed by v3-jsoneditor through a template ref, including getEditor, expandAll, collapseAll, setEditorContent, toggleFullScreen and focus.
---

# Methods

Methods are exposed on the component instance. Access them with a template ref.

| Method | Signature | Description |
| --- | --- | --- |
| `getEditor` | `() => JSONEditor \| null` | Returns the raw jsoneditor instance, or `null` before the editor is mounted. Use it to call any [jsoneditor method](https://github.com/josdejong/jsoneditor/blob/master/docs/api.md#methods). |
| `get` | `() => any` | Returns the current parsed JSON. Throws if the text is not valid JSON. |
| `getText` | `() => string` | Returns the raw editor text. |
| `validate` | `() => Promise<Array>` | Runs validation (schema and `onValidate`) and resolves with the errors; empty array means valid. |
| `expandAll` | `() => void` | Expands all nodes. Only has an effect in `tree`, `view` and `form` modes. |
| `collapseAll` | `() => void` | Collapses all nodes. Only has an effect in `tree`, `view` and `form` modes. |
| `setEditorContent` | `(json: any) => void` | Replaces the editor content with the given JSON value. |
| `toggleFullScreen` | `() => void` | Enters or exits fullscreen. Emits `update:fullscreen` and `fullscreen-change`. |
| `focus` | `() => void` | Moves keyboard focus into the editor. |

## Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Vue3Jsoneditor from 'v3-jsoneditor'

const json = ref({ a: { b: { c: 1 } } })
const editorRef = ref(null)

onMounted(() => {
  // getEditor() may be null until jsoneditor has loaded on the client
  console.log(editorRef.value.getEditor())
})

function search() {
  editorRef.value.getEditor()?.search('c')
}
</script>

<template>
  <button @click="editorRef.expandAll()">Expand</button>
  <button @click="editorRef.collapseAll()">Collapse</button>
  <button @click="editorRef.focus()">Focus</button>
  <button @click="editorRef.toggleFullScreen()">Fullscreen</button>
  <button @click="search">Search "c"</button>

  <Vue3Jsoneditor ref="editorRef" v-model="json" current-mode="tree" height="300px" />
</template>
```

## Useful raw jsoneditor methods

Through `getEditor()` you can use the full jsoneditor API, for example:

| Method | Description |
| --- | --- |
| `setText(text)` | Set the raw text. Prefer `v-model:text`. |
| `setMode(mode)` / `getMode()` | Change or read the mode. Prefer `v-model:currentMode`. |
| `setSchema(schema)` | Set a JSON Schema. Prefer `options.schema`, which is reactive. |
| `search(text)` | Search in `tree` mode. |
| `format()` / `compact()` / `repair()` | Format, compact or repair text in `code`/`text` mode. |

::: warning
Avoid calling `getEditor().destroy()` or `getEditor().set()` directly. The component manages the editor lifecycle and content; use `v-model` or `setEditorContent()` instead so the model stays in sync.
:::

## Related

- [Props](/api/props)
- [Events](/api/events)
